import { test } from "node:test";
import assert from "node:assert/strict";
const { filterNodes } = require("../../util/filter");

function makeNode(overrides: Record<string, unknown> = {}) {
  return {
    id: "task-1",
    qid: "root:task-1",
    ws: "root",
    type: "task",
    title: "Task 1",
    status: "todo",
    priority: 1,
    created: "2026-01-06",
    updated: "2026-01-06",
    tags: [],
    owners: [],
    links: [],
    artifacts: [],
    refs: [],
    aliases: [],
    skills: [],
    path: ".mdkg/work/task-1.md",
    edges: {
      epic: undefined,
      parent: undefined,
      prev: undefined,
      next: undefined,
      relates: [],
      blocked_by: [],
      blocks: [],
    },
    ...overrides,
  };
}

test("filterNodes applies workspace/type/status filters", () => {
  const nodes = [
    makeNode({ qid: "root:task-1", ws: "root", type: "task", status: "todo" }),
    makeNode({ qid: "root:bug-1", ws: "root", type: "bug", status: "todo" }),
    makeNode({ qid: "other:task-2", ws: "other", type: "task", status: "progress" }),
  ];

  const result = filterNodes(nodes, { ws: "root", type: "task", status: "todo" });
  assert.deepEqual(
    result.map((node: { qid: string }) => node.qid),
    ["root:task-1"]
  );
});

test("filterNodes applies epic/priority/blocked filters", () => {
  const nodes = [
    makeNode({
      qid: "root:task-1",
      priority: 2,
      status: "blocked",
      edges: {
        epic: "root:epic-1",
        parent: undefined,
        prev: undefined,
        next: undefined,
        relates: [],
        blocked_by: [],
        blocks: [],
      },
    }),
    makeNode({
      qid: "root:task-2",
      priority: 2,
      edges: {
        epic: "root:epic-2",
        parent: undefined,
        prev: undefined,
        next: undefined,
        relates: [],
        blocked_by: ["root:task-9"],
        blocks: [],
      },
    }),
    makeNode({
      qid: "root:task-3",
      priority: 3,
      status: "blocked",
      edges: {
        epic: "root:epic-1",
        parent: undefined,
        prev: undefined,
        next: undefined,
        relates: [],
        blocked_by: ["root:task-9"],
        blocks: [],
      },
    }),
  ];

  const result = filterNodes(nodes, { epic: "root:epic-1", priority: 2, blocked: true });
  assert.deepEqual(
    result.map((node: { qid: string }) => node.qid),
    ["root:task-1"]
  );
});

test("filterNodes applies tag filtering with any/all modes", () => {
  const nodes = [
    makeNode({ qid: "root:task-1", tags: ["stage:plan", "lang:go"] }),
    makeNode({ qid: "root:task-2", tags: ["stage:execute"] }),
    makeNode({ qid: "root:task-3", tags: [] }),
  ];

  const anyMode = filterNodes(nodes, {
    tags: ["stage:plan", "stage:review"],
    tagsMode: "any",
  });
  assert.deepEqual(
    anyMode.map((node: { qid: string }) => node.qid),
    ["root:task-1"]
  );

  const allMode = filterNodes(nodes, {
    tags: ["stage:plan", "lang:go"],
    tagsMode: "all",
  });
  assert.deepEqual(
    allMode.map((node: { qid: string }) => node.qid),
    ["root:task-1"]
  );
});
