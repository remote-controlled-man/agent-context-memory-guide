# `codex`：context 管理

## 1. `ContextManager` 是 turn 历史容器

`ContextManager` 保存 `ResponseItem` 历史、`reference_context_item` 基线和 token 信息。写入时只接受 API message 类 item，过滤掉非 API message 与 `GhostSnapshot`；用于 prompt 时再统一做 normalize，保证 tool call / output 成对，删除 orphan output，并在不支持图片的模型上剥离 image 内容。

### 源码锚点

- `codex-rs/core/src/context_manager/history.rs:34-120`
- `codex-rs/core/src/context_manager/history.rs:360-452`
- `codex-rs/core/src/context_manager/normalize.rs:14-197`

## 2. 全量与增量 context 的分界

turn 级 context 的关键分界是 `reference_context_item`：

- 没有基线时，`record_context_updates_and_set_reference_context_item()` 走 `build_initial_context()`，做全量注入。
- 有基线时，只走 `build_settings_update_items()`，发送环境、权限、协作模式、personality、model 指令等差异项。

### 源码锚点

- `codex-rs/core/src/codex.rs:3961-3991`
- `codex-rs/core/src/codex.rs:3744-3917`
- `codex-rs/core/src/context_manager/updates.rs:196-224`

## 3. `build_initial_context()` 注入什么

源码里明确列出了全量上下文的组成：

- 模型切换说明
- 权限说明
- session 级 developer instructions
- memory tool developer prompt
- collaboration mode
- realtime 说明
- personality
- apps / skills / plugins
- git commit trailer
- user instructions
- environment context

这套注入结构说明 `codex` 的 context 是可枚举的 runtime 产物，不是单个静态 system prompt。

### 源码锚点

- `codex-rs/core/src/codex.rs:3744-3917`
- `codex-rs/core/src/context_manager/updates.rs:14-224`

## 4. compact 与 window generation

历史被 compact 或 rollback 后，`ContextManager` 会被重写，必要时连 `reference_context_item` 一起清空。`ModelClient` 还维护 `window_generation`，并把 `conversation_id:window_generation` 作为 `x-codex-window-id` 发给模型侧。

这意味着 compact 不是单纯删消息，而是重建“上下文窗口的身份”。

### 源码锚点

- `codex-rs/core/src/codex.rs:3685-3709`
- `codex-rs/core/src/context_manager/history.rs:428-452`
- `codex-rs/core/src/client.rs:148-165`
- `codex-rs/core/src/client.rs:350-365`

## 5. realtime 启动上下文是另一条路径

`realtime_context.rs` 会从当前 thread 历史、最近 threads 和 workspace tree 生成 startup context，并明确排除 memory summaries 与 AGENTS 聚合内容。这条路径与普通 turn context 相关，但不等同。

### 源码锚点

- `codex-rs/core/src/realtime_context.rs:25-107`
