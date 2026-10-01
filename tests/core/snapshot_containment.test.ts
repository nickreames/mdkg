import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
const sqlite = require("node:sqlite");
const { qualifySnapshotContainment } = require("../../../tests/fixtures/snapshot-containment.cjs");
const { verifyProjectDbSnapshot, sealProjectDbSnapshot } = require("../../core/project_db_snapshot");
const { loadConfig } = require("../../core/config");
const cli = path.resolve(__dirname, "../../cli.js");
function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-snapshot-containment-unit-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const args of [["init", "--graph-only"], ["db", "init"], ["db", "migrate"], ["db", "snapshot", "seal"]]) {
    const r = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 }); assert.equal(r.status, 0, r.stdout + r.stderr);
  }
  return { root, config: loadConfig(root), snapshot: path.join(root, ".mdkg/db/state/project.sqlite"), manifest: path.join(root, ".mdkg/db/state/project.manifest.json"), runtime: path.join(root, ".mdkg/db/runtime/project.sqlite") };
}

test("snapshot containment installed-compatible CLI fixture", { skip: process.platform === "win32" }, () => {
  const r = qualifySnapshotContainment({ cli, tempRoot: os.tmpdir() }); assert.equal(r.pass, true, JSON.stringify(r.cases.filter((c: any) => !c.pass), null, 2));
});

test("unsafe optional runtime refuses before any native snapshot open", t => {
  const f = fixture(t); fs.unlinkSync(f.runtime); fs.symlinkSync(f.snapshot, f.runtime);
  t.mock.method(sqlite, "DatabaseSync", () => { throw new Error("native open must not execute"); });
  const result = verifyProjectDbSnapshot(f.root, f.config); assert.equal(result.ok, false); assert.equal(result.status, "invalid");
  assert.match(result.errors.join("\n"), /symbolic link/); assert(!result.errors.join("\n").includes("native open must not execute"));
  assert.throws(() => sealProjectDbSnapshot(f.root, f.config), /symbolic link/);
});

test("snapshot observations use explicitly read-only SQLite connections", t => {
  const f = fixture(t), Original = sqlite.DatabaseSync; let opens = 0;
  t.mock.method(sqlite, "DatabaseSync", function(filename: string, options: any) {
    assert.equal(options?.readOnly, true); opens++; return new Original(filename, options);
  });
  assert.equal(verifyProjectDbSnapshot(f.root, f.config).ok, true); assert(opens >= 3);
});

test("large regular snapshots and runtime hashes stream without whole-file reads", t => {
  const f = fixture(t), db = new sqlite.DatabaseSync(f.runtime); db.exec("CREATE TABLE synthetic_blob(value BLOB); INSERT INTO synthetic_blob VALUES(zeroblob(4194304));"); db.close();
  sealProjectDbSnapshot(f.root, f.config);
  const readFile = fs.readFileSync, read = fs.readSync; let streamed = 0;
  t.mock.method(fs, "readFileSync", (...args: any[]) => {
    assert.notEqual(String(args[0]), f.runtime); assert.notEqual(String(args[0]), f.snapshot); return (readFile as any)(...args);
  });
  t.mock.method(fs, "readSync", (...args: any[]) => { assert(args[3] <= 65536); const count = (read as any)(...args); streamed += count; return count; });
  assert.equal(verifyProjectDbSnapshot(f.root, f.config).ok, true); assert(streamed > 8 * 1024 * 1024);
});

test("manifest byte cap checks actual reads even with understated descriptor size", t => {
  const f = fixture(t); f.config.index.limits.max_file_bytes = 4096; fs.appendFileSync(f.manifest, " ".repeat(8192));
  const stat = fs.fstatSync;
  t.mock.method(fs, "fstatSync", (...args: any[]) => { const s = (stat as any)(...args); return Object.assign(Object.create(s), { size: 0 }); });
  const r = verifyProjectDbSnapshot(f.root, f.config); assert.equal(r.ok, false); assert.match(r.errors.join("\n"), /byte limit/);
});

test("seal refuses a generated manifest beyond the configured read budget", t => {
  const f = fixture(t), before = fs.readFileSync(f.snapshot), manifest = fs.readFileSync(f.manifest); f.config.index.limits.max_file_bytes = 1;
  assert.throws(() => sealProjectDbSnapshot(f.root, f.config), /manifest exceeds byte limit/);
  assert.deepEqual(fs.readFileSync(f.snapshot), before); assert.deepEqual(fs.readFileSync(f.manifest), manifest);
  assert(!fs.readdirSync(path.dirname(f.snapshot)).some(name => name.endsWith(".tmp")));
});
