import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
const { runDoctorCommand } = require("../../commands/doctor");

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
  assert.ok(Array.isArray(payload.checks));
  assert.equal(typeof payload.failure_count, "number");
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
  assert.match(stale, /ok: index - index cache is stale \(run mdkg index to refresh\)/);
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
