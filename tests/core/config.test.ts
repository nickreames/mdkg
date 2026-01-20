import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { loadConfig } = require("../../core/config");
import { makeTempDir, writeFile } from "../helpers/fs";

const BASE_CONFIG = {
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
    limits: {
      max_nodes: 25,
      max_bytes: 2000000,
    },
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
    root: {
      path: ".",
      enabled: true,
      mdkg_dir: ".mdkg",
    },
  },
};

test("loadConfig reads and validates config", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(configPath, JSON.stringify(BASE_CONFIG, null, 2));

  const config = loadConfig(root);
  assert.equal(config.schema_version, 1);
  assert.equal(config.workspaces.root.path, ".");
});

test("loadConfig fails on missing schema_version", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const badConfig = { ...BASE_CONFIG } as Record<string, unknown>;
  delete badConfig.schema_version;
  writeFile(configPath, JSON.stringify(badConfig, null, 2));

  assert.throws(() => loadConfig(root), /schema_version/);
});
