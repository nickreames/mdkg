#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");

const repoRoot = path.resolve(__dirname, "..");

let commands;

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

function prepareInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(path.join(prefix, "bin"), { recursive: true });
  fs.mkdirSync(path.join(prefix, "lib"), { recursive: true });
  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir]).stdout;
  const tarball = packOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);
  return { tarballPath, install() {
    commands.npm(["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts", "--offline"], {
      cwd: tempRoot,
      env: { npm_config_prefix: prefix },
    });
    const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
    assertExists(binPath);
    return { binPath, tarballPath };
  } };
}

function mdkg(binPath, args, cwd) {
  return commands.node(binPath, args, cwd).stdout.trim();
}

function verifyInstalledInitContainment(binPath, tempRoot) {
  for (const [index, linkedPath] of [".mdkg/db", ".mdkg/db/schema", ".mdkg/db/receipts"].entries()) {
    const root = path.join(tempRoot, `linked-${index}`);
    const outside = path.join(tempRoot, `sentinel-${index}`);
    fs.mkdirSync(root);
    fs.mkdirSync(outside);
    mdkg(binPath, ["init", "--graph-only"], root);
    const configPath = path.join(root, ".mdkg/config.json");
    const configBefore = fs.readFileSync(configPath);
    fs.writeFileSync(path.join(outside, "sentinel"), "preserve exact bytes\n");
    const linked = path.join(root, linkedPath);
    fs.mkdirSync(path.dirname(linked), { recursive: true });
    fs.symlinkSync(outside, linked, "dir");
    const result = commands.node(binPath, ["db", "init", "--json"], root, { allowFailure: true });
    assert(result.status === 2, `installed init must reject ${linkedPath}: ${result.stderr}`);
    assert(fs.readFileSync(configPath).equals(configBefore), "rejected init changed config");
    assert(JSON.stringify(fs.readdirSync(outside)) === JSON.stringify(["sentinel"]), "rejected init created outside files");
    assert(fs.readFileSync(path.join(outside, "sentinel"), "utf8") === "preserve exact bytes\n", "rejected init changed sentinel");
    if (linkedPath === ".mdkg/db/receipts") {
      assert(!fs.existsSync(path.join(root, ".mdkg/db/schema")), "late unsafe path left partial scaffold");
    }
  }
  for (const [index, customRoot] of ["..project-db", ...(process.platform === "win32" ? [] : [".project\\db"])].entries()) {
    const root = path.join(tempRoot, `custom-${index}`);
    fs.mkdirSync(root);
    mdkg(binPath, ["init", "--graph-only"], root);
    const configPath = path.join(root, ".mdkg/config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.db = { enabled: false, schema_version: 1, root_path: customRoot, migration_table: "mdkg_schema_migration" };
    fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
    mdkg(binPath, ["db", "init", "--json"], root);
    assertExists(path.join(root, customRoot, "schema", "migrations"));
    const repeated = parseJson(mdkg(binPath, ["db", "init", "--json"], root));
    assert(repeated.created.length === 0 && repeated.updated.length === 0, "installed custom init must remain idempotent");
  }
}

function exerciseSmoke(tempRoot, installed) {
  const { binPath, tarballPath } = installed;
  verifyInstalledInitContainment(binPath, tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  commands.git(["init", "-q"], root);

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

  const runtimeIgnored = commands.git(["check-ignore", ".mdkg/db/runtime/project.sqlite"], root, { allowFailure: true });
  assert(runtimeIgnored.status === 0, "runtime project.sqlite should be ignored by default");
  const schemaIgnored = commands.git(["check-ignore", ".mdkg/db/schema/migrations/001_mdkg_project_db_foundation.sql"], root, { allowFailure: true });
  assert(schemaIgnored.status === 1, "schema migrations should be commit-eligible");
  const queueSchemaIgnored = commands.git(["check-ignore", ".mdkg/db/schema/migrations/002_mdkg_project_db_queue.sql"], root, { allowFailure: true });
  assert(queueSchemaIgnored.status === 1, "queue schema migration should be commit-eligible");
  const eventsSchemaIgnored = commands.git(["check-ignore", ".mdkg/db/schema/migrations/003_mdkg_project_db_events_receipts.sql"], root, { allowFailure: true });
  assert(eventsSchemaIgnored.status === 1, "events schema migration should be commit-eligible");
  const leasesSchemaIgnored = commands.git(["check-ignore", ".mdkg/db/schema/migrations/004_mdkg_project_db_writer_leases.sql"], root, { allowFailure: true });
  assert(leasesSchemaIgnored.status === 1, "writer lease schema migration should be commit-eligible");
  const queueControlSchemaIgnored = commands.git(["check-ignore", ".mdkg/db/schema/migrations/005_mdkg_project_db_queue_control.sql"], root, { allowFailure: true });
  assert(queueControlSchemaIgnored.status === 1, "queue control schema migration should be commit-eligible");

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

  return { smoke: "db", ok: true, temp_root: tempRoot, tarball: tarballPath };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-db-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
