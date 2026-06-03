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

test("db init creates generic project db scaffold and is idempotent", () => {
  const root = makeRoot("mdkg-db-init-");

  const first = runCli(root, ["db", "init", "--json"]);
  assert.equal(first.status, 0, first.stderr);
  const receipt = parseJson(first.stdout);
  assert.equal(receipt.action, "db-init");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.enabled_before, false);
  assert.equal(receipt.enabled_after, true);
  assert.equal(receipt.runtime_database_created, false);
  assert.equal(receipt.config_updated, true);
  for (const relativePath of [
    ".mdkg/db/schema",
    ".mdkg/db/schema/migrations",
    ".mdkg/db/runtime",
    ".mdkg/db/state",
    ".mdkg/db/receipts",
    ".mdkg/db/project-db.json",
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite")), false);
  const config = readConfig(root);
  assert.equal(config.db.enabled, true);
  assert.equal(config.db.runtime_path, ".mdkg/db/runtime/project.sqlite");
  const manifest = parseJson(fs.readFileSync(path.join(root, ".mdkg", "db", "project-db.json"), "utf8"));
  assert.equal(manifest.kind, "project_db");
  assert.equal(manifest.enabled, true);
  assert.equal(manifest.runtime_database_created, false);

  const second = runCli(root, ["db", "init", "--json"]);
  assert.equal(second.status, 0, second.stderr);
  const repeated = parseJson(second.stdout);
  assert.equal(repeated.enabled_before, true);
  assert.equal(repeated.config_updated, false);
  assert.deepEqual(repeated.created, []);
  assert.deepEqual(repeated.updated, []);
  assert.equal(repeated.unchanged.includes(".mdkg/db/project-db.json"), true);
});

test("db init honors custom contained project db root defaults", () => {
  const root = makeRoot("mdkg-db-init-custom-");
  const config = readConfig(root);
  config.db = {
    enabled: false,
    schema_version: 1,
    root_path: ".project-db",
    migration_table: "mdkg_schema_migration",
  };
  writeConfig(root, config);

  const result = runCli(root, ["db", "init", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = parseJson(result.stdout);
  assert.equal(payload.paths.root, ".project-db");
  assert.equal(payload.paths.runtime_path, ".project-db/runtime/project.sqlite");
  assert.equal(fs.existsSync(path.join(root, ".project-db", "schema", "migrations")), true);
  assert.equal(fs.existsSync(path.join(root, ".project-db", "runtime", "project.sqlite")), false);
  const updatedConfig = readConfig(root);
  assert.equal(updatedConfig.db.enabled, true);
  assert.equal(updatedConfig.db.schema_path, ".project-db/schema");
  assert.equal(updatedConfig.db.runtime_path, ".project-db/runtime/project.sqlite");
});

test("db init rejects invalid existing project db filesystem state", () => {
  const root = makeRoot("mdkg-db-init-invalid-");
  fs.mkdirSync(path.join(root, ".mdkg", "db"), { recursive: true });
  fs.writeFileSync(path.join(root, ".mdkg", "db", "schema"), "not a directory", "utf8");

  const result = runCli(root, ["db", "init", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /\.mdkg\/db\/schema exists and is not a directory/);
});

test("db migrate applies generic foundation migration and is idempotent", () => {
  const root = makeRoot("mdkg-db-migrate-");
  assert.equal(runCli(root, ["db", "init", "--json"]).status, 0);

  const first = runCli(root, ["db", "migrate", "--json"]);
  assert.equal(first.status, 0, first.stderr);
  const receipt = parseJson(first.stdout);
  assert.equal(receipt.action, "db-migrate");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.database, ".mdkg/db/runtime/project.sqlite");
  assert.equal(receipt.migration_table, "mdkg_schema_migration");
  assert.equal(receipt.applied_count, 1);
  assert.equal(receipt.skipped_count, 0);
  assert.equal(receipt.migrations[0].key, "mdkg.project_db.foundation.v1");
  assert.equal(receipt.migrations[0].status, "applied");
  assert.equal(receipt.migration_files.created[0], ".mdkg/db/schema/migrations/001_mdkg_project_db_foundation.sql");
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite")), true);

  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"));
  try {
    assert.equal(
      db.prepare("SELECT value FROM project_meta WHERE key = 'tool'").get().value,
      "mdkg"
    );
    assert.equal(
      db.prepare("SELECT COUNT(*) AS count FROM mdkg_schema_migration").get().count,
      1
    );
  } finally {
    db.close();
  }

  const second = runCli(root, ["db", "migrate", "--json"]);
  assert.equal(second.status, 0, second.stderr);
  const repeated = parseJson(second.stdout);
  assert.equal(repeated.applied_count, 0);
  assert.equal(repeated.skipped_count, 1);
  assert.equal(repeated.migrations[0].status, "already_applied");
  assert.deepEqual(repeated.migration_files.created, []);
});

test("db migrate fails on disabled config missing dirs corrupt db and checksum drift", () => {
  const disabledRoot = makeRoot("mdkg-db-migrate-disabled-");
  const disabled = runCli(disabledRoot, ["db", "migrate", "--json"]);
  assert.notEqual(disabled.status, 0);
  assert.match(disabled.stderr, /project db is disabled; run mdkg db init first/);

  const missingRoot = makeRoot("mdkg-db-migrate-missing-");
  assert.equal(runCli(missingRoot, ["db", "init", "--json"]).status, 0);
  fs.rmSync(path.join(missingRoot, ".mdkg", "db", "schema"), { recursive: true, force: true });
  const missing = runCli(missingRoot, ["db", "migrate", "--json"]);
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /project db schema directory missing/);

  const corruptRoot = makeRoot("mdkg-db-migrate-corrupt-");
  assert.equal(runCli(corruptRoot, ["db", "init", "--json"]).status, 0);
  fs.writeFileSync(path.join(corruptRoot, ".mdkg", "db", "runtime", "project.sqlite"), "not sqlite", "utf8");
  const corrupt = runCli(corruptRoot, ["db", "migrate", "--json"]);
  assert.notEqual(corrupt.status, 0);
  assert.match(corrupt.stderr, /project DB migration failed|file is not a database/);

  const fileDriftRoot = makeRoot("mdkg-db-migrate-file-drift-");
  assert.equal(runCli(fileDriftRoot, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(fileDriftRoot, ["db", "migrate", "--json"]).status, 0);
  fs.appendFileSync(
    path.join(fileDriftRoot, ".mdkg", "db", "schema", "migrations", "001_mdkg_project_db_foundation.sql"),
    "\n-- drift\n",
    "utf8"
  );
  const fileDrift = runCli(fileDriftRoot, ["db", "migrate", "--json"]);
  assert.notEqual(fileDrift.status, 0);
  assert.match(fileDrift.stderr, /migration file checksum drift/);

  const dbDriftRoot = makeRoot("mdkg-db-migrate-db-drift-");
  assert.equal(runCli(dbDriftRoot, ["db", "init", "--json"]).status, 0);
  assert.equal(runCli(dbDriftRoot, ["db", "migrate", "--json"]).status, 0);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(path.join(dbDriftRoot, ".mdkg", "db", "runtime", "project.sqlite"));
  try {
    db.prepare("UPDATE mdkg_schema_migration SET checksum = ? WHERE migration_key = ?")
      .run("sha256:drift", "mdkg.project_db.foundation.v1");
  } finally {
    db.close();
  }
  const dbDrift = runCli(dbDriftRoot, ["db", "migrate", "--json"]);
  assert.notEqual(dbDrift.status, 0);
  assert.match(dbDrift.stderr, /migration checksum drift/);
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
