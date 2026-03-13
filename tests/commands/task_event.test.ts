import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "node:child_process";
const { runEventEnableCommand, runEventAppendCommand } = require("../../commands/event");
const {
  runTaskStartCommand,
  runTaskUpdateCommand,
  runTaskDoneCommand,
} = require("../../commands/task");
const { runNewCommand } = require("../../commands/new");
const { runSkillNewCommand } = require("../../commands/skill");
const { runValidateCommand } = require("../../commands/validate");
import { makeTempDir } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const snapshotScriptPath = path.resolve(__dirname, "..", "..", "..", "scripts", "cli_help_snapshot.js");

function readEvents(root: string): Array<Record<string, unknown>> {
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  const raw = fs.readFileSync(eventsPath, "utf8").trim();
  if (!raw) {
    return [];
  }
  return raw
    .split("\n")
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function createTaskRepo(prefix: string): string {
  const root = makeTempDir(prefix);
  writeRootConfig(root);
  writeDefaultTemplates(root);
  runNewCommand({
    root,
    type: "task",
    title: "Ship release",
    status: "todo",
    priority: 1,
    now: new Date("2026-03-08T00:00:00Z"),
  });
  return root;
}

test("event enable and append create valid JSONL that validate accepts", () => {
  const root = createTaskRepo("mdkg-event-enable-");
  fs.writeFileSync(path.join(root, ".gitignore"), ".mdkg/index/\n", "utf8");

  runEventEnableCommand({ root });
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  assert.ok(fs.existsSync(eventsPath));
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.equal(gitignore, ".mdkg/index/\n");

  runEventAppendCommand({
    root,
    kind: "RUN_COMPLETED",
    status: "ok",
    refs: "task-1",
    artifacts: "tests://go-test.txt",
    notes: "manual append",
    runId: "run_manual_1",
    agent: "ai-agent",
    skill: "verify-close-and-checkpoint",
    tool: "codex",
  });

  const events = readEvents(root);
  assert.equal(events.length, 1);
  assert.equal(events[0]?.run_id, "run_manual_1");
  assert.equal(events[0]?.workspace, "root");
  assert.equal(events[0]?.kind, "RUN_COMPLETED");
  assert.equal(events[0]?.status, "ok");
  assert.deepEqual(events[0]?.refs, ["task-1"]);
  assert.doesNotThrow(() => runValidateCommand({ root, quiet: true }));
});

test("task start update and done mutate task-like nodes and optional checkpoint", () => {
  const root = createTaskRepo("mdkg-task-flow-");
  runSkillNewCommand({
    root,
    slug: "review-pr",
    name: "review-pr",
    description: "review pull requests when validating final changes",
  });
  runEventEnableCommand({ root });

  runTaskStartCommand({
    root,
    id: "task-1",
    runId: "run_task_flow",
    note: "claimed task",
    now: new Date("2026-03-08T01:00:00Z"),
  });
  runTaskUpdateCommand({
    root,
    id: "task-1",
    status: "review",
    priority: 2,
    addArtifacts: "tests://unit.txt",
    addLinks: "https://example.com/pr/1",
    addRefs: "dec-1",
    addSkills: "review-pr",
    addTags: "release",
    addBlockedBy: "task-1",
    runId: "run_task_flow",
    note: "ready for review",
    now: new Date("2026-03-08T01:05:00Z"),
  });
  runTaskDoneCommand({
    root,
    id: "task-1",
    addArtifacts: "patch://diff.patch",
    checkpoint: "release complete",
    runId: "run_task_flow",
    note: "completed",
    now: new Date("2026-03-08T01:10:00Z"),
  });

  const taskPath = path.join(root, ".mdkg", "work", "task-1-ship-release.md");
  const taskContent = fs.readFileSync(taskPath, "utf8");
  assert.match(taskContent, /status: done/);
  assert.match(taskContent, /priority: 2/);
  assert.match(taskContent, /artifacts: \[tests:\/\/unit\.txt, patch:\/\/diff\.patch\]/);
  assert.match(taskContent, /links: \[https:\/\/example\.com\/pr\/1\]/);
  assert.match(taskContent, /skills: \[review-pr\]/);
  assert.match(taskContent, /tags: \[release\]/);
  assert.match(taskContent, /blocked_by: \[task-1\]/);

  const checkpointPath = path.join(root, ".mdkg", "work");
  const checkpointFile = fs
    .readdirSync(checkpointPath)
    .find((name) => name.startsWith("chk-1-release-complete"));
  assert.ok(checkpointFile);

  const events = readEvents(root);
  assert.deepEqual(
    events.map((event) => event.kind),
    ["TASK_STARTED", "TASK_UPDATED", "TASK_DONE", "CHECKPOINT_CREATED"]
  );
  assert.doesNotThrow(() => runValidateCommand({ root, quiet: true }));
});

test("automatic event append applies to enabled mutation commands only", () => {
  const root = makeTempDir("mdkg-auto-events-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  runNewCommand({
    root,
    type: "task",
    title: "No events yet",
    status: "todo",
    priority: 1,
    now: new Date("2026-03-08T02:00:00Z"),
  });
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "work", "events", "events.jsonl")), false);

  runEventEnableCommand({ root });
  runNewCommand({
    root,
    type: "task",
    title: "With events",
    status: "todo",
    priority: 1,
    runId: "run_events",
    now: new Date("2026-03-08T02:10:00Z"),
  });
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
    runId: "run_events",
  });
  runTaskStartCommand({
    root,
    id: "task-2",
    runId: "run_events",
    now: new Date("2026-03-08T02:12:00Z"),
  });

  const events = readEvents(root);
  assert.deepEqual(
    events.map((event) => event.kind),
    ["NODE_CREATED", "SKILL_CREATED", "TASK_STARTED"]
  );
});

test("task commands reject non-task-like ids with guidance", () => {
  const root = makeTempDir("mdkg-task-invalid-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  runNewCommand({
    root,
    type: "epic",
    title: "Seed epic",
    status: "todo",
    priority: 1,
    now: new Date("2026-03-08T03:00:00Z"),
  });

  assert.throws(
    () => runTaskStartCommand({ root, id: "epic-1" }),
    /mdkg task only supports task, bug, and test nodes/
  );
});

test("cli task start and done warn when events are disabled but task update stays quiet", () => {
  const root = createTaskRepo("mdkg-cli-task-events-disabled-");
  const run = (args: string[]) =>
    spawnSync(process.execPath, [cliPath, ...args], {
      cwd: root,
      encoding: "utf8",
    });

  let result = run(["task", "start", "task-1", "--run-id", "run_cli_disabled"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /task started: root:task-1/);
  assert.match(
    result.stderr,
    /note: events\.jsonl is missing for workspace root; run mdkg event enable --ws root to restore JSONL provenance/
  );

  result = run(["task", "update", "task-1", "--status", "review", "--run-id", "run_cli_disabled"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /task updated: root:task-1/);
  assert.doesNotMatch(result.stderr, /event logging not enabled/);

  result = run(["task", "done", "task-1", "--run-id", "run_cli_disabled"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /task done: root:task-1/);
  assert.match(
    result.stderr,
    /note: events\.jsonl is missing for workspace root; run mdkg event enable --ws root to restore JSONL provenance/
  );
});

test("cli help snapshot script emits JSON and command-matrix check passes", () => {
  const jsonRun = spawnSync(process.execPath, [snapshotScriptPath], {
    cwd: path.resolve(__dirname, "..", "..", ".."),
    encoding: "utf8",
  });
  assert.equal(jsonRun.status, 0);
  const parsed = JSON.parse(jsonRun.stdout) as Record<string, unknown>;
  assert.equal(parsed.command, "cli:snapshot");
  assert.equal(typeof parsed.version, "string");
  assert.equal(typeof parsed.commands, "object");

  const checkRun = spawnSync(process.execPath, [snapshotScriptPath, "--check"], {
    cwd: path.resolve(__dirname, "..", "..", ".."),
    encoding: "utf8",
  });
  assert.equal(checkRun.status, 0);
  assert.match(checkRun.stdout, /cli command matrix check: ok/);
});

test("cli task and event commands work end-to-end", () => {
  const root = createTaskRepo("mdkg-cli-task-event-");
  const run = (args: string[]) =>
    spawnSync(process.execPath, [cliPath, ...args], {
      cwd: root,
      encoding: "utf8",
    });

  let result = run(["event", "enable"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /event logging enabled: root/);

  result = run(["task", "start", "task-1", "--run-id", "run_cli"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /task started: root:task-1/);

  result = run(["task", "done", "task-1", "--checkpoint", "cli complete", "--run-id", "run_cli"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /task done: root:task-1/);

  const events = readEvents(root);
  assert.deepEqual(
    events.map((event) => event.kind),
    ["TASK_STARTED", "TASK_DONE", "CHECKPOINT_CREATED"]
  );
});
