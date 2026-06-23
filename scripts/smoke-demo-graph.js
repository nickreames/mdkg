#!/usr/bin/env node

const path = require("node:path");
const {
  assert,
  assertNoHighRiskMarkers,
  mdkg,
  parseJson,
  repoRoot,
} = require("./mdkg-dev-smoke-utils");

function assertExample(rootRel, searchText, expectedTitle) {
  const root = path.join(repoRoot, rootRel);
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
}

function main() {
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
