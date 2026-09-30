import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
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

function writeManifest(root: string, workspacePath = "."): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  writeFile(
    path.join(workspaceRoot, ".mdkg", "work", "agent", "MANIFEST.md"),
    [
      "---",
      "id: agent.capability-worker",
      "type: manifest",
      "title: Capability Worker",
      "version: 0.1.0",
      "spec_kind: agent",
      "role: subagent",
      "runtime_mode: orchestrated",
      "work_contracts: [contract/WORK.md]",
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
      "relates: [work.capability-route]",
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
    path.join(workspaceRoot, ".mdkg", "work", "agent", "contract", "WORK.md"),
    [
      "---",
      "id: work.capability-route",
      "type: work",
      "title: Capability Route",
      "version: 0.1.0",
      "agent_id: agent.capability-worker",
      "kind: routing",
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

function writeWorkOrder(root: string, workspacePath = "."): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  writeFile(
    path.join(workspaceRoot, ".mdkg", "work", "order.capability-route", "WORK_ORDER.md"),
    [
      "---",
      "id: order.capability-route",
      "type: work_order",
      "title: Capability Route Order",
      "version: 0.1.0",
      "work_id: work.capability-route",
      "work_version: 0.1.0",
      "requester: user://CapabilityRequester",
      "order_status: submitted",
      "request_ref: request.redacted",
      "trigger_ref: trigger.manual",
      "payload_hash: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "input_refs: []",
      "queue_refs: [queue://project-db/capability/order.capability-route]",
      "requested_outputs: [result:text:required]",
      "constraint_refs: []",
      "artifact_policy: commit_sidecar_and_zip",
      "tags: [capability]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [work.capability-route]",
      "refs: []",
      "aliases: []",
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
      "# Capability Route Order",
    ].join("\n")
  );
}

function writeReceipt(root: string, workspacePath = "."): void {
  const workspaceRoot = workspacePath === "." ? root : path.join(root, workspacePath);
  writeFile(
    path.join(workspaceRoot, ".mdkg", "work", "receipt.capability-route", "RECEIPT.md"),
    [
      "---",
      "id: receipt.capability-route",
      "type: receipt",
      "title: Capability Route Receipt",
      "version: 0.1.0",
      "work_order_id: order.capability-route",
      "receipt_status: verified",
      "outcome: success",
      "cost_ref: cost.redacted",
      "redaction_policy: refs_and_hashes_only",
      "artifacts: [artifact://capability-result]",
      "proof_refs: [proof://capability]",
      "attestation_refs: []",
      "evidence_hashes: [sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb]",
      "input_hashes: []",
      "output_hashes: []",
      "tags: [capability]",
      "owners: []",
      "links: []",
      "relates: [order.capability-route]",
      "refs: []",
      "aliases: []",
      "created: 2026-05-14",
      "updated: 2026-05-14",
      "---",
      "# Capability Route Receipt",
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
  writeManifest(root);
  writeWork(root);
  writeWorkOrder(root);
  writeReceipt(root);
  writeTask(root);

  const config = loadConfig(root);
  const index = buildCapabilitiesIndex(root, config);
  const kinds = new Set(index.records.map((record: { kind: string }) => record.kind));

  assert.deepEqual([...kinds].sort(), ["core", "design", "skill", "spec", "work"]);
  assert.equal(index.records.some((record: { id: string }) => record.id === "task-1"), false);
  assert.ok(index.records.find((record: { slug?: string }) => record.slug === "capability-skill"));
  const specRecord = index.records.find(
    (record: { id: string }) => record.id === "agent.capability-worker"
  );
  assert.ok(specRecord);
  assert.equal(specRecord.spec.spec_kind, "agent");
  assert.equal(specRecord.node_type, "manifest");
  assert.equal(specRecord.manifest.source_basename, "MANIFEST.md");
  assert.equal(specRecord.manifest.compatibility_mode, "canonical");
  assert.deepEqual(specRecord.spec.requested_capabilities, ["capability.routing"]);
  assert.deepEqual(specRecord.linkage.work_contract_qids, ["root:work.capability-route"]);
  assert.deepEqual(specRecord.linkage.work_order_qids, ["root:order.capability-route"]);
  assert.deepEqual(specRecord.linkage.receipt_qids, ["root:receipt.capability-route"]);
  const workRecord = index.records.find((record: { id: string }) => record.id === "work.capability-route");
  assert.ok(workRecord);
  assert.deepEqual(workRecord.linkage.spec_qids, ["root:agent.capability-worker"]);
  assert.deepEqual(workRecord.linkage.work_order_qids, ["root:order.capability-route"]);
  assert.deepEqual(workRecord.linkage.receipt_qids, ["root:receipt.capability-route"]);
});

test("buildCapabilitiesIndex aggregates enabled child workspace capabilities with visibility", () => {
  const root = makeTempDir("mdkg-capabilities-child-");
  writeConfig(root, {
    ...rootWorkspaceConfig(),
    child: { path: "child", enabled: true, mdkg_dir: ".mdkg", visibility: "public" },
  });
  writeDefaultTemplates(root);
  writeSkill(root, "capability-skill", "child");
  writeManifest(root, "child");
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
  writeCapabilitiesIndex(root, indexPath, initial);
  touch(indexPath, Date.now() - 60_000);
  writeDesign(root);

  const stale = loadCapabilitiesIndex({ root, config, allowReindex: false });
  assert.equal(stale.rebuilt, false);
  assert.equal(stale.stale, true);
});

function workflowFixture(backend: string): string {
  const root = makeTempDir("mdkg-workflow-owner-");
  writeConfig(root, { ...rootWorkspaceConfig(), child: { path: "child", enabled: true, mdkg_dir: ".mdkg" } });
  const configPath = path.join(root, ".mdkg/config.json");
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  raw.index.backend = backend;
  writeFile(configPath, JSON.stringify(raw));
  writeDefaultTemplates(root);
  for (const workspace of [".", "child"]) {
    writeManifest(root, workspace); writeWork(root, workspace);
    writeWorkOrder(root, workspace); writeReceipt(root, workspace);
  }
  return root;
}

// The same cases can be exercised against retained installed bytes for
// failing-before evidence, without importing the candidate's source tree.
const subjectDist = process.env.MDKG_TEST_PACKAGE
  ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
function subject(module: string): any { return require(path.join(subjectDist, module)); }

for (const backend of ["json", "sqlite"]) {
  test(`workflow evidence remains workspace-owned in ${backend} projections and status`, () => {
    const root = workflowFixture(backend);
    const config = subject("core/config").loadConfig(root);
    subject("graph/reindex").writeDerivedIndexes(root, config);
    const file = path.join(root, ".mdkg/index/capabilities.json");
    const records = JSON.parse(fs.readFileSync(file, "utf8")).records;
    for (const ws of ["root", "child"]) {
      for (const id of ["work.capability-route", "agent.capability-worker"]) {
        const record = records.find((item: any) => item.qid === `${ws}:${id}`);
        assert.deepEqual(record.linkage.work_order_qids, [`${ws}:order.capability-route`]);
        assert.deepEqual(record.linkage.receipt_qids, [`${ws}:receipt.capability-route`]);
      }
      const result = spawnSync(process.execPath, [path.join(subjectDist, "cli.js"), "work", "order", "status", `${ws}:order.capability-route`, "--json"], { cwd: root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(JSON.parse(result.stdout).receipts.map((item: any) => item.qid), [`${ws}:receipt.capability-route`]);
    }
    if (backend === "sqlite") {
      const { DatabaseSync } = require("node:sqlite");
      const db = new DatabaseSync(path.resolve(root, config.index.sqlite_path), { readOnly: true });
      try {
        const projected = db.prepare("SELECT json FROM capabilities WHERE qid = ?").get("root:work.capability-route");
        assert.deepEqual(JSON.parse(projected.json).linkage.receipt_qids, ["root:receipt.capability-route"]);
      } finally { db.close(); }
    }
  });
}

test("warm and stale capability caches cannot lend another workspace's receipt evidence", () => {
  const root = workflowFixture("json"), config = subject("core/config").loadConfig(root);
  const producer = subject("graph/capabilities_indexer"), consumer = subject("graph/capabilities_index_cache");
  const file = producer.resolveCapabilitiesIndexPath(root, config);
  const initial = producer.buildCapabilitiesIndex(root, config);
  initial.records.find((item: any) => item.qid === "root:work.capability-route").linkage.receipt_qids = ["child:receipt.capability-route"];
  consumer.writeCapabilitiesIndex(root, file, initial);
  const before = fs.readFileSync(file);
  for (const stale of [false, true]) {
    if (stale) touch(file, Date.now() - 60_000);
    const result = consumer.loadCapabilitiesIndex({ root, config, allowReindex: false, persistReindex: false });
    assert.equal(result.stale, stale);
    assert.equal(result.rebuilt, false);
    assert.deepEqual(result.index.records.find((item: any) => item.qid === "root:work.capability-route").linkage.receipt_qids, ["root:receipt.capability-route"]);
    assert.deepEqual(fs.readFileSync(file), before);
  }
});

test("explicit qualified cross-workspace workflow references retain their intended target", () => {
  const root = workflowFixture("json");
  const file = path.join(root, "child/.mdkg/work/receipt.capability-route/RECEIPT.md");
  writeFile(file, fs.readFileSync(file, "utf8").replace("work_order_id: order.capability-route", "work_order_id: root:order.capability-route"));
  const config = subject("core/config").loadConfig(root);
  const records = subject("graph/capabilities_indexer").buildCapabilitiesIndex(root, config).records;
  assert.deepEqual(records.find((item: any) => item.qid === "root:work.capability-route").linkage.receipt_qids, ["child:receipt.capability-route", "root:receipt.capability-route"]);
  assert.deepEqual(records.find((item: any) => item.qid === "child:work.capability-route").linkage.receipt_qids, []);
});

test("workflow status and verification derive reference ownership rather than trusting cached attributes", () => {
  const root = workflowFixture("json"), config = subject("core/config").loadConfig(root);
  subject("graph/reindex").writeDerivedIndexes(root, config);
  const file = path.resolve(root, config.index.global_index_path);
  const cached = JSON.parse(fs.readFileSync(file, "utf8"));
  cached.nodes["child:receipt.capability-route"].attributes.work_order_id = "root:order.capability-route";
  writeFile(file, JSON.stringify(cached));
  const before = fs.readFileSync(file);
  for (const stale of [false, true]) {
    if (stale) touch(file, Date.now() - 60_000);
    const run = (args: string[]) => {
      const result = spawnSync(process.execPath, [path.join(subjectDist, "cli.js"), ...args, "--json"], { cwd: root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(result.stdout);
    };
    const status = run(["work", "order", "status", "root:order.capability-route"]);
    assert.deepEqual(status.receipts.map((item: any) => item.qid), ["root:receipt.capability-route"]);
    const verification = run(["work", "receipt", "verify", "child:receipt.capability-route"]);
    assert.equal(verification.receipt.work_order_qid, "child:order.capability-route");
    assert.equal(verification.work_order.work_qid, "child:work.capability-route");
    assert.deepEqual(fs.readFileSync(file), before);
  }
});

test("explicit stale capability discovery survives malformed unrelated nodes without unverified linkage", () => {
  const root = workflowFixture("json"), config = subject("core/config").loadConfig(root);
  writeSkill(root, "available-skill");
  const producer = subject("graph/capabilities_indexer"), consumer = subject("graph/capabilities_index_cache");
  const file = producer.resolveCapabilitiesIndexPath(root, config);
  consumer.writeCapabilitiesIndex(root, file, producer.buildCapabilitiesIndex(root, config));
  const before = fs.readFileSync(file);
  writeFile(path.join(root, ".mdkg/work/broken.md"), "---\nid: malformed\ntype: not-a-node-type\n---\n");
  touch(file, Date.now() - 60_000);
  const result = consumer.loadCapabilitiesIndex({ root, config, allowReindex: false, persistReindex: false });
  assert.equal(result.stale, true);
  assert.ok(result.index.records.some((item: any) => item.slug === "available-skill"));
  assert.ok(result.index.records.every((item: any) => item.linkage === undefined));
  assert.match(result.index.meta.inspection_errors.join(" "), /linkage withheld/);
  assert.deepEqual(fs.readFileSync(file), before);
});
