import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runShowCommand } = require("../../commands/show");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function writeTask(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Show error fixture",
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
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Overview",
      "",
      "Body",
    ].join("\n")
  );
}

test("runShowCommand rejects unknown workspaces", () => {
  const root = makeTempDir("mdkg-show-error-ws-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  assert.throws(
    () =>
      runShowCommand({
        root,
        id: "task-1",
        ws: "missing",
      }),
    /workspace not found: missing/
  );
});

test("runShowCommand rejects removed generic skill access", () => {
  const root = makeTempDir("mdkg-show-error-skill-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runShowCommand({
        root,
        id: "skill:nope",
      }),
    /generic skill show is no longer supported; use `mdkg skill show nope`/
  );
});

test("runShowCommand errors when node body file is missing", () => {
  const root = makeTempDir("mdkg-show-error-file-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  runShowCommand({ root, id: "task-1", metaOnly: true });
  fs.unlinkSync(path.join(root, ".mdkg", "work", "task-1.md"));

  assert.throws(
    () =>
      runShowCommand({
        root,
        id: "task-1",
        noReindex: true,
      }),
    /file not found for root:task-1/
  );
});
