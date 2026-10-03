#!/usr/bin/env node
// Linux CI diagnostics only. Retain original files; never clean fixture trees,
// follow their links, or turn a snapshot/collector result into test acceptance.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { assertDirectoryChain, createRunDirectory, within } = require("./qualification-output");
const { failureEvidence } = require("./release-ladder");
const repoRoot = path.resolve(__dirname, "..");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

function visibleTree(root) {
  const names = [Buffer.from(".")], records = [];
  function visit(relative) {
    const absolute = Buffer.concat([Buffer.from(root), Buffer.from("/"), relative]);
    const stat = fs.lstatSync(absolute);
    records.push({ path_base64: relative.toString("base64"), dev: stat.dev, ino: stat.ino,
      mode: stat.mode, bytes: stat.size, mtime: stat.mtimeMs, ctime: stat.ctimeMs });
    if (!stat.isDirectory()) return;
    for (const entry of fs.readdirSync(absolute, { encoding: "buffer" }).sort(Buffer.compare)) {
      // Match upload-artifact's existing include-hidden-files=false policy.
      if (entry[0] === 46) continue;
      if (records.length >= 100000) throw new Error("fixture evidence inventory exceeds bound");
      const child = Buffer.concat([relative, Buffer.from("/"), entry]);
      names.push(child); visit(child); // lstat: archive link itself, never target
    }
  }
  visit(Buffer.from(".")); return { names, fingerprint: hash(JSON.stringify(records)), entries: records.length };
}

function archiveFixture(source, destination) {
  assertDirectoryChain(source);
  const before = visibleTree(source);
  const result = spawnSync("tar", ["--create", "--gzip", "--file", destination,
    "--directory", source, "--null", "--no-recursion", "--files-from", "-"], {
    input: Buffer.concat(before.names.flatMap(name => [name, Buffer.from([0])])),
    timeout: 120000, maxBuffer: 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(`fixture evidence archive failed: ${result.status}; ${result.stderr}`);
  const after = visibleTree(source);
  const fd = fs.openSync(destination, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  const digest = crypto.createHash("sha256"), buffer = Buffer.alloc(64 * 1024); let count;
  try { while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) digest.update(buffer.subarray(0, count)); }
  finally { fs.closeSync(fd); }
  return { path: path.basename(destination), bytes: fs.statSync(destination).size,
    sha256: digest.digest("hex"), entries: before.entries,
    observed_tree_unchanged: before.fingerprint === after.fingerprint,
    source_fingerprint: before.fingerprint,
    note: "diagnostic snapshot only; no atomic, quiescent-writer or qualification claim" };
}

function coverageDiagnostic(run) {
  const file = path.join(run, "logs", "coverage.log");
  if (!fs.existsSync(file)) return { state: "log-not-written", file: "logs/coverage.log" };
  try {
    assertDirectoryChain(path.dirname(file));
    const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
    let bytes;
    try {
      const stat = fs.fstatSync(fd);
      if (!stat.isFile() || stat.nlink !== 1 || stat.size > 32 * 1024 * 1024) throw new Error("coverage diagnostic requires bounded regular log");
      const buffer = Buffer.alloc(stat.size + 1); let used = 0, count;
      while (used < buffer.length && (count = fs.readSync(fd, buffer, used, buffer.length - used, null)) > 0) used += count;
      const final = fs.fstatSync(fd), named = fs.lstatSync(file);
      if (used !== stat.size || final.size !== stat.size || final.mtimeMs !== stat.mtimeMs || final.ctimeMs !== stat.ctimeMs ||
          !named.isFile() || named.dev !== stat.dev || named.ino !== stat.ino) throw new Error("coverage diagnostic log changed while reading");
      bytes = buffer.subarray(0, used);
    } finally { fs.closeSync(fd); }
    const lines = bytes.toString("utf8").split(/\r?\n/);
    const failures = lines.filter(line => line.startsWith("FAIL "));
    const summaries = lines.filter(line => line.startsWith("SUMMARY "));
    return { state: "log-read", file: "logs/coverage.log", bytes: bytes.length, sha256: hash(bytes),
      failure_count: failures.length,
      failed_cases: failureEvidence({ status: 1, stdout: failures.join("\n") }).stdout,
      final_summary: summaries.at(-1) ?? null };
  } catch (error) { return { state: "diagnostic-unavailable", error: error.message }; }
}

function collect(collection, output, { report = () => {} } = {}) {
  if (process.platform !== "linux") throw new Error("fixture evidence collector requires Linux CI tar");
  collection = assertDirectoryChain(collection); output = path.resolve(output);
  if (within(collection, output) || within(output, collection)) throw new Error("evidence archive output must not overlap collection");
  const runs = fs.readdirSync(collection, { withFileTypes: true }).filter(e => /^run-[A-Za-z0-9]+$/.test(e.name));
  for (const run of runs) {
    if (!run.isDirectory()) throw new Error("evidence run must be an unlinked directory");
    const tmp = path.join(collection, run.name, "tmp");
    try { fs.lstatSync(tmp); assertDirectoryChain(tmp); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  const directory = createRunDirectory(output, { forbiddenRoots: [repoRoot, collection] });
  const receipt = { action: "collect-ci-fixture-evidence", ok: true, collection, directory,
    hidden_file_policy: "unchanged: exclude hidden entries", runs: [] };
  for (const run of runs) {
    const root = path.join(collection, run.name), tmp = path.join(root, "tmp");
    const item = { run: run.name, coverage: coverageDiagnostic(root) };
    report({ action: "ci-coverage-diagnostic", ...item });
    if (fs.existsSync(tmp)) {
      item.fixture_archive = archiveFixture(tmp, path.join(directory, `${run.name}-fixtures.tar.gz`));
      if (!item.fixture_archive.observed_tree_unchanged) receipt.ok = false;
    }
    receipt.runs.push(item);
  }
  fs.writeFileSync(path.join(directory, "collection.json"), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  return receipt;
}
if (require.main === module) {
  try {
    if (process.argv.length !== 4) throw new Error("usage: collect-ci-evidence.js COLLECTION ARCHIVE_COLLECTION");
    const receipt = collect(process.argv[2], process.argv[3], {
      report: item => process.stdout.write(JSON.stringify(item) + "\n"),
    });
    process.stdout.write(JSON.stringify(receipt, null, 2) + "\n"); process.exitCode = receipt.ok ? 0 : 1;
  } catch (error) { process.stderr.write(`CI evidence collection failed: ${error.message}\n`); process.exitCode = 1; }
}
module.exports = { collect, coverageDiagnostic };
