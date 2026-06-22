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
    "context_refs: []",
    "evidence_refs: []",
    "aliases: []",
    "skills: []",
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

function writeHeadingFixtureTask(root: string, id: string): string {
  const content = [
    "---",
    `id: ${id}`,
    "type: task",
    "title: Missing headings",
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
    "skills: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    "",
    "# Overview",
    "",
  ].join("\n");
  const filePath = path.join(root, ".mdkg", "work", `${id}.md`);
  writeFile(filePath, content);
  return filePath;
}

function captureOutput(fn: () => void): { stdout: string; stderr: string; error?: unknown } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  let error: unknown;
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  try {
    fn();
  } catch (err) {
    error = err;
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), error };
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

test("runFormatCommand heading migration supports dry-run and apply receipts", () => {
  const root = makeTempDir("mdkg-format-headings-");
  writeConfig(root);
  writeDefaultTemplates(root);
  const filePath = writeMessyTask(root);

  const dryRunOutput = captureOutput(() =>
    runFormatCommand({ root, headings: true, dryRun: true, json: true })
  );
  const dryRun = JSON.parse(dryRunOutput.stdout);
  assert.equal(dryRunOutput.error, undefined);
  assert.equal(dryRun.dry_run, true);
  assert.equal(dryRun.applied, false);
  assert.equal(dryRun.changed_count, 1);
  assert.deepEqual(dryRun.changes[0].added_headings, [
    "Acceptance Criteria",
    "Files Affected",
    "Implementation Notes",
    "Test Plan",
    "Links / Artifacts",
  ]);
  assert.doesNotMatch(fs.readFileSync(filePath, "utf8"), /# Acceptance Criteria/);

  const applyOutput = captureOutput(() =>
    runFormatCommand({ root, headings: true, apply: true, json: true })
  );
  const applied = JSON.parse(applyOutput.stdout);
  assert.equal(applyOutput.error, undefined);
  assert.equal(applied.dry_run, false);
  assert.equal(applied.applied, true);
  assert.equal(applied.changed_count, 1);
  const content = fs.readFileSync(filePath, "utf8");
  assert.match(content, /# Acceptance Criteria/);
  assert.match(content, /# Links \/ Artifacts/);
});

test("runFormatCommand heading migration summary mode bounds dry-run output without applying", () => {
  const root = makeTempDir("mdkg-format-headings-summary-");
  writeConfig(root);
  writeDefaultTemplates(root);
  const paths: string[] = [];
  for (let i = 1; i <= 30; i += 1) {
    paths.push(writeHeadingFixtureTask(root, `task-${i}`));
  }
  const before = new Map(paths.map((filePath) => [filePath, fs.readFileSync(filePath, "utf8")]));

  const output = captureOutput(() =>
    runFormatCommand({ root, headings: true, dryRun: true, json: true, summary: true, limit: 7 })
  );
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    dry_run: boolean;
    applied: boolean;
    changed_count: number;
    summary: {
      total: number;
      emitted: number;
      truncated: boolean;
      omitted_count: number;
      limit: number;
      affected_file_count: number;
      by_node_type: Array<{ key: string; count: number }>;
      top_paths: Array<{ key: string; count: number }>;
    };
    changes: Array<{ path: string; type: string; added_headings: string[] }>;
  };

  assert.equal(output.error, undefined);
  assert.equal(receipt.action, "format.headings");
  assert.equal(receipt.dry_run, true);
  assert.equal(receipt.applied, false);
  assert.equal(receipt.changed_count, 30);
  assert.equal(receipt.changes.length, 7);
  assert.equal(receipt.summary.total, 30);
  assert.equal(receipt.summary.emitted, 7);
  assert.equal(receipt.summary.truncated, true);
  assert.equal(receipt.summary.omitted_count, 23);
  assert.equal(receipt.summary.limit, 7);
  assert.equal(receipt.summary.affected_file_count, 30);
  assert.deepEqual(receipt.summary.by_node_type[0], { key: "task", count: 30 });
  assert.ok(receipt.summary.top_paths.length > 0);
  for (const filePath of paths) {
    assert.equal(fs.readFileSync(filePath, "utf8"), before.get(filePath));
  }
});
