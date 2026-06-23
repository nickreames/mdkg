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
    "src/content/docs/concepts/source-of-truth.md",
    "src/content/docs/concepts/repository-layout.md",
    "src/content/docs/concepts/work-context-evidence.md",
    "src/content/docs/guides/agent-workflow.md",
    "src/content/docs/guides/packs-and-handoffs.md",
    "src/content/docs/advanced-alpha/overview.md",
    "src/content/docs/advanced-alpha/project-db-queues.md",
    "src/content/docs/reference/index.md",
    "src/content/docs/reference/command-contract.md",
    "src/content/docs/reference/generated-cli-reference.md",
    "src/content/docs/project/changelog.md",
    "src/content/docs/project/claims-evidence-matrix.md",
    "src/content/docs/project/roadmap.md",
    "start-here/install.md",
    "start-here/quickstart.md",
    "start-here/safety-boundaries.md",
    "start-here/public-alpha-contract.md",
    "concepts/source-of-truth.md",
    "concepts/repository-layout.md",
    "concepts/work-context-evidence.md",
    "guides/agent-workflow.md",
    "guides/packs-and-handoffs.md",
    "advanced-alpha/project-db-queues.md",
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
  assert(readme.includes("Starlight is the docs renderer for `docs.mdkg.dev`"), "docs README missing Starlight/docs.mdkg.dev boundary");
  assert(!readme.includes("GitBook"), "docs README still references GitBook");

  const starlightConfig = readText(path.join(docs, "astro.config.mjs"));
  assert(starlightConfig.includes('site: "https://docs.mdkg.dev"'), "Starlight config missing docs.mdkg.dev site");
  assert(starlightConfig.includes('title: "mdkg Docs"'), "Starlight config missing docs title");
  assert(starlightConfig.includes("start-here/quickstart"), "Starlight sidebar missing quickstart");
  assert(starlightConfig.includes("reference/generated-cli-reference"), "Starlight sidebar missing generated CLI reference");

  const starlightHome = readText(path.join(docs, "src", "content", "docs", "index.md"));
  assert(starlightHome.includes("future canonical documentation host for `docs.mdkg.dev`"), "Starlight home missing canonical docs host copy");
  assert(!starlightHome.includes("GitBook"), "Starlight home still references GitBook");

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
