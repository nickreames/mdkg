import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { mapGraphReferenceFields } = require(path.join(runtime, "graph/identity_refs"));
const { formatFrontmatter, parseFrontmatter } = require(path.join(runtime, "graph/frontmatter"));
const { planLegacyIdentityMigration, replaceGraphFrontmatter } = require(path.join(runtime, "graph/identity_migration"));
const { applyGraphMigrationPlan } = require(path.join(runtime, "graph/identity_transaction"));
const { readAuthoredSnapshot, indexAuthoredSnapshot } = require(path.join(runtime, "graph/identity_snapshot"));
const { bindAuthoredIdentityReferences } = require(path.join(runtime, "graph/identity_authoring"));
const { reconcileIdentitySnapshots } = require(path.join(runtime, "graph/identity_reconcile"));
const { templateIdentityMapper } = require(path.join(runtime, "graph/identity_template"));
const { planTransportIdentity } = require(path.join(runtime, "graph/identity_transport"));
const { identityRef, identityHash, GRAPH_FORMAT_PATH } = require(path.join(runtime, "graph/identity"));
const parameters = { graphId: "e7403372-f270-4cd7-902d-64b792c781df", origin: "ddf626b6-073f-4f99-9d30-5e30912922fd" };
const missing = `mdkg://${parameters.graphId}/11111111-1111-4111-8111-111111111111`;
const dependencies = {
  skill_refs: ["fixture-skill", "skill.fixture"], tool_refs: ["tool.node", "root:tool.node"],
  model_refs: ["model.fixture"], wasm_component_refs: ["wasm.fixture"], runtime_image_refs: ["image.fixture.1.0.0"],
};
const roots: string[] = [];
after(() => { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); });
function run(root: string, args: string[]) {
  return spawnSync(process.execPath, [path.join(runtime, "cli.js"), ...args], { cwd: root, encoding: "utf8", timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
}
function node(root: string, type: string, id: string, extra: Record<string, unknown> = {}) {
  const common = { id, type, title: "Dependency fixture", version: "1.0.0", tags: [], owners: [], links: [], artifacts: [], relates: [], refs: [], aliases: [], created: "2026-09-09", updated: "2026-09-09" };
  const fields = type === "work"
    ? { agent_id: "agent.fixture", kind: "fixture", pricing_model: "included", required_capabilities: ["fixture.read"], inputs: ["request:text:required"], outputs: ["result:text:required"], receipt_required: "true" }
    : { spec_kind: "capability", role: "tool_service", runtime_mode: "tool_service", work_contracts: [], requested_capabilities: [], update_policy: "manual" };
  const file = path.join(root, ".mdkg/work", id, type === "work" ? "WORK.md" : type === "spec" ? "SPEC.md" : "MANIFEST.md");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, ["---", ...formatFrontmatter({ ...common, ...fields, ...extra }), "---", "# Context", "Preserve historical body bytes.\n"].join("\n"));
  return file;
}
function fixture(deps = true) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-identity-dependencies-")); roots.push(root);
  const init = run(root, ["init", "--graph-only"]); assert.equal(init.status, 0, init.stderr);
  node(root, "manifest", "tool.node", { role: "subagent" });
  node(root, "manifest", "agent.fixture", { ...(deps ? dependencies : {}), subagent_refs: ["tool.node"] });
  node(root, "spec", "spec.fixture", deps ? dependencies : {});
  node(root, "work", "work.fixture", deps ? dependencies : {});
  return root;
}
function validate(root: string) { const r = run(root, ["validate", "--json"]); assert.equal(r.status, 0, r.stdout + r.stderr); }
function migrate(root: string) { const p = planLegacyIdentityMigration(root, parameters); assert.deepEqual(p.blocking, []); applyGraphMigrationPlan(root, p, p.plan_hash); return readAuthoredSnapshot(root); }
function assertLabels(fm: Record<string, unknown>) { for (const [key, values] of Object.entries(dependencies)) assert.deepEqual(fm[key], values, key); }

test("reference mapping preserves dependency labels but visits explicit identities and actual graph links", () => {
  const seen: string[] = [];
  const mapped = mapGraphReferenceFields({ ...dependencies, subagent_refs: ["tool.node"], proof_refs: ["tool.node"] }, (r: string) => { seen.push(r); return "bound:" + r; });
  assertLabels(mapped); assert.deepEqual(seen, ["tool.node", "tool.node"]);
  for (const key of Object.keys(dependencies)) {
    const result = mapGraphReferenceFields({ [key]: [missing, "mdkg:malformed"] }, (r: string) => "checked:" + r);
    assert.deepEqual(result[key], ["checked:" + missing, "checked:mdkg:malformed"]);
  }
});

test("legacy MANIFEST SPEC and WORK migration preserves dependency labels despite matching aliases", () => {
  const root = fixture(); validate(root); const snapshot = migrate(root); validate(root);
  const target = snapshot.nodes.find((n: any) => n.node.id === "tool.node");
  for (const id of ["agent.fixture", "spec.fixture", "work.fixture"]) assertLabels(snapshot.nodes.find((n: any) => n.node.id === id).node.frontmatter);
  const agent = snapshot.nodes.find((n: any) => n.node.id === "agent.fixture");
  assert.deepEqual(agent.node.frontmatter.subagent_refs, [identityRef(target.node.identity)]);
  const work = snapshot.nodes.find((n: any) => n.node.id === "work.fixture");
  assert.equal(work.node.frontmatter.agent_id, identityRef(agent.node.identity));
});

test("ordinary v2 binding preserves labels and retains explicit identity checks", () => {
  const root = fixture(false), snapshot = migrate(root), index = indexAuthoredSnapshot(snapshot);
  const actor = snapshot.nodes.find((n: any) => n.node.id === "agent.fixture");
  const target = snapshot.nodes.find((n: any) => n.node.id === "tool.node"), stable = identityRef(target.node.identity);
  assertLabels(bindAuthoredIdentityReferences(index, "root", { ...actor.node.frontmatter, ...dependencies }));
  for (const field of Object.keys(dependencies)) {
    assert.deepEqual(bindAuthoredIdentityReferences(index, "root", { ...actor.node.frontmatter, [field]: [stable] })[field], [stable]);
    assert.throws(() => bindAuthoredIdentityReferences(index, "root", { ...actor.node.frontmatter, [field]: [missing] }), /not found|binding|missing/i);
    assert.throws(() => bindAuthoredIdentityReferences(index, "root", { ...actor.node.frontmatter, [field]: ["mdkg:malformed"] }), /malformed|binding|not found/i);
  }
  const duplicate = { ...index, nodes: { ...index.nodes, "root:duplicate": { ...index.nodes["root:tool.node"], qid: "root:duplicate", id: "duplicate" } } };
  assert.throws(() => bindAuthoredIdentityReferences(duplicate, "root", { ...actor.node.frontmatter, tool_refs: [stable] }), /ambiguous|binding/i);
  assert.throws(() => bindAuthoredIdentityReferences(index, "root", { ...actor.node.frontmatter, subagent_refs: ["absent.agent"] }), /not found|binding|missing/i);
});

test("reconciliation keeps portable dependency changes semantic rather than alias-bound", () => {
  const root = fixture(), ancestor = migrate(root), actor = ancestor.nodes.find((n: any) => n.node.id === "agent.fixture");
  const patch = (label: string) => {
    const file = path.join(root, actor.path);
    fs.writeFileSync(file, replaceGraphFrontmatter(actor.content, { ...actor.node.frontmatter, tool_refs: [label] }));
    return readAuthoredSnapshot(root);
  };
  const target = patch("tool.target"), incoming = patch("tool.incoming"), stable = identityRef(actor.node.identity);
  const conflict = reconcileIdentitySnapshots(ancestor, target, incoming);
  assert.ok(conflict.classifications.find((n: any) => n.stable_ref === stable).conflicts.includes("tool_refs"));
  const decided = reconcileIdentitySnapshots(ancestor, target, incoming, { [stable]: { take: "incoming", reason: "Reviewed changed dependency" } });
  assert.deepEqual(decided.blocking, []);
  const result = decided.documents.find((n: any) => n.stable_ref === stable);
  assert.deepEqual(parseFrontmatter(result.content, result.path).frontmatter.tool_refs, ["tool.incoming"]);
});

test("template identity import preserves labels and remaps explicit graph dependencies", () => {
  const root = fixture(), snapshot = migrate(root);
  const target = snapshot.nodes.find((n: any) => n.node.id === "tool.node"), stable = identityRef(target.node.identity);
  const entries = snapshot.nodes.map((n: any) => ({ sourcePath: n.path, id: n.node.id, parsed: { frontmatter: { ...n.node.frontmatter, ...(n.node.id === "agent.fixture" ? { model_refs: [stable] } : {}) } } }));
  const mapper = templateIdentityMapper(root, Buffer.from(JSON.stringify(snapshot.format)), identityHash("fixture-template"), entries, new Map(entries.map((n: any) => [n.id, n.id + ".copy"])));
  const transformedTarget = mapper.transform(entries.find((n: any) => n.id === "tool.node"));
  const transformed = mapper.transform(entries.find((n: any) => n.id === "agent.fixture"));
  assert.deepEqual(transformed.tool_refs, dependencies.tool_refs);
  assert.deepEqual(transformed.skill_refs, dependencies.skill_refs);
  assert.deepEqual(transformed.model_refs, [identityRef(transformedTarget)]);
  assert.deepEqual(transformed.subagent_refs, [identityRef(transformedTarget)]);
});

test("independent fork preserves labels but changes explicit dependency identities", () => {
  const root = fixture(), snapshot = migrate(root);
  const target = snapshot.nodes.find((n: any) => n.node.id === "tool.node"), actor = snapshot.nodes.find((n: any) => n.node.id === "agent.fixture");
  const entries = new Map<string, Buffer>([[".mdkg/config.json", fs.readFileSync(path.join(root, ".mdkg/config.json"))], [GRAPH_FORMAT_PATH, Buffer.from(JSON.stringify(snapshot.format))]]);
  for (const n of snapshot.nodes) entries.set(n.path, Buffer.from(n.node.id === "agent.fixture" ? replaceGraphFrontmatter(n.content, { ...n.node.frontmatter, model_refs: [identityRef(target.node.identity)] }) : n.content));
  const fork = planTransportIdentity(entries, "fork", identityHash("fixture-fork"));
  const fm = (file: string) => parseFrontmatter(fork.replacements.get(file).toString(), file).frontmatter;
  assert.deepEqual(fm(actor.path).tool_refs, dependencies.tool_refs);
  assert.deepEqual(fm(actor.path).skill_refs, dependencies.skill_refs);
  assert.deepEqual(fm(actor.path).model_refs, [identityRef(fm(target.path))]);
  assert.notEqual(identityRef(fm(target.path)), identityRef(target.node.identity));
});

test("v2 validation still rejects unresolved immutable dependencies and wrong subagent roles", () => {
  const root = fixture(false), snapshot = migrate(root), actor = snapshot.nodes.find((n: any) => n.node.id === "agent.fixture");
  for (const key of Object.keys(dependencies)) {
    fs.writeFileSync(path.join(root, actor.path), replaceGraphFrontmatter(actor.content, { ...actor.node.frontmatter, [key]: [missing] }));
    assert.equal(run(root, ["validate", "--json"]).status, 2, key);
  }
  fs.writeFileSync(path.join(root, actor.path), replaceGraphFrontmatter(actor.content, { ...actor.node.frontmatter, subagent_refs: [identityRef(actor.node.identity)] }));
  const r = run(root, ["validate", "--json"]); assert.equal(r.status, 2); assert.match(r.stdout, /not subagent/);
});

test("JSON and SQLite capability reads preserve dependency labels after migration", () => {
  const root = fixture(), snapshot = migrate(root);
  const actor = snapshot.nodes.find((n: any) => n.node.id === "agent.fixture"), target = snapshot.nodes.find((n: any) => n.node.id === "tool.node");
  const actorPath = path.join(root, actor.path);
  fs.writeFileSync(actorPath, replaceGraphFrontmatter(actor.content, { ...actor.node.frontmatter, model_refs: [identityRef(target.node.identity)] }));
  const authored = fs.readFileSync(actorPath);
  for (const backend of ["json", "sqlite"]) {
    const file = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(file, "utf8")); config.index.backend = backend; fs.writeFileSync(file, JSON.stringify(config));
    assert.equal(run(root, ["index"]).status, 0);
    const r = run(root, ["capability", "show", "agent.fixture", "--json"]); assert.equal(r.status, 0, r.stderr);
    const spec = JSON.parse(r.stdout).item.spec;
    for (const [key, expected] of Object.entries(dependencies)) assert.deepEqual(spec[key], key === "model_refs" ? ["root:tool.node"] : expected, key);
    assert.deepEqual(fs.readFileSync(actorPath), authored, "identity normalization is a cache projection only");
    validate(root);
  }
});
