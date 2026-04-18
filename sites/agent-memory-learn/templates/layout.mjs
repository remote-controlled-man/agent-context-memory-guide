export function renderLayout({
  title,
  description,
  pathToRoot = "",
  activeNav,
  hero,
  content,
}) {
  const root = pathToRoot || "";
  const nav = [
    ["首页", `${root}index.html`, "index"],
    ["术语", `${root}glossary.html`, "glossary"],
    ["对照", `${root}compare.html`, "compare"],
    ["共同规律", `${root}patterns.html`, "patterns"],
    ["框架选择", `${root}frameworks.html`, "frameworks"],
    ["实现蓝图", `${root}blueprint.html`, "blueprint"],
    ["证据页", `${root}sources/index.html`, "sources"],
  ];

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="stylesheet" href="${root}assets/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="${root}index.html">
          <div class="brand-mark">AM</div>
          <div class="brand-copy">
            <strong>Agent Memory Learn</strong>
            <small>把 context 和 memory 讲给普通人听</small>
          </div>
        </a>
        <nav class="top-nav">
          ${nav
            .map(
              ([label, href, key]) =>
                `<a href="${href}" class="${activeNav === key ? "active" : ""}">${label}</a>`,
            )
            .join("")}
        </nav>
      </div>
    </header>
    <main>
      ${hero}
      ${content}
    </main>
    <footer class="footer">
      内容事实来自当前仓库的 <code>docs/</code>，页面里的“跨项目归纳”和“搭建建议”会单独标识。
    </footer>
    <script src="${root}assets/app.js"></script>
  </body>
</html>`;
}
