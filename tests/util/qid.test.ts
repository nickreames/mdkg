import { test } from "node:test";
import assert from "node:assert/strict";
const { formatResolveError } = require("../../util/qid");

test("formatResolveError formats missing errors", () => {
  const message = formatResolveError("id", "task-9", { status: "missing", candidates: [] }, "root");
  assert.ok(message.includes("not found"));
  assert.ok(message.includes("root"));
});

test("formatResolveError formats ambiguous errors", () => {
  const message = formatResolveError("id", "task-1", {
    status: "ambiguous",
    candidates: ["root:task-1", "other:task-1"],
  });
  assert.ok(message.includes("ambiguous"));
  assert.ok(message.includes("root:task-1"));
});
