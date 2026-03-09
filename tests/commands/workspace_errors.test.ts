import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const {
  runWorkspaceAddCommand,
  runWorkspaceListCommand,
  runWorkspaceRemoveCommand,
} = require("../../commands/workspace");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";

test("runWorkspaceAddCommand rejects reserved alias all", () => {
  const root = makeTempDir("mdkg-workspace-all-");
  writeRootConfig(root);
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "all", workspacePath: "docs" }),
    /workspace alias cannot be 'all'/
  );
});

test("runWorkspaceAddCommand rejects duplicate alias", () => {
  const root = makeTempDir("mdkg-workspace-dup-");
  writeRootConfig(root);
  runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" });
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs-2" }),
    /workspace already exists: docs/
  );
});

test("runWorkspaceRemoveCommand rejects root removal", () => {
  const root = makeTempDir("mdkg-workspace-root-rm-");
  writeRootConfig(root);
  assert.throws(
    () => runWorkspaceRemoveCommand({ root, alias: "root" }),
    /cannot remove root workspace/
  );
});

test("workspace commands reject invalid config JSON", () => {
  const root = makeTempDir("mdkg-workspace-bad-json-");
  writeFile(path.join(root, ".mdkg", "config.json"), "{not-json");
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" }),
    /failed to read config/
  );
});

test("workspace commands reject non-object config and list empty workspace sets", () => {
  const root = makeTempDir("mdkg-workspace-non-object-");
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify("bad-config"));
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" }),
    /config must be a JSON object/
  );

  const emptyRoot = makeTempDir("mdkg-workspace-empty-list-");
  writeFile(
    path.join(emptyRoot, ".mdkg", "config.json"),
    JSON.stringify(
      {
        schema_version: 1,
        tool: "mdkg",
        root_required: true,
        index: { auto_reindex: true, tolerant: false, global_index_path: ".mdkg/index/global.json" },
        pack: {
          default_depth: 2,
          default_edges: ["parent", "epic", "relates"],
          verbose_core_list_path: ".mdkg/core/core.md",
          limits: { max_nodes: 25, max_bytes: 2000000 },
        },
        templates: {
          root_path: ".mdkg/templates",
          default_set: "default",
          workspace_overrides_enabled: false,
        },
        work: {
          status_enum: ["backlog", "blocked", "todo", "progress", "review", "done"],
          priority_min: 0,
          priority_max: 9,
          next: {
            strategy: "chain_then_priority",
            status_preference: ["progress", "todo", "review", "blocked", "backlog"],
          },
        },
        workspaces: {},
      },
      null,
      2
    )
  );

  const lines: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    runWorkspaceListCommand({ root: emptyRoot });
  } finally {
    console.log = originalLog;
  }
  assert.deepEqual(lines, ["no workspaces registered"]);
});

test("runWorkspaceAddCommand rejects invalid alias, blank path, and missing config", () => {
  const root = makeTempDir("mdkg-workspace-more-errors-");
  writeRootConfig(root);

  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "docs-team", workspacePath: "docs" }),
    /workspace alias must be lowercase and use \[a-z0-9_\]/
  );
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "   " }),
    /workspace path cannot be empty/
  );

  const missingRoot = makeTempDir("mdkg-workspace-missing-config-");
  assert.throws(
    () => runWorkspaceAddCommand({ root: missingRoot, alias: "docs", workspacePath: "docs" }),
    /config not found/
  );
});

test("workspace commands reject malformed workspaces and missing removals", () => {
  const root = makeTempDir("mdkg-workspace-malformed-");
  writeFile(
    path.join(root, ".mdkg", "config.json"),
    JSON.stringify({ schema_version: 1, tool: "mdkg", workspaces: null }, null, 2)
  );

  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" }),
    /config\.workspaces must be an object/
  );
  assert.throws(
    () => runWorkspaceRemoveCommand({ root, alias: "docs" }),
    /config\.workspaces must be an object/
  );
});

test("runWorkspaceAddCommand supports custom mdkg dir and remove rejects missing alias", () => {
  const root = makeTempDir("mdkg-workspace-custom-dir-");
  writeRootConfig(root);

  runWorkspaceAddCommand({
    root,
    alias: "docs",
    workspacePath: "docs",
    mdkgDir: ".knowledge",
  });

  assert.ok(fs.existsSync(path.join(root, "docs", ".knowledge", "core")));
  assert.ok(fs.existsSync(path.join(root, "docs", ".knowledge", "design")));
  assert.ok(fs.existsSync(path.join(root, "docs", ".knowledge", "work")));

  assert.throws(
    () => runWorkspaceRemoveCommand({ root, alias: "missing" }),
    /workspace not found: missing/
  );
});

test("runWorkspaceListCommand prints registered workspaces in sorted order", () => {
  const root = makeTempDir("mdkg-workspace-list-order-");
  writeRootConfig(root);
  runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" });
  runWorkspaceAddCommand({ root, alias: "api", workspacePath: "api" });

  const lines: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    runWorkspaceListCommand({ root });
  } finally {
    console.log = originalLog;
  }

  assert.deepEqual(lines, [
    "api | enabled | api | .mdkg",
    "docs | enabled | docs | .mdkg",
    "root | enabled | . | .mdkg",
  ]);
});
