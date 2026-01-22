import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runGuideCommand } = require("../../commands/guide");
import { makeTempDir, writeFile } from "../helpers/fs";

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

function captureConsole(fn: () => void): { logs: string[]; errors: string[] } {
  const logs: string[] = [];
  const errors: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { logs, errors };
}

test("runGuideCommand prints guide content", () => {
  const root = makeTempDir("mdkg-guide-");
  writeConfig(root);
  writeFile(path.join(root, ".mdkg", "core", "guide.md"), "# Guide\nHello\n");

  const { logs, errors } = captureConsole(() => {
    runGuideCommand({ root });
  });

  assert.equal(errors.length, 0);
  assert.equal(logs.join("\n").includes("# Guide"), true);
});

test("runGuideCommand errors when guide is missing", () => {
  const root = makeTempDir("mdkg-guide-missing-");
  writeConfig(root);
  assert.throws(() => runGuideCommand({ root }), /guide not found/);
});
