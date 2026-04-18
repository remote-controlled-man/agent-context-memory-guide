# `codex`：memory 实现

## 1. memory 子系统是 phase1 / phase2 管线

`codex-rs/core/src/memories/mod.rs` 明确把 memory 拆成两阶段：

- `phase1`：从 rollout 里抽取 raw memory / rollout summary，写入 state DB。
- `phase2`：从 state DB 选择输入，做全局 consolidation，并同步到 `codex_home/memories/`。

### 源码锚点

- `codex-rs/core/src/memories/mod.rs:3-120`
- `codex-rs/core/src/memories/start.rs:14-39`

## 2. phase1：候选选择与抽取

phase1 的顺序是源码写死的：claim startup jobs -> build request context -> 并行 extraction -> 记录指标。输出 schema 包含 `rollout_summary`、`rollout_slug` 和 `raw_memory`，并会过滤掉某些不应进入 memory 的 contextual user fragment。

### 源码锚点

- `codex-rs/core/src/memories/phase1.rs:81-158`
- `codex-rs/core/src/memories/phase1.rs:196-211`
- `codex-rs/core/src/contextual_user_message.rs:50-58`

## 3. phase2：全局 consolidation 与文件同步

phase2 会 claim 全局 consolidation job，读取 `get_phase2_input_selection()` 的结果，更新 `rollout_summaries/` 与 `raw_memories.md`，再启动 `MemoryConsolidation` 子 agent 做 consolidation。

代码还明确禁止 consolidation 线程再递归回馈 phase1 或继续 delegate。

### 源码锚点

- `codex-rs/core/src/memories/phase2.rs:41-160`
- `codex-rs/core/src/memories/phase2.rs:287-298`
- `codex-rs/core/src/memories/storage.rs:23-42`
- `codex-rs/core/src/memories/storage.rs:98-171`

## 4. memory tool 的读取入口

`build_memory_tool_developer_instructions()` 只会读取 `codex_home/memories/memory_summary.md`，并截断到固定 token 上限。也就是说，memory tool 的读取入口不是整个 memory 目录，而是摘要文件。

### 源码锚点

- `codex-rs/core/src/memories/prompts.rs:233-249`

## 5. 另一条 memory 输入链：trace -> raw memory

`memory_trace.rs` 支持把 JSON array 或 JSONL trace 文件转成 `RawMemory` 输入，再调用 `summarize_memories()` 生成 `BuiltMemory`。这是独立于 startup 管线的 memory 输入路径。

### 源码锚点

- `codex-rs/core/src/memory_trace.rs:29-79`
- `codex-rs/core/src/memory_trace.rs:100-225`
- `codex-rs/core/src/client.rs:504-547`
