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

function countMatches(source, pattern) {
  return (source.match(pattern) || []).length;
}

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

function buildDocs(env = {}) {
  run(NPM_CMD, ["--prefix", "docs", "run", "build"], { env });
}

function assertNoDuplicateToc(docsDist) {
  const pages = walkHtmlIndexFiles(docsDist);
  assert(pages.length >= 20, "docs build produced too few rendered pages");
  for (const filePath of pages) {
    const html = readText(filePath);
    const rel = path.relative(docsDist, filePath);
    assert(countMatches(html, /On this page/g) <= 1, `${rel} renders duplicate On this page labels`);
    assert(!html.includes("starlight__mobile-toc"), `${rel} renders Starlight mobile TOC markup`);
  }
}

function main() {
  run(NPM_CMD, ["run", "docs:check-commands"]);
  buildSite();
  buildDocs();

  const siteDist = path.join(repoRoot, "mdkg-dev", "dist");
  const docsDist = path.join(repoRoot, "docs", "dist");
  const home = readText(path.join(siteDist, "index.html"));
  const llms = readText(path.join(siteDist, "llms.txt"));
  const llmsFull = readText(path.join(siteDist, "llms-full.txt"));
  const docsHomeSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "index.md"));
  const docsHome = readText(path.join(docsDist, "index.html"));
  const demoGraphs = readText(path.join(repoRoot, "docs", "src", "content", "docs", "advanced-alpha", "demo-graphs.md"));
  const repositoryLayout = readText(path.join(docsDist, "concepts", "repository-layout", "index.html"));
  const workNodeTypes = readText(path.join(docsDist, "concepts", "work-node-types", "index.html"));
  const generatedCli = readText(path.join(repoRoot, "docs", "_generated", "cli-reference.md"));
  const roadmap = readText(path.join(docsDist, "project", "roadmap", "index.html"));
  const globalCss = readText(path.join(repoRoot, "mdkg-dev", "src", "styles", "global.css"));
  const homepageSource = readText(path.join(repoRoot, "mdkg-dev", "src", "pages", "index.astro"));

  for (const expected of [
    "Plan -&gt; Work -&gt; Evidence",
    "01 / Plan",
    "02 / Work",
    "03 / Evidence",
    "one reviewable graph, one packable handoff, one validation loop",
    "The public model is intentionally small",
    "Bigger context helps. It does not replace project memory.",
    "First-success path",
  ]) {
    assertIncludes(home, expected, "homepage launch-quality copy");
  }
  assertIncludes(homepageSource, ".pwe-card:not(:last-child)::after", "homepage Plan -> Work -> Evidence connector");
  assertIncludes(homepageSource, "rotate(90deg)", "homepage mobile Plan -> Work -> Evidence connector");

  for (const expected of [
    "Markdown Knowledge Graph (mdkg)",
    "Plan -> Work -> Evidence",
    "Agent-readable paths",
    "docs.mdkg.dev",
    "mdkg goal next",
    "mdkg pack WORK_ID",
  ]) {
    assertIncludes(llms + "\n" + llmsFull, expected, "agent-readable text");
  }
  assertIncludes(llms, "\n## Core promise\n", "llms.txt should preserve Markdown headings");
  assertIncludes(llmsFull, "\n## What mdkg is\n", "llms-full.txt should preserve Markdown headings");
  assertIncludes(llmsFull, "\n## Safety boundaries\n", "llms-full.txt should preserve Markdown headings");
  assertExcludes(llms + "\n" + llmsFull, "<html", "agent-readable text");

  assertIncludes(docsHome, "Human quickstart", "docs homepage routing");
  assertIncludes(docsHome, "Agent quickstart", "docs homepage routing");
  assertIncludes(docsHome, "mdkg goal claim GOAL_ID WORK_ID", "docs homepage routing");
  assert(
    countMatches(docsHomeSource, /mdkg status\nmdkg goal current\nmdkg goal next/g) === 1,
    "docs homepage should not duplicate the agent command block"
  );
  assertNoDuplicateToc(docsDist);

  for (const expected of [
    "mdkg validate --json",
    "mdkg goal next goal-1 --json",
    "mdkg pack spike-1 --profile concise --dry-run --stats",
    "Validation returns `ok: true`.",
    "Capability search finds the pack-first skill.",
  ]) {
    assertIncludes(demoGraphs, expected, "demo first-success path");
  }

  for (const expected of [
    "Commit as durable source",
    "Review before committing",
    "Keep local or rebuildable",
    ".mdkg/db/runtime/",
    ".agents/skills/",
  ]) {
    assertIncludes(repositoryLayout, expected, "responsive repository layout");
  }
  assertExcludes(repositoryLayout, "<table", "repository layout should avoid cramped tables");
  assertIncludes(workNodeTypes, "Common mistake", "work node types");
  assertIncludes(workNodeTypes, "Valid minimal goal frontmatter", "work node types");

  for (const expected of [
    "broad user-facing command reference",
    "### When to use",
    "### Examples",
    "### Output and safety",
    "Mode: Read-only command",
    "Mode: Mutating command",
  ]) {
    assertIncludes(generatedCli, expected, "generated CLI reference");
  }
  assertIncludes(generatedCli, "## handoff", "generated CLI reference");
  assertIncludes(generatedCli, "mdkg handoff create <id-or-qid>", "generated CLI reference");
  assertExcludes(generatedCli, "Do not hand-edit command metadata", "generated CLI reference");

  assertIncludes(globalCss, "@media (prefers-reduced-motion: reduce)", "reduced-motion CSS");
  assertIncludes(globalCss, "@media (forced-colors: active)", "forced-colors CSS");

  for (const forbidden of [
    "GitBook",
    "Claims Evidence Matrix",
    "should be documented",
    "Public docs should",
    "The documentation rule",
    "roadmap source of truth",
    "production DNS cutover",
    "analytics activation",
  ]) {
    assertExcludes(home + "\n" + docsHome + "\n" + roadmap + "\n" + generatedCli, forbidden, "public surface");
  }

  assertNoHighRiskMarkers([
    path.join(repoRoot, "mdkg-dev", "src"),
    path.join(repoRoot, "docs", "src"),
    path.join(repoRoot, "docs", "_generated"),
  ]);

  console.log("mdkg-dev pass-4 polish smoke passed");
}

main();
