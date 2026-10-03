import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { createGraphFormat, readGraphFormat, isIdentityUuid } = require("../dist/graph/identity.js");
const { createOwnedFixture } = require("../scripts/qualification-fixture.js");

// DESIGN ORACLE ONLY. There is no working runtime command in this branch.
// Exercise the real independent canonical reader, then the proposed binding
// predicate; these controls are not Test495 store/installed acceptance.
function proposedBinding(root, store) {
  const host = readGraphFormat(root);
  if (host.format_version !== 2) throw new Error("managed working storage requires separately adopted canonical v2 identity");
  if (store?.graph?.format_version !== 2 || !isIdentityUuid(store?.store_id) ||
      store.graph.graph_id !== host.graph_id) throw new Error("foreign or unbound store; preserve source and host");
  return host.graph_id;
}
const store = (graphId, storeId = crypto.randomUUID()) => ({ schema_version: 1,
  store_id: storeId, graph: { format_version: 2, graph_id: graphId } });
function host(fixture, name, graphId) {
  const root = fixture.resolve(name); fs.mkdirSync(path.join(root, ".mdkg"), { recursive: true });
  if (graphId) fs.writeFileSync(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat(graphId)));
  fs.writeFileSync(path.join(root, ".mdkg/custom-scratch.txt"), "synthetic retained source\n");
  return root;
}
function inventory(root) {
  const result = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else result[path.relative(root, p)] = { bytes: fs.readFileSync(p).toString("base64"), mode: fs.statSync(p).mode & 0o777 };
    }
  }
  walk(root); return result;
}
function fixtureTest(name, run) {
  test(name, () => { const fixture = createOwnedFixture({ prefix: "mdkg-host-binding-" });
    try { run(fixture); } finally { fixture.cleanup(); } });
}

fixtureTest("design oracle: matching canonical v2 host is required; store UUID stays subordinate", (f) => {
  const graphId = crypto.randomUUID(); const root = host(f, "a", graphId); const before = inventory(root);
  assert.equal(proposedBinding(root, store(graphId)), graphId);
  assert.equal(proposedBinding(root, store(graphId)), graphId); // another store UUID is still the same host
  assert.throws(() => proposedBinding(root, store(crypto.randomUUID(), graphId)), /foreign or unbound/);
  assert.deepEqual(inventory(root), before);
});
fixtureTest("design oracle: foreign copied store cannot alter existing destination host or source", (f) => {
  const idA = crypto.randomUUID(), idB = crypto.randomUUID(); const a = host(f, "a", idA), b = host(f, "b", idB);
  fs.mkdirSync(path.join(a, ".mdkg/working"));
  fs.writeFileSync(path.join(a, ".mdkg/working/manifest.json"), JSON.stringify(store(idA)));
  fs.writeFileSync(path.join(a, ".mdkg/working/payload.txt"), "synthetic copied private data\n");
  fs.cpSync(path.join(a, ".mdkg/working"), path.join(b, ".mdkg/working"), { recursive: true });
  const before = [inventory(a), inventory(b)];
  const incoming = JSON.parse(fs.readFileSync(path.join(b, ".mdkg/working/manifest.json"), "utf8"));
  assert.throws(() => proposedBinding(b, incoming), /foreign or unbound/);
  assert.deepEqual([inventory(a), inventory(b)], before);
});
fixtureTest("design oracle: legacy host refuses without implicit migration or incoming identity bootstrap", (f) => {
  const root = host(f, "legacy"); const before = inventory(root); const id = crypto.randomUUID();
  for (const incoming of [store(id), { store_id: id, graph: { format_version: 1, namespace: `legacy-working:${id}` } }])
    assert.throws(() => proposedBinding(root, incoming), /separately adopted canonical v2/);
  assert.deepEqual(inventory(root), before); assert.equal(fs.existsSync(path.join(root, ".mdkg/graph.json")), false);
  assert.deepEqual(readGraphFormat(root), { format_version: 1 }); // existing reader compatibility remains
});
fixtureTest("design oracle: same-ID clone is same graph; independent new-ID fork rejects copied binding", (f) => {
  const id = crypto.randomUUID(); const a = host(f, "a", id), clone = host(f, "clone", id), fork = host(f, "fork", crypto.randomUUID());
  const before = [inventory(a), inventory(clone), inventory(fork)];
  assert.equal(proposedBinding(a, store(id)), proposedBinding(clone, store(id)));
  assert.throws(() => proposedBinding(fork, store(id)), /foreign or unbound/);
  assert.deepEqual([inventory(a), inventory(clone), inventory(fork)], before);
});
fixtureTest("design oracle: fresh changed or removed host invalidates previous binding without repairing metadata", (f) => {
  const id = crypto.randomUUID(); const root = host(f, "a", id), incoming = store(id);
  assert.equal(proposedBinding(root, incoming), id);
  const manifest = path.join(root, ".mdkg/graph.json"); fs.writeFileSync(manifest, JSON.stringify(createGraphFormat(crypto.randomUUID())));
  let before = inventory(root); assert.throws(() => proposedBinding(root, incoming), /foreign or unbound/);
  assert.deepEqual(inventory(root), before); fs.unlinkSync(manifest); before = inventory(root);
  assert.throws(() => proposedBinding(root, incoming), /separately adopted canonical v2/); assert.deepEqual(inventory(root), before);
});
fixtureTest("design oracle: malformed/unknown canonical host refuses through actual strict reader", (f) => {
  const id = crypto.randomUUID(), root = host(f, "a", id), manifest = path.join(root, ".mdkg/graph.json");
  for (const bad of ["{broken", JSON.stringify({ ...createGraphFormat(id), format_version: 99 }),
    JSON.stringify({ ...createGraphFormat(id), from_working_store: true })]) {
    fs.writeFileSync(manifest, bad); const before = inventory(root);
    assert.throws(() => proposedBinding(root, store(id)), /invalid graph format JSON|unsupported/);
    assert.deepEqual(inventory(root), before);
  }
});
test("revised design states legacy refusal, independent canonical binding and data-only adoption limits", () => {
  const doc = fs.readFileSync(new URL("../docs/cloud-goal89-design.md", import.meta.url), "utf8");
  for (const phrase of ["canonical-v2-host-binding-v1", "independently verified canonical format-v2",
    "store_id", "subordinate store identity", "refuse nonmutatingly", "mdkg graph migrate",
    "data-only selected copy", "Same-ID v2 clone", "not authentication", "explicit recovery/purge"])
    assert.ok(doc.includes(phrase), `revised contract must retain ${phrase}`);
});
