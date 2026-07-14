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
const { runGitFetchCommand, runGitCloneCommand, runGitPushReadyCommand } = require("../../commands/git");

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

test("git inspect reports sanitized source descriptor and accepted revision", () => {
  const root = makeMdkgRoot("mdkg-git-inspect-");
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

test("git clone and fetch use system Git with external auth refs", () => {
  const root = makeMdkgRoot("mdkg-git-clone-root-");
  const source = path.join(root, "source");
  fs.mkdirSync(source, { recursive: true });
  writeRootConfig(source);
  writeDefaultTemplates(source);
  writeTask(source, "source task");
  initGitRepo(source);
  commitAll(source, "source initial");

  const clone = json<{
    action: string;
    ok: boolean;
    repository_ref: string;
    target: string;
    accepted_revision: { commit_sha: string };
    inspect: { source_descriptor: { access_ref: string } };
  }>(
    runCliOk(root, ["git", "clone", "source", "--target", "clones/source", "--json"]).stdout
  );

  assert.equal(clone.action, "git.clone");
  assert.equal(clone.ok, true);
  assert.equal(clone.repository_ref, "source");
  assert.equal(clone.target, "clones/source");
  assert.match(clone.accepted_revision.commit_sha, /^[0-9a-f]{40}$/);
  assert.equal(clone.inspect.source_descriptor.access_ref, "external-git-auth");

  const clonedRoot = path.join(root, "clones", "source");
  const fetch = json<{ action: string; ok: boolean; remote: string; inspect: { status: { clean: boolean } } }>(
    runCliOk(clonedRoot, ["git", "fetch", "--remote", "origin", "--json"]).stdout
  );
  assert.equal(fetch.action, "git.fetch");
  assert.equal(fetch.ok, true);
  assert.equal(fetch.remote, "origin");
  assert.equal(fetch.inspect.status.clean, true);
});

test("git closeout seals DB state and writes static JSON and Markdown receipts", () => {
  const root = makeMdkgRoot("mdkg-git-closeout-");
  initGitRepo(root);
  runCliOk(root, ["db", "init", "--json"]);
  runCliOk(root, ["db", "migrate", "--json"]);

  const receipt = json<{
    action: string;
    ok: boolean;
    db_participated: boolean;
    db_snapshot_seal: { snapshot: string; manifest: string; new_snapshot_sha256: string };
    db_snapshot_dump: { output: string; sha256: string };
    static_receipts: { json: string; markdown: string };
    validation: { ok: boolean };
  }>(runCliOk(root, ["git", "closeout", "--json"]).stdout);

  assert.equal(receipt.action, "git.closeout");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.validation.ok, true);
  assert.equal(receipt.db_participated, true);
  assert.match(receipt.db_snapshot_seal.new_snapshot_sha256, /^sha256:/);
  for (const relativePath of [
    receipt.db_snapshot_seal.snapshot,
    receipt.db_snapshot_seal.manifest,
    receipt.db_snapshot_dump.output,
    receipt.static_receipts.json,
    receipt.static_receipts.markdown,
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
});

test("git push-ready blocks embedded remote credentials without leaking them", () => {
  const root = makeMdkgRoot("mdkg-git-push-ready-creds-");
  initGitRepo(root);
  git(root, ["remote", "add", "origin", "https://user:secret@example.com/acme/demo.git"]);
  commitAll(root, "initial");

  const result = runCli(root, ["git", "push-ready", "--remote", "origin", "--branch", "main", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /git.push_ready/);
  assert.match(result.stdout, /<redacted>/);
  assert.doesNotMatch(result.stdout, /secret/);
  assert.doesNotMatch(result.stderr, /secret/);
});

test("git fetch blocks configured remotes with embedded credentials before invoking Git", () => {
  const root = makeMdkgRoot("mdkg-git-fetch-creds-");
  initGitRepo(root);
  git(root, ["remote", "add", "origin", "https://user:secret@example.com/acme/demo.git"]);
  commitAll(root, "initial");

  const result = runCli(root, ["git", "fetch", "--remote", "origin", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /external Git auth/);
  assert.doesNotMatch(result.stdout, /secret/);
  assert.doesNotMatch(result.stderr, /secret/);
});

test("git commands reject option-like remote repository and branch operands", () => {
  const root = makeMdkgRoot("mdkg-git-operands-");
  initGitRepo(root);
  commitAll(root, "initial");

  assert.throws(
    () => runGitFetchCommand({ root, remote: "--all", json: true }),
    /non-option Git operand/
  );
  assert.throws(
    () => runGitFetchCommand({ root, remote: "origin", branch: "--prune", json: true }),
    /non-option Git operand/
  );
  assert.throws(
    () => runGitCloneCommand({ root, repository: "--upload-pack=fixture", target: "clone-target", json: true }),
    /non-option Git operand/
  );
  assert.throws(
    () => runGitPushReadyCommand({ root, remote: "--all", branch: "main", json: true }),
    /non-option Git operand/
  );
});

test("git push --stage-all writes closeout evidence, commits, and pushes to a local bare remote", () => {
  const root = makeMdkgRoot("mdkg-git-push-");
  initGitRepo(root);
  commitAll(root, "initial");
  const remote = makeTempDir("mdkg-git-remote-");
  fs.rmSync(remote, { recursive: true, force: true });
  git(path.dirname(remote), ["init", "-q", "--bare", remote]);
  git(root, ["remote", "add", "origin", remote]);

  fs.appendFileSync(path.join(root, ".mdkg", "work", "task-1-git-fixture-task.md"), "\nPush proof update.\n", "utf8");

  const receipt = json<{
    action: string;
    ok: boolean;
    stage_all: boolean;
    closeout: { static_receipts: { json: string; markdown: string }; db_participated: boolean };
    commit: { created: boolean; sha: string };
    push_ready: { ok: boolean };
    pushed_ref: string;
  }>(
    runCliOk(root, [
      "git",
      "push",
      "--remote",
      "origin",
      "--branch",
      "main",
      "--stage-all",
      "--message",
      "checkpoint",
      "--json",
    ]).stdout
  );

  assert.equal(receipt.action, "git.push");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.stage_all, true);
  assert.equal(receipt.closeout.db_participated, false);
  assert.equal(receipt.commit.created, true);
  assert.match(receipt.commit.sha, /^[0-9a-f]{40}$/);
  assert.equal(receipt.push_ready.ok, true);
  assert.equal(receipt.pushed_ref, "refs/heads/main");
  assert.equal(fs.existsSync(path.join(root, receipt.closeout.static_receipts.json)), true);
  assert.equal(fs.existsSync(path.join(root, receipt.closeout.static_receipts.markdown)), true);

  const remoteHead = git(root, ["--git-dir", remote, "rev-parse", "refs/heads/main"]).stdout.trim();
  assert.equal(remoteHead, receipt.commit.sha);

  const ready = json<{ ok: boolean; failure_count: number }>(
    runCliOk(root, ["git", "push-ready", "--remote", "origin", "--branch", "main", "--json"]).stdout
  );
  assert.equal(ready.ok, true);
  assert.equal(ready.failure_count, 0);
});
