#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const {
  NPM_CMD,
  assert,
  assertExists,
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

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function relativeLuminance({ r, g, b }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const fg = relativeLuminance(hexToRgb(foreground));
  const bg = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function assertContrast(name, foreground, background, minimum = 4.5) {
  const ratio = contrastRatio(foreground, background);
  assert(ratio >= minimum, `${name} contrast ${ratio.toFixed(2)} below ${minimum}`);
}

function localHrefToFile(root, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || clean === "/") {
    return path.join(root, "index.html");
  }
  const withoutSlash = clean.replace(/^\//, "");
  if (path.extname(withoutSlash)) {
    return path.join(root, withoutSlash);
  }
  return path.join(root, withoutSlash, "index.html");
}

function assertLinks(html, label, root) {
  const anchorPattern = /<a\b([^>]*)>/gi;
  let match;
  while ((match = anchorPattern.exec(html)) !== null) {
    const attrs = match[1] || "";
    const href = attrValue(attrs, "href");
    if (!href || href.startsWith("#")) {
      continue;
    }
    assert(!href.startsWith("javascript:"), `${label} has javascript href`);
    assert(!href.startsWith("file:"), `${label} has file href`);
    if (href.startsWith("/")) {
      assertExists(localHrefToFile(root, href));
      continue;
    }
    if (/^https?:\/\//.test(href)) {
      assert(!href.includes("127.0.0.1") && !href.includes("localhost"), `${label} leaks local URL: ${href}`);
      const target = attrValue(attrs, "target");
      const rel = attrValue(attrs, "rel");
      if (target === "_blank") {
        assert(rel.includes("noopener") && rel.includes("noreferrer"), `${label} external _blank link missing noopener noreferrer: ${href}`);
      }
    }
  }
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
  const root = label.startsWith("docs ") ? path.join(repoRoot, "docs", "dist") : path.join(repoRoot, "mdkg-dev", "dist");
  assertLinks(html, label, root);
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
  assertContrast("body text on white", "#18181b", "#ffffff", 7);
  assertContrast("muted text on white", "#52525b", "#ffffff", 7);
  assertContrast("blue link on white", "#1d4ed8", "#ffffff", 4.5);
  assertContrast("white text on blue", "#ffffff", "#1d4ed8", 4.5);
  assertContrast("loop body on sky", "#3f3f46", "#f0f9ff", 7);
  assertContrast("loop rail body on navy", "#cbd5e1", "#0f172a", 7);
  assertContrast("loop command on command surface", "#e2e8f0", "#111827", 7);

  const announcementSource = readText(path.join(repoRoot, "mdkg-dev", "src", "components", "LoopAnnouncement.astro"));
  for (const requiredSource of [
    'aria-labelledby="loop-announcement-title"',
    '<ol class="process-rail"',
    "overflow-x: auto",
    "@media (max-width: 900px)",
    "@media (max-width: 560px)",
    "@media (forced-colors: active)",
    "min-height: 44px",
  ]) {
    assert(announcementSource.includes(requiredSource), `loop announcement missing accessibility contract: ${requiredSource}`);
  }

  buildSite({ PUBLIC_MDKG_RELEASE_PREVIEW: "1" });
  const previewHome = readText(path.join(siteDist, "index.html"));
  assertPage(path.join(siteDist, "index.html"), "marketing release preview home");
  assert(previewHome.includes('<section class="loop-announcement" aria-labelledby="loop-announcement-title"'), "loop announcement missing labeled section");
  assert(previewHome.includes('<h2 id="loop-announcement-title"'), "loop announcement missing h2 label target");
  assert(previewHome.includes('<ol class="process-rail" aria-label="Loop workflow"'), "loop announcement missing ordered process list");
  assert(previewHome.includes('href="https://docs.mdkg.dev/loops/security-audit/"'), "loop announcement missing security walkthrough CTA");
  assert(previewHome.includes('href="https://docs.mdkg.dev/loops/"'), "loop announcement missing overview link");
  const quickstartIndex = previewHome.indexOf("First, prove the loop locally.");
  const copyIndex = previewHome.indexOf("Reusable loops for work that spans more than one goal.");
  const primaryIndex = previewHome.indexOf("Run a security audit loop");
  const secondaryIndex = previewHome.indexOf("Learn how loops work");
  const railIndex = previewHome.indexOf('<ol class="process-rail"');
  const followingIndex = previewHome.indexOf("Bigger context helps. It does not replace project memory.");
  assert(
    quickstartIndex < copyIndex && copyIndex < primaryIndex && primaryIndex < secondaryIndex && secondaryIndex < railIndex && railIndex < followingIndex,
    "loop announcement source order or homepage insertion order is incorrect"
  );

  const builtCss = walkFiles(docsDist)
    .filter((filePath) => filePath.endsWith(".css"))
    .map(readText)
    .join("\n");
  assert(builtCss.includes("prefers-reduced-motion"), "docs CSS missing reduced-motion support");
  assert(builtCss.includes("forced-colors"), "docs CSS missing forced-colors support");

  console.log(JSON.stringify({ ok: true, checked_pages: checkedPages.length }, null, 2));
}

main();
