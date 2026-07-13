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

test("collectGraphErrors uses prototype-safe workspace identity maps", () => {
  const node = makeNode("constructor:task-1", {}, { ws: "constructor" });
  const index = makeIndex({ "constructor:task-1": node });
  index.meta.workspaces = ["constructor"];
  index.workspaces = { constructor: { path: "constructor", enabled: true } };
  assert.doesNotThrow(() => collectGraphErrors(index, { allowMissing: false }));
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

test("collectGraphErrors validates semantic refs while allowing URI evidence", () => {
  const nodes = {
    "root:task-1": makeNode("root:task-1", {
      context_refs: ["root:task-2"],
      evidence_refs: ["proof://example/evidence"],
    }),
    "root:task-2": makeNode("root:task-2", {}),
  };
  assert.deepEqual(collectGraphErrors(makeIndex(nodes), { allowMissing: false }), []);

  const missingNodes = {
    "root:task-1": makeNode("root:task-1", {
      context_refs: ["root:task-404"],
      evidence_refs: ["proof://example/evidence"],
    }),
  };
  const errors = collectGraphErrors(makeIndex(missingNodes), { allowMissing: false });
  assert.ok(errors.some((error: string) => /context_refs references missing node root:task-404/.test(error)));
});

test("collectGraphErrors validates typed loop readiness and paired waiver evidence", () => {
  const validNodes = {
    "root:loop-1": makeNode("root:loop-1", {}, {
      type: "loop",
      status: "progress",
      attributes: {
        decision_refs: ["dec-1", "dec-2"],
        approval_refs: ["chk-1", "chk-2"],
        question_answer_refs: ["scope_authority=dec-1"],
        action_approval_refs: ["external_checks=chk-1"],
        evidence_lane_refs: ["source_review=chk-1"],
        lane_waiver_decision_refs: ["dependency_review=dec-2"],
        lane_waiver_approval_refs: ["dependency_review=chk-2"],
      },
    }),
    "root:dec-1": makeNode("root:dec-1", {}, { type: "dec", status: "accepted" }),
    "root:dec-2": makeNode("root:dec-2", {}, { type: "dec", status: "accepted" }),
    "root:chk-1": makeNode("root:chk-1", {}, { type: "checkpoint", status: "done" }),
    "root:chk-2": makeNode("root:chk-2", {}, { type: "checkpoint", status: "done" }),
  };
  assert.deepEqual(collectGraphErrors(makeIndex(validNodes), { allowMissing: false }), []);

  const invalidNodes = {
    "root:loop-1": makeNode("root:loop-1", {}, {
      type: "loop",
      status: "progress",
      attributes: {
        decision_refs: ["task-1", "dec-404"],
        approval_refs: ["chk-1"],
        question_answer_refs: ["scope_authority=dec-404"],
        lane_waiver_decision_refs: ["dependency_review=task-1"],
        lane_waiver_approval_refs: [],
      },
    }),
    "root:task-1": makeNode("root:task-1", {}),
    "root:chk-1": makeNode("root:chk-1", {}, { type: "checkpoint", status: "progress" }),
  };
  const errors = collectGraphErrors(makeIndex(invalidNodes), { allowMissing: false });
  assert.ok(errors.some((error: string) => /decision_refs task-1 must target an accepted dec/.test(error)));
  assert.ok(errors.some((error: string) => /decision_refs references missing node dec-404/.test(error)));
  assert.ok(errors.some((error: string) => /approval_refs chk-1 must target an accepted dec, done checkpoint, or verified receipt/.test(error)));
  assert.ok(errors.some((error: string) => /lane waiver dependency_review requires both decision and approval bindings/.test(error)));
});

test("collectGraphErrors rejects multiple active local root goals", () => {
  const nodes = {
    "root:goal-1": makeNode(
      "root:goal-1",
      {},
      {
        type: "goal",
        status: "progress",
        attributes: {
          goal_state: "active",
          goal_condition: "first",
          scope_refs: [],
        },
      }
    ),
    "root:goal-2": makeNode(
      "root:goal-2",
      {},
      {
        type: "goal",
        status: "progress",
        attributes: {
          goal_state: "active",
          goal_condition: "second",
          scope_refs: [],
        },
      }
    ),
  };

  const errors = collectGraphErrors(makeIndex(nodes), { allowMissing: false });
  assert.ok(
    errors.some((error: string) =>
      /multiple active root goals found: root:goal-1, root:goal-2; run mdkg goal activate <goal-id>/.test(error)
    )
  );
});

test("collectGraphErrors ignores imported subgraph goals for local single-active validation", () => {
  const nodes = {
    "root:goal-1": makeNode(
      "root:goal-1",
      {},
      {
        type: "goal",
        status: "progress",
        attributes: {
          goal_state: "active",
          goal_condition: "root",
          scope_refs: [],
        },
      }
    ),
    "child:goal-1": makeNode(
      "child:goal-1",
      {},
      {
        id: "goal-1",
        qid: "child:goal-1",
        ws: "child",
        type: "goal",
        status: "progress",
        attributes: {
          goal_state: "active",
          goal_condition: "child",
          scope_refs: [],
        },
        source: {
          imported: true,
          subgraph_alias: "child",
        },
      }
    ),
  };

  const errors = collectGraphErrors(makeIndex(nodes), { allowMissing: false });
  assert.deepEqual(errors, []);
});
