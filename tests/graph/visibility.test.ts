import { test } from "node:test";
import assert from "node:assert/strict";
const {
  collectVisibilityViolations,
  effectiveNodeVisibility,
  isVisibleAt,
  visibilityViolationMessages,
} = require("../../graph/visibility");

function baseNode(overrides: Record<string, unknown>) {
  return {
    id: "task-1",
    qid: "root:task-1",
    ws: "root",
    type: "task",
    title: "Task",
    status: "todo",
    priority: 1,
    created: "2026-05-18",
    updated: "2026-05-18",
    tags: [],
    owners: [],
    links: [],
    artifacts: [],
    refs: [],
    aliases: [],
    skills: [],
    attributes: {},
    path: ".mdkg/work/task-1.md",
    edges: {
      epic: undefined,
      parent: undefined,
      prev: undefined,
      next: undefined,
      relates: [],
      blocked_by: [],
      blocks: [],
    },
    ...overrides,
  };
}

function baseConfig() {
  return {
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg", visibility: "public" },
      private_ws: { path: "private", enabled: true, mdkg_dir: ".mdkg", visibility: "private" },
    },
    bundle_imports: {
      child_private: {
        path: ".mdkg/bundles/private/child.mdkg.zip",
        enabled: true,
        visibility: "private",
        expected_profile: "private",
      },
      child_public: {
        path: ".mdkg/bundles/public/child.mdkg.zip",
        enabled: true,
        visibility: "public",
        expected_profile: "public",
      },
    },
  };
}

function baseIndex(nodes: Record<string, unknown>) {
  return {
    meta: {
      tool: "mdkg",
      schema_version: 1,
      generated_at: "2026-05-18T00:00:00.000Z",
      root: ".",
      workspaces: ["root", "private_ws", "child_private", "child_public"],
    },
    workspaces: {
      root: { path: ".", enabled: true },
      private_ws: { path: "private", enabled: true },
      child_private: { path: "bundle:private", enabled: true },
      child_public: { path: "bundle:public", enabled: true },
    },
    nodes,
    reverse_edges: {},
  };
}

test("effectiveNodeVisibility uses workspace, archive sidecar, and import visibility", () => {
  const config = baseConfig();
  const publicNode = baseNode({});
  const privateArchive = baseNode({
    id: "archive.secret",
    qid: "root:archive.secret",
    type: "archive",
    attributes: { visibility: "private" },
  });
  const importedNode = baseNode({
    id: "task-2",
    qid: "child_public:task-2",
    ws: "child_public",
    source: {
      imported: true,
      read_only: true,
      import_alias: "child_public",
      original_qid: "root:task-2",
      original_ws: "root",
      original_path: ".mdkg/work/task-2.md",
      bundle_path: ".mdkg/bundles/public/child.mdkg.zip",
      profile: "public",
      visibility: "public",
      stale: false,
      warnings: [],
    },
  });

  assert.equal(effectiveNodeVisibility(publicNode, config), "public");
  assert.equal(effectiveNodeVisibility(privateArchive, config), "private");
  assert.equal(effectiveNodeVisibility(importedNode, config), "public");
  assert.equal(isVisibleAt("internal", "public"), false);
  assert.equal(isVisibleAt("public", "internal"), true);
});

test("collectVisibilityViolations catches public refs to private archives and imports", () => {
  const config = baseConfig();
  const publicTask = baseNode({
    artifacts: ["archive://archive.secret"],
    refs: ["child_private:task-9"],
    edges: {
      epic: undefined,
      parent: undefined,
      prev: undefined,
      next: undefined,
      relates: ["private_ws:task-2"],
      blocked_by: [],
      blocks: [],
    },
  });
  const privateNode = baseNode({
    id: "task-2",
    qid: "private_ws:task-2",
    ws: "private_ws",
  });
  const privateArchive = baseNode({
    id: "archive.secret",
    qid: "root:archive.secret",
    type: "archive",
    attributes: { visibility: "private" },
  });
  const privateImport = baseNode({
    id: "task-9",
    qid: "child_private:task-9",
    ws: "child_private",
    source: {
      imported: true,
      read_only: true,
      import_alias: "child_private",
      original_qid: "root:task-9",
      original_ws: "root",
      original_path: ".mdkg/work/task-9.md",
      bundle_path: ".mdkg/bundles/private/child.mdkg.zip",
      profile: "private",
      visibility: "private",
      stale: false,
      warnings: [],
    },
  });
  const messages = visibilityViolationMessages(
    collectVisibilityViolations(
      baseIndex({
        "root:task-1": publicTask,
        "private_ws:task-2": privateNode,
        "root:archive.secret": privateArchive,
        "child_private:task-9": privateImport,
      }),
      config
    )
  );

  assert.equal(messages.length, 3);
  assert.ok(messages.some((message: string) => message.includes("archive.secret")));
  assert.ok(messages.some((message: string) => message.includes("child_private:task-9")));
  assert.ok(messages.some((message: string) => message.includes("private_ws:task-2")));
});

test("collectVisibilityViolations permits private refs to public records", () => {
  const config = baseConfig();
  const privateTask = baseNode({
    id: "task-2",
    qid: "private_ws:task-2",
    ws: "private_ws",
    edges: {
      epic: undefined,
      parent: undefined,
      prev: undefined,
      next: undefined,
      relates: ["root:task-1"],
      blocked_by: [],
      blocks: [],
    },
  });
  const messages = visibilityViolationMessages(
    collectVisibilityViolations(
      baseIndex({
        "root:task-1": baseNode({}),
        "private_ws:task-2": privateTask,
      }),
      config
    )
  );

  assert.deepEqual(messages, []);
});
