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
