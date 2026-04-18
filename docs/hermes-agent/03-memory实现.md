# `hermes-agent`：memory 实现

## 1. 内建文件型 memory

内建 memory 由 `tools/memory_tool.py` 实现，真实存储是 `HERMES_HOME/memories/MEMORY.md` 和 `HERMES_HOME/memories/USER.md`。`MemoryStore` 会在 session start 时加载并去重，再把当时内容冻结成 system prompt snapshot。

### 源码锚点

- `tools/memory_tool.py:105-198`
- `tools/memory_tool.py:359-451`

## 2. `memory` 工具的写入模型

内建 `memory` 工具只支持 `add / replace / remove`，用短唯一子串定位条目，并在写入前做 injection / exfil 模式扫描。它更像“精选记忆编辑器”，而不是自动海量归档。

### 源码锚点

- `tools/memory_tool.py:222-355`
- `tools/memory_tool.py:463-571`

## 3. `MemoryManager` 与插件体系

`MemoryManager` 负责统一内建 memory 和外部 provider：注册 provider、追加 provider system prompt、prefetch、sync、tool schema 和生命周期钩子。插件发现机制由 `plugins/memory/__init__.py` 统一完成。

### 源码锚点

- `agent/memory_manager.py:57-356`
- `plugins/memory/__init__.py:66-404`

## 4. 代表性 provider

仓库内同时存在多类 provider，例如：

- `supermemory`
- `mem0`
- `honcho`
- `hindsight`
- `retaindb`
- `byterover`
- `openviking`
- `holographic`

它们分别提供不同的 recall、profile、conclude、background sync 语义，因此这里的外部 memory 明显是插件并行模型。

### 源码锚点

- `plugins/memory/supermemory/__init__.py:1-790`
- `plugins/memory/mem0/__init__.py:1-371`
- `plugins/memory/honcho/__init__.py:1-1052`
- `plugins/memory/hindsight/__init__.py:1-881`
- `plugins/memory/retaindb/__init__.py:1-764`
- `plugins/memory/byterover/__init__.py:1-381`
- `plugins/memory/openviking/__init__.py:1-672`
- `plugins/memory/holographic/__init__.py:1-260`
