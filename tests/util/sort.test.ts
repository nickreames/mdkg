import { test } from "node:test";
import assert from "node:assert/strict";
const { sortIndexNodes, sortNodesByQid } = require("../../util/sort");

function makeNode(qid: string) {
  return {
    id: qid.split(":")[1],
    qid,
    ws: qid.split(":")[0],
    type: "task",
    title: qid,
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
  };
}

test("sortNodesByQid returns nodes ordered by qid", () => {
  const nodes = [
    makeNode("root:task-2"),
    makeNode("alpha:task-1"),
    makeNode("root:task-1"),
  ];

  const sorted = sortNodesByQid(nodes);
  assert.deepEqual(
    sorted.map((node: { qid: string }) => node.qid),
    ["alpha:task-1", "root:task-1", "root:task-2"]
  );
});

test("sortIndexNodes returns a record with sorted keys", () => {
  const nodeA = makeNode("root:task-2");
  const nodeB = makeNode("alpha:task-1");
  const nodeC = makeNode("root:task-1");
  const nodes = {
    "root:task-2": nodeA,
    "alpha:task-1": nodeB,
    "root:task-1": nodeC,
  };

  const sorted = sortIndexNodes(nodes);
  assert.deepEqual(Object.keys(sorted), ["alpha:task-1", "root:task-1", "root:task-2"]);
});
