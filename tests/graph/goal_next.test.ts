import { test } from "node:test";
import assert from "node:assert/strict";
const { selectGoalNextCandidate } = require("../../graph/goal_next");

type TestNode = Record<string, any>;
type TestIndex = Record<string, any>;

function makeNode(
  id: string,
  options: {
    type?: string;
    status?: string;
    priority?: number;
    prev?: string;
    next?: string;
    blockedBy?: string[];
    importedFrom?: string;
  } = {}
): TestNode {
  const ws = options.importedFrom ?? "root";
  const qid = `${ws}:${id}`;
  return {
    id,
    qid,
    ws,
    type: options.type ?? "task",
    title: id,
    status: options.status ?? "todo",
    priority: options.priority ?? 1,
    created: "2026-01-01",
    updated: "2026-01-01",
    tags: [],
    owners: [],
    links: [],
    artifacts: [],
    refs: [],
    aliases: [],
    skills: [],
    attributes: {},
    path: `.mdkg/work/${id}.md`,
    edges: {
      prev: options.prev,
      next: options.next,
      relates: [],
      blocked_by: options.blockedBy ?? [],
      blocks: [],
      context_refs: [],
      evidence_refs: [],
    },
    ...(options.importedFrom
      ? {
          source: {
            imported: true,
            read_only: true,
            subgraph_alias: options.importedFrom,
            original_qid: qid,
            original_ws: options.importedFrom,
            original_path: `.mdkg/work/${id}.md`,
            bundle_path: `.mdkg/bundles/private/subgraphs/${options.importedFrom}.mdkg.zip`,
            stale: false,
            warnings: [],
          },
        }
      : {}),
  };
}

function makeIndex(nodes: TestNode[]): TestIndex {
  return {
    meta: {
      tool: "mdkg",
      schema_version: 1,
      generated_at: "2026-01-01T00:00:00.000Z",
      root: ".",
      workspaces: ["root"],
    },
    workspaces: {
      root: { path: ".", enabled: true },
    },
    nodes: Object.fromEntries(nodes.map((node) => [node.qid, node])),
    reverse_edges: {},
  };
}

function select(index: TestIndex, goal: TestNode, actionableQids: string[]) {
  return selectGoalNextCandidate({
    index,
    goal,
    actionableQids: new Set(actionableQids),
    strategy: "chain_then_priority",
    statusPreference: ["progress", "todo", "review", "blocked", "backlog"],
    priorityMax: 9,
  });
}

test("goal next selector fails closed on a missing blocker", () => {
  const goal = makeNode("goal-1", { type: "goal", status: "progress" });
  const blocked = makeNode("task-1", {
    priority: 0,
    blockedBy: ["root:task-99"],
  });
  const fallback = makeNode("task-2", { priority: 9 });
  const result = select(makeIndex([goal, blocked, fallback]), goal, [
    blocked.qid,
    fallback.qid,
  ]);
  assert.equal(result.node?.qid, fallback.qid);
  assert.ok(result.warnings.some((warning: string) =>
    warning.includes("root:task-1 is blocked by missing node root:task-99")
  ));
});

test("goal next selector skips and warns on a read-only imported blocker", () => {
  const goal = makeNode("goal-1", { type: "goal", status: "progress" });
  const imported = makeNode("task-1", {
    status: "todo",
    importedFrom: "child_demo",
  });
  const blocked = makeNode("task-1", {
    priority: 0,
    blockedBy: [imported.qid],
  });
  const fallback = makeNode("task-2", { priority: 9 });
  const result = select(makeIndex([goal, imported, blocked, fallback]), goal, [
    blocked.qid,
    fallback.qid,
  ]);
  assert.equal(result.node?.qid, fallback.qid);
  assert.ok(result.warnings.some((warning: string) =>
    warning.includes("root:task-1 is blocked by read-only subgraph node child_demo:task-1")
  ));
});

test("goal next selector falls back to priority for an ambiguous chain", () => {
  const goal = makeNode("goal-1", { type: "goal", status: "progress" });
  const downstream = makeNode("task-1", { priority: 0 });
  const first = makeNode("task-2", { priority: 5, next: downstream.qid });
  const second = makeNode("task-3", { priority: 6, next: downstream.qid });
  const result = select(makeIndex([goal, downstream, first, second]), goal, [
    downstream.qid,
    first.qid,
    second.qid,
  ]);
  assert.equal(result.node?.qid, downstream.qid);
  assert.deepEqual(result.warnings, []);
});
