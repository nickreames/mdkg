import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runInitCommand } = require("../../commands/init");
import { makeTempDir, writeFile } from "../helpers/fs";

test("runInitCommand copies seed assets and creates directories", () => {
  const root = makeTempDir("mdkg-init-root-");
  const seed = makeTempDir("mdkg-init-seed-");

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

  writeFile(path.join(seed, "config.json"), JSON.stringify(config, null, 2));
  writeFile(path.join(seed, "core", "core.md"), "# core\n");
  writeFile(path.join(seed, "templates", "default", "task.md"), "---\nid: {{id}}\n---\n");
  writeFile(path.join(seed, "README.md"), "# mdkg\n");
  writeFile(path.join(seed, "AGENTS.md"), "# Agents\n");
  writeFile(path.join(seed, "CLAUDE.md"), "# Claude\n");

  runInitCommand({ root, seedRoot: seed });

  assert.ok(fs.existsSync(path.join(root, ".mdkg", "config.json")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "README.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "core", "core.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "templates", "default", "task.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "work")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "design")));
});

test("runInitCommand creates agent docs when requested", () => {
  const root = makeTempDir("mdkg-init-agent-");
  const seed = makeTempDir("mdkg-init-agent-seed-");

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

  writeFile(path.join(seed, "config.json"), JSON.stringify(config, null, 2));
  writeFile(path.join(seed, "core", "core.md"), "# core\n");
  writeFile(path.join(seed, "templates", "default", "task.md"), "---\nid: {{id}}\n---\n");
  writeFile(path.join(seed, "README.md"), "# mdkg\n");
  writeFile(path.join(seed, "AGENTS.md"), "# Agents\n");
  writeFile(path.join(seed, "CLAUDE.md"), "# Claude\n");

  runInitCommand({ root, seedRoot: seed, createLlm: true });

  assert.ok(fs.existsSync(path.join(root, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(root, "CLAUDE.md")));
});

test("runInitCommand warns when ignore files are not updated", () => {
  const root = makeTempDir("mdkg-init-warning-");
  const seed = makeTempDir("mdkg-init-warning-seed-");

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

  writeFile(path.join(seed, "config.json"), JSON.stringify(config, null, 2));
  writeFile(path.join(seed, "core", "core.md"), "# core\n");
  writeFile(path.join(seed, "templates", "default", "task.md"), "---\nid: {{id}}\n---\n");
  writeFile(path.join(seed, "README.md"), "# mdkg\n");

  const originalError = console.error;
  const errors: string[] = [];
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  };
  try {
    runInitCommand({ root, seedRoot: seed });
  } finally {
    console.error = originalError;
  }

  assert.ok(errors.some((line) => line.includes("ignore files were not updated")));
});
