# `claude code`：context 管理

## 1. System / User Context 的组装与缓存

`getSystemContext()` 与 `getUserContext()` 都是 session 级 memoize。前者主要负责系统上下文，例如 git 状态和可选 cache-breaker；后者负责用户侧上下文，包括 `CLAUDE.md` 系列文件、memory files 和日期信息。

`setSystemPromptInjection()` 会主动失效系统上下文缓存，而压缩链路也会清 `getUserContext()` 的缓存，保证 compact 后的上下文不会继续沿用旧注入结果。

### 源码锚点

- `context.ts:29-29`
- `context.ts:116-155`
- `context.ts:155-155`

## 2. Memory 作为动态系统提示片段注入

`constants/prompts.ts` 里的 `loadMemoryPrompt()` 才是 memory 进入系统提示的真正入口。这里的 memory 不是固定常量，而是每轮可重算的动态 prompt section，因此它和 session 级缓存边界一起决定“什么时候重建模型可见上下文”。

### 源码锚点

- `constants/prompts.ts:476-495`

## 3. `/context` 展示的是 API 视图

`/context` 命令不是直接打印 UI 历史。它会先通过 `getMessagesAfterCompactBoundary()` 截掉 compact boundary 之前的消息，再做 `projectView` 与 `microcompactMessages()` 转换，最后由 `analyzeContextUsage()` 重新统计 system prompt、memory files、messages 和 token 使用量。

因此 `/context` 的意义是“当前这轮真正送给模型的上下文长什么样”，而不是“界面上显示了什么”。

### 源码锚点

- `commands/context/context.tsx:18-18`
- `utils/messages.ts:4608-4643`
- `utils/analyzeContext.ts:320-320`
- `utils/analyzeContext.ts:918-964`

## 4. `/context` 里的 memory 统计来源

`analyzeContextUsage()` 会重新调用 `getSystemContext()` 和 `getMemoryFiles()`，再把 `memoryFiles` 单独拆成 token 统计项。也就是说，`/context` 里的 memory 视图来自重新计算，不是从 UI 层臆断或复述。

### 源码锚点

- `utils/analyzeContext.ts:272-320`
- `utils/analyzeContext.ts:918-964`
