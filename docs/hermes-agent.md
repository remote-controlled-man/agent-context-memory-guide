# `hermes-agent`

## 仓库定位

`hermes-agent` 是完整 agent runtime，不是单一 memory 库。和 `context / memory` 最相关的主干至少有三条：system prompt 组装、session transcript 持久化、长时 memory provider。它们在 `run_agent.py` 里汇合，但实现边界彼此独立。

## 源码架构树

```text
hermes-agent
├─ run_agent.py
├─ agent/
│  ├─ prompt_builder.py
│  ├─ context_engine.py
│  ├─ context_compressor.py
│  └─ memory_manager.py
├─ tools/
│  ├─ memory_tool.py
│  └─ session_search_tool.py
├─ hermes_state.py
├─ gateway/
│  ├─ session.py
│  └─ mirror.py
└─ plugins/memory/*
```

## 关键结论摘要

- 这套实现的 memory 不是单层结构，而是 `prompt_builder`、内建 `MEMORY.md/USER.md`、`session_search`、外部 provider 插件四条并行路径。
- context 管理的中心能力是 `ContextCompressor`，它不只摘要消息，还会先瘦身旧 tool 输出，再做摘要替换和 tool call / result 对齐修复。
- `session_search` 读的是 `state.db` 里的 session transcript 历史，不是 provider 长期 memory 本体。
- 内建 memory 是本地文件型，外部 provider 通过 `MemoryManager` 统一注册、prefetch、sync、tool 路由和生命周期。

## 专题文档

- [01-架构与范围](./hermes-agent/01-%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%8C%83%E5%9B%B4.md)
- [02-context管理](./hermes-agent/02-context%E7%AE%A1%E7%90%86.md)
- [03-memory实现](./hermes-agent/03-memory%E5%AE%9E%E7%8E%B0.md)
- [04-存储与状态](./hermes-agent/04-%E5%AD%98%E5%82%A8%E4%B8%8E%E7%8A%B6%E6%80%81.md)
- [05-调用链、压缩与边界](./hermes-agent/05-%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E5%8E%8B%E7%BC%A9%E4%B8%8E%E8%BE%B9%E7%95%8C.md)

## 关键源码索引

- `run_agent.py:1219-1320`
- `run_agent.py:3349-3476`
- `run_agent.py:7040-7386`
- `run_agent.py:8237-8595`
- `agent/prompt_builder.py:144-173`
- `agent/prompt_builder.py:893-1006`
- `agent/context_compressor.py:188-1094`
- `agent/memory_manager.py:57-356`
- `tools/memory_tool.py:105-571`
- `tools/session_search_tool.py:245-560`
- `hermes_state.py:115-1199`

## 阅读提示

先看 `02-context管理`，再看 `03-memory实现`。这个仓库里最容易犯的错误，是把 `session_search`、内建文件 memory 和 provider memory 混成一条链。
