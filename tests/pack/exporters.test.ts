import { test } from "node:test";
import assert from "node:assert/strict";
const { exportMarkdown } = require("../../pack/export_md");
const { exportJson } = require("../../pack/export_json");
const { exportToon } = require("../../pack/export_toon");
const { exportXml } = require("../../pack/export_xml");
const { measureNode, renderNodeMetricsText } = require("../../pack/metrics");
const { applyPackBudgets } = require("../../pack/budget");
const { shapePackBodies, resolvePackProfile } = require("../../pack/profile");

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

const identity = { graph_id: "e7403372-f270-4cd7-902d-64b792c781df", node_id: "cfc77dba-931e-4c4d-b6e5-5c6c4c071102" };
const stableRef = `mdkg://${identity.graph_id}/${identity.node_id}`;
const identityNode = { ...basePack.nodes[0], identity, stable_ref: stableRef, qid: stableRef,
  alias_qid: "root:task-1", source: { imported: true, private_provenance: "not-for-export" } };
const identityPack = { ...basePack, nodes: [identityNode, basePack.nodes[1]] };
const exportsByFormat = {
  json: exportJson, toon: exportToon, xml: exportXml,
  md: (pack: unknown) => exportMarkdown(pack).content,
};

for (const profile of ["standard", "concise", "headers"]) {
  for (const [format, render] of Object.entries(exportsByFormat)) {
    test(`${format} ${profile} preserves exact identity and ambiguous alias without source disclosure`, () => {
      const pack = shapePackBodies(identityPack, { resolved: resolvePackProfile({ profile }), templateHeadingMap: {} });
      const before = JSON.stringify(pack);
      const output = render(pack);
      assert.ok(output.includes(stableRef));
      assert.ok(output.includes(identity.node_id));
      assert.ok(output.includes("root:task-1"), "human alias remains available");
      assert.ok(!output.includes("not-for-export"), "internal source descriptors remain omitted");
      if (format === "json" || format === "toon") {
        const node = JSON.parse(output).nodes[0];
        assert.deepEqual(node.identity, identity);
        assert.equal(node.stable_ref, stableRef);
        assert.equal(node.alias_qid, "root:task-1");
        assert.equal(node.qid, stableRef);
      } else if (format === "xml") {
        assert.ok(output.includes(`<identity>\n        <graph_id>${identity.graph_id}</graph_id>\n        <node_id>${identity.node_id}</node_id>\n      </identity>`));
        assert.ok(output.includes(`<stable_ref>${stableRef}</stable_ref>`));
        assert.ok(output.includes("<alias_qid>root:task-1</alias_qid>"));
      } else {
        assert.ok(output.includes(`graph_id: ${identity.graph_id}\nnode_id: ${identity.node_id}`));
        assert.ok(output.includes(`stable_ref: ${stableRef}`));
        assert.ok(output.includes("alias_qid: root:task-1"));
      }
      assert.equal(JSON.stringify(pack), before, "export does not mutate identities or source nodes");
    });
  }
}

test("legacy and skill-like nodes do not acquire synthetic identity metadata", () => {
  for (const [format, render] of Object.entries(exportsByFormat)) {
    const output = render(basePack);
    for (const field of ["graph_id", "node_id", "stable_ref", "alias_qid"]) assert.ok(!output.includes(field), `${format}: ${field}`);
  }
});

test("identity strings and alias metadata are escaped in XML", () => {
  const pack = { ...identityPack, nodes: [{ ...identityNode, identity: { graph_id: "g<&", node_id: "n>\"" },
    stable_ref: "ref<&\"", alias_qid: "alias<&\"" }] };
  const output = exportXml(pack);
  assert.ok(output.includes("<graph_id>g&lt;&amp;</graph_id>"));
  assert.ok(output.includes("<node_id>n&gt;&quot;</node_id>"));
  assert.ok(output.includes("<stable_ref>ref&lt;&amp;&quot;</stable_ref>"));
  assert.ok(output.includes("<alias_qid>alias&lt;&amp;&quot;</alias_qid>"));
});

test("identity metadata participates in estimates and survives root-only truncation", () => {
  const plain = { ...identityNode, identity: undefined, stable_ref: undefined, alias_qid: undefined };
  const extra = [`graph_id: ${identity.graph_id}`, `node_id: ${identity.node_id}`,
    `stable_ref: ${stableRef}`, "alias_qid: root:task-1"].join("\n");
  assert.equal(measureNode(identityNode).chars - measureNode(plain).chars, extra.length + 1);
  assert.equal(measureNode(identityNode).lines - measureNode(plain).lines, 4);
  assert.ok(renderNodeMetricsText(identityNode).includes(extra));
  const limited = applyPackBudgets(identityPack, { maxTokens: 1 }, "standard");
  assert.equal(limited.pack.nodes.length, 1);
  assert.deepEqual(limited.pack.nodes[0].identity, identity);
  assert.equal(limited.pack.nodes[0].stable_ref, stableRef);
  assert.equal(limited.pack.meta.truncated.max_tokens, true);
  assert.ok(limited.report.after.tokens_estimate > 1, "report unavoidable root metadata overflow rather than stripping identity");
  const markdown = exportMarkdown(identityPack, 1);
  assert.equal(markdown.nodes.length, 1);
  assert.ok(markdown.content.includes(stableRef));
  assert.ok(markdown.meta.truncated.max_bytes);
});
