import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import fs from "fs";
import { execFileSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

const { loadConfig } = require("../../core/config");
const { buildIndex } = require("../../graph/indexer");
const { parseFrontmatter } = require("../../graph/frontmatter");
const { formatDate } = require("../../util/date");
const { runCheckpointNewCommand } = require("../../commands/checkpoint");
const { runSearchCommand } = require("../../commands/search");
const { runListCommand } = require("../../commands/list");

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

function captureStdout(fn: () => void): string[] {
  const lines: string[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = original;
  }
  return lines;
}

test("checkpoint new creates chk-* from template and indexes", () => {
  const root = makeTempDir("mdkg-checkpoint-");
  writeConfig(root);
  writeDefaultTemplates(root);

  const task = (id: string, title: string): string =>
    [
      "---",
      `id: ${id}`,
      "type: task",
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
      "refs: []",
      "aliases: []",
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), task("task-1", "task one"));
  writeFile(path.join(root, ".mdkg", "work", "task-2.md"), task("task-2", "task two"));

  const existing = [
    "---",
    "id: chk-1",
    "type: checkpoint",
    "title: existing",
    "status: done",
    "priority: 9",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "scope: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    "",
    "# Existing",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "chk-1-existing.md"), existing);

  const today = formatDate(new Date());
  captureStdout(() => {
    runCheckpointNewCommand({
      root,
      title: "Second Checkpoint",
      relates: "TASK-1,ROOT:TASK-2",
      scope: "TASK-1,task-3",
    });
  });

  const createdPath = path.join(root, ".mdkg", "work", "chk-2-second-checkpoint.md");
  assert.equal(fs.existsSync(createdPath), true);

  const createdContent = fs.readFileSync(createdPath, "utf8");
  assert.ok(createdContent.includes("scope: [task-1, task-3]"));

  const { frontmatter } = parseFrontmatter(createdContent, createdPath);
  assert.equal(frontmatter.id, "chk-2");
  assert.equal(frontmatter.type, "checkpoint");
  assert.equal(frontmatter.title, "Second Checkpoint");
  assert.equal(frontmatter.status, "backlog");
  assert.equal(frontmatter.priority, "9");
  assert.deepEqual(frontmatter.relates, ["task-1", "root:task-2"]);
  assert.deepEqual(frontmatter.scope, ["task-1", "task-3"]);
  assert.equal(frontmatter.created, today);
  assert.equal(frontmatter.updated, today);
  assert.equal(Object.prototype.hasOwnProperty.call(frontmatter, "epic"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(frontmatter, "parent"), false);

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.ok(index.nodes["root:chk-2"]);

  const searchOut = captureStdout(() => {
    runSearchCommand({ root, query: "second", type: "checkpoint" });
  }).join("\n");
  assert.ok(searchOut.includes("root:chk-2"));

  const listOut = captureStdout(() => {
    runListCommand({ root, type: "checkpoint" });
  }).join("\n");
  assert.ok(listOut.includes("root:chk-2"));
});

test("checkpoint new supports --ws for non-root workspace", () => {
  const root = makeTempDir("mdkg-checkpoint-ws-");

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
      app: { path: "app", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
  writeDefaultTemplates(root);

  const task = (id: string, title: string): string =>
    [
      "---",
      `id: ${id}`,
      "type: task",
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
      "refs: []",
      "aliases: []",
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n");

  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), task("task-1", "root task one"));
  writeFile(path.join(root, "app", ".mdkg", "work", "task-2.md"), task("task-2", "app task two"));

  captureStdout(() => {
    runCheckpointNewCommand({
      root,
      ws: "APP",
      title: "App workspace checkpoint",
      relates: "ROOT:TASK-1,TASK-2",
      scope: "TASK-2",
    });
  });

  const createdPath = path.join(root, "app", ".mdkg", "work", "chk-1-app-workspace-checkpoint.md");
  assert.equal(fs.existsSync(createdPath), true);

  const { frontmatter } = parseFrontmatter(fs.readFileSync(createdPath, "utf8"), createdPath);
  assert.equal(frontmatter.id, "chk-1");
  assert.equal(frontmatter.type, "checkpoint");
  assert.deepEqual(frontmatter.relates, ["root:task-1", "task-2"]);

  const loadedConfig = loadConfig(root);
  const index = buildIndex(root, loadedConfig);
  assert.ok(index.nodes["app:chk-1"]);
});

test("cli checkpoint new works end-to-end with --root and --ws", () => {
  const root = makeTempDir("mdkg-checkpoint-cli-");

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
      app: { path: "app", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
  writeDefaultTemplates(root);

  const task = (id: string, title: string): string =>
    [
      "---",
      `id: ${id}`,
      "type: task",
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
      "refs: []",
      "aliases: []",
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n");

  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), task("task-1", "root task one"));
  writeFile(path.join(root, "app", ".mdkg", "work", "task-2.md"), task("task-2", "app task two"));

  const cliPath = path.resolve(__dirname, "../../cli.js");
  const stdout = execFileSync(
    process.execPath,
    [
      cliPath,
      "--root",
      root,
      "checkpoint",
      "new",
      "CLI ws checkpoint",
      "--ws",
      "APP",
      "--relates",
      "ROOT:TASK-1,TASK-2",
      "--scope",
      "TASK-2",
    ],
    { encoding: "utf8" }
  );

  const match = /\(([^)]+)\)/.exec(stdout.trim());
  assert.ok(match);
  const relPath = match?.[1] ?? "";
  const createdPath = path.join(root, relPath);
  assert.equal(fs.existsSync(createdPath), true);

  const { frontmatter } = parseFrontmatter(fs.readFileSync(createdPath, "utf8"), createdPath);
  assert.equal(frontmatter.id, "chk-1");
  assert.equal(frontmatter.type, "checkpoint");
  assert.deepEqual(frontmatter.relates, ["root:task-1", "task-2"]);
});
