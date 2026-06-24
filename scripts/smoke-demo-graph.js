#!/usr/bin/env node

const path = require("node:path");
const {
  assert,
  assertNoHighRiskMarkers,
  mdkg,
  parseJson,
  readText,
  repoRoot,
} = require("./mdkg-dev-smoke-utils");

function assertExample(rootRel, searchText, expectedTitle) {
  const root = path.join(repoRoot, rootRel);
  const startedAt = Date.now();
  const validate = parseJson(mdkg(["--root", root, "validate", "--json"]).stdout);
  assert(validate.ok === true, `${rootRel} did not validate`);
  assert(validate.warning_count === 0, `${rootRel} has validation warnings`);

  mdkg(["--root", root, "index"]);
  const next = parseJson(mdkg(["--root", root, "goal", "next", "goal-1", "--json"]).stdout);
  assert(next.node && next.node.id === "spike-1", `${rootRel} goal next did not route to spike-1`);
  const allowedWarning = "scope contains non-actionable or unsupported node: root:chk-1";
  assert(
    (next.warnings || []).every((warning) => warning === allowedWarning),
    `${rootRel} goal next emitted unexpected warnings: ${(next.warnings || []).join("; ")}`
  );

  const search = parseJson(mdkg(["--root", root, "search", searchText, "--json"]).stdout);
  assert(search.count > 0, `${rootRel} search returned no results`);
  assert(search.items.some((item) => item.title === expectedTitle), `${rootRel} search missing expected goal`);

  const packed = mdkg(["--root", root, "pack", "goal-1", "--profile", "concise", "--dry-run", "--stats"]).stdout;
  for (const qid of ["root:goal-1", "root:spike-1", "root:task-1", "root:test-1"]) {
    assert(packed.includes(qid), `${rootRel} pack missing ${qid}`);
  }
  if (rootRel === "examples/demo-agentic-coding") {
    const spike = parseJson(mdkg(["--root", root, "show", "spike-1", "--json"]).stdout);
    assert(spike.item.title.includes("demo audience"), "demo spike should describe audience research");
    const decision = parseJson(mdkg(["--root", root, "show", "dec-1", "--json"]).stdout);
    assert(decision.item.title.includes("local preview"), "demo decision should document local preview boundary");
    const checkpoint = parseJson(mdkg(["--root", root, "show", "chk-1", "--json"]).stdout);
    assert(checkpoint.item.title.includes("seed accepted"), "demo checkpoint should record seed evidence");
    const capabilities = parseJson(mdkg(["--root", root, "capability", "search", "pack", "--kind", "skill", "--json"]).stdout);
    assert(capabilities.count > 0, "demo capability search should find pack skill");
    assert(
      capabilities.items.some((item) => item.id === "build-pack-and-execute-task" || item.slug === "build-pack-and-execute-task"),
      "demo capability search missing build-pack-and-execute-task skill"
    );
    const elapsedMs = Date.now() - startedAt;
    assert(elapsedMs < 600_000, `demo first-success path took too long: ${elapsedMs}ms`);
  }
}

function main() {
  const demoReadme = readText(path.join(repoRoot, "examples", "demo-agentic-coding", "README.md"));
  for (const expected of [
    "First-success path",
    "Expected results",
    "mdkg validate --json",
    "mdkg goal next goal-1 --json",
    "mdkg capability search \"pack\" --kind skill --json",
    "under 10 minutes",
  ]) {
    assert(demoReadme.includes(expected), `demo README missing ${expected}`);
  }
  const demoDocs = readText(path.join(repoRoot, "docs", "src", "content", "docs", "advanced-alpha", "demo-graphs.md"));
  for (const expected of [
    "First-success path",
    "examples/demo-agentic-coding",
    "Use returned IDs",
    "Do not hardcode numeric IDs",
  ]) {
    assert(demoDocs.includes(expected), `demo docs missing ${expected}`);
  }
  assertExample(
    "examples/demo-agentic-coding",
    "agentic coding demo",
    "Build a one-shot agentic coding demo from mdkg context"
  );
  assertExample(
    "examples/template-mdkg-dev",
    "candidate website",
    "Generate a candidate mdkg.dev website from a cloned graph"
  );

  const subgraphs = parseJson(mdkg(["subgraph", "verify", "--all", "--json"]).stdout);
  assert(subgraphs.ok === true, "root subgraph verification failed");
  assert(subgraphs.count >= 2, "expected at least two registered subgraphs");
  for (const alias of ["demo_agentic_coding", "template_mdkg_dev"]) {
    const entry = subgraphs.subgraphs.find((item) => item.alias === alias);
    assert(entry, `missing subgraph ${alias}`);
    assert(entry.visibility === "private", `${alias} should be private`);
    assert(entry.permissions.includes("read"), `${alias} should be read-only`);
    assert(entry.error_count === 0, `${alias} has errors`);
  }

  const demoGoal = parseJson(mdkg(["show", "demo_agentic_coding:goal-1", "--json"]).stdout);
  assert(demoGoal.item.source.read_only === true, "demo subgraph goal should be read-only");
  const templateGoal = parseJson(mdkg(["show", "template_mdkg_dev:goal-1", "--json"]).stdout);
  assert(templateGoal.item.source.read_only === true, "template subgraph goal should be read-only");

  assertNoHighRiskMarkers([
    path.join(repoRoot, "examples", "demo-agentic-coding"),
    path.join(repoRoot, "examples", "template-mdkg-dev"),
  ]);
  console.log("demo graph smoke passed");
}

main();
