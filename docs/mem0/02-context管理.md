# `mem0`：context 管理

## 1. `session_scope`

`add()` 要求至少提供 `user_id`、`agent_id`、`run_id` 之一，再把这些字段与 metadata 组合成稳定的 `session_scope` 字符串。SQLite 的消息窗口就是按这个 scope 隔离的。

### 源码锚点

- `mem0/memory/main.py:254-254`
- `mem0/memory/main.py:424-424`

## 2. 最近消息窗口

当前写入链路只保存每个 `session_scope` 最近 10 条消息。`save_messages()` 写入后会裁剪旧记录，`get_last_messages()` 则按时间顺序返回最近 N 条。

### 源码锚点

- `mem0/memory/storage.py:257-257`

## 3. 上下文预处理

`parse_messages()` 会把消息扁平化成统一文本；视觉消息则先经过 `parse_vision_messages()` 转成文本描述，再进入抽取流程。

### 源码锚点

- `mem0/memory/utils.py:61-170`

## 4. 抽取 prompt

`generate_additive_extraction_prompt()` 支持把 `Summary`、`Last k Messages`、`Recently Extracted Memories`、`Existing Memories`、`New Messages` 等信息拼进 prompt。但当前 `add()` 主路径实际只传了 `existing_memories`、`last_k_messages` 和 `custom_instructions`。

### 源码锚点

- `mem0/configs/prompts.py:947-1016`
- `mem0/memory/main.py:513-618`

## 5. agent-scoped context 后缀

`AGENT_CONTEXT_SUFFIX` 只在存在 `agent_id` 且不存在 `user_id` 时追加，说明 `mem0` 对“agent 级上下文”有单独 prompt 分支。

### 源码锚点

- `mem0/memory/main.py:575-575`
- `mem0/configs/prompts.py:947-947`
