import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { buildIndex } = require("../../graph/indexer");
const { loadConfig } = require("../../core/config");
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
      next: { strategy: "chain_then_priority", status_preference: ["progress", "todo", "review", "blocked", "backlog", "done"] },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeTask(root: string, id: string, relates: string[] = []): void {
  const content = [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${id}`,
    "status: todo",
    "tags: []",
    "links: []",
    "artifacts: []",
    `relates: [${relates.join(", ")}]`,
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

test("buildIndex creates qids and reverse edges", () => {
  const root = makeTempDir("mdkg-index-");
  writeConfig(root);
  writeTask(root, "task-1", ["task-2"]);
  writeTask(root, "task-2");

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  assert.ok(index.nodes["root:task-1"]);
  assert.ok(index.nodes["root:task-2"]);
  assert.deepEqual(index.reverse_edges.relates["root:task-2"], ["root:task-1"]);
});

test("buildIndex tolerates invalid nodes when tolerant", () => {
  const root = makeTempDir("mdkg-index-");
  writeConfig(root);
  writeTask(root, "task-1");
  writeFile(path.join(root, ".mdkg", "work", "bad.md"), "no frontmatter");

  const config = loadConfig(root);
  const index = buildIndex(root, config, { tolerant: true });
  assert.ok(index.nodes["root:task-1"]);
});
