#!/usr/bin/env node

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { runInstalledSmoke } = require("./qualification-smoke");
const { acceptOwnedGitFixture } = require("./qualification-git");
const { runFixtureProcess, runFixtureNode } = require("./qualification-process");
const { qualifyGitObservation } = require("../tests/fixtures/git-observation.cjs");

const REMOVED = ["clone", "fetch", "push", "materialize", "closeout", "push-ready"];
const REMOVED_FLAGS = ["--remote", "--branch", "--message", "--request", "--stage-all"];
const repoRoot = path.resolve(__dirname, "..");
let tempRoot, commands, fixtureGit;

function result(command, args, cwd, extraEnv = {}) {
  assert.equal(command, process.execPath, "fault probes must execute the selected Node runtime");
  // The base is isolated first; only this trusted fixture's explicit hostile
  // PATH/optional-lock values bypass ordinary smoke-command sanitization.
  return runFixtureNode(tempRoot, args[0], args.slice(1), {
    cwd, env: { ...commands.environment, ...extraEnv }, timeout: 120000, maxBuffer: 16 * 1024 * 1024,
  });
}
function run(command, args, cwd) {
  let r;
  if (command === "git") r = fixtureGit.run(cwd, args);
  else if (command === process.execPath) r = commands.node(args[0], args.slice(1), cwd);
  else if (command === "which") r = runFixtureProcess(tempRoot, command, args, { cwd, env: commands.environment, timeout: 30000 });
  else throw new Error("unsupported fixture command");
  assert.equal(r.status, 0, `${command} ${args.join(" ")}\n${r.stdout}\n${r.stderr}`);
  return r.stdout.trim();
}
function gitConfig(cwd, args) {
  // Deliberately hostile metadata is test input, never fixture setup authority.
  // Bind the already admitted repository before this explicit local-file edit.
  const binding = fixtureGit.describe(cwd);
  const r = runFixtureProcess(tempRoot, "git", ["--no-optional-locks",
    "-c", "core.fsmonitor=false", ...binding.prefix, "config", "--local", "--no-includes", ...args], {
    cwd, env: commands.environment, timeout: 30000,
  });
  assert.equal(r.status, 0, r.stderr);
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

function prepareInstall(root, ownedCommands) {
  tempRoot = root; commands = ownedCommands;
  fixtureGit = acceptOwnedGitFixture(root, commands.environment);
  const packDir = path.join(tempRoot, "pack"); fs.mkdirSync(packDir);
  // The release ladder's npm proxy supplies its one immutable artifact here.
  // Standalone use packs already-built inputs; publication gates run separately.
  const packOutput = commands.npm(["pack", repoRoot, "--silent", "--ignore-scripts", "--dry-run=false", "--pack-destination", packDir], { cwd: tempRoot }).stdout;
  const name = packOutput.split(/\r?\n/).filter(Boolean).pop();
  assert(name, "npm pack must identify the candidate");
  const tarball = path.join(packDir, path.basename(name));
  const prefix = path.join(tempRoot, "prefix");
  return { tarballPath: tarball, install() {
    commands.npm(["install", "--global", "--ignore-scripts", "--offline", "--prefix", prefix, tarball], { cwd: tempRoot });
    const packageRoot = [path.join(prefix, "lib/node_modules/mdkg"), path.join(prefix, "node_modules/mdkg")].find(p => fs.existsSync(p));
    assert(packageRoot, "installed package must exist");
    return { packageRoot, tarball };
  } };
}

function exerciseBoundary(root, { packageRoot, tarball }) {
  assert.equal(root, tempRoot);
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
  run("git", ["commit", "-q", "-m", "fixture"], consumer);
  gitConfig(consumer, ["remote.origin.url", "https://user:fixture-secret@example.invalid/project.git"]);
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
  gitConfig(consumer, ["--remove-section", "remote.origin"]);
  assert.equal(JSON.parse(inspectUnchanged().stdout).source_descriptor.remote, null);
  gitConfig(consumer, ["remote.upstream.url", "https://user:password-marker@example.invalid/repo?ToKeN=query-marker&%74oken=encoded-marker#fragment-marker"]);
  gitConfig(consumer, ["remote.upstream.pushurl", "ssh://git@example.invalid:2222/repo?arbitrary=push-marker#push-fragment"]);
  const descriptors = inspectUnchanged();
  assert.doesNotMatch(descriptors.stdout, /password-marker|query-marker|encoded-marker|fragment-marker|push-marker|push-fragment/);
  assert.equal(JSON.parse(descriptors.stdout).source_descriptor.remote, "upstream");
  assert.equal(JSON.parse(descriptors.stdout).source_descriptor.repository_ref, JSON.parse(descriptors.stdout).remotes[0].fetch_url);
  assert.doesNotMatch(run(process.execPath, [cli, "git", "inspect"], consumer), /password-marker|query-marker|encoded-marker|fragment-marker/);
  gitConfig(consumer, ["remote.upstream.url", "fixture_helper::opaque-helper-marker"]);
  assert.doesNotMatch(inspectUnchanged().stdout, /opaque-helper-marker/);
  gitConfig(consumer, ["remote.upstream.url", "https://example.invalid/repo%3Fname%23part"]);
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
    gitConfig(consumer, ["core.fsmonitor", hook]);
    gitConfig(consumer, ["core.fsmonitorHookVersion", "2"]);
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
      const r = inspectUnchanged({ PATH: shimDir + path.delimiter + commands.environment.PATH }, 2);
      assert.doesNotMatch(r.stdout + r.stderr, /RAW_HELPER_MARKER|"clean": true/);
      assert.match(r.stderr, /Git status observation failed/);
    }

    const filterMarker = path.join(consumer, ".git/filter-called");
    const filterScript = path.join(consumer, ".git/filter.cjs");
    fs.writeFileSync(filterScript, `require('fs').writeFileSync(${JSON.stringify(filterMarker)},'called');process.stdin.pipe(process.stdout);`);
    gitConfig(consumer, ["filter.fixture.clean", `${JSON.stringify(process.execPath)} ${JSON.stringify(filterScript)}`]);
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
  const trapEnv = { PATH: `${trap}${path.delimiter}${commands.environment.PATH || ""}` };
  const beforeRefusals = inventory(tempRoot);
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
  assert.deepEqual(inventory(tempRoot), beforeRefusals, "refused operations must preserve every fixture path");
  const help = run(process.execPath, [cli, "help", "git"], consumer);
  assert(help.includes("mdkg git inspect"));
  assert(!/mdkg git (clone|fetch|push|materialize|closeout)/.test(help));
  // The shared matrix controls optional-lock inputs explicitly: native setup
  // is guarded, while installed observations receive unset and hostile policies.
  const observation = qualifyGitObservation({ cli, tempRoot });
  return { schema: "mdkg.git-boundary-smoke.v1", ok: true, version: pkg.version, node: process.version, removed_commands: REMOVED, refused_invocations: refusals, retained_inspect: true, inspection_cases: inspectionCases, fsmonitor_and_failure_injection: supportedHookFixture ? "passed" : "unverified", fixture_bytes_preserved: true, git_observation: observation, external_actions: "none", tarball_sha256: crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex") };
}

function runSmoke() {
  return runInstalledSmoke({ prefix: "mdkg-git-boundary-", prepare: prepareInstall, exercise: exerciseBoundary });
}
if (require.main === module) {
  try { console.log(JSON.stringify(runSmoke())); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
module.exports = { runSmoke };
