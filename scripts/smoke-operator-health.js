#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const GIT_CMD = process.env.GIT || (process.platform === "win32" ? "git.exe" : "git");

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
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result.stdout.trim();
}

function runMaybe(command, args, options = {}) {
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

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function mdkgMaybe(binPath, args, cwd) {
  return runMaybe(binPath, args, { cwd });
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  const packageRoot = path.join(prefix, "lib", "node_modules", "mdkg");
  assertExists(binPath);
  assertExists(path.join(packageRoot, "README.md"));
  return { binPath, packageRoot, tarballPath };
}

function git(root, args) {
  return run(GIT_CMD, args, { cwd: root });
}

function commitAll(root, message) {
  git(root, ["add", "-A"]);
  git(root, ["-c", "user.name=mdkg smoke", "-c", "user.email=mdkg-smoke@example.test", "commit", "-m", message, "-q"]);
}

function assertCleanStatus(binPath, root) {
  const status = parseJson(mdkg(binPath, ["status", "--json"], root));
  assert(status.action === "status", "status action mismatch");
  assert(status.ok === true, "clean status should be ok");
  assert(status.level === "ok", `expected clean status level ok, got ${status.level}`);
  assert(status.git.inside === true, "status should detect git repo");
  assert(status.git.dirty === false, "clean status should report dirty=false");
  assert(status.graph.ok === true, "status graph should be ok");
  assert(status.generated.index.exists === true, "status should report index cache");
  assert(status.generated.capabilities.exists === true, "status should report capability cache");
  return status;
}

function assertStrictDoctorOk(binPath, root, label) {
  const doctor = parseJson(mdkg(binPath, ["doctor", "--strict", "--json"], root));
  assert(doctor.action === "doctor", `${label}: doctor action mismatch`);
  assert(doctor.strict === true, `${label}: doctor strict mismatch`);
  assert(doctor.ok === true, `${label}: doctor strict should be ok`);
  assert(doctor.checks.every((check) => typeof check.id === "string"), `${label}: missing typed ids`);
  assert(doctor.checks.every((check) => typeof check.status === "string"), `${label}: missing typed statuses`);
  assert(doctor.checks.every((check) => typeof check.severity === "string"), `${label}: missing typed severities`);
  assert(doctor.checks.every((check) => typeof check.remediation === "string"), `${label}: missing remediation`);
  return doctor;
}

function assertHelpAndDocs(packageRoot, binPath, root) {
  const readme = fs.readFileSync(path.join(packageRoot, "README.md"), "utf8");
  const matrix = fs.readFileSync(path.join(packageRoot, "CLI_COMMAND_MATRIX.md"), "utf8");
  const seededMatrix = fs.readFileSync(path.join(packageRoot, "dist", "init", "CLI_COMMAND_MATRIX.md"), "utf8");
  assert(readme.includes("mdkg status"), "README is missing mdkg status guidance");
  assert(readme.includes("mdkg doctor --strict --json"), "README is missing doctor strict guidance");
  assert(matrix.includes("mdkg status [--json]"), "CLI command matrix is missing status usage");
  assert(matrix.includes("mdkg doctor [--strict] [--json]"), "CLI command matrix is missing doctor strict usage");
  assert(seededMatrix.includes("mdkg status [--json]"), "seeded command matrix is missing status usage");

  const statusHelp = mdkg(binPath, ["help", "status"], root);
  assert(statusHelp.includes("mdkg status [--json]"), "status help missing usage");
  assert(statusHelp.includes("read-only operator summary"), "status help missing read-only boundary");
  const doctorHelp = mdkg(binPath, ["help", "doctor"], root);
  assert(doctorHelp.includes("mdkg doctor [--strict] [--json]"), "doctor help missing strict usage");
  assert(doctorHelp.includes("--strict"), "doctor help missing strict flag");
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-operator-health."));
  const { binPath, packageRoot, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);

  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["index"], root);
  commitAll(root, "initial mdkg operator health smoke");
  assertHelpAndDocs(packageRoot, binPath, root);
  assertCleanStatus(binPath, root);
  assertStrictDoctorOk(binPath, root, "clean repo");

  fs.writeFileSync(path.join(root, "scratch.txt"), "dirty\n", "utf8");
  const dirtyStatus = parseJson(mdkg(binPath, ["status", "--json"], root));
  assert(dirtyStatus.ok === true, "dirty status should remain ok");
  assert(dirtyStatus.level === "warn", `expected dirty status warn, got ${dirtyStatus.level}`);
  assert(dirtyStatus.git.dirty === true, "dirty status should report git dirty");
  assert(dirtyStatus.git.untracked_count >= 1, "dirty status should count untracked files");
  assertStrictDoctorOk(binPath, root, "dirty repo");

  const goal = parseJson(mdkg(binPath, ["new", "goal", "operator health smoke goal", "--status", "todo", "--priority", "1", "--json"], root)).node;
  parseJson(mdkg(binPath, ["goal", "select", goal.id, "--json"], root));
  mdkg(binPath, ["index"], root);
  const selectedStatus = parseJson(mdkg(binPath, ["status", "--json"], root));
  assert(selectedStatus.goal.selected?.id === goal.id, "status should report selected goal");
  assert(selectedStatus.goal.selected_exists === true, "status should report selected goal exists");
  assertStrictDoctorOk(binPath, root, "selected goal");

  parseJson(mdkg(binPath, ["goal", "done", goal.id, "--json"], root));
  mdkg(binPath, ["index"], root);
  const achievedDoctor = mdkgMaybe(binPath, ["doctor", "--strict", "--json"], root);
  assert(achievedDoctor.status !== 0, "strict doctor should fail for achieved selected goal");
  const achievedPayload = parseJson(achievedDoctor.stdout);
  assert(achievedPayload.ok === false, "achieved selected goal payload should be failing");
  assert(
    achievedPayload.checks.some((check) => check.id === "goal.selected_achieved" && check.status === "fail"),
    "strict doctor should include goal.selected_achieved failure"
  );
  parseJson(mdkg(binPath, ["goal", "clear", "--json"], root));

  parseJson(mdkg(binPath, ["db", "init", "--json"], root));
  parseJson(mdkg(binPath, ["db", "migrate", "--json"], root));
  const dbVerify = parseJson(mdkg(binPath, ["db", "verify", "--json"], root));
  assert(dbVerify.ok === true, "db verify should be ok");
  mdkg(binPath, ["index"], root);
  const dbStatus = parseJson(mdkg(binPath, ["status", "--json"], root));
  assert(dbStatus.db.enabled === true, "status should report DB enabled");
  assert(dbStatus.db.ok === true, "status should report DB ok");
  assertStrictDoctorOk(binPath, root, "db enabled");

  mdkg(binPath, ["index"], root);
  const validation = parseJson(mdkg(binPath, ["validate", "--json"], root));
  assert(validation.ok === true, "final validate should be ok");

  console.log(
    JSON.stringify(
      {
        action: "smoke-operator-health",
        ok: true,
        temp_root: tempRoot,
        tarball: tarballPath,
      },
      null,
      2
    )
  );
}

main();
