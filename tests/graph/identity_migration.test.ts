import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { planLegacyIdentityMigration, publicMigrationPlan, replaceGraphFrontmatter } = require("../../graph/identity_migration");
const { applyGraphMigrationPlan, continueGraphTransaction } = require("../../graph/identity_transaction");
const { readAuthoredSnapshot, graphControlSnapshot } = require("../../graph/identity_snapshot");

const GRAPH = "e7403372-f270-4cd7-902d-64b792c781df";
const ORIGIN_A = "ddf626b6-073f-4f99-9d30-5e30912922fd";
const ORIGIN_B = "abdd32d5-e359-4908-a0fe-8d921f2f0186";
const cli = path.resolve(__dirname, "../../cli.js");

function fixture() {
  const root = makeTempDir("mdkg-migration-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  const run = (args: string[]) => spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
  const result = run(["new", "task", "Common ancestor", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  return { root, run, taskPath: JSON.parse(result.stdout).node.path };
}

function bytes(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile()) result[path.relative(root, target)] = fs.readFileSync(target).toString("base64");
    }
  };
  walk(root);
  return result;
}

function git(root: string, args: string[]): string {
  const result = spawnSync("git", ["-c", "user.name=mdkg test", "-c", "user.email=mdkg-test@example.invalid", ...args], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

test("migration preview is deterministic, read-only, strictly validated and keeps raw bodies", () => {
  const { root, run, taskPath } = fixture();
  const created = run(["new", "task", "Linked node", "--parent", "task-1", "--refs", "task-1", "--json"]);
  assert.equal(created.status, 0, created.stderr);
  const rawPath = path.join(root, taskPath);
  const original = `${fs.readFileSync(rawPath, "utf8")}\nHistorical receipt: task-1 is not task-10.\n`;
  writeFile(rawPath, original.split("\n").join("\r\n"));
  const before = bytes(root);
  const options = { graphId: GRAPH, origin: ORIGIN_A };
  const plan = planLegacyIdentityMigration(root, options);
  assert.deepEqual(plan.blocking, []);
  assert.equal(plan.plan_hash, planLegacyIdentityMigration(root, options).plan_hash);
  assert.deepEqual(bytes(root), before);
  assert.equal(plan.mappings.length, 2);
  const first = plan.mappings.find((entry: { qid: string }) => entry.qid === "root:task-1");
  const second = plan.writes.find((entry: { path: string }) => entry.path === JSON.parse(created.stdout).node.path);
  assert.ok(second.after.includes(`parent: ${first.stable_ref}`));
  const firstAfter = plan.writes.find((entry: { path: string }) => entry.path === taskPath).after;
  assert.ok(firstAfter.includes("\r\nHistorical receipt: task-1 is not task-10.\r\n"));
  assert.ok(plan.generated_exclusions.includes(".git/"));
  const publicPlan = publicMigrationPlan(plan);
  assert.equal(publicPlan.safe_to_apply, true);
  assert.equal(publicPlan.side_effects, "none-preview");
  assert.equal(publicPlan.writes[0].after, undefined, "public preview omits raw graph bodies");
});

test("identity receipt provenance and live SQLite write files participate in stale-plan guards", () => {
  const { root } = fixture();
  const evidence = path.join(root, `.mdkg/identity/templates/${"a".repeat(64)}.json`);
  writeFile(evidence, JSON.stringify({ kind: "earlier-provenance", note: "preserve exact evidence" }));
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  assert.ok(plan.input_files[path.relative(root, evidence)]);
  const snapshot = readAuthoredSnapshot(root);
  assert.equal(snapshot.identity_evidence[path.relative(root, evidence)].content, fs.readFileSync(evidence, "utf8"));
  writeFile(evidence, JSON.stringify({ kind: "earlier-provenance", note: "changed by its owner" }));
  const changed = bytes(root);
  assert.throws(() => applyGraphMigrationPlan(root, plan, plan.plan_hash), /stale graph plan/);
  assert.deepEqual(bytes(root), changed);
  const fresh = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  writeFile(path.join(root, ".mdkg/db/runtime/project.sqlite-wal"), "fixture WAL bytes");
  assert.notEqual(graphControlSnapshot(root).runtime_wal, fresh.control.runtime_wal);
  const withWal = bytes(root);
  assert.throws(() => applyGraphMigrationPlan(root, fresh, fresh.plan_hash), /control baseline moved/);
  assert.deepEqual(bytes(root), withWal);
});

test("recovery refuses new identity evidence without overwriting its custody", () => {
  const { root } = fixture();
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  assert.throws(() => applyGraphMigrationPlan(root, plan, plan.plan_hash, { afterWrite: () => { throw new Error("fixture interruption"); } }), /fixture interruption/);
  const evidence = path.join(root, `.mdkg/identity/templates/${"b".repeat(64)}.json`);
  writeFile(evidence, JSON.stringify({ kind: "new-independent-provenance" }));
  const before = bytes(root);
  assert.throws(() => continueGraphTransaction(root, plan.plan_hash, "resume"), /new unowned input/);
  assert.deepEqual(bytes(root), before);
  fs.unlinkSync(evidence); // Exact fixture-owned addition, not a recovery action.
  assert.equal(continueGraphTransaction(root, plan.plan_hash, "resume").state, "applied");
});

test("legacy WORK.md path contracts migrate to exact identities and retain owner validation", () => {
  const { root, run } = fixture();
  const create = (args: string[]) => {
    const output = run(args);
    assert.equal(output.status, 0, output.stderr);
    return JSON.parse(output.stdout).node;
  };
  const manifest = create(["new", "manifest", "Owner", "--id", "agent.owner", "--json"]);
  const work = create(["work", "contract", "new", "Contract", "--id", "work.contract", "--agent-id", manifest.id,
    "--kind", "example", "--inputs", "prompt:text:required", "--outputs", "result:text:required", "--json"]);
  const manifestPath = path.join(root, manifest.path);
  writeFile(manifestPath, fs.readFileSync(manifestPath, "utf8").replace("work_contracts: []", `work_contracts: [${work.path}]`));
  const before = bytes(root);
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  assert.deepEqual(plan.blocking, []);
  assert.deepEqual(bytes(root), before);
  const contractIdentity = plan.mappings.find((entry: any) => entry.qid === work.qid).stable_ref;
  const manifestIdentity = plan.mappings.find((entry: any) => entry.qid === manifest.qid).stable_ref;
  applyGraphMigrationPlan(root, plan, plan.plan_hash);
  assert.ok(fs.readFileSync(manifestPath, "utf8").includes(`work_contracts: [${contractIdentity}]`));
  assert.ok(fs.readFileSync(path.join(root, work.path), "utf8").includes(`agent_id: ${manifestIdentity}`));
  const valid = run(["validate", "--json"]);
  assert.equal(valid.status, 0, valid.stdout + valid.stderr);
  const foreign = create(["new", "manifest", "Different owner", "--id", "agent.foreign", "--json"]);
  writeFile(path.join(root, work.path), fs.readFileSync(path.join(root, work.path), "utf8").replace(`agent_id: ${manifestIdentity}`, `agent_id: ${foreign.stable_ref}`));
  const invalid = run(["validate", "--json"]);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stdout, /owned by agent_id/);
});

test("divergent legacy branches share ancestor identities but not independently created aliases", () => {
  const { root, run } = fixture();
  git(root, ["init", "-q"]);
  git(root, ["add", ".mdkg/config.json", ".mdkg/work", ".mdkg/templates"]);
  git(root, ["commit", "-qm", "accepted ancestor"]);
  const ancestor = git(root, ["rev-parse", "HEAD"]);
  const plans: any[] = [];
  for (const [branch, origin] of [["branch-a", ORIGIN_A], ["branch-b", ORIGIN_B]]) {
    git(root, ["checkout", "-qb", branch, ancestor]);
    const created = run(["new", "task", "Offline addition", "--refs", "task-1", "--json", "--no-cache"]);
    assert.equal(created.status, 0, created.stderr);
    git(root, ["add", ".mdkg/work"]);
    git(root, ["commit", "-qm", branch]);
    const before = bytes(root);
    plans.push(planLegacyIdentityMigration(root, { graphId: GRAPH, origin, ancestor }));
    assert.deepEqual(bytes(root), before);
  }
  for (const plan of plans) assert.deepEqual(plan.blocking, []);
  const mapping = (plan: any, qid: string) => plan.mappings.find((entry: { qid: string }) => entry.qid === qid);
  assert.equal(mapping(plans[0], "root:task-1").stable_ref, mapping(plans[1], "root:task-1").stable_ref);
  assert.equal(mapping(plans[0], "root:task-2").path, mapping(plans[1], "root:task-2").path);
  assert.notEqual(mapping(plans[0], "root:task-2").stable_ref, mapping(plans[1], "root:task-2").stable_ref);
  assert.throws(() => planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_B }), /explicit accepted --ancestor/);
  assert.throws(() => planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_B, ancestor: "branch-a" }), /not an ancestor/);
});

test("unproven renamed legacy nodes and unresolved references block migration", () => {
  const { root, taskPath } = fixture();
  git(root, ["init", "-q"]);
  git(root, ["add", ".mdkg/config.json", ".mdkg/work", ".mdkg/templates"]);
  git(root, ["commit", "-qm", "ancestor"]);
  const ancestor = git(root, ["rev-parse", "HEAD"]);
  const movedPath = ".mdkg/work/task-1-moved.md";
  git(root, ["mv", taskPath, movedPath]);
  git(root, ["commit", "-qm", "rename"]);
  const before = bytes(root);
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A, ancestor });
  assert.ok(plan.blocking.some((item: string) => item.includes("rename/recreation")));
  assert.deepEqual(bytes(root), before);
  writeFile(path.join(root, movedPath), fs.readFileSync(path.join(root, movedPath), "utf8").replace("refs: []", "refs: [task-404]"));
  const missing = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A, ancestor });
  assert.ok(missing.blocking.some((item: string) => item.includes("task-404")));
});

test("frontmatter replacement changes headers only and rejects absent boundaries", () => {
  assert.equal(replaceGraphFrontmatter("---\nid: task-1\n---\nBODY\n", { id: "task-2" }), "---\nid: task-2\n---\nBODY\n");
  assert.equal(replaceGraphFrontmatter("---\r\nid: task-1\r\n---\r\nBODY\r\n", { id: "task-2" }), "---\r\nid: task-2\r\n---\r\nBODY\r\n");
  assert.throws(() => replaceGraphFrontmatter("BODY", { id: "task-1" }), /header/);
});

test("reviewed migration applies with durable mappings and leaves Git and execution state unchanged", () => {
  const { root, taskPath, run } = fixture();
  git(root, ["init", "-q"]);
  git(root, ["add", ".mdkg/config.json", ".mdkg/work", ".mdkg/templates"]);
  git(root, ["commit", "-qm", "ancestor"]);
  writeFile(path.join(root, ".mdkg/state/selected-goal.json"), "preserved selection");
  writeFile(path.join(root, ".mdkg/db/runtime/project.sqlite"), "preserved runtime bytes");
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A, ancestor: "HEAD" });
  const before = bytes(root);
  assert.throws(() => applyGraphMigrationPlan(root, plan, "sha256:" + "0".repeat(64)), /reviewed plan hash/);
  assert.deepEqual(bytes(root), before);
  const receipt = applyGraphMigrationPlan(root, plan, plan.plan_hash);
  assert.equal(receipt.state, "applied");
  for (const file of [".git/index", ".mdkg/state/selected-goal.json", ".mdkg/db/runtime/project.sqlite"]) {
    assert.equal(bytes(root)[file], before[file]);
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, plan.receipt_path), "utf8")).mappings, plan.mappings);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, ".mdkg/index/global.json"), "utf8")).meta.root, root);
  const validation = run(["validate", "--json"]);
  assert.equal(validation.status, 0, validation.stderr || validation.stdout);
  const applied = bytes(root);
  assert.equal(continueGraphTransaction(root, plan.plan_hash, "resume").state, "applied");
  assert.deepEqual(bytes(root), applied);
  // A terminal journal is not permission to silently accept a partially restored graph.
  writeFile(path.join(root, taskPath), plan.writes.find((item: any) => item.path === taskPath).before);
  const altered = bytes(root);
  assert.throws(() => continueGraphTransaction(root, plan.plan_hash, "resume"), /terminal|completed/);
  assert.deepEqual(bytes(root), altered);
});

test("stale authored, selection and validation inputs refuse before any transaction write", () => {
  for (const kind of ["authored", "selection", "schema", "new-node"]) {
    const { root, taskPath } = fixture();
    const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
    if (kind === "authored") fs.appendFileSync(path.join(root, taskPath), "\nnew user evidence\n");
    if (kind === "selection") writeFile(path.join(root, ".mdkg/state/selected-goal.json"), "new selection");
    if (kind === "schema") {
      const file = path.join(root, ".mdkg/templates/default/task.md");
      writeFile(file, fs.readFileSync(file, "utf8").replace("tags:", "extra_field: []\ntags:"));
    }
    if (kind === "new-node") writeFile(path.join(root, ".mdkg/work/task-2-user.md"), fs.readFileSync(path.join(root, taskPath), "utf8").replace("id: task-1", "id: task-2"));
    const before = bytes(root);
    assert.throws(() => applyGraphMigrationPlan(root, plan, plan.plan_hash), /stale|baseline moved/);
    assert.deepEqual(bytes(root), before, kind);
  }
});

test("interrupted migration supports exact resume and rollback without parsing partial nodes", () => {
  for (const mode of ["resume", "rollback"] as const) {
    const { root, taskPath } = fixture();
    const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
    assert.throws(() => applyGraphMigrationPlan(root, plan, plan.plan_hash, {
      afterWrite: (_file: string, index: number) => { if (index === 0) throw new Error("simulated interruption"); },
    }), /simulated interruption/);
    assert.equal(fs.existsSync(path.join(root, ".mdkg/graph.json")), false);
    const result = continueGraphTransaction(root, plan.plan_hash, mode);
    assert.equal(result.state, mode === "resume" ? "applied" : "rolled-back");
    assert.equal(fs.readFileSync(path.join(root, taskPath), "utf8"), plan.writes.find((item: any) => item.path === taskPath)[mode === "resume" ? "after" : "before"]);
    assert.equal(fs.existsSync(path.join(root, plan.receipt_path)), mode === "resume");
    const completed = bytes(root);
    continueGraphTransaction(root, plan.plan_hash, mode);
    assert.deepEqual(bytes(root), completed);
  }
});

test("concurrent authored input during apply halts, and recovery preserves changed user bytes", () => {
  const { root, taskPath } = fixture();
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  const userPath = ".mdkg/work/task-9-user.md";
  assert.throws(() => applyGraphMigrationPlan(root, plan, plan.plan_hash, {
    afterWrite: (_file: string, index: number) => {
      if (index === 0) writeFile(path.join(root, userPath), fs.readFileSync(path.join(root, taskPath), "utf8").replace("id: task-1", "id: task-9").replace(/node_id: .+/, "node_id: 63b7a928-d6e7-4ba1-8066-3f27b5b00f7a"));
    },
  }), /new unowned input/);
  const before = bytes(root);
  assert.throws(() => continueGraphTransaction(root, plan.plan_hash, "rollback"), /new unowned input/);
  assert.deepEqual(bytes(root), before);
});

test("recovery refuses modified owned bytes and symlinked journal paths", () => {
  const { root, taskPath } = fixture();
  const plan = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  assert.throws(() => applyGraphMigrationPlan(root, plan, plan.plan_hash, {
    afterWrite: () => { throw new Error("interrupted"); },
  }), /interrupted/);
  fs.appendFileSync(path.join(root, taskPath), "\nuser edit after interruption\n");
  const before = bytes(root);
  assert.throws(() => continueGraphTransaction(root, plan.plan_hash, "resume"), /custody collision/);
  assert.deepEqual(bytes(root), before);

  const second = fixture();
  const secondPlan = planLegacyIdentityMigration(second.root, { graphId: GRAPH, origin: ORIGIN_A });
  fs.mkdirSync(path.join(second.root, ".mdkg/state"), { recursive: true });
  fs.symlinkSync(makeTempDir("mdkg-journal-outside-"), path.join(second.root, ".mdkg/state/identity-transactions"));
  const linked = bytes(second.root);
  assert.throws(() => applyGraphMigrationPlan(second.root, secondPlan, secondPlan.plan_hash), /symlink|symbolic|linked/i);
  assert.deepEqual(bytes(second.root), linked);
});

test("migration CLI binds the reviewed plan, defaults recovery to inspection and excludes private journals from bundles", () => {
  const { root, run } = fixture();
  const args = ["graph", "migrate", "--graph-id", GRAPH, "--origin", ORIGIN_A, "--json"];
  const before = bytes(root);
  const preview = run(args);
  assert.equal(preview.status, 0, preview.stderr);
  const plan = JSON.parse(preview.stdout);
  assert.deepEqual(bytes(root), before);
  assert.equal(run([...args, "--apply=false"]).status, 0);
  assert.deepEqual(bytes(root), before);
  assert.notEqual(run([...args, "--dry-run", "--apply", "--plan-hash", plan.plan_hash]).status, 0);
  assert.deepEqual(bytes(root), before);
  const refused = run([...args, "--apply"]);
  assert.notEqual(refused.status, 0);
  assert.deepEqual(bytes(root), before);
  const applied = run([...args, "--apply", "--plan-hash", plan.plan_hash]);
  assert.equal(applied.status, 0, applied.stderr);
  const receipt = JSON.parse(applied.stdout);
  assert.equal(receipt.state, "applied");
  assert.equal(fs.statSync(path.join(root, receipt.journal_path)).mode & 0o777, 0o600);
  const after = bytes(root);
  const inspected = run(["graph", "recover", plan.plan_hash, "--json"]);
  assert.equal(inspected.status, 0, inspected.stderr);
  assert.equal(JSON.parse(inspected.stdout).side_effects, "none");
  assert.equal(JSON.parse(inspected.stdout).plan.writes[0].before, undefined);
  assert.deepEqual(bytes(root), after);
  const { buildBundle } = require("../../commands/bundle");
  const bundle = buildBundle({ root, profile: "private" });
  assert.ok(!bundle.manifest.files.some((file: any) => file.path.includes("identity-transactions")));
  assert.ok(bundle.manifest.files.some((file: any) => file.path === receipt.receipt_path));
  const conflictingModes = run(["graph", "recover", plan.plan_hash, "--resume", "--rollback"]);
  assert.notEqual(conflictingModes.status, 0);
  assert.match(conflictingModes.stderr, /at most one/);
  assert.deepEqual(bytes(root), after);
});

test("another unfinished journal blocks a new migration and interrupted rollback is recoverable", () => {
  const { root } = fixture();
  const first = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_A });
  const second = planLegacyIdentityMigration(root, { graphId: GRAPH, origin: ORIGIN_B });
  const journalPath = `.mdkg/state/identity-transactions/${first.plan_hash.slice(7)}.json`;
  writeFile(path.join(root, journalPath), JSON.stringify({ schema_version: 1, state: "applying", plan: first }));
  const before = bytes(root);
  assert.throws(() => applyGraphMigrationPlan(root, second, second.plan_hash), /another graph transaction/);
  assert.deepEqual(bytes(root), before);
  continueGraphTransaction(root, first.plan_hash, "resume");
  assert.throws(() => continueGraphTransaction(root, first.plan_hash, "rollback", {
    afterWrite: () => { throw new Error("interrupted rollback"); },
  }), /interrupted rollback/);
  assert.throws(() => continueGraphTransaction(root, first.plan_hash, "resume"), /rollback was requested/);
  assert.equal(continueGraphTransaction(root, first.plan_hash, "rollback").state, "rolled-back");
});
