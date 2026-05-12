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
  const consoleLog = console.log;
  const consoleError = console.error;
  try {
    console.log = ((...args: unknown[]) => stdout.push(args.map(String).join(" "))) as typeof console.log;
    console.error = ((...args: unknown[]) => stderr.push(args.map(String).join(" "))) as typeof console.error;
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
  } finally {
    console.log = consoleLog;
    console.error = consoleError;
  }
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

  try {
    fs.readFileSync = ((target: fs.PathLike, options?: unknown) => {
      if (path.resolve(String(target)) === packageJsonPath) {
        return JSON.stringify({ version: "  " });
      }
      return readFileSync(target, options as Parameters<typeof readFileSync>[1]);
    }) as typeof fs.readFileSync;
    const empty = captureRun(["--version"], root);
    assert.equal(empty.code, 0);
    assert.equal(empty.stdout.trim(), "unknown");
  } finally {
    fs.existsSync = existsSync;
    fs.readFileSync = readFileSync;
  }
});

test("runCli supports new json receipts", () => {
  const root = setupRepo();

  const result = captureRun(
    ["new", "task", "CLI JSON", "--status", "todo", "--priority", "4", "--json"],
    root
  );

  assert.equal(result.code, 0);
  assert.equal(result.stderr, "");
  assert.doesNotMatch(result.stdout, /node created:/);
  assert.deepEqual(JSON.parse(result.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "task-2",
      qid: "root:task-2",
      path: ".mdkg/work/task-2-cli-json.md",
      type: "task",
      title: "CLI JSON",
      status: "todo",
      priority: 4,
    },
  });
});

test("runCli supports skill mutation json receipts", () => {
  const root = setupRepo();
  fs.mkdirSync(path.join(root, ".agents"), { recursive: true });

  const created = captureRun(
    [
      "skill",
      "new",
      "json-skill",
      "json skill",
      "--description",
      "scaffold a skill with a json receipt",
      "--with-scripts",
      "--json",
    ],
    root
  );
  assert.equal(created.code, 0);
  assert.equal(created.stderr, "");
  assert.doesNotMatch(created.stdout, /skill created:/);
  assert.deepEqual(JSON.parse(created.stdout), {
    action: "created",
    skill: {
      workspace: "root",
      id: "skill:json-skill",
      qid: "root:skill:json-skill",
      slug: "json-skill",
      name: "json skill",
      path: ".mdkg/skills/json-skill/SKILL.md",
      with_scripts: true,
    },
  });

  const synced = captureRun(["skill", "sync", "--json"], root);
  assert.equal(synced.code, 0);
  assert.equal(synced.stderr, "");
  assert.deepEqual(JSON.parse(synced.stdout), {
    action: "synced",
    sync: {
      synced: 2,
      pruned: 0,
      targets: 2,
    },
  });

  const validated = captureRun(["skill", "validate", "json-skill", "--json"], root);
  assert.equal(validated.code, 0);
  assert.equal(validated.stderr, "");
  assert.deepEqual(JSON.parse(validated.stdout), {
    action: "validated",
    ok: true,
    checked_count: 1,
    warning_count: 0,
    error_count: 0,
    warnings: [],
    errors: [],
    target: "json-skill",
  });
});

test("runCli covers inline flag values and structured output parser branches", () => {
  const root = setupRepo();

  const emptyValue = captureRun(["show", "task-1", "--ws="], root);
  assert.equal(emptyValue.code, 1);
  assert.match(emptyValue.stderr, /--ws requires a value/);
  assert.match(emptyValue.stdout, /mdkg show <id-or-qid>/);

  const initFalseRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-init-false-"));
  const initFalse = captureRun(["init", "--agent=false"], initFalseRoot);
  assert.equal(initFalse.code, 0);
  assert.match(initFalse.stdout, /mdkg init complete/);
  assert.equal(fs.existsSync(path.join(initFalseRoot, "AGENT_START.md")), false);

  const initTrueRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-init-true-"));
  const initTrue = captureRun(["init", "--agent=true"], initTrueRoot);
  assert.equal(initTrue.code, 0);
  assert.match(initTrue.stdout, /read AGENT_START\.md/);
  assert.equal(fs.existsSync(path.join(initTrueRoot, "AGENT_START.md")), true);

  const initInvalidRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-init-invalid-"));
  const initInvalid = captureRun(["init", "--agent=maybe"], initInvalidRoot);
  assert.equal(initInvalid.code, 1);
  assert.match(initInvalid.stderr, /--agent must be true or false/);
  assert.match(initInvalid.stdout, /mdkg init \[options\]/);

  const list = captureRun(
    ["list", "--tags", "CLI", "--tags-mode", "ALL", "--priority", "1"],
    root
  );
  assert.equal(list.code, 0);
  assert.match(list.stdout, /root:task-1/);

  const showMd = captureRun(["show", "task-1", "--md"], root);
  assert.equal(showMd.code, 0);
  assert.match(showMd.stdout, /Runtime fixture/);

  const searchToon = captureRun(["search", "runtime", "--toon"], root);
  assert.equal(searchToon.code, 0);
  assert.match(searchToon.stdout, /root:task-1/);

  const pack = captureRun(
    ["pack", "task-1", "--dry-run", "--stats", "--depth", "1", "--edges", "relates, ,blocks"],
    root
  );
  assert.equal(pack.code, 0);
  assert.match(pack.stdout, /dry-run: no files written/);
  assert.match(pack.stdout, /root:task-1/);

  const defaultEdges = captureRun(["pack", "task-1", "--dry-run", "--edges=, ,"], root);
  assert.equal(defaultEdges.code, 0);
  assert.match(defaultEdges.stdout, /dry-run: no files written/);
});

test("runCli covers skill, task, event, and new dispatch success paths", () => {
  const root = setupRepo();

  const skillNew = captureRun(
    [
      "skill",
      "new",
      "review-loop",
      "Review Loop",
      "--description",
      "use when reviewing work",
      "--tags",
      "stage:review,cli",
      "--authors",
      "qa",
      "--links",
      "https://example.com",
      "--with-scripts",
    ],
    root
  );
  assert.equal(skillNew.code, 0);
  assert.match(skillNew.stdout, /skill created: root:skill:review-loop/);

  const skillList = captureRun(
    ["skill", "list", "--tags", "stage:review", "--tags-mode", "all", "--md", "--no-cache"],
    root
  );
  assert.equal(skillList.code, 0);
  assert.match(skillList.stdout, /review-loop/);

  const skillShow = captureRun(["skill", "show", "review-loop", "--meta", "--json", "--no-reindex"], root);
  assert.equal(skillShow.code, 0);
  assert.match(skillShow.stdout, /"slug": "review-loop"/);

  const skillSearch = captureRun(["skill", "search", "reviewing", "--tags", "stage:review", "--toon"], root);
  assert.equal(skillSearch.code, 0);
  assert.match(skillSearch.stdout, /review-loop/);

  const skillValidate = captureRun(["skill", "validate", "review-loop"], root);
  assert.equal(skillValidate.code, 0);
  assert.match(skillValidate.stdout, /skill validation ok: review-loop/);

  const skillSync = captureRun(["skill", "sync", "--force"], root);
  assert.equal(skillSync.code, 0);
  assert.match(skillSync.stdout, /skill mirror sync ok:/);

  const created = captureRun(
    [
      "new",
      "task",
      "CLI Generated",
      "--status",
      "todo",
      "--priority",
      "2",
      "--tags",
      "cli,generated",
      "--owners",
      "qa",
      "--links",
      "https://example.org",
      "--artifacts",
      "evidence.txt",
      "--refs",
      "task-1",
      "--aliases",
      "generated-task",
      "--skills",
      "review-loop",
      "--relates",
      "task-1",
    ],
    root
  );
  assert.equal(created.code, 0);
  assert.match(created.stdout, /node created: root:task-2/);

  const eventEnable = captureRun(["event", "enable"], root);
  assert.equal(eventEnable.code, 0);
  assert.match(eventEnable.stdout, /event logging enabled: root/);

  const started = captureRun(["task", "start", "task-2", "--run-id", "run_cli_start", "--note", "start"], root);
  assert.equal(started.code, 0);
  assert.match(started.stdout, /task started: root:task-2/);

  const updated = captureRun(
    [
      "task",
      "update",
      "task-2",
      "--status",
      "review",
      "--priority",
      "3",
      "--add-artifacts",
      "evidence-2.txt",
      "--add-links",
      "https://example.net",
      "--add-refs",
      "task-1",
      "--add-skills",
      "review-loop",
      "--add-tags",
      "triaged",
      "--add-blocked-by",
      "task-1",
      "--clear-blocked-by",
      "--run-id",
      "run_cli_update",
      "--note",
      "updated",
    ],
    root
  );
  assert.equal(updated.code, 0);
  assert.match(updated.stdout, /task updated: root:task-2/);

  const done = captureRun(
    [
      "task",
      "done",
      "task-2",
      "--add-artifacts",
      "done.txt",
      "--add-links",
      "https://example.test",
      "--add-refs",
      "task-1",
      "--checkpoint",
      "CLI Done",
      "--run-id",
      "run_cli_done",
      "--note",
      "done",
    ],
    root
  );
  assert.equal(done.code, 0);
  assert.match(done.stdout, /checkpoint created: root:chk-1/);
  assert.match(done.stdout, /task done: root:task-2/);

  const eventAppend = captureRun(
    [
      "event",
      "append",
      "--kind",
      "TASK_RECORDED",
      "--status",
      "ok",
      "--refs",
      "task-2",
      "--artifacts",
      "event.json",
      "--notes",
      "event note",
      "--run-id",
      "run_cli_event",
      "--agent",
      "mdkg-cli",
      "--skill",
      "review-loop",
      "--tool",
      "cli",
    ],
    root
  );
  assert.equal(eventAppend.code, 0);
  assert.match(eventAppend.stdout, /event appended: root:TASK_RECORDED/);
});

test("runCli covers skill subcommand usage guidance", () => {
  const root = setupRepo();

  const cases: Array<[string[], RegExp, RegExp]> = [
    [["skill"], /skill requires new\/list\/show\/search\/validate\/sync/, /mdkg skill new/],
    [["skill", "new", "only-slug"], /skill new requires <slug> "<name>"/, /mdkg skill new/],
    [
      ["skill", "new", "review-loop", "Review Loop", "extra", "--description", "use when reviewing"],
      /skill new accepts exactly <slug> "<name>"/,
      /mdkg skill new/,
    ],
    [
      ["skill", "new", "review-loop", "Review Loop"],
      /skill new requires --description/,
      /mdkg skill new/,
    ],
    [["skill", "list", "extra"], /skill list does not accept positional arguments/, /mdkg skill list/],
    [["skill", "show"], /skill show requires <slug>/, /mdkg skill show <slug>/],
    [["skill", "search"], /skill search requires a query/, /mdkg skill search/],
    [["skill", "validate", "one", "two"], /skill validate accepts at most one slug/, /mdkg skill validate/],
    [["skill", "sync", "extra"], /skill sync does not accept positional arguments/, /mdkg skill sync/],
  ];

  for (const [argv, stderrPattern, stdoutPattern] of cases) {
    const result = captureRun(argv, root);
    assert.equal(result.code, 1, argv.join(" "));
    assert.match(result.stderr, stderrPattern, argv.join(" "));
    assert.match(result.stdout, stdoutPattern, argv.join(" "));
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
