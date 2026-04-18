# `mem0`：memory 实现

## 1. 写入主链

memory 写入的主链路是：

`检索旧 memories -> LLM 抽取 -> 批量 embed -> 去重 -> 向量库插入 -> SQLite history 落表 -> entity 链接`

### 源码锚点

- `mem0/memory/main.py:513-513`

## 2. 去重与 payload

去重依赖 `md5(text)`：先和已有 memories 的 hash 比，再和当前 batch 的 `seen_hashes` 比。写入 payload 时会保存 `data`、`hash`、`created_at`、`updated_at`、`text_lemmatized`，并把 `user_id / agent_id / run_id / actor_id / role` 等元数据提升到顶层。

### 源码锚点

- `mem0/memory/main.py:640-640`
- `mem0/memory/main.py:1400-1400`

## 3. 检索

`search()` 不是单一路径，而是混合检索：语义检索 + `keyword_search()` + BM25 + entity boost，再可选 rerank。过滤器支持 `eq/ne/gt/gte/lt/lte/in/nin/contains/icontains`、布尔组合和 wildcard。

### 源码锚点

- `mem0/memory/main.py:959-1152`
- `mem0/memory/main.py:1056-1056`

## 4. entity store 与 procedural memory

`entity_store` 是懒加载的独立 collection，名字为 `<collection_name>_entities`。`procedural_memory` 则是独立分支，用系统 prompt 生成一段总结式 memory，再作为普通 memory 写入。

### 源码锚点

- `mem0/memory/main.py:327-327`
- `mem0/memory/main.py:1432-1432`

## 5. 更新、删除与历史

`history()` 读的是 SQLite 历史表；`add / update / delete` 都会写 history。`update()` 会保留旧 memory 的 `created_at` 和会话标识，`delete()` 会先读旧记录再写历史。

### 源码锚点

- `mem0/memory/storage.py:150-150`
- `mem0/memory/main.py:1315-1552`
