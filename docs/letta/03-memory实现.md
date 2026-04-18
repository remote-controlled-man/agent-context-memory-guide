# `letta`：memory 实现

## 1. core blocks memory

核心记忆载体是 `Block` / `Memory`。`Block` 具有 `label/value/limit/read_only/description/metadata` 等字段，`BasicBlockMemory` 默认持有 `human` 与 `persona` 两个块。

### 源码锚点

- `letta/schemas/block.py:1-134`
- `letta/schemas/memory.py:68-143`

## 2. git-backed memory

git-backed memory 使用 Markdown + YAML frontmatter 表示 block。`serialize_block()` 会写入 `description/read_only/metadata`，`parse_block_markdown()` 再反向解析；本地 memfs 默认目录在 `~/.letta/memfs`，repo 路径为 `{org_id}/{agent_id}/repo.git`。

### 源码锚点

- `letta/services/memory_repo/block_markdown.py:1-153`
- `letta/services/memory_repo/memfs_client_base.py:36-208`
- `letta/services/memory_repo/path_mapping.py:1-31`

## 3. `GitEnabledBlockManager`

`GitEnabledBlockManager` 的策略是 git 为 source of truth、Postgres 为 cache。create/update/delete 先写 memfs，再同步到 Postgres；启用或关闭 git memory 时，还会做 backfill 或回退。

### 源码锚点

- `letta/services/block_manager_git.py:30-485`

## 4. archive / passage 长期记忆

长期记忆由 `Archive` + `Passage` 实现。`PassageManager.insert_passage()` 会先取或创建默认 archive，再生成 embedding、写 SQL，并在特定 archive 配置下做额外 dual-write。`AgentManager.search_agent_archival_memory_async()` 是统一检索入口。

### 源码锚点

- `letta/services/passage_manager.py:543-640`
- `letta/services/archive_manager.py:502-542`
- `letta/services/agent_manager.py:2534-2620`
