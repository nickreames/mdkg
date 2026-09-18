import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function runCli(root: string, args: string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function runCliOk(root: string, args: string[]): SpawnSyncReturns<string> {
  const result = runCli(root, args);
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function git(root: string, args: string[]): SpawnSyncReturns<string> {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function json<T>(stdout: string): T {
  return JSON.parse(stdout) as T;
}

function writeTask(root: string, title = "git fixture task"): void {
  writeFile(
    path.join(root, ".mdkg", "work", "task-1-git-fixture-task.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      `title: ${title}`,
      "status: todo",
      "priority: 1",
      "tags: [git]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-07-05",
      "updated: 2026-07-05",
      "---",
      "",
      "# Overview",
      "",
      "Git fixture.",
      "",
      "# Acceptance Criteria",
      "",
      "- Validates.",
      "",
      "# Test Plan",
      "",
      "- Run focused git command tests.",
    ].join("\n")
  );
}

function makeMdkgRoot(prefix: string): string {
  const root = makeTempDir(prefix);
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  runCliOk(root, ["index"]);
  return root;
}

function initGitRepo(root: string): void {
  git(root, ["init", "-q", "-b", "main"]);
  git(root, ["config", "user.email", "agent@example.com"]);
  git(root, ["config", "user.name", "mdkg test"]);
}

function commitAll(root: string, message: string): void {
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", message]);
}

test("git inspect reports sanitized source descriptor and accepted revision", (t) => {
  const root = makeMdkgRoot("mdkg-git-inspect-");
  t.after(() => fs.rmSync(root, {recursive:true,force:true}));
  initGitRepo(root);
  git(root, ["remote", "add", "origin", "https://user:secret@example.com/acme/demo.git"]);
  commitAll(root, "initial");

  const result = runCliOk(root, ["git", "inspect", "--json"]);
  const payload = json<{
    action: string;
    ok: boolean;
    source_descriptor: { repository_ref: string; access_ref: string };
    accepted_revision: { commit_sha: string; tree_hash: string; branch: string };
    status: { clean: boolean };
  }>(result.stdout);

  assert.equal(payload.action, "git.inspect");
  assert.equal(payload.ok, true);
  assert.equal(payload.status.clean, true);
  assert.equal(payload.accepted_revision.branch, "main");
  assert.match(payload.accepted_revision.commit_sha, /^[0-9a-f]{40}$/);
  assert.match(payload.accepted_revision.tree_hash, /^[0-9a-f]{40}$/);
  assert.equal(payload.source_descriptor.access_ref, "external-git-auth");
  assert.match(payload.source_descriptor.repository_ref, /<redacted>/);
  assert.doesNotMatch(result.stdout, /secret/);
});


test("git inspect preserves the Git index after worktree timestamps change", (t) => {
  const root = makeMdkgRoot("mdkg-git-observational-");
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  initGitRepo(root); commitAll(root, "base");
  const index = path.join(root, git(root, ["rev-parse", "--git-path", "index"]).stdout.trim());
  const before = fs.readFileSync(index);
  const task = path.join(root, ".mdkg/work/task-1-git-fixture-task.md");
  fs.utimesSync(task, new Date(), new Date(Date.now() + 2000));
  const result = runCliOk(root, ["git", "inspect", "--json"]);
  assert.equal(JSON.parse(result.stdout).status.clean, true);
  assert.deepEqual(fs.readFileSync(index), before);
});

for (const command of ["clone", "fetch", "push", "materialize", "closeout", "push-ready"]) {
  test(`removed git ${command} refuses before Git or auth subprocesses`, (t) => {
    const root = makeMdkgRoot("mdkg-git-removed-");
    t.after(() => fs.rmSync(root, {recursive:true, force:true}));
    const trap = path.join(root, "trap"); fs.mkdirSync(trap);
    const log = path.join(root, "called");
    for (const tool of ["git", "gh", "ssh"]) {
      fs.writeFileSync(path.join(trap, tool), "#!" + process.execPath + "\nrequire('fs').appendFileSync(" + JSON.stringify(log) + ", 'called');process.exit(87);\n", {mode:0o755});
    }
    const before = fs.readdirSync(root).sort();
    const result = spawnSync(process.execPath, [cliPath, "git", command, "--json"], {
      cwd:root, encoding:"utf8", env:{...process.env, PATH:trap + path.delimiter + process.env.PATH}
    });
    assert.equal(result.status, 1, result.stderr);
    assert.equal(result.stderr, `git ${command} does not support --json; no command effects attempted\n`);
    assert.equal(fs.existsSync(log), false);
    assert.deepEqual(fs.readdirSync(root).sort(), before);
  });
}
test("Git module and help expose inspection only", (t) => {
  const root = makeMdkgRoot("mdkg-git-help-");
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  assert.deepEqual(Object.keys(require("../../commands/git")), ["runGitInspectCommand"]);
  const help=runCliOk(root, ["help", "git"]).stdout;
  assert.match(help, /mdkg git inspect/);
  assert.doesNotMatch(help, /mdkg git (?:clone|fetch|push|materialize|closeout)/);
  for (const flag of ["--stage-all", "--message", "--remote", "--branch", "--request", "--target", "--queue-policy", "--out"]) {
    const result = runCli(root, ["git", "inspect", flag, ...(flag === "--stage-all" ? [] : ["fixture"])]);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, `git inspect does not support ${flag}; no command effects attempted\n`);
  }
});

test("git commands reject option-like remote repository and branch operands after removal", (t) => {
  // Preserve the historical regression linkage, but exercise removal rather
  // than claim that the deleted operand-validation implementation still runs.
  const root = makeMdkgRoot("mdkg-git-removed-operands-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const trap = path.join(root, "trap");
  fs.mkdirSync(trap);
  const marker = path.join(root, "called");
  fs.writeFileSync(path.join(trap, "git"), `#!${process.execPath}\nrequire('fs').writeFileSync(${JSON.stringify(marker)}, 'called');process.exit(87);\n`, { mode: 0o755 });
  for (const args of [
    ["git", "fetch", "--remote=--all"],
    ["git", "fetch", "--remote", "origin", "--branch=--prune"],
    ["git", "clone", "--upload-pack=fixture", "--target", "clone-target"],
    ["git", "push-ready", "--remote=--all", "--branch", "main"],
  ]) {
    const result = spawnSync(process.execPath, [cliPath, ...args], {
      cwd: root, encoding: "utf8", env: { ...process.env, PATH: trap + path.delimiter + process.env.PATH },
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /^git (?:fetch|clone|push-ready).* does not support --[\w-]+; no command effects attempted\n$/);
  }
  assert.equal(fs.existsSync(marker), false);
  assert.equal(fs.existsSync(path.join(root, "clone-target")), false);
});

test("removed Git help returns an ordinary usage error from both entrypoints", () => {
  const { runCli, runCliAsync } = require("../../cli");
  return (async () => {
    for (const entrypoint of [runCli, runCliAsync]) {
      for (const args of [["help", "git", "materialize"], ["git", "push", "--help"]]) {
        const errors: string[] = [];
        assert.equal(await entrypoint(args, { log: () => undefined, error: (value: string) => errors.push(value) }), 1);
        assert.deepEqual(errors, ["unknown git subcommand"]);
      }
    }
  })();
});
