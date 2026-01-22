import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { buildIndex } = require("../../graph/indexer");
const { loadConfig } = require("../../core/config");
const { buildPack } = require("../../pack/pack");
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
      default_depth: 1,
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

function writeTemplates(root: string): void {
  const templates: Record<string, string> = {
    task: [
      "---",
      "id: {{id}}",
      "type: task",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "epic: {{epic}}",
      "parent: {{parent}}",
      "prev: {{prev}}",
      "next: {{next}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    epic: [
      "---",
      "id: {{id}}",
      "type: epic",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    feat: [
      "---",
      "id: {{id}}",
      "type: feat",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "epic: {{epic}}",
      "parent: {{parent}}",
      "prev: {{prev}}",
      "next: {{next}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    bug: [
      "---",
      "id: {{id}}",
      "type: bug",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "epic: {{epic}}",
      "parent: {{parent}}",
      "prev: {{prev}}",
      "next: {{next}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    test: [
      "---",
      "id: {{id}}",
      "type: test",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "epic: {{epic}}",
      "parent: {{parent}}",
      "prev: {{prev}}",
      "next: {{next}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "cases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    checkpoint: [
      "---",
      "id: {{id}}",
      "type: checkpoint",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "epic: {{epic}}",
      "parent: {{parent}}",
      "prev: {{prev}}",
      "next: {{next}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "scope: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    rule: [
      "---",
      "id: {{id}}",
      "type: rule",
      "title: {{title}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    prd: [
      "---",
      "id: {{id}}",
      "type: prd",
      "title: {{title}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    edd: [
      "---",
      "id: {{id}}",
      "type: edd",
      "title: {{title}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    prop: [
      "---",
      "id: {{id}}",
      "type: prop",
      "title: {{title}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    dec: [
      "---",
      "id: {{id}}",
      "type: dec",
      "title: {{title}}",
      "status: proposed",
      "supersedes: {{supersedes}}",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
  };

  for (const [name, content] of Object.entries(templates)) {
    writeFile(path.join(root, ".mdkg", "templates", "default", `${name}.md`), content);
  }
}

function writeCoreList(root: string, ids: string[]): void {
  const lines = ["# core list", ...ids];
  writeFile(path.join(root, ".mdkg", "core", "core.md"), lines.join("\n"));
}

type NodeOptions = {
  id: string;
  type: string;
  title?: string;
  status?: string;
  priority?: number;
  epic?: string;
  parent?: string;
  prev?: string;
  next?: string;
  relates?: string[];
  blocked_by?: string[];
  blocks?: string[];
};

function areaForType(type: string): string {
  if (type === "rule") {
    return "core";
  }
  if (type === "prd" || type === "edd" || type === "dec" || type === "prop") {
    return "design";
  }
  return "work";
}

function writeNode(root: string, options: NodeOptions): void {
  const lines: string[] = ["---"];
  lines.push(`id: ${options.id}`);
  lines.push(`type: ${options.type}`);
  lines.push(`title: ${options.title ?? options.id}`);
  if (options.status) {
    lines.push(`status: ${options.status}`);
  }
  if (options.priority !== undefined) {
    lines.push(`priority: ${options.priority}`);
  }
  if (options.epic) {
    lines.push(`epic: ${options.epic}`);
  }
  if (options.parent) {
    lines.push(`parent: ${options.parent}`);
  }
  if (options.prev) {
    lines.push(`prev: ${options.prev}`);
  }
  if (options.next) {
    lines.push(`next: ${options.next}`);
  }
  if (options.relates) {
    lines.push(`relates: [${options.relates.join(", ")}]`);
  }
  if (options.blocked_by) {
    lines.push(`blocked_by: [${options.blocked_by.join(", ")}]`);
  }
  if (options.blocks) {
    lines.push(`blocks: [${options.blocks.join(", ")}]`);
  }
  lines.push("created: 2026-01-06");
  lines.push("updated: 2026-01-06");
  lines.push("---");
  lines.push("");
  lines.push(`# ${options.id}`);
  lines.push("");
  lines.push(`Body for ${options.id}.`);

  const area = areaForType(options.type);
  writeFile(path.join(root, ".mdkg", area, `${options.id}.md`), lines.join("\n"));
}

test("buildPack includes verbose core ids", () => {
  const root = makeTempDir("mdkg-pack-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, ["rule-1", "rule-missing"]);

  writeNode(root, { id: "task-1", type: "task", status: "todo", epic: "epic-1", parent: "feat-1", relates: ["prd-1"] });
  writeNode(root, { id: "epic-1", type: "epic", status: "todo" });
  writeNode(root, { id: "feat-1", type: "feat", status: "todo" });
  writeNode(root, { id: "prd-1", type: "prd" });
  writeNode(root, { id: "rule-1", type: "rule" });

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 1,
    edges: config.pack.default_edges,
    verbose: true,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.ok(result.warnings.some((warning: string) => warning.includes("missing")));
  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid),
    ["root:task-1", "root:feat-1", "root:epic-1", "root:rule-1", "root:prd-1"]
  );
});

test("task-root ordering follows rule-2 groups", () => {
  const root = makeTempDir("mdkg-pack-order-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, {
    id: "task-1",
    type: "task",
    status: "todo",
    epic: "epic-1",
    parent: "feat-2",
    relates: ["edd-1", "dec-1", "rule-1", "prd-1", "prop-1", "chk-1"],
    blocked_by: ["task-9"],
  });
  writeNode(root, { id: "feat-2", type: "feat", status: "todo" });
  writeNode(root, { id: "epic-1", type: "epic", status: "todo" });
  writeNode(root, { id: "chk-1", type: "checkpoint", status: "done" });
  writeNode(root, { id: "task-9", type: "task", status: "blocked" });
  writeNode(root, { id: "edd-1", type: "edd" });
  writeNode(root, { id: "dec-1", type: "dec", status: "accepted" });
  writeNode(root, { id: "rule-1", type: "rule" });
  writeNode(root, { id: "prd-1", type: "prd" });
  writeNode(root, { id: "prop-1", type: "prop" });

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 1,
    edges: [...config.pack.default_edges, "blocked_by"],
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid),
    [
      "root:task-1",
      "root:feat-2",
      "root:epic-1",
      "root:chk-1",
      "root:task-9",
      "root:edd-1",
      "root:dec-1",
      "root:rule-1",
      "root:prd-1",
      "root:prop-1",
    ]
  );
});

test("non-task roots use fallback ordering", () => {
  const root = makeTempDir("mdkg-pack-fallback-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, {
    id: "epic-1",
    type: "epic",
    status: "todo",
    relates: ["edd-1", "dec-1", "rule-1", "prd-1", "prop-1", "feat-1", "task-1", "bug-1", "chk-1"],
  });
  writeNode(root, { id: "edd-1", type: "edd" });
  writeNode(root, { id: "dec-1", type: "dec", status: "accepted" });
  writeNode(root, { id: "rule-1", type: "rule" });
  writeNode(root, { id: "prd-1", type: "prd" });
  writeNode(root, { id: "prop-1", type: "prop" });
  writeNode(root, { id: "feat-1", type: "feat", status: "todo" });
  writeNode(root, { id: "task-1", type: "task", status: "todo" });
  writeNode(root, { id: "bug-1", type: "bug", status: "todo" });
  writeNode(root, { id: "chk-1", type: "checkpoint", status: "done" });

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  const result = buildPack({
    root,
    index,
    rootQid: "root:epic-1",
    depth: 1,
    edges: config.pack.default_edges,
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid),
    [
      "root:epic-1",
      "root:edd-1",
      "root:dec-1",
      "root:rule-1",
      "root:prd-1",
      "root:prop-1",
      "root:feat-1",
      "root:task-1",
      "root:bug-1",
      "root:chk-1",
    ]
  );
});

test("pack truncates by max_nodes", () => {
  const root = makeTempDir("mdkg-pack-truncate-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, {
    id: "task-1",
    type: "task",
    status: "todo",
    relates: ["edd-1", "dec-1", "rule-1", "prd-1"],
  });
  writeNode(root, { id: "edd-1", type: "edd" });
  writeNode(root, { id: "dec-1", type: "dec", status: "accepted" });
  writeNode(root, { id: "rule-1", type: "rule" });
  writeNode(root, { id: "prd-1", type: "prd" });

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 1,
    edges: config.pack.default_edges,
    verbose: false,
    maxNodes: 3,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.equal(result.pack.meta.truncated.max_nodes, true);
  assert.equal(result.pack.nodes.length, 3);
  assert.deepEqual(result.pack.meta.truncated.dropped, ["root:rule-1", "root:prd-1"]);
});
