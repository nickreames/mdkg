import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function setupRepo(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-dispatch-"));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "core", "guide.md"),
    [
      "---",
      "id: rule-guide",
      "type: rule",
      "title: repo guide",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Guide",
      "",
      "Repo guide",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: CLI dispatch fixture",
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
      "Dispatch body.",
    ].join("\n")
  );
  return root;
}

function runCli(root: string, args: string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    cwd: root,
  });
}

test("cli dispatch covers index, guide, show, list, search, next, validate, format, and doctor", () => {
  const root = setupRepo();

  const index = runCli(root, ["index"]);
  assert.equal(index.status, 0);
  assert.match(index.stdout, /index written:/);

  const guide = runCli(root, ["guide"]);
  assert.equal(guide.status, 0);
  assert.match(guide.stdout, /# Guide/);

  const show = runCli(root, ["show", "task-1"]);
  assert.equal(show.status, 0);
  assert.match(show.stdout, /Dispatch body/);

  const list = runCli(root, ["list", "--status", "todo"]);
  assert.equal(list.status, 0);
  assert.match(list.stdout, /root:task-1/);

  const search = runCli(root, ["search", "dispatch"]);
  assert.equal(search.status, 0);
  assert.match(search.stdout, /root:task-1/);

  const next = runCli(root, ["next"]);
  assert.equal(next.status, 0);
  assert.match(next.stdout, /root:task-1/);

  const validate = runCli(root, ["validate"]);
  assert.equal(validate.status, 0);
  assert.match(validate.stdout, /validation ok/);

  const format = runCli(root, ["format"]);
  assert.equal(format.status, 0);
  assert.match(format.stdout, /format updated/);

  const doctor = runCli(root, ["doctor", "--json"]);
  assert.equal(doctor.status, 0);
  assert.match(doctor.stdout, /\"ok\": true/);
});

test("cli dispatch covers workspace add/list/remove", () => {
  const root = setupRepo();

  const add = runCli(root, ["workspace", "add", "docs", "docs"]);
  assert.equal(add.status, 0);
  assert.match(add.stdout, /workspace added: docs/);

  const list = runCli(root, ["workspace", "ls"]);
  assert.equal(list.status, 0);
  assert.match(list.stdout, /docs \| enabled \| docs \| \.mdkg/);

  const remove = runCli(root, ["workspace", "rm", "docs"]);
  assert.equal(remove.status, 0);
  assert.match(remove.stdout, /workspace removed: docs/);
});

test("cli returns usage errors for unknown and malformed commands", () => {
  const root = setupRepo();

  const unknown = runCli(root, ["wat"]);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown command: wat/);

  const badWorkspace = runCli(root, ["workspace"]);
  assert.equal(badWorkspace.status, 1);
  assert.match(badWorkspace.stderr, /workspace requires ls\/add\/rm/);

  const badShow = runCli(root, ["show"]);
  assert.equal(badShow.status, 1);
  assert.match(badShow.stderr, /show requires a single id/);
});
