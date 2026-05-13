import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runIndexCommand } = require("../../commands/index");
const { runListCommand } = require("../../commands/list");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

function writeTask(root: string, id: string, title: string, status = "todo"): string {
  const filePath = path.join(root, ".mdkg", "work", `${id}.md`);
  writeFile(
    filePath,
    [
      "---",
      `id: ${id}`,
      "type: task",
      `title: ${title}`,
      `status: ${status}`,
      "priority: 1",
      "tags: [coverage]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-05-08",
      "updated: 2026-05-08",
      "---",
      "",
      "# Overview",
      "",
      `${title} body`,
    ].join("\n")
  );
  return filePath;
}

function setupRepo(): { root: string; taskPath: string } {
  const root = makeTempDir("mdkg-list-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  const taskPath = writeTask(root, "task-1", "List Coverage");
  return { root, taskPath };
}

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

test("runListCommand treats all workspace as unscoped", () => {
  const { root } = setupRepo();

  const output = captureOutput(() => runListCommand({ root, ws: "all" }));

  assert.equal(output.stderr, "count: 1");
  assert.match(output.stdout, /root:task-1/);
});

test("runListCommand rejects unknown workspaces", () => {
  const { root } = setupRepo();

  assert.throws(() => runListCommand({ root, ws: "missing" }), /workspace not found: missing/);
});

test("runListCommand prints an empty-result note", () => {
  const { root } = setupRepo();

  const output = captureOutput(() => runListCommand({ root, status: "done" }));

  assert.equal(output.stdout, "");
  assert.match(output.stderr, /count: 0/);
  assert.match(output.stderr, /no nodes matched current filters/);
});

test("runListCommand warns when cached index is stale and reindex is disabled", () => {
  const { root, taskPath } = setupRepo();
  captureOutput(() => runIndexCommand({ root }));
  const future = new Date(Date.now() + 10_000);
  fs.utimesSync(taskPath, future, future);

  const output = captureOutput(() => runListCommand({ root, noReindex: true }));

  assert.match(output.stdout, /root:task-1/);
  assert.match(output.stderr, /warning: index is stale; run mdkg index to refresh/);
});
