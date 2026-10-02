import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import childProcess from "node:child_process";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const harnessPath = require.resolve("../scripts/installed-scale-goal.js");

test("installed scale harness rejects invalid allowances before creating fixtures", t => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-scale-invalid-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: false }));
  const { runInstalledScaleGoal } = require(harnessPath);
  for (const commandTimeoutMs of [0, -1, 1.5, NaN, Infinity, "600000", null, 900001]) {
    assert.throws(() => runInstalledScaleGoal({ bin: process.execPath,
      tempBase: path.join(base, "absent"), commandTimeoutMs }), /commandTimeoutMs/);
    assert.deepEqual(fs.readdirSync(base), []);
  }
});

for (const allowance of [undefined, 1, 600000, 600001, 900000]) {
  test(`installed scale harness forwards and receipts allowance ${allowance ?? "default"}`, t => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-scale-allowance-"));
    t.after(() => fs.rmSync(base, { recursive: true, force: false }));
    let observed;
    t.mock.method(childProcess, "spawnSync", (_executable, _args, options) => {
      observed = options.timeout;
      return { status: 1, signal: null, stdout: "", stderr: "synthetic test stop" };
    });
    // The harness captures spawnSync when loaded; no CLI or Git process is run.
    delete require.cache[harnessPath];
    t.after(() => { delete require.cache[harnessPath]; });
    const { runInstalledScaleGoal } = require(harnessPath);
    const expected = allowance ?? 180000;
    assert.throws(() => runInstalledScaleGoal({ bin: process.execPath, tempBase: base,
      ...(allowance === undefined ? {} : { commandTimeoutMs: allowance }) }), error => {
      assert.match(error.message, /synthetic test stop/);
      assert.equal(observed, expected);
      assert.equal(error.command_receipts.length, 1);
      assert.equal(error.command_receipts[0].timeout_ms, expected);
      assert.equal(error.fixture_roots.length, 1);
      assert.equal(fs.readdirSync(error.fixture_roots[0]).length, 0);
      return true;
    });
  });
}

test("installed scale selection rejects invalid or duplicate backends before creating fixtures", t => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-scale-selection-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: false }));
  const { runInstalledScaleGoal } = require(harnessPath);
  for (const scaleBackends of [[], "sqlite", null, ["json", "json"], ["unknown"], ["json", "sqlite", "json"]]) {
    assert.throws(() => runInstalledScaleGoal({ bin: process.execPath,
      tempBase: path.join(base, "absent"), scaleBackends }), /scaleBackends/);
    assert.deepEqual(fs.readdirSync(base), []);
  }
});

function migrationFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-migration-proof-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: false }));
  fs.mkdirSync(path.join(root, ".mdkg/work/events"), { recursive: true });
  const identity = { graph_id: "12345678-1234-4123-8123-123456789abc", node_id: "87654321-4321-8432-9432-abcdef123456" };
  const manifest = { format: "mdkg-graph", format_version: 2, graph_id: identity.graph_id };
  const mapping = { qid: "root:task-1", identity, stable_ref: `mdkg://${identity.graph_id}/${identity.node_id}` };
  const content = `---\nid: task-1\ngraph_id: ${identity.graph_id}\nnode_id: ${identity.node_id}\n---\nSynthetic node.\n`;
  const plan = { plan_hash: "sha256:fixture", parameters: { graphId: identity.graph_id }, mappings: [mapping],
    writes: [{ path: ".mdkg/work/task-1.md", after_hash: "sha256:" + crypto.createHash("sha256").update(content).digest("hex") }] };
  fs.writeFileSync(path.join(root, ".mdkg/graph.json"), JSON.stringify(manifest));
  fs.writeFileSync(path.join(root, ".mdkg/work/task-1.md"), content);
  const eventBefore = Buffer.from('{"fixture":true}\n');
  fs.writeFileSync(path.join(root, ".mdkg/work/events/events.jsonl"), eventBefore);
  return { root, plan, eventBefore, applied: { ok: true, state: "applied", plan_hash: plan.plan_hash },
    items: [{ ...mapping, type: "task", identity: { ...identity } }] };
}

test("installed migration proof binds persisted graph, every identity, plan bytes and event history", t => {
  const fixture = migrationFixture(t);
  const proof = require(harnessPath).verifyInstalledMigration(fixture);
  assert.equal(proof.graph_format, 2);
  assert.equal(proof.persisted_identity_count, 1);
  assert.equal(proof.persisted_task_identity_count, 1);
  assert.equal(proof.exact_plan_writes, 1);
  assert.equal(proof.event_history_preserved, true);
  assert.match(proof.event_history_sha256, /^[a-f0-9]{64}$/);
});

const corruptions = [
  ["successful no-op", f => fs.unlinkSync(path.join(f.root, ".mdkg/graph.json")), /ENOENT/],
  ["missing identity", f => { delete f.items[0].identity; }, /identity mismatch/],
  ["wrong alias", f => { f.items[0].qid = "root:task-2"; }, /missing migrated node/],
  ["incomplete inventory", f => { f.items = []; }, /complete node inventory/],
  ["wrong plan bytes", f => fs.appendFileSync(path.join(f.root, ".mdkg/work/task-1.md"), "changed"), /persisted plan mismatch/],
  ["missing public after hash", f => { delete f.plan.writes[0].after_hash; }, /public plan must supply an after hash/],
  ["escaping plan path", f => { f.plan.writes[0].path = "../outside-synthetic"; }, /unsafe persisted plan path/],
  ["changed same-length event", f => fs.writeFileSync(path.join(f.root, ".mdkg/work/events/events.jsonl"), '{"fixture":null}\n'), /original event history/],
  ["deleted event history", f => fs.unlinkSync(path.join(f.root, ".mdkg/work/events/events.jsonl")), /original event history/],
  ["non-applied receipt", f => { f.applied.state = "applying"; }, /applying/],
];
for (const [label, corrupt, diagnostic] of corruptions) {
  test(`installed migration proof rejects ${label}`, t => {
    const fixture = migrationFixture(t);
    corrupt(fixture);
    assert.throws(() => require(harnessPath).verifyInstalledMigration(fixture), diagnostic);
  });
}
