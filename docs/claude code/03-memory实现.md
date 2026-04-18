# `claude code`：memory 实现

## 1. 跨会话文件型 memory：`memdir` + `claudemd`

长期 memory 的目录解析集中在 `memdir/paths.ts`。默认路径基于 `~/.claude/projects/<sanitized-git-root>/memory/`，并支持环境变量覆盖。`getAutoMemEntrypoint()` 指向 `MEMORY.md`，`getAutoMemDailyLogPath()` 指向按日期分层的 daily log。

`memdir/memdir.ts` 决定这些文件怎样进入 prompt：既可以读 `MEMORY.md`，也可以切换到 append-only daily log，还能组合 team memory。

### 源码锚点

- `memdir/paths.ts:223-257`
- `memdir/teamMemPaths.ts:73-73`
- `memdir/memdir.ts:199-419`

## 2. 哪些文件会被当成 memory

真正负责收集 memory 文件的是 `utils/claudemd.ts`。它按 `Managed -> User -> Project -> Local -> AutoMem -> TeamMem` 的顺序收集，支持 `@include`、frontmatter `paths`、去重和外部 include 约束。

`filterInjectedMemoryFiles()` 还会在特定实验开关下，把 `AutoMem` 或 `TeamMem` 从“注入到系统 prompt 的集合”中剔除。这说明“文件存在”与“本轮被注入”是两个不同概念。

### 源码锚点

- `utils/claudemd.ts:229-790`
- `utils/claudemd.ts:1142-1153`

## 3. 单会话摘要 memory：`SessionMemory`

`SessionMemory` 是独立的第二条 memory 路径。它把当前 session 的结构化摘要写到 `{projectDir}/{sessionId}/session-memory/summary.md`，由后台抽取器在 token / 工具调用阈值满足时更新，也支持手动触发。

它不是跨会话长期记忆，而是当前 session 的结构化摘要视图。

### 源码锚点

- `utils/permissions/filesystem.ts:261-261`
- `services/SessionMemory/sessionMemory.ts:272-387`

## 4. `summary.md` 的模板与约束

`services/SessionMemory/prompts.ts` 为 `summary.md` 定义了固定模板、更新 prompt、超长 section 警告和 compact 时的截断逻辑。这里的输出是带结构的摘要，不是自由文本日志。

### 源码锚点

- `services/SessionMemory/prompts.ts:86-256`
- `services/compact/sessionMemoryCompact.ts:1-1`
