import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
const { runInitCommand } = require("../../commands/init");
const { createGraphFormat } = require("../../graph/identity");
const { planLegacyIdentityMigration } = require("../../graph/identity_migration");
const { applyGraphMigrationPlan } = require("../../graph/identity_transaction");
const { UpgradePlan } = require("../../commands/upgrade_transaction");

const GRAPH = "e7403372-f270-4cd7-902d-64b792c781df";
const ORIGIN = "ddf626b6-073f-4f99-9d30-5e30912922fd";
const cli = path.resolve(__dirname, "../../cli.js");
const modes = [{}, { graphOnly: true }, { agent: true }];
const fixtureRoots: string[] = [];
function temp(prefix: string): string {
  const root = makeTempDir(prefix);
  fixtureRoots.push(root);
  return root;
}
after(() => { for (const root of fixtureRoots) fs.rmSync(root, { recursive: true, force: true }); });

function bytes(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      const relative = path.relative(root, file);
      if (entry.isDirectory()) { result[relative + "/"] = "directory"; walk(file); }
      else if (entry.isSymbolicLink()) result[relative] = "link:" + fs.readlinkSync(file);
      else result[relative] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    }
  };
  walk(root);
  return result;
}

function fixture() {
  const root = temp("mdkg-init-identity-");
  runInitCommand({ root });
  // A synthetic closed graph: repository seed references to unshipped design
  // documents are outside this initialization/identity fixture's scope.
  for (const name of ["SOUL.md", "COLLABORATION.md"]) {
    const file = path.join(root, ".mdkg/core", name);
    writeFile(file, fs.readFileSync(file, "utf8").replace(/^refs:.*$/m, "refs: []"));
  }
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN });
  assert.deepEqual(plan.blocking, [], JSON.stringify(plan.blocking));
  applyGraphMigrationPlan(root, plan, plan.plan_hash);
  return root;
}

function validate(root: string) {
  const result = spawnSync(process.execPath, [cli, "validate", "--json"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr + result.stdout);
}

for (const mode of modes) {
  const label = JSON.stringify(mode);
  test(`init preserves complete adopted graph and customized instructions ${label}`, () => {
    const root = fixture();
    const agents = "# My instructions\r\nKeep these bytes.\r\n" + fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
    writeFile(path.join(root, "AGENTS.md"), agents);
    writeFile(path.join(root, "README.md"), "My project docs\n");
    const before = bytes(root);
    runInitCommand({ root, ...mode });
    const after = bytes(root);
    // Managed-section ownership records the current wrapper hash without
    // changing user content; a second init must then be byte-idempotent.
    before[".mdkg/init-manifest.json"] = after[".mdkg/init-manifest.json"];
    assert.deepEqual(after, before);
    runInitCommand({ root, ...mode });
    assert.deepEqual(bytes(root), after);
    validate(root);
  });

  test(`init refuses missing adopted core identity without partial writes ${label}`, () => {
    const root = fixture();
    fs.unlinkSync(path.join(root, ".mdkg/core/HUMAN.md"));
    const collaboration = path.join(root, ".mdkg/core/COLLABORATION.md");
    writeFile(collaboration, fs.readFileSync(collaboration, "utf8").replace(/^relates:.*$/m, "relates: []"));
    const coreList = path.join(root, ".mdkg/core/core.md");
    writeFile(coreList, fs.readFileSync(coreList, "utf8").replace(/^rule-human\r?\n/m, ""));
    validate(root);
    const before = bytes(root);
    assert.throws(() => runInitCommand({ root, ...mode }), /identity|reviewed|v2/);
    assert.deepEqual(bytes(root), before);
  });

  test(`force init cannot replace adopted identities with legacy seed ${label}`, () => {
    const root = fixture();
    const before = bytes(root);
    assert.throws(() => runInitCommand({ root, ...mode, force: true }), /identity|reviewed|v2/);
    assert.deepEqual(bytes(root), before);
  });
}

for (const [label, changes] of Object.entries({
  future: { format_version: 99 }, writer: { writer_min: 99 }, reader: { reader_min: 99 },
  feature: { required_features: ["node-identity", "stable-references", "future-feature"] },
})) {
  for (const force of [false, true]) {
    test(`init refuses ${label} manifest before creating bootstrap files (force=${force})`, () => {
      const root = temp("mdkg-init-future-");
      writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify({ ...createGraphFormat(GRAPH), ...changes }));
      const before = bytes(root);
      assert.throws(() => runInitCommand({ root, force }), /unsupported/);
      assert.deepEqual(bytes(root), before);
    });
  }
}

test("init refuses manifest loss instead of erasing adopted identities", () => {
  const root = fixture();
  fs.unlinkSync(path.join(root, ".mdkg/graph.json"));
  const before = bytes(root);
  assert.throws(() => runInitCommand({ root, force: true }), /identity|manifest|migration/);
  assert.deepEqual(bytes(root), before);
});

test("init resumes missing non-node bootstrap files on an adopted graph", () => {
  const root = fixture();
  const before = bytes(root);
  for (const file of ["AGENTS.md", ".mdkg/AGENT_START.md", ".mdkg/CLI_COMMAND_MATRIX.md"]) fs.unlinkSync(path.join(root, file));
  runInitCommand({ root });
  assert.deepEqual(bytes(root), before);
  validate(root);
});

test("init preserves unfinished upgrade custody and requires explicit recovery", () => {
  const root = fixture();
  const plan = new UpgradePlan(root);
  plan.write(".mdkg/AGENT_START.md", "Interrupted upgrade router\n");
  assert.throws(() => plan.apply(plan.hash({}), 1000, () => { throw new Error("fixture interruption"); }), /fixture interruption/);
  const before = bytes(root);
  assert.throws(() => runInitCommand({ root }), /unfinished upgrade/);
  assert.deepEqual(bytes(root), before);
});

test("init checks fallback core nodes before restoring missing adopted nodes", () => {
  const root = fixture(), seed = temp("mdkg-init-fallback-seed-");
  fs.cpSync(fs.realpathSync(path.resolve(__dirname, "../../init")), seed, { recursive: true });
  fs.unlinkSync(path.join(seed, "core/HUMAN.md"));
  fs.unlinkSync(path.join(root, ".mdkg/core/HUMAN.md"));
  const before = bytes(root);
  assert.throws(() => runInitCommand({ root, seedRoot: seed }), /identity|migration|v2/);
  assert.deepEqual(bytes(root), before);
});

test("init respects a competing writer and never changes its lock or graph", () => {
  const root = fixture(), configFile = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
  config.index.lock_timeout_ms = 10;
  writeFile(configFile, JSON.stringify(config));
  writeFile(path.join(root, ".mdkg/index/write.lock/owner.json"), "fixture-owned writer\n");
  const before = bytes(root);
  assert.throws(() => runInitCommand({ root }), /mutation lock/);
  assert.deepEqual(bytes(root), before);
});
