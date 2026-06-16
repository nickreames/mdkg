import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runNewCommand } = require("../../commands/new");
const { runEventEnableCommand } = require("../../commands/event");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

function writeConfig(root: string): void {
  const config = {
    schema_version: 1,
    tool: "mdkg",
    root_required: true,
    index: {
      auto_reindex: true,
      tolerant: false,
      global_index_path: ".mdkg/index/global.json",
    },
    pack: {
      default_depth: 2,
      default_edges: ["parent", "epic", "relates"],
      verbose_core_list_path: ".mdkg/core/core.md",
      limits: { max_nodes: 25, max_bytes: 2000000 },
    },
    templates: {
      root_path: ".mdkg/templates",
      default_set: "default",
      workspace_overrides_enabled: false,
    },
    work: {
      status_enum: ["backlog", "blocked", "todo", "progress", "review", "done"],
      priority_min: 0,
      priority_max: 9,
      next: {
        strategy: "chain_then_priority",
        status_preference: ["progress", "todo", "review", "blocked", "backlog"],
      },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeExistingTask(root: string): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: Seed task",
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
    "created: 2026-01-01",
    "updated: 2026-01-01",
    "---",
    "",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
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

function readEvents(root: string): Array<Record<string, unknown>> {
  const raw = fs.readFileSync(path.join(root, ".mdkg", "work", "events", "events.jsonl"), "utf8").trim();
  if (!raw) {
    return [];
  }
  return raw.split("\n").map((line) => JSON.parse(line) as Record<string, unknown>);
}

test("runNewCommand creates next id and writes to work folder", () => {
  const root = makeTempDir("mdkg-new-task-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeExistingTask(root);

  runNewCommand({
    root,
    type: "task",
    title: "Ship CLI",
    status: "todo",
    now: new Date(2026, 0, 21),
  });

  const filePath = path.join(root, ".mdkg", "work", "task-2-ship-cli.md");
  assert.ok(fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("id: task-2"));
  assert.ok(content.includes("status: todo"));
  assert.ok(content.includes("priority: 9"));
  assert.ok(content.includes("created: 2026-01-21"));
  assert.ok(content.includes("updated: 2026-01-21"));
});

test("runNewCommand can print deterministic json receipt", () => {
  const root = makeTempDir("mdkg-new-json-");
  writeConfig(root);
  writeDefaultTemplates(root);
  captureOutput(() => runEventEnableCommand({ root }));

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "task",
      title: "JSON Created",
      status: "todo",
      priority: 2,
      runId: "run_new_json",
      json: true,
      now: new Date("2026-03-09T01:00:00Z"),
    })
  );

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-json-created.md",
      type: "task",
      title: "JSON Created",
      status: "todo",
      priority: 2,
    },
  });
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "work", "task-1-json-created.md")));

  const ruleOutput = captureOutput(() =>
    runNewCommand({
      root,
      type: "rule",
      title: "Core Rule",
      runId: "run_new_json",
      json: true,
      now: new Date("2026-03-09T01:05:00Z"),
    })
  );
  assert.equal(ruleOutput.stderr, "");
  assert.deepEqual(JSON.parse(ruleOutput.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "rule-1",
      qid: "root:rule-1",
      path: ".mdkg/core/rule-1-core-rule.md",
      type: "rule",
      title: "Core Rule",
    },
  });

  const events = readEvents(root);
  assert.equal(events.length, 2);
  assert.equal(events[0]?.kind, "NODE_CREATED");
  assert.deepEqual(events[0]?.refs, ["task-1"]);
  assert.deepEqual(events[1]?.refs, ["rule-1"]);
});

test("runNewCommand creates a test node with cases list", () => {
  const root = makeTempDir("mdkg-new-test-");
  writeConfig(root);
  writeDefaultTemplates(root);

  runNewCommand({
    root,
    type: "test",
    title: "CLI help smoke",
    status: "todo",
    cases: "tc-1,tc-2",
    now: new Date(2026, 0, 22),
  });

  const filePath = path.join(root, ".mdkg", "work", "test-1-cli-help-smoke.md");
  assert.ok(fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("type: test"));
  assert.ok(content.includes("cases: [tc-1, tc-2]"));
});

test("runNewCommand creates a spike node as actionable work", () => {
  const root = makeTempDir("mdkg-new-spike-");
  writeConfig(root);
  writeDefaultTemplates(root);

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "spike",
      title: "Research mdkg docs launch",
      status: "todo",
      priority: 1,
      skills: "author-mdkg-skill",
      json: true,
      now: new Date(2026, 0, 22),
    })
  );

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "spike-1",
      qid: "root:spike-1",
      path: ".mdkg/work/spike-1-research-mdkg-docs-launch.md",
      type: "spike",
      title: "Research mdkg docs launch",
      status: "todo",
      priority: 1,
    },
  });
  const filePath = path.join(root, ".mdkg", "work", "spike-1-research-mdkg-docs-launch.md");
  assert.ok(fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("type: spike"));
  assert.ok(content.includes("skills: [author-mdkg-skill]"));
  assert.ok(content.includes("# Research Question"));
  assert.ok(content.includes("# Follow-Up Nodes To Create"));
  assert.ok(content.includes("# Evidence And Sources"));
});

test("runNewCommand creates a goal node with recursive defaults", () => {
  const root = makeTempDir("mdkg-new-goal-");
  writeConfig(root);
  writeDefaultTemplates(root);

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "goal",
      title: "Reach prepublish readiness",
      json: true,
      now: new Date(2026, 0, 24),
    })
  );

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "goal-1",
      qid: "root:goal-1",
      path: ".mdkg/work/goal-1-reach-prepublish-readiness.md",
      type: "goal",
      title: "Reach prepublish readiness",
      status: "progress",
      priority: 9,
    },
  });
  const content = fs.readFileSync(
    path.join(root, ".mdkg", "work", "goal-1-reach-prepublish-readiness.md"),
    "utf8"
  );
  assert.ok(content.includes("type: goal"));
  assert.ok(content.includes("goal_state: active"));
  assert.ok(content.includes("goal_condition: Reach prepublish readiness"));
  assert.ok(content.includes("scope_refs: []"));
  assert.ok(content.includes("required_skills: []"));
  assert.ok(content.includes("required_checks: []"));
  assert.ok(content.includes("max_iterations: 25"));
  assert.ok(content.includes("blocked_after_attempts: 3"));
});

test("runNewCommand writes skills list for work items", () => {
  const root = makeTempDir("mdkg-new-skills-");
  writeConfig(root);
  writeDefaultTemplates(root);

  runNewCommand({
    root,
    type: "task",
    title: "Use skill refs",
    status: "todo",
    skills: "persist-memory,mdkg-core",
    now: new Date(2026, 0, 23),
  });

  const filePath = path.join(root, ".mdkg", "work", "task-1-use-skill-refs.md");
  assert.ok(fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("skills: [persist-memory, mdkg-core]"));
});
