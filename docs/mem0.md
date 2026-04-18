# `mem0`

## 仓库定位

`mem0` 的核心是 Python OSS 实现里的 `Memory / AsyncMemory`。它不是完整 thread runtime，而是围绕“抽取式长期记忆”组织的能力层：用最近消息窗口和已有 memories 构造抽取上下文，再把结果落到向量库、SQLite history/messages 和 entity store。

## 源码架构树

```text
mem0
├─ mem0/memory/main.py
│  ├─ Memory / AsyncMemory
│  ├─ add/search/update/delete/history/reset
│  └─ procedural memory
├─ mem0/memory/storage.py
├─ mem0/memory/utils.py
├─ mem0/configs/prompts.py
├─ mem0/configs/base.py
└─ mem0/utils/factory.py
```

## 关键结论摘要

- `context` 管理的重点不是长对话缓存，而是“为抽取 memory 准备的上下文窗口”：最近 10 条消息 + 最近 10 条已有 memories。
- memory 持久化至少分三层：向量库存 memory 本体、SQLite 存 `history/messages`、entity store 存实体到 memory 的链接。
- 没有统一的对话 compaction 主线；只有 procedural memory 会显式走总结式生成。
- `Memory` 与 `AsyncMemory` 的算法基本一致，差别主要是异步包装，而不是两套不同设计。

## 专题文档

- [01-架构与范围](./mem0/01-%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%8C%83%E5%9B%B4.md)
- [02-context管理](./mem0/02-context%E7%AE%A1%E7%90%86.md)
- [03-memory实现](./mem0/03-memory%E5%AE%9E%E7%8E%B0.md)
- [04-存储与状态](./mem0/04-%E5%AD%98%E5%82%A8%E4%B8%8E%E7%8A%B6%E6%80%81.md)
- [05-调用链、压缩与边界](./mem0/05-%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E5%8E%8B%E7%BC%A9%E4%B8%8E%E8%BE%B9%E7%95%8C.md)

## 关键源码索引

- `mem0/memory/main.py:268-1687`
- `mem0/memory/storage.py:11-257`
- `mem0/memory/utils.py:61-170`
- `mem0/configs/prompts.py:947-1016`
- `mem0/configs/base.py:13-13`
- `mem0/utils/factory.py:30-30`

## 阅读提示

阅读时要先把“抽取时上下文窗口”与“memory 本体存储”分开；否则很容易把 SQLite `messages/history` 误看成长久 memory 本身。
