import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function setupRepo(): string {
  const root = makeTempDir("mdkg-handoff-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Handoff goal",
      "status: progress",
      "priority: 1",
      "goal_state: active",
      "goal_condition: handoff proof is complete",
      "active_node: task-1",
      "scope_refs: [task-1]",
      "required_skills: [select-work-and-ground-context]",
      "required_checks: [npm run build, node dist/cli.js validate --json]",
      "max_iterations: 5",
      "blocked_after_attempts: 3",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-06-17",
      "updated: 2026-06-17",
      "---",
      "",
      "# Overview",
      "",
      "Goal overview.",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Handoff implementation task",
      "status: progress",
      "priority: 1",
      "epic: epic-1",
      "parent: goal-1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: [https://example.invalid/context]",
      "evidence_refs: [proof://handoff/evidence]",
      "aliases: []",
      "skills: []",
      "created: 2026-06-17",
      "updated: 2026-06-17",
      "---",
      "",
      "# Overview",
      "",
      "Implementation detail with RAW_SECRET_MARKER that must not be copied.",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "epic-1.md"),
    [
      "---",
      "id: epic-1",
      "type: epic",
      "title: Handoff epic",
      "status: progress",
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
      "skills: []",
      "created: 2026-06-17",
      "updated: 2026-06-17",
      "---",
      "",
      "# Overview",
      "",
      "Epic overview.",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "chk-1.md"),
    [
      "---",
      "id: chk-1",
      "type: checkpoint",
      "title: Handoff checkpoint",
      "status: done",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [goal-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-06-17",
      "updated: 2026-06-17",
      "---",
      "",
      "# Evidence",
      "",
      "Checkpoint summary.",
    ].join("\n")
  );
  return root;
}

function runCli(root: string, args: string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function parseJson(stdout: string): any {
  return JSON.parse(stdout);
}

test("handoff create emits sanitized JSON receipt from pack context", () => {
  const root = setupRepo();
  const result = runCli(root, ["handoff", "create", "goal-1", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = parseJson(result.stdout);
  assert.equal(payload.action, "handoff-created");
  assert.equal(payload.ok, true);
  assert.equal(payload.target.qid, "root:goal-1");
  assert.equal(payload.latest_checkpoint_qid, "root:chk-1");
  assert.ok(payload.included_qids.includes("root:task-1"));
  assert.ok(payload.content.includes("# mdkg Agent Handoff"));
  assert.ok(payload.content.includes("Handoff implementation task"));
  assert.ok(payload.content.includes("npm run build"));
  assert.ok(payload.content.includes("proof://handoff/evidence"));
  assert.ok(payload.content.includes("raw_secret"));
  assert.equal(payload.content.includes("RAW_SECRET_MARKER"), false);
  assert.equal(payload.raw_marker_warning_count, 1);
  assert.equal(payload.raw_marker_warnings[0].qid, "root:task-1");
  assert.equal(Array.isArray(payload.index_warnings), true);
  assert.equal(Array.isArray(payload.pack_warnings), true);
  assert.equal(payload.pack_warning_count, payload.pack_warnings.length);
  assert.equal(payload.warning_count, payload.index_warning_count + payload.pack_warning_count);
  assert.match(payload.content_sha256, /^sha256:[a-f0-9]{64}$/);
});

test("handoff create writes output inside root and rejects escaped paths", () => {
  const root = setupRepo();
  const out = ".mdkg/handoffs/goal-1.md";
  const result = runCli(root, ["handoff", "create", "goal-1", "--out", out, "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = parseJson(result.stdout);
  assert.equal(payload.output_path, out);
  assert.equal(fs.existsSync(path.join(root, out)), true);
  assert.ok(fs.readFileSync(path.join(root, out), "utf8").includes("Handoff goal"));

  const escaped = runCli(root, ["handoff", "create", "goal-1", "--out", "../handoff.md", "--json"]);
  assert.notEqual(escaped.status, 0);
  assert.match(escaped.stderr, /--out must stay within the repo root/);
});
