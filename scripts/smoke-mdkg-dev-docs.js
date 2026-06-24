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

function main() {
  run(NPM_CMD, ["run", "docs:check"]);

  const docs = path.join(repoRoot, "docs");
  const requiredFiles = [
    "README.md",
    "SUMMARY.md",
    "package.json",
    "astro.config.mjs",
    "tsconfig.json",
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
  assert(!starlightHome.includes("GitBook"), "Starlight home still references GitBook");
  assert(!summary.includes("Claims Evidence Matrix"), "SUMMARY should not expose internal claims matrix");

  assertMarkdownLinks(docs);

  const generated = readText(path.join(docs, "_generated", "cli-reference.md"));
  assert(generated.includes("generated-from: dist/command-contract.json"), "generated CLI reference missing source marker");
  assert(generated.includes("## status"), "generated CLI reference missing status command");
  assert(generated.includes("## handoff"), "generated CLI reference missing handoff command");
  assert(generated.includes("mdkg handoff create <id-or-qid>"), "generated CLI reference missing handoff create usage");

  const summaryJson = JSON.parse(readText(path.join(docs, "_generated", "command-contract-summary.json")));
  assert(summaryJson.command_count >= 90, "generated command summary has too few commands");
  assert(/^[a-f0-9]{64}$/.test(summaryJson.contract_hash), "generated command summary has invalid hash");

  assertNoHighRiskMarkers([docs]);
  console.log(`mdkg-dev docs smoke passed: ${requiredFiles.length} required files`);
}

main();
