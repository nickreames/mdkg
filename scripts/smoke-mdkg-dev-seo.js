#!/usr/bin/env node

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
  assert(home.includes('property="og:image"'), "homepage missing Open Graph image");
  assert(home.includes('name="twitter:card" content="summary_large_image"'), "homepage missing Twitter card");

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
    "https://mdkg.dev/docs/",
    "https://mdkg.dev/llms.txt",
    "https://mdkg.dev/llms-full.txt",
  ]) {
    assert(sitemap.includes(`<loc>${loc}</loc>`), `sitemap missing ${loc}`);
  }
  assert(!sitemap.includes("demo-"), "sitemap must not include future demo subdomains");
  assert(!sitemap.includes("vercel.app"), "sitemap must not include preview deployment URLs");

  const robots = readText(path.join(dist, "robots.txt"));
  assert(robots.includes("User-agent: *"), "robots missing user-agent");
  assert(robots.includes("Sitemap: https://mdkg.dev/sitemap.xml"), "robots missing sitemap");

  const llms = readText(path.join(dist, "llms.txt"));
  const llmsFull = readText(path.join(dist, "llms-full.txt"));
  assert(llms.includes("mdkg"), "llms.txt missing mdkg summary");
  assert(llmsFull.includes("Safety boundaries"), "llms-full.txt missing safety boundaries");
  assert(llmsFull.includes("not an autonomous execution runtime"), "llms-full.txt missing execution boundary");

  assertExists(path.join(dist, "social-card.svg"));
  assertNoHighRiskMarkers([dist, path.join(repoRoot, "mdkg-dev", "CLAIMS.md")]);
  console.log("mdkg-dev SEO smoke passed");
}

main();
