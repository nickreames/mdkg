import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { runListCommand } = require("../../commands/list");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
const { runValidateCommand } = require("../../commands/validate");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

function setupOldTemplateWorkspace(root: string): void {
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
  writeDefaultTemplates(root);
  for (const name of ["spec", "work", "work_order", "receipt", "feedback", "dispute", "proposal"]) {
    const filePath = path.join(root, ".mdkg", "templates", "default", `${name}.md`);
    try {
      require("fs").rmSync(filePath);
    } catch {
      // already absent
    }
  }
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "work", "task-1-old-template-workspace.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Old template workspace",
      "status: todo",
      "priority: 1",
      "tags: [upgrade]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-05-12",
      "updated: 2026-05-12",
      "---",
      "",
      "# Overview",
      "",
      "Existing work item.",
    ].join("\n")
  );
}

function captureStdout(fn: () => void): string {
  const originalLog = console.log;
  const logs: string[] = [];
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return logs.join("\n");
}

function captureStderr(fn: () => void): string {
  const originalError = console.error;
  const logs: string[] = [];
  console.error = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.error = originalError;
  }
  return logs.join("\n");
}

test("graph inspection and validation use bundled schemas for old-template workspaces", () => {
  const root = makeTempDir("mdkg-old-template-workspace-");
  setupOldTemplateWorkspace(root);

  const show = captureStdout(() => runShowCommand({ root, id: "task-1", metaOnly: true }));
  assert.match(show, /Old template workspace/);

  const list = captureStdout(() => runListCommand({ root, type: "task" }));
  assert.match(list, /Old template workspace/);

  const search = captureStdout(() => runSearchCommand({ root, query: "upgrade" }));
  assert.match(search, /task-1/);

  const validateWarnings = captureStderr(() => runValidateCommand({ root, quiet: false }));
  assert.match(validateWarnings, /bundled template schema fallback/);
});
