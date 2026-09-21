#!/usr/bin/env node

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const REMOVED = ["clone", "fetch", "push", "materialize", "closeout", "push-ready"];
const REMOVED_FLAGS = ["--remote", "--branch", "--message", "--request", "--stage-all"];
const repoRoot = path.resolve(__dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir(), "mdkg-git-boundary-"));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const env = {
  ...process.env,
  NPM_CONFIG_CACHE: path.join(tempRoot, "npm-cache"),
  npm_config_cache: path.join(tempRoot, "npm-cache"),
  NPM_CONFIG_OFFLINE: "true", npm_config_offline: "true",
  NPM_CONFIG_AUDIT: "false", npm_config_audit: "false",
  NPM_CONFIG_FUND: "false", npm_config_fund: "false",
};

function result(command, args, cwd, extraEnv = {}) {
  return spawnSync(command, command === "git" ? ["-c", "core.fsmonitor=false", ...args] : args,
    { cwd, encoding: "utf8", env: { ...env, GIT_OPTIONAL_LOCKS: "0", ...extraEnv } });
}
function run(command, args, cwd) {
  const r = result(command, args, cwd);
  assert.equal(r.status, 0, `${command} ${args.join(" ")}\n${r.stdout}\n${r.stderr}`);
  return r.stdout.trim();
}
function inventory(root) {
  const rows = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      const relative = path.relative(root, file);
      const stat = fs.lstatSync(file);
      if (entry.isDirectory()) { rows.push([relative, "directory", stat.mode]); visit(file); }
      else if (entry.isSymbolicLink()) rows.push([relative, "link", fs.readlinkSync(file)]);
      else rows.push([relative, stat.mode, crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")]);
    }
  }
  visit(root);
  return rows;
}

try {
  const packDir = path.join(tempRoot, "pack"); fs.mkdirSync(packDir);
  // The release ladder's npm proxy supplies its one immutable artifact here.
  // Standalone use packs already-built inputs; publication gates run separately.
  const packOutput = run(npm, ["pack", "--silent", "--ignore-scripts", "--dry-run=false", "--pack-destination", packDir], repoRoot);
  const name = packOutput.split(/\r?\n/).filter(Boolean).pop();
  assert(name, "npm pack must identify the candidate");
  const tarball = path.join(packDir, path.basename(name));
  const prefix = path.join(tempRoot, "prefix");
  run(npm, ["install", "--global", "--ignore-scripts", "--prefix", prefix, tarball], tempRoot);
  const packageRoot = [path.join(prefix, "lib/node_modules/mdkg"), path.join(prefix, "node_modules/mdkg")].find(p => fs.existsSync(p));
  assert(packageRoot, "installed package must exist");
  const cli = path.join(packageRoot, "dist/cli.js");
  const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  assert.equal(Object.keys(pkg.dependencies || {}).length, 0);
  assert.equal(fs.existsSync(path.join(packageRoot, "dist/commands/git_materialize.js")), false);
  assert.equal(fs.existsSync(path.join(packageRoot, ".mdkg/artifacts")), false, "private extraction evidence must not ship");
  assert.deepEqual(Object.keys(require(path.join(packageRoot, "dist/commands/git.js"))), ["runGitInspectCommand"]);
  const contract = JSON.parse(fs.readFileSync(path.join(packageRoot, "dist/command-contract.json"), "utf8"));
  for (const key of ["git", "git inspect"]) {
    const command = contract.commands.find(c => c.key === key);
    assert.equal(command?.danger_level, "read-only");
    assert.deepEqual(command.write_paths, []);
    assert.equal(command.lock_policy, "none-read-only");
  }
  for (const command of REMOVED) assert(!contract.commands.some(c => c.key === `git ${command}`));

  const consumer = path.join(tempRoot, "consumer"); fs.mkdirSync(consumer);
  run("git", ["init", "-q", "-b", "main"], consumer);
  run("git", ["config", "user.name", "mdkg boundary fixture"], consumer);
  run("git", ["config", "user.email", "fixture@example.invalid"], consumer);
  run(process.execPath, [cli, "init", "--graph-only"], consumer);
  fs.writeFileSync(path.join(consumer, "README.md"), "# Offline fixture\n");
  run("git", ["add", "."], consumer);
  run("git", ["-c", "core.hooksPath=/dev/null", "commit", "-q", "-m", "fixture"], consumer);
  run("git", ["remote", "add", "origin", "https://user:fixture-secret@example.invalid/project.git"], consumer);
  const head = run("git", ["rev-parse", "HEAD"], consumer);
  const file = path.join(consumer, "README.md");
  fs.utimesSync(file, new Date(), new Date(Date.now() + 2000));
  const beforeInspect = inventory(consumer);
  const inspected = JSON.parse(run(process.execPath, [cli, "git", "inspect", "--json"], consumer));
  assert.equal(inspected.accepted_revision.commit_sha, head);
  assert.equal(inspected.status.clean, true);
  assert(!JSON.stringify(inspected).includes("fixture-secret"));
  assert.deepEqual(inventory(consumer), beforeInspect, "inspect must preserve all fixture and Git-index bytes");

  let inspectionCases = 1;
  function inspectUnchanged(extraEnv = {}, expectedStatus = 0) {
    const before = inventory(consumer);
    const r = result(process.execPath, [cli, "git", "inspect", "--json"], consumer, extraEnv);
    assert.equal(r.status, expectedStatus, r.stderr);
    assert.deepEqual(inventory(consumer), before, "inspection must preserve the complete fixture including the Git index");
    inspectionCases++;
    return r;
  }
  run("git", ["remote", "remove", "origin"], consumer);
  assert.equal(JSON.parse(inspectUnchanged().stdout).source_descriptor.remote, null);
  run("git", ["remote", "add", "upstream", "https://user:password-marker@example.invalid/repo?ToKeN=query-marker&%74oken=encoded-marker#fragment-marker"], consumer);
  run("git", ["remote", "set-url", "--push", "upstream", "ssh://git@example.invalid:2222/repo?arbitrary=push-marker#push-fragment"], consumer);
  const descriptors = inspectUnchanged();
  assert.doesNotMatch(descriptors.stdout, /password-marker|query-marker|encoded-marker|fragment-marker|push-marker|push-fragment/);
  assert.equal(JSON.parse(descriptors.stdout).source_descriptor.remote, "upstream");
  assert.equal(JSON.parse(descriptors.stdout).source_descriptor.repository_ref, JSON.parse(descriptors.stdout).remotes[0].fetch_url);
  assert.doesNotMatch(run(process.execPath, [cli, "git", "inspect"], consumer), /password-marker|query-marker|encoded-marker|fragment-marker/);
  run("git", ["remote", "set-url", "upstream", "fixture_helper::opaque-helper-marker"], consumer);
  assert.doesNotMatch(inspectUnchanged().stdout, /opaque-helper-marker/);
  run("git", ["remote", "set-url", "upstream", "https://example.invalid/repo%3Fname%23part"], consumer);
  assert.equal(JSON.parse(inspectUnchanged().stdout).remotes[0].fetch_url, "https://example.invalid/repo%3Fname%23part");

  fs.appendFileSync(file, "unstaged\n");
  assert.deepEqual(JSON.parse(inspectUnchanged().stdout).status.entries, [{ index: " ", worktree: "M", path: "README.md" }]);
  run("git", ["mv", "README.md", "renamed.md"], consumer);
  fs.appendFileSync(path.join(consumer, "renamed.md"), "unstaged after rename\n");
  const unusualNames = ["unicode-λ", ...(process.platform === "win32" ? [] : [" space ", "tab\tname", "line\nname", 'quote"name', "literal?token=value#part"])];
  for (const name of unusualNames) fs.writeFileSync(path.join(consumer, name), "untracked\n");
  const entries = JSON.parse(inspectUnchanged().stdout).status.entries;
  assert.deepEqual(entries.find(r => r.path === "renamed.md"), { index: "R", worktree: "M", path: "renamed.md", original_path: "README.md" });
  for (const name of unusualNames) assert.deepEqual(entries.find(r => r.path === name), { index: "?", worktree: "?", path: name });

  const supportedHookFixture = process.platform !== "win32";
  if (supportedHookFixture) {
    const helperMarker = path.join(consumer, ".git/fsmonitor-called");
    const hook = path.join(consumer, ".git/fsmonitor-fixture");
    fs.writeFileSync(hook, `#!${process.execPath}\nrequire('fs').writeFileSync(${JSON.stringify(helperMarker)},'called');process.stdout.write('fixture-token\\0');\n`, { mode: 0o755 });
    run("git", ["config", "core.fsmonitor", hook], consumer);
    run("git", ["config", "core.fsmonitorHookVersion", "2"], consumer);
    inspectUnchanged({ GIT_OPTIONAL_LOCKS: "1" });
    assert.equal(fs.existsSync(helperMarker), false, "inspection must not execute configured fsmonitor");

    const realGit = run("which", ["git"], consumer).split(/\r?\n/)[0];
    const shimDir = path.join(consumer, ".git/smoke-bin"); fs.mkdirSync(shimDir);
    for (const body of [
      "process.stderr.write('RAW_HELPER_MARKER');process.exit(77);",
      "process.stdout.write('x'.repeat(2*1024*1024));",
      "process.stdout.write(' M truncated');",
      "process.stdout.write('bad record\\0');",
      "process.stdout.write('R  incomplete\\0');",
      "process.stdout.write(Buffer.from([32,77,32,255,0]));",
    ]) {
      fs.writeFileSync(path.join(shimDir, "git"), `#!${process.execPath}\nconst args=process.argv.slice(2);if(args.includes('status')){${body}}else{const r=require('child_process').spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});process.exit(r.status ?? 1);}\n`, { mode: 0o755 });
      const r = inspectUnchanged({ PATH: shimDir + path.delimiter + env.PATH }, 2);
      assert.doesNotMatch(r.stdout + r.stderr, /RAW_HELPER_MARKER|"clean": true/);
      assert.match(r.stderr, /Git status observation failed/);
    }

    const filterMarker = path.join(consumer, ".git/filter-called");
    const filterScript = path.join(consumer, ".git/filter.cjs");
    fs.writeFileSync(filterScript, `require('fs').writeFileSync(${JSON.stringify(filterMarker)},'called');process.stdin.pipe(process.stdout);`);
    run("git", ["config", "filter.fixture.clean", `${JSON.stringify(process.execPath)} ${JSON.stringify(filterScript)}`], consumer);
    inspectUnchanged(); // An unused configured filter is not a blocker.
    fs.writeFileSync(path.join(consumer, ".gitattributes"), "renamed.md filter=fixture\n");
    const filtered = inspectUnchanged({}, 2);
    assert.match(filtered.stderr, /configured content filter.*refuses helper execution/);
    assert.equal(fs.existsSync(filterMarker), false);
  }

  const trap = path.join(tempRoot, "trap"); fs.mkdirSync(trap);
  const marker = path.join(tempRoot, "subprocess-called");
  for (const tool of ["git", "gh", "ssh"]) {
    const body = `#!${process.execPath}\nrequire('fs').appendFileSync(${JSON.stringify(marker)}, '${tool}\\n');process.exit(87);\n`;
    fs.writeFileSync(path.join(trap, tool), body, { mode: 0o755 });
    if (process.platform === "win32") {
      fs.writeFileSync(path.join(trap, `${tool}.cmd`), `@"${process.execPath}" "${path.join(trap, tool)}" %*\r\n`);
    }
  }
  const trapEnv = { PATH: `${trap}${path.delimiter}${env.PATH || ""}` };
  const beforeRefusals = inventory(consumer);
  let refusals = 0;
  for (const command of REMOVED) {
    for (const args of [["git", command, "--json"], ["git", command, "--request", "absent.json", "--stage-all"], ["help", "git", command]]) {
      assert.notEqual(result(process.execPath, [cli, ...args], consumer, trapEnv).status, 0, `${args.join(" ")} must refuse`);
      refusals++;
    }
  }
  for (const flag of [...REMOVED_FLAGS, "--target", "--queue-policy", "--out"]) {
    const args = [cli, "git", "inspect", flag, ...(flag === "--stage-all" ? [] : ["fixture"])];
    assert.equal(result(process.execPath, args, consumer, trapEnv).status, 1, `${flag} must refuse before inspection`);
    refusals++;
  }
  assert.equal(fs.existsSync(marker), false, "removed commands and flags must not invoke Git or auth tools");
  assert.deepEqual(inventory(consumer), beforeRefusals, "refused operations must preserve every fixture path");
  const help = run(process.execPath, [cli, "help", "git"], consumer);
  assert(help.includes("mdkg git inspect"));
  assert(!/mdkg git (clone|fetch|push|materialize|closeout)/.test(help));
  console.log(JSON.stringify({ schema: "mdkg.git-boundary-smoke.v1", ok: true, version: pkg.version, node: process.version, removed_commands: REMOVED, refused_invocations: refusals, retained_inspect: true, inspection_cases: inspectionCases, fsmonitor_and_failure_injection: supportedHookFixture ? "passed" : "unverified", fixture_bytes_preserved: true, external_actions: "none", tarball_sha256: crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex") }));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
