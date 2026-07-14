import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { buildIndex } = require("../../graph/indexer");
const { loadConfig } = require("../../core/config");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

type TestWorkspaceConfig = Record<string, { path: string; enabled: boolean; mdkg_dir: string }>;

function rootWorkspaceConfig(): TestWorkspaceConfig {
  return {
    root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
  };
}

function writeConfig(root: string, workspaces: TestWorkspaceConfig = rootWorkspaceConfig()): void {
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
      next: { strategy: "chain_then_priority", status_preference: ["progress", "todo", "review", "blocked", "backlog"] },
    },
    workspaces,
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeTask(
  root: string,
  id: string,
  relates: string[] = [],
  workspacePath = "."
): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  const content = [
    "---",
    `id: ${id}`,
    "type: task",
    `title: ${id}`,
    "status: todo",
    "tags: []",
    "links: []",
    "artifacts: []",
    `relates: [${relates.join(", ")}]`,
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  writeFile(path.join(workspaceRoot, ".mdkg", "work", `${id}.md`), content);
}

test("buildIndex creates qids and reverse edges", () => {
  const root = makeTempDir("mdkg-index-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1", ["task-2"]);
  writeTask(root, "task-2");

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  assert.ok(index.nodes["root:task-1"]);
  assert.ok(index.nodes["root:task-2"]);
  assert.deepEqual(index.reverse_edges.relates["root:task-2"], ["root:task-1"]);
});

test("buildIndex rejects graph count and byte budgets before reading files", () => {
  const root = makeTempDir("mdkg-index-budget-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1");
  writeTask(root, "task-2");

  const countConfig = loadConfig(root);
  countConfig.index.limits.max_files = 1;
  assert.throws(() => buildIndex(root, countConfig), /graph file count exceeds/);

  const byteConfig = loadConfig(root);
  const taskBytes = Buffer.byteLength(require("node:fs").readFileSync(path.join(root, ".mdkg", "work", "task-1.md")));
  byteConfig.index.limits.max_file_bytes = taskBytes - 1;
  assert.throws(() => buildIndex(root, byteConfig), /graph file exceeds/);
});

test("buildIndex tolerates invalid nodes when tolerant", () => {
  const root = makeTempDir("mdkg-index-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1");
  writeFile(path.join(root, ".mdkg", "work", "bad.md"), "no frontmatter");

  const config = loadConfig(root);
  const index = buildIndex(root, config, { tolerant: true });
  assert.ok(index.nodes["root:task-1"]);
});

test("buildIndex includes latest checkpoint hint by workspace", () => {
  const root = makeTempDir("mdkg-index-checkpoint-hint-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1");

  const chk1 = [
    "---",
    "id: chk-1",
    "type: checkpoint",
    "title: chk-1",
    "status: done",
    "priority: 1",
    "tags: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "scope: []",
    "created: 2026-01-01",
    "updated: 2026-01-01",
    "---",
  ].join("\n");
  const chk2 = chk1
    .replace("id: chk-1", "id: chk-2")
    .replace("title: chk-1", "title: chk-2")
    .replace("created: 2026-01-01", "created: 2026-02-01")
    .replace("updated: 2026-01-01", "updated: 2026-02-01");
  writeFile(path.join(root, ".mdkg", "work", "chk-1.md"), chk1);
  writeFile(path.join(root, ".mdkg", "work", "chk-2.md"), chk2);

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.meta.latest_checkpoint_qid?.root, "root:chk-2");
});

test("buildIndex includes registered workspaces and ignores unregistered mdkg folders", () => {
  const root = makeTempDir("mdkg-index-registered-");
  writeConfig(root, {
    ...rootWorkspaceConfig(),
    docs: { path: "docs", enabled: true, mdkg_dir: ".mdkg" },
  });
  writeDefaultTemplates(root);
  writeTask(root, "task-1");
  writeTask(root, "task-2", [], "docs");
  writeTask(root, "task-3", [], "scratch");

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  assert.ok(index.nodes["root:task-1"]);
  assert.ok(index.nodes["docs:task-2"]);
  assert.equal(index.nodes["scratch:task-3"], undefined);
  assert.deepEqual(index.meta.workspaces, ["docs", "root"]);
});

test("buildIndex ignores project DB layout files", () => {
  const root = makeTempDir("mdkg-index-project-db-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1");
  writeFile(
    path.join(root, ".mdkg", "db", "schema", "task-999.md"),
    [
      "---",
      "id: task-999",
      "type: task",
      "title: should not be indexed",
      "status: todo",
      "priority: 1",
      "---",
      "",
      "# Schema note",
    ].join("\n")
  );
  writeFile(path.join(root, ".mdkg", "db", "runtime", "task-998.md"), "# runtime scratch\n");

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  assert.ok(index.nodes["root:task-1"]);
  assert.equal(index.nodes["root:task-999"], undefined);
  assert.equal(index.nodes["root:task-998"], undefined);
});

test("buildIndex excludes disabled registered workspaces", () => {
  const root = makeTempDir("mdkg-index-disabled-");
  writeConfig(root, {
    ...rootWorkspaceConfig(),
    docs: { path: "docs", enabled: false, mdkg_dir: ".mdkg" },
  });
  writeDefaultTemplates(root);
  writeTask(root, "task-1");
  writeTask(root, "task-2", [], "docs");

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  assert.ok(index.nodes["root:task-1"]);
  assert.equal(index.nodes["docs:task-2"], undefined);
  assert.deepEqual(index.meta.workspaces, ["root"]);
  assert.deepEqual(index.workspaces.docs, { path: "docs", enabled: false });
});
