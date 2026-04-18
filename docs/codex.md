# `codex`

## 仓库定位

`codex` 里的 `context / memory` 相关实现主要分成三层：`core` 负责每个 turn 的可见上下文组装，`state` 负责 thread / memory 的 SQLite 持久状态，`core/memories` 负责 stage1 / phase2 memory 启动管线与文件系统同步。

## 源码架构树

```text
codex
├─ codex-rs/core/src/codex.rs
│  ├─ build_initial_context()
│  ├─ record_context_updates_and_set_reference_context_item()
│  └─ run_turn()
├─ codex-rs/core/src/context_manager/
│  ├─ history.rs
│  ├─ normalize.rs
│  └─ updates.rs
├─ codex-rs/core/src/memories/
│  ├─ start.rs
│  ├─ phase1.rs
│  ├─ phase2.rs
│  ├─ storage.rs
│  └─ prompts.rs
├─ codex-rs/state/src/runtime/
│  ├─ threads.rs
│  └─ memories.rs
└─ codex-rs/core/src/message_history.rs
```

## 关键结论摘要

- `ContextManager` 保存的不是原始聊天记录，而是一个会规范化、截断、回滚修剪的 turn 历史容器。
- turn 级 context 是“首次全量注入，之后按基线做增量更新”，基线由 `reference_context_item` 决定。
- `memory` 不是单一长期库，而是 startup 时跑起来的 phase1 / phase2 管线：先抽取 stage1 输出，再做全局 consolidation，并同步到 `codex_home/memories/`。
- `state` 与 `history` 是分层的：SQLite 负责 thread / job / stage1 outputs 等结构化状态，`history.jsonl` 则是全局 append-only 消息历史。

## 专题文档

- [01-架构与范围](./codex/01-%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%8C%83%E5%9B%B4.md)
- [02-context管理](./codex/02-context%E7%AE%A1%E7%90%86.md)
- [03-memory实现](./codex/03-memory%E5%AE%9E%E7%8E%B0.md)
- [04-存储与状态](./codex/04-%E5%AD%98%E5%82%A8%E4%B8%8E%E7%8A%B6%E6%80%81.md)
- [05-调用链、压缩与边界](./codex/05-%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E5%8E%8B%E7%BC%A9%E4%B8%8E%E8%BE%B9%E7%95%8C.md)

## 关键源码索引

- `codex-rs/core/src/codex.rs:1654-2091`
- `codex-rs/core/src/codex.rs:3744-3991`
- `codex-rs/core/src/codex.rs:6146-6795`
- `codex-rs/core/src/context_manager/history.rs:34-452`
- `codex-rs/core/src/context_manager/updates.rs:14-224`
- `codex-rs/core/src/memories/mod.rs:3-120`
- `codex-rs/core/src/memories/phase1.rs:81-211`
- `codex-rs/core/src/memories/phase2.rs:41-160`
- `codex-rs/state/src/runtime.rs:91-216`
- `codex-rs/state/src/runtime/memories.rs:32-544`

## 阅读提示

先读 `02-context管理`，再读 `03-memory实现`。`codex` 最容易混淆的不是“有没有 memory”，而是 turn context、thread history、memory pipeline 和 SQLite state 其实是四个不同层次。
