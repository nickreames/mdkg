import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { runShowCommand } = require("../../commands/show");
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

function writeTask(root: string): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: Show default body",
    "status: todo",
    "priority: 1",
    "tags: [cli]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
    "# Overview",
    "",
    "Full body content should be shown by default.",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
}

function captureOutput(fn: () => void): string {
  const lines: string[] = [];
  const originalLog = console.log;
  console.log = ((...args: unknown[]) => {
    lines.push(args.map((value) => String(value)).join(" "));
  }) as typeof console.log;
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return lines.join("\n");
}

test("runShowCommand includes node body by default", () => {
  const root = makeTempDir("mdkg-show-node-default-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const output = captureOutput(() =>
    runShowCommand({
      root,
      id: "task-1",
    })
  );
  assert.match(output, /root:task-1 \| task \| todo\/p1/);
  assert.match(output, /# Overview/);
  assert.match(output, /Full body content should be shown by default/);
});

test("runShowCommand supports metaOnly for nodes", () => {
  const root = makeTempDir("mdkg-show-node-meta-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const output = captureOutput(() =>
    runShowCommand({
      root,
      id: "task-1",
      metaOnly: true,
    })
  );
  assert.match(output, /root:task-1 \| task \| todo\/p1/);
  assert.doesNotMatch(output, /# Overview/);
});
