#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  NPM_CMD,
  assert,
  assertExists,
  assertMarkdownLinks,
  assertNoHighRiskMarkers,
  readText,
  repoRoot,
  run,
} = require("./mdkg-dev-smoke-utils");

function walkHtmlIndexFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtmlIndexFiles(fullPath));
    } else if (entry.isFile() && entry.name === "index.html") {
      out.push(fullPath);
    }
  }
  return out;
}

function assertRenderedOutline(distDir) {
  const pages = walkHtmlIndexFiles(distDir);
  assert(pages.length >= 20, "Starlight build produced too few docs pages");
  for (const filePath of pages) {
    const html = readText(filePath);
    const rel = path.relative(distDir, filePath);
    const h1Count = (html.match(/<h1[\s>]/g) || []).length;
    const onThisPageCount = (html.match(/On this page/g) || []).length;
    const starlightTocCount = (html.match(/<starlight-toc\b/g) || []).length;
    const rightSidebarCount = (html.match(/right-sidebar-panel/g) || []).length;
    assert(h1Count === 1, `${rel} should render exactly one H1, got ${h1Count}`);
    assert(onThisPageCount <= 1, `${rel} should not render duplicated On this page labels`);
    assert(starlightTocCount <= 1, `${rel} should not render duplicated Starlight TOC elements`);
    assert(rightSidebarCount <= 1, `${rel} should not render duplicated custom right sidebar panels`);
    assert(!html.includes("starlight__mobile-toc"), `${rel} should not render duplicate mobile TOC markup`);
    assert(!html.includes("MobileTableOfContents"), `${rel} should not include mobile TOC script text`);
  }
}

function main() {
  run(NPM_CMD, ["run", "docs:check"]);
  run(NPM_CMD, ["run", "docs:check-commands"]);
  run(NPM_CMD, ["--prefix", "docs", "run", "build"]);

  const docs = path.join(repoRoot, "docs");
  const requiredFiles = [
    "README.md",
    "SUMMARY.md",
    "package.json",
    "astro.config.mjs",
    "tsconfig.json",
    "src/components/PageSidebar.astro",
    "src/content.config.ts",
    "src/content/docs/index.md",
    "src/content/docs/start-here/install.md",
    "src/content/docs/start-here/quickstart.md",
    "src/content/docs/start-here/safety-boundaries.md",
    "src/content/docs/start-here/public-alpha-contract.md",
    "src/content/docs/start-here/troubleshooting.md",
    "src/content/docs/concepts/source-of-truth.md",
    "src/content/docs/concepts/local-first-low-dependency.md",
    "src/content/docs/concepts/plan-work-evidence.md",
    "src/content/docs/concepts/repository-layout.md",
    "src/content/docs/concepts/work-context-evidence.md",
    "src/content/docs/concepts/work-node-types.md",
    "src/content/docs/concepts/glossary.md",
    "src/content/docs/guides/agent-workflow.md",
    "src/content/docs/guides/packs-and-handoffs.md",
    "src/content/docs/guides/research-spikes.md",
    "src/content/docs/advanced-alpha/overview.md",
    "src/content/docs/advanced-alpha/project-db-queues.md",
    "src/content/docs/advanced-alpha/read-only-mcp.md",
    "src/content/docs/advanced-alpha/subgraphs-and-bundles.md",
    "src/content/docs/advanced-alpha/graph-movement.md",
    "src/content/docs/advanced-alpha/demo-graphs.md",
    "src/content/docs/reference/index.md",
    "src/content/docs/reference/command-contract.md",
    "src/content/docs/reference/generated-cli-reference.md",
    "src/content/docs/project/changelog.md",
    "src/content/docs/project/roadmap.md",
    "start-here/install.md",
    "start-here/quickstart.md",
    "start-here/safety-boundaries.md",
    "start-here/public-alpha-contract.md",
    "start-here/troubleshooting.md",
    "concepts/source-of-truth.md",
    "concepts/local-first-low-dependency.md",
    "concepts/plan-work-evidence.md",
    "concepts/repository-layout.md",
    "concepts/work-context-evidence.md",
    "concepts/work-node-types.md",
    "concepts/glossary.md",
    "advanced-alpha/overview.md",
    "guides/agent-workflow.md",
    "guides/packs-and-handoffs.md",
    "guides/research-spikes.md",
    "advanced-alpha/project-db-queues.md",
    "advanced-alpha/read-only-mcp.md",
    "advanced-alpha/subgraphs-and-bundles.md",
    "advanced-alpha/graph-movement.md",
    "advanced-alpha/demo-graphs.md",
    "reference/command-contract.md",
    "_generated/cli-reference.md",
    "_generated/command-contract-summary.json",
    "project/claims-evidence-matrix.md",
    "agent-runtime-0.0.9-handoff.md",
    "mdkg-0.1.8-db-queue-upgrade-megaprompt.md",
  ];
  for (const rel of requiredFiles) {
    assertExists(path.join(docs, rel));
  }

  const summary = readText(path.join(docs, "SUMMARY.md"));
  for (const heading of ["Start Here", "Concepts", "Guides", "Advanced Alpha", "Reference", "Project"]) {
    assert(summary.includes(heading), `SUMMARY.md missing ${heading}`);
  }
  const readme = readText(path.join(docs, "README.md"));
  assert(readme.includes("repo-owned source"), "docs README missing repo-owned source boundary");
  assert(!readme.includes("GitBook"), "docs README still references GitBook");

  const starlightConfig = readText(path.join(docs, "astro.config.mjs"));
  assert(starlightConfig.includes('site: "https://docs.mdkg.dev"'), "Starlight config missing docs.mdkg.dev site");
  assert(starlightConfig.includes('title: "mdkg Docs"'), "Starlight config missing docs title");
  assert(starlightConfig.includes("PageSidebar"), "Starlight config missing custom PageSidebar override");
  assert(starlightConfig.includes("start-here/quickstart"), "Starlight sidebar missing quickstart");
  assert(starlightConfig.includes("start-here/troubleshooting"), "Starlight sidebar missing troubleshooting");
  assert(starlightConfig.includes("concepts/plan-work-evidence"), "Starlight sidebar missing Plan -> Work -> Evidence");
  assert(starlightConfig.includes("concepts/work-node-types"), "Starlight sidebar missing work node types");
  assert(starlightConfig.includes("guides/research-spikes"), "Starlight sidebar missing research spikes");
  assert(starlightConfig.includes("advanced-alpha/read-only-mcp"), "Starlight sidebar missing read-only MCP");
  assert(starlightConfig.includes("advanced-alpha/subgraphs-and-bundles"), "Starlight sidebar missing subgraphs and bundles");
  assert(starlightConfig.includes("advanced-alpha/graph-movement"), "Starlight sidebar missing graph movement");
  assert(starlightConfig.includes("advanced-alpha/demo-graphs"), "Starlight sidebar missing demo graphs");
  assert(starlightConfig.includes("reference/generated-cli-reference"), "Starlight sidebar missing generated CLI reference");
  const starlightHome = readText(path.join(docs, "src", "content", "docs", "index.md"));
  assert(starlightHome.includes("Start here for Markdown Knowledge Graph documentation"), "Starlight home missing docs-home copy");
  for (const snippet of [
    "Choose your first path",
    "Human quickstart",
    "Agent quickstart",
    "[Install mdkg](/start-here/install/)",
    "[Run the quickstart](/start-here/quickstart/)",
    "[work node types](/concepts/work-node-types/)",
    "[packs and handoffs](/guides/packs-and-handoffs/)",
    "Read `AGENT_START.md`.",
    "mdkg goal current",
    "mdkg goal next",
    "mdkg show WORK_ID",
    "mdkg pack WORK_ID",
    "mdkg goal claim GOAL_ID WORK_ID",
    "[Advanced Alpha](/advanced-alpha/overview/)",
    "[CLI Reference](/reference/)",
  ]) {
    assert(starlightHome.includes(snippet), `Starlight home missing routing snippet: ${snippet}`);
  }
  assert(!starlightHome.includes("GitBook"), "Starlight home still references GitBook");
  const agentWorkflow = readText(path.join(docs, "src", "content", "docs", "guides", "agent-workflow.md"));
  assert(agentWorkflow.includes("[docs overview](/)"), "Agent workflow should link back to docs overview routing");
  assert(!agentWorkflow.includes("| Command | Boundary |"), "Agent workflow should not use the cramped command-boundary table");
  for (const snippet of [
    "Read-only commands are safe for initial grounding",
    "Generated-output commands write derived files",
    "Mutating commands change graph lifecycle or evidence",
    "Beginner safety rule",
  ]) {
    assert(agentWorkflow.includes(snippet), `Agent workflow missing command-boundary section: ${snippet}`);
  }
  const repositoryLayout = readText(path.join(docs, "src", "content", "docs", "concepts", "repository-layout.md"));
  assert(!repositoryLayout.includes("| Path | Purpose | Commit? |"), "Repository layout should not use the cramped path table");
  for (const snippet of [
    "Commit as durable source",
    "Review before committing",
    "Keep local or rebuildable",
    "`.mdkg/db/runtime/`",
    "`.mdkg/db/state/`",
    "`.agents/skills/`",
  ]) {
    assert(repositoryLayout.includes(snippet), `Repository layout missing responsive section: ${snippet}`);
  }
  const advancedOverview = readText(path.join(docs, "src", "content", "docs", "advanced-alpha", "overview.md"));
  assert(advancedOverview.includes("## Use when"), "Advanced alpha overview missing use-when guidance");
  assert(advancedOverview.includes("## Do not use when"), "Advanced alpha overview missing do-not-use guidance");
  assert(!advancedOverview.includes("should be documented"), "Advanced alpha overview still has documentation meta commentary");
  const publicRoadmap = readText(path.join(docs, "src", "content", "docs", "project", "roadmap.md"));
  assert(publicRoadmap.includes("product-facing"), "Roadmap should explain product-facing boundary");
  assert(!publicRoadmap.includes("roadmap source of truth"), "Roadmap still has internal source-of-truth phrasing");
  const publicChangelog = readText(path.join(docs, "src", "content", "docs", "project", "changelog.md"));
  assert(publicChangelog.includes("product-level summary"), "Changelog should read as product-level release notes");
  assert(!publicChangelog.includes("Public docs should"), "Changelog still has docs-author meta commentary");
  const referenceHome = readText(path.join(docs, "src", "content", "docs", "reference", "index.md"));
  assert(referenceHome.includes("Integration metadata"), "Reference home should label command contract as integration metadata");
  assert(!referenceHome.includes("The documentation rule"), "Reference home still has docs-author meta commentary");
  const workNodeTypes = readText(path.join(docs, "src", "content", "docs", "concepts", "work-node-types.md"));
  for (const snippet of [
    "Valid minimal goal frontmatter",
    "Valid task frontmatter",
    "Valid spike frontmatter",
    "goal_state: active",
    "active_node: task-1",
    "last_active_node",
    "Treating required checks as automated execution",
  ]) {
    assert(workNodeTypes.includes(snippet), `Work node types missing concrete example or mistake: ${snippet}`);
  }
  const referenceTypes = readText(path.join(docs, "src", "content", "docs", "concepts", "work-context-evidence.md"));
  for (const snippet of [
    "id: goal-2",
    "scope_refs:",
    "context_refs:",
    "evidence_refs:",
    "Using `scope_refs` as a reading list",
    "Blocking local work on a read-only subgraph qid",
  ]) {
    assert(referenceTypes.includes(snippet), `Reference types missing complete refs or mistake: ${snippet}`);
  }
  const packsAndHandoffs = readText(path.join(docs, "src", "content", "docs", "guides", "packs-and-handoffs.md"));
  assert(packsAndHandoffs.includes("## Common mistakes"), "Packs and handoffs missing common mistakes");
  assert(packsAndHandoffs.includes("refs-only and sanitized"), "Packs and handoffs missing sanitized handoff warning");
  assert(!summary.includes("Claims Evidence Matrix"), "SUMMARY should not expose internal claims matrix");

  assertMarkdownLinks(docs);

  const generated = readText(path.join(docs, "_generated", "cli-reference.md"));
  assert(generated.includes("generated-from: dist/command-contract.json"), "generated CLI reference missing source marker");
  assert(generated.includes("broad user-facing command reference"), "generated CLI reference missing user-facing intro");
  assert(generated.includes("### When to use"), "generated CLI reference missing when-to-use sections");
  assert(generated.includes("### Examples"), "generated CLI reference missing examples sections");
  assert(generated.includes("### Output and safety"), "generated CLI reference missing output and safety sections");
  assert(generated.includes("### Related commands"), "generated CLI reference missing related command sections");
  assert(generated.includes("Mode: Read-only command"), "generated CLI reference missing read-only mode labels");
  assert(generated.includes("Mode: Mutating command"), "generated CLI reference missing mutating mode labels");
  assert(!generated.includes("Do not hand-edit command metadata"), "generated CLI reference should avoid public maintainer instructions");
  assert(generated.includes("## status"), "generated CLI reference missing status command");
  assert(generated.includes("## handoff"), "generated CLI reference missing handoff command");
  assert(generated.includes("mdkg handoff create <id-or-qid>"), "generated CLI reference missing handoff create usage");

  const summaryJson = JSON.parse(readText(path.join(docs, "_generated", "command-contract-summary.json")));
  assert(summaryJson.command_count >= 90, "generated command summary has too few commands");
  assert(/^[a-f0-9]{64}$/.test(summaryJson.contract_hash), "generated command summary has invalid hash");

  assertRenderedOutline(path.join(docs, "dist"));

  assertNoHighRiskMarkers([docs]);
  console.log(`mdkg-dev docs smoke passed: ${requiredFiles.length} required files`);
}

main();
