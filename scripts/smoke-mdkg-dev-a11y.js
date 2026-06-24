#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  NPM_CMD,
  assert,
  buildSite,
  readText,
  repoRoot,
  run,
  walkFiles,
} = require("./mdkg-dev-smoke-utils");

function buildDocs() {
  run(NPM_CMD, ["--prefix", "docs", "run", "build"]);
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function attrValue(tag, name) {
  const pattern = new RegExp(`${name}=["']([^"']*)["']`, "i");
  const match = tag.match(pattern);
  return match ? match[1] : "";
}

function assertInteractiveLabels(html, label) {
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorPattern.exec(html)) !== null) {
    const attrs = match[1] || "";
    const body = match[2] || "";
    const text = stripTags(body);
    const ariaLabel = attrValue(attrs, "aria-label");
    const title = attrValue(attrs, "title");
    assert(text || ariaLabel || title, `${label} has a link without text, aria-label, or title`);
  }

  const buttonPattern = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  while ((match = buttonPattern.exec(html)) !== null) {
    const attrs = match[1] || "";
    const body = match[2] || "";
    const text = stripTags(body);
    const ariaLabel = attrValue(attrs, "aria-label");
    const title = attrValue(attrs, "title");
    assert(text || ariaLabel || title, `${label} has a button without text, aria-label, or title`);
  }
}

function assertImageAlt(html, label) {
  const imagePattern = /<img\b([^>]*)>/gi;
  let match;
  while ((match = imagePattern.exec(html)) !== null) {
    const attrs = match[1] || "";
    const ignored = /aria-hidden=["']true["']/i.test(attrs) || /role=["']presentation["']/i.test(attrs);
    assert(ignored || /\salt=["'][^"']*["']/i.test(attrs), `${label} has an image without alt text`);
  }
}

function assertPage(filePath, label) {
  const html = readText(filePath);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  assert(html.includes('<html lang="en"'), `${label} missing html lang`);
  assert(html.includes('name="viewport"'), `${label} missing viewport meta`);
  assert(/<title>[^<]{4,}<\/title>/i.test(html), `${label} missing useful title`);
  assert(/<meta name="description" content="[^"]{20,}"/i.test(html), `${label} missing useful description`);
  assert(h1Count === 1, `${label} should render exactly one h1, got ${h1Count}`);
  assert(!/aria-label=["']\s*["']/i.test(html), `${label} has an empty aria-label`);
  assert(!/href=["']#["']/i.test(html), `${label} has a placeholder # link`);
  assertInteractiveLabels(html, label);
  assertImageAlt(html, label);
}

function main() {
  buildSite();
  buildDocs();

  const siteDist = path.join(repoRoot, "mdkg-dev", "dist");
  const docsDist = path.join(repoRoot, "docs", "dist");
  const checkedPages = [
    ["marketing home", path.join(siteDist, "index.html")],
    ["marketing quickstart", path.join(siteDist, "quickstart", "index.html")],
    ["marketing trust", path.join(siteDist, "trust", "index.html")],
    ["marketing alpha", path.join(siteDist, "alpha", "index.html")],
    ["marketing docs bridge", path.join(siteDist, "docs", "index.html")],
    ["docs home", path.join(docsDist, "index.html")],
    ["docs install", path.join(docsDist, "start-here", "install", "index.html")],
    ["docs quickstart", path.join(docsDist, "start-here", "quickstart", "index.html")],
    ["docs work node types", path.join(docsDist, "concepts", "work-node-types", "index.html")],
    ["docs agent workflow", path.join(docsDist, "guides", "agent-workflow", "index.html")],
    ["docs reference", path.join(docsDist, "reference", "index.html")],
  ];

  for (const [label, filePath] of checkedPages) {
    assertPage(filePath, label);
  }

  const marketingCssSource = readText(path.join(repoRoot, "mdkg-dev", "src", "styles", "global.css"));
  assert(marketingCssSource.includes("@media (prefers-reduced-motion: reduce)"), "marketing CSS missing reduced-motion media query");
  assert(marketingCssSource.includes("scroll-behavior: auto"), "marketing CSS missing reduced-motion scroll override");
  assert(marketingCssSource.includes("@media (forced-colors: active)"), "marketing CSS missing forced-colors media query");
  assert(marketingCssSource.includes("CanvasText"), "marketing CSS missing forced-colors text token");
  assert(marketingCssSource.includes("LinkText"), "marketing CSS missing forced-colors link token");

  const builtCss = walkFiles(docsDist)
    .filter((filePath) => filePath.endsWith(".css"))
    .map(readText)
    .join("\n");
  assert(builtCss.includes("prefers-reduced-motion"), "docs CSS missing reduced-motion support");
  assert(builtCss.includes("forced-colors"), "docs CSS missing forced-colors support");

  console.log(JSON.stringify({ ok: true, checked_pages: checkedPages.length }, null, 2));
}

main();
