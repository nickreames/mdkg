import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runNewCommand } = require("../../commands/new");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

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

function writeExistingTask(root: string): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: Seed task",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-01",
    "updated: 2026-01-01",
    "---",
    "",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
}

test("runNewCommand creates next id and writes to work folder", () => {
  const root = makeTempDir("mdkg-new-task-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeExistingTask(root);

  runNewCommand({
    root,
    type: "task",
    title: "Ship CLI",
    status: "todo",
    now: new Date(2026, 0, 21),
  });

  const filePath = path.join(root, ".mdkg", "work", "task-2-ship-cli.md");
  assert.ok(fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("id: task-2"));
  assert.ok(content.includes("status: todo"));
  assert.ok(content.includes("priority: 9"));
  assert.ok(content.includes("created: 2026-01-21"));
  assert.ok(content.includes("updated: 2026-01-21"));
});

test("runNewCommand creates a test node with cases list", () => {
  const root = makeTempDir("mdkg-new-test-");
  writeConfig(root);
  writeDefaultTemplates(root);

  runNewCommand({
    root,
    type: "test",
    title: "CLI help smoke",
    status: "todo",
    cases: "tc-1,tc-2",
    now: new Date(2026, 0, 22),
  });

  const filePath = path.join(root, ".mdkg", "work", "test-1-cli-help-smoke.md");
  assert.ok(fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("type: test"));
  assert.ok(content.includes("cases: [tc-1, tc-2]"));
});
