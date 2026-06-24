#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  NPM_CMD,
  assert,
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

function main() {
  buildSite();
  buildDocs();

  const siteDist = path.join(repoRoot, "mdkg-dev", "dist");
  const docsDist = path.join(repoRoot, "docs", "dist");

  const home = readText(path.join(siteDist, "index.html"));
  const quickstart = readText(path.join(siteDist, "quickstart", "index.html"));
  const docsBridge = readText(path.join(siteDist, "docs", "index.html"));
  const llms = readText(path.join(siteDist, "llms.txt"));
  const llmsFull = readText(path.join(siteDist, "llms-full.txt"));
  const sitemap = readText(path.join(siteDist, "sitemap.xml"));
  const docsHome = readText(path.join(docsDist, "index.html"));
  const workNodeTypes = readText(path.join(docsDist, "concepts", "work-node-types", "index.html"));
  const referenceTypes = readText(path.join(docsDist, "concepts", "work-context-evidence", "index.html"));
  const repositoryLayout = readText(path.join(docsDist, "concepts", "repository-layout", "index.html"));
  const agentWorkflow = readText(path.join(docsDist, "guides", "agent-workflow", "index.html"));
  const packsHandoffs = readText(path.join(docsDist, "guides", "packs-and-handoffs", "index.html"));
  const referenceHome = readText(path.join(docsDist, "reference", "index.html"));
  const commandContract = readText(path.join(docsDist, "reference", "command-contract", "index.html"));
  const roadmap = readText(path.join(docsDist, "project", "roadmap", "index.html"));
  const readme = readText(path.join(repoRoot, "README.md"));
  const rootPackage = JSON.parse(readText(path.join(repoRoot, "package.json")));
  const marketingPackage = JSON.parse(readText(path.join(repoRoot, "mdkg-dev", "package.json")));
  const docsPackage = JSON.parse(readText(path.join(repoRoot, "docs", "package.json")));
  const githubHandoff = readText(path.join(repoRoot, ".mdkg", "handoffs", "github-metadata-pass-3.md"));
  const demoScriptFollowup = readText(path.join(repoRoot, ".mdkg", "work", "task-532-author-deterministic-mdkg-terminal-demo-script.md"));
  const demoProofFollowup = readText(path.join(repoRoot, ".mdkg", "work", "task-533-harden-demo-graph-public-proof-path-before-canonical-linking.md"));
  const baseLayoutSource = readText(path.join(repoRoot, "mdkg-dev", "src", "layouts", "BaseLayout.astro"));
  const docsConfigSource = readText(path.join(repoRoot, "docs", "astro.config.mjs"));

  for (const expected of [
    "mdkg --version",
    "mdkg show WORK_ID",
    "mdkg pack WORK_ID",
    "mdkg handoff create WORK_ID",
    "mdkg task done TASK_ID --checkpoint",
    "no hosted index, daemon, or vector database is required",
    "First-success path",
    "Goals, epics, and features",
    "Advanced surfaces stay optional",
    "goal-1",
    "task-1",
    "archive://research-notes",
  ]) {
    assertIncludes(home + "\n" + quickstart, expected, "public command examples");
  }

  for (const forbidden of [
    "mdkg task done WORK_ID",
    "goal-32",
    "goal-30",
    "task-490",
    "task-491",
    "test-228",
    "GitBook",
    "Repo-owned docs, rendered with Starlight",
    "Claims Evidence Matrix",
    "planned launch surfaces",
  ]) {
    assertExcludes(home + "\n" + quickstart + "\n" + docsHome, forbidden, "public copy");
  }

  assertIncludes(docsBridge, "Redirecting to: https://docs.mdkg.dev/", "marketing /docs redirect");
  assertIncludes(docsBridge, 'http-equiv="refresh"', "marketing /docs redirect");
  assertIncludes(docsBridge, 'name="robots" content="noindex"', "marketing /docs redirect");
  assertIncludes(baseLayoutSource, "PUBLIC_MDKG_PREVIEW_NOINDEX", "marketing preview noindex policy");
  assertIncludes(docsConfigSource, "PUBLIC_MDKG_PREVIEW_NOINDEX", "docs preview noindex policy");
  assertExcludes(sitemap, "https://mdkg.dev/docs/", "sitemap");
  assertExcludes(sitemap, "vercel.app", "sitemap");

  assertIncludes(referenceHome, "Use this section when you know what you want to do", "reference home");
  assertIncludes(referenceHome, "Common command groups", "reference home");
  assertIncludes(referenceHome, "mdkg goal claim GOAL_ID WORK_ID", "reference home");
  assertIncludes(referenceHome, "mdkg db queue contract --json", "reference home");
  assertIncludes(referenceHome, "Generated CLI Reference", "reference home");
  assertIncludes(referenceHome, "Integration metadata", "reference home");
  assertIncludes(commandContract, "maintainer and integration surface", "command contract");
  assertIncludes(commandContract, "Most users should start with the generated CLI reference", "command contract");

  const coreDocs = [docsHome, workNodeTypes, referenceTypes, repositoryLayout, agentWorkflow, packsHandoffs].join("\n");
  for (const expected of [
    "Choose your first path",
    "Human quickstart",
    "Agent quickstart",
    "mdkg goal claim GOAL_ID WORK_ID",
    "Use scope_refs for work to do",
    "Use context_refs for knowledge",
    "Use evidence_refs for proof",
    "Commit as durable source",
    "Keep local or rebuildable",
    "Skill mirrors",
    "Copy this into an agent session",
    "Multi-repo rule",
    "Use a pack when working",
    "Use a handoff when transferring",
  ]) {
    assertIncludes(coreDocs, expected, "core docs");
  }

  assertExcludes(coreDocs, "docs/src/content/docs/src/content/docs", "core docs edit links");

  for (const forbidden of ["Vercel", "DNS", "analytics activation", "production deployment", "production DNS cutover"]) {
    assertExcludes(roadmap, forbidden, "public roadmap");
  }

  for (const source of [
    readme,
    rootPackage.description,
    marketingPackage.description,
    docsPackage.description,
    githubHandoff,
  ]) {
    assertIncludes(source, "Git-native project memory for AI coding agents", "public copy parity");
  }
  assertIncludes(readme, "npm install -g mdkg", "README install");
  assertIncludes(readme, "mdkg --version", "README install");
  assertExcludes(readme, "pnpm add -g mdkg", "README install");
  assertIncludes(githubHandoff, "Do not use Vercel preview URLs as long-term GitHub metadata", "GitHub metadata handoff");
  assertIncludes(githubHandoff, "No GitHub settings mutation is included in pass 3", "GitHub metadata handoff");
  assertIncludes(demoScriptFollowup, "mdkg handoff create", "demo terminal follow-up");
  assertIncludes(demoProofFollowup, "smoke:demo-graph", "demo graph follow-up");
  assertExcludes(home + "\n" + docsHome, "unfinished demos are production-ready", "public demo copy");

  assertIncludes(llms + "\n" + llmsFull, "Plan -> Work -> Evidence", "llms files");
  assertIncludes(llmsFull, "mdkg goal claim GOAL_ID WORK_ID", "llms-full");
  assertExcludes(llms + "\n" + llmsFull, "https://mdkg.dev/docs", "llms files");

  const terminalSource = readText(path.join(repoRoot, "mdkg-dev", "src", "components", "TerminalBlock.astro"));
  assertIncludes(terminalSource, 'commands.join("\\n")', "TerminalBlock source");
  assertIncludes(terminalSource, "white-space: pre", "TerminalBlock source");

  assertNoHighRiskMarkers([
    path.join(repoRoot, "mdkg-dev", "src"),
    path.join(repoRoot, "docs", "src"),
    path.join(repoRoot, "docs", "SUMMARY.md"),
  ]);

  console.log("mdkg-dev pass-3 polish smoke passed");
}

main();
