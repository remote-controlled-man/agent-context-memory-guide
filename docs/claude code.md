# `claude code`

## 仓库定位

`claude code` 不是单一 memory 模块，而是把 `context`、跨会话文件型 memory、单会话摘要 memory、transcript/history、压缩链路组合在一起的终端型 agent runtime。本组文档只基于源码，不复述项目说明。

## 源码架构树

```text
claude code
├─ context.ts
│  ├─ getSystemContext()
│  └─ getUserContext()
├─ constants/prompts.ts
│  └─ loadMemoryPrompt() 动态系统提示片段
├─ memdir/
│  ├─ paths.ts
│  ├─ memdir.ts
│  └─ teamMemPaths.ts
├─ utils/claudemd.ts
│  └─ memory 文件发现、去重、include、过滤
├─ services/SessionMemory/
│  ├─ sessionMemory.ts
│  └─ prompts.ts
├─ commands/compact/
├─ utils/sessionStorage.ts
└─ history.ts / assistant/sessionHistory.ts
```

## 关键结论摘要

- 本仓库至少有三条不同但相关的链路：`context` 组装、`memdir/claudemd` 文件型 memory、`SessionMemory` 单会话摘要；三者不能混成一套“memory 系统”。
- `getSystemContext()` 与 `getUserContext()` 都是 session 级缓存；`/compact` 会清用户上下文缓存，迫使压缩后重新组装可见上下文。
- `memdir` 的长期记忆落在 `~/.claude/projects/<repo>/memory/` 一类路径下，而 `SessionMemory` 则固定落在当前 session 目录里的 `session-memory/summary.md`。
- `/context` 展示的不是 UI 原始消息，而是经过 compact boundary 裁剪、API 映射和 memory 注入后“模型实际看到的上下文视图”。

## 专题文档

- [01-架构与范围](./claude%20code/01-%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%8C%83%E5%9B%B4.md)
- [02-context管理](./claude%20code/02-context%E7%AE%A1%E7%90%86.md)
- [03-memory实现](./claude%20code/03-memory%E5%AE%9E%E7%8E%B0.md)
- [04-存储与状态](./claude%20code/04-%E5%AD%98%E5%82%A8%E4%B8%8E%E7%8A%B6%E6%80%81.md)
- [05-调用链、压缩与边界](./claude%20code/05-%E8%B0%83%E7%94%A8%E9%93%BE%E3%80%81%E5%8E%8B%E7%BC%A9%E4%B8%8E%E8%BE%B9%E7%95%8C.md)

## 关键源码索引

- `context.ts:29-155`
- `constants/prompts.ts:476-495`
- `utils/claudemd.ts:229-1153`
- `memdir/memdir.ts:199-419`
- `memdir/paths.ts:223-257`
- `services/SessionMemory/sessionMemory.ts:183-387`
- `services/SessionMemory/prompts.ts:86-256`
- `commands/compact/compact.ts:46-117`
- `utils/sessionStorage.ts:202-202`
- `history.ts:114-114`

## 阅读提示

先看 `02-context管理`，再读 `03-memory实现`。如果先从 `history.ts` 开始，很容易把命令历史误当成对话 memory。
