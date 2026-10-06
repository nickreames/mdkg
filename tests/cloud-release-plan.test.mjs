import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { checkpointReadinessError, dependencyIsComplete } = require("../dist/graph/checkpoint_readiness.js");
const { checkPlanNodes, checkRoot } = require("../scripts/check-cloud-release-plan.js");
const { selectGoalNextCandidate } = require("../dist/graph/goal_next.js");

const gate = (status, tag) => ({ type: "checkpoint", status, tags: [tag] });
const nodes = () => new Map([
  ["chk-674", gate("backlog", "readiness:not-run")], ["chk-677", gate("backlog", "readiness:not-run")],
  ["chk-680", gate("backlog", "readiness:not-run")], ["task-848", { blocked_by: ["chk-674"] }], ["task-852", { blocked_by: ["chk-677"] }],
]);

test("actual three-release plan keeps verdict markers and next-release blockers", () => {
  assert.deepEqual(checkRoot(fileURLToPath(new URL("..", import.meta.url))), { ok: true, errors: [] });
});
test("actual node parser rejects done/NOT_READY and preserves legacy ordinary checkpoints", () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const config = require("../dist/core/config.js").loadConfig(root);
  const schemas = require("../dist/graph/template_schema.js").loadTemplateSchemas(root, config);
  const { parseNode } = require("../dist/graph/node.js");
  const p = path.join(root, ".mdkg/work", fs.readdirSync(path.join(root, ".mdkg/work")).find(f => f.startsWith("chk-677-")));
  const source = fs.readFileSync(p, "utf8");
  const options = { workStatusEnum: config.work.status_enum, priorityMin: config.work.priority_min, priorityMax: config.work.priority_max, templateSchemas: schemas };
  const notReady = source.replace("status: backlog", "status: blocked").replace("readiness:not-run", "readiness:not-ready");
  assert.equal(parseNode(notReady, p, options).status, "blocked");
  assert.throws(() => parseNode(notReady.replace("status: blocked", "status: done"), p, options), /NOT_READY checkpoint must stay blocked or review/);
  assert.throws(() => parseNode(source.replace("status: backlog", "status: done"), p, options), /only READY_PENDING_APPROVAL/);
  const ready = source.replace("status: backlog", "status: done").replace("readiness:not-run", "readiness:ready-pending-approval");
  assert.equal(parseNode(ready, p, options).status, "done");
  assert.equal(parseNode(ready.replace(", readiness:ready-pending-approval", ""), p, options).status, "done");
});
for (const id of ["chk-674", "chk-677", "chk-680"]) {
  test(`${id}: recording NOT_READY cannot complete the dependency`, () => {
    const plan = nodes();plan.set(id, gate("done", "readiness:not-ready"));
    assert.equal(checkPlanNodes(plan).ok, false);
    assert.equal(dependencyIsComplete(plan.get(id)), false);
    plan.set(id, gate("blocked", "readiness:not-ready"));
    assert.equal(checkPlanNodes(plan).ok, true);
    assert.equal(dependencyIsComplete(plan.get(id)), false);
  });
}
test("NOT_RUN, missing/unknown/duplicate verdicts and removed downstream blockers refuse", () => {
  const plan = nodes();plan.get("chk-674").status = "done";assert.equal(checkPlanNodes(plan).ok, false);
  for (const tags of [[], ["readiness:unknown"], ["readiness:not-ready", "readiness:ready-pending-approval"]]) {
    plan.set("chk-674", { type: "checkpoint", status: "done", tags });assert.equal(checkPlanNodes(plan).ok, false);
  }
  plan.set("chk-674", gate("backlog", "readiness:not-run"));plan.get("task-848").blocked_by = [];assert.equal(checkPlanNodes(plan).ok, false);
});
test("a reviewed READY_PENDING_APPROVAL assessment can complete dependency, never publication authority", () => {
  assert.equal(dependencyIsComplete(gate("review", "readiness:ready-pending-approval")), false);
  assert.equal(dependencyIsComplete(gate("done", "readiness:ready-pending-approval")), true);
  assert.equal(dependencyIsComplete({ type: "checkpoint", status: "done", tags: [] }), true);
  assert.equal(checkpointReadinessError({ type: "task", status: "done", tags: ["readiness:not-ready"] }), undefined);
});
test("goal next preserves blockers even if a cached checkpoint falsely claims done/NOT_READY", () => {
  const shape = (id, fields) => ({ id, qid: `root:${id}`, ws: "root", title: id, tags: [], attributes: {}, priority: 1,
    edges: { blocked_by: [], relates: [], blocks: [], context_refs: [], evidence_refs: [] }, ...fields });
  const g = shape("goal-89", { type: "goal", status: "progress" });
  const c = shape("chk-674", gate("done", "readiness:not-ready"));
  const t = shape("task-848", { type: "task", status: "backlog" });t.edges.blocked_by = [c.qid];
  const index = { nodes: { [g.qid]: g, [c.qid]: c, [t.qid]: t } };
  const options = { index, goal: g, actionableQids: new Set([t.qid]), strategy: "chain_then_priority", statusPreference: ["backlog"], priorityMax: 9 };
  assert.equal(selectGoalNextCandidate(options).node, undefined);
  c.tags = ["readiness:ready-pending-approval"];assert.equal(selectGoalNextCandidate(options).node.qid, t.qid);
});
