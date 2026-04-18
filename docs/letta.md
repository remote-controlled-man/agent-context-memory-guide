# `letta`

## 仓库定位

`letta` 是平台型 agent 系统。和本任务相关的主线至少有四层：`AgentState.memory/blocks` 的核心记忆、`MessageManager + ConversationManager` 的会话上下文、`ArchiveManager + PassageManager` 的长期检索记忆，以及可选的 git-backed memory。

## 源码架构树

```text
letta
├─ schemas/
│  ├─ agent.py
│  ├─ memory.py
│  ├─ message.py
│  ├─ conversation.py
│  └─ passage.py
├─ prompts/prompt_generator.py
├─ services/
│  ├─ context_window_calculator/
│  ├─ message_manager.py
│  ├─ conversation_manager.py
│  ├─ archive_manager.py
│  ├─ passage_manager.py
│  ├─ block_manager.py
│  └─ block_manager_git.py
├─ services/memory_repo/*
└─ server/server.py
```

## 关键结论摘要

- `letta` 的 system prompt 是 `Memory.compile()` 与 `PromptGenerator` 共同生成，再由 `ContextWindowCalculator` 做 token 级拆解和统计。
- 会话上下文的真实顺序由 `conversation_messages` 关系表维护，conversation 创建或分叉时会重建并持久化 system message。
- 长期记忆由 `Archive` + `Passage` 实现；这条路径与 core blocks memory 并行存在。
- 在配置允许时，`BlockManager` 会切换成 `GitEnabledBlockManager`，把 memory 写到 memfs/git repo，再同步 Postgres cache。

## 专题文档

- [01-架构与范围](./letta/01-%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%8C%83%E5%9B%B4.md)
- [02-context管理](./letta/02-context%E7%AE%A1%E7%90%86.md)
- [03-memory实现](./letta/03-memory%E5%AE%9E%E7%8E%B0.md)
- [04-存储与状态](./letta/04-%E5%AD%98%E5%82%A8%E4%B8%8E%E7%8A%B6%E6%80%81.md)
- [05-调用链、压缩与边界](./letta/05-%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E5%8E%8B%E7%BC%A9%E4%B8%8E%E8%BE%B9%E7%95%8C.md)

## 关键源码索引

- `letta/schemas/agent.py:67-206`
- `letta/schemas/memory.py:68-688`
- `letta/prompts/prompt_generator.py:22-181`
- `letta/services/context_window_calculator/context_window_calculator.py:167-249`
- `letta/services/conversation_manager.py:222-320`
- `letta/services/message_manager.py:122-1262`
- `letta/services/block_manager_git.py:30-485`
- `letta/services/passage_manager.py:543-640`
- `letta/services/archive_manager.py:502-542`
- `letta/server/server.py:426-446`

## 阅读提示

先看 `02-context管理`，再看 `03-memory实现`。`letta` 里最容易混淆的是 core blocks memory、archive/passage 和记忆仓库 git 路径，它们是并行层，不是同一个对象的三种叫法。
