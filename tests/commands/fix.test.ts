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

function spikeNode(
  id: string,
  title: string,
  options: { blockedBy?: string[]; artifacts?: string[] } = {}
): string {
  return [
    "---",
    `id: ${id}`,
    "type: spike",
    `title: ${title}`,
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    `artifacts: [${(options.artifacts ?? []).join(", ")}]`,
    "relates: []",
    `blocked_by: [${(options.blockedBy ?? []).join(", ")}]`,
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-06-09",
    "updated: 2026-06-09",
    "---",
    "",
    "# Research Question",
    "",
    "What needs research?",
    "",
    "# Context And Constraints",
    "",
    "# Search Plan",
    "",
    "# Findings",
    "",
    "# Options And Tradeoffs",
    "",
    "# Recommendation",
    "",
    "# Follow-Up Nodes To Create",
    "",
    "# Skill Candidates",
    "",
    "# Evidence And Sources",
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
  assert.equal(payload.summary.apply_deferred, false);
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

test("fix help documents dry-run and ids-apply repair boundaries", () => {
  const root = createFixRepo("mdkg-fix-help-");
  const top = run(root, ["help", "fix"]);
  assert.equal(top.status, 0, top.stderr);
  assert.match(top.stdout, /mdkg fix plan/);
  assert.match(top.stdout, /fix apply/);
  assert.match(top.stdout, /duplicate-ID graph repairs/);

  const plan = run(root, ["help", "fix", "plan"]);
  assert.equal(plan.status, 0, plan.stderr);
  assert.match(plan.stdout, /read-only repair planning/);
  assert.match(plan.stdout, /receipt-shaped JSON plan/);
  assert.match(plan.stdout, /ids-family duplicate-id repairs can be applied/);

  const apply = run(root, ["help", "fix", "apply"]);
  assert.equal(apply.status, 0, apply.stderr);
  assert.match(apply.stdout, /applies only supported ids-family duplicate-ID rewrites/);

  const ids = run(root, ["help", "fix", "ids"]);
  assert.equal(ids.status, 0, ids.stderr);
  assert.match(ids.stdout, /without --apply/);
});

test("fix plan rejects invalid family and fix apply rejects unsupported families", () => {
  const root = createFixRepo("mdkg-fix-errors-");
  const invalid = run(root, ["fix", "plan", "--family", "everything", "--json"]);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /--family must be one of index, refs, ids, all/);

  const apply = run(root, ["fix", "apply", "--family", "refs", "--json"]);
  assert.notEqual(apply.status, 0);
  assert.match(apply.stderr, /fix apply currently supports only --family ids/);
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

test("fix plan refs family reports spike graph and archive reference guidance", () => {
  const root = createFixRepo("mdkg-fix-refs-spike-");
  writeFile(
    path.join(root, ".mdkg", "work", "spike-1.md"),
    spikeNode("spike-1", "research missing references", {
      blockedBy: ["task-999"],
      artifacts: ["archive://archive.missing"],
    })
  );
  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--family", "refs", "--target", "spike-1", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.deepEqual(after, before);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.family, "refs");
  assert.equal(payload.summary.apply_supported, false);
  assert.equal(payload.summary.apply_deferred, true);
  const reasons = payload.proposed_changes.map((change: { reason: string }) => change.reason);
  assert.ok(reasons.includes("graph_ref_missing"));
  assert.ok(reasons.includes("archive_ref_missing"));
  const graphChange = payload.proposed_changes.find(
    (change: { reason: string; refs: string[] }) =>
      change.reason === "graph_ref_missing" && change.refs.includes("root:task-999")
  );
  assert.ok(graphChange);
  assert.deepEqual(graphChange.paths, [".mdkg/work/spike-1.md"]);
  assert.equal(graphChange.evidence.source_qid, "root:spike-1");
  assert.equal(graphChange.evidence.field, "blocked_by");
  const archiveChange = payload.proposed_changes.find(
    (change: { reason: string; refs: string[] }) =>
      change.reason === "archive_ref_missing" && change.refs.includes("archive://archive.missing")
  );
  assert.ok(archiveChange);
  assert.deepEqual(archiveChange.paths, [".mdkg/work/spike-1.md"]);
  assert.equal(archiveChange.evidence.source_qid, "root:spike-1");
  assert.equal(archiveChange.command_hint, "mdkg archive show archive://archive.missing");
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
  assert.equal(change.status, "planned");
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
  assert.equal(change.after.candidate_id, "task-2");
  assert.equal(change.after.candidate_qid, "root:task-2");
  assert.equal(change.after.collision_free, true);
  assert.ok(
    change.after.ambiguous_reference_rewrites.some((item: { path: string }) => item.path === ".mdkg/work/task-1.md")
  );
  assert.ok(change.after.reference_paths.includes(".mdkg/work/task-1.md"));
  assert.ok(change.after.reference_paths.includes(".mdkg/work/task-2.md"));
  assert.match(change.command_hint, /mdkg fix apply --family ids/);
  assert.equal(change.apply_supported, true);
  assert.equal(change.apply_kind, "duplicate_id_rewrite");
  assert.equal(payload.summary.apply_supported, true);
  assert.equal(payload.risk_counts.high, 1);
});

test("fix apply ids family rewrites duplicate ids and rebuilds indexes", () => {
  const root = createFixRepo("mdkg-fix-ids-apply-");
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
      "",
      "Self note for task-1.",
    ].join("\n")
  );

  const invalid = run(root, ["validate", "--json"]);
  assert.notEqual(invalid.status, 0);

  const result = run(root, ["fix", "apply", "--family", "ids", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  const receipt = JSON.parse(result.stdout);
  assert.equal(receipt.action, "fix.apply");
  assert.equal(receipt.ok, true);
  assert.match(receipt.receipt_hash, /^sha256:[a-f0-9]{64}$/);
  assert.equal(receipt.family, "ids");
  assert.equal(receipt.summary.applied_count, 1);
  assert.deepEqual(receipt.touched_paths, [".mdkg/work/task-2.md"]);
  assert.equal(receipt.applied_changes[0].after.candidate_id, "task-2");
  assert.equal(receipt.index.rebuilt, true);

  const rewritten = fs.readFileSync(path.join(root, ".mdkg", "work", "task-2.md"), "utf8");
  assert.match(rewritten, /^id: task-2$/m);
  assert.match(rewritten, /Self note for task-2\./);

  const validate = run(root, ["validate", "--json"]);
  assert.equal(validate.status, 0, validate.stderr);
  assert.equal(JSON.parse(validate.stdout).ok, true);
});

test("fix ids --apply is an ids-family convenience apply command", () => {
  const root = createFixRepo("mdkg-fix-ids-convenience-");
  writeFile(path.join(root, ".mdkg", "work", "task-copy.md"), taskNode("task-1", "duplicate convenience task"));

  const result = run(root, ["fix", "ids", "--apply", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  const receipt = JSON.parse(result.stdout);
  assert.equal(receipt.action, "fix.apply");
  assert.equal(receipt.family, "ids");
  assert.deepEqual(receipt.touched_paths, [".mdkg/work/task-copy.md"]);

  const validate = run(root, ["validate", "--json"]);
  assert.equal(validate.status, 0, validate.stderr);
});

test("fix plan ids family reports duplicate spike ids with deterministic candidate rename", () => {
  const root = createFixRepo("mdkg-fix-ids-spike-duplicate-");
  writeFile(path.join(root, ".mdkg", "work", "spike-1.md"), spikeNode("spike-1", "canonical spike"));
  writeFile(path.join(root, ".mdkg", "work", "spike-copy.md"), spikeNode("spike-1", "duplicate spike"));
  const before = snapshotFiles(root);
  const result = run(root, ["fix", "plan", "--family", "ids", "--target", "spike-1", "--json"]);
  const after = snapshotFiles(root);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.deepEqual(after, before);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.family, "ids");
  assert.equal(payload.proposed_changes.length, 1);
  const change = payload.proposed_changes[0];
  assert.equal(change.family, "ids");
  assert.equal(change.reason, "duplicate_id");
  assert.equal(change.risk, "high");
  assert.deepEqual(change.paths, [".mdkg/work/spike-copy.md"]);
  assert.equal(change.evidence.duplicate_id, "spike-1");
  assert.equal(change.evidence.workspace, "root");
  assert.deepEqual(change.evidence.group_paths, [".mdkg/work/spike-1.md", ".mdkg/work/spike-copy.md"]);
  assert.equal(change.after.candidate_id, "spike-2");
  assert.equal(change.after.candidate_qid, "root:spike-2");
  assert.equal(change.after.collision_free, true);
  assert.match(change.command_hint, /mdkg fix apply --family ids/);
  assert.equal(change.apply_supported, true);
});

test("fix plan ids family groups two-branch duplicate ids with stable apply-capable rewrite plan", () => {
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
  assert.equal(firstPayload.summary.apply_supported, true);
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
  assert.equal(change.after.candidate_id, "task-3");
  assert.equal(change.after.candidate_qid, "root:task-3");
  assert.equal(change.after.collision_free, true);
  assert.match(change.after.deterministic_rule, /lexicographically first path/);
  assert.ok(
    change.after.ambiguous_reference_rewrites.some(
      (item: { path: string; replacement_count: number; confidence: string }) =>
        item.path === ".mdkg/work/task-2-branch-a.md" &&
        item.replacement_count > 0 &&
        item.confidence === "manual_review"
    )
  );
  assert.equal(change.apply_supported, true);
});

test("fix ids --apply resolves unresolved git conflict-stage duplicate ids", () => {
  const root = createFixRepo("mdkg-fix-ids-stage-conflict-");
  assertGit(root, ["init", "-q"]);
  assertGit(root, ["add", "."]);
  assertGit(root, ["commit", "-m", "base"]);
  const base = git(root, ["rev-parse", "HEAD"]).stdout.trim();

  const conflictPath = path.join(root, ".mdkg", "work", "task-900.md");
  assertGit(root, ["checkout", "-q", "-b", "branch-a"]);
  writeFile(conflictPath, taskNode("task-900", "branch a same path duplicate"));
  assertGit(root, ["add", ".mdkg/work/task-900.md"]);
  assertGit(root, ["commit", "-m", "branch a same path task"]);

  assertGit(root, ["checkout", "-q", "-b", "branch-b", base]);
  writeFile(conflictPath, taskNode("task-900", "branch b same path duplicate"));
  assertGit(root, ["add", ".mdkg/work/task-900.md"]);
  assertGit(root, ["commit", "-m", "branch b same path task"]);

  assertGit(root, ["checkout", "-q", "branch-a"]);
  const merge = git(root, ["merge", "--no-edit", "branch-b"]);
  assert.notEqual(merge.status, 0, merge.stdout || merge.stderr);
  assert.match(git(root, ["ls-files", "-u", "--", ".mdkg/work/task-900.md"]).stdout, /\t\.mdkg\/work\/task-900\.md/);

  const plan = run(root, ["fix", "ids", "--target", "task-900", "--json"]);
  assert.equal(plan.status, 0, plan.stderr);
  const planReceipt = JSON.parse(plan.stdout);
  assert.equal(planReceipt.summary.apply_supported, true);
  assert.equal(planReceipt.proposed_changes.length, 1);
  const change = planReceipt.proposed_changes[0];
  assert.equal(change.reason, "git_stage_duplicate_id");
  assert.equal(change.apply_kind, "git_stage_duplicate_id_rewrite");
  assert.deepEqual(change.paths, [".mdkg/work/task-900.md", ".mdkg/work/task-901.md"]);
  assert.equal(change.after.candidate_id, "task-901");
  assert.equal(change.after.candidate_path, ".mdkg/work/task-901.md");

  const apply = run(root, ["fix", "ids", "--target", "task-900", "--apply", "--json"]);
  assert.equal(apply.status, 0, apply.stderr);
  const receipt = JSON.parse(apply.stdout);
  assert.equal(receipt.action, "fix.apply");
  assert.equal(receipt.summary.applied_count, 1);
  assert.deepEqual(receipt.touched_paths, [".mdkg/work/task-900.md", ".mdkg/work/task-901.md"]);
  assert.equal(git(root, ["ls-files", "-u", "--", ".mdkg/work/task-900.md"]).stdout.trim(), "");

  const canonical = fs.readFileSync(path.join(root, ".mdkg", "work", "task-900.md"), "utf8");
  const incoming = fs.readFileSync(path.join(root, ".mdkg", "work", "task-901.md"), "utf8");
  assert.match(canonical, /^id: task-900$/m);
  assert.match(canonical, /branch a same path duplicate/);
  assert.match(incoming, /^id: task-901$/m);
  assert.match(incoming, /branch b same path duplicate/);

  const validate = run(root, ["validate", "--json"]);
  assert.equal(validate.status, 0, validate.stderr);
  assert.equal(JSON.parse(validate.stdout).ok, true);
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
