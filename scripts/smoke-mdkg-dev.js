#!/usr/bin/env node

const fs = require("node:fs");
const crypto = require("node:crypto");
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

function assertNotContains(text, forbidden, label) {
  assert(!text.includes(forbidden), `${label} should not contain ${forbidden}`);
}

function assertParity(source, expected, label) {
  for (const item of expected) {
    assertContains(source, item, label);
  }
}

function assertReadablePlainText(source, label) {
  const lines = source.split("\n");
  assert(lines.length >= 20, `${label} should preserve line breaks`);
  assert(lines.some((line) => line.startsWith("## ")), `${label} missing markdown headings`);
  assert(lines.some((line) => line.startsWith("- ")), `${label} missing bullet lines`);
  assert(lines.some((line) => line.startsWith("1. ")), `${label} missing numbered path lines`);
  const longLines = lines.filter((line) => line.length > 140);
  assert(longLines.length === 0, `${label} has long collapsed lines: ${longLines.join(" | ")}`);
}

function main() {
  const releaseManifestPath = path.join(repoRoot, "release", "public-release.json");
  const releaseManifestBefore = fs.readFileSync(releaseManifestPath);
  const releaseManifestHashBefore = crypto.createHash("sha256").update(releaseManifestBefore).digest("hex");

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
  assert(home.includes("Customize standards without forking the kernel"), "homepage missing customization section");
  assert(home.includes("Team customization"), "homepage missing customization badge");
  assert(home.includes("Use repo-local config overlays, managed skills, and core docs"), "homepage missing user-facing customization copy");
  assert(home.includes("Upgradable kernel"), "homepage missing upgradable kernel card");
  for (const forbidden of ["launch track", "postpublish", "postdeploy", "production launch", "release-readiness surface"]) {
    assertNotContains(home, forbidden, "homepage public copy");
  }
  for (const dormantReleaseText of [
    "New in v0.5.0",
    "Reusable loops for work that spans more than one goal.",
    "Run a security audit loop",
    "https://docs.mdkg.dev/loops/",
  ]) {
    assertNotContains(home, dormantReleaseText, "dormant homepage");
  }
  assert(home.includes(".mdkg/config.json"), "homepage missing config overlay copy");
  assert(home.includes("Custom skill mirrors"), "homepage missing custom skill mirror copy");
  assert(home.includes("COLLABORATION.md"), "homepage missing collaboration profile copy");
  assert(home.includes("<main"), "homepage missing main landmark");
  assert(home.includes("<nav"), "homepage missing nav landmark");
  assert(home.includes("<footer"), "homepage missing footer landmark");
  const docsRedirect = readText(path.join(dist, "docs", "index.html"));
  assert(docsRedirect.includes("Redirecting to: https://docs.mdkg.dev/"), "marketing /docs redirect missing canonical docs target");
  assert(docsRedirect.includes('http-equiv="refresh"'), "marketing /docs redirect missing static redirect fallback");
  assert(docsRedirect.includes('name="robots" content="noindex"'), "marketing /docs redirect should be noindex");
  const vercelConfig = JSON.parse(readText(path.join(repoRoot, "mdkg-dev", "vercel.json")));
  assert(
    vercelConfig.redirects.some((entry) => entry.source === "/docs" && entry.destination === "https://docs.mdkg.dev/" && entry.permanent === true),
    "Vercel config missing permanent /docs redirect"
  );

  const quickstart = readText(path.join(dist, "quickstart", "index.html"));
  const llms = readText(path.join(dist, "llms.txt"));
  const llmsFull = readText(path.join(dist, "llms-full.txt"));
  for (const dormantReleaseText of ["## Reusable loops", "v0.5.0", "docs.mdkg.dev/loops/"]) {
    assertNotContains(llms, dormantReleaseText, "dormant llms.txt");
    assertNotContains(llmsFull, dormantReleaseText, "dormant llms-full.txt");
  }
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
      expected: [
        "mdkg init --agent",
        "mdkg pack WORK_ID",
        "Plan",
        "Work",
        "Evidence",
        "context_refs",
        "evidence_refs",
        "mdkg handoff create WORK_ID",
        "Bigger context helps. It does not replace project memory.",
        "One concrete change: the agent starts from work, not vibes.",
        "one reviewable graph, one packable handoff, one validation loop",
        "Without mdkg",
        "With mdkg",
        "Team customization",
        "Upgradable kernel",
        "Customize standards without forking the kernel.",
        ".mdkg/config.json",
        "Custom skill mirrors",
        "COLLABORATION.md",
        "MANIFEST.md",
        "Try it on a small repo first.",
      ],
    },
    {
      label: "llms.txt",
      source: llms,
      expected: ["mdkg init --agent", "mdkg pack WORK_ID", "mdkg handoff create WORK_ID", "GOAL_ID", "Read AGENT_START.md", "Validate with mdkg validate before closeout"],
    },
    {
      label: "llms-full.txt",
      source: llmsFull,
      expected: ["Safety boundaries", "not an autonomous execution runtime", "WORK_ID", "TASK_ID", "Canonical agent path", "mdkg goal claim GOAL_ID WORK_ID"],
    },
  ];
  for (const { source, expected, label } of parityChecks) {
    assertParity(source, expected, label);
  }

  assertReadablePlainText(llms, "llms.txt");
  assertReadablePlainText(llmsFull, "llms-full.txt");
  assertContains(llms, "3. Inspect the current goal with mdkg goal current.", "llms.txt canonical agent path");
  assertContains(llms, "5. Show and pack one work node with mdkg show WORK_ID and mdkg pack WORK_ID.", "llms.txt canonical agent path");
  assertContains(llmsFull, "7. Record evidence with checkpoints, handoffs, or task updates.", "llms-full.txt canonical agent path");
  assert(!home.includes("Who it is for"), "homepage should move repetitive audience detail out of the public landing flow");
  assert(!home.includes("Trust gates"), "homepage should move detailed trust gate content into docs");

  const generatedJs = walkFiles(path.join(dist, "_astro")).filter((file) => file.endsWith(".js"));
  assert(generatedJs.length === 0, "static site should not emit client JavaScript before React islands are needed");

  assertNoHighRiskMarkers([
    path.join(repoRoot, "mdkg-dev", "src"),
    path.join(repoRoot, "mdkg-dev", "public"),
    dist,
  ]);

  buildSite({ PUBLIC_MDKG_RELEASE_PREVIEW: "1" });
  const previewHome = readText(path.join(dist, "index.html"));
  const previewLlms = readText(path.join(dist, "llms.txt"));
  const previewLlmsFull = readText(path.join(dist, "llms-full.txt"));
  const previewRobots = readText(path.join(dist, "robots.txt"));
  assertContains(previewHome, 'name="robots" content="noindex, nofollow"', "release preview homepage");
  for (const releaseAnnouncementText of [
    "New in v0.5.0 · Pre-v1 public alpha",
    "Reusable loops for work that spans more than one goal.",
    "Run a security audit loop",
    "Learn how loops work",
    "mdkg loop fork security-audit --scope . --dry-run",
    "mdkg loop plan LOOP_ID",
    "mdkg loop next LOOP_ID",
    "mdkg loop runs LOOP_ID",
  ]) {
    assertContains(previewHome, releaseAnnouncementText, "release preview homepage announcement");
  }
  assertNotContains(previewHome, "mdkg note add", "release preview homepage announcement");
  assertContains(previewRobots, "Disallow: /", "release preview robots");
  assertContains(previewLlms, "## Reusable loops", "release preview llms.txt");
  assertContains(previewLlms, "This preview does not claim npm availability.", "release preview llms.txt");
  assertContains(previewLlmsFull, "## Reusable loop process model", "release preview llms-full.txt");
  assertContains(previewLlmsFull, "coding-agent harness executes agents and tools", "release preview llms-full.txt");
  for (const [label, source] of [
    ["release preview homepage", previewHome],
    ["release preview llms.txt", previewLlms],
    ["release preview llms-full.txt", previewLlmsFull],
  ]) {
    for (const forbidden of ["/Users/", "loop-5", "goal-61", "v0.5.0 is available", "npm install -g mdkg@0.5.0"]) {
      assertNotContains(source, forbidden, label);
    }
    assert(!/\bchk-(?:4\d{2}|[5-9]\d{2,})\b/.test(source), `${label} should not expose internal checkpoint ids`);
    assert(!/sha256:[a-f0-9]{64}/i.test(source), `${label} should not expose content hashes`);
  }

  const releaseManifestAfter = fs.readFileSync(releaseManifestPath);
  const releaseManifestHashAfter = crypto.createHash("sha256").update(releaseManifestAfter).digest("hex");
  assert(releaseManifestBefore.equals(releaseManifestAfter), "marketing builds mutated release manifest bytes");
  assert(releaseManifestHashBefore === releaseManifestHashAfter, "marketing builds changed release manifest hash");
  assertNoHighRiskMarkers([dist]);

  console.log(`mdkg-dev site smoke passed: ${requiredFiles.length} required files`);
}

main();
