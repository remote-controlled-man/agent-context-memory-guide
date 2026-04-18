# `letta`：context 管理

## 1. `AgentState` 与结构化上下文

`AgentState` 同时携带 `message_ids`、`system`、`memory`、`blocks`、`sources`、`tools`、`compaction_settings` 等字段，说明 `letta` 的上下文不是单一字符串，而是结构化状态对象。

### 源码锚点

- `letta/schemas/agent.py:67-206`

## 2. `Memory.compile()`

`Memory.compile()` 是核心渲染点：

- 普通模式输出 `<memory_blocks>`
- line-numbered 模式给特定 agent/model 加行号
- git 模式把 `system/persona` 渲染为 `<self>`，其他系统文件渲染成 `<memory>` 树
- skills 会渲染成 `<available_skills>` 树

### 源码锚点

- `letta/schemas/memory.py:68-351`
- `letta/schemas/memory.py:351-688`

## 3. `PromptGenerator`

`PromptGenerator.compile_memory_metadata_block()` 会注入 `AGENT_ID`、`CONVERSATION_ID`、system prompt 重编译时间、previous message count、archival memory size；`compile_system_message_async()` 再把 `Memory.compile(...)` 的结果与 metadata 拼进 `{CORE_MEMORY}`。

### 源码锚点

- `letta/prompts/prompt_generator.py:26-181`

## 4. conversation 级 system prompt

`ConversationManager.compile_and_save_system_message_for_conversation()` 会在 conversation 创建或分叉时重建 system message，并作为 message 0 持久化，再把 message id 写进 `conversation_messages`。

### 源码锚点

- `letta/services/conversation_manager.py:222-320`
- `letta/services/conversation_manager.py:613-713`

## 5. `ContextWindowCalculator` 与摘要器

`ContextWindowCalculator` 会拆解 system prompt 的不同组成部分，并分别计算 token 数；`Summarizer` 则负责静态缓冲裁剪和部分驱逐时的递归摘要。

### 源码锚点

- `letta/services/context_window_calculator/context_window_calculator.py:167-249`
- `letta/services/summarizer/summarizer.py:36-488`
