#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  NPM_CMD,
  assert,
  assertExists,
  assertNoHighRiskMarkers,
  buildSite,
  readText,
  repoRoot,
  run,
} = require("./mdkg-dev-smoke-utils");

function assertIncludes(source, expected, label) {
  assert(source.includes(expected), `${label} missing ${expected}`);
}

function assertExcludes(source, forbidden, label) {
  assert(!source.includes(forbidden), `${label} includes forbidden text: ${forbidden}`);
}

function buildDocs(env = {}) {
  run(NPM_CMD, ["--prefix", "docs", "run", "build"], { env });
}

function buildMarketing(env = {}) {
  run(NPM_CMD, ["--prefix", "mdkg-dev", "run", "build"], { env });
}

function main() {
  buildSite();
  buildDocs();

  const siteDist = path.join(repoRoot, "mdkg-dev", "dist");
  const docsDist = path.join(repoRoot, "docs", "dist");

  const docsBridge = readText(path.join(siteDist, "docs", "index.html"));
  assertIncludes(docsBridge, "Read the mdkg docs on the dedicated docs site", "marketing /docs bridge");
  assertIncludes(docsBridge, "https://docs.mdkg.dev", "marketing /docs bridge");
  assertIncludes(docsBridge, 'name="robots" content="noindex, nofollow"', "marketing /docs bridge");
  for (const rel of [
    "advanced-alpha/read-only-mcp/index.html",
    "advanced-alpha/subgraphs-and-bundles/index.html",
    "advanced-alpha/graph-movement/index.html",
    "advanced-alpha/demo-graphs/index.html",
    "concepts/plan-work-evidence/index.html",
    "concepts/work-node-types/index.html",
  ]) {
    assertExists(path.join(docsDist, rel));
  }

  const terminal = readText(path.join(repoRoot, "mdkg-dev", "src", "components", "TerminalBlock.astro"));
  assertIncludes(terminal, 'commands.join("\\n")', "TerminalBlock");
  assertIncludes(terminal, "overflow-x: auto", "TerminalBlock");
  assertIncludes(terminal, "white-space: pre", "TerminalBlock");

  const home = readText(path.join(siteDist, "index.html"));
  const quickstart = readText(path.join(siteDist, "quickstart", "index.html"));
  const trust = readText(path.join(siteDist, "trust", "index.html"));
  const alpha = readText(path.join(siteDist, "alpha", "index.html"));
  const allSite = [home, quickstart, trust, alpha].join("\n");
  for (const expected of [
    "Git-native project memory for AI coding agents",
    "Plan",
    "Work",
    "Evidence",
    "mdkg init --agent",
    "mdkg pack WORK_ID",
    "context_refs",
    "evidence_refs",
    "https://docs.mdkg.dev",
    "https://github.com/nickreames/mdkg",
    "https://www.npmjs.com/package/mdkg",
    'target="_blank"',
    'rel="noopener noreferrer"',
  ]) {
    assertIncludes(allSite, expected, "marketing pages");
  }
  for (const forbidden of ["GitBook", "golden loop", "Golden loop", "Repo-owned docs, rendered with Starlight", "Claims Evidence Matrix"]) {
    assertExcludes(allSite, forbidden, "marketing pages");
  }

  const docsHome = readText(path.join(docsDist, "index.html"));
  const docsGeneratedReference = readText(path.join(docsDist, "reference", "generated-cli-reference", "index.html"));
  const docsAdvanced = readText(path.join(docsDist, "advanced-alpha", "overview", "index.html"));
  const allDocs = [docsHome, docsGeneratedReference, docsAdvanced].join("\n");
  for (const expected of [
    "Markdown Knowledge Graph Docs",
    "Plan",
    "Work",
    "Evidence",
    "Read-only MCP",
    "Subgraphs",
    "Graph Movement",
    "Demo Graphs",
    "Project DB",
    "docs.mdkg.dev",
  ]) {
    assertIncludes(allDocs, expected, "docs pages");
  }
  for (const forbidden of ["GitBook", "future canonical documentation host", "Claims Evidence Matrix"]) {
    assertExcludes(allDocs, forbidden, "docs pages");
  }

  const llms = readText(path.join(siteDist, "llms.txt"));
  const llmsFull = readText(path.join(siteDist, "llms-full.txt"));
  for (const expected of [
    "git-native project memory",
    "Plan -> Work -> Evidence",
    "https://docs.mdkg.dev/",
    "mdkg handoff create",
  ]) {
    assertIncludes(llms + "\n" + llmsFull, expected, "llms files");
  }
  for (const forbidden of ["https://mdkg.dev/docs", "RAW_PROMPT", "RAW_PROVIDER_PAYLOAD", "npm_"]) {
    assertExcludes(llms + "\n" + llmsFull, forbidden, "llms files");
  }

  const normalSitemap = readText(path.join(siteDist, "sitemap.xml"));
  assertExcludes(normalSitemap, "https://mdkg.dev/docs/", "normal sitemap");
  assertExcludes(normalSitemap, "vercel.app", "normal sitemap");
  assertExcludes(normalSitemap, "demo-", "normal sitemap");

  buildMarketing({ VERCEL_ENV: "preview" });
  buildDocs({ VERCEL_ENV: "preview" });
  const previewHome = readText(path.join(siteDist, "index.html"));
  const previewDocsHome = readText(path.join(docsDist, "index.html"));
  assertIncludes(previewHome, 'name="robots" content="noindex, nofollow"', "preview marketing");
  assertIncludes(previewDocsHome, 'name="robots" content="noindex, nofollow"', "preview docs");

  buildSite();
  buildDocs();
  const productionHome = readText(path.join(siteDist, "index.html"));
  const productionDocsHome = readText(path.join(docsDist, "index.html"));
  assertIncludes(productionHome, 'name="robots" content="index, follow"', "normal marketing");
  assertExcludes(productionDocsHome, 'name="robots" content="noindex, nofollow"', "normal docs");

  assertNoHighRiskMarkers([
    path.join(repoRoot, "mdkg-dev", "src"),
    path.join(repoRoot, "docs", "src"),
    path.join(repoRoot, "docs", "advanced-alpha"),
  ]);
  console.log("mdkg-dev pass-2 polish smoke passed");
}

main();
