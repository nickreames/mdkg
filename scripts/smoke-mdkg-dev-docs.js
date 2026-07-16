#!/usr/bin/env node

const fs = require("node:fs");
const crypto = require("node:crypto");
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
  const releaseManifestPath = path.join(repoRoot, "release", "public-release.json");
  const releaseManifestBefore = fs.readFileSync(releaseManifestPath);
  const releaseManifestHashBefore = crypto.createHash("sha256").update(releaseManifestBefore).digest("hex");
  const releaseManifest = JSON.parse(releaseManifestBefore.toString("utf8"));
  const releasePublished = releaseManifest.state === "published";
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
    "public/favicon.svg",
    "src/components/Footer.astro",
    "src/components/PageSidebar.astro",
    "src/components/ReleaseV050Supplement.astro",
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
    "src/content/docs/loops/index.md",
    "src/content/docs/loops/templates-and-forks.md",
    "src/content/docs/loops/readiness-routing-evidence-closeout.md",
    "src/content/docs/loops/security-audit.md",
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
  const docsInstallSource = readText(path.join(docs, "src", "content", "docs", "start-here", "install.md"));
  const repositoryLayoutSource = readText(path.join(docs, "src", "content", "docs", "concepts", "repository-layout.md"));
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
  for (const snippet of [
    "Customize after init",
    ".mdkg/config.json",
    "arbitrary contained skill mirror target paths",
    "COLLABORATION.md",
    "HUMAN.md",
    "MANIFEST.md",
    "SPEC.md",
    "mdkg upgrade --apply",
  ]) {
    assert(docsInstallSource.includes(snippet), `Install docs missing customization/upgrade snippet: ${snippet}`);
  }
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
  assert(!repositoryLayoutSource.includes("| Path | Purpose | Commit? |"), "Repository layout should not use the cramped path table");
  for (const snippet of [
    "Commit as durable source",
    "Review before committing",
    "Keep local or rebuildable",
    "`.mdkg/config.json`",
    "`.mdkg/db/runtime/`",
    "`.mdkg/db/state/`",
    "`.agents/skills/`",
    "arbitrary contained mirror paths",
    "`COLLABORATION.md`",
    "`MANIFEST.md`",
  ]) {
    assert(repositoryLayoutSource.includes(snippet), `Repository layout missing responsive section: ${snippet}`);
  }
  const advancedOverview = readText(path.join(docs, "src", "content", "docs", "advanced-alpha", "overview.md"));
  assert(advancedOverview.includes("## Use when"), "Advanced alpha overview missing use-when guidance");
  assert(advancedOverview.includes("## Do not use when"), "Advanced alpha overview missing do-not-use guidance");
  assert(advancedOverview.includes("/advanced-alpha/git-materialization/"), "Advanced alpha overview missing Git materialization guide");
  assert(!advancedOverview.includes("should be documented"), "Advanced alpha overview still has documentation meta commentary");
  const gitMaterialization = readText(path.join(docs, "src", "content", "docs", "advanced-alpha", "git-materialization.md"));
  for (const snippet of [
    "mdkg.git.materialize.request.v1",
    "mdkg.git.materialize.receipt.v1",
    "mdkg git materialize --request materialize-request.json --json",
    "same-parent atomic rename",
    "Authentication remains external",
    "Project-memory policy",
    "Clone compatibility",
  ]) {
    assert(gitMaterialization.includes(snippet), `Git materialization guide missing contract detail: ${snippet}`);
  }
  const publicRoadmap = readText(path.join(docs, "src", "content", "docs", "project", "roadmap.md"));
  assert(publicRoadmap.includes("product-facing"), "Roadmap should explain product-facing boundary");
  assert(!publicRoadmap.includes("roadmap source of truth"), "Roadmap still has internal source-of-truth phrasing");
  const publicChangelog = readText(path.join(docs, "src", "content", "docs", "project", "changelog.md"));
  assert(publicChangelog.includes("product-level summary"), "Changelog should read as product-level release notes");
  assert(publicChangelog.includes("release-grid"), "Changelog should render recent release cards");
  assert(publicChangelog.includes("0.4.1 details"), "Changelog should expose latest release details");
  for (const snippet of ["contract_profile", "mdkg validate --profile omni-room", "receipt_kind", "runtime policy"]) {
    assert(publicChangelog.includes(snippet), `Changelog missing 0.4.1 capability detail: ${snippet}`);
  }
  assert(publicChangelog.includes("0.3.9 details"), "Changelog should retain 0.3.9 release details");
  for (const snippet of ["`.mdkg/config.json` customization overlays", "arbitrary contained agent-local skill roots", "`COLLABORATION.md`"]) {
    assert(publicChangelog.includes(snippet), `Changelog missing 0.3.9 capability detail: ${snippet}`);
  }
  assert(!publicChangelog.includes("Public docs should"), "Changelog still has docs-author meta commentary");
  const referenceHome = readText(path.join(docs, "src", "content", "docs", "reference", "index.md"));
  assert(referenceHome.includes("Integration metadata"), "Reference home should label command contract as integration metadata");
  assert(referenceHome.includes("mdkg git materialize --request REQUEST.json --json"), "Reference home missing Git materialization command");
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
  assert(generated.includes("## git"), "generated CLI reference missing git command family");
  assert(generated.includes("## git materialize"), "generated CLI reference missing git materialize command");
  assert(generated.includes("mdkg.git.materialize.receipt.v1"), "generated CLI reference missing materialize receipt schema");
  assert(generated.includes("mdkg git push-ready --remote <name> --branch <name>"), "generated CLI reference missing git push-ready usage");
  assert(generated.includes("external auth"), "generated CLI reference missing git auth boundary");

  const generatedReferenceSource = readText(path.join(docs, "src", "content", "docs", "reference", "generated-cli-reference.md"));
  for (const snippet of [
    "## Git lifecycle commands",
    "mdkg git inspect --json",
    "mdkg git materialize --request materialize-request.json --json",
    "mdkg git clone <repository-ref>",
    "mdkg git fetch --remote origin --branch main --json",
    "mdkg git closeout --json",
    "mdkg git push-ready --remote origin --branch main --json",
    "mdkg git push --remote origin --branch main --stage-all",
    "authentication stays external",
  ]) {
    assert(generatedReferenceSource.includes(snippet), `public generated CLI reference missing git lifecycle snippet: ${snippet}`);
  }

  const summaryJson = JSON.parse(readText(path.join(docs, "_generated", "command-contract-summary.json")));
  assert(summaryJson.command_count >= 90, "generated command summary has too few commands");
  assert(/^[a-f0-9]{64}$/.test(summaryJson.contract_hash), "generated command summary has invalid hash");

  assertRenderedOutline(path.join(docs, "dist"));

  const canonicalDist = path.join(docs, "dist");
  assertExists(path.join(canonicalDist, "advanced-alpha", "git-materialization", "index.html"));
  if (releasePublished) {
    assertExists(path.join(canonicalDist, "loops", "index.html"));
  } else {
    assert(!fs.existsSync(path.join(canonicalDist, "loops")), "draft docs build must not emit loop routes");
  }
  const canonicalSitemap = readText(path.join(canonicalDist, "sitemap-0.xml"));
  assert(
    canonicalSitemap.includes("/loops/") === releasePublished,
    releasePublished
      ? "published docs sitemap must include loop routes"
      : "draft docs sitemap must not include loop routes",
  );
  for (const [label, relPath] of [
    ["install", "start-here/install/index.html"],
    ["changelog", "project/changelog/index.html"],
    ["reference", "reference/generated-cli-reference/index.html"],
  ]) {
    const html = readText(path.join(canonicalDist, relPath));
    if (releasePublished) {
      assert(html.includes("v0.5.0 · Pre-v1 public alpha"), `published ${label} page must include release facts`);
      assert(html.includes("release-v050-"), `published ${label} page must render release supplement`);
      assert(!html.includes("Draft release facts for local verification only"), `published ${label} page must not include preview copy`);
    } else {
      assert(!html.includes("Target v0.5.0"), `draft ${label} page must not include target release facts`);
      assert(!html.includes("release-v050-"), `draft ${label} page must not render release supplement`);
    }
  }
  const canonicalInstall = readText(path.join(canonicalDist, "start-here", "install", "index.html"));
  assert(
    canonicalInstall.includes(
      "https://github.com/nickreames/mdkg/edit/main/docs/src/content/docs/start-here/install.md",
    ),
    "docs Edit page link must include the monorepo docs path",
  );
  if (releasePublished) {
    const canonicalSecurity = readText(path.join(canonicalDist, "loops", "security-audit", "index.html"));
    assert(
      canonicalSecurity.includes(
        "https://github.com/nickreames/mdkg/edit/main/docs/src/content/docs/loops/security-audit.md",
      ),
      "security walkthrough Edit page link must include the monorepo docs path",
    );
  }
  const canonicalPagefind = JSON.parse(readText(path.join(canonicalDist, "pagefind", "pagefind-entry.json")));
  const canonicalPageCount = canonicalPagefind.languages.en.page_count;

  run(NPM_CMD, ["--prefix", "docs", "run", "build"], {
    env: releasePublished
      ? { VERCEL_ENV: "preview" }
      : { PUBLIC_MDKG_RELEASE_PREVIEW: "1" },
  });

  const previewDist = path.join(docs, "dist");
  const loopRouteFiles = [
    ["overview", "loops/index.html"],
    ["templates", "loops/templates-and-forks/index.html"],
    ["lifecycle", "loops/readiness-routing-evidence-closeout/index.html"],
    ["security", "loops/security-audit/index.html"],
  ];
  for (const [label, relPath] of loopRouteFiles) {
    const filePath = path.join(previewDist, relPath);
    assertExists(filePath);
    const html = readText(filePath);
    assert(html.includes('name="robots" content="noindex, nofollow"'), `${label} preview route must be noindex`);
    assert((html.match(/<h1[\s>]/g) || []).length === 1, `${label} preview route must have one h1`);
  }

  const overviewHtml = readText(path.join(previewDist, "loops", "index.html"));
  for (const snippet of [
    "Goals and loops",
    "one node type",
    "coding-agent harness executes agents and tools",
    "patch_proposal",
    "write_with_approval",
  ]) {
    assert(overviewHtml.toLowerCase().includes(snippet.toLowerCase()), `loop overview missing ${snippet}`);
  }

  const templatesHtml = readText(path.join(previewDist, "loops", "templates-and-forks", "index.html"));
  for (const template of [
    "security-audit",
    "design-frontend-ux-audit",
    "backend-api-cli-bloat-audit",
    "tech-stack-best-practices-audit",
    "duplicate-code-and-linting-audit",
    "test-ci-skill-infrastructure-audit",
    "user-story-audit-and-recommendations",
  ]) {
    assert(templatesHtml.includes(template), `templates page missing ${template}`);
  }
  for (const snippet of ["default_children", "planning_only", "manual", "stale warning", "never rewrites"]) {
    assert(templatesHtml.includes(snippet), `templates page missing ${snippet}`);
  }

  const lifecycleHtml = readText(path.join(previewDist, "loops", "readiness-routing-evidence-closeout", "index.html"));
  for (const snippet of [
    "question_answer_refs",
    "action_approval_refs",
    "evidence_lane_refs",
    "lane_waiver_decision_refs",
    "lane_waiver_approval_refs",
    "at least three viable options",
    "no authorized child work",
  ]) {
    assert(lifecycleHtml.includes(snippet), `loop lifecycle page missing ${snippet}`);
  }

  const securityHtml = readText(path.join(previewDist, "loops", "security-audit", "index.html"));
  for (const command of [
    "mdkg loop list",
    "mdkg loop show security-audit",
    "mdkg loop fork security-audit --scope . --dry-run --json",
    "mdkg loop fork security-audit --scope . --json",
    "mdkg loop plan LOOP_ID --json",
    "mdkg pack LOOP_ID --profile concise",
    "mdkg loop next LOOP_ID --json",
    "mdkg loop runs LOOP_ID --json",
  ]) {
    assert(securityHtml.includes(command), `security walkthrough missing ${command}`);
  }
  for (const forbiddenCommand of ["mdkg loop run ", "mdkg loop resume", "mdkg loop execute", "mdkg note add"]) {
    assert(!securityHtml.includes(forbiddenCommand), `security walkthrough includes unsupported command ${forbiddenCommand}`);
  }
  for (const forbiddenPublicData of ["/Users/", "loop-5", "goal-61", "chk-", "sha256:"]) {
    assert(!securityHtml.includes(forbiddenPublicData), `security walkthrough leaks ${forbiddenPublicData}`);
  }

  const previewSitemap = readText(path.join(previewDist, "sitemap-0.xml"));
  for (const route of [
    "https://docs.mdkg.dev/loops/",
    "https://docs.mdkg.dev/loops/templates-and-forks/",
    "https://docs.mdkg.dev/loops/readiness-routing-evidence-closeout/",
    "https://docs.mdkg.dev/loops/security-audit/",
  ]) {
    assert(previewSitemap.includes(route), `preview docs sitemap missing ${route}`);
  }
  const previewRobots = readText(path.join(previewDist, "robots.txt"));
  assert(previewRobots.includes("Disallow: /"), "preview docs robots must disallow crawling");
  const previewInstall = readText(path.join(previewDist, "start-here", "install", "index.html"));
  const previewChangelog = readText(path.join(previewDist, "project", "changelog", "index.html"));
  const previewReference = readText(path.join(previewDist, "reference", "generated-cli-reference", "index.html"));
  for (const [label, html, snippets] of [
    ["install", previewInstall, ["Prepare an existing repo for loops", "mdkg upgrade --apply", "Legacy SPEC compatibility remains unchanged"]],
    [
      "changelog",
      previewChangelog,
      releasePublished
        ? ["First-class reusable loops", "Seven bundled read-only or planning templates", "v0.5.0 · Pre-v1 public alpha"]
        : ["First-class reusable loops", "Seven bundled read-only or planning templates", "Draft release facts for local verification only", "npm availability"],
    ],
    ["reference", previewReference, ["Loop command family", "mdkg new loop", "mdkg loop runs LOOP_ID"]],
  ]) {
    for (const snippet of snippets) {
      assert(html.includes(snippet), `preview ${label} release supplement missing ${snippet}`);
    }
  }
  const previewPublicHtml = [
    overviewHtml,
    templatesHtml,
    lifecycleHtml,
    securityHtml,
    previewInstall,
    previewChangelog,
    previewReference,
  ].join("\n");
  for (const forbidden of [
    "/Users/",
    "loop-5",
    "goal-61",
    "v0.5.0 is available",
    "npm install -g mdkg@0.5.0",
  ]) {
    assert(!previewPublicHtml.includes(forbidden), `preview public docs leak or overclaim ${forbidden}`);
  }
  assert(!/\bchk-(?:4\d{2}|[5-9]\d{2,})\b/.test(previewPublicHtml), "preview public docs should not expose internal checkpoint ids");
  assert(!/sha256:[a-f0-9]{64}/i.test(previewPublicHtml), "preview public docs should not expose content hashes");
  const packageJson = JSON.parse(readText(path.join(repoRoot, "package.json")));
  assert(
    packageJson.version === releaseManifest.target_version,
    `published release target ${releaseManifest.target_version} must match package version ${packageJson.version}`,
  );
  const previewPagefind = JSON.parse(readText(path.join(previewDist, "pagefind", "pagefind-entry.json")));
  assert(
    previewPagefind.languages.en.page_count ===
      canonicalPageCount + (releasePublished ? 0 : loopRouteFiles.length),
    releasePublished
      ? "published preview Pagefind index must retain the canonical route count"
      : "draft preview Pagefind index must add exactly the four loop routes"
  );

  const releaseManifestAfter = fs.readFileSync(releaseManifestPath);
  const releaseManifestHashAfter = crypto.createHash("sha256").update(releaseManifestAfter).digest("hex");
  assert(releaseManifestBefore.equals(releaseManifestAfter), "docs builds mutated release manifest bytes");
  assert(releaseManifestHashBefore === releaseManifestHashAfter, "docs builds changed release manifest hash");

  assertNoHighRiskMarkers([docs]);
  console.log(`mdkg-dev docs smoke passed: ${requiredFiles.length} required files`);
}

main();
