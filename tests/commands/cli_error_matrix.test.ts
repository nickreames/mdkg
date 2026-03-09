import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync, SpawnSyncReturns } from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function setupRepo(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-errors-"));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: CLI error fixture",
      "status: todo",
      "priority: 1",
      "tags: [cli]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Overview",
      "",
      "CLI fixture",
    ].join("\n")
  );
  return root;
}

function runCli(root: string, args: string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    cwd: root,
  });
}

test("cli covers generic usage, usage errors, and exit-code-specific handlers", () => {
  const root = setupRepo();

  const noArgs = runCli(root, []);
  assert.equal(noArgs.status, 0);
  assert.match(noArgs.stdout, /Usage:/);

  const help = runCli(root, ["help"]);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Primary commands:/);

  const showMissing = runCli(root, ["show", "task-999"]);
  assert.equal(showMissing.status, 3);
  assert.match(showMissing.stderr, /id not found: task-999/);

  writeFile(
    path.join(root, ".mdkg", "work", "task-2-bad.md"),
    [
      "---",
      "id: task-2",
      "type: task",
      "title: Broken task",
      "status: todo",
      "priority: not-a-number",
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
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );
  const validate = runCli(root, ["validate"]);
  assert.equal(validate.status, 2);
  assert.match(validate.stderr, /validation failed/);
});

test("cli command error matrix covers flag parsing and subcommand usage guidance", () => {
  const root = setupRepo();

  const cases: Array<[string[], number, RegExp, RegExp]> = [
    [["list", "--priority", "abc"], 1, /--priority must be an integer/, /mdkg list/],
    [["list", "--tags-mode", "maybe"], 1, /--tags-mode must be any or all/, /mdkg list/],
    [["search"], 1, /search requires a query/, /mdkg search/],
    [["pack", "task-1", "--verbose", "--profile", "concise"], 1, /--verbose is only supported/, /mdkg pack <id-or-qid>/],
    [["next", "task-1", "task-2"], 1, /next accepts at most one id/, /mdkg next \[<id-or-qid>\]/],
    [["checkpoint", "oops"], 1, /unknown checkpoint subcommand: oops/, /mdkg checkpoint new <title>/],
    [["format", "extra"], 1, /format does not accept positional arguments/, /mdkg format/],
    [["doctor", "extra"], 1, /doctor does not accept positional arguments/, /mdkg doctor \[--json\]/],
    [["workspace", "ls", "extra"], 1, /workspace ls takes no arguments/, /mdkg workspace ls/],
    [["workspace", "add", "docs"], 1, /workspace add requires <alias> <path>/, /mdkg workspace add <alias> <path>/],
  ];

  for (const [args, status, stderrPattern, stdoutPattern] of cases) {
    const result = runCli(root, args);
    assert.equal(result.status, status, args.join(" "));
    assert.match(result.stderr, stderrPattern, args.join(" "));
    assert.match(result.stdout, stdoutPattern, args.join(" "));
  }
});
