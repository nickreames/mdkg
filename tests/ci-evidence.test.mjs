import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { collect, coverageDiagnostic } = require("../scripts/collect-ci-evidence.js");
const { createOwnedFixture } = require("../scripts/qualification-fixture.js");
const put = (file, bytes) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); };
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
function fixtureTest(name, exercise) {
  test(name, { skip: process.platform !== "linux" }, () => {
    const f = createOwnedFixture({ prefix: "mdkg-ci-evidence-" });
    try { exercise(f); } finally { f.cleanup(); }
  });
}
fixtureTest("CI fixture archive preserves newline/colon/quote paths and raw evidence without renaming source", f => {
  const source = f.resolve("collection"), output = f.resolve("archives"), run = path.join(source, "run-Ab1234");
  put(path.join(source, "workflow-start.json"), "startup evidence\n");
  const names = ["consumer/line\nname", 'consumer/colon:quote"name', "consumer/--option"];
  const payload = "synthetic interrupted fixture\n";
  for (const name of names) put(path.join(run, "tmp", name), payload);
  put(path.join(run, "tmp/.hidden-control"), "original export excludes hidden bytes\n");
  put(path.join(run, "coverage/raw/123.json"), "raw V8 evidence\n");
  put(path.join(run, "logs/coverage.log"), "FAIL exact regression case\nSUMMARY pass=1 fail=1 total=2\n");
  const reports = [];
  const receipt = collect(source, output, { report: event => {
    reports.push(event);
    const created = fs.readdirSync(output)[0];
    assert.equal(fs.readdirSync(path.join(output, created)).some(name => name.endsWith(".tar.gz")), false);
  } }); assert.equal(receipt.ok, true);
  assert.equal(reports[0].action, "ci-coverage-diagnostic");
  assert.equal(reports[0].coverage.failure_count, 1);
  const item = receipt.runs[0], archive = path.join(receipt.directory, item.fixture_archive.path);
  assert.equal(hash(fs.readFileSync(archive)), item.fixture_archive.sha256);
  for (const name of names) {
    assert.equal(fs.readFileSync(path.join(run, "tmp", name), "utf8"), payload);
    const result = spawnSync("tar", ["-xOzf", archive, `./${name}`], { encoding: "utf8", timeout: 5000 });
    assert.equal(result.status, 0, result.stderr); assert.equal(result.stdout, payload);
  }
  const hidden = spawnSync("tar", ["-xOzf", archive, "./.hidden-control"], { encoding: "utf8", timeout: 5000 });
  assert.notEqual(hidden.status, 0);
  assert.equal(fs.readFileSync(path.join(run, "coverage/raw/123.json"), "utf8"), "raw V8 evidence\n");
  assert.equal(item.coverage.failure_count, 1); assert.equal(item.coverage.failed_cases.tail_utf8, "FAIL exact regression case");
  assert.equal(fs.readFileSync(path.join(source, "workflow-start.json"), "utf8"), "startup evidence\n");
  const repeated = collect(source, output); assert.notEqual(repeated.directory, receipt.directory);
  assert.equal(fs.existsSync(archive), true);
});
fixtureTest("CI archive records symbolic links without reading or exporting their outside target", f => {
  const source = f.resolve("collection"), run = path.join(source, "run-Ab1234"), outside = f.resolve("outside-control");
  put(outside, "do not export target\n"); fs.mkdirSync(path.join(run, "tmp"), { recursive: true });
  fs.symlinkSync(outside, path.join(run, "tmp/link"));
  const r = collect(source, f.resolve("archives")), archive = path.join(r.directory, r.runs[0].fixture_archive.path);
  const result = spawnSync("tar", ["-xOzf", archive, "./link"], { encoding: "utf8", timeout: 5000 });
  assert.equal(result.stdout, ""); assert.equal(fs.readFileSync(outside, "utf8"), "do not export target\n");
  assert.equal(fs.readlinkSync(path.join(run, "tmp/link")), outside);
});
fixtureTest("CI collection refuses overlapping destinations and linked run/tmp custody before writes", f => {
  const source = f.resolve("collection"), output = f.resolve("archives"); fs.mkdirSync(source);
  assert.throws(() => collect(source, path.join(source, "archive")), /overlap/);
  assert.equal(fs.existsSync(path.join(source, "archive")), false);
  const outside = f.resolve("outside"); fs.mkdirSync(outside); fs.symlinkSync(outside, path.join(source, "run-Ab1234"));
  assert.throws(() => collect(source, output), /unlinked directory/); assert.equal(fs.existsSync(output), false);
  fs.unlinkSync(path.join(source, "run-Ab1234")); fs.mkdirSync(path.join(source, "run-Ab1234"));
  fs.symlinkSync(f.resolve("absent"), path.join(source, "run-Ab1234/tmp"));
  assert.throws(() => collect(source, output), /link or non-directory/); assert.equal(fs.existsSync(output), false);
});
fixtureTest("CI failed-case summary is bounded and cannot claim acceptance when logs are absent or unsafe", f => {
  const run = f.resolve("run"); fs.mkdirSync(run); assert.equal(coverageDiagnostic(run).state, "log-not-written");
  const log = path.join(run, "logs/coverage.log"); const bytes = "FAIL synthetic long case\n".repeat(1000)+"SUMMARY pass=0 fail=1000 total=1000\n";
  put(log, bytes); const d = coverageDiagnostic(run);
  assert.equal(d.failure_count, 1000); assert.equal(d.failed_cases.truncated, true);
  assert.ok(Buffer.byteLength(d.failed_cases.tail_utf8) <= 8192); assert.equal(d.sha256, hash(bytes));
  fs.unlinkSync(log); const outside = f.resolve("outside-log"); put(outside, "outside sentinel\n"); fs.symlinkSync(outside, log);
  assert.equal(coverageDiagnostic(run).state, "diagnostic-unavailable");
  assert.equal(fs.readFileSync(outside, "utf8"), "outside sentinel\n");
});
