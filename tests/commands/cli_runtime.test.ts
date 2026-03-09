import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
const { runCli } = require("../../cli");
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const packageJsonPath = path.join(repoRoot, "package.json");

function setupRepo(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-runtime-"));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "core", "guide.md"),
    [
      "---",
      "id: rule-guide",
      "type: rule",
      "title: guide",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Guide",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Runtime fixture",
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
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Overview",
      "",
      "Runtime fixture",
    ].join("\n")
  );
  return root;
}

function captureRun(
  argv: string[],
  cwd: string
): { code: number; stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const code = runCli(argv, {
    cwd: () => cwd,
    log: (...args: unknown[]) => stdout.push(args.map(String).join(" ")),
    error: (...args: unknown[]) => stderr.push(args.map(String).join(" ")),
  });
  return {
    code,
    stdout: stdout.join("\n"),
    stderr: stderr.join("\n"),
  };
}

test("runCli covers parse errors, usage, help, and config gating", () => {
  const root = setupRepo();
  const empty = captureRun([], root);
  assert.equal(empty.code, 0);
  assert.match(empty.stdout, /Primary commands:/);

  const parseError = captureRun(["--root"], root);
  assert.equal(parseError.code, 1);
  assert.match(parseError.stderr, /--root requires a path/);
  assert.match(parseError.stdout, /Usage:/);

  const help = captureRun(["help", "pack"], root);
  assert.equal(help.code, 0);
  assert.match(help.stdout, /mdkg pack <id-or-qid>/);

  const noConfigRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-noconfig-"));
  const noConfig = captureRun(["search", "task"], noConfigRoot);
  assert.equal(noConfig.code, 1);
  assert.match(noConfig.stderr, /mdkg must be run from a repo root/);

  const listProfiles = captureRun(["pack", "--list-profiles"], noConfigRoot);
  assert.equal(listProfiles.code, 0);
  assert.match(listProfiles.stdout, /Built-in pack profiles:/);
});

test("runCli covers version fallbacks when package metadata is unavailable", () => {
  const root = setupRepo();
  const existsSync = fs.existsSync;
  const readFileSync = fs.readFileSync;

  try {
    fs.existsSync = ((target: fs.PathLike) =>
      path.resolve(String(target)) === packageJsonPath ? false : existsSync(target)) as typeof fs.existsSync;
    const missing = captureRun(["--version"], root);
    assert.equal(missing.code, 0);
    assert.equal(missing.stdout.trim(), "unknown");
  } finally {
    fs.existsSync = existsSync;
    fs.readFileSync = readFileSync;
  }

  try {
    fs.readFileSync = ((target: fs.PathLike, options?: unknown) => {
      if (path.resolve(String(target)) === packageJsonPath) {
        return "{";
      }
      return readFileSync(target, options as Parameters<typeof readFileSync>[1]);
    }) as typeof fs.readFileSync;
    const malformed = captureRun(["--version"], root);
    assert.equal(malformed.code, 0);
    assert.equal(malformed.stdout.trim(), "unknown");
  } finally {
    fs.existsSync = existsSync;
    fs.readFileSync = readFileSync;
  }
});

test("runCli covers command-specific usage errors and exit-code handlers", () => {
  const root = setupRepo();

  const cases: Array<[string[], number, RegExp, RegExp]> = [
    [["show", "task-1", "--ws"], 1, /--ws requires a value/, /mdkg show <id-or-qid>/],
    [["list", "--priority"], 1, /--priority requires a value/, /mdkg list/],
    [["list", "--tags"], 1, /--tags requires a value/, /mdkg list/],
    [["list", "--tags-mode"], 1, /--tags-mode requires a value/, /mdkg list/],
    [["search"], 1, /search requires a query/, /mdkg search/],
    [["pack", "task-1", "--edges"], 1, /--edges requires a value/, /mdkg pack <id-or-qid>/],
    [["next", "task-1", "task-2"], 1, /next accepts at most one id/, /mdkg next \[<id-or-qid>\]/],
    [["checkpoint", "wat"], 1, /unknown checkpoint subcommand: wat/, /mdkg checkpoint new <title>/],
    [["validate", "extra"], 1, /validate does not accept positional arguments/, /mdkg validate/],
    [["format", "extra"], 1, /format does not accept positional arguments/, /mdkg format/],
    [["doctor", "extra"], 1, /doctor does not accept positional arguments/, /mdkg doctor/],
    [["workspace", "rm", "docs", "extra"], 1, /workspace rm requires <alias>/, /mdkg workspace rm <alias>/],
  ];

  for (const [argv, code, stderrPattern, stdoutPattern] of cases) {
    const result = captureRun(argv, root);
    assert.equal(result.code, code, argv.join(" "));
    assert.match(result.stderr, stderrPattern, argv.join(" "));
    assert.match(result.stdout, stdoutPattern, argv.join(" "));
  }

  const notFound = captureRun(["show", "task-999"], root);
  assert.equal(notFound.code, 3);
  assert.match(notFound.stderr, /id not found: task-999/);

  writeFile(
    path.join(root, ".mdkg", "work", "task-2-bad.md"),
    [
      "---",
      "id: task-2",
      "type: task",
      "title: Broken task",
      "status: todo",
      "priority: nope",
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
  const validation = captureRun(["validate"], root);
  assert.equal(validation.code, 2);
  assert.match(validation.stderr, /validation failed/);

  const readFileSync = fs.readFileSync;
  try {
    fs.readFileSync = ((target: fs.PathLike, options?: unknown) => {
      if (path.resolve(String(target)) === path.join(root, ".mdkg", "core", "guide.md")) {
        throw new Error("boom");
      }
      return readFileSync(target, options as Parameters<typeof readFileSync>[1]);
    }) as typeof fs.readFileSync;
    const generic = captureRun(["guide"], root);
    assert.equal(generic.code, 4);
    assert.match(generic.stderr, /boom/);
  } finally {
    fs.readFileSync = readFileSync;
  }
});
