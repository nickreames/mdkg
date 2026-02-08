import { test } from "node:test";
import assert from "node:assert/strict";
const { applyPackBudgets } = require("../../pack/budget");

function buildPack(bodyA: string, bodyB?: string) {
  const nodes = [
    {
      qid: "root:task-1",
      id: "task-1",
      workspace: "root",
      type: "task",
      title: "Task 1",
      status: "todo",
      priority: 1,
      path: ".mdkg/work/task-1.md",
      links: [],
      artifacts: [],
      refs: [],
      aliases: [],
      body: bodyA,
    },
  ];
  if (bodyB !== undefined) {
    nodes.push({
      qid: "root:rule-1",
      id: "rule-1",
      workspace: "root",
      type: "rule",
      title: "Rule 1",
      status: "todo",
      priority: 1,
      path: ".mdkg/core/rule-1.md",
      links: [],
      artifacts: [],
      refs: [],
      aliases: [],
      body: bodyB,
    });
  }

  return {
    meta: {
      root: "root:task-1",
      depth: 1,
      verbose: false,
      profile: "concise",
      body_mode: "summary",
      generated_at: "2026-01-13T00:00:00.000Z",
      node_count: nodes.length,
      truncated: { max_nodes: false, max_bytes: false, dropped: [] },
    },
    nodes,
  };
}

test("applyPackBudgets drops tail nodes before truncating root body", () => {
  const pack = buildPack("root body", "x".repeat(400));
  const { pack: shaped, report } = applyPackBudgets(
    pack,
    {
      maxChars: 120,
    },
    "concise"
  );
  assert.equal(shaped.nodes.length, 1);
  assert.deepEqual(shaped.meta.truncated.dropped, ["root:rule-1"]);
  assert.equal(shaped.meta.truncated.max_chars, true);
  assert.deepEqual(report.dropped_nodes, ["root:rule-1"]);
});

test("applyPackBudgets truncates root body when a single node still exceeds limits", () => {
  const pack = buildPack("line-1\nline-2\nline-3\nline-4\nline-5\nline-6\nline-7\nline-8");
  const { pack: shaped, report } = applyPackBudgets(
    pack,
    {
      maxLines: 8,
    },
    "concise"
  );
  assert.equal(shaped.nodes.length, 1);
  assert.equal(shaped.meta.truncated.max_lines, true);
  assert.ok((shaped.meta.truncated.body_truncated ?? []).includes("root:task-1"));
  assert.ok(report.body_truncated_nodes.includes("root:task-1"));
});
