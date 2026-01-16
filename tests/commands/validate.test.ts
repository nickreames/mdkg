import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runValidateCommand } = require("../../commands/validate");
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
        status_preference: ["progress", "todo", "review", "blocked", "backlog", "done"],
      },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeTask(root: string): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: missing headings",
    "status: todo",
    "tags: []",
    "owners: []",
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
    "",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
}

test("runValidateCommand writes warnings to --out and respects --quiet", () => {
  const root = makeTempDir("mdkg-validate-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const outPath = "report.txt";
  const originalError = console.error;
  const originalLog = console.log;
  const errorCalls: string[] = [];
  console.error = (...args: unknown[]) => {
    errorCalls.push(args.map(String).join(" "));
  };
  console.log = () => {};

  try {
    runValidateCommand({ root, out: outPath, quiet: true });
  } finally {
    console.error = originalError;
    console.log = originalLog;
  }

  const report = fs.readFileSync(path.join(root, outPath), "utf8");
  assert.ok(report.includes("warning: root:task-1"));
  assert.equal(errorCalls.length, 0);
});
