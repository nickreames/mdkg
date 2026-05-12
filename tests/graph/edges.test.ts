import { test } from "node:test";
import assert from "node:assert/strict";

const { extractEdges } = require("../../graph/edges");

test("extractEdges normalizes scalar and list edges", () => {
  const edges = extractEdges(
    {
      epic: "epic-1",
      parent: "task-1",
      prev: "task-2",
      next: "task-3",
      relates: ["root:task-4"],
      blocked_by: ["task-5"],
      blocks: ["task-6"],
    },
    "fixture.md"
  );

  assert.deepEqual(edges, {
    epic: "epic-1",
    parent: "task-1",
    prev: "task-2",
    next: "task-3",
    relates: ["root:task-4"],
    blocked_by: ["task-5"],
    blocks: ["task-6"],
  });
});

test("extractEdges validates edge shapes and portable refs", () => {
  assert.throws(
    () => extractEdges({ epic: ["task-1"] }, "fixture.md"),
    /epic must be a string/
  );
  assert.throws(
    () => extractEdges({ relates: "task-1" }, "fixture.md"),
    /relates must be a list/
  );
  assert.throws(
    () => extractEdges({ relates: ["Task-1"] }, "fixture.md"),
    /relates must be lowercase/
  );
  assert.throws(
    () => extractEdges({ relates: ["note.alpha"] }, "fixture.md"),
    /invalid id reference/
  );
  assert.deepEqual(
    extractEdges({ relates: ["note.alpha"] }, "fixture.md", {
      allowPortableRefs: true,
    }).relates,
    ["note.alpha"]
  );
});
