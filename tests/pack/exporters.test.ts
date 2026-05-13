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
  const { meta, nodes, content } = exportMarkdown(basePack, 260);
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

test("exportXml renders optional metadata, attributes, lists, and escapes values", () => {
  const raw = exportXml({
    meta: {
      root: "root:task-&",
      depth: 2,
      verbose: true,
      profile: "concise",
      body_mode: "summary",
      latest_checkpoint_qid: "root:chk-1",
      latest_checkpoint_qid_hint: "root:chk-0",
      generated_at: "2026-01-13T00:00:00.000Z",
      node_count: 1,
      truncated: {
        max_nodes: true,
        max_bytes: true,
        max_chars: true,
        max_lines: true,
        max_tokens: true,
        dropped: ["root:task-2&"],
      },
    },
    nodes: [
      {
        qid: "root:task-&",
        id: "task-&",
        workspace: "root",
        type: "task",
        title: "Task <One> & \"quoted\"",
        status: "review",
        priority: 0,
        path: ".mdkg/work/task-&.md",
        links: ["https://example.com/?a=1&b=2"],
        artifacts: ["artifact://pack/<one>"],
        refs: ["rule-1"],
        aliases: ["pack-alias"],
        attributes: {
          phase: "alpha & beta",
          labels: ["first", "second <tag>"],
        },
        body: "Body with <xml> & apostrophe's value.",
      },
    ],
  });

  assert.ok(raw.includes("<root>root:task-&amp;</root>"));
  assert.ok(raw.includes("<profile>concise</profile>"));
  assert.ok(raw.includes("<body_mode>summary</body_mode>"));
  assert.ok(raw.includes("<latest_checkpoint_qid>root:chk-1</latest_checkpoint_qid>"));
  assert.ok(raw.includes("<latest_checkpoint_qid_hint>root:chk-0</latest_checkpoint_qid_hint>"));
  assert.ok(raw.includes("<max_chars>true</max_chars>"));
  assert.ok(raw.includes("<max_lines>true</max_lines>"));
  assert.ok(raw.includes("<max_tokens>true</max_tokens>"));
  assert.ok(raw.includes("<qid>root:task-2&amp;</qid>"));
  assert.ok(raw.includes("<title>Task &lt;One&gt; &amp; &quot;quoted&quot;</title>"));
  assert.ok(raw.includes("<link>https://example.com/?a=1&amp;b=2</link>"));
  assert.ok(raw.includes("<artifact>artifact://pack/&lt;one&gt;</artifact>"));
  assert.ok(raw.includes("<phase>alpha &amp; beta</phase>"));
  assert.ok(raw.includes("<labels>"));
  assert.ok(raw.includes("<item>second &lt;tag&gt;</item>"));
  assert.ok(raw.includes("<body>Body with &lt;xml&gt; &amp; apostrophe&apos;s value.</body>"));
});
