#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  NPM_CMD,
  assert,
  buildSite,
  repoRoot,
  run,
  walkFiles,
} = require("./mdkg-dev-smoke-utils");

function buildDocs() {
  run(NPM_CMD, ["--prefix", "docs", "run", "build"]);
}

function bytesFor(files) {
  return files.reduce((sum, filePath) => sum + fs.statSync(filePath).size, 0);
}

function filesWithExt(root, ext) {
  return walkFiles(root).filter((filePath) => filePath.endsWith(ext));
}

function largest(files) {
  return files
    .map((filePath) => ({ path: path.relative(repoRoot, filePath), bytes: fs.statSync(filePath).size }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
}

function assertBudget(label, actual, limit) {
  assert(actual <= limit, `${label} budget exceeded: ${actual} > ${limit}`);
}

function main() {
  buildSite();
  buildDocs();

  const siteDist = path.join(repoRoot, "mdkg-dev", "dist");
  const docsDist = path.join(repoRoot, "docs", "dist");
  const siteFiles = walkFiles(siteDist);
  const docsFiles = walkFiles(docsDist);
  const siteHtml = filesWithExt(siteDist, ".html");
  const docsHtml = filesWithExt(docsDist, ".html");
  const siteJs = filesWithExt(siteDist, ".js");
  const docsJs = filesWithExt(docsDist, ".js");
  const siteCss = filesWithExt(siteDist, ".css");
  const docsCss = filesWithExt(docsDist, ".css");

  const metrics = {
    marketing_total_bytes: bytesFor(siteFiles),
    docs_total_bytes: bytesFor(docsFiles),
    marketing_js_bytes: bytesFor(siteJs),
    docs_js_bytes: bytesFor(docsJs),
    marketing_css_bytes: bytesFor(siteCss),
    docs_css_bytes: bytesFor(docsCss),
    largest_marketing_files: largest(siteFiles),
    largest_docs_files: largest(docsFiles),
  };

  assertBudget("marketing total", metrics.marketing_total_bytes, 250_000);
  assertBudget("docs total", metrics.docs_total_bytes, 3_500_000);
  assertBudget("marketing JavaScript", metrics.marketing_js_bytes, 25_000);
  assertBudget("docs JavaScript", metrics.docs_js_bytes, 750_000);
  assertBudget("marketing CSS", metrics.marketing_css_bytes, 80_000);
  assertBudget("docs CSS", metrics.docs_css_bytes, 350_000);

  for (const filePath of siteHtml) {
    assertBudget(path.relative(repoRoot, filePath), fs.statSync(filePath).size, 120_000);
  }
  for (const filePath of docsHtml) {
    assertBudget(path.relative(repoRoot, filePath), fs.statSync(filePath).size, 300_000);
  }

  console.log(JSON.stringify({ ok: true, ...metrics }, null, 2));
}

main();
