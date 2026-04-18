# Agent Context & Memory Guide

一个面向普通读者的学习仓库，用来拆解主流 agent 项目的 `context` 和 `memory` 管理方式。

这个仓库包含两部分内容：

- `docs/`：基于源码整理的中文分析文档，覆盖 6 个 agent / memory 项目
- `sites/agent-memory-learn/`：可部署到 GitHub Pages 的纯静态学习网站

## 当前覆盖

- `claude code`
- `codex`
- `hermes-agent`
- `langmem`
- `letta`
- `mem0`

## 仓库结构

```text
.
|-- docs/                         # 源码分析文档与横向对照
|-- sites/
|   `-- agent-memory-learn/       # 新的静态学习站
|-- .github/workflows/
|   `-- agent-memory-learn-pages.yml
`-- README.md
```

## 本地查看网站

构建：

```powershell
Set-Location sites/agent-memory-learn
node scripts/build.mjs
```

构建完成后，打开 `sites/agent-memory-learn/dist/index.html`，或者用本地静态服务预览：

```powershell
python -m http.server 8000 --directory sites/agent-memory-learn/dist
```

然后访问 `http://localhost:8000/`。

## GitHub Pages

仓库内已经包含 Pages 工作流：

- `.github/workflows/agent-memory-learn-pages.yml`

推送到 `main` 后，在 GitHub 仓库里把 Pages 的发布来源设为 `GitHub Actions` 即可自动发布。

## 说明

- `docs/` 是事实来源，网页内容以这些分析为依据
- `repos/` 和旧站 `sites/agent-memory-guide/` 默认不会进入 Git 仓库
- 第一版重点是“可读、可信、结构清楚”，不追求复杂前端框架
