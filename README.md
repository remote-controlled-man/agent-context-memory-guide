# Agent Context & Memory Guide

一个面向普通读者的学习仓库，用来拆解不同 Agent 项目里 `context` 和 `memory` 是怎么工作的。

这个仓库不是新的 Agent 框架，也不是 SDK。它更像一套可阅读、可对照、可继续深挖的学习资料：

- 用中文把 6 个项目讲清楚
- 先讲人话，再讲实现
- 重要结论尽量回到源码位置
- 最后再把这些项目放在一起比较，帮助读者理解“如果自己做一个 Agent，该怎么设计 context 和 memory”

## 这个仓库适合谁

- 想看懂 Agent 怎么“记住东西”和“带着什么上下文思考”的人
- 没有计算机背景，但想先建立整体理解的人
- 已经在做 Agent，希望参考不同项目实现方式的人

## 仓库里有什么

### 1. `docs/`

按项目拆开的中文分析文档，来自源码阅读而不是宣传材料。

当前覆盖：

- `claude code`
- `codex`
- `hermes-agent`
- `langmem`
- `letta`
- `mem0`

这些文档重点分析：

- 一轮请求里，模型真正能看到哪些内容
- `context` 是怎么组装出来的
- `memory` 在哪里形成、存下、被检索、再放回上下文
- 哪些机制属于短期历史，哪些才算长期记忆
- 摘要、压缩、召回、状态管理是怎么接起来的

### 2. `sites/agent-memory-learn/`

一个可以部署到 GitHub Pages 的纯静态学习网站。

网站不是把 Markdown 直接铺上去，而是把内容重新组织成更适合普通读者的结构：

- 首页导览
- 术语解释
- 横向对照
- 共同规律
- 如何自己设计 Agent 的 context / memory 框架
- 6 个项目各自的学习页

## 阅读入口

如果你第一次看，建议按这个顺序：

1. 先看网站首页和术语页，建立基本概念
2. 再看横向对照和共同规律，理解不同项目的共性
3. 然后选一个项目进入单页学习
4. 最后回到 `docs/` 看详细证据和源码锚点

## 仓库结构

```text
.
|-- docs/                                # 基于源码整理的分析文档
|-- sites/
|   |-- agent-memory-guide/              # 旧站，默认不纳入当前公开仓库
|   `-- agent-memory-learn/              # 新的纯静态学习站
|-- .github/
|   `-- workflows/
|       `-- agent-memory-learn-pages.yml # GitHub Pages 发布工作流
`-- README.md
```

## 本地查看网站

构建静态站：

```powershell
Set-Location sites/agent-memory-learn
node scripts/build.mjs
```

构建完成后，可以直接打开：

- `sites/agent-memory-learn/dist/index.html`

或者启动一个本地静态服务：

```powershell
python -m http.server 8000 --directory sites/agent-memory-learn/dist
```

然后访问：

- `http://localhost:8000/`

## GitHub Pages 发布

仓库内已经包含 Pages 工作流：

- `.github/workflows/agent-memory-learn-pages.yml`

当 `main` 分支有这些路径的更新时，GitHub Actions 会自动构建并发布网站：

- `docs/**`
- `sites/agent-memory-learn/**`
- `.github/workflows/agent-memory-learn-pages.yml`

如果你的仓库已经把 Pages 来源切到 `GitHub Actions`，那么工作流成功后，站点通常会发布到：

- `https://remote-controlled-man.github.io/agent-context-memory-guide/`

## 方法说明

这个仓库里有两层内容，请不要混看：

- `源码事实`：来自源码、配置、测试、迁移文件和实际运行路径
- `归纳与建议`：基于多个项目对比之后，总结出的共性和设计建议

也就是说：

- 文档里的“这个项目怎么做”尽量回到源码
- 网站里的“如果你自己做该怎么设计”属于归纳总结，不是假装成源码原话

## 当前取舍

第一版优先保证三件事：

- 可读
- 可追溯
- 可部署

所以这里没有上复杂前端框架，也没有做搜索、评论或重交互演示。
