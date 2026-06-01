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

test("event enable reports already-present logs", () => {
  const root = createTaskRepo("mdkg-event-enable-existing-");
  captureOutput(() => runEventEnableCommand({ root }));

  const output = captureOutput(() => runEventEnableCommand({ root }));

  assert.equal(output.stderr, "");
  assert.match(output.stdout, /event logging enabled: root \(already present\)/);
});

test("event commands print deterministic json receipts", () => {
  const root = createTaskRepo("mdkg-event-json-receipts-");

  const enableOutput = captureOutput(() => runEventEnableCommand({ root, json: true }));
  assert.equal(enableOutput.stderr, "");
  assert.deepEqual(JSON.parse(enableOutput.stdout), {
    action: "enabled",
    workspace: "root",
    created: true,
  });

  const alreadyEnabledOutput = captureOutput(() =>
    runEventEnableCommand({ root, json: true })
  );
  assert.deepEqual(JSON.parse(alreadyEnabledOutput.stdout), {
    action: "enabled",
    workspace: "root",
    created: false,
  });

  const appendOutput = captureOutput(() =>
    runEventAppendCommand({
      root,
      kind: "RUN_COMPLETED",
      status: "ok",
      refs: "TASK-1",
      artifacts: "tests://event-json.txt",
      notes: "json receipt",
      runId: "run_event_json",
      agent: "mdkg-test",
      json: true,
    })
  );
  const appended = JSON.parse(appendOutput.stdout);

  assert.equal(appended.action, "appended");
  assert.equal(appended.event.run_id, "run_event_json");
  assert.equal(appended.event.workspace, "root");
  assert.equal(appended.event.agent, "mdkg-test");
  assert.equal(appended.event.kind, "RUN_COMPLETED");
  assert.equal(appended.event.status, "ok");
  assert.deepEqual(appended.event.refs, ["task-1"]);
  assert.deepEqual(appended.event.artifacts, ["tests://event-json.txt"]);
  assert.equal(appended.event.notes, "json receipt");
  assert.deepEqual(readEvents(root), [appended.event]);
});

test("event append rejects invalid command inputs", () => {
  const root = createTaskRepo("mdkg-event-invalid-input-");
  runEventEnableCommand({ root });

  assert.throws(
    () => runEventAppendCommand({ root, kind: " ", status: "ok", refs: "task-1" }),
    /--kind is required/
  );
  assert.throws(
    () => runEventAppendCommand({ root, kind: "RUN_COMPLETED", status: "ok", refs: " , " }),
    /--refs requires at least one id or qid/
  );
  assert.throws(
    () => runEventAppendCommand({ root, kind: "RUN_COMPLETED", status: "unknown", refs: "task-1" }),
    /--status must be one of ok, error, retry, skipped/
  );
});

test("event commands report workspace and setup diagnostics", () => {
  const root = createTaskRepo("mdkg-event-diagnostics-");

  assert.throws(
    () => runEventEnableCommand({ root, ws: "all" }),
    /--ws all is not valid here/
  );
  assert.throws(
    () => runEventEnableCommand({ root, ws: "missing" }),
    /workspace not found: missing/
  );
  assert.throws(
    () => runEventAppendCommand({ root, kind: "RUN_COMPLETED", status: "retry", refs: "TASK-1" }),
    /events\.jsonl is missing for workspace root/
  );
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

test("task commands print deterministic json receipts", () => {
  const root = createTaskRepo("mdkg-task-json-receipts-");
  runEventEnableCommand({ root });

  const startOutput = captureOutput(() =>
    runTaskStartCommand({
      root,
      id: "task-1",
      runId: "run_task_json",
      note: "json start",
      json: true,
      now: new Date("2026-03-08T04:00:00Z"),
    })
  );
  assert.equal(startOutput.stderr, "");
  assert.deepEqual(JSON.parse(startOutput.stdout), {
    action: "started",
    task: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-ship-release.md",
      type: "task",
      status: "progress",
      priority: 1,
    },
  });

  const updateOutput = captureOutput(() =>
    runTaskUpdateCommand({
      root,
      id: "task-1",
      status: "review",
      priority: 2,
      addArtifacts: "tests://task-json.txt",
      runId: "run_task_json",
      note: "json update",
      json: true,
      now: new Date("2026-03-08T04:05:00Z"),
    })
  );
  assert.equal(updateOutput.stderr, "");
  assert.deepEqual(JSON.parse(updateOutput.stdout), {
    action: "updated",
    task: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-ship-release.md",
      type: "task",
      status: "review",
      priority: 2,
    },
  });

  const doneOutput = captureOutput(() =>
    runTaskDoneCommand({
      root,
      id: "task-1",
      addArtifacts: "tests://task-done-json.txt",
      checkpoint: "json done checkpoint",
      runId: "run_task_json",
      note: "json done",
      json: true,
      now: new Date("2026-03-08T04:10:00Z"),
    })
  );
  assert.equal(doneOutput.stderr, "");
  assert.doesNotMatch(doneOutput.stdout, /checkpoint created|task done/);
  assert.deepEqual(JSON.parse(doneOutput.stdout), {
    action: "done",
    task: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-ship-release.md",
      type: "task",
      status: "done",
      priority: 2,
    },
    checkpoint: {
      workspace: "root",
      id: "chk-1",
      qid: "root:chk-1",
      path: ".mdkg/work/chk-1-json-done-checkpoint.md",
    },
  });

  const events = readEvents(root);
  assert.deepEqual(
    events.map((event) => event.kind),
    ["TASK_STARTED", "TASK_UPDATED", "TASK_DONE", "CHECKPOINT_CREATED"]
  );
});

test("task commands mutate feature nodes as task-like work", () => {
  const root = makeTempDir("mdkg-task-feat-flow-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  runNewCommand({
    root,
    type: "feat",
    title: "Ship feature",
    status: "todo",
    priority: 1,
    now: new Date("2026-03-08T05:00:00Z"),
  });

  const startOutput = captureOutput(() =>
    runTaskStartCommand({
      root,
      id: "feat-1",
      json: true,
      now: new Date("2026-03-08T05:05:00Z"),
    })
  );
  assert.deepEqual(JSON.parse(startOutput.stdout).task, {
    workspace: "root",
    id: "feat-1",
    qid: "root:feat-1",
    path: ".mdkg/work/feat-1-ship-feature.md",
    type: "feat",
    status: "progress",
    priority: 1,
  });

  const doneOutput = captureOutput(() =>
    runTaskDoneCommand({
      root,
      id: "feat-1",
      json: true,
      now: new Date("2026-03-08T05:10:00Z"),
    })
  );
  assert.deepEqual(JSON.parse(doneOutput.stdout).task, {
    workspace: "root",
    id: "feat-1",
    qid: "root:feat-1",
    path: ".mdkg/work/feat-1-ship-feature.md",
    type: "feat",
    status: "done",
    priority: 1,
  });

  const featurePath = path.join(root, ".mdkg", "work", "feat-1-ship-feature.md");
  const featureContent = fs.readFileSync(featurePath, "utf8");
  assert.match(featureContent, /status: done/);
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
    /mdkg task only supports feat, task, bug, and test nodes/
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

test("cli task commands support json receipts", () => {
  const root = createTaskRepo("mdkg-cli-task-json-");
  const run = (args: string[]) =>
    spawnSync(process.execPath, [cliPath, ...args], {
      cwd: root,
      encoding: "utf8",
    });

  let result = run(["event", "enable"]);
  assert.equal(result.status, 0);

  result = run(["task", "start", "task-1", "--run-id", "run_cli_task_json", "--json"]);
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    action: "started",
    task: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-ship-release.md",
      type: "task",
      status: "progress",
      priority: 1,
    },
  });

  result = run([
    "task",
    "update",
    "task-1",
    "--status",
    "review",
    "--priority",
    "2",
    "--run-id",
    "run_cli_task_json",
    "--json",
  ]);
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    action: "updated",
    task: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-ship-release.md",
      type: "task",
      status: "review",
      priority: 2,
    },
  });

  result = run([
    "task",
    "done",
    "task-1",
    "--checkpoint",
    "cli json checkpoint",
    "--run-id",
    "run_cli_task_json",
    "--json",
  ]);
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    action: "done",
    task: {
      workspace: "root",
      id: "task-1",
      qid: "root:task-1",
      path: ".mdkg/work/task-1-ship-release.md",
      type: "task",
      status: "done",
      priority: 2,
    },
    checkpoint: {
      workspace: "root",
      id: "chk-1",
      qid: "root:chk-1",
      path: ".mdkg/work/chk-1-cli-json-checkpoint.md",
    },
  });
});
