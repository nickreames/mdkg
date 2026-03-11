import { test } from "node:test";
import assert from "node:assert/strict";
const { parseArgs } = require("../../util/argparse");

test("parseArgs supports short flags for pack", () => {
  const parsed = parseArgs(["pack", "task-1", "-v", "-f", "md", "-o", "/tmp/x.md", "-d", "2", "-e", "parent"]);
  assert.equal(parsed.positionals[0], "pack");
  assert.equal(parsed.positionals[1], "task-1");
  assert.equal(parsed.flags["--verbose"], true);
  assert.equal(parsed.flags["--format"], "md");
  assert.equal(parsed.flags["--out"], "/tmp/x.md");
  assert.equal(parsed.flags["--depth"], "2");
  assert.equal(parsed.flags["--edges"], "parent");
});

test("parseArgs supports short workspace and root flags", () => {
  const parsed = parseArgs(["list", "-w", "ROOT", "-r", "/repo/root"]);
  assert.equal(parsed.flags["--ws"], "root");
  assert.equal(parsed.root, "/repo/root");
});

test("parseArgs handles --version", () => {
  const parsed = parseArgs(["--version"]);
  assert.equal(parsed.version, true);
});

test("parseArgs accepts dry-run, json, and list-profiles booleans", () => {
  const parsed = parseArgs([
    "pack",
    "task-1",
    "--dry-run",
    "--list-profiles",
    "doctor",
    "--json",
  ]);
  assert.equal(parsed.flags["--dry-run"], true);
  assert.equal(parsed.flags["--list-profiles"], true);
  assert.equal(parsed.flags["--json"], true);
});

test("parseArgs supports profile alias and compatibility booleans", () => {
  const packParsed = parseArgs(["pack", "task-1", "--profile", "concise"]);
  assert.equal(packParsed.flags["--pack-profile"], "concise");

  const initParsed = parseArgs([
    "init",
    "--agent",
    "--no-update-ignores",
    "--update-gitignore",
  ]);
  assert.equal(initParsed.flags["--agent"], true);
  assert.equal(initParsed.flags["--no-update-ignores"], true);
  assert.equal(initParsed.flags["--update-gitignore"], true);

  const showParsed = parseArgs(["show", "skill:demo", "--meta", "--body"]);
  assert.equal(showParsed.flags["--meta"], true);
  assert.equal(showParsed.flags["--body"], true);
});

test("parseArgs allows --agent to act as a boolean or a valued flag depending on usage", () => {
  const initParsed = parseArgs(["init", "--agent"]);
  assert.equal(initParsed.flags["--agent"], true);

  const eventParsed = parseArgs(["event", "append", "--agent", "mdkg-cli"]);
  assert.equal(eventParsed.flags["--agent"], "mdkg-cli");
});

test("parseArgs supports task and event mutation flags", () => {
  const taskParsed = parseArgs([
    "task",
    "update",
    "task-1",
    "--status",
    "progress",
    "--priority",
    "2",
    "--add-artifacts",
    "tests://ok",
    "--add-skills",
    "review-pr",
    "--clear-blocked-by",
    "--run-id",
    "run_local_1",
    "--note",
    "moved to progress",
  ]);
  assert.equal(taskParsed.flags["--status"], "progress");
  assert.equal(taskParsed.flags["--priority"], "2");
  assert.equal(taskParsed.flags["--add-artifacts"], "tests://ok");
  assert.equal(taskParsed.flags["--add-skills"], "review-pr");
  assert.equal(taskParsed.flags["--clear-blocked-by"], true);
  assert.equal(taskParsed.flags["--run-id"], "run_local_1");
  assert.equal(taskParsed.flags["--note"], "moved to progress");

  const eventParsed = parseArgs([
    "event",
    "append",
    "--kind",
    "TASK_UPDATED",
    "--status",
    "ok",
    "--refs",
    "task-1",
    "--notes",
    "done",
    "--agent",
    "ai-agent",
    "--skill",
    "verify-close-and-checkpoint",
    "--tool",
    "codex",
    "--no-update-gitignore",
  ]);
  assert.equal(eventParsed.flags["--kind"], "TASK_UPDATED");
  assert.equal(eventParsed.flags["--status"], "ok");
  assert.equal(eventParsed.flags["--refs"], "task-1");
  assert.equal(eventParsed.flags["--notes"], "done");
  assert.equal(eventParsed.flags["--agent"], "ai-agent");
  assert.equal(eventParsed.flags["--skill"], "verify-close-and-checkpoint");
  assert.equal(eventParsed.flags["--tool"], "codex");
  assert.equal(eventParsed.flags["--no-update-gitignore"], true);
});
