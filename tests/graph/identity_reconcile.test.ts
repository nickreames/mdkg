import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import fs from "fs";
import { makeTempDir } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { loadConfig } = require("../../core/config");
const { parseNode } = require("../../graph/node");
const { loadTemplateSchemas } = require("../../graph/template_schema");
const { formatFrontmatter, parseFrontmatter } = require("../../graph/frontmatter");
const { loadTemplate, renderTemplate } = require("../../templates/loader");
const { replaceGraphFrontmatter } = require("../../graph/identity_migration");
const { createGraphFormat, identityHash, identityRef, canonicalJson } = require("../../graph/identity");
const { indexAuthoredSnapshot } = require("../../graph/identity_snapshot");
type FrontmatterValue = string | string[];
type AuthoredNode = { path: string; ws: string; qid: string; hash: string; content: string; node: any };
type AuthoredSnapshot = { revision: null; tree_hash: string; config: any; format: any; files: Record<string, string>; nodes: AuthoredNode[] };
type IdentityMergeResult = {
  documents: Array<{ path: string; ws: string; stable_ref: string; content: string }>;
  classifications: Array<{ stable_ref: string; outcome: string; conflicts: string[] }>;
  blocking: string[];
};
const { reconcileIdentitySnapshots } = require("../../graph/identity_reconcile") as {
  reconcileIdentitySnapshots: (...args: any[]) => IdentityMergeResult;
};

const graph = createGraphFormat("e7403372-f270-4cd7-902d-64b792c781df");
const id = (number: number) => `11111111-1111-4111-8111-${String(number).padStart(12, "0")}`;
const ref = (number: number) => identityRef({ graph_id: graph.graph_id, node_id: id(number) });
const root = makeTempDir("mdkg-reconcile-kernel-");
writeRootConfig(root);
writeDefaultTemplates(root);
const config = loadConfig(root);
const parseOptions = { workStatusEnum: config.work.status_enum, priorityMin: config.work.priority_min, priorityMax: config.work.priority_max,
  templateSchemas: loadTemplateSchemas(root, config, new Set(["task", "manifest"])) };

function node(alias: string, number: number, patch: Record<string, FrontmatterValue> = {}, body = "# Historical body\n"): AuthoredNode {
  const fm = { id: alias, graph_id: graph.graph_id, node_id: id(number), type: "task", title: "Stable title", status: "todo",
    priority: "1", tags: [], owners: [], links: [], artifacts: [], refs: [], relates: [], blocked_by: [], blocks: [],
    created: "2026-09-06", updated: "2026-09-06", ...patch };
  const content = ["---", ...formatFrontmatter(fm), "---", body].join("\n");
  const file = `.mdkg/work/${alias}-node.md`;
  return { path: file, ws: "root", qid: `root:${alias}`, hash: identityHash(content), content, node: parseNode(content, file, parseOptions) };
}

function snapshot(nodes: AuthoredNode[]): AuthoredSnapshot {
  const files = Object.fromEntries(nodes.map((item) => [item.path, item.hash]));
  return { revision: null, tree_hash: identityHash(canonicalJson(files)), config, format: graph, files, nodes };
}

function output(result: IdentityMergeResult): AuthoredSnapshot {
  return snapshot(result.documents.map((item) => {
    const parsed = parseNode(item.content, item.path, parseOptions);
    return { ...item, node: parsed, qid: `${item.ws}:${parsed.id}`, hash: identityHash(item.content) };
  }));
}

test("independent aliases reconcile deterministically with complete identity-bound cross-links", () => {
  const target = snapshot([node("task-1", 1)]);
  const incoming = snapshot([node("task-1", 2, { refs: ["task-2"] }, "# Receipt\r\ntask-1 is not task-10.\r\n"), node("task-2", 3, { refs: ["task-1"] })]);
  const before = fs.readFileSync(path.join(root, ".mdkg/config.json"));
  const result = reconcileIdentitySnapshots(snapshot([]), target, incoming);
  assert.deepEqual(result, reconcileIdentitySnapshots(snapshot([]), target, incoming));
  assert.deepEqual(result.blocking, []);
  const byRef = new Map(result.documents.map((item) => [item.stable_ref, item]));
  assert.equal(byRef.get(ref(1))!.content, target.nodes[0].content);
  assert.match(byRef.get(ref(2))!.content, /id: task-3\n/);
  assert.ok(byRef.get(ref(2))!.content.includes(`refs: [${ref(3)}]`));
  assert.ok(byRef.get(ref(3))!.content.includes(`refs: [${ref(2)}]`));
  assert.ok(byRef.get(ref(2))!.content.endsWith("# Receipt\r\ntask-1 is not task-10.\r\n"));
  indexAuthoredSnapshot(output(result));
  assert.deepEqual(fs.readFileSync(path.join(root, ".mdkg/config.json")), before);
});

test("whitespace frontmatter boundaries preserve divergent evidence body conflicts", () => {
  const withFence = (body: string) => {
    const item = node("task-1", 1, {}, body);
    item.content = item.content.replace("\n---\n", "\n--- \n");
    item.hash = identityHash(item.content);
    item.node = parseNode(item.content, item.path, parseOptions);
    return item;
  };
  const ancestor = snapshot([withFence("Base evidence\n---\nSame suffix\n")]);
  const target = snapshot([withFence("Target evidence\n---\nSame suffix\n")]);
  const incoming = snapshot([withFence("Incoming evidence\n---\nSame suffix\n")]);
  const result = reconcileIdentitySnapshots(ancestor, target, incoming);
  assert.ok(result.blocking.some(value => value.includes("$body")));
  const accepted = reconcileIdentitySnapshots(ancestor, target, incoming, { [ref(1)]: { take: "incoming", reason: "Explicitly reviewed body evidence" } });
  assert.deepEqual(accepted.blocking, []);
  assert.ok(accepted.documents[0].content.endsWith("Incoming evidence\n---\nSame suffix\n"));
});

test("same identity uses field ancestry, not duplicate splitting or whole-file last-writer wins", () => {
  const ancestor = snapshot([node("task-1", 1)]);
  const target = snapshot([node("task-1", 1, { title: "Target title" })]);
  const incoming = snapshot([node("task-1", 1, { tags: ["incoming"] })]);
  const result = reconcileIdentitySnapshots(ancestor, target, incoming);
  assert.deepEqual(result.blocking, []);
  assert.equal(result.documents.length, 1);
  assert.equal(result.classifications[0].outcome, "semantic-merge");
  assert.ok(result.documents[0].content.includes("title: Target title"));
  assert.ok(result.documents[0].content.includes("tags: [incoming]"));
  indexAuthoredSnapshot(output(result));
});

test("divergent lifecycle and evidence groups require reasoned explicit node decisions", () => {
  const ancestor = snapshot([node("task-1", 1)]);
  const cases: Array<[Record<string, FrontmatterValue>, Record<string, FrontmatterValue>, string]> = [
    [{ status: "progress" }, { status: "done" }, "$lifecycle"],
    [{ artifacts: ["artifact://target/proof"] }, { evidence_refs: [ref(2)] }, "$evidence"],
  ];
  for (const [left, right, conflict] of cases) {
    const target = snapshot([node("task-1", 1, left), node("task-2", 2)]);
    const incoming = snapshot([node("task-1", 1, right), node("task-2", 2)]);
    const result = reconcileIdentitySnapshots(ancestor, target, incoming);
    assert.ok(result.blocking.some((value) => value.includes(conflict)));
    const approved = reconcileIdentitySnapshots(ancestor, target, incoming, { [ref(1)]: { take: "incoming", reason: "Reviewed the conflicting outcome and accepted incoming evidence" } });
    assert.deepEqual(approved.blocking, []);
    assert.equal(approved.classifications.find((item) => item.stable_ref === ref(1))!.outcome, "explicit-incoming");
    indexAuthoredSnapshot(output(approved));
  }
});

test("concurrent body edits stay atomic and explicit decisions preserve exact chosen receipt bytes", () => {
  const ancestor = snapshot([node("task-1", 1)]);
  const target = snapshot([node("task-1", 1, {}, "# Target receipt\r\nexact task-1 bytes\r\n")]);
  const incoming = snapshot([node("task-1", 1, {}, "# Incoming receipt\r\nexact task-10 bytes\r\n")]);
  const result = reconcileIdentitySnapshots(ancestor, target, incoming);
  assert.deepEqual(result.classifications[0].conflicts, ["$body"]);
  const approved = reconcileIdentitySnapshots(ancestor, target, incoming, { [ref(1)]: { take: "target", reason: "Preserve accepted target evidence" } });
  assert.equal(approved.documents[0].content, target.nodes[0].content);
});

test("repeat integration and cherry-picked identities keep established target aliases and bytes", () => {
  const ancestor = snapshot([]);
  const incoming = snapshot([node("task-1", 2)]);
  const first = reconcileIdentitySnapshots(ancestor, snapshot([node("task-1", 1)]), incoming);
  const next = reconcileIdentitySnapshots(ancestor, output(first), incoming);
  assert.deepEqual(next.documents, first.documents);
  assert.equal(next.classifications.find((item) => item.stable_ref === ref(2))!.outcome, "already-integrated");
  assert.deepEqual(next.blocking, []);
});

test("delete/modify and receipt-proven reintroduction are explicit rather than silent resurrection", () => {
  const ancestor = snapshot([node("task-1", 1)]);
  const removed = reconcileIdentitySnapshots(ancestor, snapshot([]), ancestor);
  assert.equal(removed.documents.length, 0);
  assert.equal(removed.classifications[0].outcome, "target-delete");
  const changed = snapshot([node("task-1", 1, { title: "Incoming edits after deletion" })]);
  assert.ok(reconcileIdentitySnapshots(ancestor, snapshot([]), changed).blocking[0].includes("delete-modify"));
  const replay = reconcileIdentitySnapshots(snapshot([]), snapshot([]), ancestor, {}, new Set([ref(1)]));
  assert.ok(replay.blocking[0].includes("reintroduction"));
  const explicit = reconcileIdentitySnapshots(snapshot([]), snapshot([]), ancestor, { [ref(1)]: { take: "incoming", reason: "Explicitly reintroduce reverted work" } }, new Set([ref(1)]));
  assert.equal(explicit.documents.length, 1);
});

test("ambiguous inputs, stale decisions and foreign ownership fail without output authority", () => {
  const empty = snapshot([]), target = snapshot([node("task-1", 1)]);
  assert.throws(() => reconcileIdentitySnapshots(empty, target, snapshot([node("task-1", 2), node("task-1", 3)])), /ambiguous/);
  assert.throws(() => reconcileIdentitySnapshots(empty, target, snapshot([node("task-2", 2, { refs: ["task-999"] })])), /lacks an input-revision identity/);
  assert.throws(() => reconcileIdentitySnapshots(empty, target, target, { [ref(1)]: { take: "target", reason: "Obsolete decision" } }), /stale or unnecessary/);
  assert.throws(() => reconcileIdentitySnapshots(empty, target, { ...target, format: createGraphFormat() }), /one compatible graph identity/);
  const moved = { ...target.nodes[0], ws: "other", qid: "other:task-1" };
  assert.throws(() => reconcileIdentitySnapshots(target, target, snapshot([moved])), /type or workspace/);
});

test("empty bodies and target-owned paths are preserved through alias and incoming path changes", () => {
  const first = node("task-1", 1, {}, "");
  const target = snapshot([first]);
  const incoming = snapshot([{ ...first, path: ".mdkg/work/task-1-renamed.md" }]);
  const result = reconcileIdentitySnapshots(snapshot([first]), target, incoming);
  assert.equal(result.documents[0].path, first.path);
  assert.equal(result.documents[0].content, first.content);
  const candidate = node("task-1", 2, {}, "");
  const mapped = reconcileIdentitySnapshots(snapshot([]), target, snapshot([candidate]));
  assert.ok(mapped.documents.find((item) => item.stable_ref === ref(2))!.content.endsWith("---\n"));
});

test("portable manifest collisions use deterministic identity suffixes and preserve typed filenames", () => {
  const manifest = (number: number): AuthoredNode => {
    const file = ".mdkg/work/agent.worker-node/MANIFEST.md";
    const rendered = renderTemplate(loadTemplate(root, config, "manifest"), { id: "agent.worker", type: "manifest", title: "Worker",
      created: "2026-09-06", updated: "2026-09-06" });
    const header = { ...parseFrontmatter(rendered, file).frontmatter, graph_id: graph.graph_id, node_id: id(number) };
    const content = replaceGraphFrontmatter(rendered, header);
    return { path: file, ws: "root", qid: "root:agent.worker", hash: identityHash(content), content, node: parseNode(content, file, parseOptions) };
  };
  const target = snapshot([manifest(1)]), incoming = snapshot([manifest(2)]);
  const result = reconcileIdentitySnapshots(snapshot([]), target, incoming);
  assert.deepEqual(result.blocking, []);
  const remapped = result.documents.find((item) => item.stable_ref === ref(2))!;
  assert.equal(remapped.path, `.mdkg/work/agent.worker-${id(2).replace(/-/g, "")}-node/MANIFEST.md`);
  assert.ok(remapped.content.includes(`node_id: ${id(2)}`));
  indexAuthoredSnapshot(output(result));
});
