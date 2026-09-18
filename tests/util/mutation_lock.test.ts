import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeTempDir } from "../helpers/fs";
const { withMutationLock } = require("../../util/lock");

function fixture(t: { after(fn: () => void): void }) {
  const root = makeTempDir("mdkg-lock-custody-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, lock: path.join(root, ".mdkg/index/write.lock") };
}

test("mutation lock release preserves unknown files and reports custody loss", t => {
  const { root, lock } = fixture(t);
  assert.throws(() => withMutationLock(root, 0, () => {
    fs.writeFileSync(path.join(lock, "unknown.txt"), "independent bytes\n");
  }), /lock.*custody|custody.*lock/);
  assert.equal(fs.readFileSync(path.join(lock, "unknown.txt"), "utf8"), "independent bytes\n");
  assert.equal(fs.existsSync(path.join(lock, "owner.json")), true);
});

test("mutation lock release preserves a replaced owner record", t => {
  const { root, lock } = fixture(t);
  assert.throws(() => withMutationLock(root, 0, () => {
    fs.writeFileSync(path.join(lock, "owner.json"), "new owner bytes\n");
  }), /lock.*custody|custody.*lock/);
  assert.equal(fs.readFileSync(path.join(lock, "owner.json"), "utf8"), "new owner bytes\n");
});

test("nested writers recheck the exact held lock rather than trusting a process-local flag", t => {
  const { root, lock } = fixture(t);
  let entered = false;
  assert.throws(() => withMutationLock(root, 0, () => {
    fs.writeFileSync(path.join(lock, "owner.json"), "new owner bytes\n");
    withMutationLock(root, 0, () => { entered = true; });
  }), /lock.*custody|custody.*lock/);
  assert.equal(entered, false);
  assert.equal(fs.readFileSync(path.join(lock, "owner.json"), "utf8"), "new owner bytes\n");
});

test("normal and caught-error lock release stays scoped and permits later writers", t => {
  const { root, lock } = fixture(t);
  assert.equal(withMutationLock(root, 0, () => withMutationLock(root, 0, () => 42)), 42);
  assert.equal(fs.existsSync(lock), false);
  assert.throws(() => withMutationLock(root, 0, () => { throw Error("owned callback failure"); }), /owned callback failure/);
  assert.equal(fs.existsSync(lock), false);
  assert.equal(withMutationLock(root, 0, () => 43), 43);
});
