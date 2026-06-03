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

  const validateJson = runCli(root, ["validate", "--json"]);
  assert.equal(validateJson.status, 0);
  const receipt = JSON.parse(validateJson.stdout) as {
    action: string;
    ok: boolean;
    error_count: number;
  };
  assert.equal(receipt.action, "validated");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.error_count, 0);

  const format = runCli(root, ["format"]);
  assert.equal(format.status, 0);
  assert.match(format.stdout, /format updated/);

  const doctor = runCli(root, ["doctor", "--json"]);
  assert.equal(doctor.status, 0);
  assert.match(doctor.stdout, /\"ok\": true/);

  const skillValidateJson = runCli(root, ["skill", "validate", "--json"]);
  assert.equal(skillValidateJson.status, 0);
  assert.deepEqual(JSON.parse(skillValidateJson.stdout), {
    action: "validated",
    ok: true,
    checked_count: 0,
    warning_count: 0,
    error_count: 0,
    warnings: [],
    errors: [],
  });
});

test("cli dispatch covers workspace add/list/enable/disable/remove", () => {
  const root = setupRepo();

  const add = runCli(root, ["workspace", "add", "docs", "docs"]);
  assert.equal(add.status, 0);
  assert.match(add.stdout, /workspace added: docs/);

  const disable = runCli(root, ["workspace", "disable", "docs"]);
  assert.equal(disable.status, 0);
  assert.match(disable.stdout, /workspace disabled: docs/);

  const list = runCli(root, ["workspace", "ls"]);
  assert.equal(list.status, 0);
  assert.match(list.stdout, /docs \| disabled \| private \| docs \| \.mdkg/);

  const enable = runCli(root, ["workspace", "enable", "docs"]);
  assert.equal(enable.status, 0);
  assert.match(enable.stdout, /workspace enabled: docs/);

  const remove = runCli(root, ["workspace", "rm", "docs"]);
  assert.equal(remove.status, 0);
  assert.match(remove.stdout, /workspace removed: docs/);
});

test("cli dispatch covers workspace mutation json receipts", () => {
  const root = setupRepo();

  const add = runCli(root, ["workspace", "add", "docs", "docs", "--json"]);
  assert.equal(add.status, 0);
  assert.deepEqual(JSON.parse(add.stdout), {
    action: "added",
    workspace: {
      alias: "docs",
      path: "docs",
      enabled: true,
      mdkg_dir: ".mdkg",
      visibility: "private",
    },
  });

  const disable = runCli(root, ["workspace", "disable", "docs", "--json"]);
  assert.equal(disable.status, 0);
  assert.deepEqual(JSON.parse(disable.stdout), {
    action: "disabled",
    workspace: {
      alias: "docs",
      path: "docs",
      enabled: false,
      mdkg_dir: ".mdkg",
      visibility: "private",
    },
  });
});

test("cli dispatch covers event json receipts", () => {
  const root = setupRepo();

  const enable = runCli(root, ["event", "enable", "--json"]);
  assert.equal(enable.status, 0);
  assert.deepEqual(JSON.parse(enable.stdout), {
    action: "enabled",
    workspace: "root",
    created: true,
  });

  const append = runCli(root, [
    "event",
    "append",
    "--kind",
    "RUN_COMPLETED",
    "--status",
    "ok",
    "--refs",
    "TASK-1",
    "--run-id",
    "run_cli_event_json",
    "--json",
  ]);
  assert.equal(append.status, 0);
  const receipt = JSON.parse(append.stdout);
  assert.equal(receipt.action, "appended");
  assert.equal(receipt.event.run_id, "run_cli_event_json");
  assert.equal(receipt.event.workspace, "root");
  assert.equal(receipt.event.kind, "RUN_COMPLETED");
  assert.equal(receipt.event.status, "ok");
  assert.deepEqual(receipt.event.refs, ["task-1"]);
});

test("cli returns usage errors for unknown and malformed commands", () => {
  const root = setupRepo();

  const unknown = runCli(root, ["wat"]);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown command: wat/);

  const badWorkspace = runCli(root, ["workspace"]);
  assert.equal(badWorkspace.status, 1);
  assert.match(badWorkspace.stderr, /workspace requires ls\/add\/rm\/enable\/disable/);

  const badDb = runCli(root, ["db"]);
  assert.equal(badDb.status, 1);
  assert.match(badDb.stderr, /mdkg db requires index\/init\/migrate\/verify\/stats/);
  assert.match(badDb.stdout, /mdkg db init \[--json\]/);

  const dbIndex = runCli(root, ["db", "index"]);
  assert.equal(dbIndex.status, 1);
  assert.match(dbIndex.stderr, /mdkg db index requires rebuild\/status\/verify/);
  assert.match(dbIndex.stdout, /mdkg db index rebuild \[--tolerant\] \[--json\]/);

  const dbInit = runCli(root, ["db", "init", "--json"]);
  assert.equal(dbInit.status, 0);
  assert.equal(JSON.parse(dbInit.stdout).action, "db-init");

  const dbMigrate = runCli(root, ["db", "migrate", "--json"]);
  assert.equal(dbMigrate.status, 0, dbMigrate.stderr);
  assert.equal(JSON.parse(dbMigrate.stdout).action, "db-migrate");

  const dbVerify = runCli(root, ["db", "verify"]);
  assert.equal(dbVerify.status, 1);
  assert.match(dbVerify.stderr, /mdkg db verify is planned; implementation is scoped to task-229/);

  const badShow = runCli(root, ["show"]);
  assert.equal(badShow.status, 1);
  assert.match(badShow.stderr, /show requires a single id/);
});
