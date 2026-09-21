import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
// Test-only adapter: execute identical scenarios against an installed tarball,
// including that package's CLI and seeds, without modifying the package.
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { runInitCommand } = require(path.join(runtime, "commands/init"));
const { runUpgradeCommand } = require(path.join(runtime, "commands/upgrade"));
const { planLegacyIdentityMigration } = require(path.join(runtime, "graph/identity_migration"));
const { applyGraphMigrationPlan } = require(path.join(runtime, "graph/identity_transaction"));
const cli = path.join(runtime, "cli.js");
const roots: string[] = [];
function temp(name: string) { const root = makeTempDir(name); roots.push(root); return root; }
after(() => { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); });
function quiet<T>(fn: () => T): T { const saved = console.log; console.log = () => {}; try { return fn(); } finally { console.log = saved; } }
const hash = (b: string | Buffer) => crypto.createHash("sha256").update(b).digest("hex");
function snapshot(root: string) {
  const result: Record<string, string> = {};
  function visit(dir: string) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name), relative = path.relative(root, p);
    if (entry.isDirectory()) { result[relative + "/"] = "directory"; visit(p); }
    else result[relative] = entry.isSymbolicLink() ? fs.readlinkSync(p) : hash(fs.readFileSync(p));
  } }
  visit(root); return result;
}
function fixture() {
  const root = temp("mdkg-upgrade-identity-"), seed = temp("mdkg-upgrade-identity-seed-");
  fs.cpSync(path.join(runtime, "init"), seed, { recursive: true });
  quiet(() => runInitCommand({ root, seedRoot: seed }));
  // Explicit synthetic closure; untouched public seed closure remains bug-29.
  for (const file of ["SOUL.md", "COLLABORATION.md"]) {
    const p = path.join(root, ".mdkg/core", file);
    writeFile(p, fs.readFileSync(p, "utf8").replace(/^refs:.*$/m, "refs: []"));
  }
  const plan = planLegacyIdentityMigration(root, { graphId: "e7403372-f270-4cd7-902d-64b792c781df", origin: "ddf626b6-073f-4f99-9d30-5e30912922fd" });
  assert.deepEqual(plan.blocking, []);
  applyGraphMigrationPlan(root, plan, plan.plan_hash);
  return { root, seed };
}
function validate(root: string) {
  const r = spawnSync(process.execPath, [cli, "validate", "--json"], { cwd: root, encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
}
const preview = (root: string, seed: string, only: string[]) => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only }));
function managed(root: string, relative: string) {
  const p = path.join(root, ".mdkg/init-manifest.json"), m = JSON.parse(fs.readFileSync(p, "utf8"));
  m.files.find((f: any) => f.path === relative).sha256 = hash(fs.readFileSync(path.join(root, relative)));
  writeFile(p, JSON.stringify(m));
}

test("upgrade refuses missing v2 core restoration with no identity and no partial writes", () => {
  const { root, seed } = fixture(), only = [".mdkg/core/HUMAN.md"];
  fs.unlinkSync(path.join(root, only[0]));
  const c = path.join(root, ".mdkg/core/COLLABORATION.md"), list = path.join(root, ".mdkg/core/core.md");
  writeFile(c, fs.readFileSync(c, "utf8").replace(/^relates:.*$/m, "relates: []"));
  writeFile(list, fs.readFileSync(list, "utf8").replace(/^rule-human\r?\n/m, ""));
  validate(root);
  const before = snapshot(root), receipt = preview(root, seed, only);
  assert.equal(receipt.safe_to_apply, false);
  assert.match(JSON.stringify(receipt.blocking_conflicts), /identity|graph_id|node_id/);
  const applied = quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash }));
  assert.equal(applied.safe_to_apply, false);
  assert.deepEqual(snapshot(root), before);
});

test("managed seed provenance cannot authorize erasing or replacing a v2 identity", () => {
  for (const replaceIdentity of [false, true]) {
    const { root, seed } = fixture(), relative = ".mdkg/core/HUMAN.md";
    managed(root, relative);
    if (replaceIdentity) writeFile(path.join(seed, "core/HUMAN.md"), fs.readFileSync(path.join(root, relative), "utf8").replace(/^node_id:.*$/m, "node_id: dca5a134-0146-477d-88cc-bd07c29f3a25"));
    const before = snapshot(root), receipt = preview(root, seed, [relative]);
    assert.equal(receipt.safe_to_apply, false);
    assert.deepEqual(snapshot(root), before);
  }
});

test("same-identity managed content and safe non-node subsets remain upgradeable", () => {
  const { root, seed } = fixture(), relative = ".mdkg/core/HUMAN.md";
  managed(root, relative);
  writeFile(path.join(seed, "core/HUMAN.md"), fs.readFileSync(path.join(root, relative), "utf8") + "\nUpdated managed guidance.\n");
  fs.appendFileSync(path.join(seed, "AGENTS.md"), "\n");
  const only = [relative], receipt = preview(root, seed, only);
  assert.equal(receipt.safe_to_apply, true);
  quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash }));
  validate(root);
  const ids = fs.readFileSync(path.join(root, relative), "utf8").match(/^(graph_id|node_id):.*$/gm);
  fs.unlinkSync(path.join(root, ".mdkg/AGENT_START.md"));
  const safe = preview(root, seed, [".mdkg/AGENT_START.md"]);
  assert.equal(safe.safe_to_apply, true);
  quiet(() => runUpgradeCommand({ root, seedRoot: seed, only: [".mdkg/AGENT_START.md"], apply: true, planHash: safe.plan_hash }));
  assert.deepEqual(fs.readFileSync(path.join(root, relative), "utf8").match(/^(graph_id|node_id):.*$/gm), ids);
  validate(root);
});

test("upgrade preview refuses unknown graph formats without creating state", () => {
  const { root, seed } = fixture(), p = path.join(root, ".mdkg/graph.json");
  const m = JSON.parse(fs.readFileSync(p, "utf8")); m.writer_min = 99; writeFile(p, JSON.stringify(m));
  const before = snapshot(root);
  assert.throws(() => preview(root, seed, [".mdkg/core/HUMAN.md"]), /unsupported/);
  assert.deepEqual(snapshot(root), before);
});

for (const recovery of [undefined, "resume", "recover"] as const) {
  test(`reviewed config-only upgrade fences pre-fence v2 without changing identities (${recovery ?? "apply"})`, () => {
    const { root, seed } = fixture(), configPath = path.join(root, ".mdkg/config.json");
    // Synthetic pre-fence v2 state; do not rewrite its immutable identity receipt.
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    config.schema_version = 1; config.extension = { preserve: "authored setting" };
    writeFile(configPath, JSON.stringify(config, null, 4) + "\n");
    const originalConfig = fs.readFileSync(configPath, "utf8"), before = snapshot(root);
    const only = [".mdkg/config.json"], receipt = preview(root, seed, only);
    assert.equal(receipt.safe_to_apply, true, JSON.stringify(receipt.blocking_conflicts));
    assert.ok(receipt.will_write_paths.includes(".mdkg/config.json"));
    assert.deepEqual(snapshot(root), before);
    const apply = () => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash,
      ...(recovery ? { afterWrite: (p: string) => { if (p === ".mdkg/config.json") throw Error("config fence interruption"); } } : {}) }));
    if (recovery) {
      assert.throws(apply, /config fence interruption/);
      assert.equal(JSON.parse(fs.readFileSync(configPath, "utf8")).schema_version, 2);
      quiet(() => runUpgradeCommand({ root, seedRoot: seed, [recovery]: true, planHash: receipt.plan_hash }));
    } else apply();
    const afterConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    assert.equal(afterConfig.schema_version, recovery === "recover" ? 1 : 2);
    assert.deepEqual(afterConfig.extension, config.extension);
    if (recovery === "recover") assert.equal(fs.readFileSync(configPath, "utf8"), originalConfig);
    const after = snapshot(root);
    for (const [file, digest] of Object.entries(before)) {
      if (file === ".mdkg/graph.json" || file.startsWith(".mdkg/identity/") || /^\.mdkg\/(core|work|design)\//.test(file)) {
        assert.equal(after[file], digest, file);
      }
    }
    validate(root);
    if (recovery !== "recover") {
      const repeatedBefore = snapshot(root), repeated = quiet(() => runUpgradeCommand({ root, seedRoot: seed }));
      assert.ok(!repeated.will_write_paths.includes(".mdkg/config.json"));
      assert.deepEqual(snapshot(root), repeatedBefore);
    }
  });
}

for (const terminal of ["completed", "recovered"] as const) for (const changed of ["config", "dependency", "opposite-state"] as const) {
  test(`${terminal} fence-upgrade repeats refuse changed terminal ${changed} without effects`, () => {
    const { root, seed } = fixture(), configPath = path.join(root, ".mdkg/config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8")); config.schema_version = 1;
    writeFile(configPath, JSON.stringify(config));
    const only = [".mdkg/config.json"], receipt = preview(root, seed, only);
    quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash }));
    if (terminal === "recovered") quiet(() => runUpgradeCommand({ root, seedRoot: seed, recover: true, planHash: receipt.plan_hash }));
    const journal = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/state/upgrade-journal.json"), "utf8"));
    const stable = snapshot(root), repeatMode = terminal === "completed" ? "resume" : "recover";
    const repeated = quiet(() => runUpgradeCommand({ root, seedRoot: seed, [repeatMode]: true, planHash: receipt.plan_hash }));
    assert.equal(repeated.recovery_state, terminal);
    assert.deepEqual(snapshot(root), stable);
    if (changed === "dependency") fs.appendFileSync(path.join(root, ".mdkg/graph.json"), "\n");
    else if (changed === "config") fs.appendFileSync(configPath, "\n");
    else {
      const operation = journal.operations.find((op: any) => op.path === ".mdkg/config.json");
      fs.writeFileSync(configPath, Buffer.from(terminal === "completed" ? operation.before : operation.after, "base64"));
    }
    const moved = snapshot(root);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, [repeatMode]: true,
      planHash: receipt.plan_hash })), /custody|dependency|collision|stale/);
    assert.deepEqual(snapshot(root), moved);
  });
}

for (const changed of ["operation", "dependency"] as const) {
  test(`fence upgrade checks late ${changed} custody before recording completion`, () => {
    const { root, seed } = fixture(), configPath = path.join(root, ".mdkg/config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8")); config.schema_version = 1;
    writeFile(configPath, JSON.stringify(config));
    const only = [".mdkg/config.json"], receipt = preview(root, seed, only);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash,
      afterWrite: (_file: string, index: number) => {
        if (index === receipt.will_write_paths.length - 1) fs.appendFileSync(changed === "operation" ? configPath : path.join(root, ".mdkg/graph.json"), "\n");
      } })), /custody|dependency|collision|stale/);
    const journal = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/state/upgrade-journal.json"), "utf8"));
    assert.equal(journal.state, "applying");
    const moved = snapshot(root);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, resume: true,
      planHash: receipt.plan_hash })), /custody|dependency|collision|stale/);
    assert.deepEqual(snapshot(root), moved);
  });
}

test("equivalent manifest byte movement invalidates a reviewed safe subset before writes", () => {
  const { root, seed } = fixture(), only = [".mdkg/AGENT_START.md"];
  fs.unlinkSync(path.join(root, only[0]));
  const receipt = preview(root, seed, only);
  assert.equal(receipt.safe_to_apply, true);
  fs.appendFileSync(path.join(root, ".mdkg/graph.json"), "\n");
  const moved = snapshot(root);
  assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash })), /stale/);
  assert.deepEqual(snapshot(root), moved);
});

function interrupted(fault = 0) {
  const { root, seed } = fixture(), relative = ".mdkg/core/HUMAN.md";
  managed(root, relative);
  writeFile(path.join(seed, "core/HUMAN.md"), fs.readFileSync(path.join(root, relative), "utf8") + "\nUpdated guidance.\n");
  const receipt = preview(root, seed, [relative]);
  assert.equal(receipt.safe_to_apply, true);
  assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only: [relative], apply: true,
    planHash: receipt.plan_hash, afterWrite: (_: string, index: number) => { if (index === fault) throw new Error("interrupted"); } })), /interrupted/);
  return { root, seed, receipt, relative };
}

test("resume and recovery bind the preview's manifest and non-operation graph dependencies", () => {
  for (const mode of ["resume", "recover"]) for (const changed of [".mdkg/graph.json", ".mdkg/core/SOUL.md"]) {
    const { root, seed, receipt } = interrupted();
    fs.appendFileSync(path.join(root, changed), "\n");
    const moved = snapshot(root);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, [mode]: true,
      planHash: receipt.plan_hash })), /stale|dependenc|collision/);
    assert.deepEqual(snapshot(root), moved);
  }
});

test("interrupted upgrades refuse unreviewed additions while preserving Git staging", () => {
  const { root, seed, receipt } = interrupted();
  writeFile(path.join(root, ".git/index"), "staged bytes");
  writeFile(path.join(root, ".mdkg/work/new.md"), "unreviewed node");
  const before = snapshot(root);
  assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, resume: true,
    planHash: receipt.plan_hash })), /directory|dependenc|frontmatter|identity/);
  assert.deepEqual(snapshot(root), before);
});

test("recovery rejects valid new nodes in previously empty graph directories", () => {
  for (const mode of ["resume", "recover"]) {
    const { root, seed } = fixture(), only = [".mdkg/AGENT_START.md"];
    fs.mkdirSync(path.join(root, ".mdkg/work/empty"));
    fs.appendFileSync(path.join(seed, "AGENT_START.md"), "\nUpdated router.\n");
    const receipt = preview(root, seed, only);
    assert.equal(receipt.safe_to_apply, true);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true,
      planHash: receipt.plan_hash, afterWrite: () => { throw new Error("interrupted"); } })), /interrupted/);
    const body = fs.readFileSync(path.join(root, ".mdkg/core/HUMAN.md"), "utf8")
      .replace(/^id:.*$/m, "id: rule-999")
      .replace(/^node_id:.*$/m, "node_id: dca5a134-0146-477d-88cc-bd07c29f3a25");
    writeFile(path.join(root, ".mdkg/work/empty/independent.md"), body);
    validate(root);
    const before = snapshot(root);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, [mode]: true,
      planHash: receipt.plan_hash })), /directory dependency/);
    assert.deepEqual(snapshot(root), before);
  }
});

test("v2 upgrades resume or recover after each interruption with exact identities and unchanged staging", () => {
  for (const mode of ["resume", "recover"]) for (const fault of [0, 1]) {
    const { root, seed, receipt, relative } = interrupted(fault);
    writeFile(path.join(root, ".git/index"), "staged bytes");
    const journal = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/state/upgrade-journal.json"), "utf8"));
    const result = quiet(() => runUpgradeCommand({ root, seedRoot: seed, [mode]: true, planHash: receipt.plan_hash }));
    assert.equal(result.recovery_state, mode === "resume" ? "completed" : "recovered");
    const op = journal.operations.find((item: any) => item.path === relative);
    assert.equal(fs.readFileSync(path.join(root, relative), "base64"), mode === "resume" ? op.after : op.before);
    assert.equal(fs.readFileSync(path.join(root, ".git/index"), "utf8"), "staged bytes");
    validate(root);
  }
});

test("legacy v2 journals cannot resume unbound plans but valid original identities remain recoverable", () => {
  for (const corruptOriginal of [false, true]) {
    const { root, seed, receipt, relative } = interrupted();
    const p = path.join(root, ".mdkg/state/upgrade-journal.json"), journal = JSON.parse(fs.readFileSync(p, "utf8"));
    journal.schema_version = 1; delete journal.dependencies; delete journal.dependencies_hash;
    const op = journal.operations.find((item: any) => item.path === relative);
    const invalid = Buffer.from(op.before, "base64").toString("utf8").replace(/^(graph_id|node_id):.*\n/gm, "");
    op.after = Buffer.from(invalid).toString("base64");
    if (corruptOriginal) op.before = op.after;
    journal.operations_hash = hash(JSON.stringify(journal.operations));
    writeFile(path.join(root, relative), invalid); writeFile(p, JSON.stringify(journal));
    const before = snapshot(root);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, resume: true,
      planHash: receipt.plan_hash })), /unbound|dependenc|identity|graph_id/);
    assert.deepEqual(snapshot(root), before);
    if (corruptOriginal) {
      assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, recover: true,
        planHash: receipt.plan_hash })), /identity|graph_id/);
      assert.deepEqual(snapshot(root), before);
    } else {
      quiet(() => runUpgradeCommand({ root, seedRoot: seed, recover: true, planHash: receipt.plan_hash }));
      assert.equal(fs.readFileSync(path.join(root, relative), "base64"), op.before);
      validate(root);
    }
  }
});

test("recovery rejects path aliases and canonical manifest or ownership changes", () => {
  for (const target of [".mdkg/graph.json", ".mdkg/config.json"]) for (const alias of [true, false]) {
    const { root, seed, receipt } = interrupted();
    const p = path.join(root, ".mdkg/state/upgrade-journal.json"), journal = JSON.parse(fs.readFileSync(p, "utf8"));
    const current = fs.readFileSync(path.join(root, target)), replacement = JSON.parse(current.toString("utf8"));
    if (target.endsWith("graph.json")) replacement.writer_min = 99;
    else replacement.workspaces.shadow = {path: ".mdkg", mdkg_dir: "core", enabled: false, visibility: "private"};
    journal.operations = [{path: alias ? target.replace(/\//g, "\\") : target, before: Buffer.from(JSON.stringify(replacement)).toString("base64"), after: current.toString("base64")}];
    journal.operations_hash = hash(JSON.stringify(journal.operations));
    journal.dependencies = {files:[], directories:[]}; journal.dependencies_hash = hash(JSON.stringify(journal.dependencies));
    writeFile(p, JSON.stringify(journal));
    const before = snapshot(root);
    assert.throws(() => quiet(() => runUpgradeCommand({ root, seedRoot: seed, recover: true,
      planHash: receipt.plan_hash })), /canonical|path|journal operation|manifest|ownership/);
    assert.deepEqual(snapshot(root), before);
  }
});

test("journal validation rejects self-target and duplicate separator aliases", () => {
  const { root } = interrupted();
  const { readUpgradeJournal } = require(path.join(runtime, "commands/upgrade_transaction"));
  const p = path.join(root, ".mdkg/state/upgrade-journal.json"), original = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const relative of [".mdkg\\state\\upgrade-journal.json", ".mdkg\\core\\HUMAN.md"]) {
    const journal = structuredClone(original);
    journal.operations.push({path:relative, before:null, after:Buffer.from("bad").toString("base64")});
    journal.operations_hash = hash(JSON.stringify(journal.operations));
    writeFile(p, JSON.stringify(journal));
    const before = snapshot(root);
    assert.throws(() => readUpgradeJournal(root), /canonical|path|journal operation/);
    assert.deepEqual(snapshot(root), before);
  }
});

test("safe non-node upgrade does not count directories as Markdown files", () => {
  const { root, seed } = fixture(), p = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(p,"utf8"));
  // Leave room for shipped templates as well as nodes; directories are not files.
  config.index.limits.max_files = 64; writeFile(p, JSON.stringify(config));
  for (let i = 0; i < 65; i++) fs.mkdirSync(path.join(root, ".mdkg/work", `empty-${i}`));
  validate(root);
  fs.unlinkSync(path.join(root, ".mdkg/AGENT_START.md"));
  const only = [".mdkg/AGENT_START.md"], receipt = preview(root, seed, only);
  assert.equal(receipt.safe_to_apply, true);
  quiet(() => runUpgradeCommand({ root, seedRoot: seed, only, apply: true, planHash: receipt.plan_hash }));
  validate(root);
});

test("transaction plans reject separator and filesystem case aliases before writes", () => {
  const { root } = fixture();
  const { UpgradePlan } = require(path.join(runtime, "commands/upgrade_transaction"));
  const before = snapshot(root), plan = new UpgradePlan(root);
  for (const file of [".mdkg\\graph.json", ".mdkg\\state\\upgrade-journal.json", ".GIT/config"]) {
    assert.throws(() => plan.write(file, "bad"), /canonical|Git/);
  }
  const alias = ".mdkg/GRAPH.json";
  if (fs.existsSync(path.join(root, alias))) assert.throws(() => plan.write(alias, "bad"), /spelling/);
  assert.deepEqual(snapshot(root), before);
});
