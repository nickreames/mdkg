import { test } from "node:test";
import assert from "node:assert/strict";
const { collectGraphErrors } = require("../../graph/validate_graph");

function makeNode(qid: string, edges: Partial<any>, overrides: Partial<any> = {}): any {
  return {
    id: qid.split(":")[1],
    qid,
    ws: "root",
    type: "task",
    title: qid,
    created: "2026-01-06",
    updated: "2026-01-06",
    tags: [],
    owners: [],
    links: [],
    artifacts: [],
    refs: [],
    aliases: [],
    skills: [],
    status: "todo",
    priority: 1,
    attributes: {},
    ...overrides,
    path: `${qid}.md`,
    edges: {
      epic: undefined,
      parent: undefined,
      prev: undefined,
      next: undefined,
      relates: [],
      blocked_by: [],
      blocks: [],
      ...edges,
    },
  };
}

function makeIndex(nodes: Record<string, any>): any {
  return {
    meta: {
      tool: "mdkg",
      schema_version: 1,
      generated_at: new Date().toISOString(),
      root: ".",
      workspaces: ["root"],
    },
    workspaces: { root: { path: ".", enabled: true } },
    nodes,
    reverse_edges: {},
  };
}

test("collectGraphErrors reports prev/next mismatch", () => {
  const nodes = {
    "root:task-1": makeNode("root:task-1", { next: "root:task-2" }),
    "root:task-2": makeNode("root:task-2", {}),
  };
  const errors = collectGraphErrors(makeIndex(nodes), { allowMissing: false });
  assert.ok(errors.some((error: string) => /missing matching prev/.test(error)));
});

test("collectGraphErrors reports prev/next cycles", () => {
  const nodes = {
    "root:task-1": makeNode("root:task-1", {
      next: "root:task-2",
      prev: "root:task-2",
    }),
    "root:task-2": makeNode("root:task-2", {
      next: "root:task-1",
      prev: "root:task-1",
    }),
  };
  const errors = collectGraphErrors(makeIndex(nodes), { allowMissing: false });
  assert.ok(errors.some((error: string) => /cycle detected/.test(error)));
});

test("collectGraphErrors validates goal scope_refs and active_node", () => {
  const nodes = {
    "root:goal-1": makeNode(
      "root:goal-1",
      {},
      {
        type: "goal",
        status: "progress",
        attributes: {
          goal_state: "active",
          goal_condition: "finish scoped work",
          scope_refs: ["epic-1"],
          active_node: "task-2",
        },
      }
    ),
    "root:epic-1": makeNode("root:epic-1", {}, { type: "epic", status: "todo" }),
    "root:task-1": makeNode("root:task-1", { epic: "root:epic-1" }),
    "root:task-2": makeNode("root:task-2", {}),
  };
  const errors = collectGraphErrors(makeIndex(nodes), { allowMissing: false });
  assert.ok(errors.some((error: string) => /active_node root:task-2 is not inside goal scope_refs/.test(error)));

  const missingNodes = {
    "root:goal-2": makeNode(
      "root:goal-2",
      {},
      {
        type: "goal",
        status: "progress",
        attributes: {
          goal_state: "active",
          goal_condition: "finish scoped work",
          scope_refs: ["epic-99"],
        },
      }
    ),
  };
  const missingErrors = collectGraphErrors(makeIndex(missingNodes), { allowMissing: false });
  assert.ok(missingErrors.some((error: string) => /scope_refs references missing node epic-99/.test(error)));
});
