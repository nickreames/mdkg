import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
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

function captureConsole(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = ((...args: unknown[]) => stdout.push(args.map(String).join(" "))) as typeof console.log;
  console.error = ((...args: unknown[]) => stderr.push(args.map(String).join(" "))) as typeof console.error;
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

function captureOutput(fn: () => void): string {
  return captureConsole(fn).stdout;
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

test("runShowCommand warns when cached index is stale and reindex is disabled", () => {
  const root = makeTempDir("mdkg-show-stale-warning-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  captureOutput(() => runShowCommand({ root, id: "task-1", metaOnly: true }));
  const taskPath = path.join(root, ".mdkg", "work", "task-1.md");
  const future = new Date(Date.now() + 10_000);
  fs.utimesSync(taskPath, future, future);

  const output = captureConsole(() =>
    runShowCommand({
      root,
      id: "task-1",
      metaOnly: true,
      noReindex: true,
    })
  );
  assert.match(output.stderr, /warning: index is stale; run mdkg index to refresh/);
  assert.match(output.stdout, /root:task-1 \| task \| todo\/p1/);
});

test("runShowCommand renders optional graph metadata lines", () => {
  const root = makeTempDir("mdkg-show-node-edges-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Show edge metadata",
      "status: todo",
      "priority: 1",
      "epic: epic-1",
      "parent: feat-1",
      "prev: task-2",
      "next: task-3",
      "tags: [cli]",
      "owners: [team]",
      "links: [https://example.com/show]",
      "artifacts: [artifact://show]",
      "relates: [task-4]",
      "blocked_by: [task-5]",
      "blocks: [task-6]",
      "refs: [task-4]",
      "aliases: [show-edge]",
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Overview",
      "",
      "Edge body.",
    ].join("\n")
  );
  const relatedNodes: Array<[string, string, string, string[]]> = [
    ["epic-1", "epic", "Edge epic", []],
    ["feat-1", "feat", "Edge feature", []],
    ["task-2", "task", "Previous task", ["next: task-1"]],
    ["task-3", "task", "Next task", ["prev: task-1"]],
    ["task-4", "task", "Related task", []],
    ["task-5", "task", "Blocking task", []],
    ["task-6", "task", "Blocked task", []],
  ];
  for (const [id, type, title, edgeLines] of relatedNodes) {
    writeFile(
      path.join(root, ".mdkg", "work", `${id}.md`),
      [
        "---",
        `id: ${id}`,
        `type: ${type}`,
        `title: ${title}`,
        "status: todo",
        "priority: 1",
        "tags: []",
        "owners: []",
        "links: []",
        "artifacts: []",
        "relates: []",
        "blocked_by: []",
        "blocks: []",
        ...edgeLines,
        "refs: []",
        "aliases: []",
        "skills: []",
        "created: 2026-03-05",
        "updated: 2026-03-05",
        "---",
      ].join("\n")
    );
  }

  const output = captureOutput(() =>
    runShowCommand({
      root,
      id: "task-1",
      metaOnly: true,
    })
  );
  assert.match(output, /tags: cli/);
  assert.match(output, /owners: team/);
  assert.match(output, /links: https:\/\/example\.com\/show/);
  assert.match(output, /artifacts: artifact:\/\/show/);
  assert.match(output, /refs: task-4/);
  assert.match(output, /aliases: show-edge/);
  assert.match(output, /epic: root:epic-1/);
  assert.match(output, /parent: root:feat-1/);
  assert.match(output, /prev: root:task-2/);
  assert.match(output, /next: root:task-3/);
  assert.match(output, /relates: root:task-4/);
  assert.match(output, /blocked_by: root:task-5/);
  assert.match(output, /blocks: root:task-6/);
});
