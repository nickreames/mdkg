import { test } from "node:test";
import assert from "node:assert/strict";
const { parseNode } = require("../../graph/node");

function makeSchema(type: string, keys: string[], listKeys: string[]): any {
  const keyKinds: Record<string, string> = {};
  const listSet = new Set(listKeys);
  for (const key of keys) {
    keyKinds[key] = listSet.has(key) ? "list" : "scalar";
  }
  return {
    type,
    allowedKeys: new Set(keys),
    keyKinds,
    listKeys: listSet,
  };
}

const TEMPLATE_SCHEMAS = {
  rule: makeSchema(
    "rule",
    [
      "id",
      "type",
      "title",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "refs",
      "aliases",
      "created",
      "updated",
    ],
    ["tags", "owners", "links", "artifacts", "relates", "refs", "aliases"]
  ),
  task: makeSchema(
    "task",
    [
      "id",
      "type",
      "title",
      "status",
      "priority",
      "epic",
      "parent",
      "prev",
      "next",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "context_refs",
      "evidence_refs",
      "aliases",
      "skills",
      "created",
      "updated",
    ],
    ["tags", "owners", "links", "artifacts", "relates", "blocked_by", "blocks", "refs", "context_refs", "evidence_refs", "aliases", "skills"]
  ),
  spike: makeSchema(
    "spike",
    [
      "id",
      "type",
      "title",
      "status",
      "priority",
      "epic",
      "parent",
      "prev",
      "next",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "context_refs",
      "evidence_refs",
      "aliases",
      "skills",
      "created",
      "updated",
    ],
    ["tags", "owners", "links", "artifacts", "relates", "blocked_by", "blocks", "refs", "context_refs", "evidence_refs", "aliases", "skills"]
  ),
  loop: makeSchema(
    "loop",
    [
      "id",
      "type",
      "title",
      "status",
      "priority",
      "loop_mode",
      "loop_role",
      "scope_refs",
      "scope_description",
      "template_refs",
      "materialization_mode",
      "child_refs",
      "pre_run_questions",
      "question_answer_refs",
      "pre_approved_actions",
      "approval_gated_actions",
      "required_actions",
      "requested_actions",
      "prohibited_actions",
      "action_approval_refs",
      "evidence_lanes",
      "evidence_lane_refs",
      "lane_waiver_refs",
      "lane_waiver_decision_refs",
      "lane_waiver_approval_refs",
      "run_refs",
      "decision_refs",
      "output_refs",
      "approval_refs",
      "evaluation_refs",
      "definition_of_done",
      "blocker_policy",
      "epic",
      "parent",
      "prev",
      "next",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "context_refs",
      "evidence_refs",
      "aliases",
      "skills",
      "created",
      "updated",
    ],
    [
      "scope_refs",
      "template_refs",
      "child_refs",
      "pre_run_questions",
      "question_answer_refs",
      "pre_approved_actions",
      "approval_gated_actions",
      "required_actions",
      "requested_actions",
      "prohibited_actions",
      "action_approval_refs",
      "evidence_lanes",
      "evidence_lane_refs",
      "lane_waiver_refs",
      "lane_waiver_decision_refs",
      "lane_waiver_approval_refs",
      "run_refs",
      "decision_refs",
      "output_refs",
      "approval_refs",
      "evaluation_refs",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "context_refs",
      "evidence_refs",
      "aliases",
      "skills",
    ]
  ),
  goal: makeSchema(
    "goal",
    [
      "id",
      "type",
      "title",
      "status",
      "priority",
      "goal_state",
      "goal_condition",
      "scope_refs",
      "active_node",
      "last_active_node",
      "required_skills",
      "required_checks",
      "max_iterations",
      "blocked_after_attempts",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "context_refs",
      "evidence_refs",
      "aliases",
      "skills",
      "created",
      "updated",
    ],
    [
      "required_skills",
      "required_checks",
      "scope_refs",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "context_refs",
      "evidence_refs",
      "aliases",
      "skills",
    ]
  ),
  dec: makeSchema(
    "dec",
    [
      "id",
      "type",
      "title",
      "status",
      "supersedes",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "refs",
      "aliases",
      "created",
      "updated",
    ],
    ["tags", "owners", "links", "artifacts", "relates", "refs", "aliases"]
  ),
};

const PARSE_OPTIONS = {
  workStatusEnum: ["backlog", "blocked", "todo", "progress", "review", "done"],
  priorityMin: 0,
  priorityMax: 9,
  templateSchemas: TEMPLATE_SCHEMAS,
};

function taskFrontmatterWithPriority(priorityLine: string): string {
  const frontmatter = [
    "---",
    "id: task-1",
    "type: task",
    "title: do the thing",
    "status: todo",
    priorityLine,
    "tags: [a]",
    "links: []",
    "artifacts: []",
    "relates: [task-2]",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
  ];
  return frontmatter.concat(["---", "", "Body"]).join("\n");
}

test("parseNode parses a valid task", () => {
  const node = parseNode(taskFrontmatterWithPriority("priority: 2"), "task.md", PARSE_OPTIONS);
  assert.equal(node.id, "task-1");
  assert.equal(node.status, "todo");
  assert.equal(node.priority, 2);
  assert.deepEqual(node.edges.relates, ["task-2"]);
});

test("parseNode parses spike work frontmatter", () => {
  const content = [
    "---",
    "id: spike-1",
    "type: spike",
    "title: research launch docs",
    "status: todo",
    "priority: 1",
    "tags: [research]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: [task-1]",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: [author-mdkg-skill]",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    "",
    "# Research Question",
  ].join("\n");
  const node = parseNode(content, "spike.md", PARSE_OPTIONS);
  assert.equal(node.id, "spike-1");
  assert.equal(node.type, "spike");
  assert.equal(node.status, "todo");
  assert.equal(node.priority, 1);
  assert.deepEqual(node.edges.relates, ["task-1"]);
  assert.deepEqual(node.skills, ["author-mdkg-skill"]);
});

test("parseNode rejects malformed spike work status", () => {
  const content = [
    "---",
    "id: spike-1",
    "type: spike",
    "title: bad spike",
    "status: researching",
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
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "bad-spike.md", PARSE_OPTIONS), /status must be one of/);
});

test("parseNode parses loop frontmatter and attributes", () => {
  const content = [
    "---",
    "id: loop-1",
    "type: loop",
    "title: security audit loop",
    "status: todo",
    "priority: 1",
    "loop_mode: readonly",
    "loop_role: template",
    "scope_refs: [goal-1]",
    "scope_description: repo security scope",
    "template_refs: []",
    "materialization_mode: default_children",
    "child_refs: [spike-1, task-2]",
    "pre_run_questions: [scope_authority, local_checks_approved]",
    "question_answer_refs: [scope_authority=dec-1]",
    "pre_approved_actions: [read_source, run_local_checks]",
    "approval_gated_actions: [functional_changes, external_calls]",
    "required_actions: [read_source, run_local_checks]",
    "requested_actions: [read_source, run_local_checks, external_calls]",
    "prohibited_actions: [push_publish_deploy]",
    "action_approval_refs: [external_calls=chk-1]",
    "evidence_lanes: [source_review, closeout]",
    "evidence_lane_refs: [source_review=archive://audit-report]",
    "lane_waiver_refs: [dec-2]",
    "lane_waiver_decision_refs: [closeout=dec-2]",
    "lane_waiver_approval_refs: [closeout=chk-1]",
    "run_refs: []",
    "decision_refs: [dec-1, dec-2]",
    "output_refs: [archive://audit-report]",
    "approval_refs: [chk-1]",
    "evaluation_refs: [test-1]",
    "definition_of_done: risks reviewed with evidence",
    "blocker_policy: spike_proposal_recommendation_continue",
    "tags: [audit]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: [goal-1]",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "context_refs: []",
    "evidence_refs: []",
    "aliases: [security-loop]",
    "skills: [select-work-and-ground-context]",
    "created: 2026-07-06",
    "updated: 2026-07-06",
    "---",
    "",
    "# Operating Model",
  ].join("\n");
  const node = parseNode(content, "loop.md", PARSE_OPTIONS);
  assert.equal(node.id, "loop-1");
  assert.equal(node.type, "loop");
  assert.equal(node.status, "todo");
  assert.equal(node.priority, 1);
  assert.deepEqual(node.edges.relates, ["goal-1"]);
  assert.deepEqual(node.skills, ["select-work-and-ground-context"]);
  assert.deepEqual(node.attributes.loop_mode, "readonly");
  assert.deepEqual(node.attributes.loop_role, "template");
  assert.deepEqual(node.attributes.child_refs, ["spike-1", "task-2"]);
  assert.deepEqual(node.attributes.pre_run_questions, ["scope_authority", "local_checks_approved"]);
  assert.deepEqual(node.attributes.question_answer_refs, ["scope_authority=dec-1"]);
  assert.deepEqual(node.attributes.pre_approved_actions, ["read_source", "run_local_checks"]);
  assert.deepEqual(node.attributes.approval_gated_actions, ["functional_changes", "external_calls"]);
  assert.deepEqual(node.attributes.required_actions, ["read_source", "run_local_checks"]);
  assert.deepEqual(node.attributes.requested_actions, ["read_source", "run_local_checks", "external_calls"]);
  assert.deepEqual(node.attributes.prohibited_actions, ["push_publish_deploy"]);
  assert.deepEqual(node.attributes.action_approval_refs, ["external_calls=chk-1"]);
  assert.deepEqual(node.attributes.evidence_lanes, ["source_review", "closeout"]);
  assert.deepEqual(node.attributes.evidence_lane_refs, ["source_review=archive://audit-report"]);
  assert.deepEqual(node.attributes.lane_waiver_refs, ["dec-2"]);
  assert.deepEqual(node.attributes.lane_waiver_decision_refs, ["closeout=dec-2"]);
  assert.deepEqual(node.attributes.lane_waiver_approval_refs, ["closeout=chk-1"]);
  assert.deepEqual(node.attributes.output_refs, ["archive://audit-report"]);
  assert.equal(node.attributes.blocker_policy, "spike_proposal_recommendation_continue");
});

test("parseNode accepts legacy loop frontmatter without readiness metadata", () => {
  const content = [
    "---",
    "id: loop-1",
    "type: loop",
    "title: legacy loop",
    "status: todo",
    "priority: 1",
    "loop_mode: planning",
    "loop_role: scoped",
    "scope_refs: []",
    "scope_description: legacy scope",
    "template_refs: []",
    "materialization_mode: planning_only",
    "child_refs: []",
    "run_refs: []",
    "decision_refs: []",
    "output_refs: []",
    "approval_refs: []",
    "evaluation_refs: []",
    "definition_of_done: legacy loop remains valid",
    "blocker_policy: spike_proposal_recommendation_continue",
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
  ].join("\n");
  const node = parseNode(content, "legacy-loop.md", PARSE_OPTIONS);
  assert.equal(node.type, "loop");
  assert.equal(node.attributes.pre_run_questions, undefined);
});

test("parseNode rejects scalar loop readiness metadata", () => {
  const content = [
    "---",
    "id: loop-1",
    "type: loop",
    "title: invalid readiness loop",
    "status: todo",
    "priority: 1",
    "loop_mode: planning",
    "loop_role: scoped",
    "scope_refs: []",
    "scope_description: readiness scope",
    "template_refs: []",
    "materialization_mode: planning_only",
    "child_refs: []",
    "pre_run_questions: scope_authority",
    "run_refs: []",
    "decision_refs: []",
    "output_refs: []",
    "approval_refs: []",
    "evaluation_refs: []",
    "definition_of_done: done",
    "blocker_policy: spike_proposal_recommendation_continue",
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
  ].join("\n");
  assert.throws(() => parseNode(content, "invalid-readiness-loop.md", PARSE_OPTIONS), /pre_run_questions must be a list/);
});

test("parseNode rejects malformed loop lane waiver refs", () => {
  const content = [
    "---",
    "id: loop-1",
    "type: loop",
    "title: invalid waiver loop",
    "status: todo",
    "priority: 1",
    "loop_mode: planning",
    "loop_role: scoped",
    "scope_refs: []",
    "scope_description: waiver scope",
    "template_refs: []",
    "materialization_mode: planning_only",
    "child_refs: []",
    "lane_waiver_refs: [bad ref]",
    "run_refs: []",
    "decision_refs: []",
    "output_refs: []",
    "approval_refs: []",
    "evaluation_refs: []",
    "definition_of_done: done",
    "blocker_policy: spike_proposal_recommendation_continue",
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
  ].join("\n");
  assert.throws(() => parseNode(content, "invalid-waiver-loop.md", PARSE_OPTIONS), /lane_waiver_refs\[0\] must be a portable id, qid, or URI ref/);
});

test("parseNode validates loop readiness binding identities and aggregate refs", () => {
  const content = [
    "---",
    "id: loop-1",
    "type: loop",
    "title: bound loop",
    "status: todo",
    "priority: 1",
    "loop_mode: readonly",
    "loop_role: scoped",
    "scope_refs: []",
    "scope_description: bound scope",
    "template_refs: []",
    "materialization_mode: planning_only",
    "child_refs: []",
    "pre_run_questions: [scope_authority]",
    "question_answer_refs: [scope_authority=dec-1]",
    "pre_approved_actions: [read_source]",
    "approval_gated_actions: [external_checks]",
    "required_actions: [read_source]",
    "requested_actions: [read_source, external_checks]",
    "prohibited_actions: [functional_changes]",
    "action_approval_refs: [external_checks=chk-1]",
    "evidence_lanes: [source_review]",
    "evidence_lane_refs: [source_review=chk-1]",
    "lane_waiver_refs: []",
    "lane_waiver_decision_refs: []",
    "lane_waiver_approval_refs: []",
    "run_refs: [chk-1]",
    "decision_refs: [dec-1]",
    "output_refs: []",
    "approval_refs: [chk-1]",
    "evaluation_refs: []",
    "definition_of_done: done",
    "blocker_policy: spike_proposal_recommendation_continue",
    "tags: []",
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
  ].join("\n");

  assert.doesNotThrow(() => parseNode(content, "bound-loop.md", PARSE_OPTIONS));
  assert.throws(
    () => parseNode(content.replace("scope_authority=dec-1", "bad"), "bad-binding-loop.md", PARSE_OPTIONS),
    /question_answer_refs\[0\] must use <identity>=<ref>/
  );
  assert.throws(
    () => parseNode(content.replace("scope_authority=dec-1", "other_question=dec-1"), "unknown-binding-loop.md", PARSE_OPTIONS),
    /references undeclared pre_run_questions identity other_question/
  );
  assert.throws(
    () => parseNode(content.replace("decision_refs: [dec-1]", "decision_refs: []"), "unclosed-binding-loop.md", PARSE_OPTIONS),
    /ref dec-1 must also appear in one of decision_refs/
  );
  assert.throws(
    () => parseNode(content.replace("prohibited_actions: [functional_changes]", "prohibited_actions: [read_source]"), "conflicting-action-loop.md", PARSE_OPTIONS),
    /action read_source cannot be both pre_approved_actions and prohibited_actions/
  );
});

test("parseNode rejects invalid loop mode", () => {
  const content = [
    "---",
    "id: loop-1",
    "type: loop",
    "title: invalid loop",
    "status: todo",
    "priority: 1",
    "loop_mode: exploratory",
    "loop_role: template",
    "scope_refs: []",
    "scope_description: repo scope",
    "template_refs: []",
    "materialization_mode: default_children",
    "child_refs: []",
    "run_refs: []",
    "decision_refs: []",
    "output_refs: []",
    "approval_refs: []",
    "evaluation_refs: []",
    "definition_of_done: done",
    "blocker_policy: spike_proposal_recommendation_continue",
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
  ].join("\n");
  assert.throws(() => parseNode(content, "invalid-loop.md", PARSE_OPTIONS), /loop_mode must be one of/);
});

test("parseNode parses goal attributes", () => {
  const content = [
    "---",
    "id: goal-1",
    "type: goal",
    "title: recursive goal",
    "status: progress",
    "priority: 1",
    "goal_state: active",
    "goal_condition: all required checks pass",
    "scope_refs: [epic-1, feat-2, task-3]",
    "active_node: task-1",
    "last_active_node: task-0",
    "required_skills: [select-work-and-ground-context]",
    "required_checks: [npm run build, node dist/cli.js validate]",
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
    "skills: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "goal.md", PARSE_OPTIONS);
  assert.equal(node.id, "goal-1");
  assert.equal(node.type, "goal");
  assert.equal(node.status, "progress");
  assert.deepEqual(node.attributes, {
    goal_state: "active",
    goal_condition: "all required checks pass",
    scope_refs: ["epic-1", "feat-2", "task-3"],
    active_node: "task-1",
    last_active_node: "task-0",
    required_skills: ["select-work-and-ground-context"],
    required_checks: ["npm run build", "node dist/cli.js validate"],
    max_iterations: "25",
    blocked_after_attempts: "3",
  });
});

test("parseNode parses semantic context and evidence refs on work nodes", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: semantic refs",
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
    "context_refs: [task-2, child:goal-1, https://example.invalid/context]",
    "evidence_refs: [archive://archive.example, proof://example/evidence]",
    "aliases: []",
    "skills: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "task.md", PARSE_OPTIONS);
  assert.deepEqual(node.edges.context_refs, ["task-2", "child:goal-1", "https://example.invalid/context"]);
  assert.deepEqual(node.edges.evidence_refs, ["archive://archive.example", "proof://example/evidence"]);
});

test("parseNode rejects malformed semantic refs", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: semantic refs",
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
    "context_refs: [Bad Ref]",
    "evidence_refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "task.md", PARSE_OPTIONS), /context_refs invalid semantic reference/);
});

test("parseNode accepts archived goal status and state", () => {
  const content = [
    "---",
    "id: goal-1",
    "type: goal",
    "title: historical roadmap goal",
    "status: archived",
    "priority: 1",
    "goal_state: archived",
    "goal_condition: superseded by a versioned goal",
    "scope_refs: []",
    "required_skills: []",
    "required_checks: []",
    "max_iterations: 25",
    "blocked_after_attempts: 3",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: [goal-2]",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "goal.md", PARSE_OPTIONS);
  assert.equal(node.id, "goal-1");
  assert.equal(node.type, "goal");
  assert.equal(node.status, "archived");
  assert.equal(node.attributes.goal_state, "archived");
  assert.deepEqual(node.edges.relates, ["goal-2"]);
});

test("parseNode rejects invalid goal state", () => {
  const content = [
    "---",
    "id: goal-1",
    "type: goal",
    "title: bad goal",
    "status: progress",
    "priority: 1",
    "goal_state: drifting",
    "goal_condition: done",
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
    "skills: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "goal.md", PARSE_OPTIONS), /goal_state must be one of/);
});

test("parseNode requires status for work items", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: missing status",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "missing-status.md", PARSE_OPTIONS), /status is required/);
});

test("parseNode enforces priority bounds", () => {
  const content = taskFrontmatterWithPriority("priority: 12");
  assert.throws(
    () => parseNode(content, "priority.md", PARSE_OPTIONS),
    /priority must be between 0 and 9/
  );
});

test("parseNode accepts decision status enum", () => {
  const content = [
    "---",
    "id: dec-1",
    "type: dec",
    "title: decide",
    "status: accepted",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "dec.md", PARSE_OPTIONS);
  assert.equal(node.status, "accepted");
});

test("parseNode rejects unknown keys", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: has unknown key",
    "status: todo",
    "priority: 1",
    "mystery: value",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "unknown.md", PARSE_OPTIONS), /unknown key/);
});

test("parseNode enforces lowercase list entries", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: uppercase tag",
    "status: todo",
    "priority: 1",
    "tags: [Upper]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "uppercase.md", PARSE_OPTIONS), /must be lowercase/);
});

test("parseNode preserves link and artifact casing", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: preserve case",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: [HTTP://EXAMPLE.COM]",
    "artifacts: [Build-1]",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "links.md", PARSE_OPTIONS);
  assert.deepEqual(node.links, ["HTTP://EXAMPLE.COM"]);
  assert.deepEqual(node.artifacts, ["Build-1"]);
});

test("parseNode uses config status enum", () => {
  const content = taskFrontmatterWithPriority("priority: 2");
  const options = {
    ...PARSE_OPTIONS,
    workStatusEnum: ["backlog"],
  };
  assert.throws(() => parseNode(content, "status.md", options), /status must be one of/);
});

test("parseNode keeps archived status goal-only", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: archived task is invalid",
    "status: archived",
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
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "archived-task.md", PARSE_OPTIONS), /status must be one of/);
});

test("parseNode accepts reserved rule ids and id references", () => {
  const content = [
    "---",
    "id: rule-soul",
    "type: rule",
    "title: soul",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: [rule-human, root:rule-guide]",
    "refs: []",
    "aliases: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
  ].join("\n");
  const node = parseNode(content, "soul.md", PARSE_OPTIONS);
  assert.equal(node.id, "rule-soul");
  assert.deepEqual(node.edges.relates, ["rule-human", "root:rule-guide"]);
});
