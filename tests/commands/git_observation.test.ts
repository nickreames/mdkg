import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const { qualifyGitObservation } = require(path.resolve(__dirname, "../../../tests/fixtures/git-observation.cjs"));

test("all observational Git helpers preserve root child worktree and indirect indexes regardless of caller policy", { timeout: 240000 }, (t) => {
  const base = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-git-observation-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const result = qualifyGitObservation({ cli: path.resolve(__dirname, "../../cli.js"), tempRoot: base });
  assert.equal(result.cases, 288);
  assert.equal(result.controls.length, 4);
  assert(result.controls.every((control: { native_refresh_observed: boolean; intentional_graph_mutation_preserves_git_index: boolean }) =>
    control.native_refresh_observed && control.intentional_graph_mutation_preserves_git_index));
});
