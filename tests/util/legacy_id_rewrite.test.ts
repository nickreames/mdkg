import { test } from "node:test";
import assert from "node:assert/strict";
const { rewriteLegacyIdReferences } = require("../../util/legacy_id_rewrite");

test("legacy alias matching preserves whole IDs, workspace qualifiers and opaque tokens", () => {
  const unchanged = ["task-10", "task-100", "prefix-task-1", "task-1-suffix", "task-1.ext", "other:task-1", "mdkg://other:task-1",
    "https://example.invalid/task-1", "https://example.invalid/?q=task-1#task-1", "artifact://evidence?q=task-1", "artifact://task-1", "TASK-1:task-20", "Ωtask-1", "task-1Ω", ".mdkg/work/task-1.md"];
  for (const input of unchanged) assert.deepEqual(rewriteLegacyIdReferences(input, "task-1", "task-2", "root"), { text: input, count: 0 }, input);
  const input = "refs: [task-1, root:task-1]\nSelf note for task-1. mdkg://task-1 mdkg://root:task-1\n";
  assert.deepEqual(rewriteLegacyIdReferences(input, "task-1", "task-2", "root"), {
    text: "refs: [task-2, root:task-2]\nSelf note for task-2. mdkg://task-2 mdkg://root:task-2\n", count: 5,
  });
});
