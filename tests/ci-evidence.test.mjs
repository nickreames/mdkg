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
const { failureDetail, admitFailureDetail, LIMIT } = require("../scripts/test-failure-detail.js");
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
fixtureTest("actual coverage reporter retains safe assertion/cause details and keeps failed summaries and exit red", f => {
  const secret = "synthetic-credential-do-not-export-8FK3", file = f.resolve(`private-${secret}/control.test.cjs`);
  put(file, `const test=require('node:test');const assert=require('node:assert/strict');
test('assertion control',()=>assert.equal('${secret}','other-value','password=${secret}'));
test('nested error control',()=>{throw new Error('Bearer ${secret}',{cause:new TypeError('token=${secret}')})});
test('passing control',()=>assert.equal(1,1));\n`);
  const event = f.resolve("coverage-event.json");
  // This synthetic invocation is a standalone test runner, not an inherited
  // Node worker. Retain its real failing summary and process exit semantics.
  const env = { ...process.env, MDKG_COVERAGE_EVENT_PATH: event };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ["--test", "--experimental-test-coverage",
    `--test-reporter=${path.resolve("scripts/coverage-reporter.js")}`, file], {
    env, encoding: "utf8", timeout: 15000,
  });
  assert.equal(result.status, 1); assert.equal(result.stdout.includes(secret), false, "credential values and private paths must be omitted");
  assert.equal(result.stdout.includes("other-value"), false);
  const records = result.stdout.split("\n").filter(line => line.startsWith("FAIL_DETAIL ")).map(line => JSON.parse(line.slice(12)));
  assert.equal(records.length, 2); assert.ok(records.every(admitFailureDetail));
  const assertion = records[0].errors.find(error => error.code === "ERR_ASSERTION");
  assert.equal(assertion.operator, "strictEqual"); assert.deepEqual(assertion.actual, { kind: "string", length: secret.length });
  assert.equal(records[0].location.file, "[outside-repository]"); assert.ok(records[0].location.line > 0);
  assert.ok(records[1].errors.some(error => error.name === "TypeError"));
  const payload = JSON.parse(fs.readFileSync(event, "utf8"));
  assert.equal(payload.test_summary.success, false); assert.equal(payload.test_summary.counts.failed, 2);
  assert.equal(payload.test_summary.counts.passed, 1); assert.ok(payload.coverage);
});
fixtureTest("failure detail bounds causes/frames, keeps repository assertion locations and does not invoke custom getters", f => {
  const secret = "synthetic-sensitive-message", error = new assert.AssertionError({
    actual: secret.repeat(10000), expected: "expected-private-payload", operator: "strictEqual", message: secret,
  });
  let reads = 0; Object.defineProperty(error, "cause", { get() { reads++; throw new Error(secret); } });
  error.stack = `${secret}\n at control (${path.resolve("tests/ci-evidence.test.mjs")}:123:4)\n at outside (${f.resolve(secret)}:5:6)`;
  const detail = failureDetail({ file: path.resolve("tests/ci-evidence.test.mjs"), line: 123, column: 4, details: { error } });
  const text = JSON.stringify(detail); assert.ok(Buffer.byteLength(text) <= LIMIT); assert.equal(reads, 0);
  assert.equal(text.includes(secret), false); assert.equal(text.includes("expected-private-payload"), false);
  assert.deepEqual(detail.errors[0].locations, [{ file: "tests/ci-evidence.test.mjs", line: 123, column: 4 }]);
  assert.ok(admitFailureDetail(detail));
  const chain = new Error(secret); chain.cause = chain;
  assert.equal(failureDetail({ details: { error: chain } }).truncated, true);
  const phantom = failureDetail({ file: path.resolve(`tests/${secret}.js`), line: 1, column: 2 });
  assert.equal(phantom.location.file, "[outside-repository]"); assert.equal(JSON.stringify(phantom).includes(secret), false);
  const proxy = new Proxy([], { getOwnPropertyDescriptor(target, key) {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    return key === "length" ? { ...descriptor, value: secret } : descriptor;
  } });
  const malformed = new Error(secret); malformed.actual = proxy;
  assert.equal(JSON.stringify(failureDetail({ details: { error: malformed } })).includes(secret), false);
});
fixtureTest("collector relays bounded admitted failure details and rejects forged secret payloads", f => {
  const run = f.resolve("run"), log = path.join(run, "logs/coverage.log");
  const detail = failureDetail({ file: path.resolve("tests/ci-evidence.test.mjs"), line: 123, column: 4,
    details: { error: new assert.AssertionError({ actual: false, expected: true, operator: "==" }) } });
  const forged = { ...detail, message: "password=synthetic-private-credential" };
  put(log, "FAIL synthetic control\n" + `FAIL_DETAIL ${JSON.stringify(detail)}\n`.repeat(100) +
    `FAIL_DETAIL ${JSON.stringify(forged)}\nFAIL_DETAIL invalid-json-token\nSUMMARY pass=0 fail=1 total=1\n`);
  const diagnostic = coverageDiagnostic(run); assert.equal(diagnostic.failure_count, 1);
  assert.equal(diagnostic.failure_detail_count, 100); assert.equal(diagnostic.rejected_detail_count, 2);
  assert.equal(diagnostic.failure_details.truncated, true); assert.ok(Buffer.byteLength(diagnostic.failure_details.tail_utf8) <= 8192);
  assert.equal(JSON.stringify(diagnostic).includes("synthetic-private-credential"), false);
  assert.equal(diagnostic.final_summary, "SUMMARY pass=0 fail=1 total=1");
});
