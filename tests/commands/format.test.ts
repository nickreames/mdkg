import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runFormatCommand } = require("../../commands/format");
const { parseFrontmatter } = require("../../graph/frontmatter");
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

function writeMessyTask(root: string): string {
  const content = [
    "---",
    "id: Task-1",
    "type: Task",
    "title: Fix the thing",
    "status: TODO",
    "priority: 2",
    "tags: [b, A]",
    "links: [HTTP://EXAMPLE.COM]",
    "artifacts: [Build-1]",
    "relates: [Task-2]",
    "blocked_by: []",
    "blocks: []",
    "refs: [Task-3]",
    "aliases: [Alias]",
    "created: 2026-01-06",
    "updated: 2026-01-01",
    "---",
    "",
    "# Overview",
  ].join("\n");
  const filePath = path.join(root, ".mdkg", "work", "task-1.md");
  writeFile(filePath, content);
  return filePath;
}

function writeFormattedTask(root: string): { filePath: string; content: string } {
  const content = [
    "---",
    "id: task-2",
    "type: task",
    "title: Already formatted",
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
    "updated: 2026-01-01",
    "---",
    "",
    "# Overview",
    "",
  ].join("\n");
  const filePath = path.join(root, ".mdkg", "work", "task-2.md");
  writeFile(filePath, content);
  return { filePath, content };
}

test("runFormatCommand normalizes frontmatter and updates updated date", () => {
  const root = makeTempDir("mdkg-format-");
  writeConfig(root);
  writeDefaultTemplates(root);
  const filePath = writeMessyTask(root);

  runFormatCommand({ root, now: new Date(2026, 0, 14) });

  const content = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(content, filePath);

  assert.equal(parsed.frontmatter.id, "task-1");
  assert.equal(parsed.frontmatter.type, "task");
  assert.equal(parsed.frontmatter.status, "todo");
  assert.equal(parsed.frontmatter.updated, "2026-01-14");
  assert.deepEqual(parsed.frontmatter.tags, ["a", "b"]);
  assert.deepEqual(parsed.frontmatter.owners, []);
  assert.deepEqual(parsed.frontmatter.links, ["HTTP://EXAMPLE.COM"]);
  assert.deepEqual(parsed.frontmatter.artifacts, ["Build-1"]);
  assert.deepEqual(parsed.frontmatter.refs, ["task-3"]);
});

test("runFormatCommand leaves updated unchanged when already formatted", () => {
  const root = makeTempDir("mdkg-format-clean-");
  writeConfig(root);
  writeDefaultTemplates(root);
  const { filePath, content: original } = writeFormattedTask(root);

  runFormatCommand({ root, now: new Date(2026, 0, 14) });

  const content = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(content, filePath);

  assert.equal(content, original);
  assert.equal(parsed.frontmatter.updated, "2026-01-01");
});
