import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function createFixRepo(prefix: string): string {
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
      "title: fix fixture",
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
      "# Fix fixture",
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

function git(root: string, args: string[]) {
  return spawnSync(
    "git",
    ["-c", "user.name=mdkg test", "-c", "user.email=mdkg-test@example.invalid", ...args],
    {
      cwd: root,
      encoding: "utf8",
    }
  );
}

function assertGit(root: string, args: string[]): void {
  const result = git(root, args);
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function taskNode(id: string, title: string): string {
  return [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${title}`,
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
    "# Overview",
    "",
    "# Acceptance Criteria",
    "",
    "# Files Affected",
    "",
    "# Implementation Notes",
    "",
    "# Test Plan",
    "",
    "# Links / Artifacts",
  ].join("\n");
}

function snapshotFiles(root: string): Map<string, string> {
  const entries = new Map<string, string>();
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        entries.set(path.relative(root, fullPath).split(path.sep).join("/"), fs.readFileSync(fullPath, "utf8"));
      }
    }
  };
  walk(root);
  return entries;
}

test("fix plan --json emits read-only receipt skeleton", () => {
  const root = createFixRepo("mdkg-fix-plan-json-");
  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.deepEqual(after, before);

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.action, "fix.plan");
  assert.equal(payload.ok, true);
  assert.equal(payload.schema_version, 1);
  assert.match(payload.plan_id, /^fix-plan-[a-f0-9]{16}$/);
  assert.match(payload.plan_hash, /^sha256:[a-f0-9]{64}$/);
  assert.equal(payload.root, fs.realpathSync(root));
  assert.equal(payload.family, "all");
  assert.deepEqual(payload.summary.selected_families, ["index", "refs", "ids"]);
  assert.equal(payload.summary.apply_supported, false);
  assert.equal(payload.summary.apply_deferred, true);
  assert.deepEqual(payload.risk_counts, { low: 0, medium: 0, high: 0, blocked: 0 });
  assert.deepEqual(payload.proposed_changes, []);
  assert.deepEqual(payload.blocked_changes, []);
  assert.equal(payload.families.length, 3);
});

test("fix plan accepts family and target while keeping plan hash deterministic", () => {
  const root = createFixRepo("mdkg-fix-plan-family-");
  const first = run(root, ["fix", "plan", "--family", "refs", "--target", "task-1", "--json"]);
  const second = run(root, ["fix", "plan", "--family", "refs", "--target", "task-1", "--json"]);

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  const firstPayload = JSON.parse(first.stdout);
  const secondPayload = JSON.parse(second.stdout);
  assert.equal(firstPayload.family, "refs");
  assert.equal(firstPayload.target, "task-1");
  assert.deepEqual(firstPayload.summary.selected_families, ["refs"]);
  assert.equal(firstPayload.plan_hash, secondPayload.plan_hash);
  assert.equal(firstPayload.plan_id, secondPayload.plan_id);
});

test("fix help documents dry-run repair boundary", () => {
  const root = createFixRepo("mdkg-fix-help-");
  const top = run(root, ["help", "fix"]);
  assert.equal(top.status, 0, top.stderr);
  assert.match(top.stdout, /mdkg fix plan/);
  assert.match(top.stdout, /dry-run only and writes nothing/);

  const plan = run(root, ["help", "fix", "plan"]);
  assert.equal(plan.status, 0, plan.stderr);
  assert.match(plan.stdout, /read-only repair planning/);
  assert.match(plan.stdout, /receipt-shaped JSON plan/);
  assert.match(plan.stdout, /fix apply.*not available/);
});

test("fix plan rejects invalid family and no apply command is exposed", () => {
  const root = createFixRepo("mdkg-fix-errors-");
  const invalid = run(root, ["fix", "plan", "--family", "everything", "--json"]);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /--family must be one of index, refs, ids, all/);

  const apply = run(root, ["fix", "apply", "--json"]);
  assert.notEqual(apply.status, 0);
  assert.match(apply.stderr, /unknown fix subcommand: apply/);
});

test("fix plan index family reports missing generated caches without mutation", () => {
  const root = createFixRepo("mdkg-fix-index-missing-");
  fs.rmSync(path.join(root, ".mdkg", "index", "global.json"));
  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--family", "index", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(after, before);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.family, "index");
  assert.deepEqual(payload.summary.selected_families, ["index"]);
  assert.equal(payload.families.find((entry: { family: string }) => entry.family === "index").proposed_count, 1);
  assert.equal(payload.proposed_changes[0].family, "index");
  assert.equal(payload.proposed_changes[0].risk, "low");
  assert.equal(payload.proposed_changes[0].reason, "generated_cache_missing");
  assert.deepEqual(payload.proposed_changes[0].paths, [".mdkg/index/global.json"]);
  assert.equal(payload.proposed_changes[0].command_hint, "mdkg index");
  assert.equal(payload.proposed_changes[0].apply_supported, false);
});

test("fix plan index family reports stale generated caches", () => {
  const root = createFixRepo("mdkg-fix-index-stale-");
  writeFile(
    path.join(root, ".mdkg", "work", "task-2.md"),
    [
      "---",
      "id: task-2",
      "type: task",
      "title: newer node",
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
      "# Newer node",
    ].join("\n")
  );

  const result = run(root, ["fix", "plan", "--family", "index", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  const reasons = payload.proposed_changes.map((change: { reason: string }) => change.reason);
  assert.ok(reasons.includes("generated_cache_stale"));
  assert.ok(payload.risk_counts.low >= 1);
});

test("fix plan refs family reports missing graph references without mutation", () => {
  const root = createFixRepo("mdkg-fix-refs-missing-");
  writeFile(
    path.join(root, ".mdkg", "work", "task-2.md"),
    [
      "---",
      "id: task-2",
      "type: task",
      "title: missing ref",
      "status: todo",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: [task-999]",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Missing ref",
    ].join("\n")
  );
  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--family", "refs", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(after, before);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.family, "refs");
  assert.equal(payload.proposed_changes.length, 1);
  assert.equal(payload.proposed_changes[0].family, "refs");
  assert.equal(payload.proposed_changes[0].status, "manual_review");
  assert.equal(payload.proposed_changes[0].reason, "graph_ref_missing");
  assert.deepEqual(payload.proposed_changes[0].paths, [".mdkg/work/task-2.md"]);
  assert.deepEqual(payload.proposed_changes[0].refs, ["root:task-2", "root:task-999"]);
  assert.equal(payload.proposed_changes[0].apply_supported, false);
  assert.equal(payload.risk_counts.medium, 1);
});

test("fix plan refs family reports structured workflow archive and stale selected-goal repairs", () => {
  const root = createFixRepo("mdkg-fix-refs-structured-");
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: achieved stale selected goal",
      "status: done",
      "priority: 1",
      "goal_state: achieved",
      "goal_condition: done",
      "scope_refs: [task-404]",
      "active_node: task-405",
      "required_skills: []",
      "required_checks: []",
      "max_iterations: 25",
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
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Objective",
      "",
      "# End Condition",
      "",
      "# Acceptance Criteria",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "order-1", "WORK_ORDER.md"),
    [
      "---",
      "id: order-1",
      "type: work_order",
      "title: structured order",
      "version: 0.1.0",
      "work_id: work-404",
      "work_version: 0.1.0",
      "requester: user://example",
      "order_status: submitted",
      "request_ref: request.example",
      "trigger_ref: trigger.example",
      "input_refs: [archive://archive.missing]",
      "queue_refs: []",
      "requested_outputs: []",
      "constraint_refs: []",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Request",
      "",
      "# Inputs",
      "",
      "# Constraints",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "receipt-1", "RECEIPT.md"),
    [
      "---",
      "id: receipt-1",
      "type: receipt",
      "title: structured receipt",
      "version: 0.1.0",
      "work_order_id: order-404",
      "receipt_status: recorded",
      "outcome: success",
      "redaction_policy: refs_and_hashes_only",
      "proof_refs: [archive://archive.missing]",
      "attestation_refs: []",
      "evidence_hashes: []",
      "input_hashes: []",
      "output_hashes: []",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Outcome",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "state", "selected-goal.json"),
    `${JSON.stringify(
      { qid: "root:goal-1", id: "goal-1", ws: "root", selected_at: "2026-06-09T00:00:00.000Z" },
      null,
      2
    )}\n`
  );

  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--family", "refs", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(after, before);
  const payload = JSON.parse(result.stdout);
  const changes = payload.proposed_changes;
  const reasons = changes.map((change: { reason: string }) => change.reason);
  assert.ok(reasons.includes("graph_ref_missing"));
  assert.ok(reasons.includes("archive_ref_missing"));
  assert.ok(reasons.includes("selected_goal_achieved"));

  const fields = changes.map((change: { evidence?: { field?: string } }) => change.evidence?.field).filter(Boolean);
  assert.ok(fields.includes("scope_refs[0]"));
  assert.ok(fields.includes("active_node"));
  assert.ok(fields.includes("work_id"));
  assert.ok(fields.includes("work_order_id"));
  assert.ok(fields.includes("input_refs[0]"));
  assert.ok(fields.includes("proof_refs[0]"));

  const selected = changes.find((change: { reason: string }) => change.reason === "selected_goal_achieved");
  assert.equal(selected.evidence.location_kind, "selected_goal_state");
  assert.equal(selected.refs[0], "root:goal-1");
  assert.equal(selected.apply_supported, false);
  assert.equal(payload.summary.apply_supported, false);
});

test("fix plan refs family supports target filtering and blocked target receipts", () => {
  const root = createFixRepo("mdkg-fix-refs-target-");
  writeFile(
    path.join(root, ".mdkg", "work", "task-2.md"),
    [
      "---",
      "id: task-2",
      "type: task",
      "title: missing ref",
      "status: todo",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: [task-999]",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Missing ref",
    ].join("\n")
  );

  const targeted = run(root, ["fix", "plan", "--family", "refs", "--target", "task-1", "--json"]);
  assert.equal(targeted.status, 0, targeted.stderr);
  assert.equal(JSON.parse(targeted.stdout).proposed_changes.length, 0);

  const missingTarget = run(root, ["fix", "plan", "--family", "refs", "--target", "task-404", "--json"]);
  assert.equal(missingTarget.status, 0, missingTarget.stderr);
  const payload = JSON.parse(missingTarget.stdout);
  assert.equal(payload.blocked_changes.length, 1);
  assert.equal(payload.blocked_changes[0].reason, "target_not_found");
  assert.equal(payload.blocked_changes[0].risk, "blocked");
  assert.equal(payload.risk_counts.blocked, 1);
});

test("fix plan ids family reports duplicate ids with deterministic candidate rename", () => {
  const root = createFixRepo("mdkg-fix-ids-duplicate-");
  writeFile(
    path.join(root, ".mdkg", "work", "task-2.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: duplicate id",
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
      "# Duplicate id",
    ].join("\n")
  );
  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--family", "ids", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(after, before);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.family, "ids");
  assert.equal(payload.proposed_changes.length, 1);
  const change = payload.proposed_changes[0];
  assert.equal(change.family, "ids");
  assert.equal(change.risk, "high");
  assert.equal(change.status, "manual_review");
  assert.equal(change.reason, "duplicate_id");
  assert.deepEqual(change.paths, [".mdkg/work/task-2.md"]);
  assert.equal(change.evidence.conflict_kind, "duplicate_local_id");
  assert.equal(change.evidence.workspace, "root");
  assert.equal(change.evidence.duplicate_id, "task-1");
  assert.equal(change.evidence.group_size, 2);
  assert.deepEqual(change.evidence.group_paths, [".mdkg/work/task-1.md", ".mdkg/work/task-2.md"]);
  assert.equal(change.evidence.branch_merge_suspected, true);
  assert.equal(change.before.duplicate_id, "task-1");
  assert.equal(change.before.workspace, "root");
  assert.equal(change.after.candidate_id, "task-1-dup-2");
  assert.equal(change.after.candidate_qid, "root:task-1-dup-2");
  assert.equal(change.after.collision_free, true);
  assert.ok(change.after.reference_rewrite_plan.some((item: { path: string }) => item.path === ".mdkg/work/task-1.md"));
  assert.ok(change.after.reference_paths.includes(".mdkg/work/task-1.md"));
  assert.ok(change.after.reference_paths.includes(".mdkg/work/task-2.md"));
  assert.match(change.command_hint, /task-1-dup-2/);
  assert.equal(change.apply_supported, false);
  assert.equal(payload.risk_counts.high, 1);
});

test("fix plan ids family groups two-branch duplicate ids with stable read-only rewrite plan", () => {
  const root = createFixRepo("mdkg-fix-ids-branch-");
  assertGit(root, ["init", "-q"]);
  assertGit(root, ["add", "."]);
  assertGit(root, ["commit", "-m", "base"]);
  const base = git(root, ["rev-parse", "HEAD"]).stdout.trim();

  assertGit(root, ["checkout", "-q", "-b", "branch-a"]);
  writeFile(path.join(root, ".mdkg", "work", "task-2-branch-a.md"), taskNode("task-2", "branch a duplicate"));
  assertGit(root, ["add", ".mdkg/work/task-2-branch-a.md"]);
  assertGit(root, ["commit", "-m", "branch a task"]);

  assertGit(root, ["checkout", "-q", "-b", "branch-b", base]);
  writeFile(path.join(root, ".mdkg", "work", "task-2-branch-b.md"), taskNode("task-2", "branch b duplicate"));
  assertGit(root, ["add", ".mdkg/work/task-2-branch-b.md"]);
  assertGit(root, ["commit", "-m", "branch b task"]);

  assertGit(root, ["checkout", "-q", "branch-a"]);
  assertGit(root, ["merge", "--no-edit", "branch-b"]);

  const validate = run(root, ["validate", "--json"]);
  assert.notEqual(validate.status, 0);
  const validateReceipt = JSON.parse(validate.stdout) as { ok: boolean; errors: string[] };
  assert.equal(validateReceipt.ok, false);
  assert.ok(
    validateReceipt.errors.some((error) =>
      error.includes(".mdkg/work/task-2-branch-b.md: duplicate id task-2 in workspace root (also in .mdkg/work/task-2-branch-a.md)")
    )
  );

  const before = snapshotFiles(root);
  const first = run(root, ["fix", "plan", "--family", "ids", "--json"]);
  const second = run(root, ["fix", "plan", "--family", "ids", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.deepEqual(after, before);

  const firstPayload = JSON.parse(first.stdout);
  const secondPayload = JSON.parse(second.stdout);
  assert.equal(firstPayload.plan_hash, secondPayload.plan_hash);
  assert.equal(firstPayload.plan_id, secondPayload.plan_id);
  assert.equal(firstPayload.summary.apply_supported, false);
  assert.equal(firstPayload.proposed_changes.length, 1);
  const change = firstPayload.proposed_changes[0];
  assert.equal(change.family, "ids");
  assert.equal(change.reason, "duplicate_id");
  assert.deepEqual(change.paths, [".mdkg/work/task-2-branch-b.md"]);
  assert.deepEqual(change.refs, ["root:task-2"]);
  assert.equal(change.evidence.conflict_kind, "duplicate_local_id");
  assert.equal(change.evidence.branch_merge_suspected, true);
  assert.equal(change.evidence.workspace, "root");
  assert.equal(change.evidence.duplicate_id, "task-2");
  assert.deepEqual(change.evidence.group_paths, [
    ".mdkg/work/task-2-branch-a.md",
    ".mdkg/work/task-2-branch-b.md",
  ]);
  assert.equal(change.before.canonical_path, ".mdkg/work/task-2-branch-a.md");
  assert.equal(change.before.duplicate_path, ".mdkg/work/task-2-branch-b.md");
  assert.deepEqual(change.before.duplicate_group.all_paths, [
    ".mdkg/work/task-2-branch-a.md",
    ".mdkg/work/task-2-branch-b.md",
  ]);
  assert.equal(change.after.candidate_id, "task-2-dup-2");
  assert.equal(change.after.candidate_qid, "root:task-2-dup-2");
  assert.equal(change.after.collision_free, true);
  assert.match(change.after.deterministic_rule, /lexicographically first path/);
  assert.ok(
    change.after.reference_rewrite_plan.some(
      (item: { path: string; replacement_count: number; confidence: string }) =>
        item.path === ".mdkg/work/task-2-branch-a.md" &&
        item.replacement_count > 0 &&
        item.confidence === "manual_review"
    )
  );
  assert.equal(change.apply_supported, false);
});

test("fix plan ids family supports target filtering and blocked target receipts", () => {
  const root = createFixRepo("mdkg-fix-ids-target-");
  const noDuplicate = run(root, ["fix", "plan", "--family", "ids", "--target", "task-1", "--json"]);
  assert.equal(noDuplicate.status, 0, noDuplicate.stderr);
  assert.equal(JSON.parse(noDuplicate.stdout).proposed_changes.length, 0);

  const missingTarget = run(root, ["fix", "plan", "--family", "ids", "--target", "task-404", "--json"]);
  assert.equal(missingTarget.status, 0, missingTarget.stderr);
  const payload = JSON.parse(missingTarget.stdout);
  assert.equal(payload.blocked_changes.length, 1);
  assert.equal(payload.blocked_changes[0].reason, "target_not_found");
  assert.equal(payload.blocked_changes[0].risk, "blocked");
  assert.equal(payload.risk_counts.blocked, 1);
});
