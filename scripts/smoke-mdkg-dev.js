#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  assert,
  assertExists,
  assertNoHighRiskMarkers,
  buildSite,
  readText,
  repoRoot,
  walkFiles,
} = require("./mdkg-dev-smoke-utils");

function assertContains(text, expected, label) {
  assert(text.includes(expected), `${label} missing ${expected}`);
}

function assertParity(source, expected, label) {
  for (const item of expected) {
    assertContains(source, item, label);
  }
}

function main() {
  buildSite();

  const dist = path.join(repoRoot, "mdkg-dev", "dist");
  const requiredFiles = [
    "index.html",
    "quickstart/index.html",
    "trust/index.html",
    "alpha/index.html",
    "docs/index.html",
    "llms.txt",
    "llms-full.txt",
    "robots.txt",
    "sitemap.xml",
    "favicon.svg",
    "social-card.svg",
  ];
  for (const rel of requiredFiles) {
    assertExists(path.join(dist, rel));
  }

  const home = readText(path.join(dist, "index.html"));
  assert(home.includes("Git-native project memory"), "homepage missing primary product copy");
  assert(home.includes("mdkg init --agent"), "homepage missing first-run CLI command");
  assert(home.includes("<main"), "homepage missing main landmark");
  assert(home.includes("<nav"), "homepage missing nav landmark");
  assert(home.includes("<footer"), "homepage missing footer landmark");
  const docsBridge = readText(path.join(dist, "docs", "index.html"));
  assert(docsBridge.includes("Read the mdkg docs on the dedicated docs site"), "marketing /docs bridge missing docs handoff copy");
  assert(docsBridge.includes("https://docs.mdkg.dev") || docsBridge.includes("https://mdkg-docs.vercel.app"), "marketing /docs bridge missing docs host link");
  assert(docsBridge.includes('name="robots" content="noindex, nofollow"'), "marketing /docs bridge should be noindex");

  const quickstart = readText(path.join(dist, "quickstart", "index.html"));
  const llms = readText(path.join(dist, "llms.txt"));
  const llmsFull = readText(path.join(dist, "llms-full.txt"));
  const readme = readText(path.join(repoRoot, "README.md"));
  const docsReadme = readText(path.join(repoRoot, "docs", "README.md"));
  const docsInstall = readText(path.join(repoRoot, "docs", "src", "content", "docs", "start-here", "install.md"));
  const docsQuickstart = readText(path.join(repoRoot, "docs", "src", "content", "docs", "start-here", "quickstart.md"));
  const docsHandoff = readText(path.join(repoRoot, "docs", "src", "content", "docs", "guides", "packs-and-handoffs.md"));
  const docsQueue = readText(path.join(repoRoot, "docs", "src", "content", "docs", "advanced-alpha", "project-db-queues.md"));
  const parityChecks = [
    {
      label: "README",
      source: readme,
      expected: ["Node.js `>=24.15.0`", "mdkg init --agent", "context_refs", "evidence_refs", "mdkg handoff create", "mdkg db queue contract --json"],
    },
    {
      label: "docs README",
      source: docsReadme,
      expected: ["repo-owned source", "source of truth"],
    },
    {
      label: "Starlight install docs",
      source: docsInstall,
      expected: ["Node.js `>=24.15.0`", "npm install -g mdkg", "mdkg init --agent"],
    },
    {
      label: "Starlight quickstart docs",
      source: docsQuickstart,
      expected: ["mdkg init --agent", "WORK_ID", "GOAL_ID", "TASK_ID", "mdkg handoff create WORK_ID"],
    },
    {
      label: "Starlight handoff docs",
      source: docsHandoff,
      expected: ["mdkg pack WORK_ID", "mdkg handoff create WORK_ID", "sanitized"],
    },
    {
      label: "Starlight queue docs",
      source: docsQueue,
      expected: ["mdkg db queue contract --json", "dedupe", "lease-owner", "dead-letter"],
    },
    {
      label: "quickstart page",
      source: quickstart,
      expected: ["Node 24.15.0 or newer", "GOAL_ID", "WORK_ID", "TASK_ID", "mdkg handoff create WORK_ID"],
    },
    {
      label: "homepage",
      source: home,
      expected: ["mdkg init --agent", "mdkg pack WORK_ID", "Plan", "Work", "Evidence", "context_refs", "evidence_refs", "mdkg handoff create WORK_ID"],
    },
    {
      label: "llms.txt",
      source: llms,
      expected: ["mdkg init --agent", "mdkg pack WORK_ID", "mdkg handoff create WORK_ID", "GOAL_ID"],
    },
    {
      label: "llms-full.txt",
      source: llmsFull,
      expected: ["Safety boundaries", "not an autonomous execution runtime", "WORK_ID", "TASK_ID"],
    },
  ];
  for (const { source, expected, label } of parityChecks) {
    assertParity(source, expected, label);
  }

  const generatedJs = walkFiles(path.join(dist, "_astro")).filter((file) => file.endsWith(".js"));
  assert(generatedJs.length === 0, "static site should not emit client JavaScript before React islands are needed");

  assertNoHighRiskMarkers([
    path.join(repoRoot, "mdkg-dev", "src"),
    path.join(repoRoot, "mdkg-dev", "public"),
    dist,
  ]);

  console.log(`mdkg-dev site smoke passed: ${requiredFiles.length} required files`);
}

main();
