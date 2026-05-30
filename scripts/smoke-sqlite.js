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
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-sqlite-smoke-"));
  const binPath = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  assert(config.index.backend === "sqlite", "fresh init did not default to sqlite backend");
  assert(config.index.sqlite_path === ".mdkg/index/mdkg.sqlite", "fresh init missing sqlite_path");

  const sqlitePath = path.join(root, ".mdkg", "index", "mdkg.sqlite");
  mdkg(binPath, ["index"], root);
  assertExists(sqlitePath);
  const ignored = runRaw(GIT_CMD, ["check-ignore", ".mdkg/index/mdkg.sqlite"], { cwd: root });
  assert(ignored.status !== 0, "mdkg.sqlite should be commit-eligible");

  mdkg(binPath, ["doctor"], root);
  mdkg(binPath, ["validate"], root);
  mdkg(binPath, ["capability", "list", "--kind", "skill", "--json"], root);
  const created = JSON.parse(mdkg(binPath, ["new", "task", "sqlite smoke task", "--status", "todo", "--priority", "1", "--json"], root));
  mdkg(binPath, ["pack", created.node.id, "--profile", "concise", "--dry-run", "--stats"], root);

  fs.rmSync(sqlitePath, { force: true });
  assert(!fs.existsSync(sqlitePath), "failed to remove sqlite cache");
  mdkg(binPath, ["index"], root);
  assertExists(sqlitePath);
  mdkg(binPath, ["validate"], root);

  console.log("sqlite smoke passed");
}

main();
