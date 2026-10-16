import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { admitUnitEvidence, collect, evidenceFiles, expectations, verifyCollection } = require("../scripts/unit-ci-evidence");
const { createOwnedFixture, isolatedFixtureEnvironment } = require("../scripts/qualification-fixture");
const config = require("../scripts/coverage-contract.json");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const payload = "synthetic unit evidence\n";
function expected() {
  return {
    commit_sha: "a".repeat(40), tracked_tree_sha256: "b".repeat(64), lockfiles: { "package-lock.json": "file:" + "c".repeat(64) },
    tests: { typescript_sources: ["tests/commands/control.test.ts"], compiled_typescript: ["dist/tests/commands/control.test.js"],
      root_mjs: ["tests/control.test.mjs"], typescript_families: ["commands"], total_test_files: 2 },
    config, runtimes: [{ id: "minimum", version: "24.18.0" }, { id: "floating", version: "24.x" }],
  };
}
function record(id = "minimum") {
  const e = expected();
  const r = {
    schema_version: 1, kind: "mdkg-full-unit-ci", ok: true, id,
    commit_sha: e.commit_sha, tracked_tree_sha256: e.tracked_tree_sha256, lockfiles: e.lockfiles, test_files: e.tests,
    runtime: { node: "v24.18.0", npm: "11.16.0", platform: "linux", arch: "x64" },
    counts: { tests: 4, passed: 3, failed: 0, cancelled: 0, skipped: 1, todo: 0 },
    skips: [{ name: "known platform control", reason: "synthetic platform skip" }],
    execution: { id: "coverage", exit_code: 0, timed_out: false, duration_ms: 100 },
    thresholds: config.thresholds, measured_paths: config.measured_paths, exclusions: config.exclusions,
    measured_file_count: 7, coverage: Object.fromEntries(Object.entries(config.thresholds).map(([key, percent]) => [key, { percent }])),
    evidence: Object.fromEntries(Object.keys(evidenceFiles).map(name => [name, { sha256: hash(payload), bytes: Buffer.byteLength(payload) }])),
  };
  r.evidence = Object.fromEntries(Object.entries(retainedPayloads(r)).map(([name, bytes]) =>
    [name, { sha256: hash(bytes), bytes: Buffer.byteLength(bytes) }]));
  return r;
}
function retainedPayloads(r) {
  const { npm, ...runtime } = r.runtime;
  return {
    "release-receipt.json": JSON.stringify({ ok: true, mode: "ci", gates: [r.execution], git_boundary: { ok: true,
      before: { head: r.commit_sha, status_entry_count: 0, tracked_tree_sha256: r.tracked_tree_sha256 } } }),
    "coverage-summary.json": JSON.stringify({ ok: true, runtime, thresholds: r.thresholds,
      test_contract: { test_count: r.counts.tests, passed: r.counts.passed, failed: r.counts.failed },
      measured_surface: { file_count: r.measured_file_count, metrics: r.coverage } }),
    "coverage-manifest.json": JSON.stringify({ mode: "run", test_files: r.test_files,
      measured_paths: r.measured_paths, exclusions: r.exclusions }),
    "coverage-event.json": JSON.stringify({ test_summary: { success: true, counts: r.counts }, test_skips: r.skips }),
    "coverage.log": payload,
  };
}
test("full unit evidence admits the complete unchanged contract and preserves declared skips", () => {
  const r = record();
  assert.equal(admitUnitEvidence(r, expected()), r);
  assert.equal(r.counts.skipped, 1);
  assert.equal(r.skips[0].reason, "synthetic platform skip");
});
test("required unit evidence rejects failed, cancelled, empty, stale and incomplete runs", () => {
  const controls = [
    r => { r.ok = false; },
    r => { r.commit_sha = "d".repeat(40); },
    r => { r.tracked_tree_sha256 = "e".repeat(64); },
    r => { r.lockfiles["package-lock.json"] = "changed"; },
    r => { r.test_files.compiled_typescript = []; },
    r => { r.test_files.root_mjs = []; },
    r => { r.counts.tests = 0; r.counts.passed = 0; },
    r => { r.counts.failed = 1; },
    r => { r.counts.cancelled = 1; },
    r => { delete r.counts.skipped; },
    r => { r.skips = []; },
    r => { r.execution.exit_code = 1; },
    r => { r.execution.timed_out = true; },
    r => { delete r.execution; },
    r => { r.runtime.node = "v26.0.0"; },
    r => { r.runtime.node = "v24.19.0"; },
    r => { r.id = "floating"; r.runtime.node = "v24.17.0"; },
    r => { delete r.runtime.npm; },
    r => { r.thresholds.lines--; },
    r => { r.measured_paths.pop(); },
    r => { r.exclusions.push("dist/commands/**"); },
    r => { r.coverage.branches.percent--; },
    r => { r.measured_file_count = 0; },
    r => { delete r.evidence["coverage.log"]; },
  ];
  for (const [index, change] of controls.entries()) {
    const r = structuredClone(record()); change(r);
    assert.throws(() => admitUnitEvidence(r, expected()), undefined, "negative control " + index);
  }
});
function matrixFixture(exercise) {
  const fixture = createOwnedFixture({ prefix: "mdkg-unit-evidence-" });
  try {
    const collection = fixture.resolve("matrix"); fs.mkdirSync(collection);
    for (const id of ["minimum", "floating"]) {
      const directory = path.join(collection, id); fs.mkdirSync(directory);
      const r = record(id);
      fs.writeFileSync(path.join(directory, "unit.json"), JSON.stringify(r));
      for (const [name, bytes] of Object.entries(retainedPayloads(r))) fs.writeFileSync(path.join(directory, name), bytes);
    }
    exercise(collection);
  } finally { fixture.cleanup(); }
}
test("matrix rejects contradictory retained summary even when its hash was updated", () => {
  matrixFixture(collection => {
    const directory = path.join(collection, "minimum");
    const bytes = JSON.stringify({ ok: false });
    fs.writeFileSync(path.join(directory, "coverage-summary.json"), bytes);
    const r = JSON.parse(fs.readFileSync(path.join(directory, "unit.json"), "utf8"));
    r.evidence["coverage-summary.json"] = { sha256: hash(bytes), bytes: Buffer.byteLength(bytes) };
    fs.writeFileSync(path.join(directory, "unit.json"), JSON.stringify(r));
    assert.throws(() => verifyCollection(collection, expected()), /execution|summary|JSON/);
  });
});
test("matrix parses retained JSON and rejects inconsistent event, discovery and execution payloads", () => {
  for (const [name, change] of [
    ["coverage-event.json", r => { r.test_summary.success = false; }],
    ["coverage-event.json", r => { r.test_summary.counts.passed--; }],
    ["coverage-event.json", r => { r.test_skips = []; }],
    ["coverage-manifest.json", r => { r.test_files.root_mjs = []; }],
    ["release-receipt.json", r => { r.gates[0].exit_code = 1; }],
    ["release-receipt.json", r => { r.git_boundary.before.head = "d".repeat(40); }],
    ["coverage-summary.json", r => { r.runtime.node = "v24.19.0"; }],
  ]) matrixFixture(collection => {
    const directory = path.join(collection, "minimum"), file = path.join(directory, name);
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")); change(parsed);
    const bytes = JSON.stringify(parsed); fs.writeFileSync(file, bytes);
    const r = JSON.parse(fs.readFileSync(path.join(directory, "unit.json"), "utf8"));
    r.evidence[name] = { sha256: hash(bytes), bytes: Buffer.byteLength(bytes) };
    fs.writeFileSync(path.join(directory, "unit.json"), JSON.stringify(r));
    assert.throws(() => verifyCollection(collection, expected()), undefined, name);
  });
  matrixFixture(collection => {
    const directory = path.join(collection, "minimum"), r = record();
    for (const name of Object.keys(evidenceFiles).filter(name => name.endsWith(".json"))) {
      fs.writeFileSync(path.join(directory, name), payload);
      r.evidence[name] = { sha256: hash(payload), bytes: Buffer.byteLength(payload) };
    }
    fs.writeFileSync(path.join(directory, "unit.json"), JSON.stringify(r));
    assert.throws(() => verifyCollection(collection, expected()), SyntaxError);
  });
});
test("matrix verdict requires both distinct runtimes and intact current-attempt evidence", () => {
  matrixFixture(collection => {
    const result = verifyCollection(collection, expected());
    assert.equal(result.ok, true); assert.equal(result.runtimes.length, 2);
    fs.writeFileSync(path.join(collection, "floating/unit.json"), JSON.stringify(record("minimum")));
    assert.throws(() => verifyCollection(collection, expected()), /missing or duplicated/);
  });
  matrixFixture(collection => {
    fs.unlinkSync(path.join(collection, "minimum/coverage.log"));
    assert.throws(() => verifyCollection(collection, expected()), /ENOENT/);
  });
  matrixFixture(collection => {
    fs.writeFileSync(path.join(collection, "floating/coverage.log"), "tampered synthetic log\n");
    assert.throws(() => verifyCollection(collection, expected()), /mismatch/);
  });
  matrixFixture(collection => {
    fs.renameSync(path.join(collection, "floating"), path.join(collection, "..", "not-downloaded"));
    assert.throws(() => verifyCollection(collection, expected()), /missing or unexpected/);
  });
});
test("actual coverage reporter records skip names/reasons without counting them as passing lines", () => {
  const fixture = createOwnedFixture({ prefix: "mdkg-unit-skips-" });
  try {
    const file = fixture.resolve("controls.test.cjs"), event = fixture.resolve("event.json");
    fs.writeFileSync(file, "const test=require('node:test');test('passing control',()=>{});test('platform control',{skip:'known platform reason'},()=>{throw Error('must not execute')});\n");
    const env = isolatedFixtureEnvironment({ ...process.env, MDKG_COVERAGE_EVENT_PATH: event });
    delete env.NODE_TEST_CONTEXT; delete env.NODE_V8_COVERAGE;
    const result = spawnSync(process.execPath, ["--test", "--test-reporter=" + path.resolve("scripts/coverage-reporter.js"), file],
      { env, encoding: "utf8", timeout: 15000 });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /SKIP platform control \(known platform reason\)/);
    assert.doesNotMatch(result.stdout, /PASS platform control/);
    const actual = JSON.parse(fs.readFileSync(event, "utf8"));
    assert.equal(actual.test_summary.counts.passed, 1); assert.equal(actual.test_summary.counts.skipped, 1);
    assert.deepEqual(actual.test_skips, [{ name: "platform control", reason: "known platform reason" }]);
  } finally { fixture.cleanup(); }
});
test("unit evidence CLI propagates invalid-source failure as nonzero", () => {
  const result = spawnSync(process.execPath, ["scripts/unit-ci-evidence.js", "verify", "not-a-sha", "unused"],
    { env: isolatedFixtureEnvironment(process.env), encoding: "utf8", timeout: 15000 });
  assert.equal(result.status, 1); assert.match(result.stderr, /40 lowercase hexadecimal/);
});


test("collector preserves exact execution evidence after pack cleanup and rejects missing or mismatched evidence", () => {
  const fixture = createOwnedFixture({ prefix: "mdkg-unit-collector-" });
  try {
    const root = fixture.resolve("repo"), collection = fixture.resolve("collection"), matrix = fixture.resolve("matrix");
    fs.mkdirSync(root); fs.mkdirSync(matrix);
    const put = (relative, bytes) => {
      const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
    };
    put(".gitignore", "dist/\n");
    put(".mdkg/work/goal-73-make-the-docs-current-release-supplement-version-driven.md", "synthetic fixture\n");
    for (const file of ["package-lock.json", "docs/package-lock.json", "mdkg-dev/package-lock.json"]) put(file, "{}\n");
    put("scripts/coverage-contract.json", JSON.stringify(config));
    put("scripts/clean-build-output.js", fs.readFileSync(path.resolve("scripts/clean-build-output.js")));
    put("tests/control.test.ts", "// synthetic source fixture\n");
    put("tests/control.test.mjs", "// synthetic source fixture\n");
    put("dist/tests/control.test.js", "// synthetic compiled fixture\n");
    const git = (...args) => {
      const result = spawnSync("git", ["-C", root, ...args], { env: isolatedFixtureEnvironment(process.env), encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
    };
    git("init", "-q"); git("config", "user.name", "unit fixture"); git("config", "user.email", "unit@example.invalid");
    git("add", "."); git("-c", "commit.gpgSign=false", "commit", "-qm", "synthetic unit evidence fixture");
    const sha = git("rev-parse", "HEAD"); git("checkout", "--detach", sha);
    const expectedInputs = expectations(root, sha), sample = record();
    const run = path.join(collection, "run-Control1"); fs.mkdirSync(path.join(run, "coverage"), { recursive: true });
    fs.mkdirSync(path.join(run, "logs"));
    const json = (relative, value) => fs.writeFileSync(path.join(run, relative), JSON.stringify(value));
    json("receipt.json", { ok: true, mode: "ci", gates: [sample.execution], git_boundary: { ok: true,
      before: { head: sha, status_entry_count: 0, tracked_tree_sha256: expectedInputs.tracked_tree_sha256 } } });
    json("coverage/summary.json", { ok: true, runtime: sample.runtime, thresholds: config.thresholds,
      test_contract: { test_count: 4, passed: 3, failed: 0 }, measured_surface: { file_count: 7, metrics: sample.coverage } });
    json("coverage/manifest.json", { mode: "run", test_files: expectedInputs.tests,
      measured_paths: config.measured_paths, exclusions: config.exclusions });
    json("coverage/coverage-event.json", { test_summary: { success: true, counts: sample.counts }, test_skips: sample.skips });
    const log = path.join(run, "logs/coverage.log"); fs.writeFileSync(log, payload);
    // Normal prepack runs the runtime build, whose cleanup removes dist/tests
    // after coverage has already executed and sealed its complete manifest.
    const cleanup = spawnSync(process.execPath, [path.join(root, "scripts/clean-build-output.js")],
      { cwd: root, env: isolatedFixtureEnvironment(process.env), encoding: "utf8", timeout: 15000 });
    assert.equal(cleanup.status, 0, cleanup.stderr);
    assert.equal(fs.existsSync(path.join(root, "dist/tests")), false);
    for (const id of ["minimum", "floating"]) {
      const result = collect(sha, id, collection, path.join(matrix, id), root);
      assert.equal(result.ok, true, result.error); assert.deepEqual(result.test_files, expectedInputs.tests);
    }
    assert.equal(verifyCollection(matrix, expectedInputs).ok, true);
    const manifestPath = path.join(run, "coverage/manifest.json");
    const originalManifest = fs.readFileSync(manifestPath, "utf8");
    const incompleteManifest = JSON.parse(originalManifest);
    incompleteManifest.test_files.compiled_typescript = [];
    fs.writeFileSync(manifestPath, JSON.stringify(incompleteManifest));
    const incomplete = collect(sha, "minimum", collection, fixture.resolve("incomplete-export"), root);
    assert.equal(incomplete.ok, false);
    assert.match(incomplete.error, /complete unit source\/compiled discovery mismatch/);
    fs.writeFileSync(manifestPath, originalManifest);
    const summaryPath = path.join(run, "coverage/summary.json"), eventPath = path.join(run, "coverage/coverage-event.json");
    const originalRead = fs.readFileSync, originalSummary = originalRead(summaryPath, "utf8");
    let changed = false;
    fs.readFileSync = function(file, ...args) {
      if (file === eventPath && !changed) {
        changed = true;
        fs.writeFileSync(summaryPath, JSON.stringify({ ...JSON.parse(originalSummary), ok: false }));
      }
      return originalRead.call(this, file, ...args);
    };
    const frozenOutput = fixture.resolve("frozen-export");
    let frozen;
    try { frozen = collect(sha, "minimum", collection, frozenOutput, root); }
    finally { fs.readFileSync = originalRead; }
    assert.equal(changed, true); assert.equal(frozen.ok, true, frozen.error);
    assert.equal(JSON.parse(fs.readFileSync(path.join(frozenOutput, "coverage-summary.json"), "utf8")).ok, true,
      "verdict must describe the retained snapshot, not a later source replacement");
    fs.unlinkSync(path.join(run, "coverage/summary.json"));
    const failed = collect(sha, "minimum", collection, fixture.resolve("failed-export"), root);
    assert.equal(failed.ok, false); assert.match(failed.error, /ENOENT/);
    assert.equal(fs.readFileSync(log, "utf8"), payload);
    assert.equal(git("status", "--porcelain=v1"), "");
  } finally { fixture.cleanup(); }
});
