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
        status_preference: ["progress", "todo", "review", "blocked", "backlog"],
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

test("loadTemplateSchemas falls back to bundled schemas when local built-in templates are missing", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeTemplate(root, "other", "task.md", "task");
  const schemas = loadTemplateSchemas(root, config, ["task"]);
  assert.equal(Boolean(schemas.task.allowedKeys.has("title")), true);
});

test("loadTemplateSchemas falls back only for missing local required built-in types", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeTemplate(root, "default", "task.md", "task");
  const schemas = loadTemplateSchemas(root, config, ["task", "bug"]);
  assert.equal(Boolean(schemas.task.allowedKeys.has("title")), true);
  assert.equal(Boolean(schemas.bug.allowedKeys.has("title")), true);
});

test("loadTemplateSchemas errors when a missing required type has no bundled fallback", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeTemplate(root, "default", "task.md", "task");
  assert.throws(
    () => loadTemplateSchemas(root, config, ["task", "not_builtin"]),
    /bundled template fallback missing/
  );
});

test("loadTemplateSchemas still fails on malformed local templates", () => {
  const root = makeTempDir("mdkg-templates-");
  const config = makeConfig();
  writeFile(path.join(root, ".mdkg", "templates", "default", "task.md"), "not frontmatter\n");
  assert.throws(
    () => loadTemplateSchemas(root, config, ["task", "bug"]),
    /frontmatter must start with ---/
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
