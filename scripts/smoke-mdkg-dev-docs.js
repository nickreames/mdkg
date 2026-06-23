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
