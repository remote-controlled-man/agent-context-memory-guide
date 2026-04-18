# `langmem`

## 仓库定位

`langmem` 更像一套 `LangGraph / BaseStore` 上的 memory/context 工具库，而不是单个完整 agent。它把短期摘要、长期 memory 抽取与搜索、后台反射、namespace 隔离拆成独立模块。

## 源码架构树

```text
langmem
├─ short_term/summarization.py
│  ├─ RunningSummary
│  ├─ summarize_messages()
│  └─ SummarizationNode
├─ knowledge/extraction.py
│  ├─ MemoryManager
│  ├─ create_memory_searcher()
│  └─ MemoryStoreManager
├─ knowledge/tools.py
├─ reflection.py
├─ utils.py
├─ graphs/auth.py
└─ langgraph.json
```

## 关键结论摘要

- `langmem` 的 `context` 主线是短期摘要节点，把旧消息压成 `running_summary`，而不是维护一个完整 agent transcript runtime。
- 长期 memory 的核心是 `MemoryManager` 与 `MemoryStoreManager`，它们围绕 `BaseStore` 做抽取、搜索、增删改和写回。
- `namespace` 不是硬编码目录，而是从 `RunnableConfig["configurable"]` 动态解析出来。
- 后台反射由 `ReflectionExecutor` 管理，可以本地延迟执行，也可以远端触发 LangGraph run。

## 专题文档

- [01-架构与范围](./langmem/01-%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%8C%83%E5%9B%B4.md)
- [02-context管理](./langmem/02-context%E7%AE%A1%E7%90%86.md)
- [03-memory实现](./langmem/03-memory%E5%AE%9E%E7%8E%B0.md)
- [04-存储与状态](./langmem/04-%E5%AD%98%E5%82%A8%E4%B8%8E%E7%8A%B6%E6%80%81.md)
- [05-调用链、压缩与边界](./langmem/05-%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E5%8E%8B%E7%BC%A9%E4%B8%8E%E8%BE%B9%E7%95%8C.md)

## 关键源码索引

- `src/langmem/short_term/summarization.py:53-860`
- `src/langmem/knowledge/extraction.py:217-2109`
- `src/langmem/knowledge/tools.py:25-515`
- `src/langmem/utils.py:15-213`
- `src/langmem/reflection.py:90-401`
- `src/langmem/graphs/auth.py:13-79`
- `langgraph.json:3-11`

## 阅读提示

先看 `02-context管理`，再看 `03-memory实现`。`langmem` 最容易被误解成“完整 agent 框架”，但它实际上更像给别的 agent/workflow 提供 memory/context 组件。
