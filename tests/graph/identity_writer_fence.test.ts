import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { loadConfig } = require("../../core/config");
const { planLegacyIdentityMigration, graphPlanHash } = require("../../graph/identity_migration");
const { applyGraphMigrationPlan, continueGraphTransaction, inspectGraphTransaction } = require("../../graph/identity_transaction");
const { graphControlSnapshot } = require("../../graph/identity_snapshot");
const { identityHash } = require("../../graph/identity");
const cli = path.resolve(__dirname, "../../cli.js");
const parameters = { graphId: "e7403372-f270-4cd7-902d-64b792c781df", origin: "ddf626b6-073f-4f99-9d30-5e30912922fd" };

function inventory(root: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name), s = fs.lstatSync(p), relative = path.relative(root, p);
      out[relative] = `${s.mode}:` + (s.isDirectory() ? "directory" : crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex"));
      if (s.isDirectory()) walk(p);
    }
  };
  walk(root); return out;
}

function fixture(t: { after(fn: () => void): void }, git = false) {
  const root = makeTempDir("mdkg-identity-fence-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  const configPath = path.join(root, ".mdkg/config.json");
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  raw.extension = { authored: "keep exact settings", nested: [1, 2] };
  writeFile(configPath, JSON.stringify(raw, null, 4) + "\n");
  const run = (args: string[]) => spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
  const created = run(["new", "task", "Original node", "--json"]);
  assert.equal(created.status, 0, created.stderr + created.stdout);
  const nodePath = JSON.parse(created.stdout).node.path;
  let ancestor: string | undefined;
  if (git) {
    const g = (args: string[]) => {
      const r = spawnSync("git", ["--no-optional-locks", "-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
        "-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], { cwd: root, encoding: "utf8" });
      assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
    };
    g(["init", "-q"]); g(["add", "--", ".mdkg/config.json", ".mdkg/templates", ".mdkg/core", nodePath]);
    g(["commit", "-qm", "synthetic legacy ancestor"]); ancestor = g(["rev-parse", "HEAD"]);
    writeFile(path.join(root, "unrelated.txt"), "stage retained\n"); g(["add", "--", "unrelated.txt"]);
  }
  return { root, configPath, raw, run, nodePath, options: { ...parameters, ...(ancestor ? { ancestor } : {}) } };
}

test("migration explicitly binds a first-write config fence without changing preview or authored settings", t => {
  const f = fixture(t, true), before = inventory(f.root), control = graphControlSnapshot(f.root);
  const plan = planLegacyIdentityMigration(f.root, f.options);
  assert.deepEqual(plan.blocking, []);
  assert.deepEqual(inventory(f.root), before);
  assert.equal(plan.writes[0].path, ".mdkg/config.json");
  assert.equal(plan.writes[0].before, fs.readFileSync(f.configPath, "utf8"));
  assert.deepEqual(JSON.parse(plan.writes[0].after), { ...f.raw, schema_version: 2 });
  const receipt = JSON.parse(plan.writes.find((x: any) => x.path === plan.receipt_path).after);
  assert.equal(receipt.writer_fence.after_hash, identityHash(plan.writes[0].after));
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  assert.equal(loadConfig(f.root).schema_version, 2);
  assert.equal(graphControlSnapshot(f.root).git_index, control.git_index);
  const adopted = fs.readFileSync(path.join(f.root, f.nodePath), "utf8");
  const created = f.run(["new", "task", "Uncommitted linked node", "--refs", "task-1", "--json"]);
  assert.equal(created.status, 0, created.stderr + created.stdout);
  const content = fs.readFileSync(path.join(f.root, JSON.parse(created.stdout).node.path), "utf8");
  assert.match(content, /refs: \[mdkg:\/\//);
  assert.match(content, new RegExp(`graph_id: ${parameters.graphId}`));
  assert.equal(fs.readFileSync(path.join(f.root, f.nodePath), "utf8"), adopted);
  assert.equal(graphControlSnapshot(f.root).git_index, control.git_index);
});

for (const mode of ["resume", "rollback"] as const) {
  for (const boundary of ["config", "node", "manifest", "receipt"] as const) {
    test(`${mode} preserves exact config custody after interrupted ${boundary} write`, t => {
      const f = fixture(t, true), plan = planLegacyIdentityMigration(f.root, f.options);
      const target = { config: ".mdkg/config.json", node: f.nodePath, manifest: ".mdkg/graph.json", receipt: plan.receipt_path }[boundary];
      const control = graphControlSnapshot(f.root);
      assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, {
        afterWrite: (p: string) => { if (p === target) throw Error("controlled fence interruption"); },
      }), /controlled fence interruption/);
      assert.equal(loadConfig(f.root).schema_version, 2);
      const inspectionBefore = inventory(f.root);
      assert.equal(inspectGraphTransaction(f.root, plan.plan_hash).state, "applying");
      assert.deepEqual(inventory(f.root), inspectionBefore);
      const result = continueGraphTransaction(f.root, plan.plan_hash, mode);
      assert.equal(result.state, mode === "resume" ? "applied" : "rolled-back");
      for (const op of plan.writes) {
        const p = path.join(f.root, op.path), wanted = mode === "resume" ? op.after : op.before;
        assert.equal(fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null, wanted, op.path);
      }
      assert.equal(graphControlSnapshot(f.root).git_index, control.git_index);
      const terminal = inventory(f.root);
      continueGraphTransaction(f.root, plan.plan_hash, mode);
      assert.deepEqual(inventory(f.root), terminal);
    });
  }
}

test("changed config bytes after interruption refuse both recovery modes without effects", t => {
  const f = fixture(t), plan = planLegacyIdentityMigration(f.root, f.options);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, { afterWrite: () => { throw Error("interrupt"); } }), /interrupt/);
  fs.appendFileSync(f.configPath, "\n");
  const before = inventory(f.root);
  for (const mode of ["resume", "rollback"]) {
    assert.throws(() => continueGraphTransaction(f.root, plan.plan_hash, mode), /custody collision/);
    assert.deepEqual(inventory(f.root), before);
  }
});

test("a reviewed identity hash cannot authorize unrelated configuration changes", t => {
  const f = fixture(t), plan = planLegacyIdentityMigration(f.root, f.options);
  const next = JSON.parse(plan.writes[0].after); next.workspaces.root.path = "other";
  plan.writes[0].after = JSON.stringify(next, null, 2) + "\n";
  const { plan_hash: _hash, ...body } = plan; plan.plan_hash = graphPlanHash(body);
  const before = inventory(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /exact first-operation/);
  assert.deepEqual(inventory(f.root), before);
});

test("unfenced historical migration plans can be inspected and rolled back but never gain apply approval", t => {
  const f = fixture(t), plan = planLegacyIdentityMigration(f.root, f.options);
  plan.writes = plan.writes.filter((op: any) => op.path !== ".mdkg/config.json");
  const { plan_hash: _hash, ...body } = plan; plan.plan_hash = graphPlanHash(body);
  const before = inventory(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /lacks reviewed writer compatibility fence/);
  assert.deepEqual(inventory(f.root), before);
  const journal = `.mdkg/state/identity-transactions/${plan.plan_hash.slice(7)}.json`;
  writeFile(path.join(f.root, journal), JSON.stringify({ schema_version: 1, state: "applying", plan }));
  const originalJournal = inventory(f.root);
  assert.equal(inspectGraphTransaction(f.root, plan.plan_hash).state, "applying");
  assert.throws(() => continueGraphTransaction(f.root, plan.plan_hash, "resume"), /lacks reviewed writer compatibility fence/);
  assert.deepEqual(inventory(f.root), originalJournal);
  assert.equal(continueGraphTransaction(f.root, plan.plan_hash, "rollback").state, "rolled-back");
  assert.equal(fs.readFileSync(f.configPath, "utf8"), JSON.stringify(f.raw, null, 4) + "\n");
});
