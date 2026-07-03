#!/usr/bin/env node

const path = require("node:path");
const {
  NODE_CMD,
  NPM_CMD,
  assert,
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

function buildDocs(env = {}) {
  run(NPM_CMD, ["--prefix", "docs", "run", "build"], { env });
}

function main() {
  const commandReceipt = JSON.parse(run(NODE_CMD, ["scripts/check-doc-command-examples.js"]).stdout);
  assert(commandReceipt.ok === true, "command example check did not pass");
  assert(commandReceipt.checked_examples >= 350, "command example check covered too few examples");
  assert(commandReceipt.placeholder_fence_examples >= 30, "placeholder fence coverage is unexpectedly low");
  assert(
    commandReceipt.placeholder_fence_context_examples === commandReceipt.placeholder_fence_examples,
    "every copyable placeholder command block must explain replacement context"
  );
  assert(commandReceipt.failed_examples === 0, "command example check reported failures");

  buildSite();
  buildDocs();

  const siteDist = path.join(repoRoot, "mdkg-dev", "dist");
  const docsDist = path.join(repoRoot, "docs", "dist");
  const home = readText(path.join(siteDist, "index.html"));
  const docsBridge = readText(path.join(siteDist, "docs", "index.html"));
  const llms = readText(path.join(siteDist, "llms.txt"));
  const llmsFull = readText(path.join(siteDist, "llms-full.txt"));
  const quickstartSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "start-here", "quickstart.md"));
  const agentWorkflowSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "guides", "agent-workflow.md"));
  const packsSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "guides", "packs-and-handoffs.md"));
  const referenceSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "reference", "index.md"));
  const generatedReferenceSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "reference", "generated-cli-reference.md"));
  const commandContractSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "reference", "command-contract.md"));
  const docsHomeSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "index.md"));
  const planWorkEvidenceSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "concepts", "plan-work-evidence.md"));
  const agentWorkflowSourceFull = readText(path.join(repoRoot, "docs", "src", "content", "docs", "guides", "agent-workflow.md"));
  const advancedAlphaSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "advanced-alpha", "overview.md"));
  const demoGraphsSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "advanced-alpha", "demo-graphs.md"));
  const troubleshootingSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "start-here", "troubleshooting.md"));
  const roadmapSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "project", "roadmap.md"));
  const changelogSource = readText(path.join(repoRoot, "docs", "src", "content", "docs", "project", "changelog.md"));
  const alphaSource = readText(path.join(repoRoot, "mdkg-dev", "src", "pages", "alpha.astro"));
  const legacyReferenceSource = readText(path.join(repoRoot, "docs", "reference", "README.md"));
  const legacyRoadmapSource = readText(path.join(repoRoot, "docs", "project", "roadmap.md"));
  const legacyChangelogSource = readText(path.join(repoRoot, "docs", "project", "changelog.md"));
  const legacyClaimsMatrixSource = readText(path.join(repoRoot, "docs", "project", "claims-evidence-matrix.md"));
  const quickstart = readText(path.join(docsDist, "start-here", "quickstart", "index.html"));
  const agentWorkflow = readText(path.join(docsDist, "guides", "agent-workflow", "index.html"));
  const packs = readText(path.join(docsDist, "guides", "packs-and-handoffs", "index.html"));
  const planWorkEvidence = readText(path.join(docsDist, "concepts", "plan-work-evidence", "index.html"));

  for (const source of [home, docsBridge, llms, llmsFull]) {
    assertIncludes(source, "https://docs.mdkg.dev/", "canonical docs link");
  }
  assertIncludes(docsBridge, "Redirecting to: https://docs.mdkg.dev/", "docs redirect");

  for (const source of [quickstartSource, agentWorkflowSource, packsSource, referenceSource]) {
    assertIncludes(source, "Replace", "placeholder replacement guidance");
    assertExcludes(source, "$ mdkg", "copyable command examples");
  }

  for (const source of [quickstart, agentWorkflow, packs]) {
    assertIncludes(source, "Replace", "rendered placeholder replacement guidance");
    assertExcludes(source, "$ mdkg", "rendered copyable command examples");
  }

  for (const expected of [
    "Expected receipt shape",
    "A new repo can validate successfully while `mdkg goal next` returns no node",
    "If no work exists yet",
    "mdkg task done TASK_ID --checkpoint \"Done\"",
  ]) {
    assertIncludes(quickstartSource, expected, "first-success quickstart");
  }
  assertIncludes(docsHomeSource, "demo graph first-success path", "docs home demo routing");
  assertIncludes(demoGraphsSource, "mdkg pack spike-1 --profile concise --dry-run --stats", "demo graph canonical pack command");
  assertIncludes(demoGraphsSource, "not canonical public launch proof", "demo graph launch boundary");
  assertIncludes(troubleshootingSource, "`node: null` can simply mean no work exists yet", "no-work-yet troubleshooting");
  assertExcludes(quickstartSource + "\n" + demoGraphsSource, "--pack-profile concise", "hand-authored public examples");

  assertIncludes(referenceSource, "Common command groups", "user-facing reference home");
  assertIncludes(referenceSource, "Choose by job", "user-facing reference job chooser");
  assertIncludes(generatedReferenceSource, "This page is the readable entrypoint", "generated reference wrapper");
  assertIncludes(commandContractSource, "maintainer and integration surface", "command contract boundary");
  assertIncludes(legacyReferenceSource, "Most users should start with the generated CLI reference", "legacy reference mirror");
  assertIncludes(legacyClaimsMatrixSource, "internal evidence aid", "claims matrix internal boundary");
  for (const source of [referenceSource, generatedReferenceSource, commandContractSource, roadmapSource, changelogSource, legacyReferenceSource, legacyRoadmapSource, legacyChangelogSource, alphaSource]) {
    assertExcludes(source, "will hold", "public scaffold commentary");
    assertExcludes(source, "Task-448", "public task commentary");
    assertExcludes(source, "semi-generated", "public meta commentary");
  }
  for (const source of [roadmapSource, legacyRoadmapSource]) {
    assertExcludes(source, "DNS", "public roadmap launch chores");
    assertExcludes(source, "analytics activation", "public roadmap launch chores");
    assertExcludes(source, "production deployment", "public roadmap launch chores");
  }
  assertExcludes(changelogSource + "\n" + legacyChangelogSource, "bookkeeping", "public changelog meta commentary");
  assertIncludes(changelogSource, "release-grid", "public changelog release cards");
  assertIncludes(changelogSource, "0.4.1 details", "public changelog latest release details");
  assertIncludes(changelogSource, "contract_profile", "public changelog 0.4.1 contract-profile detail");
  assertIncludes(changelogSource, "0.3.9 details", "public changelog retained 0.3.9 release details");
  assertIncludes(changelogSource, ".mdkg/config.json", "public changelog 0.3.9 configuration detail");
  assertIncludes(planWorkEvidenceSource, "role=\"img\"", "deterministic accessible diagram source");
  assertIncludes(planWorkEvidenceSource, "Minimal goal frontmatter", "goal frontmatter example");
  assertIncludes(planWorkEvidenceSource, "Minimal task frontmatter", "task frontmatter example");
  assertIncludes(planWorkEvidenceSource, "## Common mistakes", "plan work evidence common mistakes");
  assertIncludes(planWorkEvidence, "pwe-flow", "rendered deterministic diagram");
  assertIncludes(planWorkEvidence, "aria-label=", "rendered diagram accessibility label");
  assertIncludes(agentWorkflowSourceFull, "## Common mistakes", "agent workflow common mistakes");
  assertIncludes(advancedAlphaSource, "## How to choose", "advanced alpha decision path");
  assertIncludes(advancedAlphaSource, "## Common mistakes", "advanced alpha common mistakes");

  for (const rel of ["index.html", "start-here/quickstart/index.html", "reference/generated-cli-reference/index.html"]) {
    const html = readText(path.join(docsDist, rel));
    assert(countMatches(html, /<h1[\s>]/g) === 1, `${rel} should render exactly one H1`);
    assert(countMatches(html, /<starlight-toc\b/g) <= 1, `${rel} should not render duplicate Starlight TOC elements`);
    assert(countMatches(html, /right-sidebar-panel/g) <= 1, `${rel} should not render duplicate right sidebar panels`);
    assert(!html.includes("starlight__mobile-toc"), `${rel} should not render mobile TOC markup`);
  }

  console.log("mdkg-dev pass-5 polish smoke passed");
}

main();
