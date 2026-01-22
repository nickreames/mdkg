import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const {
  runWorkspaceAddCommand,
  runWorkspaceRemoveCommand,
} = require("../../commands/workspace");
import { makeTempDir, writeFile } from "../helpers/fs";

function writeConfig(root: string): void {
  const config = {
    schema_version: 1,
    tool: "mdkg",
    root_required: true,
    index: {
      auto_reindex: true,
      tolerant: false,
      global_index_path: ".mdkg/index/global.json",
    },
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
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

test("workspace add creates entry and directories", () => {
  const root = makeTempDir("mdkg-workspace-add-");
  writeConfig(root);

  runWorkspaceAddCommand({ root, alias: "polish", workspacePath: "polish" });

  const raw = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8")
  );
  assert.ok(raw.workspaces.polish);
  assert.equal(raw.workspaces.polish.path, "polish");

  assert.ok(fs.existsSync(path.join(root, "polish", ".mdkg", "core")));
  assert.ok(fs.existsSync(path.join(root, "polish", ".mdkg", "design")));
  assert.ok(fs.existsSync(path.join(root, "polish", ".mdkg", "work")));
});

test("workspace rm deletes entry", () => {
  const root = makeTempDir("mdkg-workspace-rm-");
  writeConfig(root);
  runWorkspaceAddCommand({ root, alias: "polish", workspacePath: "polish" });

  runWorkspaceRemoveCommand({ root, alias: "polish" });

  const raw = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8")
  );
  assert.ok(!raw.workspaces.polish);
});
