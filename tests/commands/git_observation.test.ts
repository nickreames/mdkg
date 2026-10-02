import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

const { qualifyGitObservation } = require(path.resolve(__dirname, "../../../tests/fixtures/git-observation.cjs"));
const { createOwnedFixture } = require(path.resolve(__dirname, "../../../scripts/qualification-fixture"));

test("all observational Git helpers preserve root child worktree and indirect indexes regardless of caller policy", { timeout: 240000 }, (t) => {
  const fixture = createOwnedFixture({ prefix: "mdkg-git-observation-test-" });
  t.after(() => fixture.cleanup());
  const result = qualifyGitObservation({ cli: path.resolve(__dirname, "../../cli.js"), tempRoot: fixture.root });
  assert.equal(result.cases, 288);
  assert.equal(result.controls.length, 4);
  assert.equal(result.cleanup.removed, true);
  assert(result.controls.every((control: { native_refresh_observed: boolean; intentional_graph_mutation_preserves_git_index: boolean }) =>
    control.native_refresh_observed && control.intentional_graph_mutation_preserves_git_index));
});
