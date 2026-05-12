import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runIndexCommand } = require("../../commands/index");
const { runListCommand } = require("../../commands/list");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

function registerWorkspace(root: string, alias: string, workspacePath: string): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces[alias] = {
    path: workspacePath,
    enabled: true,
    mdkg_dir: ".mdkg",
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

function writeTask(root: string, workspacePath: string, id: string, title: string): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  const content = [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${title}`,
    "status: todo",
    "priority: 1",
    "tags: [workspace]",
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
    `${title} body`,
  ].join("\n");
  writeFile(path.join(workspaceRoot, ".mdkg", "work", `${id}.md`), content);
}

function captureStdout(fn: () => void): string {
  const lines: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  console.error = () => {};
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return lines.join("\n");
}

test("index search list and show include registered workspaces only", () => {
  const root = makeTempDir("mdkg-workspace-indexing-");
  writeRootConfig(root);
  registerWorkspace(root, "docs", "docs");
  writeDefaultTemplates(root);
  writeTask(root, ".", "task-1", "Root Indexed");
  writeTask(root, "docs", "task-2", "Docs Indexed");
  writeTask(root, "scratch", "task-3", "Scratch Indexed");

  captureStdout(() => runIndexCommand({ root }));

  const index = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "index", "global.json"), "utf8")
  );
  assert.deepEqual(Object.keys(index.nodes).sort(), ["docs:task-2", "root:task-1"]);
  assert.deepEqual(index.meta.workspaces, ["docs", "root"]);

  const searchOutput = captureStdout(() =>
    runSearchCommand({ root, query: "Indexed", noReindex: true })
  );
  assert.match(searchOutput, /root:task-1/);
  assert.match(searchOutput, /docs:task-2/);
  assert.doesNotMatch(searchOutput, /task-3/);

  const docsListOutput = captureStdout(() =>
    runListCommand({ root, ws: "docs", noReindex: true })
  );
  assert.match(docsListOutput, /docs:task-2/);
  assert.doesNotMatch(docsListOutput, /root:task-1/);

  const showOutput = captureStdout(() =>
    runShowCommand({ root, id: "task-2", noReindex: true })
  );
  assert.match(showOutput, /docs:task-2/);
  assert.match(showOutput, /Docs Indexed body/);

  assert.throws(
    () => runShowCommand({ root, id: "task-3", noReindex: true }),
    /id not found: task-3/
  );
});
