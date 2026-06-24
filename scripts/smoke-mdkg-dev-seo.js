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
} = require("./mdkg-dev-smoke-utils");

function extractJsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(match, "homepage missing JSON-LD script");
  return JSON.parse(match[1]);
}

function main() {
  buildSite();

  const dist = path.join(repoRoot, "mdkg-dev", "dist");
  const home = readText(path.join(dist, "index.html"));
  assert(home.includes('<link rel="canonical" href="https://mdkg.dev/'), "homepage missing canonical URL");
  assert(home.includes('name="robots" content="index, follow"'), "homepage missing index/follow robots metadata for normal build");
  assert(home.includes('name="theme-color" content="#ffffff"'), "homepage missing theme-color metadata");
  assert(home.includes('property="og:site_name" content="Markdown Knowledge Graph"'), "homepage missing og site name");
  assert(home.includes('property="og:image"'), "homepage missing Open Graph image");
  assert(home.includes('property="og:image:alt"'), "homepage missing Open Graph image alt text");
  assert(home.includes('name="twitter:card" content="summary_large_image"'), "homepage missing Twitter card");
  assert(home.includes('name="twitter:image:alt"'), "homepage missing Twitter image alt text");

  const jsonLd = extractJsonLd(home);
  assert(jsonLd["@type"] === "SoftwareApplication", "homepage JSON-LD type mismatch");
  assert(jsonLd.name === "Markdown Knowledge Graph", "homepage JSON-LD name mismatch");
  assert(jsonLd.alternateName === "mdkg", "homepage JSON-LD alternateName mismatch");

  const sitemap = readText(path.join(dist, "sitemap.xml"));
  for (const loc of [
    "https://mdkg.dev/",
    "https://mdkg.dev/quickstart/",
    "https://mdkg.dev/trust/",
    "https://mdkg.dev/alpha/",
    "https://mdkg.dev/llms.txt",
    "https://mdkg.dev/llms-full.txt",
  ]) {
    assert(sitemap.includes(`<loc>${loc}</loc>`), `sitemap missing ${loc}`);
  }
  assert(!sitemap.includes("https://mdkg.dev/docs/"), "sitemap must not include deleted marketing /docs bridge");
  assert(!sitemap.includes("demo-"), "sitemap must not include future demo subdomains");
  assert(!sitemap.includes("vercel.app"), "sitemap must not include preview deployment URLs");

  const robots = readText(path.join(dist, "robots.txt"));
  assert(robots.includes("User-agent: *"), "robots missing user-agent");
  assert(robots.includes("Allow: /"), "robots should allow normal public build");
  assert(robots.includes("Sitemap: https://mdkg.dev/sitemap.xml"), "robots missing sitemap");

  const baseLayoutSource = readText(path.join(repoRoot, "mdkg-dev", "src", "layouts", "BaseLayout.astro"));
  const robotsSource = readText(path.join(repoRoot, "mdkg-dev", "src", "pages", "robots.txt.ts"));
  for (const source of [baseLayoutSource, robotsSource]) {
    assert(source.includes("VERCEL_ENV") && source.includes("PUBLIC_MDKG_PREVIEW_NOINDEX"), "preview noindex policy missing from source");
  }
  assert(robotsSource.includes("Disallow: /"), "preview robots policy must disallow crawling");

  const llms = readText(path.join(dist, "llms.txt"));
  const llmsFull = readText(path.join(dist, "llms-full.txt"));
  assert(llms.includes("mdkg"), "llms.txt missing mdkg summary");
  assert(llmsFull.includes("Safety boundaries"), "llms-full.txt missing safety boundaries");
  assert(llmsFull.includes("not an autonomous execution runtime"), "llms-full.txt missing execution boundary");

  assertExists(path.join(dist, "social-card.svg"));
  const routeFiles = {
    "/": "index.html",
    "/quickstart/": "quickstart/index.html",
    "/trust/": "trust/index.html",
    "/alpha/": "alpha/index.html",
  };
  const docsBridge = readText(path.join(dist, "docs", "index.html"));
  assert(docsBridge.includes("Read the mdkg docs on the dedicated docs site"), "marketing /docs bridge missing docs handoff copy");
  assert(docsBridge.includes('name="robots" content="noindex, nofollow"'), "marketing /docs bridge must remain noindex");
  for (const [route, relPath] of Object.entries(routeFiles)) {
    const html = readText(path.join(dist, relPath));
    assert(html.includes(`href="https://mdkg.dev${route}`), `${route} missing canonical URL`);
    assert(html.includes("property=\"og:title\""), `${route} missing og title`);
    assert(html.includes("name=\"twitter:description\""), `${route} missing twitter description`);
  }
  const allHtml = Object.values(routeFiles).map((relPath) => readText(path.join(dist, relPath))).join("\n");
  for (const expected of [
    "https://github.com/nickreames/mdkg",
    "https://www.npmjs.com/package/mdkg",
    "https://docs.mdkg.dev",
    "/quickstart/",
    "/trust/",
    "/alpha/",
    "/llms.txt",
  ]) {
    assert(allHtml.includes(expected), `built pages missing expected link: ${expected}`);
  }
  const claims = readText(path.join(repoRoot, "mdkg-dev", "CLAIMS.md"));
  for (const expected of ["Owner", "Review status", "approved for public alpha", "blocked from public claim", "comprehensive secret scanning"]) {
    assert(claims.includes(expected), `claims matrix missing ${expected}`);
  }
  for (const unsafe of ["hosted queue is available", "executes workers automatically", "arbitrary SQL access", "production-ready for every team"]) {
    assert(!home.includes(unsafe), `homepage includes unsupported claim: ${unsafe}`);
    assert(!llmsFull.includes(unsafe), `llms-full includes unsupported claim: ${unsafe}`);
  }
  assertNoHighRiskMarkers([dist, path.join(repoRoot, "mdkg-dev", "CLAIMS.md")]);
  console.log("mdkg-dev SEO smoke passed");
}

main();
