import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const {
  runGoalActivateCommand,
  runGoalArchiveCommand,
  runGoalClaimCommand,
  runGoalClearCommand,
  runGoalCurrentCommand,
  runGoalDoneCommand,
  runGoalEvaluateCommand,
  runGoalNextCommand,
  runGoalPauseCommand,
  runGoalResumeCommand,
  runGoalSelectCommand,
  runGoalShowCommand,
} = require("../../commands/goal");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

function setupRepo(): string {
  const root = makeTempDir("mdkg-goal-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  return root;
}

function writeGoal(root: string, overrides: Partial<Record<string, string>> = {}): void {
  const fields: Record<string, string | undefined> = {
    id: "goal-1",
    title: "Reach release readiness",
    status: "progress",
    priority: "1",
    goal_state: "active",
    goal_condition: "all checks pass",
    active_node: "task-2",
    max_iterations: "25",
    blocked_after_attempts: "3",
    ...overrides,
  };
  writeFile(
    path.join(root, ".mdkg", "work", `${fields.id}.md`),
    [
      "---",
      `id: ${fields.id}`,
      "type: goal",
      `title: ${fields.title}`,
      `status: ${fields.status}`,
      `priority: ${fields.priority}`,
      `goal_state: ${fields.goal_state}`,
      `goal_condition: ${fields.goal_condition}`,
      `scope_refs: ${overrides.scope_refs ?? "[]"}`,
      ...(fields.active_node ? [`active_node: ${fields.active_node}`] : []),
      ...(fields.last_active_node ? [`last_active_node: ${fields.last_active_node}`] : []),
      "required_skills: [select-work-and-ground-context]",
      "required_checks: [npm run build, node dist/cli.js validate]",
      `max_iterations: ${fields.max_iterations}`,
      `blocked_after_attempts: ${fields.blocked_after_attempts}`,
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
      "created: 2026-01-01",
      "updated: 2026-01-01",
      "---",
      "",
      "# Completion Evidence",
      "",
      "- Pending.",
    ].join("\n")
  );
}

function writeTask(root: string, id: string, title: string, status: string, priority: number, relates = "goal-1"): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}.md`),
    [
      "---",
      `id: ${id}`,
      "type: task",
      `title: ${title}`,
      `status: ${status}`,
      `priority: ${priority}`,
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      `relates: [${relates}]`,
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-01-01",
      "updated: 2026-01-01",
      "---",
      "",
    ].join("\n")
  );
}

function writeWork(
  root: string,
  type: "epic" | "feat" | "task" | "bug" | "test" | "spike",
  id: string,
  title: string,
  status: string,
  priority: number,
  extras: Partial<Record<"relates" | "epic" | "parent", string>> = {}
): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}.md`),
    [
      "---",
      `id: ${id}`,
      `type: ${type}`,
      `title: ${title}`,
      `status: ${status}`,
      `priority: ${priority}`,
      ...(extras.epic ? [`epic: ${extras.epic}`] : []),
      ...(extras.parent ? [`parent: ${extras.parent}`] : []),
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      `relates: ${extras.relates ? `[${extras.relates}]` : "[]"}`,
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-01-01",
      "updated: 2026-01-01",
      "---",
      "",
    ].join("\n")
  );
}

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

test("goal show reports deterministic goal metadata", () => {
  const root = setupRepo();
  writeGoal(root);
  writeTask(root, "task-2", "Active task", "progress", 2);

  const output = captureOutput(() => runGoalShowCommand({ root, id: "goal-1", json: true }));
  assert.equal(output.stderr, "");
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.action, "showed");
  assert.equal(receipt.goal.qid, "root:goal-1");
  assert.equal(receipt.goal.goal_state, "active");
  assert.equal(receipt.goal.active_node, "task-2");
  assert.equal(receipt.goal.last_active_node, undefined);
  assert.deepEqual(receipt.goal.scope_refs, []);
  assert.deepEqual(receipt.goal.required_checks, ["npm run build", "node dist/cli.js validate"]);
});

test("goal next prefers active concrete local work and never returns goal node", () => {
  const root = setupRepo();
  writeGoal(root);
  writeTask(root, "task-1", "Related task", "progress", 0);
  writeTask(root, "task-2", "Active task", "todo", 9);

  const output = captureOutput(() => runGoalNextCommand({ root, id: "goal-1", json: true }));
  assert.equal(output.stderr, "");
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.node.qid, "root:task-2");
  assert.notEqual(receipt.node.type, "goal");
});

test("goal next uses selected goal and recursively traverses scoped epics and features", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "", scope_refs: "[epic-1]" });
  writeWork(root, "epic", "epic-1", "Scoped epic", "progress", 5);
  writeWork(root, "feat", "feat-1", "Scoped feature", "todo", 2, { epic: "epic-1" });
  writeWork(root, "task", "task-1", "Nested task", "todo", 3, { parent: "feat-1" });
  writeWork(root, "task", "task-2", "Unrelated urgent task", "todo", 0);

  captureOutput(() => runGoalSelectCommand({ root, id: "goal-1", json: true, now: new Date("2026-01-02T00:00:00.000Z") }));
  const current = captureOutput(() => runGoalCurrentCommand({ root, json: true }));
  assert.equal(JSON.parse(current.stdout).goal.qid, "root:goal-1");

  const output = captureOutput(() => runGoalNextCommand({ root, json: true }));
  assert.equal(output.stderr, "");
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.goal_source, "selected");
  assert.equal(receipt.node.qid, "root:feat-1");
  assert.equal(receipt.node.type, "feat");
});

test("goal next skips completed scoped work and returns the next scoped item", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "", scope_refs: "[epic-1]" });
  writeWork(root, "epic", "epic-1", "Scoped epic", "progress", 5);
  writeWork(root, "feat", "feat-1", "Completed feature", "done", 1, { epic: "epic-1" });
  writeWork(root, "task", "task-1", "Nested task", "todo", 2, { parent: "feat-1" });

  const output = captureOutput(() => runGoalNextCommand({ root, id: "goal-1", json: true }));
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.node.qid, "root:task-1");
});

test("goal next without selection falls back only for a unique active goal", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "", scope_refs: "[task-1]" });
  writeWork(root, "task", "task-1", "Scoped task", "todo", 1);

  const output = captureOutput(() => runGoalNextCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.goal_source, "unique_active");
  assert.equal(receipt.node.qid, "root:task-1");

  writeGoal(root, { id: "goal-2", title: "Second active goal", active_node: "", scope_refs: "[task-1]" });
  assert.throws(
    () => runGoalNextCommand({ root, json: true }),
    /multiple active root goals found: root:goal-1, root:goal-2; run mdkg goal activate <goal-id>/
  );
});

test("goal activate selects target and pauses competing active root goals", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "", scope_refs: "[task-1]" });
  writeGoal(root, {
    id: "goal-2",
    title: "Second goal",
    status: "blocked",
    goal_state: "paused",
    active_node: "",
    scope_refs: "[task-2]",
  });
  writeWork(root, "task", "task-1", "First scoped task", "todo", 1);
  writeWork(root, "task", "task-2", "Second scoped task", "todo", 1);

  const activated = captureOutput(() =>
    runGoalActivateCommand({ root, id: "goal-2", json: true, now: new Date("2026-01-05T00:00:00.000Z") })
  );
  assert.equal(activated.stderr, "");
  const receipt = JSON.parse(activated.stdout);
  assert.equal(receipt.action, "activated");
  assert.equal(receipt.goal.qid, "root:goal-2");
  assert.equal(receipt.goal.status, "progress");
  assert.equal(receipt.goal.goal_state, "active");
  assert.deepEqual(receipt.paused_goals.map((goal: { qid: string }) => goal.qid), ["root:goal-1"]);
  assert.equal(receipt.selection.path, ".mdkg/state/selected-goal.json");
  assert.match(receipt.warnings[0], /paused 1 competing active goal/);

  const firstGoal = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(firstGoal, /status: blocked/);
  assert.match(firstGoal, /goal_state: paused/);
  const secondGoal = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-2.md"), "utf8");
  assert.match(secondGoal, /status: progress/);
  assert.match(secondGoal, /goal_state: active/);

  const current = captureOutput(() => runGoalCurrentCommand({ root, json: true }));
  assert.equal(JSON.parse(current.stdout).goal.qid, "root:goal-2");
});

test("goal activate rejects achieved goals before mutation", () => {
  const root = setupRepo();
  writeGoal(root, {
    status: "done",
    goal_state: "achieved",
    active_node: "",
    scope_refs: "[task-1]",
  });
  writeWork(root, "task", "task-1", "Scoped task", "todo", 1);

  assert.throws(
    () => runGoalActivateCommand({ root, id: "goal-1", json: true }),
    /cannot activate achieved goal root:goal-1/
  );
});

test("goal archive marks a goal historical and excludes it from routing", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "task-1", scope_refs: "[task-1]" });
  writeWork(root, "task", "task-1", "Scoped task", "todo", 1);

  captureOutput(() => runGoalSelectCommand({ root, id: "goal-1", json: true }));
  const archived = captureOutput(() =>
    runGoalArchiveCommand({ root, id: "goal-1", json: true, now: new Date(2026, 0, 6) })
  );
  assert.equal(archived.stderr, "");
  const archiveReceipt = JSON.parse(archived.stdout);
  assert.equal(archiveReceipt.action, "archive");
  assert.equal(archiveReceipt.goal.qid, "root:goal-1");
  assert.equal(archiveReceipt.goal.status, "archived");
  assert.equal(archiveReceipt.goal.goal_state, "archived");
  assert.equal(archiveReceipt.goal.active_node, undefined);
  assert.equal(archiveReceipt.goal.last_active_node, "task-1");

  const content = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(content, /status: archived/);
  assert.match(content, /goal_state: archived/);
  assert.doesNotMatch(content, /^active_node:/m);
  assert.match(content, /^last_active_node: task-1$/m);
  assert.match(content, /updated: 2026-01-06/);

  const current = captureOutput(() => runGoalCurrentCommand({ root, json: true }));
  const currentReceipt = JSON.parse(current.stdout);
  assert.equal(currentReceipt.goal, null);
  assert.equal(currentReceipt.source, "none");
  assert.match(currentReceipt.warnings[0], /selected goal root:goal-1 is archived/);

  const next = captureOutput(() => runGoalNextCommand({ root, id: "goal-1", json: true }));
  const nextReceipt = JSON.parse(next.stdout);
  assert.equal(nextReceipt.node, null);
  assert.match(nextReceipt.warnings[0], /root:goal-1 is archived and has no actionable next work/);

  assert.throws(() => runGoalSelectCommand({ root, id: "goal-1", json: true }), /cannot select archived goal root:goal-1/);
  assert.throws(() => runGoalActivateCommand({ root, id: "goal-1", json: true }), /cannot activate archived goal root:goal-1/);
  assert.throws(() => runGoalClaimCommand({ root, id: "goal-1", workId: "task-1", json: true }), /cannot claim work for archived goal root:goal-1/);
  assert.throws(() => runGoalResumeCommand({ root, id: "goal-1", json: true }), /cannot resume archived goal root:goal-1/);
});

test("goal claim writes active_node only for scoped actionable work", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "", scope_refs: "[epic-1]" });
  writeWork(root, "epic", "epic-1", "Scoped epic", "progress", 5);
  writeWork(root, "task", "task-1", "Scoped task", "todo", 1, { epic: "epic-1" });
  writeWork(root, "task", "task-2", "Outside task", "todo", 0);

  captureOutput(() => runGoalSelectCommand({ root, id: "goal-1", json: true }));
  const claimed = captureOutput(() =>
    runGoalClaimCommand({ root, workId: "task-1", json: true, now: new Date(2026, 0, 2) })
  );
  const receipt = JSON.parse(claimed.stdout);
  assert.equal(receipt.action, "claimed");
  assert.equal(receipt.node.qid, "root:task-1");
  const content = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(content, /active_node: task-1/);
  assert.match(content, /updated: 2026-01-02/);

  assert.throws(
    () => runGoalClaimCommand({ root, id: "goal-1", workId: "task-2", json: true }),
    /is not inside goal scope/
  );
});

test("goal next and claim support scoped spike work", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "", scope_refs: "[spike-1]" });
  writeWork(root, "spike", "spike-1", "Research docs launch", "todo", 1);
  writeWork(root, "task", "task-1", "Outside task", "todo", 0);

  const next = captureOutput(() => runGoalNextCommand({ root, id: "goal-1", json: true }));
  assert.equal(next.stderr, "");
  const selected = JSON.parse(next.stdout);
  assert.equal(selected.node.qid, "root:spike-1");
  assert.equal(selected.node.type, "spike");

  const claimed = captureOutput(() =>
    runGoalClaimCommand({ root, id: "goal-1", workId: "spike-1", json: true, now: new Date(2026, 0, 2) })
  );
  const receipt = JSON.parse(claimed.stdout);
  assert.equal(receipt.action, "claimed");
  assert.equal(receipt.node.qid, "root:spike-1");
  const content = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(content, /active_node: spike-1/);
});

test("goal clear removes selected goal state", () => {
  const root = setupRepo();
  writeGoal(root, { active_node: "" });
  captureOutput(() => runGoalSelectCommand({ root, id: "goal-1", json: true }));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "state", "selected-goal.json")));

  const cleared = captureOutput(() => runGoalClearCommand({ root, json: true }));
  assert.equal(JSON.parse(cleared.stdout).cleared, true);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "state", "selected-goal.json")), false);
});

test("goal evaluate is report-only and does not execute checks", () => {
  const root = setupRepo();
  writeGoal(root);
  writeTask(root, "task-2", "Active task", "progress", 2);

  const output = captureOutput(() => runGoalEvaluateCommand({ root, id: "goal-1", json: true }));
  assert.equal(output.stderr, "");
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.action, "evaluated");
  assert.equal(receipt.report_only, true);
  assert.equal(receipt.runs_scripts, false);
  assert.deepEqual(receipt.checks, [
    { command: "npm run build", status: "report_only" },
    { command: "node dist/cli.js validate", status: "report_only" },
  ]);
});

test("goal pause resume and done update goal state consistently", () => {
  const root = setupRepo();
  writeGoal(root);
  writeTask(root, "task-2", "Active task", "progress", 2);

  const paused = captureOutput(() =>
    runGoalPauseCommand({ root, id: "goal-1", json: true, now: new Date(2026, 0, 2) })
  );
  assert.equal(JSON.parse(paused.stdout).goal.goal_state, "paused");
  let content = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(content, /goal_state: paused/);
  assert.match(content, /status: blocked/);
  assert.match(content, /updated: 2026-01-02/);

  const resumed = captureOutput(() =>
    runGoalResumeCommand({ root, id: "goal-1", json: true, now: new Date(2026, 0, 3) })
  );
  assert.equal(JSON.parse(resumed.stdout).goal.goal_state, "active");
  content = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(content, /goal_state: active/);
  assert.match(content, /status: progress/);

  const done = captureOutput(() =>
    runGoalDoneCommand({ root, id: "goal-1", json: true, now: new Date(2026, 0, 4) })
  );
  const doneReceipt = JSON.parse(done.stdout);
  assert.equal(doneReceipt.goal.goal_state, "achieved");
  assert.equal(doneReceipt.goal.active_node, undefined);
  assert.equal(doneReceipt.goal.last_active_node, "task-2");
  content = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.match(content, /goal_state: achieved/);
  assert.match(content, /status: done/);
  assert.doesNotMatch(content, /^active_node:/m);
  assert.match(content, /^last_active_node: task-2$/m);

  const next = captureOutput(() => runGoalNextCommand({ root, id: "goal-1", json: true }));
  const nextReceipt = JSON.parse(next.stdout);
  assert.equal(nextReceipt.node, null);
  assert.ok(!nextReceipt.warnings.some((warning: string) => warning.includes("active_node")));
});
