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

function captureOutput(fn: () => void): { stdout: string; stderr: string; error?: unknown } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalError = console.error;
  const originalLog = console.log;
  let error: unknown;
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };

  try {
    fn();
  } catch (err) {
    error = err;
  } finally {
    console.error = originalError;
    console.log = originalLog;
  }

  return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), error };
}

test("runValidateCommand writes warnings to --out and respects --quiet", () => {
  const root = makeTempDir("mdkg-validate-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const outPath = "report.txt";
  const output = captureOutput(() => runValidateCommand({ root, out: outPath, quiet: true }));

  const report = fs.readFileSync(path.join(root, outPath), "utf8");
  assert.ok(report.includes("warning: root:task-1"));
  assert.equal(output.error, undefined);
  assert.equal(output.stderr, "");
});

test("runValidateCommand emits a success JSON receipt", () => {
  const root = makeTempDir("mdkg-validate-json-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const output = captureOutput(() => runValidateCommand({ root, out: "report.txt", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    ok: boolean;
    warning_count: number;
    error_count: number;
    warnings: string[];
    errors: string[];
    report_path?: string;
  };

  assert.equal(output.error, undefined);
  assert.equal(output.stderr, "");
  assert.equal(receipt.action, "validated");
  assert.equal(receipt.ok, true);
  assert.ok(receipt.warning_count > 0);
  assert.equal(receipt.error_count, 0);
  assert.equal(receipt.errors.length, 0);
  assert.ok(receipt.warnings.some((warning) => warning.includes("root:task-1")));
  assert.equal(receipt.report_path, path.resolve(root, "report.txt"));

  const report = fs.readFileSync(path.join(root, "report.txt"), "utf8");
  assert.ok(report.includes("warning: root:task-1"));
});

test("runValidateCommand emits a failing JSON receipt before throwing", () => {
  const root = makeTempDir("mdkg-validate-json-fail-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeFile(
    path.join(root, ".mdkg", "work", "events", "events.jsonl"),
    JSON.stringify({
      ts: "2026-03-08T00:00:00.000Z",
      workspace: "root",
      agent: "tester",
      kind: "RUN_COMPLETED",
      status: "ok",
      refs: ["task-1"],
      artifacts: [],
      notes: "missing run id",
    })
  );

  const output = captureOutput(() => runValidateCommand({ root, json: true, quiet: true }));
  const receipt = JSON.parse(output.stdout) as {
    ok: boolean;
    error_count: number;
    errors: string[];
  };

  assert.match(output.error instanceof Error ? output.error.message : "", /validation failed with 1 error/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.equal(receipt.error_count, 1);
  assert.equal(receipt.errors.length, 1);
  assert.match(receipt.errors[0] ?? "", /run_id is required/);
});
