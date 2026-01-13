import { test } from "node:test";
import assert from "node:assert/strict";
const { parseNode } = require("../../graph/node");

function taskFrontmatterWithPriority(priorityLine: string): string {
  const frontmatter = [
    "---",
    "id: task-1",
    "type: task",
    "title: do the thing",
    "status: todo",
    priorityLine,
    "tags: [a]",
    "links: []",
    "artifacts: []",
    "relates: [task-2]",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
  ];
  return frontmatter.concat(["---", "", "Body"]).join("\n");
}

test("parseNode parses a valid task", () => {
  const node = parseNode(taskFrontmatterWithPriority("priority: 2"), "task.md");
  assert.equal(node.id, "task-1");
  assert.equal(node.status, "todo");
  assert.equal(node.priority, 2);
  assert.deepEqual(node.edges.relates, ["task-2"]);
});

test("parseNode requires status for work items", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: missing status",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "missing-status.md"), /status is required/);
});

test("parseNode enforces priority bounds", () => {
  const content = taskFrontmatterWithPriority("priority: 12");
  assert.throws(() => parseNode(content, "priority.md"), /priority must be between 0 and 9/);
});

test("parseNode accepts decision status enum", () => {
  const content = [
    "---",
    "id: dec-1",
    "type: dec",
    "title: decide",
    "status: accepted",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "dec.md");
  assert.equal(node.status, "accepted");
});
