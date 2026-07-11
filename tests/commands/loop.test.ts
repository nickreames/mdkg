import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const {
  runLoopForkCommand,
  runLoopListCommand,
  runLoopNextCommand,
  runLoopPlanCommand,
  runLoopRunsCommand,
  runLoopShowCommand,
} = require("../../commands/loop");
const { runListCommand } = require("../../commands/list");
const { runIndexCommand } = require("../../commands/index");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
const { runValidateCommand } = require("../../commands/validate");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

function writeSeedLoop(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "templates", "loops", "security-audit.loop.md"),
    [
      "---",
      "id: loop-1",
      "type: loop",
      "title: Security Audit",
      "status: todo",
      "priority: 1",
      "loop_mode: readonly",
      "loop_role: template",
      "scope_refs: []",
      "scope_description: repo or package security scope",
      "template_refs: []",
      "materialization_mode: default_children",
      "child_refs: []",
      "pre_run_questions: [external_advisory_checks_approved, local_cache_writes_approved]",
      "question_answer_refs: []",
      "pre_approved_actions: [read_source, run_local_static_scans]",
      "approval_gated_actions: [external_advisory_checks]",
      "required_actions: [read_source, run_local_static_scans]",
      "requested_actions: [read_source, run_local_static_scans]",
      "prohibited_actions: [functional_changes]",
      "action_approval_refs: []",
      "evidence_lanes: [source_security_review, dependency_advisories]",
      "evidence_lane_refs: []",
      "lane_waiver_refs: []",
      "lane_waiver_decision_refs: []",
      "lane_waiver_approval_refs: []",
      "run_refs: []",
      "decision_refs: []",
      "output_refs: []",
      "approval_refs: []",
      "evaluation_refs: []",
      "definition_of_done: Security risks are reviewed with source-grounded evidence.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop-template, audit, security]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: [security-audit-loop]",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Operating Model",
      "",
      "Run a read-only security audit.",
    ].join("\n")
  );
}

function writeGoal(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1-test-goal.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Test goal",
      "status: progress",
      "priority: 1",
      "goal_state: active",
      "goal_condition: Test goal condition",
      "scope_refs: []",
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
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Goal",
    ].join("\n")
  );
}

function writeLoopGoalChild(
  root: string,
  id: string,
  status: string,
  goalState: string
): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}-loop-child-goal.md`),
    [
      "---",
      `id: ${id}`,
      "type: goal",
      `title: Loop child ${id}`,
      `status: ${status}`,
      "priority: 1",
      `goal_state: ${goalState}`,
      `goal_condition: Complete ${id}`,
      "scope_refs: []",
      "required_skills: []",
      "required_checks: []",
      "max_iterations: 25",
      "blocked_after_attempts: 3",
      "tags: [loop-child]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: [loop-1]",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Goal",
    ].join("\n")
  );
}

function writeGoalRoutingLoop(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "loop-1-goal-routing-loop.md"),
    [
      "---",
      "id: loop-1",
      "type: loop",
      "title: Goal routing loop",
      "status: progress",
      "priority: 1",
      "loop_mode: readonly",
      "loop_role: scoped",
      "scope_refs: []",
      "scope_description: nested goal routing",
      "template_refs: []",
      "materialization_mode: default_children",
      "child_refs: [goal-1, goal-2, goal-3]",
      "pre_run_questions: [scope_authority]",
      "question_answer_refs: []",
      "pre_approved_actions: [read_source]",
      "approval_gated_actions: []",
      "required_actions: [read_source]",
      "requested_actions: [read_source]",
      "prohibited_actions: [functional_changes]",
      "action_approval_refs: []",
      "evidence_lanes: []",
      "evidence_lane_refs: []",
      "lane_waiver_refs: []",
      "lane_waiver_decision_refs: []",
      "lane_waiver_approval_refs: []",
      "run_refs: []",
      "decision_refs: []",
      "output_refs: []",
      "approval_refs: []",
      "evaluation_refs: []",
      "definition_of_done: Exhaust all useful nested goal work.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop, routing]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: [task-9]",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Goal Routing Loop",
    ].join("\n")
  );
  writeLoopGoalChild(root, "goal-1", "blocked", "paused");
  writeLoopGoalChild(root, "goal-2", "done", "achieved");
  writeLoopGoalChild(root, "goal-3", "progress", "paused");
  writeProjectionChild(root, "task-9", "task", "blocked");
}

function writeLoopNode(root: string, id: number): void {
  writeFile(
    path.join(root, ".mdkg", "work", `loop-${id}-discovery-loop-${id}.md`),
    [
      "---",
      `id: loop-${id}`,
      "type: loop",
      `title: Discovery loop ${id}`,
      "status: todo",
      "priority: 1",
      "loop_mode: planning",
      "loop_role: scoped",
      "scope_refs: []",
      `scope_description: discovery scope ${id}`,
      "template_refs: []",
      "materialization_mode: planning_only",
      "child_refs: []",
      "run_refs: []",
      "decision_refs: []",
      "output_refs: []",
      "approval_refs: []",
      "evaluation_refs: []",
      "definition_of_done: Discovery loop remains visible.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop, discovery]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Operating Model",
      "",
      "Discovery loop fixture.",
    ].join("\n")
  );
}

function writeProjectionChild(root: string, id: string, type: string, status: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}-projection-child-${id}.md`),
    [
      "---",
      `id: ${id}`,
      `type: ${type}`,
      `title: Projection child ${id}`,
      `status: ${status}`,
      "priority: 1",
      "parent: loop-1",
      "tags: [loop-child, projection]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: [loop-1]",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      ...(type === "test" ? ["cases: []"] : []),
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Projection Child",
    ].join("\n")
  );
}

function writeAcceptedDecision(root: string, id = "dec-1"): void {
  writeFile(
    path.join(root, ".mdkg", "design", `${id}-loop-readiness-decision.md`),
    [
      "---",
      `id: ${id}`,
      "type: dec",
      "title: Loop readiness decision",
      "status: accepted",
      "tags: [loop, readiness]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "refs: []",
      "aliases: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Decision",
    ].join("\n")
  );
}

function writeDoneCheckpoint(root: string, id: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}-loop-readiness-evidence.md`),
    [
      "---",
      `id: ${id}`,
      "type: checkpoint",
      "title: Loop readiness evidence",
      "status: done",
      "priority: 1",
      "tags: [loop, readiness]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Evidence",
    ].join("\n")
  );
}

function writeIdentityScopedLoop(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "loop-1-identity-scoped-loop.md"),
    [
      "---",
      "id: loop-1",
      "type: loop",
      "title: Identity scoped loop",
      "status: progress",
      "priority: 1",
      "loop_mode: readonly",
      "loop_role: scoped",
      "scope_refs: []",
      "scope_description: identity scope",
      "template_refs: []",
      "materialization_mode: planning_only",
      "child_refs: []",
      "pre_run_questions: [scope_authority, external_scope]",
      "question_answer_refs: [scope_authority=dec-1]",
      "pre_approved_actions: [read_source]",
      "approval_gated_actions: [external_advisory_checks, provider_scan]",
      "required_actions: [read_source]",
      "requested_actions: [read_source, external_advisory_checks]",
      "prohibited_actions: [functional_changes]",
      "action_approval_refs: [external_advisory_checks=chk-1]",
      "evidence_lanes: [source_review, dependency_review]",
      "evidence_lane_refs: [source_review=chk-1]",
      "lane_waiver_refs: []",
      "lane_waiver_decision_refs: []",
      "lane_waiver_approval_refs: []",
      "run_refs: [chk-1, chk-2]",
      "decision_refs: [dec-1, dec-2]",
      "output_refs: []",
      "approval_refs: [chk-1, chk-2]",
      "evaluation_refs: []",
      "definition_of_done: Every identity is independently satisfied.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop, readiness]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: [chk-1, chk-2]",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Identity Scoped Loop",
    ].join("\n")
  );
  writeAcceptedDecision(root, "dec-1");
  writeAcceptedDecision(root, "dec-2");
  writeDoneCheckpoint(root, "chk-1");
  writeDoneCheckpoint(root, "chk-2");
}

function writeProjectionLoop(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "loop-1-projection-loop.md"),
    [
      "---",
      "id: loop-1",
      "type: loop",
      "title: Projection loop",
      "status: progress",
      "priority: 1",
      "loop_mode: readonly",
      "loop_role: scoped",
      "scope_refs: []",
      "scope_description: projection scope",
      "template_refs: [template://loops/security-audit]",
      "materialization_mode: default_children",
      "child_refs: [task-1, task-2, test-1, spike-1, missing-child]",
      "pre_run_questions: [scope_authority]",
      "question_answer_refs: [scope_authority=dec-1]",
      "pre_approved_actions: [read_source]",
      "approval_gated_actions: [external_advisory_checks]",
      "required_actions: [read_source]",
      "requested_actions: [read_source, external_advisory_checks]",
      "prohibited_actions: [functional_changes]",
      "action_approval_refs: [external_advisory_checks=chk-1]",
      "evidence_lanes: [source_review]",
      "evidence_lane_refs: [source_review=chk-1]",
      "lane_waiver_refs: [dec-1]",
      "lane_waiver_decision_refs: [source_review=dec-1]",
      "lane_waiver_approval_refs: [source_review=chk-1]",
      "run_refs: [chk-1]",
      "decision_refs: [dec-1]",
      "output_refs: [prop-1]",
      "approval_refs: [chk-1]",
      "evaluation_refs: [test-1]",
      "definition_of_done: Projection lanes are classified.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop, projection]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: [chk-1]",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Projection Loop",
    ].join("\n")
  );
  writeProjectionChild(root, "task-1", "task", "done");
  writeProjectionChild(root, "task-2", "task", "blocked");
  writeProjectionChild(root, "test-1", "test", "review");
  writeProjectionChild(root, "spike-1", "spike", "todo");
  writeAcceptedDecision(root);
  writeFile(
    path.join(root, ".mdkg", "work", "chk-1-projection-evidence.md"),
    [
      "---",
      "id: chk-1",
      "type: checkpoint",
      "title: projection evidence",
      "status: done",
      "priority: 1",
      "tags: [loop, projection]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Projection Evidence",
    ].join("\n")
  );
}

function writeReadyDoneLoop(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "loop-1-ready-done-loop.md"),
    [
      "---",
      "id: loop-1",
      "type: loop",
      "title: Ready done loop",
      "status: done",
      "priority: 1",
      "loop_mode: readonly",
      "loop_role: scoped",
      "scope_refs: []",
      "scope_description: done scope",
      "template_refs: [template://loops/security-audit]",
      "materialization_mode: default_children",
      "child_refs: [task-1]",
      "pre_run_questions: [scope_authority]",
      "question_answer_refs: [scope_authority=dec-1]",
      "pre_approved_actions: [read_source]",
      "approval_gated_actions: [external_advisory_checks]",
      "required_actions: [read_source]",
      "requested_actions: [read_source, external_advisory_checks]",
      "prohibited_actions: [functional_changes]",
      "action_approval_refs: [external_advisory_checks=chk-1]",
      "evidence_lanes: [source_review]",
      "evidence_lane_refs: [source_review=chk-1]",
      "lane_waiver_refs: []",
      "lane_waiver_decision_refs: []",
      "lane_waiver_approval_refs: []",
      "run_refs: [chk-1]",
      "decision_refs: [dec-1]",
      "output_refs: [chk-1]",
      "approval_refs: [chk-1]",
      "evaluation_refs: []",
      "definition_of_done: Ready done loop has evidence.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop, done]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: [chk-1]",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Ready Done Loop",
    ].join("\n")
  );
  writeProjectionChild(root, "task-1", "task", "done");
  writeAcceptedDecision(root);
  writeFile(
    path.join(root, ".mdkg", "work", "chk-1-ready-done-evidence.md"),
    [
      "---",
      "id: chk-1",
      "type: checkpoint",
      "title: ready done evidence",
      "status: done",
      "priority: 1",
      "tags: [loop, done]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Ready Done Evidence",
    ].join("\n")
  );
}

function writeRunBearingLoop(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "loop-1-run-bearing-loop.md"),
    [
      "---",
      "id: loop-1",
      "type: loop",
      "title: Run-bearing loop",
      "status: progress",
      "priority: 1",
      "loop_mode: planning",
      "loop_role: run_bearing",
      "scope_refs: []",
      "scope_description: run evidence scope",
      "template_refs: []",
      "materialization_mode: planning_only",
      "child_refs: []",
      "run_refs: [chk-1]",
      "decision_refs: []",
      "output_refs: []",
      "approval_refs: []",
      "evaluation_refs: []",
      "definition_of_done: Run evidence remains inspectable.",
      "blocker_policy: spike_proposal_recommendation_continue",
      "tags: [loop, runs]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: [chk-1]",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Run-bearing Loop",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "chk-1-loop-run-evidence.md"),
    [
      "---",
      "id: chk-1",
      "type: checkpoint",
      "title: loop run evidence",
      "status: done",
      "priority: 1",
      "tags: [loop, runs]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [loop-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-07-06",
      "updated: 2026-07-06",
      "---",
      "",
      "# Loop Run Evidence",
    ].join("\n")
  );
}

function parseFrontmatterValue(value: string): string | string[] | boolean {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    return inner ? inner.split(",").map((item) => item.trim()) : [];
  }
  return value;
}

function readFrontmatter(filePath: string): Record<string, unknown> {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  assert.equal(lines[0], "---");
  assert.ok(end > 0);
  const frontmatter: Record<string, unknown> = {};
  for (const line of lines.slice(1, end)) {
    const colon = line.indexOf(":");
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    frontmatter[key] = parseFrontmatterValue(value);
  }
  return frontmatter;
}

function setIndexBackend(root: string, backend: "json" | "sqlite"): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
    index: { backend: string };
  };
  config.index.backend = backend;
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function setTemplateRoot(root: string, templateRoot: string): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
    templates: { root_path: string };
  };
  config.templates.root_path = templateRoot;
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function snapshotDirectory(root: string): Array<[string, string]> {
  const snapshot: Array<[string, string]> = [];
  const visit = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
        continue;
      }
      if (entry.isFile()) {
        snapshot.push([path.relative(root, absolutePath), fs.readFileSync(absolutePath).toString("base64")]);
      }
    }
  };
  visit(root);
  return snapshot;
}

test("loop fork default materializes scoped loop and linked child nodes", () => {
  const root = makeTempDir("mdkg-loop-fork-default-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeSeedLoop(root);
  writeGoal(root);

  const output = captureOutput(() =>
    runLoopForkCommand({
      root,
      template: "security-audit",
      scope: "goal-1",
      json: true,
      now: new Date("2026-07-06T12:00:00.000Z"),
    })
  );
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    loop: { id: string; path: string };
    materialization_mode: string;
    materialized_children: Array<{ id: string; path: string; type: string }>;
    readiness_requirements: {
      pre_run_questions: string[];
      required_decisions: Array<{ identity: string; binding_field: string; required_evidence: string }>;
      actions: {
        approval_gated: Array<{ identity: string; required: boolean; requested: boolean; binding_field: string }>;
        prohibited: string[];
      };
      evidence_lanes: Array<{ identity: string; evidence_binding_field: string }>;
      next_actions: string[];
    };
    blocker_continuation: {
      spike: { grounding: string[] };
      proposal: { minimum_viable_options: number; requires_recommended_path: boolean };
      blocker_evidence: { required_on_affected_nodes: boolean };
      continue_strategy: string;
      whole_loop_blocked_threshold: string;
    };
  };

  assert.equal(receipt.action, "forked");
  assert.equal(receipt.loop.id, "loop-1");
  assert.equal(receipt.materialization_mode, "default_children");
  assert.deepEqual(receipt.materialized_children.map((child) => child.type), ["spike", "task", "test"]);
  assert.deepEqual(receipt.readiness_requirements.pre_run_questions, [
    "external_advisory_checks_approved",
    "local_cache_writes_approved",
  ]);
  assert.deepEqual(
    receipt.readiness_requirements.required_decisions.map((decision) => decision.identity),
    receipt.readiness_requirements.pre_run_questions
  );
  assert.ok(receipt.readiness_requirements.required_decisions.every(
    (decision) => decision.binding_field === "question_answer_refs" && decision.required_evidence === "accepted decision ref"
  ));
  assert.deepEqual(receipt.readiness_requirements.actions.approval_gated, [{
    identity: "external_advisory_checks",
    required: false,
    requested: false,
    binding_field: "action_approval_refs",
  }]);
  assert.deepEqual(receipt.readiness_requirements.actions.prohibited, ["functional_changes"]);
  assert.deepEqual(
    receipt.readiness_requirements.evidence_lanes.map((lane) => lane.identity),
    ["source_security_review", "dependency_advisories"]
  );
  assert.ok(receipt.readiness_requirements.next_actions.some((action) => /accepted decision/.test(action)));
  assert.ok(receipt.readiness_requirements.next_actions.some((action) => /mdkg loop plan loop-1 --json/.test(action)));
  assert.ok(receipt.blocker_continuation.spike.grounding.includes("source"));
  assert.ok(receipt.blocker_continuation.spike.grounding.includes("web_when_current_external_facts_are_required"));
  assert.equal(receipt.blocker_continuation.proposal.minimum_viable_options, 3);
  assert.equal(receipt.blocker_continuation.proposal.requires_recommended_path, true);
  assert.equal(receipt.blocker_continuation.blocker_evidence.required_on_affected_nodes, true);
  assert.match(receipt.blocker_continuation.continue_strategy, /remaining loop scope/);
  assert.match(receipt.blocker_continuation.whole_loop_blocked_threshold, /repeated or global blockers/);

  const loopPath = path.join(root, receipt.loop.path);
  const loopFrontmatter = readFrontmatter(loopPath);
  assert.equal(loopFrontmatter.loop_role, "scoped");
  assert.equal(loopFrontmatter.loop_mode, "readonly");
  assert.deepEqual(loopFrontmatter.template_refs, ["template://loops/security-audit"]);
  assert.deepEqual(loopFrontmatter.scope_refs, ["root:goal-1"]);
  assert.deepEqual(loopFrontmatter.child_refs, receipt.materialized_children.map((child) => child.id));
  assert.deepEqual(loopFrontmatter.pre_run_questions, ["external_advisory_checks_approved", "local_cache_writes_approved"]);
  assert.deepEqual(loopFrontmatter.pre_approved_actions, ["read_source", "run_local_static_scans"]);
  assert.deepEqual(loopFrontmatter.question_answer_refs, []);
  assert.deepEqual(loopFrontmatter.approval_gated_actions, ["external_advisory_checks"]);
  assert.deepEqual(loopFrontmatter.required_actions, ["read_source", "run_local_static_scans"]);
  assert.deepEqual(loopFrontmatter.requested_actions, ["read_source", "run_local_static_scans"]);
  assert.deepEqual(loopFrontmatter.prohibited_actions, ["functional_changes"]);
  assert.deepEqual(loopFrontmatter.action_approval_refs, []);
  assert.deepEqual(loopFrontmatter.evidence_lanes, ["source_security_review", "dependency_advisories"]);
  assert.deepEqual(loopFrontmatter.evidence_lane_refs, []);
  assert.deepEqual(loopFrontmatter.lane_waiver_refs, []);
  assert.deepEqual(loopFrontmatter.lane_waiver_decision_refs, []);
  assert.deepEqual(loopFrontmatter.lane_waiver_approval_refs, []);
  assert.match(String((loopFrontmatter.artifacts as string[])[1]), /^template_hash=sha256:[a-f0-9]{64}$/);
  assert.match(fs.readFileSync(loopPath, "utf8"), /# Blocker Continuation Guidance/);

  for (const child of receipt.materialized_children) {
    const childFrontmatter = readFrontmatter(path.join(root, child.path));
    assert.equal(childFrontmatter.parent, "loop-1");
    assert.deepEqual(childFrontmatter.relates, ["loop-1"]);
    assert.deepEqual(childFrontmatter.context_refs, ["root:goal-1"]);
  }

  assert.doesNotThrow(() => runValidateCommand({ root, quiet: true }));
});

test("loop list show and plan report immutable template provenance states", () => {
  const root = makeTempDir("mdkg-loop-template-provenance-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeSeedLoop(root);
  writeGoal(root);
  const seedPath = path.join(root, ".mdkg", "templates", "loops", "security-audit.loop.md");
  const originalSeed = fs.readFileSync(seedPath, "utf8");

  const forkOutput = captureOutput(() =>
    runLoopForkCommand({
      root,
      template: "security-audit",
      scope: "goal-1",
      planningOnly: true,
      json: true,
      now: new Date("2026-07-06T12:00:00.000Z"),
    })
  );
  const forkReceipt = JSON.parse(forkOutput.stdout) as { loop: { id: string; path: string } };
  const forkPath = path.join(root, forkReceipt.loop.path);
  const originalFork = fs.readFileSync(forkPath, "utf8");

  const readStates = (): {
    list: Record<string, unknown>;
    show: Record<string, unknown>;
    plan: Record<string, unknown>;
  } => {
    const listed = JSON.parse(captureOutput(() => runLoopListCommand({ root, json: true })).stdout) as {
      catalog: { loops: Array<{ id: string; template_lineage: Record<string, unknown> }> };
    };
    const showed = JSON.parse(captureOutput(() =>
      runLoopShowCommand({ root, id: forkReceipt.loop.id, json: true })
    ).stdout) as { template_lineage: Record<string, unknown> };
    const planned = JSON.parse(captureOutput(() =>
      runLoopPlanCommand({ root, id: forkReceipt.loop.id, json: true })
    ).stdout) as { readiness: { template_lineage: { provenance: Record<string, unknown> } } };
    const listEntry = listed.catalog.loops.find((entry) => entry.id === forkReceipt.loop.id);
    assert.ok(listEntry);
    return {
      list: listEntry.template_lineage,
      show: showed.template_lineage,
      plan: planned.readiness.template_lineage.provenance,
    };
  };
  const assertState = (expected: string): Record<string, unknown> => {
    const states = readStates();
    assert.equal(states.list.state, expected);
    assert.equal(states.show.state, expected);
    assert.equal(states.plan.state, expected);
    assert.equal(fs.readFileSync(forkPath, "utf8"), originalFork);
    return states.plan;
  };

  assertState("current");

  fs.writeFileSync(seedPath, `${originalSeed}\n# Content drift\n`, "utf8");
  const stale = assertState("stale");
  assert.match(String(stale.warning), /content changed/);

  fs.unlinkSync(seedPath);
  const missing = assertState("missing_template");
  assert.match(String(missing.warning), /is missing/);

  const movedSeedPath = path.join(root, ".mdkg", "template-catalog", "loops", "security-audit.loop.md");
  writeFile(movedSeedPath, originalSeed);
  setTemplateRoot(root, ".mdkg/template-catalog");
  const moved = assertState("current");
  assert.equal(moved.path_changed, true);
  assert.equal(moved.current_path, ".mdkg/template-catalog/loops/security-audit.loop.md");

  const withoutHash = originalFork.replace(/, template_hash=sha256:[a-f0-9]{64}/, "");
  fs.writeFileSync(forkPath, withoutHash, "utf8");
  const unknownStates = readStates();
  assert.equal(unknownStates.list.state, "unknown");
  assert.equal(unknownStates.show.state, "unknown");
  assert.equal(unknownStates.plan.state, "unknown");
});

for (const backend of ["json", "sqlite"] as const) {
  test(`loop fork dry-run is observational with ${backend} indexing`, () => {
    const root = makeTempDir(`mdkg-loop-fork-dry-run-${backend}-`);
    writeRootConfig(root);
    setIndexBackend(root, backend);
    writeDefaultTemplates(root);
    writeSeedLoop(root);
    writeGoal(root);

    const mdkgDir = path.join(root, ".mdkg");
    const stateBefore = snapshotDirectory(mdkgDir);

    const dryRunOutput = captureOutput(() =>
      runLoopForkCommand({
        root,
        template: "security-audit",
        scope: "goal-1",
        dryRun: true,
        json: true,
        now: new Date("2026-07-06T12:00:00.000Z"),
      })
    );
    const dryRunReceipt = JSON.parse(dryRunOutput.stdout) as {
      action: string;
      dry_run: boolean;
      loop: { id: string };
      materialized_children: Array<{ id: string }>;
    };

    assert.equal(dryRunReceipt.action, "planned");
    assert.equal(dryRunReceipt.dry_run, true);
    assert.deepEqual(snapshotDirectory(mdkgDir), stateBefore);

    const forkOutput = captureOutput(() =>
      runLoopForkCommand({
        root,
        template: "security-audit",
        scope: "goal-1",
        json: true,
        now: new Date("2026-07-06T12:00:00.000Z"),
      })
    );
    const forkReceipt = JSON.parse(forkOutput.stdout) as {
      loop: { id: string };
      materialized_children: Array<{ id: string }>;
    };

    assert.equal(forkReceipt.loop.id, dryRunReceipt.loop.id);
    assert.deepEqual(
      forkReceipt.materialized_children.map((child) => child.id),
      dryRunReceipt.materialized_children.map((child) => child.id)
    );
  });
}

test("loop plan reports blocker continuation guidance", () => {
  const root = makeTempDir("mdkg-loop-plan-blockers-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeSeedLoop(root);

  const forkOutput = captureOutput(() =>
    runLoopForkCommand({
      root,
      template: "security-audit",
      scope: "src",
      planningOnly: true,
      json: true,
      now: new Date("2026-07-06T12:00:00.000Z"),
    })
  );
  const forkReceipt = JSON.parse(forkOutput.stdout) as { loop: { id: string } };

  const planOutput = captureOutput(() => runLoopPlanCommand({ root, id: forkReceipt.loop.id, json: true }));
  const planReceipt = JSON.parse(planOutput.stdout) as {
    blocker_continuation: {
      branch_blocker_steps: string[];
      proposal: { minimum_viable_options: number; requires_recommended_path: boolean };
      continue_strategy: string;
    };
  };
  assert.ok(planReceipt.blocker_continuation.branch_blocker_steps.some((step) => /source-grounded spike/.test(step)));
  assert.ok(planReceipt.blocker_continuation.branch_blocker_steps.some((step) => /web grounding/.test(step)));
  assert.equal(planReceipt.blocker_continuation.proposal.minimum_viable_options, 3);
  assert.equal(planReceipt.blocker_continuation.proposal.requires_recommended_path, true);
  assert.match(planReceipt.blocker_continuation.continue_strategy, /definition of done/);

  const textPlanOutput = captureOutput(() => runLoopPlanCommand({ root, id: forkReceipt.loop.id }));
  assert.match(textPlanOutput.stdout, /safe_to_run: read_source, run_local_static_scans/);
  assert.match(textPlanOutput.stdout, /approval_gated: external_advisory_checks/);
  assert.match(textPlanOutput.stdout, /required_actions: read_source, run_local_static_scans/);
  assert.match(textPlanOutput.stdout, /requested_actions: read_source, run_local_static_scans/);
  assert.match(textPlanOutput.stdout, /optional_actions: external_advisory_checks/);
  assert.match(textPlanOutput.stdout, /prohibited_actions: functional_changes/);
  assert.match(textPlanOutput.stdout, /pre_run_questions: external_advisory_checks_approved, local_cache_writes_approved/);
  assert.doesNotMatch(textPlanOutput.stdout, /pending_approvals:/);
  assert.match(textPlanOutput.stdout, /evidence_lanes: source_security_review:waiting, dependency_advisories:waiting/);
  assert.match(textPlanOutput.stdout, /closeout_ready: no/);
});

test("loop plan emits deterministic readiness projection", () => {
  const root = makeTempDir("mdkg-loop-readiness-projection-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeProjectionLoop(root);

  const output = captureOutput(() => runLoopPlanCommand({ root, id: "loop-1", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    readiness: {
      identity: { qid: string; mode: string; role: string };
      questions: {
        pre_run_questions: string[];
        unanswered_pre_run_questions: string[];
        items: Array<{ id: string; state: string; decision_refs: string[]; binding_source: string }>;
      };
      approvals: {
        pre_approved_actions: string[];
        approval_gated_actions: string[];
        required_actions: string[];
        requested_actions: string[];
        optional_actions: string[];
        prohibited_actions: string[];
        pending_approval_actions: string[];
        decision_refs: string[];
        approval_refs: string[];
        items: Array<{ id: string; state: string; approval_refs: string[]; binding_source: string }>;
      };
      references: {
        child_refs: string[];
        run_refs: string[];
        output_refs: string[];
        evidence_refs: string[];
        lane_waiver_refs: string[];
      };
      lanes: {
        children: Array<{ ref: string; state: string; qid?: string; status?: string }>;
        evidence: Array<{
          name: string;
          state: string;
          evidence_refs: string[];
          waiver_refs: string[];
          waiver_decision_refs: string[];
          waiver_approval_refs: string[];
          binding_source: string;
        }>;
      };
      blockers: { blocked_children: string[]; waiting_children: string[] };
      next_actions: string[];
      closeout: { ready: boolean; state: string; counts: Record<string, number>; missing: string[] };
    };
  };

  assert.equal(receipt.readiness.identity.qid, "root:loop-1");
  assert.equal(receipt.readiness.identity.mode, "readonly");
  assert.equal(receipt.readiness.identity.role, "scoped");
  assert.deepEqual(receipt.readiness.questions.pre_run_questions, ["scope_authority"]);
  assert.deepEqual(receipt.readiness.questions.unanswered_pre_run_questions, []);
  assert.deepEqual(receipt.readiness.questions.items, [{
    id: "scope_authority",
    state: "answered",
    decision_refs: ["dec-1"],
    binding_source: "explicit",
  }]);
  assert.deepEqual(receipt.readiness.approvals.pre_approved_actions, ["read_source"]);
  assert.deepEqual(receipt.readiness.approvals.approval_gated_actions, ["external_advisory_checks"]);
  assert.deepEqual(receipt.readiness.approvals.required_actions, ["read_source"]);
  assert.deepEqual(receipt.readiness.approvals.requested_actions, ["read_source", "external_advisory_checks"]);
  assert.deepEqual(receipt.readiness.approvals.optional_actions, []);
  assert.deepEqual(receipt.readiness.approvals.prohibited_actions, ["functional_changes"]);
  assert.deepEqual(receipt.readiness.approvals.pending_approval_actions, []);
  assert.deepEqual(receipt.readiness.approvals.decision_refs, ["dec-1"]);
  assert.deepEqual(receipt.readiness.approvals.approval_refs, ["chk-1"]);
  assert.deepEqual(receipt.readiness.references.child_refs, ["task-1", "task-2", "test-1", "spike-1", "missing-child"]);
  assert.deepEqual(receipt.readiness.references.run_refs, ["chk-1"]);
  assert.deepEqual(receipt.readiness.references.output_refs, ["prop-1"]);
  assert.deepEqual(receipt.readiness.references.evidence_refs, ["root:chk-1"]);
  assert.deepEqual(receipt.readiness.references.lane_waiver_refs, ["dec-1"]);
  assert.deepEqual(
    receipt.readiness.lanes.children.map((lane) => [lane.ref, lane.state]),
    [
      ["task-1", "completed"],
      ["task-2", "blocked"],
      ["test-1", "waiting"],
      ["spike-1", "actionable"],
      ["missing-child", "missing"],
    ]
  );
  assert.equal(receipt.readiness.lanes.evidence[0]?.name, "source_review");
  assert.equal(receipt.readiness.lanes.evidence[0]?.state, "waived");
  assert.deepEqual(receipt.readiness.lanes.evidence[0]?.evidence_refs, ["chk-1"]);
  assert.deepEqual(receipt.readiness.lanes.evidence[0]?.waiver_decision_refs, ["dec-1"]);
  assert.deepEqual(receipt.readiness.lanes.evidence[0]?.waiver_approval_refs, ["chk-1"]);
  assert.equal(receipt.readiness.lanes.evidence[0]?.binding_source, "explicit");
  assert.deepEqual(receipt.readiness.blockers.blocked_children, ["root:task-2"]);
  assert.deepEqual(receipt.readiness.blockers.waiting_children, ["root:test-1"]);
  assert.equal(receipt.readiness.closeout.ready, false);
  assert.equal(receipt.readiness.closeout.state, "not_ready");
  assert.deepEqual(receipt.readiness.closeout.counts, {
    completed: 1,
    blocked: 1,
    waiting: 1,
    waived: 1,
    actionable: 1,
    missing: 1,
  });
  assert.ok(receipt.readiness.closeout.missing.includes("resolve or waive blocked child lanes"));
  assert.ok(receipt.readiness.closeout.missing.includes("complete actionable child lanes"));
  assert.ok(receipt.readiness.closeout.missing.includes("repair missing child refs"));
  assert.ok(receipt.readiness.next_actions.some((action) => /blocker recovery/.test(action)));
});

test("loop readiness binds decisions approvals evidence and waivers to stable identities", () => {
  const root = makeTempDir("mdkg-loop-identity-readiness-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeIdentityScopedLoop(root);

  const readPlan = (): any => {
    const output = captureOutput(() => runLoopPlanCommand({ root, id: "loop-1", json: true }));
    return JSON.parse(output.stdout).readiness;
  };

  const readiness = readPlan();
  assert.deepEqual(
    readiness.questions.items.map((item: any) => [item.id, item.state, item.decision_refs]),
    [
      ["scope_authority", "answered", ["dec-1"]],
      ["external_scope", "unanswered", []],
    ]
  );
  assert.deepEqual(readiness.questions.unanswered_pre_run_questions, ["external_scope"]);
  assert.deepEqual(
    readiness.approvals.items.map((item: any) => [item.id, item.state, item.approval_refs]),
    [
      ["external_advisory_checks", "approved", ["chk-1"]],
      ["provider_scan", "optional", []],
    ]
  );
  assert.deepEqual(readiness.approvals.pending_approval_actions, []);
  assert.deepEqual(readiness.approvals.optional_actions, ["provider_scan"]);
  assert.deepEqual(
    readiness.lanes.evidence.map((lane: any) => [lane.name, lane.state, lane.evidence_refs]),
    [
      ["source_review", "completed", ["chk-1"]],
      ["dependency_review", "waiting", []],
    ]
  );
  assert.deepEqual(readiness.invalid_bindings, []);

  const loopPath = path.join(root, ".mdkg", "work", "loop-1-identity-scoped-loop.md");
  fs.writeFileSync(
    loopPath,
    fs.readFileSync(loopPath, "utf8")
      .replace("lane_waiver_refs: []", "lane_waiver_refs: [dec-2]")
      .replace("lane_waiver_decision_refs: []", "lane_waiver_decision_refs: [dependency_review=dec-2]")
  );
  assert.throws(() => readPlan(), /lane waiver dependency_review requires both decision and approval bindings/);

  fs.writeFileSync(
    loopPath,
    fs.readFileSync(loopPath, "utf8").replace(
      "lane_waiver_approval_refs: []",
      "lane_waiver_approval_refs: [dependency_review=chk-2]"
    )
  );
  const completeWaiver = readPlan();
  assert.equal(completeWaiver.lanes.evidence[1]?.state, "waived");
  assert.deepEqual(completeWaiver.lanes.evidence[1]?.waiver_decision_refs, ["dec-2"]);
  assert.deepEqual(completeWaiver.lanes.evidence[1]?.waiver_approval_refs, ["chk-2"]);
  assert.deepEqual(completeWaiver.invalid_bindings, []);
});

test("loop plan reports done loops as closeout-ready when lanes are complete", () => {
  const root = makeTempDir("mdkg-loop-plan-ready-done-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeReadyDoneLoop(root);

  const output = captureOutput(() => runLoopPlanCommand({ root, id: "loop-1", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    readiness: {
      closeout: { ready: boolean; state: string; missing: string[]; counts: Record<string, number> };
      lanes: { children: Array<{ state: string }>; evidence: Array<{ state: string }> };
      next_actions: string[];
    };
  };

  assert.equal(receipt.readiness.closeout.ready, true);
  assert.equal(receipt.readiness.closeout.state, "ready");
  assert.deepEqual(receipt.readiness.closeout.missing, []);
  assert.deepEqual(receipt.readiness.lanes.children.map((lane) => lane.state), ["completed"]);
  assert.deepEqual(receipt.readiness.lanes.evidence.map((lane) => lane.state), ["completed"]);
  assert.equal(receipt.readiness.closeout.counts.completed, 2);
  assert.deepEqual(receipt.readiness.next_actions, [
    "close the loop when final validation and closeout evidence are recorded",
  ]);

  const textOutput = captureOutput(() => runLoopPlanCommand({ root, id: "loop-1" }));
  assert.match(textOutput.stdout, /readiness: ready/);
  assert.match(textOutput.stdout, /closeout_ready: yes/);
  assert.match(textOutput.stdout, /missing: none/);
});

test("loop next selects actionable child and explains skipped lanes without mutating work", () => {
  const root = makeTempDir("mdkg-loop-next-routing-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeProjectionLoop(root);
  const loopPath = path.join(root, ".mdkg", "work", "loop-1-projection-loop.md");
  fs.writeFileSync(
    loopPath,
    fs.readFileSync(loopPath, "utf8")
      .replace("action_approval_refs: [external_advisory_checks=chk-1]", "action_approval_refs: []")
      .replace("lane_waiver_refs: [dec-1]", "lane_waiver_refs: []")
      .replace("lane_waiver_decision_refs: [source_review=dec-1]", "lane_waiver_decision_refs: []")
      .replace("lane_waiver_approval_refs: [source_review=chk-1]", "lane_waiver_approval_refs: []")
      .replace("approval_refs: [chk-1]", "approval_refs: []")
  );
  const before = fs.readFileSync(loopPath, "utf8");

  const output = captureOutput(() => runLoopNextCommand({ root, id: "loop-1", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    selected: { kind: string; qid: string; ref: string; state: string; reason: string };
    rationale: string;
    skipped: Array<{ ref: string; state: string; reason: string }>;
    readiness: { pending_approval_actions: string[] };
  };

  assert.equal(receipt.action, "selected");
  assert.equal(receipt.selected.kind, "child");
  assert.equal(receipt.selected.qid, "root:spike-1");
  assert.equal(receipt.selected.ref, "spike-1");
  assert.equal(receipt.selected.state, "actionable");
  assert.match(receipt.selected.reason, /actionable child lane/);
  assert.match(receipt.rationale, /unblocked actionable child lane/);
  assert.deepEqual(receipt.readiness.pending_approval_actions, ["external_advisory_checks"]);
  assert.ok(receipt.skipped.some((entry) =>
    entry.ref === "external_advisory_checks" &&
    entry.state === "approval_pending" &&
    /another child lane is actionable/.test(entry.reason)
  ));
  assert.ok(receipt.skipped.some((entry) => entry.ref === "root:task-2" && entry.state === "blocked"));
  assert.ok(receipt.skipped.some((entry) => entry.ref === "root:test-1" && entry.state === "waiting"));
  assert.equal(fs.readFileSync(loopPath, "utf8"), before);

  const textOutput = captureOutput(() => runLoopNextCommand({ root, id: "loop-1" }));
  assert.match(textOutput.stdout, /loop next: root:loop-1/);
  assert.match(textOutput.stdout, /selected: child root:spike-1/);
  assert.match(textOutput.stdout, /reason: first unblocked actionable child lane/);
});

test("loop next exhausts nested goal work and recovery before whole-loop blocking", () => {
  const root = makeTempDir("mdkg-loop-next-goal-exhaustion-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeGoalRoutingLoop(root);

  const readNext = (): any => {
    const output = captureOutput(() => runLoopNextCommand({ root, id: "loop-1", json: true }));
    return JSON.parse(output.stdout);
  };

  const actionable = readNext();
  assert.equal(actionable.selected.kind, "child");
  assert.equal(actionable.selected.qid, "root:goal-3");
  assert.equal(actionable.exhaustion.authorized_work_remaining, true);
  assert.equal(actionable.exhaustion.whole_loop_blocked, false);
  assert.ok(actionable.skipped.some((entry: any) =>
    entry.ref === "scope_authority" && /does not gate this pre-approved child lane/.test(entry.reason)
  ));

  const goal3Path = path.join(root, ".mdkg", "work", "goal-3-loop-child-goal.md");
  fs.writeFileSync(
    goal3Path,
    fs.readFileSync(goal3Path, "utf8")
      .replace("status: progress", "status: done")
      .replace("goal_state: paused", "goal_state: achieved")
  );
  const recovery = readNext();
  assert.equal(recovery.selected.kind, "recovery");
  assert.equal(recovery.selected.qid, "root:goal-1");
  assert.equal(recovery.exhaustion.authorized_work_remaining, true);
  assert.equal(recovery.exhaustion.whole_loop_blocked, false);

  const goal1Path = path.join(root, ".mdkg", "work", "goal-1-loop-child-goal.md");
  fs.writeFileSync(
    goal1Path,
    fs.readFileSync(goal1Path, "utf8")
      .replace("status: blocked", "status: done")
      .replace("goal_state: paused", "goal_state: achieved")
  );
  const decision = readNext();
  assert.equal(decision.selected.kind, "lane");
  assert.equal(decision.selected.ref, "scope_authority");
  assert.equal(decision.exhaustion.decision_or_evidence_path_remaining, true);
  assert.equal(decision.exhaustion.whole_loop_blocked, false);

  writeAcceptedDecision(root);
  const loopPath = path.join(root, ".mdkg", "work", "loop-1-goal-routing-loop.md");
  fs.writeFileSync(
    loopPath,
    fs.readFileSync(loopPath, "utf8")
      .replace("question_answer_refs: []", "question_answer_refs: [scope_authority=dec-1]")
      .replace("\ndecision_refs: []", "\ndecision_refs: [dec-1]")
  );
  const exhausted = readNext();
  assert.equal(exhausted.selected.kind, "closeout");
  assert.equal(exhausted.exhaustion.authorized_work_remaining, false);
  assert.equal(exhausted.exhaustion.decision_or_evidence_path_remaining, false);
  assert.equal(exhausted.exhaustion.whole_loop_blocked, true);
  assert.match(exhausted.selected.reason, /resolve loop blockers/);
});

test("loop next returns no actionable node for closeout-ready done loops", () => {
  const root = makeTempDir("mdkg-loop-next-done-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeReadyDoneLoop(root);

  const output = captureOutput(() => runLoopNextCommand({ root, id: "loop-1", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    selected: null;
    rationale: string;
    readiness: { closeout: { ready: boolean; missing: string[] } };
  };

  assert.equal(receipt.selected, null);
  assert.match(receipt.rationale, /closeout is ready/);
  assert.equal(receipt.readiness.closeout.ready, true);
  assert.deepEqual(receipt.readiness.closeout.missing, []);
});

test("loop fork planning-only creates only scoped loop shell", () => {
  const root = makeTempDir("mdkg-loop-fork-planning-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeSeedLoop(root);

  const output = captureOutput(() =>
    runLoopForkCommand({
      root,
      template: "security-audit",
      scope: "packages/api",
      planningOnly: true,
      json: true,
      now: new Date("2026-07-06T12:00:00.000Z"),
    })
  );
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    loop: { path: string };
    materialization_mode: string;
    materialized_children: unknown[];
    pending_materialization: string[];
  };

  assert.equal(receipt.action, "forked");
  assert.equal(receipt.materialization_mode, "planning_only");
  assert.equal(receipt.materialized_children.length, 0);
  assert.equal(receipt.pending_materialization.length, 1);

  const workFiles = fs.readdirSync(path.join(root, ".mdkg", "work")).filter((entry) => entry.endsWith(".md"));
  assert.equal(workFiles.length, 1);
  const loopFrontmatter = readFrontmatter(path.join(root, receipt.loop.path));
  assert.equal(loopFrontmatter.scope_description, "packages/api");
  assert.deepEqual(loopFrontmatter.scope_refs, []);
  assert.deepEqual(loopFrontmatter.child_refs, []);

  assert.doesNotThrow(() => runValidateCommand({ root, quiet: true }));
});

test("loop list and show expose reusable seed templates", () => {
  const root = makeTempDir("mdkg-loop-list-show-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeSeedLoop(root);

  const listOutput = captureOutput(() => runLoopListCommand({ root, json: true }));
  const listReceipt = JSON.parse(listOutput.stdout) as {
    templates: Array<{
      ref: string;
      title: string;
      mode: string;
      role: string;
      tags: string[];
      default_materialization: string;
      purpose: string;
    }>;
    catalog: {
      templates: Array<{ ref: string; mode: string; role: string; default_materialization: string; purpose: string }>;
    };
  };
  assert.deepEqual(listReceipt.templates.map((template) => template.ref), ["template://loops/security-audit"]);
  assert.equal(listReceipt.templates[0]?.title, "Security Audit");
  assert.equal(listReceipt.templates[0]?.mode, "readonly");
  assert.equal(listReceipt.templates[0]?.role, "template");
  assert.deepEqual(listReceipt.templates[0]?.tags, ["loop-template", "audit", "security"]);
  assert.equal(listReceipt.templates[0]?.default_materialization, "default_children");
  assert.equal(listReceipt.templates[0]?.purpose, "Run a read-only security audit.");
  assert.equal(listReceipt.catalog.templates[0]?.ref, "template://loops/security-audit");
  assert.equal(listReceipt.catalog.templates[0]?.mode, "readonly");

  const textListOutput = captureOutput(() => runLoopListCommand({ root }));
  assert.match(textListOutput.stdout, /seed loop template/);
  assert.match(textListOutput.stdout, /mode=readonly role=template materialization=default_children/);
  assert.match(textListOutput.stdout, /tags=loop-template,audit,security/);
  assert.match(textListOutput.stdout, /purpose=Run a read-only security audit\./);

  captureOutput(() =>
    runLoopForkCommand({
      root,
      template: "security-audit",
      scope: "packages/api",
      planningOnly: true,
      json: true,
      now: new Date("2026-07-06T12:00:00.000Z"),
    })
  );
  const scopedListOutput = captureOutput(() => runLoopListCommand({ root, json: true }));
  const scopedListReceipt = JSON.parse(scopedListOutput.stdout) as {
    catalog: {
      loops: Array<{
        qid: string;
        mode: string;
        role: string;
        materialization_mode: string;
        scope_description: string;
      }>;
    };
  };
  assert.equal(scopedListReceipt.catalog.loops[0]?.qid, "root:loop-1");
  assert.equal(scopedListReceipt.catalog.loops[0]?.mode, "readonly");
  assert.equal(scopedListReceipt.catalog.loops[0]?.role, "scoped");
  assert.equal(scopedListReceipt.catalog.loops[0]?.materialization_mode, "planning_only");
  assert.equal(scopedListReceipt.catalog.loops[0]?.scope_description, "packages/api");

  const scopedTextOutput = captureOutput(() => runLoopListCommand({ root }));
  assert.match(scopedTextOutput.stdout, /root:loop-1 \| loop/);
  assert.match(scopedTextOutput.stdout, /mode=readonly role=scoped materialization=planning_only/);
  assert.match(scopedTextOutput.stdout, /scope=packages\/api/);

  const showOutput = captureOutput(() => runLoopShowCommand({ root, id: "security-audit", json: true }));
  const showReceipt = JSON.parse(showOutput.stdout) as {
    template: { ref: string; body: string; frontmatter: { loop_role: string } };
  };
  assert.equal(showReceipt.template.ref, "template://loops/security-audit");
  assert.equal(showReceipt.template.frontmatter.loop_role, "template");
  assert.match(showReceipt.template.body, /read-only security audit/);
});

for (const backend of ["json", "sqlite"] as const) {
  test(`loop read commands rebuild missing and stale ${backend} indexes without persistence`, () => {
    const root = makeTempDir(`mdkg-loop-read-purity-${backend}-`);
    writeRootConfig(root);
    setIndexBackend(root, backend);
    writeDefaultTemplates(root);
    writeSeedLoop(root);
    writeLoopNode(root, 1);

    const readCommands = [
      () => runLoopListCommand({ root, json: true }),
      () => runLoopShowCommand({ root, id: "loop-1", json: true }),
      () => runLoopPlanCommand({ root, id: "loop-1", json: true }),
      () => runLoopNextCommand({ root, id: "loop-1", json: true }),
      () => runLoopRunsCommand({ root, id: "loop-1", json: true }),
    ];

    for (const command of readCommands) {
      const stateBefore = snapshotDirectory(path.join(root, ".mdkg"));
      captureOutput(command);
      assert.deepEqual(snapshotDirectory(path.join(root, ".mdkg")), stateBefore);
    }

    captureOutput(() => runIndexCommand({ root }));
    const loopPath = path.join(root, ".mdkg", "work", "loop-1-discovery-loop-1.md");
    fs.appendFileSync(loopPath, "\n", "utf8");

    for (const command of readCommands) {
      const stateBefore = snapshotDirectory(path.join(root, ".mdkg"));
      captureOutput(command);
      assert.deepEqual(snapshotDirectory(path.join(root, ".mdkg")), stateBefore);
    }
  });
}

test("loop runs reports structured run and evidence refs without executing agents", () => {
  const root = makeTempDir("mdkg-loop-runs-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeRunBearingLoop(root);

  const output = captureOutput(() => runLoopRunsCommand({ root, id: "loop-1", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    loop: { qid: string; type: string };
    run_refs: string[];
    evidence_refs: string[];
  };

  assert.equal(receipt.action, "listed");
  assert.equal(receipt.loop.qid, "root:loop-1");
  assert.equal(receipt.loop.type, "loop");
  assert.deepEqual(receipt.run_refs, ["chk-1"]);
  assert.deepEqual(receipt.evidence_refs, ["root:chk-1"]);
});

test("generic discovery surfaces index search show and list loop nodes with bounded json", () => {
  const root = makeTempDir("mdkg-loop-discovery-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  for (let index = 1; index <= 55; index += 1) {
    writeLoopNode(root, index);
  }

  const searchOutput = captureOutput(() => runSearchCommand({ root, query: "loop", json: true }));
  const searchReceipt = JSON.parse(searchOutput.stdout) as {
    count: number;
    returned_count: number;
    limit: number;
    truncated: boolean;
    items: Array<{ qid: string; type: string; attributes: { loop_mode?: string } }>;
  };
  assert.equal(searchReceipt.count, 55);
  assert.equal(searchReceipt.returned_count, 50);
  assert.equal(searchReceipt.limit, 50);
  assert.equal(searchReceipt.truncated, true);
  assert.equal(searchReceipt.items.length, 50);
  assert.ok(searchReceipt.items.every((item) => item.type === "loop"));

  const limitedSearch = captureOutput(() => runSearchCommand({ root, query: "loop", limit: 3, json: true }));
  const limitedReceipt = JSON.parse(limitedSearch.stdout) as { returned_count: number; limit: number; truncated: boolean };
  assert.equal(limitedReceipt.returned_count, 3);
  assert.equal(limitedReceipt.limit, 3);
  assert.equal(limitedReceipt.truncated, true);

  const listOutput = captureOutput(() => runListCommand({ root, type: "loop", json: true }));
  const listReceipt = JSON.parse(listOutput.stdout) as { count: number; items: Array<{ type: string }> };
  assert.equal(listReceipt.count, 55);
  assert.ok(listReceipt.items.every((item) => item.type === "loop"));

  const showOutput = captureOutput(() => runShowCommand({ root, id: "loop-1", json: true }));
  const showReceipt = JSON.parse(showOutput.stdout) as { item: { type: string; attributes: { loop_mode?: string } } };
  assert.equal(showReceipt.item.type, "loop");
  assert.equal(showReceipt.item.attributes.loop_mode, "planning");
});
