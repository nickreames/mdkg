import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(import.meta.dirname, "..");
const ladder = require("../scripts/release-ladder.js");
const coveragePath = path.join(repoRoot, "scripts/coverage-contract.js");
const coverageConfig = require("../scripts/coverage-contract.json");
const coverage = require("../scripts/coverage-contract.js");
const outputs = require("../scripts/qualification-output.js");
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

function fixture(t) {
  const base = fs.realpathSync(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir());
  const root = fs.mkdtempSync(path.join(base, "mdkg-qualification-output-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function put(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

function contextFixture(t) {
  const root = fixture(t);
  const producer = path.join(root, "producer"), consumer = path.join(root, "consumer");
  const contextDir = path.join(root, "context"), artifact = path.join(root, "candidate.tgz");
  put(path.join(producer, "dist/cli.js"), "synthetic build\n");
  fs.mkdirSync(consumer);
  put(artifact, "synthetic package\n");
  return { root, producer, consumer, contextDir, artifact, hash: sha256(artifact), head: "a".repeat(40) };
}

test("coverage refuses a populated configured destination before subprocesses or deletion", (t) => {
  const root = fixture(t), output = path.join(root, "prior-evidence");
  put(path.join(root, "scripts/coverage-contract.json"), JSON.stringify({ ...coverageConfig, output_dir: output }));
  put(path.join(root, "tests/a.test.ts"), "");
  put(path.join(root, "dist/tests/a.test.js"), "");
  put(path.join(root, "tests/a.test.mjs"), "");
  const sentinel = path.join(output, "keep.txt");
  put(sentinel, "unrelated evidence\n");
  const env = { ...process.env };
  env.MDKG_COVERAGE_DIR = output;
  const probe = spawnSync(process.execPath, ["-e", `
    require('node:child_process').spawnSync = () => { throw new Error('unexpected test execution'); };
    require(${JSON.stringify(coveragePath)}).execute('measure', ${JSON.stringify(root)});
  `], { cwd: root, env, encoding: "utf8", timeout: 5000 });
  assert.equal(fs.readFileSync(sentinel, "utf8"), "unrelated evidence\n");
  assert.notEqual(probe.status, 0);
  assert.match(probe.stderr, /not empty|fresh.*directory/i);
  assert.doesNotMatch(probe.stderr, /unexpected test execution/);
});

test("full-context preparation preserves an existing populated destination", (t) => {
  const f = contextFixture(t), sentinel = path.join(f.contextDir, "keep.txt");
  put(sentinel, "unrelated context\n");
  assert.throws(() => ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer), /not empty|fresh.*directory/i);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "unrelated context\n");
  assert.deepEqual(fs.readdirSync(f.contextDir), ["keep.txt"]);
});

test("full-context restore refuses different existing dist content without deleting it", (t) => {
  const f = contextFixture(t);
  ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer);
  const sentinel = path.join(f.consumer, "dist/keep.txt");
  put(sentinel, "unrelated build\n");
  assert.throws(() => ladder.loadFullContext(f.contextDir, f.head, f.consumer), /existing.*dist|different.*dist/i);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "unrelated build\n");
  assert.deepEqual(fs.readdirSync(path.dirname(sentinel)), ["keep.txt"]);
});

test("standalone coverage creates distinct runs and preserves earlier loose evidence", (t) => {
  const root = fixture(t), base = path.join(root, "coverage");
  put(path.join(base, "summary.json"), "previous evidence\n");
  const first = coverage.prepareCoverageOutput({ output_dir: "coverage" }, root, {});
  put(path.join(first, "summary.json"), "first run\n");
  const second = coverage.prepareCoverageOutput({ output_dir: "coverage" }, root, {});
  assert.notEqual(first, second);
  assert.equal(path.dirname(first), base);
  assert.equal(path.dirname(second), base);
  assert.equal(fs.readFileSync(path.join(base, "summary.json"), "utf8"), "previous evidence\n");
  assert.equal(fs.readFileSync(path.join(first, "summary.json"), "utf8"), "first run\n");
  assert.deepEqual(fs.readdirSync(second), []);
});

test("explicit coverage output accepts an empty caller-created directory and keeps the exact layout", (t) => {
  const root = fixture(t), output = path.join(root, "coverage");
  fs.mkdirSync(output);
  assert.equal(coverage.prepareCoverageOutput(coverageConfig, root, { MDKG_COVERAGE_DIR: output }), output);
  put(path.join(output, "summary.json"), "retained\n");
  assert.throws(() => coverage.prepareCoverageOutput(coverageConfig, root, { MDKG_COVERAGE_DIR: output }), /not empty/);
  assert.equal(fs.readFileSync(path.join(output, "summary.json"), "utf8"), "retained\n");
});

test("output admission rejects protected roots, ancestors, blank values and non-directories", (t) => {
  const root = fixture(t), project = path.join(root, "project");
  fs.mkdirSync(project);
  put(path.join(root, "file"), "keep\n");
  for (const target of [root, project, path.parse(root).root, os.homedir()]) {
    assert.throws(() => outputs.prepareEmptyDirectory(target, { forbiddenRoots: [project] }), /protected root/);
  }
  for (const target of ["", " "]) assert.throws(() => outputs.prepareEmptyDirectory(target), /exact directory/);
  assert.throws(() => outputs.prepareEmptyDirectory(path.join(root, "file")), /non-directory/);
  assert.throws(() => coverage.prepareCoverageOutput(coverageConfig, project, { MDKG_COVERAGE_DIR: "" }), /fresh output/);
  assert.deepEqual(fs.readdirSync(project), []);
  assert.equal(fs.readFileSync(path.join(root, "file"), "utf8"), "keep\n");
});

test("output admission refuses leaf, ancestor and dangling symlinks without touching their targets", (t) => {
  const root = fixture(t), outside = path.join(root, "sentinel");
  fs.mkdirSync(outside);
  put(path.join(outside, "keep.txt"), "outside\n");
  fs.symlinkSync(outside, path.join(root, "link"), "dir");
  fs.symlinkSync(path.join(root, "missing"), path.join(root, "dangling"), "dir");
  for (const target of [path.join(root, "link"), path.join(root, "link/child"), path.join(root, "dangling")]) {
    assert.throws(() => outputs.prepareEmptyDirectory(target), /link or non-directory/);
    assert.throws(() => outputs.createRunDirectory(target), /link or non-directory/);
  }
  assert.deepEqual(fs.readdirSync(outside), ["keep.txt"]);
  assert.equal(fs.readFileSync(path.join(outside, "keep.txt"), "utf8"), "outside\n");
  assert.equal(fs.existsSync(path.join(root, "missing")), false);
});

test("output creation preserves siblings and does not treat a prefix as cleanup authority", (t) => {
  const root = fixture(t);
  put(path.join(root, "run-neighbor/keep.txt"), "neighbor\n");
  const output = outputs.prepareEmptyDirectory(path.join(root, "new/child"));
  assert.deepEqual(fs.readdirSync(output), []);
  assert.equal(fs.readFileSync(path.join(root, "run-neighbor/keep.txt"), "utf8"), "neighbor\n");
  assert.throws(() => outputs.createRunDirectory(root, { prefix: "../other-" }), /basename prefix/);
});

test("full-context preparation supports pre-created empty CI destinations and independent artifact bytes", (t) => {
  const f = contextFixture(t);
  fs.mkdirSync(f.contextDir);
  const original = fs.statSync(f.artifact);
  const context = ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer);
  assert.equal(context.package.sha256, f.hash);
  const copied = fs.statSync(path.join(f.contextDir, "package.tgz"));
  assert.equal(copied.nlink, 1);
  assert.ok(original.dev !== copied.dev || original.ino !== copied.ino);
  assert.equal(copied.mode & 0o777, 0o444);
  assert.throws(() => ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer), /not empty/);
  assert.equal(sha256(f.artifact), f.hash);
});

test("context inputs are validated before creating a destination", (t) => {
  const f = contextFixture(t);
  assert.throws(() => ladder.writeFullContext(f.contextDir, f.artifact, "0".repeat(64), { head: f.head }, f.producer), /hash.*mismatch/);
  assert.equal(fs.existsSync(f.contextDir), false);
  fs.renameSync(path.join(f.producer, "dist"), path.join(f.producer, "saved-dist"));
  assert.throws(() => ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer), /missing built dist/);
  assert.equal(fs.existsSync(f.contextDir), false);
});

test("context outputs cannot overlap package or build inputs", (t) => {
  const f = contextFixture(t);
  for (const destination of [f.root, f.producer, path.join(f.producer, "dist"), path.join(f.producer, "dist/nested")]) {
    assert.throws(() => ladder.writeFullContext(destination, f.artifact, f.hash, { head: f.head }, f.producer), /overlaps/);
  }
  assert.equal(sha256(f.artifact), f.hash);
  assert.deepEqual(fs.readdirSync(path.join(f.producer, "dist")), ["cli.js"]);
});

test("context input and restored-build symlinks fail without writing through them", (t) => {
  const f = contextFixture(t);
  ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer);
  fs.symlinkSync(f.contextDir, path.join(f.root, "context-link"), "dir");
  assert.throws(() => ladder.loadFullContext(path.join(f.root, "context-link"), f.head, f.consumer), /link or non-directory/);
  fs.symlinkSync(path.join(f.producer, "dist"), path.join(f.consumer, "dist"), "dir");
  assert.throws(() => ladder.loadFullContext(f.contextDir, f.head, f.consumer), /link or non-directory/);
  assert.deepEqual(fs.readdirSync(path.join(f.producer, "dist")), ["cli.js"]);
});

test("context restoration is idempotent for matching dist and does not replace its inodes", (t) => {
  const f = contextFixture(t);
  ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer);
  ladder.loadFullContext(f.contextDir, f.head, f.consumer);
  const target = path.join(f.consumer, "dist/cli.js"), before = fs.statSync(target);
  ladder.loadFullContext(f.contextDir, f.head, f.consumer);
  const after = fs.statSync(target);
  assert.equal(after.ino, before.ino);
  assert.equal(after.dev, before.dev);
  assert.equal(after.mtimeMs, before.mtimeMs);
  assert.equal(after.ctimeMs, before.ctimeMs);
});

test("context preparation refuses hardlinked or symbolic build inputs", (t) => {
  const f = contextFixture(t), input = path.join(f.producer, "dist/cli.js");
  fs.linkSync(input, path.join(f.producer, "dist/shared.js"));
  assert.throws(() => ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer), /hard link/);
  assert.equal(fs.existsSync(f.contextDir), false);
  fs.unlinkSync(path.join(f.producer, "dist/shared.js"));
  fs.symlinkSync(input, path.join(f.producer, "dist/linked.js"));
  assert.throws(() => ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer), /symbolic link/);
  assert.equal(fs.existsSync(f.contextDir), false);
});

test("real synthetic coverage executions retain both default runs and the ladder's exact output layout", (t) => {
  const root = fixture(t), outputBase = path.join(root, "coverage");
  const runtimePaths = coverageConfig.measured_paths.map(({ id }) => id === "cli" ? "dist/cli.js" : `dist/${id}/fixture.js`);
  for (const file of runtimePaths) put(path.join(root, file), "module.exports = 1;\n");
  put(path.join(root, "scripts/coverage-contract.json"), JSON.stringify({ ...coverageConfig, output_dir: outputBase }));
  put(path.join(root, "tests/a.test.ts"), "// synthetic source manifest entry\n");
  put(path.join(root, "dist/tests/a.test.js"), `
    const test = require('node:test'), assert = require('node:assert/strict');
    test('synthetic measured surfaces', () => {
      for (const file of ${JSON.stringify(runtimePaths)}) assert.equal(require(require('node:path').resolve(file)), 1);
    });
  `);
  put(path.join(root, "tests/a.test.mjs"), "import test from 'node:test'; test('synthetic MJS control', () => {});\n");
  const directories = [];
  for (const explicit of [undefined, undefined, path.join(root, "ladder/coverage")]) {
    const env = { ...process.env };
    for (const key of ["MDKG_COVERAGE_DIR", "NODE_V8_COVERAGE", "MDKG_COVERAGE_EVENT_PATH", "NODE_TEST_CONTEXT"]) delete env[key];
    if (explicit) env.MDKG_COVERAGE_DIR = explicit;
    const result = spawnSync(process.execPath, ["-e", `require(${JSON.stringify(coveragePath)}).execute('measure', ${JSON.stringify(root)});`], {
      cwd: root, env, encoding: "utf8", timeout: 10000,
    });
    assert.equal(result.status, 0, result.stderr + result.stdout);
    const output = result.stderr.match(/coverage evidence directory: ([^\r\n]+)/)?.[1];
    assert.ok(output, result.stderr);
    if (explicit) assert.equal(output, explicit);
    else assert.equal(path.dirname(output), outputBase);
    const summary = JSON.parse(fs.readFileSync(path.join(output, "summary.json"), "utf8"));
    const manifest = JSON.parse(fs.readFileSync(path.join(output, "manifest.json"), "utf8"));
    assert.equal(summary.ok, true);
    assert.equal(summary.output_dir, output);
    assert.equal(summary.test_contract.total_test_files, 2);
    assert.equal(summary.test_contract.failed, 0);
    assert.equal(summary.measured_surface.file_count, 7);
    assert.ok(manifest.evidence.raw_files.length > 0);
    directories.push(output);
  }
  assert.equal(new Set(directories).size, 3);
  for (const output of directories) assert.ok(fs.existsSync(path.join(output, "coverage-event.json")));
});

for (const leaf of ["package.tgz", "context.json"]) {
  test(`full-context ${leaf} symlink refuses before following the leaf`, (t) => {
    const f = contextFixture(t);
    ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer);
    const target = path.join(f.contextDir, leaf), original = path.join(f.root, `saved-${leaf}`);
    fs.renameSync(target, original);
    fs.symlinkSync(original, target);
    const oldRead = fs.readFileSync;
    fs.readFileSync = function(file, ...args) {
      if (file === target) throw new Error("unsafe leaf read reached");
      return oldRead.call(this, file, ...args);
    };
    try {
      assert.throws(() => ladder.loadFullContext(f.contextDir, f.head, f.consumer), /independent regular file/);
    } finally { fs.readFileSync = oldRead; }
    assert.deepEqual(fs.readdirSync(f.consumer), []);
  });

  test(`full-context ${leaf} FIFO refuses promptly without a writer`, (t) => {
    const f = contextFixture(t);
    ladder.writeFullContext(f.contextDir, f.artifact, f.hash, { head: f.head }, f.producer);
    const target = path.join(f.contextDir, leaf);
    fs.unlinkSync(target);
    // mkfifo only constructs a disposable special-file fixture. It is not used
    // by mdkg or qualification production code as a filesystem bridge.
    const made = spawnSync("mkfifo", [target], { cwd: f.root, encoding: "utf8", timeout: 5000 });
    assert.equal(made.status, 0, made.stderr);
    const result = spawnSync(process.execPath, ["-e", `
      require(${JSON.stringify(path.join(repoRoot, "scripts/release-ladder.js"))}).loadFullContext(
        ${JSON.stringify(f.contextDir)}, ${JSON.stringify(f.head)}, ${JSON.stringify(f.consumer)});
    `], { cwd: f.root, encoding: "utf8", timeout: 3000 });
    assert.equal(result.error, undefined);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /independent regular file/);
    assert.deepEqual(fs.readdirSync(f.consumer), []);
  });
}

test("qualification JSON rejects hardlinks and oversized metadata before reading", (t) => {
  const root = fixture(t), file = path.join(root, "context.json");
  put(file, '{"ok":true}\n');
  assert.deepEqual(outputs.readRegularJsonFile(file), { ok: true });
  assert.throws(() => outputs.readRegularJsonFile(file, 4), /bounded independent regular file/);
  fs.linkSync(file, path.join(root, "linked.json"));
  assert.throws(() => outputs.readRegularJsonFile(file), /independent regular file/);
});

test("ladder keeps earlier receipts and CI startup evidence in a populated collection directory", (t) => {
  const root = fixture(t), receipts = path.join(root, "receipts");
  put(path.join(receipts, "receipt.json"), "previous receipt\n");
  put(path.join(receipts, "progress.json"), "previous progress\n");
  put(path.join(receipts, "workflow-start.json"), '{"status":"started"}\n');
  const runDirs = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = spawnSync(process.execPath, ["-e", `
      require('node:child_process').spawnSync = () => { throw new Error('synthetic boundary stop'); };
      process.argv[2] = 'ci';
      process.exitCode = require(${JSON.stringify(path.join(repoRoot, "scripts/release-ladder.js"))}).main();
    `], { cwd: root, env: { ...process.env, MDKG_RELEASE_RECEIPT_DIR: receipts }, encoding: "utf8", timeout: 5000 });
    assert.equal(result.status, 1, result.stderr);
    const receipt = JSON.parse(result.stdout);
    assert.equal(receipt.error, "synthetic boundary stop");
    assert.equal(path.dirname(receipt.receipt_dir), receipts);
    assert.ok(fs.existsSync(path.join(receipt.receipt_dir, "receipt.json")));
    runDirs.push(receipt.receipt_dir);
  }
  assert.notEqual(runDirs[0], runDirs[1]);
  assert.equal(fs.readFileSync(path.join(receipts, "receipt.json"), "utf8"), "previous receipt\n");
  assert.equal(fs.readFileSync(path.join(receipts, "progress.json"), "utf8"), "previous progress\n");
  assert.equal(fs.readFileSync(path.join(receipts, "workflow-start.json"), "utf8"), '{"status":"started"}\n');
});

test("ladder rejects a linked receipt collection before any Git or gate subprocess", (t) => {
  const root = fixture(t), outside = path.join(root, "sentinel"), link = path.join(root, "link");
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, link, "dir");
  const result = spawnSync(process.execPath, ["-e", `
    require('node:child_process').spawnSync = () => { throw new Error('unexpected subprocess'); };
    process.argv[2] = 'ci';
    process.exitCode = require(${JSON.stringify(path.join(repoRoot, "scripts/release-ladder.js"))}).main();
  `], { cwd: root, env: { ...process.env, MDKG_RELEASE_RECEIPT_DIR: link }, encoding: "utf8", timeout: 5000 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /receipt directory refused.*link or non-directory/);
  assert.doesNotMatch(result.stderr + result.stdout, /unexpected subprocess/);
  assert.deepEqual(fs.readdirSync(outside), []);
});
