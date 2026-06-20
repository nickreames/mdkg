import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
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
      "context_refs: []",
      "evidence_refs: []",
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
      "context_refs: []",
      "evidence_refs: []",
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
      "context_refs: []",
      "evidence_refs: []",
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
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    spike: [
      "---",
      "id: {{id}}",
      "type: spike",
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
      "context_refs: []",
      "evidence_refs: []",
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
      "context_refs: []",
      "evidence_refs: []",
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
      "checkpoint_kind: {{checkpoint_kind}}",
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
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
      "scope: []",
      "created: {{created}}",
      "updated: {{updated}}",
      "---",
    ].join("\n"),
    goal: [
      "---",
      "id: {{id}}",
      "type: goal",
      "title: {{title}}",
      "status: {{status}}",
      "priority: {{priority}}",
      "goal_state: active",
      "goal_condition: {{title}}",
      "scope_refs: []",
      "active_node: {{active_node}}",
      "last_active_node: {{last_active_node}}",
      "required_skills: []",
      "required_checks: []",
      "max_iterations: 25",
      "blocked_after_attempts: 3",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "context_refs: []",
      "evidence_refs: []",
      "aliases: []",
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
    spec: [
      "---",
      "id: {{id}}",
      "type: spec",
      "title: {{title}}",
      "version: 0.1.0",
      "spec_kind: capability",
      "role: tool_service",
      "runtime_mode: tool_service",
      "work_contracts: []",
      "requested_capabilities: []",
      "resource_profile: local_cli",
      "update_policy: manual",
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
    work: [
      "---",
      "id: {{id}}",
      "type: work",
      "title: {{title}}",
      "version: 0.1.0",
      "agent_id: agent.example",
      "kind: generic",
      "pricing_model: quoted",
      "required_capabilities: [capability.example]",
      "inputs: [request:text:required]",
      "outputs: [result:text:required]",
      "receipt_required: true",
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
    work_order: [
      "---",
      "id: {{id}}",
      "type: work_order",
      "title: {{title}}",
      "version: 0.1.0",
      "work_id: work.example",
      "work_version: 0.1.0",
      "requester: user.example",
      "order_status: submitted",
      "request_ref: request.example",
      "trigger_ref: trigger.manual",
      "payload_hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "input_refs: []",
      "queue_refs: []",
      "requested_outputs: [result:text:required]",
      "constraint_refs: []",
      "artifact_policy: commit_sidecar_and_zip",
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
    receipt: [
      "---",
      "id: {{id}}",
      "type: receipt",
      "title: {{title}}",
      "version: 0.1.0",
      "work_order_id: order.example",
      "receipt_status: recorded",
      "outcome: success",
      "cost_ref: cost.redacted",
      "redaction_policy: refs_and_hashes_only",
      "proof_refs: []",
      "attestation_refs: []",
      "evidence_hashes: []",
      "input_hashes: []",
      "output_hashes: []",
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
    feedback: [
      "---",
      "id: {{id}}",
      "type: feedback",
      "title: {{title}}",
      "version: 0.1.0",
      "target_id: work.example",
      "sentiment: neutral",
      "feedback_status: new",
      "source_ref: user.example",
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
    dispute: [
      "---",
      "id: {{id}}",
      "type: dispute",
      "title: {{title}}",
      "version: 0.1.0",
      "work_order_id: order.example",
      "receipt_id: receipt.example",
      "dispute_status: open",
      "severity: medium",
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
    proposal: [
      "---",
      "id: {{id}}",
      "type: proposal",
      "title: {{title}}",
      "version: 0.1.0",
      "target_id: work.example",
      "proposal_status: proposed",
      "proposal_kind: work_update",
      "evidence_refs: []",
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
  context_refs?: string[];
  evidence_refs?: string[];
  skills?: string[];
  scope_refs?: string[];
  active_node?: string;
  created?: string;
  updated?: string;
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
  if (options.context_refs) {
    lines.push(`context_refs: [${options.context_refs.join(", ")}]`);
  }
  if (options.evidence_refs) {
    lines.push(`evidence_refs: [${options.evidence_refs.join(", ")}]`);
  }
  if (options.skills) {
    lines.push(`skills: [${options.skills.join(", ")}]`);
  }
  if (options.type === "goal") {
    lines.push("goal_state: active");
    lines.push(`goal_condition: ${options.title ?? options.id}`);
    lines.push(`scope_refs: [${(options.scope_refs ?? []).join(", ")}]`);
    if (options.active_node) {
      lines.push(`active_node: ${options.active_node}`);
    }
    lines.push("required_skills: []");
    lines.push("required_checks: []");
    lines.push("max_iterations: 25");
    lines.push("blocked_after_attempts: 3");
  }
  lines.push(`created: ${options.created ?? "2026-01-06"}`);
  lines.push(`updated: ${options.updated ?? "2026-01-06"}`);
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

test("buildPack traverses semantic context and evidence refs when requested", () => {
  const root = makeTempDir("mdkg-pack-semantic-refs-");
  writeConfig(root);
  writeTemplates(root);
  writeNode(root, {
    id: "task-1",
    type: "task",
    title: "Root task",
    status: "todo",
    priority: 1,
    context_refs: ["task-2"],
    evidence_refs: ["task-3", "proof://example/evidence"],
  });
  writeNode(root, { id: "task-2", type: "task", title: "Context task", status: "todo", priority: 2 });
  writeNode(root, { id: "task-3", type: "task", title: "Evidence task", status: "done", priority: 3 });
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 1,
    edges: ["context_refs", "evidence_refs"],
    verbose: false,
    maxNodes: 10,
    verboseCoreListPath: path.join(root, ".mdkg", "core", "core.md"),
  });

  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid).sort(),
    ["root:task-1", "root:task-2", "root:task-3"]
  );
  const rootNode = result.pack.nodes.find((node: { qid: string }) => node.qid === "root:task-1");
  assert.deepEqual(rootNode?.context_refs, ["root:task-2"]);
  assert.deepEqual(rootNode?.evidence_refs, ["root:task-3", "proof://example/evidence"]);
});

test("buildPack reports verbose core ambiguity without workspace hint", () => {
  const root = makeTempDir("mdkg-pack-verbose-ambiguous-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, ["rule-1", "rule-missing"]);

  writeNode(root, { id: "task-1", type: "task", status: "todo" });
  writeNode(root, { id: "rule-1", type: "rule" });

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  const rootRule = index.nodes["root:rule-1"];
  assert.ok(rootRule);
  index.nodes["docs:rule-1"] = {
    ...rootRule,
    qid: "docs:rule-1",
    ws: "docs",
    path: "docs/.mdkg/core/rule-1.md",
  };

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 0,
    edges: config.pack.default_edges,
    verbose: true,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    includeLatestCheckpoint: false,
  });

  assert.ok(result.warnings.some((warning: string) => warning.includes("ambiguous: rule-1")));
  assert.ok(result.warnings.some((warning: string) => warning.includes("missing: rule-missing")));
  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid),
    ["root:task-1"]
  );
});

test("buildPack traverses prev next blocked edges and ignores unavailable neighbors", () => {
  const root = makeTempDir("mdkg-pack-traversal-edges-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, {
    id: "task-1",
    type: "task",
    status: "todo",
    prev: "task-2",
    next: "task-3",
    blocked_by: ["task-4", "task-99"],
    blocks: ["task-5", "task-2"],
  });
  writeNode(root, { id: "task-2", type: "task", status: "done", next: "task-1" });
  writeNode(root, { id: "task-3", type: "task", status: "todo", prev: "task-1" });
  writeNode(root, { id: "task-4", type: "task", status: "blocked" });
  writeNode(root, { id: "task-5", type: "task", status: "todo" });

  const config = loadConfig(root);
  const index = buildIndex(root, config, { tolerant: true });

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 1,
    edges: ["prev", "next", "blocked-by", "blocks", "ignored-edge", "prev"],
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
    includeLatestCheckpoint: false,
  });

  const qids = result.pack.nodes.map((node: { qid: string }) => node.qid);
  assert.deepEqual(
    [...qids].sort(),
    ["root:task-1", "root:task-2", "root:task-3", "root:task-4", "root:task-5"]
  );
  assert.equal(qids.filter((qid: string) => qid === "root:task-2").length, 1);
  assert.equal(result.pack.meta.latest_checkpoint_qid, undefined);
  assert.equal(result.pack.meta.truncated.max_nodes, false);
  assert.deepEqual(result.warnings, []);
});

test("buildPack errors when a selected node source file is missing", () => {
  const root = makeTempDir("mdkg-pack-missing-file-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, { id: "task-1", type: "task", status: "todo", relates: ["prd-1"] });
  writeNode(root, { id: "prd-1", type: "prd" });

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  fs.unlinkSync(path.join(root, ".mdkg", "design", "prd-1.md"));

  assert.throws(
    () =>
      buildPack({
        root,
        index,
        rootQid: "root:task-1",
        depth: 1,
        edges: ["relates"],
        verbose: false,
        maxNodes: config.pack.limits.max_nodes,
        verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
        wsHint: "root",
        includeLatestCheckpoint: false,
      }),
    /file not found for root:prd-1/
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
    relates: ["edd-1", "dec-1", "rule-1", "prd-1", "prop-1", "feat-1", "task-1", "bug-1", "spike-1", "chk-1"],
  });
  writeNode(root, { id: "edd-1", type: "edd" });
  writeNode(root, { id: "dec-1", type: "dec", status: "accepted" });
  writeNode(root, { id: "rule-1", type: "rule" });
  writeNode(root, { id: "prd-1", type: "prd" });
  writeNode(root, { id: "prop-1", type: "prop" });
  writeNode(root, { id: "feat-1", type: "feat", status: "todo" });
  writeNode(root, { id: "task-1", type: "task", status: "todo" });
  writeNode(root, { id: "bug-1", type: "bug", status: "todo" });
  writeNode(root, { id: "spike-1", type: "spike", status: "todo" });
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
      "root:spike-1",
      "root:chk-1",
    ]
  );
});

test("goal-root pack includes scoped recursive work closure", () => {
  const root = makeTempDir("mdkg-pack-goal-scope-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, { id: "goal-1", type: "goal", status: "progress", priority: 1, scope_refs: ["epic-1"] });
  writeNode(root, { id: "epic-1", type: "epic", status: "todo" });
  writeNode(root, { id: "feat-1", type: "feat", status: "todo", epic: "epic-1" });
  writeNode(root, { id: "task-1", type: "task", status: "todo", parent: "feat-1" });
  writeNode(root, { id: "spike-1", type: "spike", status: "todo", epic: "epic-1" });
  writeNode(root, { id: "test-1", type: "test", status: "todo", epic: "epic-1" });
  writeNode(root, { id: "task-99", type: "task", status: "todo", priority: 0 });

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  const result = buildPack({
    root,
    index,
    rootQid: "root:goal-1",
    depth: 0,
    edges: [],
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
    includeLatestCheckpoint: false,
  });

  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid),
    ["root:goal-1", "root:epic-1", "root:feat-1", "root:task-1", "root:spike-1", "root:test-1"]
  );
  assert.equal(result.pack.nodes.some((node: { qid: string }) => node.qid === "root:task-99"), false);
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

test("buildPack includes latest checkpoint via pack-time resolver", () => {
  const root = makeTempDir("mdkg-pack-latest-checkpoint-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, { id: "task-1", type: "task", status: "todo" });
  writeNode(root, {
    id: "chk-1",
    type: "checkpoint",
    status: "done",
    created: "2026-01-01",
    updated: "2026-01-01",
  });
  writeNode(root, {
    id: "chk-2",
    type: "checkpoint",
    status: "done",
    created: "2026-02-01",
    updated: "2026-02-01",
  });

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.meta.latest_checkpoint_qid?.root, "root:chk-2");

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 0,
    edges: config.pack.default_edges,
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.equal(result.pack.meta.latest_checkpoint_qid, "root:chk-2");
  assert.deepEqual(
    result.pack.nodes.map((node: { qid: string }) => node.qid),
    ["root:task-1", "root:chk-2"]
  );
});

test("buildPack latest checkpoint resolver breaks date ties by qid", () => {
  const root = makeTempDir("mdkg-pack-checkpoint-tie-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, { id: "task-1", type: "task", status: "todo" });
  writeNode(root, {
    id: "chk-1",
    type: "checkpoint",
    status: "done",
    created: "2026-02-01",
    updated: "2026-02-01",
  });
  writeNode(root, {
    id: "chk-2",
    type: "checkpoint",
    status: "done",
    created: "2026-02-01",
    updated: "2026-02-01",
  });

  const config = loadConfig(root);
  const index = buildIndex(root, config);

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 0,
    edges: config.pack.default_edges,
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.equal(result.pack.meta.latest_checkpoint_qid, "root:chk-2");
});

test("buildPack latest checkpoint hint never overrides resolver", () => {
  const root = makeTempDir("mdkg-pack-checkpoint-hint-");
  writeConfig(root);
  writeTemplates(root);
  writeCoreList(root, []);

  writeNode(root, { id: "task-1", type: "task", status: "todo" });
  writeNode(root, {
    id: "chk-1",
    type: "checkpoint",
    status: "done",
    created: "2026-01-01",
    updated: "2026-01-01",
  });
  writeNode(root, {
    id: "chk-2",
    type: "checkpoint",
    status: "done",
    created: "2026-03-01",
    updated: "2026-03-01",
  });

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  index.meta.latest_checkpoint_qid = { root: "root:chk-1" };

  const result = buildPack({
    root,
    index,
    rootQid: "root:task-1",
    depth: 0,
    edges: config.pack.default_edges,
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: "root",
  });

  assert.equal(result.pack.meta.latest_checkpoint_qid_hint, "root:chk-1");
  assert.equal(result.pack.meta.latest_checkpoint_qid, "root:chk-2");
  assert.ok(result.warnings.some((warning: string) => warning.includes("hint mismatch")));
});
