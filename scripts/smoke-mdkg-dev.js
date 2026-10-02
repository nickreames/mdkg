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

function validateDemoFixtureRecords(records) {
  const ids = new Set();
  for (const record of records) {
    assert(record.id, "missing id");
    assert(!ids.has(record.id), `duplicate id: ${record.id}`);
    ids.add(record.id);
    assert(record.detailRoute === `/demo/${record.id}/`, `detail route drift: ${record.id}`);
    assert(record.outputRoute === `/demo/${record.id}/output/`, `output route drift: ${record.id}`);
    assert(!(record.listed === false && record.renderedInGallery === true), `listed policy drift: ${record.id}`);
    assert(!(record.noindex === true && record.renderedInSitemap === true), `noindex policy drift: ${record.id}`);
  }
}

function setFixturePath(target, dottedPath, value) {
  const parts = dottedPath.split(".");
  const leaf = parts.pop();
  let current = target;
  for (const part of parts) {
    current = current[Number.isInteger(Number(part)) ? Number(part) : part];
  }
  current[Number.isInteger(Number(leaf)) ? Number(leaf) : leaf] = value;
}

function validateProvenanceFixture(record) {
  const forbiddenKeys = /^(rawPrompt|rawPrompts|credentials|tokens|cookies|providerPayload|providerPayloads|privateContext)$/i;
  const visit = (value, label) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${label}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      assert(!forbiddenKeys.test(key), `forbidden field: ${label}.${key}`);
      visit(item, `${label}.${key}`);
    }
  };
  for (const label of ["sourceGoal", "executedGoal"]) {
    const goal = record[label];
    assert(
      goal &&
        goal.id &&
        goal.title &&
        goal.condition &&
        goal.summary &&
        goal.requirements.length > 0 &&
        goal.authority.length > 0 &&
        goal.tests.length > 0 &&
        goal.checkpoint.id &&
        goal.checkpoint.title &&
        /^sha256:[a-f0-9]{64}$/.test(goal.sourceHash),
      `incomplete ${label} provenance`
    );
  }
  assert(
    record.sourceGoal.sourceHash !== record.executedGoal.sourceHash,
    "source and executed goal provenance must be distinct"
  );
  assert(record.work.length > 0 && record.evidence.length > 0, "missing work or evidence");
  assert(!record.evidence.some((item) => item.status === "pending"), "pending public evidence");
  visit(record, "record");
}

function validateOutputComponentFixture(fixture) {
  const keys = new Set();
  for (const registration of fixture.registrations) {
    assert(!keys.has(registration.key), `duplicate component: ${registration.key}`);
    keys.add(registration.key);
    assert(registration.staticImport === true, `dynamic component: ${registration.key}`);
    assert(registration.clientHydrated === false, `client hydration: ${registration.key}`);
    assert(registration.source.endsWith(".astro"), `component must be Astro: ${registration.key}`);
  }
  for (const record of fixture.records) {
    assert(keys.has(record.outputComponent), `missing component: ${record.outputComponent}`);
  }
}

function validateVisibilityFixture(fixture) {
  const galleryIds = fixture.records.filter((record) => record.listed).map((record) => record.id);
  const sitemapRoutes = fixture.records
    .filter((record) => !record.noindex)
    .map((record) => record.detailRoute);
  const noindexIds = fixture.records.filter((record) => record.noindex).map((record) => record.id);
  const directRouteIds = fixture.records.map((record) => record.id);
  assert(
    JSON.stringify(galleryIds) === JSON.stringify(fixture.expectedGalleryIds),
    "visibility fixture gallery projection drift"
  );
  assert(
    JSON.stringify(sitemapRoutes) === JSON.stringify(fixture.expectedSitemapRoutes),
    "visibility fixture sitemap projection drift"
  );
  assert(
    JSON.stringify(noindexIds) === JSON.stringify(fixture.expectedNoindexIds),
    "visibility fixture noindex projection drift"
  );
  assert(
    JSON.stringify(directRouteIds) === JSON.stringify(fixture.expectedDirectRouteIds),
    "visibility fixture direct-route projection drift"
  );
}

function assertStaticDemoHtml(html, label, allowedScriptTypes = []) {
  for (const forbidden of [
    "astro-island",
    "component-url=",
    "renderer-url=",
    "data-astro-transition",
    "client:load",
    "client:idle",
    "client:visible",
    "client:media",
    "client:only",
  ]) {
    assertNotContains(html, forbidden, label);
  }
  const scriptTags = [...html.matchAll(/<script\b([^>]*)>/gi)].map((match) => match[1] || "");
  for (const attrs of scriptTags) {
    const typeMatch = attrs.match(/\btype=["']([^"']+)["']/i);
    const type = typeMatch ? typeMatch[1] : "";
    assert(
      allowedScriptTypes.includes(type),
      `${label} contains unexpected script type: ${type || "<missing>"}`
    );
    assert(!/\bsrc=["']/i.test(attrs), `${label} contains a runtime script source`);
  }
  for (const match of html.matchAll(/<(?:script|link|img|iframe)\b[^>]*(?:src|href)=["'](https?:\/\/[^"']+)["']/gi)) {
    assert(
      match[1].startsWith("https://mdkg.dev/"),
      `${label} contains a remote runtime asset: ${match[1]}`
    );
  }
}

function main() {
  const releaseManifestPath = path.join(repoRoot, "release", "public-release.json");
  const releaseManifestBefore = fs.readFileSync(releaseManifestPath);
  const releaseManifestHashBefore = crypto.createHash("sha256").update(releaseManifestBefore).digest("hex");
  const releaseManifest = JSON.parse(releaseManifestBefore.toString("utf8"));
  const releasePublished = releaseManifest.state === "published";

  buildSite();

  const dist = path.join(repoRoot, "mdkg-dev", "dist");
  const requiredFiles = [
    "index.html",
    "quickstart/index.html",
    "trust/index.html",
    "alpha/index.html",
    "docs/index.html",
    "demos/index.html",
    "demo/1/index.html",
    "demo/1/output/index.html",
    "demo/2/index.html",
    "demo/2/output/index.html",
    "demo/3/index.html",
    "demo/3/output/index.html",
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

  const demoFixtures = JSON.parse(
    readText(path.join(repoRoot, "scripts", "fixtures", "demo-registry-fixtures.json"))
  );
  validateVisibilityFixture(demoFixtures.visibility_matrix);
  validateDemoFixtureRecords(demoFixtures.reserved_records);
  for (const fixture of demoFixtures.negative_cases) {
    let error = null;
    try {
      validateDemoFixtureRecords(fixture.records);
    } catch (caught) {
      error = caught;
    }
    assert(error, `negative demo fixture did not fail: ${fixture.name}`);
    assert(
      error.message.toLowerCase().includes(fixture.expectedError),
      `negative demo fixture ${fixture.name} failed with unexpected error: ${error.message}`
    );
  }
  validateProvenanceFixture(demoFixtures.provenance_baseline);
  for (const fixture of demoFixtures.provenance_negative_cases) {
    const record = JSON.parse(JSON.stringify(demoFixtures.provenance_baseline));
    setFixturePath(record, fixture.mutation.path, fixture.mutation.value);
    let error = null;
    try {
      validateProvenanceFixture(record);
    } catch (caught) {
      error = caught;
    }
    assert(error, `negative provenance fixture did not fail: ${fixture.name}`);
    assert(
      error.message.toLowerCase().includes(fixture.expectedError.toLowerCase()),
      `negative provenance fixture ${fixture.name} failed with unexpected error: ${error.message}`
    );
  }
  validateOutputComponentFixture(demoFixtures.output_component_baseline);
  for (const fixture of demoFixtures.output_component_negative_cases) {
    const componentFixture = JSON.parse(JSON.stringify(demoFixtures.output_component_baseline));
    setFixturePath(componentFixture, fixture.mutation.path, fixture.mutation.value);
    let error = null;
    try {
      validateOutputComponentFixture(componentFixture);
    } catch (caught) {
      error = caught;
    }
    assert(error, `negative output-component fixture did not fail: ${fixture.name}`);
    assert(
      error.message.toLowerCase().includes(fixture.expectedError.toLowerCase()),
      `negative output-component fixture ${fixture.name} failed with unexpected error: ${error.message}`
    );
  }

  const demos = readText(path.join(dist, "demos", "index.html"));
  const demo1Detail = readText(path.join(dist, "demo", "1", "index.html"));
  const demo1Output = readText(path.join(dist, "demo", "1", "output", "index.html"));
  const demo2Detail = readText(path.join(dist, "demo", "2", "index.html"));
  const demo2Output = readText(path.join(dist, "demo", "2", "output", "index.html"));
  const demo3Detail = readText(path.join(dist, "demo", "3", "index.html"));
  const demo3Output = readText(path.join(dist, "demo", "3", "output", "index.html"));
  assertStaticDemoHtml(demos, "demo gallery", ["application/ld+json"]);
  assertStaticDemoHtml(demo1Detail, "Demo 1 detail", ["application/ld+json"]);
  assertStaticDemoHtml(demo1Output, "Demo 1 output");
  assertStaticDemoHtml(demo2Detail, "Demo 2 detail", ["application/ld+json"]);
  assertStaticDemoHtml(demo2Output, "Demo 2 output");
  assertStaticDemoHtml(demo3Detail, "Demo 3 detail", ["application/ld+json"]);
  assertStaticDemoHtml(demo3Output, "Demo 3 output");
  assertContains(demos, "Agent-ready website demo", "demo gallery");
  assertContains(demos, "/demo/1/", "demo gallery");
  assertNotContains(demos, "/demo/2/", "demo gallery");
  assertNotContains(demos, "/demo/3/", "demo gallery");
  assertContains(demo1Detail, "Sanitized mdkg graph", "Demo 1 detail");
  assertContains(demo1Detail, "/demo/1/output/", "Demo 1 detail");
  for (const expected of [
    "Reusable starting specification",
    "Specialized executed specification",
    "Plan",
    "Work",
    "Evidence",
    "What completed, why it mattered, and what comes next.",
    "Goal condition",
    "Requirements",
    "Authority",
    "Tests",
    "Source hash",
    "Why:",
    "What comes next",
  ]) {
    assertContains(demo1Detail, expected, "Demo 1 source/execution evidence");
  }
  assert(
    (demo1Detail.match(/goal-1/g) || []).length >= 2,
    "Demo 1 detail must show goal-1 at both reusable and specialized grains"
  );
  assert(
    (demo1Detail.match(/sha256:[a-f0-9]{64}/g) || []).length === 2,
    "Demo 1 detail must show exactly two sanitized goal provenance hashes"
  );
  assertContains(demo1Output, "Agent-ready demo websites from one mdkg goal.", "Demo 1 output");
  assertContains(demo2Detail, 'name="robots" content="noindex, nofollow"', "Demo 2 detail");
  assertContains(demo2Output, 'name="robots" content="noindex,nofollow"', "Demo 2 output");
  for (const expected of [
    "Reusable starting specification",
    "Specialized executed specification",
    "Plan → Work → Evidence",
    "What completed, why it mattered, and what comes next.",
    "Goal condition",
    "Requirements",
    "Authority",
    "Tests",
    "Source hash",
    "Why:",
    "What comes next",
  ]) {
    assertContains(demo2Detail, expected, "Demo 2 source/execution evidence");
  }
  assert(
    (demo2Detail.match(/goal-1/g) || []).length >= 2,
    "Demo 2 detail must show goal-1 at both reusable and specialized grains"
  );
  assert(
    (demo2Detail.match(/sha256:[a-f0-9]{64}/g) || []).length === 2,
    "Demo 2 detail must show exactly two sanitized goal provenance hashes"
  );
  assertContains(demo2Output, "Keep the plan when the agent changes.", "Demo 2 output");
  assertContains(demo2Output, "What completed", "Demo 2 output");
  assertContains(demo2Output, "Continuity beats reconstruction", "Demo 2 output");
  assertContains(demo2Output, "What comes next", "Demo 2 output");
  assertContains(demo3Detail, 'name="robots" content="noindex, nofollow"', "Demo 3 detail");
  assertContains(demo3Output, 'name="robots" content="noindex,nofollow"', "Demo 3 output");
  assertContains(demo3Detail, "Reusable starting specification", "Demo 3 detail");
  assertContains(demo3Detail, "Specialized executed specification", "Demo 3 detail");
  assertContains(demo3Detail, "Plan → Work → Evidence", "Demo 3 detail");
  assertContains(demo3Output, "Give every coding agent", "Demo 3 output");
  assertContains(demo3Output, "What completed", "Demo 3 output");
  assertContains(demo3Output, "What comes next", "Demo 3 output");
  for (const reserved of demoFixtures.reserved_records.filter((record) => !["2", "3"].includes(record.id))) {
    assert(
      !fs.existsSync(path.join(dist, "demo", reserved.id)),
      `fixture-only Demo ${reserved.id} must not produce public routes`
    );
  }
  assert(
    !fs.existsSync(path.join(repoRoot, "mdkg-dev", "src", "data", "demoSnapshots.ts")),
    "monolithic Demo 1 registry should be removed"
  );
  for (const rel of [
    ["mdkg-dev", "src", "data", "demos", "types.ts"],
    ["mdkg-dev", "src", "data", "demos", "demo-1.ts"],
    ["mdkg-dev", "src", "data", "demos", "demo-2.ts"],
    ["mdkg-dev", "src", "data", "demos", "demo-3.ts"],
    ["mdkg-dev", "src", "data", "demos", "index.ts"],
    ["mdkg-dev", "src", "components", "demos", "Demo2Output.astro"],
    ["mdkg-dev", "src", "components", "demos", "Demo3Output.astro"],
  ]) {
    assertExists(path.join(repoRoot, ...rel));
  }
  const outputRegistrySource = readText(
    path.join(repoRoot, "mdkg-dev", "src", "components", "demos", "outputRegistry.ts")
  );
  const outputRouteSource = readText(
    path.join(repoRoot, "mdkg-dev", "src", "pages", "demo", "[id]", "output.astro")
  );
  const demo1OutputSource = readText(
    path.join(repoRoot, "mdkg-dev", "src", "components", "demos", "Demo1Output.astro")
  );
  const demo2OutputSource = readText(
    path.join(repoRoot, "mdkg-dev", "src", "components", "demos", "Demo2Output.astro")
  );
  assertContains(outputRegistrySource, 'import Demo1Output from "./Demo1Output.astro"', "output registry");
  assertContains(outputRegistrySource, 'import Demo2Output from "./Demo2Output.astro"', "output registry");
  assertContains(outputRegistrySource, 'import Demo3Output from "./Demo3Output.astro"', "output registry");
  assertContains(outputRegistrySource, '"demo-1": Demo1Output', "output registry");
  assertContains(outputRegistrySource, '"demo-2": Demo2Output', "output registry");
  assertContains(outputRegistrySource, '"demo-3": Demo3Output', "output registry");
  assertNotContains(outputRegistrySource, "import(", "output registry");
  assertContains(outputRouteSource, "getDemoOutputComponent", "output route");
  assertContains(outputRouteSource, "<OutputComponent demo={demo} />", "output route");
  for (const source of [outputRegistrySource, outputRouteSource, demo1OutputSource, demo2OutputSource]) {
    assertNotContains(source, "client:", "static output component source");
  }
  const demoSourceFiles = walkFiles(path.join(repoRoot, "mdkg-dev", "src"))
    .filter((filePath) => {
      const normalized = filePath.split(path.sep).join("/");
      return normalized.includes("/pages/demo/") || normalized.includes("/components/demos/");
    })
    .map(readText);
  for (const source of demoSourceFiles) {
    assertNotContains(source, "client:", "demo source");
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
  const releaseAnnouncementText = [
    "New in v0.5.0",
    "Reusable loops for work that spans more than one goal.",
    "Run a security audit loop",
    "https://docs.mdkg.dev/loops/",
  ];
  for (const releaseText of releaseAnnouncementText) {
    if (releasePublished) {
      assertContains(home, releaseText, "published homepage");
    } else {
      assertNotContains(home, releaseText, "dormant homepage");
    }
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
  for (const [label, source, releaseHeading] of [
    ["llms.txt", llms, "## Reusable loops"],
    ["llms-full.txt", llmsFull, "## Reusable loop process model"],
  ]) {
    for (const releaseText of [
      releaseHeading,
      `v${releaseManifest.target_version}`,
      "docs.mdkg.dev/loops/",
    ]) {
      if (releasePublished) {
        assertContains(source, releaseText, `published ${label}`);
      } else {
        assertNotContains(source, releaseText, `dormant ${label}`);
      }
    }
  }
  if (releasePublished) {
    assertContains(llms, "The npm package is available.", "published llms.txt");
    assertContains(llmsFull, "The npm package is available.", "published llms-full.txt");
    assertNotContains(llms, "This preview does not claim npm availability.", "published llms.txt");
    assertNotContains(llmsFull, "Preview content does not claim npm availability.", "published llms-full.txt");
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
      expected: ["Node.js `>=24.18.0 <25`", "mdkg init --agent", "context_refs", "evidence_refs", "mdkg handoff create", "mdkg db queue contract --json"],
    },
    {
      label: "docs README",
      source: docsReadme,
      expected: ["repo-owned source", "source of truth"],
    },
    {
      label: "Starlight install docs",
      source: docsInstall,
      expected: ["Node.js `>=24.18.0 <25`", "npm install -g mdkg", "mdkg init --agent"],
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
      expected: ["Node 24.18+ within the Node 24 line", "GOAL_ID", "WORK_ID", "TASK_ID", "mdkg handoff create WORK_ID"],
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

  buildSite(releasePublished ? { VERCEL_ENV: "preview" } : { PUBLIC_MDKG_RELEASE_PREVIEW: "1" });
  const previewHome = readText(path.join(dist, "index.html"));
  const previewLlms = readText(path.join(dist, "llms.txt"));
  const previewLlmsFull = readText(path.join(dist, "llms-full.txt"));
  const previewRobots = readText(path.join(dist, "robots.txt"));
  assertContains(previewHome, 'name="robots" content="noindex, nofollow"', "release preview homepage");
  for (const releaseText of [
    "New in v0.5.0 · Pre-v1 public alpha",
    "Reusable loops for work that spans more than one goal.",
    "Run a security audit loop",
    "Learn how loops work",
    "mdkg loop fork security-audit --scope . --dry-run",
    "mdkg loop plan LOOP_ID",
    "mdkg loop next LOOP_ID",
    "mdkg loop runs LOOP_ID",
  ]) {
    assertContains(previewHome, releaseText, "release preview homepage announcement");
  }
  assertNotContains(previewHome, "mdkg note add", "release preview homepage announcement");
  assertContains(previewRobots, "Disallow: /", "release preview robots");
  assertContains(previewLlms, "## Reusable loops", "release preview llms.txt");
  assertContains(
    previewLlms,
    releasePublished ? "The npm package is available." : "This preview does not claim npm availability.",
    "release preview llms.txt",
  );
  assertContains(previewLlmsFull, "## Reusable loop process model", "release preview llms-full.txt");
  assertContains(previewLlmsFull, "coding-agent harness executes agents and tools", "release preview llms-full.txt");
  for (const [label, source] of [
    ["release preview homepage", previewHome],
    ["release preview llms.txt", previewLlms],
    ["release preview llms-full.txt", previewLlmsFull],
  ]) {
    const forbiddenValues = ["/Users/", "loop-5", "goal-61", "npm install -g mdkg@0.5.0"];
    if (!releasePublished) {
      forbiddenValues.push("v0.5.0 is available");
    }
    for (const forbidden of forbiddenValues) {
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
