function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBadge(type, label) {
  return `<span class="badge ${type}">${escapeHtml(label)}</span>`;
}

function renderHero({ eyebrow, title, description, badges = [], actions = [], aside }) {
  return `<section class="hero">
    <div class="hero-grid">
      <div>
        <div class="eyebrow">${escapeHtml(eyebrow)}</div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        <div class="badge-row">${badges.join("")}</div>
        <div class="hero-actions">
          ${actions
            .map(
              (action) =>
                `<a class="button ${escapeHtml(action.variant || "secondary")}" href="${action.href}">${escapeHtml(action.label)}</a>`,
            )
            .join("")}
        </div>
      </div>
      <div class="card">${aside}</div>
    </div>
  </section>`;
}

function renderCard(title, body, extra = "") {
  return `<article class="card">
    <h3>${escapeHtml(title)}</h3>
    <p class="muted">${escapeHtml(body)}</p>
    ${extra}
  </article>`;
}

function renderBulletList(items = []) {
  return `<ul class="bullet-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderNumberList(items = []) {
  return `<ol class="number-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function renderSection({ id, kicker, title, description, body }) {
  return `<section class="section panel" id="${escapeHtml(id)}" data-observe-section>
    <div class="section-header">
      <div class="kicker">${escapeHtml(kicker)}</div>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
    ${body}
  </section>`;
}

function renderRepoCard(repo, pathToRoot = "") {
  return `<article class="card repo-card">
    <div class="meta">
      <span class="tag">${escapeHtml(repo.categoryLabel)}</span>
      <span class="tag">${escapeHtml(repo.badgeText)}</span>
    </div>
    <h3>${escapeHtml(repo.name)}</h3>
    <p class="muted">${escapeHtml(repo.plainIntro)}</p>
    <div class="source-actions">
      <a class="button secondary" href="${pathToRoot}repos/${repo.slug}.html">进入学习页</a>
      <a class="button secondary" href="${pathToRoot}sources/${repo.slug}.html">看证据页</a>
    </div>
  </article>`;
}

function renderFlowDiagram(diagram) {
  return `<section class="diagram">
    <h3>${escapeHtml(diagram.title)}</h3>
    <p>${escapeHtml(diagram.description)}</p>
    <div class="flow-row">
      ${diagram.nodes
        .map(
          (node) => `<div class="flow-step">
            <strong>${escapeHtml(node.title)}</strong>
            <div class="muted">${escapeHtml(node.body)}</div>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderLayerDiagram(diagram) {
  return `<section class="diagram">
    <h3>${escapeHtml(diagram.title)}</h3>
    <p>${escapeHtml(diagram.description)}</p>
    <div class="layer-stack">
      ${diagram.layers
        .map(
          (layer) => `<div class="layer-item">
            <strong>${escapeHtml(layer.title)}</strong>
            <div class="muted">${escapeHtml(layer.body)}</div>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderDecisionTree(diagram) {
  return `<section class="diagram">
    <h3>${escapeHtml(diagram.title)}</h3>
    <p>${escapeHtml(diagram.description)}</p>
    <div class="decision-tree">
      ${diagram.nodes
        .map(
          (node) => `<div class="decision-node">
            <strong>${escapeHtml(node.title)}</strong>
            <div class="muted">${escapeHtml(node.body)}</div>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderAnchorList(anchors = [], pathToRoot = "") {
  return `<div class="anchor-list">
    ${anchors
      .map(
        (anchor) => `<a class="anchor-item" href="${pathToRoot}${anchor.href}">
          <div class="anchor-path">${escapeHtml(anchor.path)}:${anchor.start}-${anchor.end}</div>
          <div>${escapeHtml(anchor.note)}</div>
        </a>`,
      )
      .join("")}
  </div>`;
}

function renderSourceCards(items) {
  return `<div class="card-grid">${items
    .map((item) => renderCard(item.title, item.body, item.extra || ""))
    .join("")}</div>`;
}

export function renderHomePage(site, repos) {
  const hero = renderHero({
    eyebrow: "Learning Guide",
    title: "把 6 个 agent 的 memory 和 context 讲清楚",
    description:
      "先用白话看懂全貌，再一路走到具体实现、存储分层、压缩时机和源码证据。整站默认按“普通读者也能读懂”的方式组织。",
    badges: [
      renderBadge("fact", "源码事实"),
      renderBadge("compare", "跨项目归纳"),
      renderBadge("advice", "搭建建议"),
    ],
    actions: [
      { label: "从术语页开始", href: "glossary.html", variant: "primary" },
      { label: "直接看横向对照", href: "compare.html", variant: "secondary" },
      { label: "进入证据页", href: "sources/index.html", variant: "secondary" },
    ],
    aside: `
      <strong>这站怎么读</strong>
      ${renderBulletList([
        "完全没背景：先看术语页，再看共同规律页。",
        "想比较 6 个项目：直接看横向对照页。",
        "想做自己的 agent：看框架选择页和实现蓝图页。",
        "想确认每个结论：每页底部都能回到 docs 证据页。",
      ])}
    `,
  });

  const readingCards = [
    {
      title: "第一条线：先懂概念",
      body: "从 context、history、summary、memory、state 这些词开始，先建立最小心智模型。",
      extra: `<a class="source-link" href="glossary.html">看术语页</a>`,
    },
    {
      title: "第二条线：看共性",
      body: "把 6 个项目放到一起看，理解它们为什么都要分“当前上下文”“短期历史”“长期记忆”。",
      extra: `<a class="source-link" href="patterns.html">看共同规律</a>`,
    },
    {
      title: "第三条线：做自己的系统",
      body: "从场景、记忆需求、存储成本和多 agent 协作四个方向决定你的技术路线。",
      extra: `<a class="source-link" href="frameworks.html">看框架选择</a>`,
    },
  ];

  const categories = site.categories.map((category) =>
    renderCard(category.title, category.description, renderBulletList(category.examples)),
  );

  const repoGrid = `<div class="repo-grid">${repos.map((repo) => renderRepoCard(repo)).join("")}</div>`;

  const content = `
    ${renderSection({
      id: "reading-path",
      kicker: "01",
      title: "推荐阅读路径",
      description: "首页只负责带路，不把源码细节一股脑堆上来。",
      body: renderSourceCards(readingCards),
    })}
    ${renderSection({
      id: "classification",
      kicker: "02",
      title: "先把 6 个项目分类型",
      description: "先分清谁是完整 agent runtime，谁是 memory 能力层，谁又兼具平台和存储模型。",
      body: `<div class="card-grid">${categories.join("")}</div>`,
    })}
    ${renderSection({
      id: "repo-map",
      kicker: "03",
      title: "6 个 repo 学习入口",
      description: "每一页都用同样结构讲：这一轮模型看到了什么、memory 怎么形成、什么时候压缩、最后存到哪里。",
      body: repoGrid,
    })}
  `;

  return { hero, content };
}

export function renderGlossaryPage(site) {
  const hero = renderHero({
    eyebrow: "Glossary",
    title: "先把最容易混的词说成人话",
    description: "这页不是教术语定义，而是让你先分清这些词在 agent 里各自扮演什么角色。",
    badges: [renderBadge("fact", "解释层")],
    actions: [
      { label: "看横向对照", href: "compare.html", variant: "primary" },
      { label: "回首页", href: "index.html", variant: "secondary" },
    ],
    aside: `
      <strong>阅读提醒</strong>
      ${renderBulletList([
        "这里的比喻是为了帮助理解，不是替代原始定义。",
        "如果一个词在某个 repo 里有特殊用法，会在对应学习页里额外说明。",
      ])}
    `,
  });

  const terms = site.glossary
    .map(
      (term) => `<article class="card">
        <h3>${escapeHtml(term.term)}</h3>
        <p><strong>白话说法：</strong>${escapeHtml(term.plain)}</p>
        <p class="muted"><strong>准确一点：</strong>${escapeHtml(term.precise)}</p>
      </article>`,
    )
    .join("");

  return {
    hero,
    content: renderSection({
      id: "terms",
      kicker: "01",
      title: "核心术语",
      description: "先建立一套通用词典，后面读任何一个 repo 都不容易迷路。",
      body: `<div class="card-grid">${terms}</div>`,
    }),
  };
}

export function renderComparePage(site, repos) {
  const hero = renderHero({
    eyebrow: "Compare",
    title: "把 6 个项目放在同一张表里看",
    description: "这一页只回答“谁负责什么”，不重复整篇分析。适合先建立整体差异，再进入单个 repo 深挖。",
    badges: [renderBadge("compare", "跨项目归纳"), renderBadge("fact", "来自 docs/01-横向对照.md")],
    actions: [
      { label: "看共同规律", href: "patterns.html", variant: "primary" },
      { label: "去证据页", href: "sources/global.html", variant: "secondary" },
    ],
    aside: `
      <strong>为什么先看对照</strong>
      ${renderBulletList([
        "你会很快发现：history、summary、memory、storage 不是一个东西。",
        "同样叫 memory，不同项目的落点完全不同。",
      ])}
    `,
  });

  const rows = site.compareDimensions
    .map(
      (dimension) => `<section class="section panel">
        <header class="section-header">
          <div class="kicker">${escapeHtml(dimension.title)}</div>
          <h2>${escapeHtml(dimension.question)}</h2>
          <p>${escapeHtml(dimension.why)}</p>
        </header>
        <div class="compare-table">
          ${repos
            .map((repo) =>
              renderCard(
                repo.name,
                dimension.byRepo[repo.slug],
                `<a class="source-link" href="repos/${repo.slug}.html">进入 ${escapeHtml(repo.name)}</a>`,
              ),
            )
            .join("")}
        </div>
      </section>`,
    )
    .join("");

  return { hero, content: rows };
}

export function renderPatternsPage(site) {
  const hero = renderHero({
    eyebrow: "Common Patterns",
    title: "把 6 个项目反复出现的共同规律抽出来",
    description: "这一页属于“跨项目归纳”，不是某个仓库源码的原话。重点是帮你看出大家为什么都在做相似的分层。",
    badges: [renderBadge("compare", "跨项目归纳")],
    actions: [
      { label: "看框架选择", href: "frameworks.html", variant: "primary" },
      { label: "看全局证据", href: "sources/global.html", variant: "secondary" },
    ],
    aside: `<strong>读完要记住</strong>${renderBulletList(site.patternTakeaways)}`,
  });

  const cards = site.commonPatterns.map((pattern) =>
    renderCard(pattern.title, pattern.summary, renderBulletList(pattern.examples)),
  );

  const content = `
    ${renderSection({
      id: "pattern-diagram",
      kicker: "01",
      title: "共同模式图",
      description: "虽然名字不同，但大多数系统都在围绕“可见上下文”“短期压缩”“长期记忆”“存储后端”四层转。",
      body: renderFlowDiagram(site.commonPatternDiagram),
    })}
    ${renderSection({
      id: "pattern-list",
      kicker: "02",
      title: "反复出现的 5 个规律",
      description: "这 5 条不是教条，而是从当前 6 个项目里反复能看到的设计倾向。",
      body: `<div class="card-grid">${cards.join("")}</div>`,
    })}
  `;

  return { hero, content };
}

export function renderFrameworksPage(site) {
  const hero = renderHero({
    eyebrow: "Framework Choices",
    title: "如果你要自己做 agent，该怎么选框架",
    description: "这一页是搭建建议，不是某个 repo 的实现说明。目的不是给标准答案，而是帮你少踩路线上最常见的坑。",
    badges: [renderBadge("advice", "搭建建议")],
    actions: [
      { label: "看实现蓝图", href: "blueprint.html", variant: "primary" },
      { label: "回共同规律", href: "patterns.html", variant: "secondary" },
    ],
    aside: `<strong>先决定 4 件事</strong>${renderBulletList([
      "你做的是单 agent、工作流 agent，还是多 agent 协作。",
      "你要不要长期记住用户、任务、知识和偏好。",
      "你能接受多复杂的存储与维护成本。",
      "你要不要可检索的历史证据链。",
    ])}`,
  });

  const content = `
    ${renderSection({
      id: "framework-tree",
      kicker: "01",
      title: "框架选择决策树",
      description: "先按场景、记忆需求和复杂度判断，不要一上来就上最重的方案。",
      body: renderDecisionTree(site.frameworkDecisionTree),
    })}
    ${renderSection({
      id: "framework-options",
      kicker: "02",
      title: "常见路线怎么选",
      description: "这里给的是可执行建议：什么场景适合文件、SQLite、向量库或平台型 memory。",
      body: `<div class="card-grid">${site.frameworkOptions
        .map((option) => renderCard(option.title, option.summary, renderBulletList(option.points)))
        .join("")}</div>`,
    })}
  `;

  return { hero, content };
}

export function renderBlueprintPage(site) {
  const hero = renderHero({
    eyebrow: "Blueprint",
    title: "从 0 到 1 搭一个清楚的 context / memory 管理框架",
    description: "这里把“用户来消息”到“组装 context”到“写入 memory”到“召回与压缩”的完整链路拆出来，并给三档落地版本。",
    badges: [renderBadge("advice", "搭建建议"), renderBadge("compare", "基于 6 个项目归纳")],
    actions: [
      { label: "看框架选择", href: "frameworks.html", variant: "primary" },
      { label: "回首页", href: "index.html", variant: "secondary" },
    ],
    aside: `<strong>最小原则</strong>${renderBulletList([
      "先做清楚的边界，再做更多记忆功能。",
      "先区分模型看见什么，再谈存储后端。",
      "多 agent 不是复制一套 memory，而是先想共享范围和回写策略。",
    ])}`,
  });

  const content = `
    ${renderSection({
      id: "blueprint-flow",
      kicker: "01",
      title: "实现蓝图总图",
      description: "先把主链画清楚：输入、裁剪、检索、注入、写回、压缩、下轮再用。",
      body: renderFlowDiagram(site.blueprintDiagram),
    })}
    ${renderSection({
      id: "blueprint-variants",
      kicker: "02",
      title: "三档落地版本",
      description: "从最小可用版，到可扩展版，再到多 agent 版，层层加复杂度。",
      body: `<div class="card-grid">${site.blueprintVariants
        .map((variant) => renderCard(variant.title, variant.summary, renderBulletList(variant.points)))
        .join("")}</div>`,
    })}
  `;

  return { hero, content };
}

export function renderRepoPage(repo, pathToRoot = "") {
  const hero = renderHero({
    eyebrow: `${repo.name} 学习页`,
    title: repo.plainIntro,
    description: repo.summary,
    badges: [renderBadge("fact", "源码事实"), renderBadge("compare", repo.categoryLabel)],
    actions: [
      { label: "回横向对照", href: `${pathToRoot}compare.html`, variant: "primary" },
      { label: "打开证据页", href: `${pathToRoot}sources/${repo.slug}.html`, variant: "secondary" },
    ],
    aside: `<strong>这页怎么读</strong>${renderBulletList([
      "先看“这一轮模型看到了什么”，建立模型视角。",
      "再看 context 和 memory 两张图，抓主链。",
      "最后看源码锚点和证据页，确认细节。",
    ])}`,
  });

  const side = `<aside class="side-panel">
    <strong>页面地图</strong>
    <a href="#model-sees" data-section-link="model-sees">模型到底看到了什么</a>
    <a href="#context-assembly" data-section-link="context-assembly">context 怎么拼起来</a>
    <a href="#memory-lifecycle" data-section-link="memory-lifecycle">memory 怎么形成与召回</a>
    <a href="#storage-layers" data-section-link="storage-layers">存储分层</a>
    <a href="#misconceptions" data-section-link="misconceptions">常见误解</a>
    <a href="#source-anchors" data-section-link="source-anchors">关键源码位置</a>
    <a href="#deep-dive" data-section-link="deep-dive">回到原始 docs</a>
  </aside>`;

  const content = `<div class="page-grid"><div>
    ${renderSection({
      id: "model-sees",
      kicker: "01",
      title: "这一轮模型到底看到了什么",
      description: "这一段只讲模型真正可见的材料，不把所有底层状态都算进 context。",
      body: `${renderFlowDiagram(repo.contextDiagram)}<div class="panel" style="padding:18px;margin-top:16px;">${renderBulletList(repo.whatTheModelSees)}</div>`,
    })}
    ${renderSection({
      id: "context-assembly",
      kicker: "02",
      title: "context 是怎么拼起来的",
      description: "先看组成块，再看顺序。这里最容易帮助普通读者分清“哪些东西会真的进模型”。",
      body: `<div class="card-grid">${repo.contextBlocks
        .map((block) => `<article class="card"><h3>${escapeHtml(block.title)}</h3><p class="muted">${escapeHtml(block.summary)}</p><span class="kind-pill">${escapeHtml(block.kind)}</span></article>`)
        .join("")}</div><div class="panel" style="padding:18px;margin-top:16px;">${renderNumberList(repo.assemblyFlow)}</div>`,
    })}
    ${renderSection({
      id: "memory-lifecycle",
      kicker: "03",
      title: "memory 是怎么形成、保存、再被取回的",
      description: "不要把记忆想成一个抽象黑盒。这里直接按时间顺序讲“它什么时候生成、存哪、怎么再回来”。",
      body: `${renderFlowDiagram(repo.lifecycleDiagram)}<div class="panel" style="padding:18px;margin-top:16px;">${renderNumberList(repo.memoryLifecycle)}</div>`,
    })}
    ${renderSection({
      id: "storage-layers",
      kicker: "04",
      title: "存储分层图",
      description: "很多误解都来自把 transcript、summary、文件、数据库和向量库混成一层看。",
      body: `${renderLayerDiagram(repo.storageDiagram)}<div class="panel" style="padding:18px;margin-top:16px;">${renderBulletList(repo.storageLayers)}</div>`,
    })}
    ${renderSection({
      id: "misconceptions",
      kicker: "05",
      title: "哪些东西最容易被误认为 memory",
      description: "这部分是防误解，不是额外功能清单。",
      body: `<div class="card-grid">${renderCard("常见误解", repo.commonMistakes[0], renderBulletList(repo.commonMistakes.slice(1)))}${renderCard("读完应记住的 3 件事", repo.readerTakeaways[0], renderBulletList(repo.readerTakeaways.slice(1)))}</div>`,
    })}
    ${renderSection({
      id: "source-anchors",
      kicker: "06",
      title: "关键源码位置",
      description: "每个结论都要能往下追。这里列的都是站内证据入口，不是营销材料。",
      body: renderAnchorList(repo.sourceAnchors, pathToRoot),
    })}
    ${renderSection({
      id: "deep-dive",
      kicker: "07",
      title: "回到原始 docs 深挖",
      description: "如果你想继续看原文、行号和分专题分析，可以直接跳到证据页。",
      body: `<div class="card-grid">${renderCard("证据页", "站内会把这个 repo 对应的 docs 文件按行展开，方便核对路径和行号。", `<div class="source-actions"><a class="button primary" href="${pathToRoot}sources/${repo.slug}.html">打开 ${escapeHtml(repo.name)} 证据页</a></div>`)}${renderCard("原始文档清单", "你也可以直接从总览、仓库入口页和 5 篇专题页继续追。", renderBulletList(repo.docLinks.map((doc) => doc.label)))}</div>`,
    })}
  </div>${side}</div>`;

  return { hero, content };
}

export function renderSourceBundlePage(bundle) {
  const hero = renderHero({
    eyebrow: "Source Bundle",
    title: bundle.title,
    description: bundle.description,
    badges: [renderBadge("fact", "证据页")],
    actions: [{ label: "回上一页", href: bundle.backHref, variant: "primary" }],
    aside: `<strong>怎么用这页</strong>${renderBulletList([
      "左上角是文档名，下面是带行号的原始内容。",
      "学习页里的源码锚点会跳到这里的具体行号。",
    ])}`,
  });

  const files = bundle.files
    .map(
      (file) => `<article class="source-file">
        <header><strong>${escapeHtml(file.path)}</strong><div class="muted">${escapeHtml(file.title)}</div></header>
        <div class="source-lines">${file.lines
          .map(
            (line) => `<div class="source-line" id="${escapeHtml(line.anchorId)}"><div class="line-no">${line.number}</div><div>${escapeHtml(line.text || " ")}</div></div>`,
          )
          .join("")}</div>
      </article>`,
    )
    .join("");

  return {
    hero,
    content: `<section class="section panel"><div class="section-header"><div class="kicker">Docs</div><h2>原始文档与行号</h2><p>这些内容直接来自当前仓库的 <code>docs/</code>。</p></div>${files}</section>`,
  };
}

export function renderSourceIndexPage(items) {
  const hero = renderHero({
    eyebrow: "Sources",
    title: "所有证据入口",
    description: "这里不是摘要页，而是回到原始 docs 的地方。你可以按全局文档和单个 repo 进入。",
    badges: [renderBadge("fact", "证据页")],
    actions: [{ label: "回首页", href: "../index.html", variant: "primary" }],
    aside: `<strong>用途</strong>${renderBulletList([
      "核对站内结论有没有乱编。",
      "从路径和行号继续回看源码分析文档。",
    ])}`,
  });

  return {
    hero,
    content: renderSection({
      id: "source-entry",
      kicker: "01",
      title: "证据入口",
      description: "先看全局，再看单个 repo。",
      body: `<div class="repo-grid">${items
        .map((item) => `<article class="card repo-card"><div class="meta"><span class="tag">${escapeHtml(item.tag)}</span></div><h3>${escapeHtml(item.title)}</h3><p class="muted">${escapeHtml(item.description)}</p><div class="source-actions"><a class="button primary" href="${item.href}">打开</a></div></article>`)
        .join("")}</div>`,
    }),
  };
}
