import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
const { qualifySnapshotVerification } = require("../../../tests/fixtures/snapshot-verification.cjs");
const { verifyProjectDbSnapshot } = require("../../core/project_db_snapshot");
const { loadConfig } = require("../../core/config");
const cli = path.resolve(__dirname, "../../cli.js");

// Synchronous fault injection into check construction; restore before returning
// to the test runner. No production-only test seam or public API is required.
function withCheckMutation(change: (items: any[]) => any[], run: () => any): any {
  const push = Array.prototype.push;
  Array.prototype.push = function(this: any[], ...items: any[]) { return push.apply(this, change(items)); };
  try { return run(); } finally { Array.prototype.push = push; }
}

function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-snapshot-validity-unit-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const args of [["init", "--graph-only"], ["db", "init"], ["db", "migrate"], ["db", "snapshot", "seal"]]) {
    const r = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
    assert.equal(r.status, 0, r.stdout + r.stderr);
  }
  return { root, config: loadConfig(root), snapshot: path.join(root, ".mdkg/db/state/project.sqlite"),
    manifest: path.join(root, ".mdkg/db/state/project.manifest.json") };
}

test("snapshot validity CLI and status preserve mandatory checks and observation semantics", { skip: process.platform === "win32" }, () => {
  const result = qualifySnapshotVerification({ cli, tempRoot: fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir() });
  assert.equal(result.pass, true, JSON.stringify(result.cases.filter((c: any) => !c.pass), null, 2));
});

test("snapshot admission failures include diagnostics and do not reach content readers", t => {
  const f = fixture(t), read = fs.readFileSync;
  fs.unlinkSync(f.snapshot); fs.mkdirSync(f.snapshot);
  t.mock.method(fs, "readFileSync", (...args: any[]) => {
    assert.notEqual(String(args[0]), f.manifest); assert.notEqual(String(args[0]), f.snapshot);
    return (read as any)(...args);
  });
  const r = verifyProjectDbSnapshot(f.root, f.config);
  assert.equal(r.ok, false); assert.equal(r.status, "invalid"); assert.equal(r.failure_count, 1);
  assert.match(r.errors.join("\n"), /regular file/);
  assert.deepEqual(r.checks.map((c: any) => c.name), ["snapshot-file", "manifest-file"]);
});

test("snapshot inspection exceptions produce invalid receipts without content reads", t => {
  const f = fixture(t), stat = fs.lstatSync;
  t.mock.method(fs, "lstatSync", (...args: any[]) => {
    if (String(args[0]) === f.snapshot) throw Object.assign(new Error("synthetic denied"), { code: "EACCES" });
    return (stat as any)(...args);
  });
  const r = verifyProjectDbSnapshot(f.root, f.config);
  assert.equal(r.ok, false); assert.equal(r.status, "invalid"); assert.match(r.errors.join("\n"), /synthetic denied/);
});

test("failed checks cannot become success by losing their diagnostic strings", t => {
  const f = fixture(t);
  fs.unlinkSync(f.snapshot); fs.mkdirSync(f.snapshot);
  const r = withCheckMutation(items => {
    for (const item of items) if (item?.name === "snapshot-file" && item.ok === false) item.errors = [];
    return items;
  }, () => verifyProjectDbSnapshot(f.root, f.config));
  assert.equal(r.ok, false); assert.equal(r.status, "invalid"); assert.equal(r.failure_count, 1);
  assert.match(r.errors[0], /snapshot-file/);
});

test("omitted mandatory checks cannot produce a successful validity receipt", t => {
  const f = fixture(t);
  const r = withCheckMutation(items => items.filter(item => item?.name !== "queue-policy"),
    () => verifyProjectDbSnapshot(f.root, f.config));
  assert.equal(r.ok, false); assert.equal(r.status, "invalid");
  assert.match(r.errors.join("\n"), /queue-policy/);
});

test("all diagnostics remain counted when a failed check has multiple errors", t => {
  const f = fixture(t);
  fs.unlinkSync(f.snapshot); fs.mkdirSync(f.snapshot);
  const r = withCheckMutation(items => {
    for (const item of items) if (item?.name === "snapshot-file" && item.ok === false) item.errors = ["first", "second"];
    return items;
  }, () => verifyProjectDbSnapshot(f.root, f.config));
  assert.equal(r.ok, false); assert.equal(r.failure_count, 2); assert.equal(r.errors.length, 2);
});
