# `langmem`：memory 实现

## 1. `MemoryManager`

长期 memory 的最小抽取单元是 `MemoryManager`。它先把消息包装成 conversation 文本，再交给 extractor 按 schema 做抽取、更新、删除；`existing` 提供已有 memories 上下文，`Done` 允许多步收敛，`RemoveDoc` 表达删除语义。

### 源码锚点

- `src/langmem/knowledge/extraction.py:217-534`

## 2. `create_memory_searcher()`

搜索链路是“先生成 query，再搜 memory”。它通过 prompt + tools 生成 `search_memory` 请求，取回 artifact 后按分数排序；没有单独 query model 时，`MemoryStoreManager` 还会退化为对最近 dilated windows 直接搜索。

### 源码锚点

- `src/langmem/knowledge/extraction.py:695-815`
- `src/langmem/knowledge/extraction.py:1012-1048`

## 3. `MemoryStoreManager`

`MemoryStoreManager` 才是带存储的主链路：先解析 namespace，再从 store 中找候选 memories，然后调用 `MemoryManager` 做增删改整理，最后把 `final_puts / final_deletes` 写回 store。

关键实现点包括：

- `_stable_id`：用 `uuid5(namespace,key)` 稳定映射 memory
- `default_factory`：无结果时初始化默认 memory
- `MemoryPhase`：允许额外整理阶段
- `enable_inserts / enable_deletes`：控制模型能否新增或删除

### 源码锚点

- `src/langmem/knowledge/extraction.py:832-1280`

## 4. agent 工具层

`create_manage_memory_tool` 与 `create_search_memory_tool` 是给上层 agent 调用的工具包装。两者都依赖 `NamespaceTemplate` 注入 namespace，而不是写死到某个固定目录。

### 源码锚点

- `src/langmem/knowledge/tools.py:25-355`
- `src/langmem/knowledge/tools.py:362-515`
