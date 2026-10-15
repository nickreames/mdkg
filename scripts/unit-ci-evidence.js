#!/usr/bin/env node

// Reuse the existing fast lane's complete coverage run; never run a second suite.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { isDeepStrictEqual } = require("node:util");
const { captureTrackedBoundary } = require("./release-ladder");
const { discoverTestContract } = require("./coverage-contract");
const { readTopology, verifyExactSha } = require("./generate-ci-workflow");
const { assertDirectoryChain, prepareEmptyDirectory, readRegularJsonFile, within } = require("./qualification-output");
const { verifyArtifactFile, withVerifiedArtifact } = require("./qualification-artifact");

const repoRoot = path.resolve(__dirname, "..");
const evidenceFiles = {
  "release-receipt.json": "receipt.json",
  "coverage-summary.json": "coverage/summary.json",
  "coverage-manifest.json": "coverage/manifest.json",
  "coverage-event.json": "coverage/coverage-event.json",
  "coverage.log": "logs/coverage.log",
};
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}
function same(actual, expected, message) {
  requireThat(isDeepStrictEqual(actual, expected), message);
}
function expectations(root, sha) {
  verifyExactSha(sha, root);
  const boundary = captureTrackedBoundary(root);
  requireThat(boundary.status_entry_count === 0, "unit evidence requires a clean exact-head checkout");
  const files = Object.keys(boundary.tracked_hashes).sort();
  const typescript_sources = files.filter(file => file.startsWith("tests/") && file.endsWith(".test.ts"));
  const root_mjs = files.filter(file => file.startsWith("tests/") && file.endsWith(".test.mjs"));
  const compiled_typescript = typescript_sources.map(file => file.replace(/^tests\//, "dist/tests/").replace(/\.ts$/, ".js"));
  const typescript_families = [...new Set(typescript_sources.map(file => {
    const relative = file.slice("tests/".length);
    return relative.includes("/") ? relative.split("/")[0] : "root";
  }))].sort();
  requireThat(typescript_sources.length > 0 && root_mjs.length > 0, "unit source discovery must include both nonempty families");
  return {
    commit_sha: sha,
    tracked_tree_sha256: boundary.tracked_tree_sha256,
    lockfiles: boundary.lockfiles,
    tests: { typescript_sources, compiled_typescript, root_mjs, typescript_families,
      total_test_files: typescript_sources.length + root_mjs.length },
    config: readRegularJsonFile(path.join(root, "scripts/coverage-contract.json")),
    runtimes: readTopology().fast.runtimes,
  };
}
function admitUnitEvidence(record, expected) {
  requireThat(record.schema_version === 1 && record.kind === "mdkg-full-unit-ci" && record.ok === true,
    "missing or failed full-unit evidence");
  requireThat(record.commit_sha === expected.commit_sha && record.tracked_tree_sha256 === expected.tracked_tree_sha256,
    "unit evidence does not match exact head and tracked inputs");
  same(record.lockfiles, expected.lockfiles, "unit lockfile identity mismatch");
  same(record.test_files, expected.tests, "complete unit source/compiled discovery mismatch");
  const runtime = expected.runtimes.find(item => item.id === record.id);
  const node = /^v24\.(\d+)\.(\d+)$/.exec(record.runtime?.node || "");
  requireThat(node && Number(node[1]) >= 18 && runtime && (runtime.version === "24.x" ? true
    : record.runtime?.node === "v" + runtime.version), "unit runtime does not match the existing matrix pin");
  requireThat(/^\d+\.\d+\.\d+$/.test(record.runtime?.npm || "") &&
    typeof record.runtime.platform === "string" && typeof record.runtime.arch === "string", "unit toolchain identity is incomplete");
  const counts = record.counts;
  requireThat(counts && ["tests", "passed", "failed", "cancelled", "skipped", "todo"].every(key =>
    Number.isSafeInteger(counts[key]) && counts[key] >= 0), "unit execution is missing test counts");
  requireThat(counts.tests >= expected.tests.total_test_files && counts.passed > 0 && counts.failed === 0 && counts.cancelled === 0,
    "unit execution failed, cancelled or empty");
  requireThat(Array.isArray(record.skips) && record.skips.length === counts.skipped,
    "unit skip reasons are incomplete");
  requireThat(record.skips.every(item => typeof item.name === "string" && item.name &&
    (typeof item.reason === "string" || item.reason === null)), "unit skip record is invalid");
  const execution = record.execution;
  requireThat(execution?.id === "coverage" && execution.exit_code === 0 && execution.timed_out === false &&
    Number.isFinite(execution.duration_ms) && execution.duration_ms >= 0, "unit coverage gate is incomplete or timed out");
  same(record.thresholds, expected.config.thresholds, "unit coverage thresholds changed");
  same(record.measured_paths, expected.config.measured_paths, "unit coverage surfaces changed");
  same(record.exclusions, expected.config.exclusions, "unit coverage exclusions changed");
  requireThat(record.measured_file_count > 0 && Object.entries(expected.config.thresholds).every(([metric, floor]) =>
    Number.isFinite(record.coverage?.[metric]?.percent) && record.coverage[metric].percent >= floor),
    "unit coverage is missing or below an existing floor");
  same(Object.keys(record.evidence || {}).sort(), Object.keys(evidenceFiles).sort(), "unit evidence files are incomplete");
  requireThat(Object.values(record.evidence).every(file => /^[a-f0-9]{64}$/.test(file.sha256) && file.bytes > 0),
    "unit evidence file identity is missing");
  return record;
}
function readEvidencePayloads(directory, evidence) {
  const payloads = {};
  for (const [name, identity] of Object.entries(evidence)) {
    const file = path.join(directory, name);
    const read = withVerifiedArtifact(file, identity.sha256, () => name.endsWith(".json")
      ? readRegularJsonFile(file, 16 * 1024 * 1024) : null);
    requireThat(read.verification.bytes === identity.bytes, "unit evidence size mismatch");
    payloads[name] = read.result;
  }
  return payloads;
}
function fieldsFromEvidence(payloads, expected) {
  const receipt = payloads["release-receipt.json"], summary = payloads["coverage-summary.json"],
    manifest = payloads["coverage-manifest.json"], event = payloads["coverage-event.json"];
  requireThat(receipt.ok === true && receipt.mode === "ci" && receipt.git_boundary?.ok === true,
    "fast lane did not finish with preserved inputs");
  requireThat(receipt.git_boundary.before.head === expected.commit_sha &&
    receipt.git_boundary.before.status_entry_count === 0 &&
    receipt.git_boundary.before.tracked_tree_sha256 === expected.tracked_tree_sha256,
    "fast lane source identity is stale");
  requireThat(summary.ok === true && manifest.mode === "run" && event.test_summary?.success === true,
    "thresholded full-unit execution did not pass");
  same(manifest.test_files, expected.tests, "complete unit source/compiled discovery mismatch");
  requireThat(summary.test_contract.test_count === event.test_summary.counts.tests &&
    summary.test_contract.passed === event.test_summary.counts.passed &&
    summary.test_contract.failed === event.test_summary.counts.failed, "unit summaries disagree");
  const coverageGates = receipt.gates.filter(gate => gate.id === "coverage");
  requireThat(coverageGates.length === 1, "unit execution requires exactly one coverage gate");
  return { test_files: manifest.test_files, counts: event.test_summary.counts, skips: event.test_skips,
    runtime: summary.runtime, execution: coverageGates[0], thresholds: summary.thresholds,
    measured_paths: manifest.measured_paths, exclusions: manifest.exclusions,
    measured_file_count: summary.measured_surface.file_count, coverage: summary.measured_surface.metrics };
}
function collect(sha, id, collection, output, root = repoRoot) {
  collection = assertDirectoryChain(collection);
  output = path.resolve(output);
  requireThat(!within(collection, output) && !within(output, collection), "unit output overlaps release evidence");
  prepareEmptyDirectory(output, { forbiddenRoots: [root, collection] });
  let record = { schema_version: 1, kind: "mdkg-full-unit-ci", ok: false, commit_sha: sha, id };
  try {
    const expected = expectations(root, sha);
    const runs = fs.readdirSync(collection, { withFileTypes: true }).filter(entry => /^run-[A-Za-z0-9]+$/.test(entry.name));
    requireThat(runs.length === 1 && runs[0].isDirectory(), "unit evidence requires exactly one independent fast run");
    const run = assertDirectoryChain(path.join(collection, runs[0].name));
    const evidence = {};
    for (const [name, relative] of Object.entries(evidenceFiles)) {
      const file = path.join(run, relative);
      const stat = fs.lstatSync(file);
      requireThat(stat.isFile() && stat.nlink === 1, "unit evidence must be an independent regular file");
      const sha256 = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
      const original = verifyArtifactFile(file, sha256);
      fs.copyFileSync(file, path.join(output, name), fs.constants.COPYFILE_EXCL);
      verifyArtifactFile(path.join(output, name), sha256);
      evidence[name] = { sha256, bytes: original.bytes };
    }
    // Derive the verdict from the retained verified copies, never from an
    // earlier parse of mutable source files that are reopened during export.
    const fields = fieldsFromEvidence(readEvidencePayloads(output, evidence), expected);
    same(fields.test_files, discoverTestContract(root), "compiled unit parity changed after execution");
    const npm = spawnSync("npm", ["--version"], { encoding: "utf8" });
    requireThat(npm.status === 0, "npm runtime identity unavailable");
    record = {
      ...record, ok: true, tracked_tree_sha256: expected.tracked_tree_sha256, lockfiles: expected.lockfiles,
      ...fields, runtime: { ...fields.runtime, npm: npm.stdout.trim() }, evidence,
    };
    admitUnitEvidence(record, expected);
  } catch (error) {
    record = { ...record, ok: false, error: error.message };
  }
  fs.writeFileSync(path.join(output, "unit.json"), JSON.stringify(record, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  return record;
}
function verifyCollection(collection, expected) {
  assertDirectoryChain(collection);
  const entries = fs.readdirSync(collection, { withFileTypes: true });
  requireThat(entries.length === expected.runtimes.length && entries.every(entry => entry.isDirectory()),
    "required unit matrix evidence is missing or unexpected");
  const records = entries.map(entry => {
    const directory = assertDirectoryChain(path.join(collection, entry.name));
    const record = admitUnitEvidence(readRegularJsonFile(path.join(directory, "unit.json")), expected);
    const fields = fieldsFromEvidence(readEvidencePayloads(directory, record.evidence), expected);
    for (const [key, value] of Object.entries(fields)) {
      same(record[key], key === "runtime" ? { ...value, npm: record.runtime.npm } : value,
        `unit retained evidence disagrees with ${key}`);
    }
    return record;
  });
  same(records.map(record => record.id).sort(), expected.runtimes.map(runtime => runtime.id).sort(),
    "required unit matrix member is missing or duplicated");
  return { ok: true, commit_sha: expected.commit_sha, runtimes: records.map(record =>
    ({ id: record.id, runtime: record.runtime, counts: record.counts, duration_ms: record.execution.duration_ms })) };
}
function main(args = process.argv.slice(2)) {
  if (args[0] === "collect" && args.length === 5) {
    const record = collect(args[1], args[2], args[3], args[4]);
    process.stdout.write(JSON.stringify(record, null, 2) + "\n");
    return record.ok ? 0 : 1;
  }
  if (args[0] === "verify" && args.length === 3) {
    const result = verifyCollection(args[2], expectations(repoRoot, args[1]));
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    return 0;
  }
  throw new Error("usage: unit-ci-evidence.js collect SHA MATRIX_ID COLLECTION OUTPUT | verify SHA COLLECTION");
}
if (require.main === module) {
  try { process.exitCode = main(); }
  catch (error) { process.stderr.write("unit CI evidence failed: " + error.message + "\n"); process.exitCode = 1; }
}
module.exports = { admitUnitEvidence, collect, evidenceFiles, expectations, verifyCollection };
