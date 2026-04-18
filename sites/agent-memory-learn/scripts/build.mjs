import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { site, repos } from "../content/site.js";
import { renderLayout } from "../templates/layout.mjs";
import {
  renderBlueprintPage,
  renderComparePage,
  renderFrameworksPage,
  renderGlossaryPage,
  renderHomePage,
  renderPatternsPage,
  renderRepoPage,
  renderSourceBundlePage,
  renderSourceIndexPage,
} from "../templates/render.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, "..");
const distRoot = resolve(siteRoot, "dist");
const docsRoot = resolve(siteRoot, "..", "..", "docs");

const repoDocMap = {
  "claude-code": { overview: "claude code.md", folder: "claude code" },
  codex: { overview: "codex.md", folder: "codex" },
  "hermes-agent": { overview: "hermes-agent.md", folder: "hermes-agent" },
  langmem: { overview: "langmem.md", folder: "langmem" },
  letta: { overview: "letta.md", folder: "letta" },
  mem0: { overview: "mem0.md", folder: "mem0" },
};

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function writePage(targetPath, title, description, activeNav, hero, content, pathToRoot = "") {
  ensureDir(dirname(targetPath));
  const html = renderLayout({ title, description, activeNav, hero, content, pathToRoot });
  writeFileSync(targetPath, html, "utf8");
}

function lineAnchorId(docPath, line) {
  return `line-${docPath.replaceAll("\\", "-").replaceAll("/", "-").replaceAll(" ", "-").replaceAll(".", "-").toLowerCase()}-${line}`;
}

function buildSourceFile(relativePath) {
  const fullPath = resolve(docsRoot, relativePath);
  const raw = readFileSync(fullPath, "utf8");
  const title = raw.split(/\r?\n/)[0].replace(/^#\s*/, "").trim();
  const lines = raw.split(/\r?\n/).map((text, index) => ({
    number: index + 1,
    text,
    anchorId: lineAnchorId(relativePath, index + 1),
  }));
  return { path: relativePath, title, lines };
}

function makeSourceHref(slug, anchor) {
  return `sources/${slug}.html#${lineAnchorId(anchor.path.replace(/^docs\//, ""), anchor.start)}`;
}

function attachSourceHrefs() {
  repos.forEach((repo) => {
    repo.sourceAnchors = repo.sourceAnchors.map((anchor) => ({
      ...anchor,
      href: makeSourceHref(repo.slug, anchor),
    }));
  });
}

function buildRepoBundle(repo) {
  const map = repoDocMap[repo.slug];
  const overview = buildSourceFile(map.overview);
  const sectionDir = resolve(docsRoot, map.folder);
  const sectionFiles = readdirSync(sectionDir)
    .filter((entry) => entry.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((entry) => buildSourceFile(`${map.folder}/${entry}`));

  return {
    title: `${repo.name} 证据页`,
    description: `来自 docs/${map.folder} 的原始分析文档与行号。`,
    backHref: `../repos/${repo.slug}.html`,
    files: [overview, ...sectionFiles],
  };
}

function buildGlobalBundle() {
  return {
    title: "全局证据页",
    description: "总览和横向对照的原始 docs 内容。",
    backHref: "../compare.html",
    files: [buildSourceFile("00-总览.md"), buildSourceFile("01-横向对照.md")],
  };
}

function copyAssets() {
  ensureDir(resolve(distRoot, "assets"));
  copyFileSync(resolve(siteRoot, "assets", "styles.css"), resolve(distRoot, "assets", "styles.css"));
  copyFileSync(resolve(siteRoot, "assets", "app.js"), resolve(distRoot, "assets", "app.js"));
}

function buildSourceIndex() {
  const items = [
    {
      tag: "全局",
      title: "总览与横向对照",
      description: "对应 docs/00-总览.md 和 docs/01-横向对照.md。",
      href: "global.html",
    },
    ...repos.map((repo) => ({
      tag: "Repo",
      title: `${repo.name} 证据页`,
      description: `对应 docs/${repo.docFolder} 和 docs/${repo.docFolder}.md 的原始内容。`,
      href: `${repo.slug}.html`,
    })),
  ];
  const page = renderSourceIndexPage(items);
  writePage(resolve(distRoot, "sources", "index.html"), "证据页 | Agent Memory Learn", "站内证据入口", "sources", page.hero, page.content, "../");
}

function buildSite() {
  rmSync(distRoot, { recursive: true, force: true });
  ensureDir(distRoot);
  ensureDir(resolve(distRoot, "repos"));
  ensureDir(resolve(distRoot, "sources"));
  writeFileSync(resolve(distRoot, ".nojekyll"), "", "utf8");
  copyAssets();
  attachSourceHrefs();

  const home = renderHomePage(site, repos);
  writePage(resolve(distRoot, "index.html"), "Agent Memory Learn", "把 agent 的 context 与 memory 讲给普通人听", "index", home.hero, home.content);

  const glossary = renderGlossaryPage(site);
  writePage(resolve(distRoot, "glossary.html"), "术语页 | Agent Memory Learn", "context、memory、history 等术语解释", "glossary", glossary.hero, glossary.content);

  const compare = renderComparePage(site, repos);
  writePage(resolve(distRoot, "compare.html"), "横向对照 | Agent Memory Learn", "6 个 agent 项目的 context / memory 横向对照", "compare", compare.hero, compare.content);

  const patterns = renderPatternsPage(site);
  writePage(resolve(distRoot, "patterns.html"), "共同规律 | Agent Memory Learn", "6 个项目中的共性模式", "patterns", patterns.hero, patterns.content);

  const frameworks = renderFrameworksPage(site);
  writePage(resolve(distRoot, "frameworks.html"), "框架选择 | Agent Memory Learn", "自己做 agent 时的框架与记忆路线选择", "frameworks", frameworks.hero, frameworks.content);

  const blueprint = renderBlueprintPage(site);
  writePage(resolve(distRoot, "blueprint.html"), "实现蓝图 | Agent Memory Learn", "从 0 到 1 搭 context / memory 管理框架", "blueprint", blueprint.hero, blueprint.content);

  repos.forEach((repo) => {
    const repoPage = renderRepoPage(repo, "../");
    writePage(resolve(distRoot, "repos", `${repo.slug}.html`), `${repo.name} | Agent Memory Learn`, repo.plainIntro, "", repoPage.hero, repoPage.content, "../");

    const bundle = buildRepoBundle(repo);
    const sourcePage = renderSourceBundlePage(bundle);
    writePage(resolve(distRoot, "sources", `${repo.slug}.html`), `${repo.name} 证据页 | Agent Memory Learn`, bundle.description, "sources", sourcePage.hero, sourcePage.content, "../");
  });

  const globalBundle = buildGlobalBundle();
  const globalSource = renderSourceBundlePage(globalBundle);
  writePage(resolve(distRoot, "sources", "global.html"), "全局证据页 | Agent Memory Learn", globalBundle.description, "sources", globalSource.hero, globalSource.content, "../");
  buildSourceIndex();
}

buildSite();
console.log(`Built static site at ${relative(process.cwd(), distRoot) || distRoot}`);
