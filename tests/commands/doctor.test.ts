import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
const { runDoctorCommand } = require("../../commands/doctor");

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

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

function captureOutput(fn: () => void): string {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return logs.join("\n");
}

function captureDoctorFailure(fn: () => void): string {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  try {
    assert.throws(fn, /doctor failed/);
  } finally {
    console.log = originalLog;
  }
  return logs.join("\n");
}

test("runDoctorCommand succeeds on a valid workspace", () => {
  const root = makeTempDir("mdkg-doctor-ok-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");

  const output = captureOutput(() => runDoctorCommand({ root }));
  assert.match(output, /ok: node-version - Node\.js/);
  assert.match(output, /ok: config - found/);
  assert.match(output, /ok: templates - template schema set loaded/);
  assert.match(output, /ok: index - index cache (rebuilt and loaded|loaded)/);
  assert.match(output, /doctor ok/);
});

test("runDoctorCommand warns when local templates are missing but bundled fallback covers them", () => {
  const root = makeTempDir("mdkg-doctor-fail-");
  writeConfig(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");

  const output = captureOutput(() => runDoctorCommand({ root }));
  assert.match(output, /ok: templates - template schema set loaded/);
  assert.match(output, /warn: local-templates - missing local template schema/);
  assert.match(output, /doctor ok/);
});

test("runDoctorCommand reports missing and invalid config failures", () => {
  const missingRoot = makeTempDir("mdkg-doctor-missing-config-");
  const missingOutput = captureDoctorFailure(() => runDoctorCommand({ root: missingRoot }));
  assert.match(missingOutput, /fail: config - missing config/);
  assert.match(missingOutput, /fail: config-schema - /);
  assert.doesNotMatch(missingOutput, /templates - /);
  assert.doesNotMatch(missingOutput, /index - /);

  const invalidRoot = makeTempDir("mdkg-doctor-invalid-config-");
  writeFile(path.join(invalidRoot, ".mdkg", "config.json"), "{\n");
  const invalidOutput = captureDoctorFailure(() => runDoctorCommand({ root: invalidRoot }));
  assert.match(invalidOutput, /ok: config - found/);
  assert.match(invalidOutput, /fail: config-schema - /);
  assert.doesNotMatch(invalidOutput, /templates - /);
  assert.doesNotMatch(invalidOutput, /index - /);
});

test("runDoctorCommand supports --json output", () => {
  const root = makeTempDir("mdkg-doctor-json-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");

  const originalLog = console.log;
  const logs: string[] = [];
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  try {
    runDoctorCommand({ root, json: true });
  } finally {
    console.log = originalLog;
  }

  assert.equal(logs.length, 1);
  const payload = JSON.parse(logs[0]);
  assert.equal(payload.ok, true);
  assert.equal(payload.action, "doctor");
  assert.equal(payload.strict, false);
  assert.ok(Array.isArray(payload.checks));
  assert.equal(typeof payload.failure_count, "number");
  assert.equal(typeof payload.summary.errors, "number");
  assert.equal(typeof payload.checks[0].id, "string");
  assert.equal(typeof payload.checks[0].status, "string");
  assert.equal(typeof payload.checks[0].severity, "string");
  assert.equal(typeof payload.checks[0].message, "string");
  assert.equal(typeof payload.checks[0].remediation, "string");
});

test("runDoctorCommand strict json fails on stale generated graph cache", () => {
  const root = makeTempDir("mdkg-doctor-strict-stale-cache-");
  writeConfig(root);
  writeDefaultTemplates(root);
  const corePath = path.join(root, ".mdkg", "core", "core.md");
  writeFile(corePath, "# core\n");

  captureOutput(() => runDoctorCommand({ root }));
  const future = new Date(Date.now() + 10_000);
  fs.utimesSync(corePath, future, future);

  const output = captureDoctorFailure(() => runDoctorCommand({ root, strict: true, json: true }));
  const payload = JSON.parse(output);
  assert.equal(payload.action, "doctor");
  assert.equal(payload.strict, true);
  assert.equal(payload.ok, false);
  const indexCheck = payload.checks.find((check: any) => check.id === "graph.index_cache");
  assert.equal(indexCheck.ok, false);
  assert.equal(indexCheck.status, "fail");
  assert.equal(indexCheck.severity, "error");
  assert.match(indexCheck.remediation, /mdkg index/);
});

test("runDoctorCommand strict json fails on achieved selected goal", () => {
  const root = makeTempDir("mdkg-doctor-strict-selected-goal-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Done goal",
      "status: done",
      "priority: 1",
      "goal_condition: Done goal has already achieved its condition.",
      "goal_state: achieved",
      "active_node: task-1",
      "scope_refs: [task-1]",
      "required_checks: []",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Done goal",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Closed task",
      "status: done",
      "priority: 1",
      "parent: goal-1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Closed task",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "state", "selected-goal.json"),
    JSON.stringify(
      {
        qid: "root:goal-1",
        id: "goal-1",
        ws: "root",
        selected_at: "2026-06-09T00:00:00.000Z",
      },
      null,
      2
    )
  );

  const nonStrict = captureOutput(() => runDoctorCommand({ root, json: true }));
  const nonStrictPayload = JSON.parse(nonStrict);
  assert.equal(nonStrictPayload.ok, true);
  const nonStrictCheck = nonStrictPayload.checks.find((check: any) => check.id === "goal.selected_achieved");
  assert.equal(nonStrictCheck.ok, true);
  assert.equal(nonStrictCheck.status, "warn");

  const strictOutput = captureDoctorFailure(() => runDoctorCommand({ root, strict: true, json: true }));
  const strictPayload = JSON.parse(strictOutput);
  assert.equal(strictPayload.ok, false);
  const strictCheck = strictPayload.checks.find((check: any) => check.id === "goal.selected_achieved");
  assert.equal(strictCheck.ok, false);
  assert.equal(strictCheck.status, "fail");
  assert.match(strictCheck.remediation, /goal select/);
});

test("runDoctorCommand strict json fails on enabled project DB verification failure", () => {
  const root = makeTempDir("mdkg-doctor-strict-db-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  updateConfig(root, (config) => {
    config.db = {
      enabled: true,
      schema_version: 1,
      root_path: ".mdkg/db",
      schema_path: ".mdkg/db/schema",
      migrations_path: ".mdkg/db/schema/migrations",
      runtime_path: ".mdkg/db/runtime/project.sqlite",
      state_path: ".mdkg/db/state/project.sqlite",
      receipts_path: ".mdkg/db/receipts",
      migration_table: "mdkg_schema_migration",
    };
  });

  const output = captureDoctorFailure(() => runDoctorCommand({ root, strict: true, json: true }));
  const payload = JSON.parse(output);
  assert.equal(payload.ok, false);
  const dbCheck = payload.checks.find((check: any) => check.id === "db.project_verify");
  assert.equal(dbCheck.ok, false);
  assert.equal(dbCheck.status, "fail");
  assert.equal(dbCheck.severity, "error");
  assert.match(dbCheck.remediation, /mdkg db verify/);
});

test("doctor --strict --json prints one JSON object to stdout and no diagnostics to stderr", () => {
  const root = makeTempDir("mdkg-doctor-strict-cli-json-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  captureOutput(() => runDoctorCommand({ root }));

  const result = spawnSync(process.execPath, [cliPath, "doctor", "--strict", "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.action, "doctor");
  assert.equal(payload.strict, true);
  assert.equal(payload.ok, true);
  assert.equal(result.stdout.trim().startsWith("{"), true);
  assert.equal(result.stdout.trim().endsWith("}"), true);
});

test("runDoctorCommand strict json fails on invalid graph state", () => {
  const root = makeTempDir("mdkg-doctor-strict-invalid-graph-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Invalid task",
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
      "created: 2026-06-09",
      "updated: 2026-06-09",
      "---",
      "",
      "# Invalid task",
    ].join("\n")
  );

  const output = captureDoctorFailure(() => runDoctorCommand({ root, strict: true, noCache: true, json: true }));
  const payload = JSON.parse(output);
  assert.equal(payload.ok, false);
  const graphCheck = payload.checks.find((check: any) => check.id === "graph.validate");
  assert.equal(graphCheck.ok, false);
  assert.equal(graphCheck.status, "fail");
  assert.match(graphCheck.detail, /status is required/);
});

test("runDoctorCommand reports no-cache rebuild and stale cached indexes", () => {
  const root = makeTempDir("mdkg-doctor-index-state-");
  writeConfig(root);
  writeDefaultTemplates(root);
  const corePath = path.join(root, ".mdkg", "core", "core.md");
  writeFile(corePath, "# core\n");

  const rebuilt = captureOutput(() => runDoctorCommand({ root, noCache: true }));
  assert.match(rebuilt, /ok: index - index cache rebuilt and loaded/);

  captureOutput(() => runDoctorCommand({ root }));
  const future = new Date(Date.now() + 10_000);
  fs.utimesSync(corePath, future, future);

  const stale = captureOutput(() => runDoctorCommand({ root, noReindex: true }));
  assert.match(stale, /warn: index - index cache is stale \(run mdkg index to refresh\)/);
});

test("runDoctorCommand reports cached index read failures", () => {
  const root = makeTempDir("mdkg-doctor-bad-index-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(path.join(root, ".mdkg", "index", "global.json"), "{\n");

  const output = captureDoctorFailure(() => runDoctorCommand({ root }));
  assert.match(output, /fail: index - failed to read index/);
});

test("runDoctorCommand warns for active project DB runtime files", () => {
  const root = makeTempDir("mdkg-doctor-project-db-runtime-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
  writeFile(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"), "runtime db");
  writeFile(path.join(root, ".mdkg", "db", "state", "project.sqlite-wal"), "wal");

  const output = captureOutput(() => runDoctorCommand({ root }));
  assert.match(output, /warn: project-db-runtime - active project DB runtime\/transient file\(s\) are local-only/);
  assert.match(output, /\.mdkg\/db\/runtime\/project\.sqlite/);
  assert.match(output, /\.mdkg\/db\/state\/project\.sqlite-wal/);
  assert.match(output, /doctor ok/);
});

test("runDoctorCommand reports visibility policy violations", () => {
  const root = makeTempDir("mdkg-doctor-visibility-");
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
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
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
    ].join("\n")
  );

  const output = captureDoctorFailure(() => runDoctorCommand({ root }));
  assert.match(output, /fail: visibility-policy - /);
  assert.match(output, /root:task-1 \(public\) references private private_ws:task-2/);
});
