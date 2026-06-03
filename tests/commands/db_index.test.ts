import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function makeRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: db index fixture",
      "status: todo",
      "priority: 1",
      "tags: [db]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-03",
      "updated: 2026-06-03",
      "---",
      "",
      "# Overview",
      "",
      "DB index fixture.",
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

function parseJson(stdout: string): any {
  return JSON.parse(stdout);
}

function readConfig(root: string): any {
  return JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
}

function writeConfig(root: string, config: unknown): void {
  fs.writeFileSync(path.join(root, ".mdkg", "config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

test("db index rebuild status and verify work in json backend", () => {
  const root = makeRoot("mdkg-db-index-json-");

  const rebuild = runCli(root, ["db", "index", "rebuild", "--json"]);
  assert.equal(rebuild.status, 0, rebuild.stderr);
  const rebuilt = parseJson(rebuild.stdout);
  assert.equal(rebuilt.action, "db-index-rebuild");
  assert.equal(rebuilt.ok, true);
  assert.equal(rebuilt.backend, "json");
  assert.deepEqual(Object.keys(rebuilt.paths).sort(), [
    "capabilities",
    "global",
    "skills",
    "subgraphs",
  ]);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "global.json")), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "skills.json")), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "capabilities.json")), true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "subgraphs.json")), true);

  const status = runCli(root, ["db", "index", "status", "--json"]);
  assert.equal(status.status, 0, status.stderr);
  const statusPayload = parseJson(status.stdout);
  assert.equal(statusPayload.action, "db-index-status");
  assert.equal(statusPayload.ok, true);
  assert.equal(statusPayload.checks.find((check: any) => check.name === "sqlite").detail, "SQLite backend disabled; JSON cache backend active");

  const verify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.equal(verify.status, 0, verify.stderr);
  const verifyPayload = parseJson(verify.stdout);
  assert.equal(verifyPayload.action, "db-index-verify");
  assert.equal(verifyPayload.ok, true);

  const shortcut = runCli(root, ["index"]);
  assert.equal(shortcut.status, 0, shortcut.stderr);
  assert.match(shortcut.stdout, /index written: \.mdkg\/index\/global\.json/);
});

test("db index status reports and verify fails for missing and stale caches", () => {
  const root = makeRoot("mdkg-db-index-stale-");
  assert.equal(runCli(root, ["db", "index", "rebuild"]).status, 0);

  fs.rmSync(path.join(root, ".mdkg", "index", "capabilities.json"));
  const missingStatus = runCli(root, ["db", "index", "status", "--json"]);
  assert.equal(missingStatus.status, 0, missingStatus.stderr);
  const missingStatusPayload = parseJson(missingStatus.stdout);
  assert.equal(missingStatusPayload.ok, false);
  assert.match(missingStatusPayload.errors.join("\n"), /capabilities: cache file missing/);

  const missingVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(missingVerify.status, 0);
  const missingVerifyPayload = parseJson(missingVerify.stdout);
  assert.equal(missingVerifyPayload.ok, false);
  assert.match(missingVerify.stderr, /db index verify failed/);

  assert.equal(runCli(root, ["db", "index", "rebuild"]).status, 0);
  fs.appendFileSync(path.join(root, ".mdkg", "work", "task-1.md"), "\nStale marker.\n", "utf8");

  const staleVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(staleVerify.status, 0);
  const stalePayload = parseJson(staleVerify.stdout);
  assert.equal(stalePayload.ok, false);
  assert.match(stalePayload.warnings.join("\n"), /cache is stale/);
});

test("db index rebuild restores missing sqlite cache and verify detects corrupt sqlite", () => {
  const root = makeRoot("mdkg-db-index-sqlite-");
  const config = readConfig(root);
  config.index.backend = "sqlite";
  writeConfig(root, config);

  const rebuild = runCli(root, ["db", "index", "rebuild", "--json"]);
  assert.equal(rebuild.status, 0, rebuild.stderr);
  const rebuilt = parseJson(rebuild.stdout);
  assert.equal(rebuilt.backend, "sqlite");
  assert.equal(rebuilt.paths.sqlite, ".mdkg/index/mdkg.sqlite");
  const sqlitePath = path.join(root, ".mdkg", "index", "mdkg.sqlite");
  assert.equal(fs.existsSync(sqlitePath), true);

  fs.rmSync(sqlitePath);
  const missingVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(missingVerify.status, 0);
  assert.match(parseJson(missingVerify.stdout).errors.join("\n"), /sqlite: SQLite cache missing/);

  assert.equal(runCli(root, ["db", "index", "rebuild"]).status, 0);
  assert.equal(fs.existsSync(sqlitePath), true);
  assert.equal(runCli(root, ["db", "index", "verify"]).status, 0);

  fs.writeFileSync(sqlitePath, "not a sqlite database", "utf8");
  const corruptVerify = runCli(root, ["db", "index", "verify", "--json"]);
  assert.notEqual(corruptVerify.status, 0);
  assert.match(parseJson(corruptVerify.stdout).errors.join("\n"), /failed to read SQLite cache|file is not a database/);
});
