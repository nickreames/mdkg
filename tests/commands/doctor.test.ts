import { test } from "node:test";
import assert from "node:assert/strict";
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
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

test("runDoctorCommand succeeds on a valid workspace", () => {
  const root = makeTempDir("mdkg-doctor-ok-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");

  const originalLog = console.log;
  console.log = () => {};
  try {
    runDoctorCommand({ root });
  } finally {
    console.log = originalLog;
  }
});

test("runDoctorCommand fails when template schemas are missing", () => {
  const root = makeTempDir("mdkg-doctor-fail-");
  writeConfig(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");

  const originalLog = console.log;
  console.log = () => {};
  try {
    assert.throws(() => runDoctorCommand({ root }), /doctor failed/);
  } finally {
    console.log = originalLog;
  }
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
