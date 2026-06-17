import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function json<T>(output: string): T {
  return JSON.parse(output) as T;
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    })
    .sort();
}

function hashTree(root: string): string {
  const hash = crypto.createHash("sha256");
  for (const file of listFiles(root)) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    hash.update(relative);
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function createSourceGraph(root: string, name: string): string {
  const source = path.join(root, name);
  fs.mkdirSync(source, { recursive: true });
  run(["init", "--agent"], source);
  run(["new", "goal", "demo start goal", "--status", "todo", "--priority", "1", "--json"], source);
  run(["new", "task", "demo implementation task", "--status", "todo", "--priority", "1", "--json"], source);
  run(["index"], source);
  return source;
}

function createLinkedTemplateGraph(root: string, name: string): string {
  const source = path.join(root, name);
  fs.mkdirSync(source, { recursive: true });
  run(["init", "--agent"], source);
  run(["new", "goal", "template start goal", "--status", "todo", "--priority", "1", "--json"], source);
  run([
    "new",
    "task",
    "template linked task",
    "--status",
    "todo",
    "--priority",
    "1",
    "--parent",
    "goal-1",
    "--refs",
    "goal-1",
    "--json",
  ], source);
  const taskPath = path.join(source, ".mdkg", "work", "task-1-template-linked-task.md");
  fs.appendFileSync(taskPath, "\nMentions root:goal-1 and task-1 for rewrite proof.\n", "utf8");
  run(["index"], source);
  return source;
}

test("graph clone preserves IDs from a bundle into an empty target", () => {
  const root = makeTempDir("mdkg-graph-clone-");
  run(["init", "--agent"], root);
  const source = createSourceGraph(root, "source");
  const bundle = json<{ path: string; bundle_hash: string }>(
    run(["bundle", "create", "--output", path.join(root, "source.mdkg.zip"), "--json"], source).stdout
  );

  const cloned = json<{
    action: string;
    ok: boolean;
    mode: string;
    target: string;
    preserved_ids: boolean;
    files_written: string[];
    skipped_paths: string[];
    source_hash: { bundle_hash: string };
    validation: { ok: boolean; error_count: number };
  }>(run(["graph", "clone", "source.mdkg.zip", "--target", "clones/demo", "--json"], root).stdout);

  assert.equal(cloned.action, "graph.clone");
  assert.equal(cloned.ok, true);
  assert.equal(cloned.mode, "clone");
  assert.equal(cloned.target, "clones/demo");
  assert.equal(cloned.preserved_ids, true);
  assert.equal(cloned.source_hash.bundle_hash, bundle.bundle_hash);
  assert.equal(cloned.validation.ok, true);
  assert.equal(cloned.validation.error_count, 0);
  assert.ok(cloned.files_written.includes(".mdkg/config.json"));
  assert.ok(cloned.skipped_paths.includes(".mdkg/index/global.json"));

  const target = path.join(root, "clones", "demo");
  run(["validate", "--json"], target);
  const goal = json<{ item: { id: string; title: string } }>(run(["show", "goal-1", "--json"], target).stdout);
  const task = json<{ item: { id: string; title: string } }>(run(["show", "task-1", "--json"], target).stdout);
  assert.equal(goal.item.id, "goal-1");
  assert.equal(goal.item.title, "demo start goal");
  assert.equal(task.item.id, "task-1");
  assert.equal(task.item.title, "demo implementation task");
});

test("graph fork preserves IDs from a directory and selects the requested start goal", () => {
  const root = makeTempDir("mdkg-graph-fork-");
  run(["init", "--agent"], root);
  const source = createSourceGraph(root, "templates/source");
  const beforeHash = hashTree(source);

  const forked = json<{
    action: string;
    ok: boolean;
    mode: string;
    target: string;
    preserved_ids: boolean;
    start_goal?: { requested: string; qid: string; path: string };
    selected_goal?: { qid: string; path: string };
    validation: { ok: boolean; error_count: number };
  }>(
    run([
      "graph",
      "fork",
      "templates/source",
      "--target",
      "forks/demo",
      "--start-goal",
      "goal-1",
      "--json",
    ], root).stdout
  );

  assert.equal(forked.action, "graph.fork");
  assert.equal(forked.ok, true);
  assert.equal(forked.mode, "fork");
  assert.equal(forked.target, "forks/demo");
  assert.equal(forked.preserved_ids, true);
  assert.equal(forked.start_goal?.requested, "goal-1");
  assert.equal(forked.start_goal?.qid, "root:goal-1");
  assert.match(forked.start_goal?.path ?? "", /\.mdkg\/work\/goal-1-demo-start-goal\.md$/);
  assert.equal(forked.selected_goal?.qid, "root:goal-1");
  assert.equal(forked.validation.ok, true);
  assert.equal(forked.validation.error_count, 0);
  assert.equal(hashTree(source), beforeHash, "source directory changed during graph fork");

  const target = path.join(root, "forks", "demo");
  const current = json<{ goal: { id: string; qid: string } }>(run(["goal", "current", "--json"], target).stdout);
  assert.equal(current.goal.id, "goal-1");
  assert.equal(current.goal.qid, "root:goal-1");
  run(["validate", "--json"], target);
});

test("graph clone refuses unsafe targets and live-source self nesting", () => {
  const root = makeTempDir("mdkg-graph-safety-");
  run(["init", "--agent"], root);
  createSourceGraph(root, "source");

  const parentTarget = runFailure(["graph", "clone", "source", "--target", "../outside", "--json"], root);
  assert.equal(parentTarget.status, 1);
  assert.match(parentTarget.stderr, /--target cannot contain parent-directory components/);

  const nestedTarget = runFailure(["graph", "clone", "source", "--target", "source/clone", "--json"], root);
  assert.equal(nestedTarget.status, 1);
  assert.match(nestedTarget.stderr, /target must not be inside the live directory source/);
});

test("graph import-template rewrites same-repo IDs and links with dry-run then apply", () => {
  const root = makeTempDir("mdkg-graph-import-");
  run(["init", "--agent"], root);
  run(["new", "goal", "local existing goal", "--status", "todo", "--priority", "1", "--json"], root);
  run(["new", "task", "local existing task", "--status", "todo", "--priority", "1", "--json"], root);
  const source = createLinkedTemplateGraph(root, "templates/source");
  const sourceHashBefore = hashTree(source);
  const beforeHash = hashTree(path.join(root, ".mdkg", "work"));

  const dryRun = json<{
    action: string;
    mode: string;
    files_written: string[];
    planned_paths: string[];
    rewritten_ids: Array<{ from_id: string; to_id: string }>;
    rewritten_refs: Array<{ field: string; from: string; to: string }>;
    selected_goal?: { qid: string; planned: boolean };
  }>(
    run([
      "graph",
      "import-template",
      "templates/source",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--dry-run",
      "--json",
    ], root).stdout
  );

  assert.equal(dryRun.action, "graph.import_template");
  assert.equal(dryRun.mode, "import_template_dry_run");
  assert.deepEqual(dryRun.files_written, []);
  assert.ok(dryRun.planned_paths.includes(".mdkg/work/goal-2-template-start-goal.md"));
  assert.ok(dryRun.planned_paths.includes(".mdkg/work/task-2-template-linked-task.md"));
  assert.ok(dryRun.rewritten_ids.some((item) => item.from_id === "goal-1" && item.to_id === "goal-2"));
  assert.ok(dryRun.rewritten_ids.some((item) => item.from_id === "task-1" && item.to_id === "task-2"));
  assert.ok(dryRun.rewritten_refs.some((item) => item.field === "parent" && item.from === "goal-1" && item.to === "goal-2"));
  assert.equal(dryRun.selected_goal?.qid, "root:goal-2");
  assert.equal(dryRun.selected_goal?.planned, true);
  assert.equal(hashTree(path.join(root, ".mdkg", "work")), beforeHash, "dry-run mutated root work tree");

  const applied = json<{
    mode: string;
    files_written: string[];
    validation?: { ok: boolean; error_count: number };
    selected_goal?: { qid: string; planned: boolean };
  }>(
    run([
      "graph",
      "import-template",
      "templates/source",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--apply",
      "--json",
    ], root).stdout
  );

  assert.equal(applied.mode, "import_template_applied");
  assert.ok(applied.files_written.includes(".mdkg/work/goal-2-template-start-goal.md"));
  assert.ok(applied.files_written.includes(".mdkg/work/task-2-template-linked-task.md"));
  assert.equal(applied.validation?.ok, true);
  assert.equal(applied.validation?.error_count, 0);
  assert.equal(applied.selected_goal?.qid, "root:goal-2");
  assert.equal(applied.selected_goal?.planned, false);

  const importedTask = fs.readFileSync(path.join(root, ".mdkg", "work", "task-2-template-linked-task.md"), "utf8");
  assert.match(importedTask, /parent: goal-2/);
  assert.match(importedTask, /refs: \[goal-2\]/);
  assert.match(importedTask, /Mentions root:goal-2 and task-2/);
  const current = json<{ goal: { id: string; qid: string } }>(run(["goal", "current", "--json"], root).stdout);
  assert.equal(current.goal.id, "goal-2");
  run(["validate", "--json"], root);
  assert.equal(hashTree(source), sourceHashBefore, "source directory changed during import-template");
});
