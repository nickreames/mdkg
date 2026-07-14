import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
const { withMutationLock } = require("../../util/lock") as {
  withMutationLock<T>(root: string, timeoutMs: number, fn: () => T): T;
};

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function runCli(root: string, args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function runOk(root: string, args: string[]): string {
  const result = runCli(root, args);
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function runRejected(root: string, args: string[]): void {
  const result = runCli(root, args);
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  assert.match(`${result.stdout}\n${result.stderr}`, /symbolic link|linked ancestor|must stay within|unsafe/i);
}

function initAgent(prefix: string): string {
  const root = makeTempDir(prefix);
  runOk(root, ["init", "--agent"]);
  return root;
}

function gitOk(root: string, args: string[]): string {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function createGitSource(root: string, relativePath: string): string {
  const source = path.join(root, relativePath);
  fs.mkdirSync(source, { recursive: true });
  runOk(source, ["init", "--agent"]);
  gitOk(source, ["init", "-q"]);
  gitOk(source, ["config", "user.email", "security@example.test"]);
  gitOk(source, ["config", "user.name", "security test"]);
  gitOk(source, ["add", "."]);
  gitOk(source, ["commit", "-q", "-m", "fixture"]);
  return source;
}

function addSubgraphFixture(root: string, alias = "child"): { child: string; bundle: string } {
  const child = createGitSource(root, `projects/${alias}`);
  const receipt = JSON.parse(runOk(child, ["bundle", "create", "--profile", "private", "--json"]));
  const bundle = path.relative(root, path.join(child, receipt.path)).split(path.sep).join("/");
  runOk(root, ["subgraph", "add", alias, bundle, "--source-path", `projects/${alias}`, "--json"]);
  return { child, bundle };
}

function linkOrSkip(t: { skip(message?: string): void }, target: string, link: string, type: "file" | "dir"): boolean {
  try {
    fs.symlinkSync(target, link, type);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      t.skip("symbolic links unavailable");
      return false;
    }
    throw error;
  }
}

test("cand-review-002-004 archive add rejects a linked archive destination", (t) => {
  const root = initAgent("mdkg-security-archive-add-");
  const outside = makeTempDir("mdkg-security-archive-add-outside-");
  writeFile(path.join(root, "input.txt"), "input\n");
  writeFile(path.join(outside, "sentinel.txt"), "outside\n");
  fs.rmSync(path.join(root, ".mdkg", "archive"), { recursive: true, force: true });
  if (!linkOrSkip(t, outside, path.join(root, ".mdkg", "archive"), "dir")) return;

  runRejected(root, ["archive", "add", "input.txt", "--id", "archive.input", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), ["sentinel.txt"]);
});

test("cand-review-002-003 graph import rejects invalid frontmatter identity before path construction", () => {
  const root = initAgent("mdkg-security-graph-import-");
  const source = path.join(root, "template", ".mdkg", "work");
  writeFile(
    path.join(source, "task.md"),
    [
      "---",
      "id: ../../outside/pwn",
      "type: task",
      "title: hostile identity",
      "status: todo",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-07-12",
      "updated: 2026-07-12",
      "---",
    ].join("\n")
  );
  fs.copyFileSync(path.join(root, ".mdkg", "config.json"), path.join(root, "template", ".mdkg", "config.json"));

  const result = runCli(root, ["graph", "import-template", "template", "--apply", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /invalid|canonical|portable|id must match/i);
  assert.equal(fs.existsSync(path.join(root, "outside", "pwn.md")), false);
});

test("cand-review-002-005 archive compress rejects a linked cached source", (t) => {
  const root = initAgent("mdkg-security-archive-compress-");
  const outside = makeTempDir("mdkg-security-archive-compress-outside-");
  writeFile(path.join(root, "input.txt"), "input\n");
  runOk(root, ["archive", "add", "input.txt", "--id", "archive.input", "--json"]);
  const sourceDir = path.join(root, ".mdkg", "archive", "archive.input", "source");
  fs.rmSync(sourceDir, { recursive: true, force: true });
  writeFile(path.join(outside, "input.txt"), "outside secret\n");
  if (!linkOrSkip(t, outside, sourceDir, "dir")) return;

  runRejected(root, ["archive", "compress", "archive.input", "--json"]);
  assert.equal(fs.readFileSync(path.join(outside, "input.txt"), "utf8"), "outside secret\n");
});

test("cand-review-002-006 bundle create rejects a linked default output directory", (t) => {
  const root = initAgent("mdkg-security-bundle-");
  const outside = makeTempDir("mdkg-security-bundle-outside-");
  fs.rmSync(path.join(root, ".mdkg", "bundles"), { recursive: true, force: true });
  if (!linkOrSkip(t, outside, path.join(root, ".mdkg", "bundles"), "dir")) return;

  runRejected(root, ["bundle", "create", "--profile", "private", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("cand-review-005-003 git clone rejects linked target ancestry", (t) => {
  const root = initAgent("mdkg-security-git-clone-");
  createGitSource(root, "source");
  const outside = makeTempDir("mdkg-security-git-clone-outside-");
  if (!linkOrSkip(t, outside, path.join(root, "clones"), "dir")) return;

  runRejected(root, ["git", "clone", "source", "--target", "clones/source", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("cand-review-005-004 git closeout rejects linked receipt ancestry", (t) => {
  const root = initAgent("mdkg-security-git-closeout-");
  const outside = makeTempDir("mdkg-security-git-closeout-outside-");
  gitOk(root, ["init", "-q"]);
  gitOk(root, ["config", "user.email", "security@example.test"]);
  gitOk(root, ["config", "user.name", "security test"]);
  fs.mkdirSync(path.join(root, ".mdkg", "git"), { recursive: true });
  if (!linkOrSkip(t, outside, path.join(root, ".mdkg", "git", "closeouts"), "dir")) return;

  runRejected(root, ["git", "closeout", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("cand-review-005-006 mutation lock timeout withholds a linked owner body", (t) => {
  const root = initAgent("mdkg-security-lock-");
  const outside = makeTempDir("mdkg-security-lock-outside-");
  const lockDir = path.join(root, ".mdkg", "index", "write.lock");
  fs.mkdirSync(lockDir, { recursive: true });
  const secret = path.join(outside, "owner.json");
  writeFile(secret, "DO_NOT_EXPOSE_LOCK_OWNER\n");
  if (!linkOrSkip(t, secret, path.join(lockDir, "owner.json"), "file")) return;

  assert.throws(
    () => withMutationLock(root, 1, () => undefined),
    (error: unknown) => {
      const message = String((error as Error).message);
      assert.match(message, /owner details withheld/);
      assert.doesNotMatch(message, /DO_NOT_EXPOSE_LOCK_OWNER/);
      return true;
    }
  );
});

test("cand-review-004-001 new rejects a linked local template without exposing its body", (t) => {
  const root = initAgent("mdkg-security-template-");
  const outside = makeTempDir("mdkg-security-template-outside-");
  const template = path.join(root, ".mdkg", "templates", "default", "task.md");
  const secret = path.join(outside, "secret.md");
  writeFile(secret, "DO_NOT_EXPOSE_TEMPLATE_SECRET\n");
  fs.rmSync(template);
  if (!linkOrSkip(t, secret, template, "file")) return;

  const result = runCli(root, ["new", "task", "unsafe"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link|task not found/i);
  assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /DO_NOT_EXPOSE_TEMPLATE_SECRET/);
});

test("review-003-cand-003 subgraph sync rejects linked source and bundle-output ancestry", (t) => {
  const root = initAgent("mdkg-security-subgraph-sync-");
  const { child } = addSubgraphFixture(root);
  const outsideSource = makeTempDir("mdkg-security-subgraph-source-");
  fs.renameSync(child, path.join(outsideSource, "child"));
  if (!linkOrSkip(t, path.join(outsideSource, "child"), child, "dir")) return;

  runRejected(root, ["subgraph", "sync", "child", "--json"]);
  fs.rmSync(child);
  fs.renameSync(path.join(outsideSource, "child"), child);

  const outsideOutput = makeTempDir("mdkg-security-subgraph-output-");
  const bundleDir = path.join(child, ".mdkg", "bundles", "private");
  fs.rmSync(bundleDir, { recursive: true, force: true });
  if (!linkOrSkip(t, outsideOutput, bundleDir, "dir")) return;
  runRejected(root, ["subgraph", "sync", "child", "--json"]);
  assert.deepEqual(fs.readdirSync(outsideOutput), []);
});

test("review-003-cand-004 subgraph materialize rejects linked target ancestry", (t) => {
  const root = initAgent("mdkg-security-subgraph-materialize-");
  addSubgraphFixture(root);
  const outside = makeTempDir("mdkg-security-subgraph-materialize-outside-");
  if (!linkOrSkip(t, outside, path.join(root, "materialized"), "dir")) return;

  runRejected(root, ["subgraph", "materialize", "child", "--target", "materialized", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("review-003-cand-005 init rejects a linked managed destination", (t) => {
  const root = makeTempDir("mdkg-security-init-");
  const outside = makeTempDir("mdkg-security-init-outside-");
  const sentinel = path.join(outside, "AGENT_START.md");
  writeFile(sentinel, "outside\n");
  if (!linkOrSkip(t, sentinel, path.join(root, "AGENT_START.md"), "file")) return;

  runRejected(root, ["init", "--agent", "--json"]);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "outside\n");
});

test("review-003-cand-006 upgrade rejects linked managed template ancestry", (t) => {
  const root = initAgent("mdkg-security-upgrade-");
  const outside = makeTempDir("mdkg-security-upgrade-outside-");
  const loopsDir = path.join(root, ".mdkg", "templates", "loops");
  fs.rmSync(loopsDir, { recursive: true, force: true });
  if (!linkOrSkip(t, outside, loopsDir, "dir")) return;

  runRejected(root, ["upgrade", "--apply", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("review-003-cand-008 fix apply rejects linked workspace rewrite targets", (t) => {
  const root = initAgent("mdkg-security-fix-");
  const outside = makeTempDir("mdkg-security-fix-outside-");
  const canonical = JSON.parse(runOk(root, ["new", "task", "canonical", "--json"]));
  const duplicatePath = path.join(root, ".mdkg", "work", "task-copy.md");
  const outsideNode = path.join(outside, "task-copy.md");
  fs.copyFileSync(path.join(root, canonical.node.path), outsideNode);
  if (!linkOrSkip(t, outsideNode, duplicatePath, "file")) return;

  const before = fs.readFileSync(outsideNode, "utf8");
  const result = runCli(root, ["fix", "apply", "--family", "ids", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link|linked ancestor|no supported ids-family changes/i);
  assert.equal(fs.readFileSync(outsideNode, "utf8"), before);
});

test("cand-review-010-004 handoff create rejects linked output ancestry", (t) => {
  const root = initAgent("mdkg-security-handoff-");
  const outside = makeTempDir("mdkg-security-handoff-outside-");
  runOk(root, ["new", "goal", "handoff goal", "--json"]);
  if (!linkOrSkip(t, outside, path.join(root, "handoffs"), "dir")) return;

  runRejected(root, ["handoff", "create", "goal-1", "--out", "handoffs/out.md", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("cand-review-012-001 loop fork rejects linked work ancestry", (t) => {
  const root = initAgent("mdkg-security-loop-work-");
  const outside = makeTempDir("mdkg-security-loop-work-outside-");
  fs.rmSync(path.join(root, ".mdkg", "work"), { recursive: true, force: true });
  if (!linkOrSkip(t, outside, path.join(root, ".mdkg", "work"), "dir")) return;

  runRejected(root, ["loop", "fork", "security-audit", "--scope", ".", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("cand-review-012-002 skill new rejects linked skill ancestry", (t) => {
  const root = initAgent("mdkg-security-skill-new-");
  const outside = makeTempDir("mdkg-security-skill-new-outside-");
  fs.rmSync(path.join(root, ".mdkg", "skills"), { recursive: true, force: true });
  if (!linkOrSkip(t, outside, path.join(root, ".mdkg", "skills"), "dir")) return;

  runRejected(root, ["skill", "new", "unsafe", "unsafe", "--description", "unsafe skill", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("cand-review-012-003 loop fork rejects a linked seed template", (t) => {
  const root = initAgent("mdkg-security-loop-seed-");
  const outside = makeTempDir("mdkg-security-loop-seed-outside-");
  const seed = path.join(root, ".mdkg", "templates", "loops", "security-audit.loop.md");
  const secret = path.join(outside, "security-audit.loop.md");
  writeFile(secret, "DO_NOT_EXPOSE_LOOP_SECRET\n");
  fs.rmSync(seed);
  if (!linkOrSkip(t, secret, seed, "file")) return;

  const result = runCli(root, ["loop", "fork", "security-audit", "--scope", ".", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link/i);
  assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /DO_NOT_EXPOSE_LOOP_SECRET/);
});

test("cand-review-012-004 skill show rejects a linked SKILL.md body", (t) => {
  const root = initAgent("mdkg-security-skill-show-");
  const outside = makeTempDir("mdkg-security-skill-show-outside-");
  runOk(root, ["skill", "new", "review", "review", "--description", "review code", "--json"]);
  const skillFile = path.join(root, ".mdkg", "skills", "review", "SKILL.md");
  const secret = path.join(outside, "SKILL.md");
  writeFile(secret, "DO_NOT_EXPOSE_SKILL_SECRET\n");
  fs.rmSync(skillFile);
  if (!linkOrSkip(t, secret, skillFile, "file")) return;

  const result = runCli(root, ["skill", "show", "review", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link/i);
  assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /DO_NOT_EXPOSE_SKILL_SECRET/);
});

test("cand-review-011-001 task lifecycle rejects a linked node body", (t) => {
  const root = initAgent("mdkg-security-task-");
  const outside = makeTempDir("mdkg-security-task-outside-");
  const created = JSON.parse(runOk(root, ["new", "task", "linked task", "--json"]));
  const nodePath = path.join(root, created.node.path);
  const secret = path.join(outside, "task.md");
  writeFile(secret, "DO_NOT_EXPOSE_TASK_SECRET\n");
  fs.rmSync(nodePath);
  if (!linkOrSkip(t, secret, nodePath, "file")) return;

  const result = runCli(root, ["task", "start", "task-1", "--json"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link|task not found/i);
  assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /DO_NOT_EXPOSE_TASK_SECRET/);
});

test("cand-review-011-002 event append rejects a linked final log", (t) => {
  const root = initAgent("mdkg-security-event-final-");
  const outside = makeTempDir("mdkg-security-event-final-outside-");
  const eventFile = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  const outsideFile = path.join(outside, "events.jsonl");
  writeFile(outsideFile, "outside\n");
  fs.rmSync(eventFile);
  if (!linkOrSkip(t, outsideFile, eventFile, "file")) return;

  runRejected(root, ["event", "append", "--kind", "RUN_COMPLETED", "--status", "ok", "--refs", "task-1", "--json"]);
  assert.equal(fs.readFileSync(outsideFile, "utf8"), "outside\n");
});

test("cand-review-011-002 event append rejects linked log ancestry", (t) => {
  const root = initAgent("mdkg-security-event-ancestor-");
  const outside = makeTempDir("mdkg-security-event-ancestor-outside-");
  const eventsDir = path.join(root, ".mdkg", "work", "events");
  fs.rmSync(eventsDir, { recursive: true, force: true });
  if (!linkOrSkip(t, outside, eventsDir, "dir")) return;

  runRejected(root, ["event", "enable", "--json"]);
  assert.deepEqual(fs.readdirSync(outside), []);
});
