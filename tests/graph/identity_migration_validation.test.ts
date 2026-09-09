import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { planLegacyIdentityMigration, graphPlanHash } = require(path.join(runtime, "graph/identity_migration"));
const { applyGraphMigrationPlan, continueGraphTransaction } = require(path.join(runtime, "graph/identity_transaction"));
const { loadConfig } = require(path.join(runtime, "core/config"));
const roots: string[] = [];
const parameters = { graphId: "e7403372-f270-4cd7-902d-64b792c781df", origin: "ddf626b6-073f-4f99-9d30-5e30912922fd" };
after(() => { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); });

function bytes(root: string) {
  const result: Record<string, string> = {};
  function visit(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) result[path.relative(root, file)] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    }
  }
  visit(root); return result;
}
function fixture() {
  const root = makeTempDir("mdkg-migration-validation-"); roots.push(root);
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  const run = (args: string[]) => spawnSync(process.execPath, [path.join(runtime, "cli.js"), ...args], { cwd: root, encoding: "utf8" });
  const created = run(["new", "task", "Candidate validation", "--json"]); assert.equal(created.status, 0, created.stderr);
  const task = path.join(root, JSON.parse(created.stdout).node.path);
  return { root, task, run, plan: () => planLegacyIdentityMigration(root, parameters) };
}
function skill(root: string, slug = "fixture-skill") {
  const file = path.join(root, ".mdkg/skills", slug, "SKILL.md");
  writeFile(file, `---\nname: ${slug}\ndescription: Synthetic fixture skill\ntags: []\n---\n# Procedure\nPreserve fixture data.\n`);
  return file;
}
function useSkill(task: string) {
  writeFile(task, fs.readFileSync(task, "utf8").replace("skills: []", "skills: [fixture-skill]"));
}

test("missing required skill fails both normal validation and migration preview without writes", () => {
  const f = fixture(); useSkill(f.task);
  assert.equal(f.run(["validate", "--json"]).status, 2);
  const before = bytes(f.root), plan = f.plan(); assert.deepEqual(bytes(f.root), before);
  assert.ok(plan.blocking.some((reason: string) => /skills reference missing slug.*fixture-skill/.test(reason)), JSON.stringify(plan.blocking));
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /blocked/);
  assert.deepEqual(bytes(f.root), before);
});

test("valid required skill permits migration and subsequent normal validation", () => {
  const f = fixture(); skill(f.root); useSkill(f.task); const plan = f.plan();
  assert.deepEqual(plan.blocking, []);
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  const verified = f.run(["validate", "--json"]); assert.equal(verified.status, 0, verified.stdout + verified.stderr);
});

for (const mode of ["content", "addition", "removal"]) {
  test(`skill ${mode} after preview refuses before migration writes`, () => {
    const f = fixture(), file = skill(f.root); useSkill(f.task); const plan = f.plan();
    if (mode === "content") fs.appendFileSync(file, "\nOwner changed procedure.\n");
    else if (mode === "addition") skill(f.root, "new-skill");
    else fs.unlinkSync(file);
    const before = bytes(f.root);
    assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /dependency|inventory|skill/i);
    assert.deepEqual(bytes(f.root), before, "dependency refusal must precede journal and authored writes");
  });
}

test("orphan skill directories are not omitted from candidate validity", () => {
  const f = fixture(); writeFile(path.join(f.root, ".mdkg/skills/orphan/notes.txt"), "Not a skill definition.\n");
  assert.equal(f.run(["validate", "--json"]).status, 2);
  const before = bytes(f.root), plan = f.plan(); assert.deepEqual(bytes(f.root), before);
  assert.ok(plan.blocking.some((reason: string) => /missing SKILL.md or SKILLS.md/.test(reason)), JSON.stringify(plan.blocking));
});

test("template body changes with unchanged schema invalidate exact migration approval", () => {
  const f = fixture(), plan = f.plan(); fs.appendFileSync(path.join(f.root, ".mdkg/templates/default/task.md"), "\nUpdated template guidance.\n");
  const before = bytes(f.root); assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /template|dependency|control baseline/i);
  assert.deepEqual(bytes(f.root), before);
});

test("identity header expansion must fit the resulting node per-file limit", () => {
  const f = fixture(); fs.appendFileSync(f.task, "\n" + "x".repeat(16000) + "\n");
  const originalSize = fs.statSync(f.task).size, configPath = path.join(f.root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index = { ...config.index, limits: { ...loadConfig(f.root).index.limits, max_file_bytes: originalSize + 1 } };
  writeFile(configPath, JSON.stringify(config)); assert.equal(f.run(["validate", "--json"]).status, 0);
  const before = bytes(f.root), plan = f.plan(); assert.deepEqual(bytes(f.root), before);
  assert.ok(plan.blocking.some((reason: string) => /file|limit|byte/.test(reason)), JSON.stringify(plan.blocking));
});

test("changed skill dependency prevents interrupted migration from resuming", () => {
  const f = fixture(), file = skill(f.root); useSkill(f.task); const plan = f.plan();
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, { afterWrite: () => { throw new Error("fixture interruption"); } }), /fixture interruption/);
  fs.appendFileSync(file, "\nChanged while interrupted.\n"); const before = bytes(f.root);
  assert.throws(() => continueGraphTransaction(f.root, plan.plan_hash, "resume"), /dependency|inventory|skill/i);
  assert.deepEqual(bytes(f.root), before);
});

test("supported skill-update proposal references require an existing canonical skill", () => {
  const f = fixture();
  writeFile(path.join(f.root, ".mdkg/work/skill-proposal/PROPOSAL.md"), `---\nid: proposal.missing-skill\ntype: proposal\ntitle: Review skill\nversion: 1.0.0\ntarget_id: skill.missing\nproposal_status: proposed\nproposal_kind: skill_update\nevidence_refs: []\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: [skill.missing]\nrefs: []\naliases: []\ncreated: 2026-05-01\nupdated: 2026-05-01\n---\n# Summary\nSynthetic missing skill proposal.\n`);
  assert.equal(f.run(["validate", "--json"]).status, 2);
  const plan = f.plan(); assert.ok(plan.blocking.some((reason: string) => /skill/.test(reason)), JSON.stringify(plan.blocking));
});

for (const mode of ["malformed", "both"]) test(`invalid ${mode} skill refuses candidate approval`, () => {
  const f = fixture(), file = skill(f.root);
  if (mode === "malformed") writeFile(file, "---\nname: fixture-skill\n---\nMissing description.\n");
  else writeFile(path.join(path.dirname(file), "SKILLS.md"), fs.readFileSync(file, "utf8"));
  const before = bytes(f.root), plan = f.plan(); assert.ok(plan.blocking.length); assert.deepEqual(bytes(f.root), before);
});

for (const mode of ["orphan-skill", "template-add", "fallback-replacement", "event-add"]) {
  test(`new ${mode} dependency invalidates reviewed plan without writes`, () => {
    const f = fixture();
    const template = path.join(f.root, ".mdkg/templates/default/task.md");
    const templateBytes = fs.readFileSync(template, "utf8");
    if (mode === "fallback-replacement") fs.unlinkSync(template);
    const plan = f.plan(); assert.deepEqual(plan.blocking, []);
    if (mode === "orphan-skill") fs.mkdirSync(path.join(f.root, ".mdkg/skills/empty"), { recursive: true });
    else if (mode === "template-add") writeFile(path.join(path.dirname(template), "also-task.md"), templateBytes);
    else if (mode === "fallback-replacement") writeFile(template, templateBytes);
    else writeFile(path.join(f.root, ".mdkg/work/events/events.jsonl"), "\n");
    const before = bytes(f.root);
    assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /dependency|inventory|template/);
    assert.deepEqual(bytes(f.root), before);
  });
}

test("malformed event history blocks candidate approval without rewriting history", () => {
  const f = fixture(); writeFile(path.join(f.root, ".mdkg/work/events/events.jsonl"), "not-json\n");
  assert.equal(f.run(["validate", "--json"]).status, 2);
  const before = bytes(f.root), plan = f.plan(); assert.ok(plan.blocking.some((s: string) => /invalid JSON/.test(s)));
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /blocked/); assert.deepEqual(bytes(f.root), before);
});

for (const mode of ["missing-contract", "omitted-dependency", "invalid-output", "conflict-markers"]) {
  test(`self-hashed ${mode} plan cannot bypass pre-write validation`, () => {
    const f = fixture(); skill(f.root); useSkill(f.task); const plan = f.plan();
    if (mode === "missing-contract") delete plan.candidate_validation;
    else if (mode === "omitted-dependency") plan.dependency_files = {};
    else {
      const node = plan.writes.find((change: { path: string }) => change.path.endsWith(".md"));
      if (mode === "conflict-markers") node.after += "\n<<<<<<< HEAD\nUnresolved target\n=======\nUnresolved incoming\n>>>>>>> incoming\n";
      else { node.after = node.after.replace("skills: [fixture-skill]", "skills: [missing]"); assert.match(node.after, /skills: \[missing\]/); }
    }
    const { plan_hash: _, ...body } = plan; plan.plan_hash = graphPlanHash(body);
    const before = bytes(f.root);
    assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /validation|dependency/);
    assert.deepEqual(bytes(f.root), before, "refuse before creating journal or lock files");
  });
}

test("underbound legacy journal refuses resume but preserves exact rollback", () => {
  const f = fixture(), original = fs.readFileSync(f.task, "utf8"), plan = f.plan();
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, { afterWrite: () => { throw Error("fixture interruption"); } }), /fixture interruption/);
  const oldPath = path.join(f.root, ".mdkg/state/identity-transactions", plan.plan_hash.slice(7) + ".json");
  const journal = JSON.parse(fs.readFileSync(oldPath, "utf8")); delete journal.plan.candidate_validation;
  const { plan_hash: _, ...body } = journal.plan; journal.plan.plan_hash = graphPlanHash(body);
  const newPath = path.join(path.dirname(oldPath), journal.plan.plan_hash.slice(7) + ".json");
  fs.unlinkSync(oldPath); writeFile(newPath, JSON.stringify(journal));
  const before = bytes(f.root);
  assert.throws(() => continueGraphTransaction(f.root, journal.plan.plan_hash, "resume"), /lacks complete candidate validation/);
  assert.deepEqual(bytes(f.root), before);
  assert.equal(continueGraphTransaction(f.root, journal.plan.plan_hash, "rollback").state, "rolled-back");
  assert.equal(fs.readFileSync(f.task, "utf8"), original);
  assert.equal(fs.existsSync(path.join(f.root, ".mdkg/graph.json")), false);
});

test("authored template dependency overlap is refused before it can strand recovery", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.templates.root_path = ".mdkg"; config.templates.default_set = "work";
  writeFile(configPath, JSON.stringify(config));
  assert.equal(f.run(["validate", "--json"]).status, 0);
  const before = bytes(f.root), plan = f.plan();
  assert.ok(plan.blocking.some((s: string) => /dependency overlaps authored write/.test(s)), JSON.stringify(plan.blocking));
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /blocked/);
  assert.deepEqual(bytes(f.root), before);
  // A self-hash cannot turn an incomplete overlap plan into application proof.
  plan.blocking = []; const { plan_hash: _, ...body } = plan; plan.plan_hash = graphPlanHash(body);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /dependency overlaps authored write/);
  assert.deepEqual(bytes(f.root), before);
});

test("oversized skill is refused before dependency fingerprinting can scan it", () => {
  const f = fixture(), file = skill(f.root), fd = fs.openSync(file, "r+");
  fs.ftruncateSync(fd, loadConfig(f.root).index.limits.max_file_bytes + 1); fs.closeSync(fd);
  const before = bytes(f.root);
  assert.throws(() => f.plan(), /byte limit/); assert.deepEqual(bytes(f.root), before);
});

test("existing event history participates in the resulting graph aggregate budget", () => {
  const f = fixture();
  const eventPath = path.join(f.root, ".mdkg/work/events/events.jsonl");
  const event = JSON.stringify({ ts: "2026-09-09T00:00:00Z", run_id: "fixture", workspace: "root", agent: "fixture", kind: "OBSERVED", status: "done", refs: [], artifacts: [], notes: "x".repeat(100000) }) + "\n";
  writeFile(eventPath, event);
  const configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.limits = { ...loadConfig(f.root).index.limits, max_total_bytes: fs.statSync(f.task).size + Buffer.byteLength(event) + 1 };
  writeFile(configPath, JSON.stringify(config));
  const control = f.run(["validate", "--json"]); assert.equal(control.status, 0, control.stdout + control.stderr);
  const before = bytes(f.root), plan = f.plan();
  assert.ok(plan.blocking.some((s: string) => /shared graph\/event budget/.test(s)), JSON.stringify(plan.blocking));
  assert.deepEqual(bytes(f.root), before);
});

for (const mode of ["present", "missing", "disabled", "illegal-parent"]) {
  test(`migration respects actual read-only imported targets: ${mode}`, () => {
    const child = fixture(), f = fixture();
    const bundled = child.run(["bundle", "create", "--output", "child.mdkg.zip", "--json"]);
    assert.equal(bundled.status, 0, bundled.stderr);
    const source = fs.readFileSync(path.join(child.root, "child.mdkg.zip"));
    fs.writeFileSync(path.join(f.root, "child.mdkg.zip"), source);
    const mounted = f.run(["subgraph", "add", "child", "child.mdkg.zip", "--json"]); assert.equal(mounted.status, 0, mounted.stderr);
    let content = fs.readFileSync(f.task, "utf8");
    if (mode === "illegal-parent") content = content.replace("type: task", "type: task\nparent: child:task-1");
    else content = content.replace("context_refs: []", `context_refs: [child:${mode === "missing" ? "task-999" : "task-1"}]`);
    writeFile(f.task, content);
    if (mode === "disabled") {
      const configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      config.subgraphs.child.enabled = false; writeFile(configPath, JSON.stringify(config));
    }
    const before = bytes(f.root), childBefore = bytes(child.root), plan = f.plan(); assert.deepEqual(bytes(f.root), before);
    if (mode === "present") {
      assert.deepEqual(plan.blocking, []); assert.equal(applyGraphMigrationPlan(f.root, plan, plan.plan_hash).state, "applied");
      const verified = f.run(["validate", "--json"]); assert.equal(verified.status, 0, verified.stdout + verified.stderr);
      assert.match(fs.readFileSync(f.task, "utf8"), /child:task-1/);
    } else { assert.ok(plan.blocking.length, mode); assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /blocked/); assert.deepEqual(bytes(f.root), before); }
    assert.deepEqual(fs.readFileSync(path.join(f.root, "child.mdkg.zip")), source); assert.deepEqual(bytes(child.root), childBefore);
  });
}

for (const target of ["task", "new-node", "template", "skill", "event", "format", "config", "runtime", "journal", "duplicate-json", "duplicate-sqlite", "file-prefix"]) {
  test(`derived cache ${target} collision refuses identity planning before writes`, () => {
    const f = fixture(), file = skill(f.root), configPath = path.join(f.root, ".mdkg/config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const targets: Record<string, string> = { task: path.relative(f.root, f.task), "new-node": ".mdkg/work/new-cache.md",
      template: ".mdkg/templates/default/task.md", skill: path.relative(f.root, file), event: ".mdkg/work/events/events.jsonl",
      format: ".mdkg/graph.json", config: ".mdkg/config.json", runtime: config.db.runtime_path,
      journal: ".mdkg/state/identity-transactions/cache.json", "duplicate-json": ".mdkg/index/skills.json",
      "duplicate-sqlite": config.index.sqlite_path, "file-prefix": ".mdkg/cache/parent" };
    config.index.global_index_path = targets[target];
    if (target === "duplicate-sqlite") config.index.backend = "sqlite";
    if (target === "file-prefix") config.capabilities.cache_path = ".mdkg/cache/parent/child.json";
    writeFile(configPath, JSON.stringify(config));
    const before = bytes(f.root), plan = f.plan();
    assert.ok(plan.blocking.some((s: string) => /cache.*(overlap|collision|ownership)|derived.*(overlap|collision|ownership)/.test(s)), JSON.stringify(plan.blocking));
    assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /blocked/); assert.deepEqual(bytes(f.root), before);
  });
}

test("non-root capability skill metadata is validated before migration writes", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces.child = { path: "child", mdkg_dir: ".mdkg", enabled: true, visibility: "private" };
  writeFile(path.join(f.root, "child/.mdkg/core/core.md"), "# core\n");
  writeFile(path.join(f.root, "child/.mdkg/skills/bad/SKILL.md"), "---\nname: bad\n---\nMissing description.\n");
  writeFile(configPath, JSON.stringify(config)); const before = bytes(f.root), plan = f.plan();
  assert.ok(plan.blocking.some((s: string) => /description/.test(s)), JSON.stringify(plan.blocking));
  assert.deepEqual(bytes(f.root), before);
});

for (const suffix of ["-wal", "-shm", "-journal"]) test(`SQLite sidecar ${suffix} is reserved even when not yet present`, () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = "sqlite"; config.index.global_index_path = config.index.sqlite_path + suffix;
  writeFile(configPath, JSON.stringify(config)); const before = bytes(f.root), plan = f.plan();
  assert.ok(plan.blocking.some((s: string) => /collision with SQLite sidecar/.test(s)), JSON.stringify(plan.blocking));
  assert.deepEqual(bytes(f.root), before);
});

test("an existing SQLite sidecar is preserved and blocks migration before journaling", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = "sqlite"; writeFile(configPath, JSON.stringify(config));
  writeFile(path.join(f.root, config.index.sqlite_path + "-wal"), "unowned sidecar bytes\n");
  const before = bytes(f.root), plan = f.plan(); assert.ok(plan.blocking.some((s: string) => /unowned live sidecar/.test(s)));
  assert.deepEqual(bytes(f.root), before);
});

for (const backend of ["json", "sqlite"]) test(`dedicated custom ${backend} cache paths remain supported`, () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = backend; config.index.global_index_path = ".cache/mdkg/nodes.json";
  config.capabilities.cache_path = ".cache/mdkg/capabilities.json"; config.index.sqlite_path = ".cache/mdkg/index.sqlite";
  writeFile(configPath, JSON.stringify(config)); const plan = f.plan(); assert.deepEqual(plan.blocking, []);
  assert.equal(applyGraphMigrationPlan(f.root, plan, plan.plan_hash).state, "applied");
  const verified = f.run(["validate", "--json"]); assert.equal(verified.status, 0, verified.stdout + verified.stderr);
});

for (const mode of ["disabled-workspace", "imported-root"]) test(`cache writes cannot borrow ${mode} ownership`, () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (mode === "disabled-workspace") config.workspaces.other = { path: "other", mdkg_dir: ".mdkg", enabled: false, visibility: "private" };
  else config.subgraphs.other = { enabled: false, source_path: "other", visibility: "private", permissions: ["read"], max_stale_seconds: 1, sources: [{ path: "other.mdkg.zip", enabled: false, expected_profile: "private" }] };
  config.index.global_index_path = "other/.mdkg/work/cache.json";
  writeFile(configPath, JSON.stringify(config)); const before = bytes(f.root), plan = f.plan();
  assert.ok(plan.blocking.some((s: string) => /cache ownership overlap/.test(s)), JSON.stringify(plan.blocking)); assert.deepEqual(bytes(f.root), before);
  assert.equal(fs.existsSync(path.join(f.root, "other")), false, "owner's directory was not materialized");
});

test("repository-root template discovery cannot authorize overlapping writes", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  fs.unlinkSync(path.join(f.root, ".mdkg/core/core.md"));
  config.templates.root_path = "."; config.templates.default_set = "."; writeFile(configPath, JSON.stringify(config));
  const before = bytes(f.root), plan = f.plan();
  assert.equal(plan.candidate_validation.template_root, ".");
  assert.ok(plan.blocking.some((s: string) => /dependency overlaps|cache ownership overlap/.test(s)), JSON.stringify(plan.blocking));
  assert.deepEqual(bytes(f.root), before);
});

test("unsafe cache destinations in old journals refuse rollback before restoring any bytes", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.global_index_path = path.relative(f.root, f.task); writeFile(configPath, JSON.stringify(config));
  const plan = f.plan(); plan.blocking = []; delete plan.candidate_validation; delete plan.dependency_files;
  const { plan_hash: _, ...body } = plan; plan.plan_hash = graphPlanHash(body);
  const first = plan.writes.find((change: { path: string }) => change.path.endsWith(".md")); writeFile(path.join(f.root, first.path), first.after);
  writeFile(path.join(f.root, ".mdkg/state/identity-transactions", plan.plan_hash.slice(7) + ".json"), JSON.stringify({ schema_version: 1, state: "applying", plan }));
  const before = bytes(f.root);
  assert.throws(() => continueGraphTransaction(f.root, plan.plan_hash, "rollback"), /cache ownership overlap/); assert.deepEqual(bytes(f.root), before);
});

test("changed enabled non-root skill blocks application without changing that owner", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces.child = { path: "child", mdkg_dir: ".mdkg", enabled: true, visibility: "private" };
  const file = path.join(f.root, "child/.mdkg/skills/child-only/SKILL.md");
  writeFile(file, "---\nname: child-only\ndescription: Child skill\n---\n# Procedure\nLocal fixture.\n");
  writeFile(configPath, JSON.stringify(config)); const plan = f.plan(); assert.deepEqual(plan.blocking, []);
  fs.appendFileSync(file, "\nChanged dependency.\n"); const before = bytes(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /dependency baseline moved/); assert.deepEqual(bytes(f.root), before);
});

test("observed case-alias cache destinations cannot evade authored ownership", () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.global_index_path = path.relative(f.root, f.task).toUpperCase();
  const aliasesExistingNode = fs.existsSync(path.join(f.root, config.index.global_index_path));
  writeFile(configPath, JSON.stringify(config)); const before = bytes(f.root), plan = f.plan();
  if (aliasesExistingNode) assert.ok(plan.blocking.some((s: string) => /ownership|overlap/.test(s)), JSON.stringify(plan.blocking));
  else assert.deepEqual(plan.blocking, [], "distinct case-sensitive path is not silently case-folded");
  assert.deepEqual(bytes(f.root), before);
});

for (const mode of ["future-format", "future-caches"]) test(`absent ${mode} case aliases are compared using observed filesystem behavior`, () => {
  const f = fixture(), configPath = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const insensitive = fs.existsSync(path.join(f.root, ".mdkg/CONFIG.JSON"));
  config.index.global_index_path = mode === "future-format" ? ".mdkg/Graph.json" : ".mdkg/index/Foo.json";
  if (mode === "future-caches") config.capabilities.cache_path = ".mdkg/index/foo.json";
  writeFile(configPath, JSON.stringify(config)); const before = bytes(f.root), plan = f.plan();
  if (insensitive) assert.ok(plan.blocking.some((s: string) => /overlap|collision/.test(s)), JSON.stringify(plan.blocking));
  else assert.deepEqual(plan.blocking, [], "observed case-sensitive distinct destinations remain supported");
  assert.deepEqual(bytes(f.root), before);
});

test("literal POSIX backslashes in template filenames retain native dependency identity", () => {
  if (path.sep !== "/") return;
  const f = fixture();
  const template = path.join(f.root, ".mdkg/templates/default/task.md");
  const literal = path.join(path.dirname(template), "literal\\task.md");
  writeFile(literal, fs.readFileSync(template, "utf8"));
  const plan = f.plan(); assert.deepEqual(plan.blocking, []);
  fs.appendFileSync(literal, "\nChanged exact native filename.\n"); const before = bytes(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /template dependency/); assert.deepEqual(bytes(f.root), before);
});
