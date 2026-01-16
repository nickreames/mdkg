import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { loadTemplateSchemas } = require("../../graph/template_schema");
import { makeTempDir, writeFile } from "../helpers/fs";

function makeConfig(): any {
  return {
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
        status_preference: ["progress", "todo", "review", "blocked", "backlog", "done"],
      },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
}

function writeTemplate(root: string, setName: string, filename: string, type: string, extra?: string): void {
  const lines = [
    "---",
    "id: {{id}}",
    `type: ${type}`,
    "title: {{title}}",
    "tags: []",
    "created: {{created}}",
    "updated: {{updated}}",
  ];
  if (extra) {
    lines.push(extra);
  }
  lines.push("---");
  writeFile(path.join(root, ".mdkg", "templates", setName, filename), lines.join("\n"));
}

test("loadTemplateSchemas errors when default set is missing", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeTemplate(root, "other", "task.md", "task");
  assert.throws(
    () => loadTemplateSchemas(root, config, ["task"]),
    /no templates found/
  );
});

test("loadTemplateSchemas errors when required types are missing", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeTemplate(root, "default", "task.md", "task");
  assert.throws(
    () => loadTemplateSchemas(root, config, ["task", "bug"]),
    /missing for type/
  );
});

test("loadTemplateSchemas only reads default_set", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeTemplate(root, "default", "task.md", "task");
  writeTemplate(root, "other", "task.md", "task", "mystery: []");
  const schemas = loadTemplateSchemas(root, config, ["task"]);
  assert.equal(Boolean(schemas.task.allowedKeys.has("mystery")), false);
});
