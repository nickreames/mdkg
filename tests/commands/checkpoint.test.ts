import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import fs from "fs";
import { execFileSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

const { loadConfig } = require("../../core/config");
const { buildIndex } = require("../../graph/indexer");
const { parseFrontmatter } = require("../../graph/frontmatter");
const { formatDate } = require("../../util/date");
const { runCheckpointNewCommand } = require("../../commands/checkpoint");
const { runSearchCommand } = require("../../commands/search");
const { runListCommand } = require("../../commands/list");
const { collectValidateReceipt } = require("../../commands/validate");

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

function captureStdout(fn: () => void): string[] {
  const lines: string[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = original;
  }
  return lines;
}

function writeTaskFile(root: string, id = "task-1", title = "task one"): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}.md`),
    [
      "---",
      `id: ${id}`,
      "type: task",
      `title: ${title}`,
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
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n")
  );
}

function setupCheckpointRepo(prefix: string): string {
  const root = makeTempDir(prefix);
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTaskFile(root);
  return root;
}

test("checkpoint new creates chk-* from template and indexes", () => {
  const root = makeTempDir("mdkg-checkpoint-");
  writeConfig(root);
  writeDefaultTemplates(root);

  const task = (id: string, title: string): string =>
    [
      "---",
      `id: ${id}`,
      "type: task",
      `title: ${title}`,
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
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), task("task-1", "task one"));
  writeFile(path.join(root, ".mdkg", "work", "task-2.md"), task("task-2", "task two"));

  const existing = [
    "---",
    "id: chk-1",
    "type: checkpoint",
    "title: existing",
    "status: done",
    "priority: 9",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "scope: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    "",
    "# Existing",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "chk-1-existing.md"), existing);

  const today = formatDate(new Date());
  captureStdout(() => {
    runCheckpointNewCommand({
      root,
      title: "Second Checkpoint",
      relates: "TASK-1,ROOT:TASK-2",
      scope: "TASK-1,task-3",
    });
  });

  const createdPath = path.join(root, ".mdkg", "work", "chk-2-second-checkpoint.md");
  assert.equal(fs.existsSync(createdPath), true);

  const createdContent = fs.readFileSync(createdPath, "utf8");
  assert.ok(createdContent.includes("scope: [task-1, task-3]"));

  const { frontmatter } = parseFrontmatter(createdContent, createdPath);
  assert.equal(frontmatter.id, "chk-2");
  assert.equal(frontmatter.type, "checkpoint");
  assert.equal(frontmatter.title, "Second Checkpoint");
  assert.equal(frontmatter.status, "backlog");
  assert.equal(frontmatter.priority, "9");
  assert.deepEqual(frontmatter.relates, ["task-1", "root:task-2"]);
  assert.deepEqual(frontmatter.scope, ["task-1", "task-3"]);
  assert.equal(frontmatter.created, today);
  assert.equal(frontmatter.updated, today);
  assert.equal(Object.prototype.hasOwnProperty.call(frontmatter, "epic"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(frontmatter, "parent"), false);

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.ok(index.nodes["root:chk-2"]);

  const searchOut = captureStdout(() => {
    runSearchCommand({ root, query: "second", type: "checkpoint" });
  }).join("\n");
  assert.ok(searchOut.includes("root:chk-2"));

  const listOut = captureStdout(() => {
    runListCommand({ root, type: "checkpoint" });
  }).join("\n");
  assert.ok(listOut.includes("root:chk-2"));
});

test("checkpoint new can print deterministic json receipt", () => {
  const root = setupCheckpointRepo("mdkg-checkpoint-json-");
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  writeFile(eventsPath, "");

  const output = captureStdout(() => {
    runCheckpointNewCommand({
      root,
      title: "JSON checkpoint",
      status: "done",
      priority: 2,
      relates: "task-1",
      scope: "task-1",
      runId: "run_json_checkpoint",
      note: "json checkpoint receipt",
      json: true,
      now: new Date("2026-03-08T00:00:00.000Z"),
    });
  });

  const receipt = JSON.parse(output.join("\n"));
  assert.deepEqual(receipt, {
    action: "created",
    checkpoint: {
      workspace: "root",
      id: "chk-1",
      qid: "root:chk-1",
      path: ".mdkg/work/chk-1-json-checkpoint.md",
      kind: "implementation",
    },
  });

  const createdPath = path.join(root, receipt.checkpoint.path);
  assert.equal(fs.existsSync(createdPath), true);

  const events = fs.readFileSync(eventsPath, "utf8")
    .trim()
    .split(/\r?\n/)
    .map((line) => JSON.parse(line));
  assert.equal(events.length, 1);
  assert.equal(events[0].workspace, "root");
  assert.equal(events[0].kind, "CHECKPOINT_CREATED");
  assert.equal(events[0].status, "ok");
  assert.deepEqual(events[0].refs, ["chk-1"]);
  assert.equal(events[0].run_id, "run_json_checkpoint");
});

test("checkpoint new renders explicit kind templates and validates cleanly", () => {
  const root = setupCheckpointRepo("mdkg-checkpoint-kinds-");
  const kinds = ["implementation", "test-proof", "goal-closeout", "audit", "handoff"];

  for (const kind of kinds) {
    captureStdout(() => {
      runCheckpointNewCommand({
        root,
        title: `${kind} checkpoint`,
        kind,
        relates: "task-1",
        scope: "task-1",
        json: true,
      });
    });
  }

  for (let index = 0; index < kinds.length; index += 1) {
    const kind = kinds[index];
    const id = `chk-${index + 1}`;
    const fileName = fs
      .readdirSync(path.join(root, ".mdkg", "work"))
      .find((name) => name.startsWith(`${id}-`));
    assert.ok(fileName);
    const filePath = path.join(root, ".mdkg", "work", fileName ?? "");
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter, body } = parseFrontmatter(content, filePath);
    assert.equal(frontmatter.checkpoint_kind, kind);
    assert.match(body, /# Summary/);
    assert.match(body, /## Command Evidence/);
    assert.match(body, /## Pass \/ Fail Status/);
    assert.match(body, /## Known Warnings/);
    assert.match(body, /## Changed Surfaces/);
    assert.match(body, /## Boundaries/);
    assert.match(body, /## Follow-up Refs/);
  }

  const receipt = collectValidateReceipt({ root, json: true });
  assert.equal(receipt.ok, true);
  assert.equal(receipt.error_count, 0);
  assert.equal(receipt.warnings.some((warning: string) => warning.includes("chk-")), false);
});

test("checkpoint raw content markers warn without failing validation", () => {
  const root = setupCheckpointRepo("mdkg-checkpoint-raw-warning-");

  captureStdout(() => {
    runCheckpointNewCommand({
      root,
      title: "Raw marker checkpoint",
      kind: "audit",
      relates: "task-1",
      scope: "task-1",
    });
  });

  const filePath = path.join(root, ".mdkg", "work", "chk-1-raw-marker-checkpoint.md");
  fs.appendFileSync(filePath, "\nRAW_PROMPT_MARKER\n", "utf8");

  const receipt = collectValidateReceipt({ root, json: true });
  assert.equal(receipt.ok, true);
  assert.equal(receipt.error_count, 0);
  assert.ok(receipt.warnings.some((warning: string) => warning.includes("raw-content.raw_prompt warning")));
});

test("checkpoint new rejects validation errors", () => {
  const root = setupCheckpointRepo("mdkg-checkpoint-errors-");

  assert.throws(
    () => runCheckpointNewCommand({ root, title: "   " }),
    /checkpoint title cannot be empty/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Bad workspace", ws: "all" }),
    /--ws all is not valid for checkpoint creation/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Missing workspace", ws: "missing" }),
    /workspace not found: missing/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Bad status", status: "invalid" }),
    /--status must be one of/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Bad priority", priority: 10 }),
    /--priority must be between 0 and 9/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Bad kind", kind: "daily" }),
    /--kind must be one of/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Bad scope", scope: "bad id" }),
    /--scope entries must match/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Bad relates", relates: "bad id" }),
    /--relates entries must match/
  );
  assert.throws(
    () => runCheckpointNewCommand({ root, title: "Missing relates", relates: "task-404" }),
    /related node not found: task-404/
  );
});

test("checkpoint new falls back and truncates slugs", () => {
  const root = setupCheckpointRepo("mdkg-checkpoint-slugs-");

  captureStdout(() => runCheckpointNewCommand({ root, title: "!!!" }));
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "work", "chk-1-checkpoint.md")), true);

  const longTitle = "a".repeat(120);
  captureStdout(() => runCheckpointNewCommand({ root, title: longTitle }));
  const files = fs.readdirSync(path.join(root, ".mdkg", "work"));
  const longSlugFile = files.find((name) => name.startsWith("chk-2-"));

  assert.equal(longSlugFile, `chk-2-${"a".repeat(80)}.md`);
});

test("checkpoint new supports --ws for non-root workspace", () => {
  const root = makeTempDir("mdkg-checkpoint-ws-");

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
      app: { path: "app", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
  writeDefaultTemplates(root);

  const task = (id: string, title: string): string =>
    [
      "---",
      `id: ${id}`,
      "type: task",
      `title: ${title}`,
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
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n");

  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), task("task-1", "root task one"));
  writeFile(path.join(root, "app", ".mdkg", "work", "task-2.md"), task("task-2", "app task two"));

  captureStdout(() => {
    runCheckpointNewCommand({
      root,
      ws: "APP",
      title: "App workspace checkpoint",
      relates: "ROOT:TASK-1,TASK-2",
      scope: "TASK-2",
    });
  });

  const createdPath = path.join(root, "app", ".mdkg", "work", "chk-1-app-workspace-checkpoint.md");
  assert.equal(fs.existsSync(createdPath), true);

  const { frontmatter } = parseFrontmatter(fs.readFileSync(createdPath, "utf8"), createdPath);
  assert.equal(frontmatter.id, "chk-1");
  assert.equal(frontmatter.type, "checkpoint");
  assert.deepEqual(frontmatter.relates, ["root:task-1", "task-2"]);

  const loadedConfig = loadConfig(root);
  const index = buildIndex(root, loadedConfig);
  assert.ok(index.nodes["app:chk-1"]);
});

test("cli checkpoint new works end-to-end with --root and --ws", () => {
  const root = makeTempDir("mdkg-checkpoint-cli-");

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
      app: { path: "app", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
  writeDefaultTemplates(root);

  const task = (id: string, title: string): string =>
    [
      "---",
      `id: ${id}`,
      "type: task",
      `title: ${title}`,
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
      "created: 2026-01-06",
      "updated: 2026-01-06",
      "---",
      "",
      `# ${id}`,
    ].join("\n");

  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), task("task-1", "root task one"));
  writeFile(path.join(root, "app", ".mdkg", "work", "task-2.md"), task("task-2", "app task two"));

  const cliPath = path.resolve(__dirname, "../../cli.js");
  const stdout = execFileSync(
    process.execPath,
    [
      cliPath,
      "--root",
      root,
      "checkpoint",
      "new",
      "CLI ws checkpoint",
      "--ws",
      "APP",
      "--relates",
      "ROOT:TASK-1,TASK-2",
      "--scope",
      "TASK-2",
    ],
    { encoding: "utf8" }
  );

  const match = /\(([^)]+)\)/.exec(stdout.trim());
  assert.ok(match);
  const relPath = match?.[1] ?? "";
  const createdPath = path.join(root, relPath);
  assert.equal(fs.existsSync(createdPath), true);

  const { frontmatter } = parseFrontmatter(fs.readFileSync(createdPath, "utf8"), createdPath);
  assert.equal(frontmatter.id, "chk-1");
  assert.equal(frontmatter.type, "checkpoint");
  assert.deepEqual(frontmatter.relates, ["root:task-1", "task-2"]);
});

test("cli checkpoint new supports json receipts", () => {
  const root = setupCheckpointRepo("mdkg-checkpoint-cli-json-");

  const cliPath = path.resolve(__dirname, "../../cli.js");
  const stdout = execFileSync(
    process.execPath,
    [
      cliPath,
      "--root",
      root,
      "checkpoint",
      "new",
      "CLI JSON checkpoint",
      "--kind",
      "test-proof",
      "--relates",
      "TASK-1",
      "--scope",
      "TASK-1",
      "--json",
    ],
    { encoding: "utf8" }
  );

  const receipt = JSON.parse(stdout);
  assert.deepEqual(receipt, {
    action: "created",
    checkpoint: {
      workspace: "root",
      id: "chk-1",
      qid: "root:chk-1",
      path: ".mdkg/work/chk-1-cli-json-checkpoint.md",
      kind: "test-proof",
    },
  });

  const createdPath = path.join(root, receipt.checkpoint.path);
  assert.equal(fs.existsSync(createdPath), true);

  const { frontmatter } = parseFrontmatter(fs.readFileSync(createdPath, "utf8"), createdPath);
  assert.equal(frontmatter.id, "chk-1");
  assert.equal(frontmatter.type, "checkpoint");
  assert.deepEqual(frontmatter.relates, ["task-1"]);
});
