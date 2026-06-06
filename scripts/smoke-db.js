#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || "npm";
const GIT_CMD = process.env.GIT || "git";

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return result.stdout.trim();
}

function runRaw(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(path.join(prefix, "bin"), { recursive: true });
  fs.mkdirSync(path.join(prefix, "lib"), { recursive: true });
  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = packOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);
  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-db-smoke-"));
  const binPath = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  const init = parseJson(mdkg(binPath, ["db", "init", "--json"], root));
  assert(init.action === "db-init" && init.ok === true, "db init receipt failed");
  assert(init.runtime_database_created === false, "db init must not create runtime database");

  const migrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));
  assert(migrate.action === "db-migrate" && migrate.applied_count === 5, "db migrate did not apply built-in migrations");
  const runtimePath = path.join(root, ".mdkg", "db", "runtime", "project.sqlite");
  const foundationMigrationFile = path.join(root, ".mdkg", "db", "schema", "migrations", "001_mdkg_project_db_foundation.sql");
  const queueMigrationFile = path.join(root, ".mdkg", "db", "schema", "migrations", "002_mdkg_project_db_queue.sql");
  const eventsMigrationFile = path.join(root, ".mdkg", "db", "schema", "migrations", "003_mdkg_project_db_events_receipts.sql");
  const leasesMigrationFile = path.join(root, ".mdkg", "db", "schema", "migrations", "004_mdkg_project_db_writer_leases.sql");
  const queueControlMigrationFile = path.join(root, ".mdkg", "db", "schema", "migrations", "005_mdkg_project_db_queue_control.sql");
  assertExists(runtimePath);
  assertExists(foundationMigrationFile);
  assertExists(queueMigrationFile);
  assertExists(eventsMigrationFile);
  assertExists(leasesMigrationFile);
  assertExists(queueControlMigrationFile);

  const runtimeIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/runtime/project.sqlite"], { cwd: root });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored by default");
  const schemaIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/schema/migrations/001_mdkg_project_db_foundation.sql"], { cwd: root });
  assert(schemaIgnored.status !== 0, "schema migrations should be commit-eligible");
  const queueSchemaIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/schema/migrations/002_mdkg_project_db_queue.sql"], { cwd: root });
  assert(queueSchemaIgnored.status !== 0, "queue schema migration should be commit-eligible");
  const eventsSchemaIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/schema/migrations/003_mdkg_project_db_events_receipts.sql"], { cwd: root });
  assert(eventsSchemaIgnored.status !== 0, "events schema migration should be commit-eligible");
  const leasesSchemaIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/schema/migrations/004_mdkg_project_db_writer_leases.sql"], { cwd: root });
  assert(leasesSchemaIgnored.status !== 0, "writer lease schema migration should be commit-eligible");
  const queueControlSchemaIgnored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/db/schema/migrations/005_mdkg_project_db_queue_control.sql"], { cwd: root });
  assert(queueControlSchemaIgnored.status !== 0, "queue control schema migration should be commit-eligible");

  const verify = parseJson(mdkg(binPath, ["db", "verify", "--json"], root));
  assert(verify.action === "db-verify" && verify.ok === true, "db verify receipt failed");
  const stats = parseJson(mdkg(binPath, ["db", "stats", "--json"], root));
  assert(stats.action === "db-stats" && stats.migration_count === 5, "db stats receipt failed");
  assert(stats.tables.some((table) => table.name === "project_meta"), "db stats missing project_meta table");
  assert(stats.tables.some((table) => table.name === "project_queue_message"), "db stats missing project_queue_message table");
  assert(stats.tables.some((table) => table.name === "project_event"), "db stats missing project_event table");
  assert(stats.tables.some((table) => table.name === "project_receipt"), "db stats missing project_receipt table");
  assert(stats.tables.some((table) => table.name === "project_writer_lease"), "db stats missing project_writer_lease table");

  const indexRebuild = parseJson(mdkg(binPath, ["db", "index", "rebuild", "--json"], root));
  assert(indexRebuild.action === "db-index-rebuild" && indexRebuild.ok === true, "db index rebuild failed");
  const indexStatus = parseJson(mdkg(binPath, ["db", "index", "status", "--json"], root));
  assert(indexStatus.action === "db-index-status" && indexStatus.ok === true, "db index status failed");
  const indexVerify = parseJson(mdkg(binPath, ["db", "index", "verify", "--json"], root));
  assert(indexVerify.action === "db-index-verify" && indexVerify.ok === true, "db index verify failed");

  const task = parseJson(mdkg(binPath, ["new", "task", "db smoke search target", "--status", "todo", "--priority", "1", "--json"], root));
  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate"], root);
  const search = mdkg(binPath, ["search", "db smoke search target"], root);
  assert(search.includes(task.node.qid), "search did not return created db smoke task");
  const show = mdkg(binPath, ["show", task.node.id], root);
  assert(show.includes("db smoke search target"), "show did not return created db smoke task");

  console.log("db smoke passed");
}

main();
