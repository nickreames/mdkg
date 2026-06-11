import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function createStatusRepo(prefix: string): string {
  const root = makeTempDir(prefix);
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: status fixture",
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
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Status fixture",
    ].join("\n")
  );
  const index = run(root, ["index"]);
  assert.equal(index.status, 0, index.stderr);
  return root;
}

function run(root: string, args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("status --json reports read-only operator health summary", () => {
  const root = createStatusRepo("mdkg-status-json-");
  const result = run(root, ["status", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.action, "status");
  assert.equal(payload.ok, true);
  assert.equal(payload.level, "ok");
  assert.equal(payload.root, fs.realpathSync(root));
  assert.equal(typeof payload.mdkg.version, "string");
  assert.equal(payload.git.inside, false);
  assert.equal(payload.graph.ok, true);
  assert.equal(payload.graph.node_count, 1);
  assert.equal(payload.goal.selected, null);
  assert.equal(payload.db.enabled, false);
  assert.equal(payload.db.ok, null);
  assert.equal(payload.generated.index.exists, true);
  assert.equal(payload.generated.index.stale, false);
  assert.equal(payload.generated.skills.exists, true);
  assert.equal(payload.generated.capabilities.exists, true);
  assert.deepEqual(payload.summary.errors, []);
});

test("status --json warns for dirty git worktrees without failing", () => {
  const root = createStatusRepo("mdkg-status-git-");
  const git = spawnSync("git", ["init", "-q"], { cwd: root, encoding: "utf8" });
  assert.equal(git.status, 0, git.stderr);
  fs.writeFileSync(path.join(root, "scratch.txt"), "dirty\n", "utf8");

  const result = run(root, ["status", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);

  assert.equal(payload.ok, true);
  assert.equal(payload.level, "warn");
  assert.equal(payload.git.inside, true);
  assert.equal(payload.git.dirty, true);
  assert.ok(payload.git.dirty_count >= 1);
  assert.match(payload.summary.warnings.join("\n"), /git worktree is dirty/);
});

test("status help documents read-only operator boundaries", () => {
  const root = createStatusRepo("mdkg-status-help-");
  const result = run(root, ["help", "status"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /mdkg status \[--json\]/);
  assert.match(result.stdout, /read-only operator summary/);
  assert.match(result.stdout, /does not rebuild indexes or repair files/);
});
