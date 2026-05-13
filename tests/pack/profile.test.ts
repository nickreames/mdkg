import { test } from "node:test";
import assert from "node:assert/strict";
const { listPackProfiles, resolvePackProfile, shapePackBodies } = require("../../pack/profile");

const basePack = {
  meta: {
    root: "root:task-1",
    depth: 1,
    verbose: false,
    generated_at: "2026-01-13T00:00:00.000Z",
    node_count: 1,
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
      body: [
        "# Overview",
        "Primary summary line.",
        "",
        "```ts",
        "const hidden = true;",
        "```",
        "",
        "# Acceptance Criteria",
        "- a",
        "",
        "# Notes",
        "Tail details.",
      ].join("\n"),
    },
  ],
};

test("resolvePackProfile supports concise shorthand", () => {
  const resolved = resolvePackProfile({ concise: true });
  assert.equal(resolved.profile, "concise");
  assert.equal(resolved.bodyMode, "summary");
  assert.equal(resolved.stripCode, true);
});

test("listPackProfiles exposes built-in profiles", () => {
  const profiles = listPackProfiles();
  assert.deepEqual(
    profiles.map((entry: { profile: string }) => entry.profile),
    ["standard", "concise", "headers"]
  );
});

test("resolvePackProfile rejects conflicting concise flags", () => {
  assert.throws(
    () => resolvePackProfile({ concise: true, profile: "headers" }),
    /conflicts with --pack-profile/
  );
});

test("resolvePackProfile normalizes defaults and rejects invalid inputs", () => {
  const standard = resolvePackProfile({});
  assert.equal(standard.profile, "standard");
  assert.equal(standard.bodyMode, "full");
  assert.equal(standard.stripCode, false);

  const headers = resolvePackProfile({ profile: "HEADERS", stripCode: true, maxCodeLines: 0 });
  assert.equal(headers.profile, "headers");
  assert.equal(headers.bodyMode, "none");
  assert.equal(headers.stripCode, true);
  assert.equal(headers.maxCodeLines, 0);

  assert.throws(() => resolvePackProfile({ profile: "unknown" }), /--pack-profile must be one of/);
  assert.throws(() => resolvePackProfile({ maxCodeLines: -1 }), /--max-code-lines must be a non-negative integer/);
  assert.throws(() => resolvePackProfile({ maxCodeLines: 1.5 }), /--max-code-lines must be a non-negative integer/);
});

test("shapePackBodies concise summary follows template heading order", () => {
  const resolved = resolvePackProfile({ profile: "concise" });
  const shaped = shapePackBodies(basePack, {
    resolved,
    templateHeadingMap: {
      task: ["overview", "acceptance criteria", "notes"],
    },
  });
  const body = shaped.nodes[0].body;
  assert.ok(body.includes("# Overview"));
  assert.ok(body.includes("Primary summary line."));
  assert.ok(!body.includes("# Notes"));
  assert.ok(!body.includes("const hidden = true;"));
});

test("shapePackBodies summary falls back and preserves empty bodies", () => {
  const resolved = {
    ...resolvePackProfile({ profile: "concise" }),
    stripCode: false,
    summaryMaxLines: 2,
  };
  const shaped = shapePackBodies(
    {
      meta: {
        root: "root:note-1",
        depth: 1,
        verbose: false,
        generated_at: "2026-01-13T00:00:00.000Z",
        node_count: 2,
        truncated: { max_nodes: false, max_bytes: false, dropped: [] },
      },
      nodes: [
        {
          qid: "root:note-1",
          id: "note-1",
          workspace: "root",
          type: "note",
          title: "Note",
          path: ".mdkg/work/note-1.md",
          links: [],
          artifacts: [],
          refs: [],
          aliases: [],
          body: ["", "fallback one", "", "fallback two", "fallback three"].join("\n"),
        },
        {
          qid: "root:note-2",
          id: "note-2",
          workspace: "root",
          type: "note",
          title: "Empty note",
          path: ".mdkg/work/note-2.md",
          links: [],
          artifacts: [],
          refs: [],
          aliases: [],
          body: "   ",
        },
      ],
    },
    {
      resolved,
      templateHeadingMap: {},
    }
  );

  assert.equal(shaped.nodes[0].body, "fallback one\nfallback two");
  assert.equal(shaped.nodes[1].body, "");
  assert.equal(shaped.meta.node_count, 2);
  assert.equal(shaped.meta.profile, "concise");
  assert.equal(shaped.meta.body_mode, "summary");
});

test("shapePackBodies caps code blocks across closed and open fences", () => {
  const resolved = {
    ...resolvePackProfile({}),
    maxCodeLines: 2,
    summaryMaxLines: 12,
  };
  const shaped = shapePackBodies(
    {
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
          title: "Closed fence",
          path: ".mdkg/work/task-1.md",
          links: [],
          artifacts: [],
          refs: [],
          aliases: [],
          body: ["```ts", "line 1", "line 2", "line 3", "```"].join("\n"),
        },
        {
          qid: "root:task-2",
          id: "task-2",
          workspace: "root",
          type: "task",
          title: "Open fence",
          path: ".mdkg/work/task-2.md",
          links: [],
          artifacts: [],
          refs: [],
          aliases: [],
          body: ["~~~", "open 1", "open 2", "open 3"].join("\n"),
        },
      ],
    },
    {
      resolved,
      templateHeadingMap: {},
    }
  );

  assert.match(shaped.nodes[0].body, /line 1\nline 2\n\[code lines truncated\]\n```/);
  assert.doesNotMatch(shaped.nodes[0].body, /line 3/);
  assert.match(shaped.nodes[1].body, /open 1\nopen 2\n\[code lines truncated\]$/);
  assert.doesNotMatch(shaped.nodes[1].body, /open 3/);
});

test("shapePackBodies headers profile removes body content", () => {
  const resolved = resolvePackProfile({ profile: "headers" });
  const shaped = shapePackBodies(basePack, {
    resolved,
    templateHeadingMap: {
      task: ["overview"],
    },
  });
  assert.equal(shaped.nodes[0].body, "");
});
