import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { loadConfig } = require("../../core/config");
const {
  buildCapabilitiesIndex,
  resolveCapabilitiesIndexPath,
} = require("../../graph/capabilities_indexer");
const {
  isCapabilitiesIndexStale,
  loadCapabilitiesIndex,
  writeCapabilitiesIndex,
} = require("../../graph/capabilities_index_cache");
import { makeTempDir, touch, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

type TestWorkspaceConfig = Record<
  string,
  { path: string; enabled: boolean; mdkg_dir: string; visibility?: string }
>;

function rootWorkspaceConfig(): TestWorkspaceConfig {
  return {
    root: { path: ".", enabled: true, mdkg_dir: ".mdkg", visibility: "private" },
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
    capabilities: {
      cache_path: ".mdkg/index/capabilities.json",
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
    workspaces,
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeSkill(root: string, slug: string, workspacePath = "."): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  writeFile(
    path.join(workspaceRoot, ".mdkg", "skills", slug, "SKILL.md"),
    [
      "---",
      `name: ${slug}`,
      `description: use when exercising ${slug}`,
      "tags: [stage:execute, capability]",
      "version: 0.1.0",
      "authors: [mdkg]",
      "links: []",
      "---",
      "# Goal",
      "",
      "Exercise capability projection.",
    ].join("\n")
  );
}

function writeCore(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "core", "rule-1.md"),
    [
      "---",
      "id: rule-1",
      "type: rule",
      "title: Capability Rule",
      "tags: [capability]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
      "# Capability Rule",
    ].join("\n")
  );
}

function writeDesign(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "design", "edd-1.md"),
    [
      "---",
      "id: edd-1",
      "type: edd",
      "title: Capability Design",
      "tags: [capability]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
      "# Capability Design",
    ].join("\n")
  );
}

function writeTask(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: normal task",
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
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
    ].join("\n")
  );
}

function writeSpec(root: string, workspacePath = "."): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  writeFile(
    path.join(workspaceRoot, ".mdkg", "work", "agent", "SPEC.md"),
    [
      "---",
      "id: agent.capability-worker",
      "type: spec",
      "title: Capability Worker",
      "version: 0.1.0",
      "role: subagent",
      "runtime_mode: room_orchestrated",
      "work_contracts: []",
      "requested_capabilities: [capability.routing]",
      "skill_refs: [capability-skill]",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "resource_profile: builder",
      "update_policy: manual",
      "tags: [capability]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
      "# Capability Worker",
    ].join("\n")
  );
}

function writeWork(root: string, workspacePath = "."): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  writeFile(
    path.join(workspaceRoot, ".mdkg", "work", "contract", "WORK.md"),
    [
      "---",
      "id: work.capability-route",
      "type: work",
      "title: Capability Route",
      "version: 0.1.0",
      "agent_id: agent.capability-worker",
      "kind: routing",
      "pricing_model: included",
      "required_capabilities: [capability.routing]",
      "skill_refs: [capability-skill]",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "inputs: [request:text:required]",
      "outputs: [result:text:required]",
      "receipt_required: true",
      "tags: [capability]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
      "# Capability Route",
    ].join("\n")
  );
}

test("buildCapabilitiesIndex projects only capability surfaces", () => {
  const root = makeTempDir("mdkg-capabilities-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeSkill(root, "capability-skill");
  writeCore(root);
  writeDesign(root);
  writeSpec(root);
  writeWork(root);
  writeTask(root);

  const config = loadConfig(root);
  const index = buildCapabilitiesIndex(root, config);
  const kinds = new Set(index.records.map((record: { kind: string }) => record.kind));

  assert.deepEqual([...kinds].sort(), ["core", "design", "skill", "spec", "work"]);
  assert.equal(index.records.some((record: { id: string }) => record.id === "task-1"), false);
  assert.ok(index.records.find((record: { slug?: string }) => record.slug === "capability-skill"));
  assert.ok(index.records.find((record: { id: string }) => record.id === "agent.capability-worker"));
  assert.ok(index.records.find((record: { id: string }) => record.id === "work.capability-route"));
});

test("buildCapabilitiesIndex aggregates enabled child workspace capabilities with visibility", () => {
  const root = makeTempDir("mdkg-capabilities-child-");
  writeConfig(root, {
    ...rootWorkspaceConfig(),
    child: { path: "child", enabled: true, mdkg_dir: ".mdkg", visibility: "public" },
  });
  writeDefaultTemplates(root);
  writeSkill(root, "capability-skill", "child");
  writeSpec(root, "child");
  writeWork(root, "child");

  const config = loadConfig(root);
  const index = buildCapabilitiesIndex(root, config);
  const childRecords = index.records.filter(
    (record: { workspace: string }) => record.workspace === "child"
  );

  assert.ok(childRecords.length >= 3);
  assert.equal(
    childRecords.every((record: { visibility: string }) => record.visibility === "public"),
    true
  );
  assert.ok(childRecords.find((record: { slug?: string }) => record.slug === "capability-skill"));
});

test("loadCapabilitiesIndex rebuilds a missing or stale cache", () => {
  const root = makeTempDir("mdkg-capabilities-cache-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeSkill(root, "capability-skill");
  writeCore(root);

  const config = loadConfig(root);
  const indexPath = resolveCapabilitiesIndexPath(root, config);
  const first = loadCapabilitiesIndex({ root, config });
  assert.equal(first.rebuilt, true);
  assert.equal(fs.existsSync(indexPath), true);

  const oldTime = Date.now() - 60_000;
  touch(indexPath, oldTime);
  writeFile(path.join(root, ".mdkg", "skills", "capability-skill", "references", "note.md"), "changed\n");
  assert.equal(isCapabilitiesIndexStale(root, config), true);

  const second = loadCapabilitiesIndex({ root, config });
  assert.equal(second.rebuilt, true);
});

test("loadCapabilitiesIndex can return stale cache when reindex is disabled", () => {
  const root = makeTempDir("mdkg-capabilities-stale-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeCore(root);

  const config = loadConfig(root);
  const indexPath = resolveCapabilitiesIndexPath(root, config);
  const initial = buildCapabilitiesIndex(root, config);
  writeCapabilitiesIndex(indexPath, initial);
  touch(indexPath, Date.now() - 60_000);
  writeDesign(root);

  const stale = loadCapabilitiesIndex({ root, config, allowReindex: false });
  assert.equal(stale.rebuilt, false);
  assert.equal(stale.stale, true);
});
