#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const EXPECTED = new Map(
  `
cand-review-001-004 medium task-770
cand-review-002-001 medium task-766
cand-review-002-003 medium task-765
cand-review-002-004 medium task-765
cand-review-002-005 medium task-765
cand-review-002-006 medium task-765
cand-review-002-007 low task-772
cand-review-004-001 low task-765
cand-review-004-003 high task-764
cand-review-004-004 high task-764
cand-review-004-005 high task-764
cand-review-005-001 medium task-773
cand-review-005-003 medium task-765
cand-review-005-004 medium task-765
cand-review-005-006 low task-765
cand-review-006-001 medium task-764
cand-review-008-001 high task-764
cand-review-008-002 high task-764
cand-review-008-003 low task-768
cand-review-008-004 low task-768
cand-review-009-002 low task-769
cand-review-009-003 low task-772
cand-review-009-004 low task-772
cand-review-009-005 medium task-772
cand-review-009-006 medium task-773
cand-review-010-004 medium task-765
cand-review-010-005 medium task-767
cand-review-010-006 medium task-767
cand-review-010-007 low task-772
cand-review-010-009 low task-772
cand-review-010-010 medium task-772
cand-review-011-001 medium task-765
cand-review-011-002 low task-765
cand-review-011-004 low task-771
cand-review-011-005 medium task-770
cand-review-011-006 low task-771
cand-review-012-001 medium task-765
cand-review-012-002 medium task-765
cand-review-012-003 low task-765
cand-review-012-004 low task-765
cand-review-012-006 low task-769
cand-review-012-007 low task-769
cand-review-012-008 medium task-769
cand-review-012-009 medium task-769
review-003-cand-001 medium task-766
review-003-cand-003 medium task-765
review-003-cand-004 medium task-765
review-003-cand-005 medium task-765
review-003-cand-006 medium task-765
review-003-cand-008 medium task-765
review-007-cand-001 low task-768
`
    .trim()
    .split("\n")
    .map((line) => {
      const [id, severity, ownerTask] = line.trim().split(/\s+/);
      return [id, { severity, ownerTask }];
    })
);

const EXPECTED_COUNTS = { total: 51, high: 5, medium: 28, low: 18 };
const EXPECTED_REVISION = "8ac683599cd2765e7f33fa93113dbace8ed77543";

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function containedRegularFile(root, relativePath, label) {
  invariant(typeof relativePath === "string" && relativePath.length > 0, `${label} must name a file`);
  invariant(!path.isAbsolute(relativePath), `${label} must be repository-relative: ${relativePath}`);
  const resolvedRoot = fs.realpathSync(root);
  const candidate = path.resolve(resolvedRoot, relativePath);
  invariant(candidate.startsWith(`${resolvedRoot}${path.sep}`), `${label} escapes repository root: ${relativePath}`);
  invariant(fs.existsSync(candidate), `${label} does not exist: ${relativePath}`);
  invariant(fs.lstatSync(candidate).isFile(), `${label} is not a regular file: ${relativePath}`);
  const real = fs.realpathSync(candidate);
  invariant(real.startsWith(`${resolvedRoot}${path.sep}`), `${label} resolves outside repository root: ${relativePath}`);
  return real;
}

function taskFile(root, taskId) {
  const workDir = path.join(root, ".mdkg", "work");
  const names = fs.readdirSync(workDir).filter((name) => name.startsWith(`${taskId}-`) && name.endsWith(".md"));
  invariant(names.length === 1, `expected one durable owner node for ${taskId}, found ${names.length}`);
  const content = fs.readFileSync(path.join(workDir, names[0]), "utf8");
  invariant(/^status: done$/m.test(content), `owner task ${taskId} is not done`);
}

function verifyRegressionRef(root, findingId, ref) {
  invariant(typeof ref === "string" && ref.includes("#"), `${findingId} has invalid regression ref ${String(ref)}`);
  const separator = ref.indexOf("#");
  const relativePath = ref.slice(0, separator);
  const needle = ref.slice(separator + 1);
  invariant(needle.length >= 8, `${findingId} regression ref needs a specific test needle`);
  const file = containedRegularFile(root, relativePath, `${findingId} regression ref`);
  const content = fs.readFileSync(file, "utf8");
  invariant(content.includes(needle), `${findingId} regression test needle is absent: ${ref}`);
}

function verifyMatrix(matrixPath, root = path.resolve(__dirname, "..")) {
  const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
  const serialized = JSON.stringify(matrix);
  invariant(!/(?:\/private\/|\/var\/folders\/|\/tmp\/)/.test(serialized), "matrix contains a temporary absolute path");
  invariant(matrix.schema_version === 1, "matrix schema_version must be 1");
  invariant(matrix.release === "0.5.0", "matrix release must be 0.5.0");
  invariant(matrix.source_scan?.revision === EXPECTED_REVISION, "source scan revision drift");
  invariant(matrix.source_scan?.mode === "standard", "source scan mode drift");
  invariant(
    typeof matrix.source_scan?.limitation === "string" && /classifier\/reporting capability did not complete/.test(matrix.source_scan.limitation),
    "classifier/reporting limitation is missing"
  );
  invariant(JSON.stringify(matrix.expected_counts) === JSON.stringify(EXPECTED_COUNTS), "declared severity counts drift");

  const findings = matrix.findings;
  invariant(Array.isArray(findings), "findings must be an array");
  invariant(findings.length === EXPECTED_COUNTS.total, `expected 51 findings, found ${findings.length}`);
  const seen = new Set();
  const actualCounts = { total: findings.length, high: 0, medium: 0, low: 0 };
  const owners = new Set();

  for (const finding of findings) {
    invariant(typeof finding?.id === "string", "finding is missing id");
    invariant(!seen.has(finding.id), `duplicate finding id ${finding.id}`);
    seen.add(finding.id);
    const expected = EXPECTED.get(finding.id);
    invariant(expected, `unexpected finding id ${finding.id}`);
    invariant(finding.severity === expected.severity, `${finding.id} severity drift: expected ${expected.severity}, got ${finding.severity}`);
    invariant(finding.owner_task === expected.ownerTask, `${finding.id} owner drift: expected ${expected.ownerTask}, got ${finding.owner_task}`);
    invariant(finding.closure === "fixed" || finding.closure === "rejected", `${finding.id} is unresolved`);
    if (finding.closure === "rejected") {
      invariant(Array.isArray(finding.counterevidence_refs) && finding.counterevidence_refs.length > 0, `${finding.id} rejection lacks counterevidence`);
    }
    invariant(typeof finding.affected_sink === "string" && finding.affected_sink.includes(":"), `${finding.id} lacks an affected sink`);
    const sinkPath = finding.affected_sink.slice(0, finding.affected_sink.lastIndexOf(":"));
    containedRegularFile(root, sinkPath, `${finding.id} affected sink`);
    invariant(Array.isArray(finding.evidence_refs) && finding.evidence_refs.length >= 2, `${finding.id} lacks durable fix evidence`);
    invariant(finding.evidence_refs.some((ref) => /^chk-\d+$/.test(ref)), `${finding.id} lacks checkpoint evidence`);
    invariant(Array.isArray(finding.regression_refs) && finding.regression_refs.length > 0, `${finding.id} lacks direct regression tests`);
    for (const ref of finding.regression_refs) verifyRegressionRef(root, finding.id, ref);
    actualCounts[finding.severity] += 1;
    owners.add(finding.owner_task);
  }

  for (const id of EXPECTED.keys()) invariant(seen.has(id), `missing finding id ${id}`);
  invariant(JSON.stringify(actualCounts) === JSON.stringify(EXPECTED_COUNTS), `actual severity counts drift: ${JSON.stringify(actualCounts)}`);
  invariant(owners.size === 10, `expected all ten owner tasks, found ${owners.size}`);
  for (const owner of owners) taskFile(root, owner);

  return {
    ok: true,
    release: matrix.release,
    source_revision: matrix.source_scan.revision,
    counts: actualCounts,
    owners: [...owners].sort(),
  };
}

if (require.main === module) {
  try {
    const root = path.resolve(__dirname, "..");
    const matrixPath = process.argv[2]
      ? path.resolve(process.argv[2])
      : path.join(root, "security", "v0.5.0-remediation-matrix.json");
    console.log(JSON.stringify(verifyMatrix(matrixPath, root), null, 2));
  } catch (error) {
    console.error(`security remediation verification failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

module.exports = { verifyMatrix };
