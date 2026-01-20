import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { isIndexStale } = require("../../graph/staleness");
const { loadConfig } = require("../../core/config");
import { makeTempDir, touch, writeFile } from "../helpers/fs";

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
      next: { strategy: "chain_then_priority", status_preference: ["progress", "todo", "review", "blocked", "backlog"] },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeTask(root: string, id: string): void {
  const content = [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${id}`,
    "status: todo",
    "tags: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", `${id}.md`), content);
}

test("isIndexStale detects newer docs", () => {
  const root = makeTempDir("mdkg-stale-");
  writeConfig(root);
  writeTask(root, "task-1");

  const config = loadConfig(root);
  const indexPath = path.join(root, ".mdkg", "index", "global.json");
  writeFile(indexPath, "{}");

  const oldTime = Date.now() - 10000;
  touch(indexPath, oldTime);
  const newTime = Date.now();
  touch(path.join(root, ".mdkg", "work", "task-1.md"), newTime);

  assert.equal(isIndexStale(root, config), true);
});
