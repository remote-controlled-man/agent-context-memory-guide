# `langmem`：context 管理

## 1. 短期上下文摘要

`summarize_messages()` 会按 token 预算扫描消息，保留 `SystemMessage`，在达到阈值时把前面的消息压成 summary，并把 summary 作为新的 system message 插入返回结果。如果触发点是带 `tool_calls` 的 AI 消息，还会把对应 `ToolMessage` 一并纳入。

### 源码锚点

- `src/langmem/short_term/summarization.py:102-334`
- `tests/short_term/test_summarization.py:208-592`

## 2. `RunningSummary` 与跨轮次状态

`RunningSummary` 保存 `summary`、`summarized_message_ids`、`last_summarized_message_id`。下一轮会跳过已摘要过的消息，避免重复压缩；消息缺少 `id` 时源码直接报错。

### 源码锚点

- `src/langmem/short_term/summarization.py:53-76`
- `src/langmem/short_term/summarization.py:137-199`
- `tests/short_term/test_summarization.py:592-794`

## 3. `SummarizationNode`

`SummarizationNode` 把摘要逻辑包装成 LangGraph 节点，默认从输入 `messages` 读取上下文，把结果写到 `summarized_messages`，并把 `running_summary` 存到 `context`。当输入输出 key 相同时，它会先插入 `RemoveMessage(REMOVE_ALL_MESSAGES)` 来整体替换消息历史。

### 源码锚点

- `src/langmem/short_term/summarization.py:660-860`
- `tests/short_term/test_summarization.py:794-850`

## 4. 运行时上下文的另一个入口：namespace 与 conversation 格式化

`NamespaceTemplate` 从 `RunnableConfig["configurable"]` 动态解析 namespace；`get_conversation()` 把消息转成统一文本；`get_dialated_windows()` 在没有 query model 时提供多尺度最近窗口。

### 源码锚点

- `src/langmem/utils.py:15-123`
