import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const cli = path.resolve(__dirname, "../../cli.js");
const { qualifyGitHelperObservation, qualifyUpgradeGitObservation, qualifyBundleGitProvenance } = require(path.resolve(__dirname, "../../../tests/fixtures/git-helper-observation.cjs"));

for (const topology of ["standalone", "worktree", "submodule", "gitdir", "nested"]) {
  test(`generic Git observations are helper-free and fail closed in ${topology}`, {
    skip: process.platform === "win32", timeout: 240000,
  }, t => {
    const base = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-helpers-test-"));
    t.after(() => fs.rmSync(base, { recursive: true, force: true }));
    const receipt = qualifyGitHelperObservation({ cli, tempRoot: base, topology,
      failureVariants: topology === "standalone" });
    assert.equal(receipt.cases.length, topology === "standalone" ? 110 : 80);
    assert.equal(receipt.controls.length, 9);
  });
}

test("missing-event upgrade previews neither execute Git helpers nor reconstruct history", {
  skip: process.platform === "win32", timeout: 30000,
}, t => {
  const base = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-upgrade-helpers-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  assert.equal(qualifyUpgradeGitObservation({ cli, tempRoot: base }).length, 2);
});

test("bundle provenance preserves literal paths and refuses unverified recorded HEADs", {
  skip: process.platform === "win32", timeout: 30000,
}, t => {
  const base = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-bundle-git-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  assert.equal(qualifyBundleGitProvenance({ cli, tempRoot: base }).length, 6);
});
