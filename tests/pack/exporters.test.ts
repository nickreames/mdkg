import { test } from "node:test";
import assert from "node:assert/strict";
const { exportMarkdown } = require("../../pack/export_md");
const { exportJson } = require("../../pack/export_json");
const { exportToon } = require("../../pack/export_toon");
const { exportXml } = require("../../pack/export_xml");

const basePack = {
  meta: {
    root: "root:task-1",
    depth: 1,
    verbose: false,
    generated_at: "2026-01-13T00:00:00.000Z",
    node_count: 2,
    truncated: { max_nodes: false, max_bytes: false, dropped: [] },
  },
  nodes: [
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
      body: "Body for task-1.",
    },
    {
      qid: "root:rule-1",
      id: "rule-1",
      workspace: "root",
      type: "rule",
      title: "Rule 1",
      path: ".mdkg/core/rule-1.md",
      links: [],
      artifacts: [],
      refs: [],
      aliases: [],
      body: "".padEnd(200, "x"),
    },
  ],
};

test("exportMarkdown enforces max_bytes", () => {
  const { meta, nodes, content } = exportMarkdown(basePack, 200);
  assert.equal(meta.truncated.max_bytes, true);
  assert.equal(nodes.length, 1);
  assert.ok(content.includes("root:task-1"));
});

test("exportJson returns parsable JSON", () => {
  const raw = exportJson(basePack);
  const parsed = JSON.parse(raw);
  assert.equal(parsed.meta.root, "root:task-1");
  assert.equal(parsed.nodes.length, 2);
  assert.equal(parsed.nodes[0].qid, "root:task-1");
});

test("exportToon mirrors JSON output", () => {
  const raw = exportToon(basePack);
  const parsed = JSON.parse(raw);
  assert.equal(parsed.nodes[1].qid, "root:rule-1");
});

test("exportXml renders expected elements", () => {
  const raw = exportXml(basePack);
  assert.ok(raw.includes("<pack>"));
  assert.ok(raw.includes("<qid>root:task-1</qid>"));
  assert.ok(raw.includes("<nodes>"));
});
