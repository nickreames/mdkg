import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const { qualifySourceReadAdmission } = require("../../../tests/fixtures/source-read-admission.cjs");
const { buildBundle, verifyBundle } = require("../../commands/bundle");
const { readZipEntries, createDeterministicZipFromEntries } = require("../../util/zip");
const gitObservation = require("../../util/git_observation");

test("config and bundle source admission stay bounded and MCP recovers", { skip: process.platform === "win32" }, async () => {
  const result = await qualifySourceReadAdmission({ cli: path.resolve(__dirname, "../../cli.js"),
    tempRoot: fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir() });
  assert.equal(result.pass, true, JSON.stringify(result.cases.filter((c: { pass: boolean }) => !c.pass), null, 2));
});

function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-source-read-unit-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [path.resolve(__dirname, "../../cli.js"), "init", "--graph-only"],
    { cwd: root, encoding: "utf8", timeout: 10000, env: { PATH: process.env.PATH, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" } });
  assert.equal(result.status, 0, result.stderr);
  const bytes = buildBundle({ root }).zip, bundle = path.join(root, "sample.zip");
  fs.writeFileSync(bundle, bytes);
  const relative = ".mdkg/README.md", file = path.join(root, relative);
  return { root, bundle, bytes, file, relative };
}

test("invalid bundle payload performs no source or Git freshness observations", t => {
  const f = fixture(t), entries = readZipEntries(f.bytes);
  entries.find((e: { name: string }) => e.name === f.relative).data = Buffer.from("synthetic payload mismatch");
  fs.writeFileSync(f.bundle, createDeterministicZipFromEntries(entries));
  for (const method of ["existsSync", "openSync", "readFileSync"] as const) {
    const original = fs[method];
    t.mock.method(fs, method, (...args: any[]) => {
      assert.notEqual(String(args[0]), f.file, "invalid payload reached source freshness");
      return (original as any)(...args);
    });
  }
  t.mock.method(gitObservation, "insideGitWorkTree", () => assert.fail("invalid payload reached Git freshness"));
  const result = verifyBundle(f.root, f.bundle);
  assert.equal(result.ok, false); assert.equal(result.stale, false);
  assert.match(result.errors.join("\n"), /hash mismatch/); assert.deepEqual(result.stale_paths, []);
});

test("bundle source post-stat growth is bounded and its descriptor closes", t => {
  const f = fixture(t), length = fs.statSync(f.file).size;
  const open = fs.openSync, read = fs.readSync, close = fs.closeSync;
  let descriptor: number | undefined, consumed = 0, grew = false, closed = false;
  t.mock.method(fs, "openSync", (...args: any[]) => {
    const fd = (open as any)(...args);
    if (String(args[0]) === f.file && descriptor === undefined) descriptor = fd;
    return fd;
  });
  t.mock.method(fs, "readSync", (...args: any[]) => {
    if (args[0] === descriptor && !closed && !grew) { fs.appendFileSync(f.file, "x"); grew = true; }
    const count = (read as any)(...args);
    if (args[0] === descriptor && !closed) consumed += count;
    return count;
  });
  t.mock.method(fs, "closeSync", (fd: number) => { if (fd === descriptor) closed = true; return close(fd); });
  const result = verifyBundle(f.root, f.bundle);
  assert.equal(result.ok, false); assert.equal(result.stale, true); assert(result.stale_paths.includes(f.relative));
  assert.match(result.errors.join("\n"), /byte limit/);
  assert.equal(consumed, length + 1); assert.equal(closed, true);
});

test("bundle same-length changes and empty files preserve ordinary freshness semantics", t => {
  const f = fixture(t), original = fs.readFileSync(f.file);
  const changed = Buffer.from(original); changed[0] ^= 1; fs.writeFileSync(f.file, changed);
  let result = verifyBundle(f.root, f.bundle);
  assert.equal(result.stale, true); assert.deepEqual(result.errors, []); assert(result.stale_paths.includes(f.relative));
  fs.writeFileSync(f.file, ""); fs.writeFileSync(f.bundle, buildBundle({ root: f.root }).zip);
  result = verifyBundle(f.root, f.bundle); assert.equal(result.ok, true);
});
