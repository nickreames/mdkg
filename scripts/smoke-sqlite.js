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

function exerciseSmoke(tempRoot, installed) {
  const { binPath, tarballPath } = installed;
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  commands.git(["init", "-q"], root);

  mdkg(binPath, ["init", "--agent"], root);
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  assert(config.index.backend === "sqlite", "fresh init did not default to sqlite backend");
  assert(config.index.sqlite_path === ".mdkg/index/mdkg.sqlite", "fresh init missing sqlite_path");

  const sqlitePath = path.join(root, ".mdkg", "index", "mdkg.sqlite");
  mdkg(binPath, ["index"], root);
  assertExists(sqlitePath);
  const ignored = commands.git(["check-ignore", ".mdkg/index/mdkg.sqlite"], root, { allowFailure: true });
  assert(ignored.status === 1, "mdkg.sqlite should be commit-eligible");

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

  return { smoke: "sqlite", ok: true, temp_root: tempRoot, tarball: tarballPath };
}

function main() {
  const receipt = runInstalledSmoke({
    prefix: "mdkg-sqlite-smoke-",
    prepare: (root, ownedCommands) => { commands = ownedCommands; return prepareInstall(root); },
    exercise: exerciseSmoke,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error); process.exitCode = 1; }
}
