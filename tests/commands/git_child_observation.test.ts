import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const cli = path.resolve(__dirname, "../../cli.js");
const { qualifyGitChildObservation } = require(path.resolve(__dirname, "../../../tests/fixtures/git-child-observation.cjs"));

for (const topology of ["nested", "worktree", "submodule", "gitdir"]) {
  test(`registered ${topology} child observation preserves snapshots without claiming unknown freshness`, {
    skip: process.platform === "win32", timeout: 240000,
  }, t => {
    const base = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-child-helpers-test-"));
    t.after(() => fs.rmSync(base, { recursive: true, force: true }));
    const receipt = qualifyGitChildObservation({ cli, tempRoot: base, topology });
    assert.equal(receipt.cases.length, 72);
  });
}
