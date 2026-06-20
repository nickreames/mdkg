import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
const { runValidateCommand } = require("../../commands/validate");
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
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg", visibility: "private" },
    },
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function updateConfig(root: string, mutate: (config: any) => void): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  mutate(config);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function writeTask(root: string): void {
  writeTaskWithId(root, "task-1");
}

function writeTaskWithId(root: string, id: string): void {
  const content = [
    "---",
    `id: ${id}`,
    "type: task",
    "title: missing headings",
    "status: todo",
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
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", `${id}.md`), content);
}

function spikeFrontmatter(overrides: string[], body: string[] = ["# Research Question", "", "Question."]): string {
  const lines = [
    "---",
    "id: spike-1",
    "type: spike",
    "title: Spike fixture",
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
    "created: 2026-01-06",
    "updated: 2026-01-06",
  ];
  const replaced = new Set<string>();
  const updated = lines.map((line) => {
    const key = line.split(":", 1)[0];
    const override = overrides.find((entry) => entry.startsWith(`${key}:`));
    if (override) {
      replaced.add(key);
      return override;
    }
    return line;
  });
  for (const override of overrides) {
    const key = override.split(":", 1)[0];
    if (!replaced.has(key)) {
      updated.push(override);
    }
  }
  return updated.concat(["---", "", ...body]).join("\n");
}

function captureOutput(fn: () => void): { stdout: string; stderr: string; error?: unknown } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalError = console.error;
  const originalLog = console.log;
  let error: unknown;
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };

  try {
    fn();
  } catch (err) {
    error = err;
  } finally {
    console.error = originalError;
    console.log = originalLog;
  }

  return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), error };
}

function git(root: string, args: string[]): void {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
}

test("runValidateCommand writes warnings to --out and respects --quiet", () => {
  const root = makeTempDir("mdkg-validate-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const outPath = "report.txt";
  const output = captureOutput(() => runValidateCommand({ root, out: outPath, quiet: true }));

  const report = fs.readFileSync(path.join(root, outPath), "utf8");
  assert.ok(report.includes("warning: root:task-1"));
  assert.equal(output.error, undefined);
  assert.equal(output.stderr, "");
});

test("runValidateCommand emits a success JSON receipt", () => {
  const root = makeTempDir("mdkg-validate-json-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const output = captureOutput(() => runValidateCommand({ root, out: "report.txt", json: true }));
  const receipt = JSON.parse(output.stdout) as {
    action: string;
    ok: boolean;
    warning_count: number;
    error_count: number;
    warnings: string[];
    errors: string[];
    report_path?: string;
  };

  assert.equal(output.error, undefined);
  assert.equal(output.stderr, "");
  assert.equal(receipt.action, "validated");
  assert.equal(receipt.ok, true);
  assert.ok(receipt.warning_count > 0);
  assert.equal(receipt.error_count, 0);
  assert.equal(receipt.errors.length, 0);
  assert.ok(receipt.warnings.some((warning) => warning.includes("root:task-1")));
  assert.equal(receipt.report_path, path.resolve(root, "report.txt"));

  const report = fs.readFileSync(path.join(root, "report.txt"), "utf8");
  assert.ok(report.includes("warning: root:task-1"));
});

test("runValidateCommand emits typed warning diagnostics", () => {
  const root = makeTempDir("mdkg-validate-warning-diagnostics-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const output = captureOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout) as {
    ok: boolean;
    warning_diagnostics: Array<{
      id: string;
      category: string;
      severity: string;
      qid?: string;
      path?: string;
      remediation: string;
    }>;
  };

  assert.equal(output.error, undefined);
  assert.equal(receipt.ok, true);
  const diagnostic = receipt.warning_diagnostics.find((warning) => warning.id === "heading.missing");
  assert.ok(diagnostic);
  assert.equal(diagnostic?.category, "headings");
  assert.equal(diagnostic?.severity, "warning");
  assert.equal(diagnostic?.qid, "root:task-1");
  assert.equal(diagnostic?.path, ".mdkg/work/task-1.md");
  assert.match(diagnostic?.remediation ?? "", /format --headings --dry-run/);
});

test("runValidateCommand changed-only filters warnings but keeps graph errors", () => {
  const root = makeTempDir("mdkg-validate-changed-only-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTaskWithId(root, "task-1");
  writeTaskWithId(root, "task-2");
  writeTaskWithId(root, "task-3");
  git(root, ["init", "-q"]);
  git(root, ["add", ".mdkg"]);
  git(root, ["-c", "user.name=mdkg", "-c", "user.email=mdkg@example.invalid", "commit", "-q", "-m", "seed"]);
  fs.appendFileSync(path.join(root, ".mdkg", "work", "task-2.md"), "\nchanged\n", "utf8");
  fs.appendFileSync(path.join(root, ".mdkg", "work", "task-1.md"), "\nchanged\n", "utf8");
  writeFile(path.join(root, ".mdkg", "work", "events", "events.jsonl"), "{\"ts\":\"2026-01-01T00:00:00.000Z\"}\n");

  const output = captureOutput(() => runValidateCommand({ root, json: true, changedOnly: true }));
  const receipt = JSON.parse(output.stdout) as {
    ok: boolean;
    warning_count: number;
    warnings: string[];
    warning_filter?: { mode: string; changed_paths: string[] };
    errors: string[];
  };

  assert.match(output.error instanceof Error ? output.error.message : "", /validation failed/);
  assert.equal(receipt.ok, false);
  assert.equal(receipt.warning_filter?.mode, "changed-only");
  assert.ok(receipt.warning_filter?.changed_paths.includes(".mdkg/work/task-1.md"));
  assert.ok(receipt.warning_filter?.changed_paths.includes(".mdkg/work/task-2.md"));
  assert.ok(receipt.warnings.some((warning) => warning.includes("root:task-1")));
  assert.ok(receipt.warnings.some((warning) => warning.includes("root:task-2")));
  assert.ok(!receipt.warnings.some((warning) => warning.includes("root:task-3")));
  assert.ok(receipt.errors.some((error) => error.includes("run_id is required")));
});

test("runValidateCommand emits a failing JSON receipt before throwing", () => {
  const root = makeTempDir("mdkg-validate-json-fail-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeFile(
    path.join(root, ".mdkg", "work", "events", "events.jsonl"),
    JSON.stringify({
      ts: "2026-03-08T00:00:00.000Z",
      workspace: "root",
      agent: "tester",
      kind: "RUN_COMPLETED",
      status: "ok",
      refs: ["task-1"],
      artifacts: [],
      notes: "missing run id",
    })
  );

  const output = captureOutput(() => runValidateCommand({ root, json: true, quiet: true }));
  const receipt = JSON.parse(output.stdout) as {
    ok: boolean;
    error_count: number;
    errors: string[];
  };

  assert.match(output.error instanceof Error ? output.error.message : "", /validation failed with 1 error/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.equal(receipt.error_count, 1);
  assert.equal(receipt.errors.length, 1);
  assert.match(receipt.errors[0] ?? "", /run_id is required/);
});

test("runValidateCommand emits actionable JSON diagnostics for malformed spikes", () => {
  const root = makeTempDir("mdkg-validate-spike-bad-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "work", "spike-bad-id.md"), spikeFrontmatter(["id: spike-alpha"]));
  writeFile(path.join(root, ".mdkg", "work", "spike-bad-status.md"), spikeFrontmatter(["status: researching"]));
  writeFile(path.join(root, ".mdkg", "work", "spike-bad-priority.md"), spikeFrontmatter(["id: spike-2", "priority: 99"]));
  writeFile(
    path.join(root, ".mdkg", "work", "spike-broken-ref.md"),
    spikeFrontmatter(["id: spike-3", "relates: [task-404]"])
  );

  const output = captureOutput(() => runValidateCommand({ root, json: true, quiet: true }));
  const receipt = JSON.parse(output.stdout) as {
    ok: boolean;
    error_count: number;
    warning_count: number;
    errors: string[];
    warnings: string[];
  };

  assert.match(output.error instanceof Error ? output.error.message : "", /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(receipt.error_count >= 4);
  assert.ok(receipt.errors.some((error) => error.includes("spike-bad-id.md") && error.includes("id must match")));
  assert.ok(receipt.errors.some((error) => error.includes("spike-bad-status.md") && error.includes("status must be one of")));
  assert.ok(receipt.errors.some((error) => error.includes("spike-bad-priority.md") && error.includes("priority must be between")));
  assert.ok(
    receipt.errors.some((error) =>
      error.includes("root:spike-3: relates references missing node root:task-404")
    )
  );
  assert.ok(receipt.warning_count > 0);
  assert.ok(
    receipt.warnings.some((warning) =>
      warning.includes("root:spike-3") && warning.includes('missing recommended heading "Search Plan"')
    )
  );
});

test("runValidateCommand fails public records that reference private graph records", () => {
  const root = makeTempDir("mdkg-validate-visibility-");
  writeConfig(root);
  writeDefaultTemplates(root);
  updateConfig(root, (config) => {
    config.workspaces.root.visibility = "public";
    config.workspaces.private_ws = {
      path: "private",
      enabled: true,
      mdkg_dir: ".mdkg",
      visibility: "private",
    };
  });
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Public task",
      "status: todo",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [private_ws:task-2]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-05-18",
      "updated: 2026-05-18",
      "---",
      "",
      "# Overview",
      "",
      "# Acceptance Criteria",
      "",
      "# Files Affected",
      "",
      "# Implementation Notes",
      "",
      "# Test Plan",
      "",
      "# Links / Artifacts",
    ].join("\n")
  );
  writeFile(
    path.join(root, "private", ".mdkg", "work", "task-2.md"),
    [
      "---",
      "id: task-2",
      "type: task",
      "title: Private task",
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
      "created: 2026-05-18",
      "updated: 2026-05-18",
      "---",
      "",
      "# Overview",
      "",
      "# Acceptance Criteria",
      "",
      "# Files Affected",
      "",
      "# Implementation Notes",
      "",
      "# Test Plan",
      "",
      "# Links / Artifacts",
    ].join("\n")
  );

  const output = captureOutput(() => runValidateCommand({ root, json: true, quiet: true }));
  const receipt = JSON.parse(output.stdout) as { ok: boolean; errors: string[] };
  assert.match(output.error instanceof Error ? output.error.message : "", /validation failed/);
  assert.equal(receipt.ok, false);
  assert.ok(receipt.errors.some((error) => error.includes("visibility: root:task-1")));
});

test("runValidateCommand accepts recursive goal scope active_node descendants", () => {
  const root = makeTempDir("mdkg-validate-goal-scope-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Scoped goal",
      "status: progress",
      "priority: 1",
      "goal_state: active",
      "goal_condition: complete scoped task",
      "scope_refs: [epic-1]",
      "active_node: task-1",
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
      "created: 2026-06-01",
      "updated: 2026-06-01",
      "---",
      "",
      "# Objective",
      "",
      "# End Condition",
      "",
      "# Acceptance Criteria",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "epic-1.md"),
    [
      "---",
      "id: epic-1",
      "type: epic",
      "title: Scope epic",
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
      "created: 2026-06-01",
      "updated: 2026-06-01",
      "---",
      "",
      "# Goal",
      "",
      "# Scope",
      "",
      "# Milestones",
      "",
      "# Out of Scope",
      "",
      "# Risks",
      "",
      "# Links / Artifacts",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "feat-1.md"),
    [
      "---",
      "id: feat-1",
      "type: feat",
      "title: Scope feature",
      "status: todo",
      "priority: 1",
      "epic: epic-1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-01",
      "updated: 2026-06-01",
      "---",
      "",
      "# Overview",
      "",
      "# Acceptance Criteria",
      "",
      "# Notes",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Scoped task",
      "status: todo",
      "priority: 1",
      "parent: feat-1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-01",
      "updated: 2026-06-01",
      "---",
      "",
      "# Overview",
      "",
      "# Acceptance Criteria",
      "",
      "# Files Affected",
      "",
      "# Implementation Notes",
      "",
      "# Test Plan",
      "",
      "# Links / Artifacts",
    ].join("\n")
  );

  const output = captureOutput(() => runValidateCommand({ root, json: true, quiet: true }));
  const receipt = JSON.parse(output.stdout) as { ok: boolean; errors: string[] };
  assert.equal(output.error, undefined);
  assert.equal(receipt.ok, true);
  assert.deepEqual(receipt.errors, []);
});
