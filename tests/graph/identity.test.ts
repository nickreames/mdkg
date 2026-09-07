import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
import { spawnSync } from "child_process";
const {
  createGraphFormat, parseGraphFormat, readGraphFormat, readNodeIdentity,
  identityRef, parseIdentityRef, newIdentityUuid, deriveIdentityUuid,
  assertNodeFormat, canonicalJson,
} = require("../../graph/identity");
const { readAuthoredSnapshot, graphControlSnapshot, resolveGraphRevision } = require("../../graph/identity_snapshot");

const GRAPH = "6bd4fc52-af92-43e0-92c8-604b55b11f82";
const NODE = "8ac8a0d3-6983-4f3e-8660-32f39cdd6cf8";
const cliPath = path.resolve(__dirname, "../../cli.js");

function fixture() {
  const root = makeTempDir("mdkg-identity-graph-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  const run = (args: string[]) => spawnSync(process.execPath, [cliPath, ...args], { cwd: root, encoding: "utf8" });
  const created = run(["new", "task", "Existing task", "--json"]);
  assert.equal(created.status, 0, created.stderr);
  const taskPath = path.join(root, JSON.parse(created.stdout).node.path);
  const legacy = fs.readFileSync(taskPath, "utf8");
  writeFile(path.join(root, ".mdkg/graph.json"), canonicalJson(createGraphFormat(GRAPH)));
  writeFile(taskPath, legacy.replace(/^id: .+$/m, (line) => `${line}\ngraph_id: ${GRAPH}\nnode_id: ${NODE}`));
  return { root, run, taskPath, legacy };
}

test("graph format v2 has independent compatibility and additive stable identity", () => {
  const manifest = createGraphFormat(GRAPH);
  assert.equal(manifest.format_version, 2);
  assert.equal(manifest.reader_min, 2);
  assert.equal(manifest.writer_min, 2);
  assert.deepEqual(parseGraphFormat(canonicalJson(manifest)), manifest);
  const identity = readNodeIdentity({ id: "task-123", graph_id: GRAPH, node_id: NODE }, "node");
  assert.equal(identityRef(identity), `mdkg://${GRAPH}/${NODE}`);
  assert.deepEqual(parseIdentityRef(identityRef(identity)), identity);
  assertNodeFormat(manifest, identity, "node");
  assert.equal(parseIdentityRef(`root:${NODE}`), undefined);
  assert.equal(parseIdentityRef(`mdkg://${GRAPH}/${NODE}/../task-123`), undefined);
  assert.equal(parseIdentityRef(`mdkg://${GRAPH.toUpperCase()}/${NODE}`), undefined);
});

test("identity allocation is offline and migration namespaces are deterministic and origin-specific", () => {
  assert.notEqual(newIdentityUuid(), newIdentityUuid());
  const base = deriveIdentityUuid(GRAPH, "accepted-ancestor", ["commit-a", "root:task-1"]);
  assert.equal(base, deriveIdentityUuid(GRAPH, "accepted-ancestor", ["commit-a", "root:task-1"]));
  assert.match(base, /^[0-9a-f-]{14}8[0-9a-f-]+$/);
  assert.notEqual(base, deriveIdentityUuid(GRAPH, "branch-addition", ["commit-a", "root:task-1"]));
  assert.notEqual(deriveIdentityUuid(GRAPH, "branch-addition", ["origin-a", "root:task-2"]),
    deriveIdentityUuid(GRAPH, "branch-addition", ["origin-b", "root:task-2"]));
  assert.throws(() => deriveIdentityUuid("task-1", "origin", ["a"]), /UUID/);
  assert.throws(() => deriveIdentityUuid(GRAPH, "origin", []), /origin inputs/);
});

test("legacy reads never initialize identity or mutate graph state", () => {
  const root = makeTempDir("mdkg-identity-v1-");
  assert.deepEqual(readGraphFormat(root), { format_version: 1 });
  assert.deepEqual(fs.readdirSync(root), []);
  assert.equal(readNodeIdentity({ id: "task-1" }, "node"), undefined);
  assert.throws(() => readNodeIdentity({ node_id: NODE }, "node"), /graph_id/);
  assert.throws(() => readNodeIdentity({ graph_id: GRAPH }, "node"), /node_id/);
  assert.throws(() => assertNodeFormat({ format_version: 1 }, { graph_id: GRAPH, node_id: NODE }, "node"), /no implicit migration/);
  assert.throws(() => assertNodeFormat(createGraphFormat(GRAPH), undefined, "node"), /missing/);
  assert.throws(() => assertNodeFormat(createGraphFormat(GRAPH), { graph_id: NODE, node_id: NODE }, "node"), /foreign graph identity/);
});

test("unsupported format versions, features, provenance paths and ownership fail closed", () => {
  const manifest = createGraphFormat(GRAPH);
  for (const patch of [
    { format_version: 3 }, { format: "foreign" }, { reader_min: 3 }, { writer_min: 1 },
    { required_features: ["node-identity"] }, { required_features: ["node-identity", "future-feature"] },
    { required_features: ["node-identity", "node-identity"] }, { unknown: true }, { graph_id: "task-1" },
    { migration_receipt: "../foreign.json" }, { lineage: { kind: "fork", source_graph_id: GRAPH, source_hash: `sha256:${"a".repeat(64)}` } },
  ]) assert.throws(() => parseGraphFormat(JSON.stringify({ ...manifest, ...patch })));
  assert.throws(() => parseGraphFormat("{bad"), /invalid graph format JSON/);
  const root = makeTempDir("mdkg-identity-format-");
  const filePath = path.join(root, ".mdkg/graph.json");
  writeFile(filePath, canonicalJson(manifest));
  const before = fs.readFileSync(filePath);
  assert.deepEqual(readGraphFormat(root), manifest);
  assert.deepEqual(fs.readFileSync(filePath), before);
  writeFile(filePath, " ".repeat(65 * 1024));
  assert.throws(() => readGraphFormat(root), /64 KiB/);
});

test("index and strict validation derive persisted identity and reject duplicates or partial migration", () => {
  const { root, run, taskPath, legacy } = fixture();
  const initial = run(["index"]);
  assert.equal(initial.status, 0, initial.stderr);
  const first = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/index/global.json"), "utf8"));
  assert.equal(first.meta.graph_format.graph_id, GRAPH);
  assert.deepEqual(first.nodes["root:task-1"].identity, { graph_id: GRAPH, node_id: NODE });
  assert.equal(run(["validate", "--json"]).status, 0);
  const original = fs.readFileSync(taskPath, "utf8");
  writeFile(path.join(root, ".mdkg/work/task-2.md"), original.replace("id: task-1", "id: task-2"));
  const duplicate = run(["index"]);
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stderr, /duplicate immutable identity/);
  assert.notEqual(run(["validate", "--json"]).status, 0);
  fs.unlinkSync(path.join(root, ".mdkg/work/task-2.md"));
  writeFile(taskPath, legacy);
  assert.match(run(["index"]).stderr, /missing graph_id\/node_id/);
  writeFile(taskPath, original.replace(GRAPH, NODE));
  assert.match(run(["index"]).stderr, /foreign graph identity/);
});

test("ordinary v2 node creation allocates persisted identities offline without changing numeric aliases", () => {
  const { root, run } = fixture();
  const first = run(["new", "task", "Offline addition", "--json"]);
  assert.equal(first.status, 0, first.stderr);
  const receipt = JSON.parse(first.stdout).node;
  assert.equal(receipt.id, "task-2");
  assert.equal(receipt.qid, "root:task-2");
  assert.equal(receipt.identity.graph_id, GRAPH);
  assert.notEqual(receipt.identity.node_id, NODE);
  const authored = fs.readFileSync(path.join(root, receipt.path), "utf8");
  assert.match(authored, new RegExp(`^node_id: ${receipt.identity.node_id}$`, "m"));
  assert.equal(receipt.stable_ref, identityRef(receipt.identity));
  const second = run(["new", "task", "Second offline addition", "--json"]);
  assert.equal(second.status, 0, second.stderr);
  assert.notEqual(JSON.parse(second.stdout).node.identity.node_id, receipt.identity.node_id);
  assert.equal(run(["index"]).status, 0);
  assert.equal(fs.readFileSync(path.join(root, receipt.path), "utf8"), authored, "index never replaces authored identity");
  assert.equal(run(["validate", "--json"]).status, 0);
});

test("stable selectors resolve authored cross-links while missing identities fail strict validation", () => {
  const { root, run } = fixture();
  const ref = `mdkg://${GRAPH}/${NODE}`;
  const created = run(["new", "task", "Cross linked node", "--blocked-by", ref, "--refs", ref, "--json"]);
  assert.equal(created.status, 0, created.stderr);
  const node = JSON.parse(created.stdout).node;
  const authored = fs.readFileSync(path.join(root, node.path), "utf8");
  assert.ok(authored.includes(`blocked_by: [${ref}]`));
  const shown = run(["show", ref, "--json"]);
  assert.equal(shown.status, 0, shown.stderr);
  assert.equal(JSON.parse(shown.stdout).item.qid, "root:task-1");
  const index = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/index/global.json"), "utf8"));
  assert.deepEqual(index.nodes["root:task-2"].edges.blocked_by, ["root:task-1"]);
  assert.deepEqual(index.nodes["root:task-2"].refs, ["root:task-1"]);
  assert.equal(run(["validate", "--json"]).status, 0);
  writeFile(path.join(root, node.path), authored.split(ref).join(`mdkg://${GRAPH}/${newIdentityUuid()}`));
  const missing = run(["validate", "--json"]);
  assert.notEqual(missing.status, 0);
  assert.match(missing.stdout + missing.stderr, /missing node|missing ref/);
});

test("unsupported manifests refuse mutations before locks, and stale caches cannot override v2 authored state", () => {
  const { root, run, taskPath } = fixture();
  assert.equal(run(["index"]).status, 0);
  const original = fs.readFileSync(taskPath, "utf8");
  writeFile(taskPath, `${original}\n<<<<<<< target\nA\n=======\nB\n>>>>>>> incoming\n`);
  const show = run(["show", "task-1", "--json"]);
  assert.notEqual(show.status, 0);
  assert.match(show.stderr, /unresolved Git conflict markers/);
  assert.notEqual(run(["validate", "--json"]).status, 0);
  writeFile(taskPath, original);
  const fix = run(["fix", "ids", "--apply", "--json"]);
  assert.notEqual(fix.status, 0);
  assert.equal(fs.readFileSync(taskPath, "utf8"), original);
  writeFile(path.join(root, ".mdkg/graph.json"), canonicalJson({ ...createGraphFormat(GRAPH), format_version: 3 }));
  const beforeIndex = fs.readFileSync(path.join(root, ".mdkg/index/global.json"));
  const mutation = run(["task", "start", "task-1", "--json"]);
  assert.notEqual(mutation.status, 0);
  assert.match(mutation.stderr, /unsupported graph format/);
  assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
  assert.deepEqual(fs.readFileSync(path.join(root, ".mdkg/index/global.json")), beforeIndex);
  assert.equal(fs.readFileSync(taskPath, "utf8"), original);
});

test("authored snapshots distinguish revision and working-tree nodes without mutating Git or caches", () => {
  const { root, run, taskPath } = fixture();
  const git = (args: string[]) => spawnSync("git", ["-c", "user.name=mdkg test", "-c", "user.email=mdkg-test@example.invalid", ...args], { cwd: root, encoding: "utf8" });
  for (const args of [["init", "-q"], ["add", "."], ["commit", "-qm", "identity base"]]) {
    const result = git(args);
    assert.equal(result.status, 0, result.stderr);
  }
  const revision = resolveGraphRevision(root, "HEAD");
  const base = readAuthoredSnapshot(root, revision);
  const newNode = run(["new", "task", "Untracked branch node", "--json"]);
  assert.equal(newNode.status, 0, newNode.stderr);
  writeFile(taskPath, fs.readFileSync(taskPath, "utf8").replace("title: Existing task", "title: Updated in working tree"));
  const beforeControl = graphControlSnapshot(root);
  const gitIndex = fs.readFileSync(path.join(root, ".git/index"));
  const cache = fs.readFileSync(path.join(root, ".mdkg/index/global.json"));
  const current = readAuthoredSnapshot(root);
  assert.equal(base.nodes.length, 1);
  assert.equal(current.nodes.length, 2);
  assert.notEqual(current.tree_hash, base.tree_hash);
  assert.equal(base.tree_hash, readAuthoredSnapshot(root, revision).tree_hash);
  assert.equal(current.tree_hash, readAuthoredSnapshot(root).tree_hash);
  assert.equal(current.nodes.find((entry: { qid: string }) => entry.qid === "root:task-1").node.title, "Updated in working tree");
  assert.deepEqual(graphControlSnapshot(root), beforeControl);
  assert.deepEqual(fs.readFileSync(path.join(root, ".git/index")), gitIndex);
  assert.deepEqual(fs.readFileSync(path.join(root, ".mdkg/index/global.json")), cache);
  assert.throws(() => resolveGraphRevision(root, "--bad"), /invalid graph revision/);
});
