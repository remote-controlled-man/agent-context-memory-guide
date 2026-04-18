# `hermes-agent`：context 管理

## 1. system prompt 组装

`prompt_builder.py` 负责把身份、memory 指导、session_search 指导、skills、项目上下文文件、环境提示等内容拼进 system prompt；`run_agent.py` 再把这些结果与运行时状态结合起来，形成真正送进模型的 prompt。

### 源码锚点

- `agent/prompt_builder.py:144-173`
- `agent/prompt_builder.py:893-1006`
- `run_agent.py:3349-3476`

## 2. 项目上下文与临时上下文引用

项目上下文文件有明确优先级，例如 `.hermes.md/HERMES.md`、`AGENTS.md`、`CLAUDE.md`、`.cursorrules`。`@file/@folder/@git/@diff/@url` 这类引用会在发送前展开，并受 workspace 边界和 token 预算约束。

### 源码锚点

- `agent/prompt_builder.py:893-1006`
- `agent/context_references.py:41-142`
- `agent/context_references.py:236-342`

## 3. `ContextCompressor`

`ContextCompressor.compress()` 不是只做摘要。它会先对旧 tool 输出做摘要替换，保护头尾消息，再对中段做结构化 summary；失败时会插入静态 fallback，并修复 tool call / result 对齐。

### 源码锚点

- `agent/context_engine.py:32-169`
- `agent/context_compressor.py:336-1094`

## 4. 压缩触发后的上下文重建

`run_agent._compress_context()` 会先 `flush_memories()`，再通知 provider 的 `on_pre_compress()`，然后压缩消息、重建 system prompt、结束旧 session、创建带 `parent_session_id` 的新 session，并把新的 prompt 写回 `state.db`。

### 源码锚点

- `run_agent.py:7040-7263`
- `hermes_state.py:403-412`
