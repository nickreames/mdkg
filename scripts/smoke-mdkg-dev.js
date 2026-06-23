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

