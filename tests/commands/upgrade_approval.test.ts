import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { UpgradePlan, continueUpgrade, readUpgradeJournal, UPGRADE_JOURNAL } = require(path.join(runtime, "commands/upgrade_transaction"));
const roots: string[] = [];
after(() => { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); });
const hash = (value: string | Buffer) => crypto.createHash("sha256").update(value).digest("hex");
const canonical = (value: unknown) => JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : item);
function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function visit(dir: string) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name), relative = path.relative(root, file);
    if (entry.isDirectory()) { result[relative + "/"] = "directory"; visit(file); }
    else result[relative] = hash(fs.readFileSync(file));
  } }
  visit(root); return result;
}
function fixture(terminal = false) {
  const root = makeTempDir("mdkg-upgrade-approval-"); roots.push(root);
  writeFile(path.join(root, "owned/a.txt"), "old a");
  writeFile(path.join(root, "dependency.txt"), "dependency");
  writeFile(path.join(root, "README.md"), "user original");
  const initialized = spawnSync("git", ["init", "-q"], { cwd: root, encoding: "utf8" });
  assert.equal(initialized.status, 0, initialized.stderr);
  writeFile(path.join(root, ".git/index"), "unchanged index");
  const plan = new UpgradePlan(root);
  plan.read("dependency.txt"); plan.write("owned/a.txt", "new a"); plan.write("owned/b.txt", "new b");
  const approved = plan.hash({ version: "fixture", nested: JSON.parse('{"__proto__":{"reviewed":true},"a":1}') });
  if (terminal) plan.apply(approved, 10);
  else assert.throws(() => plan.apply(approved, 10, () => { throw Error("interrupted"); }), /interrupted/);
  const file = path.join(root, UPGRADE_JOURNAL), journal = JSON.parse(fs.readFileSync(file, "utf8"));
  return { root, file, journal, approved };
}
function save(file: string, journal: any) {
  journal.operations_hash = hash(JSON.stringify(journal.operations));
  if (journal.dependencies) journal.dependencies_hash = hash(JSON.stringify(journal.dependencies));
  writeFile(file, JSON.stringify(journal));
}

const tamper: Record<string, (j: any, mode: string) => void> = {
  substitute(j, mode) { j.operations = [{ path: "README.md", before: Buffer.from(mode === "recover" ? "unapproved" : "user original").toString("base64"), after: Buffer.from(mode === "recover" ? "user original" : "unapproved").toString("base64") }]; },
  insert(j) { j.operations.push({ path: "package.json", before: null, after: Buffer.from("{}").toString("base64") }); },
  remove(j) { j.operations.pop(); },
  reorder(j) { j.operations.reverse(); },
  file_dependency(j) { j.dependencies.files = []; },
  directory_dependency(j) { j.dependencies.directories = []; },
  replace_dependency(j) { j.dependencies.files[0][1] = "0".repeat(64); },
  payload_operation(j) { j.approved_plan.operations[0].after = Buffer.from("unapproved").toString("base64"); j.operations = j.approved_plan.operations; },
  payload_dependencies(j) { j.approved_plan.dependencies.files = []; j.dependencies = j.approved_plan.dependencies; },
  payload_extra(j) { j.approved_plan.extra.version = "unapproved"; },
  prototype_key(j) { j.approved_plan.extra.nested.__proto__.reviewed = false; },
  payload_missing(j) { delete j.approved_plan; },
  plan_hash(j) { j.plan_hash = "0".repeat(64); },
};
for (const [name, change] of Object.entries(tamper)) for (const mode of ["resume", "recover"]) {
  test(`approved recovery refuses ${name} tampering before effects (${mode})`, () => {
    const { root, file, journal, approved } = fixture();
    change(journal, mode); save(file, journal);
    const before = snapshot(root);
    assert.throws(() => continueUpgrade(root, mode, approved, 10), /approved plan/);
    assert.deepEqual(snapshot(root), before);
  });
}
for (const schema of [1, 2]) for (const state of ["applying", "recovering", "completed", "recovered"]) for (const mode of ["resume", "recover"]) {
  test(`unbound schema ${schema} ${state} journal refuses ${mode} without writes`, () => {
    const { root, file, journal, approved } = fixture();
    journal.schema_version = schema; journal.state = state; delete journal.approved_plan;
    if (schema === 1) { delete journal.dependencies; delete journal.dependencies_hash; }
    save(file, journal);
    const before = snapshot(root);
    assert.equal(readUpgradeJournal(root).schema_version, schema, "legacy state remains inspectable");
    assert.throws(() => continueUpgrade(root, mode, approved, 10), /unbound legacy/);
    assert.deepEqual(snapshot(root), before);
  });
}
test("terminal shortcuts and completed rollback require the approved payload", () => {
  for (const state of ["completed", "recovered"]) for (const mode of ["resume", "recover"]) {
    const { root, file, journal, approved } = fixture(true);
    journal.state = state; tamper.substitute(journal, mode); save(file, journal);
    const before = snapshot(root);
    assert.throws(() => continueUpgrade(root, mode, approved, 10), /approved plan/);
    assert.deepEqual(snapshot(root), before);
  }
});
test("journal self-hashes and a substituted plan hash cannot replace operator approval", () => {
  const { root, file, journal, approved } = fixture();
  journal.approved_plan.extra.version = "unapproved";
  journal.plan_hash = hash(canonical(journal.approved_plan)); save(file, journal);
  const before = snapshot(root);
  assert.throws(() => continueUpgrade(root, "resume", approved, 10), /approved plan/);
  assert.deepEqual(snapshot(root), before);
});
test("approved intent stays identical across progress and terminal continuation is observational", () => {
  for (const mode of ["resume", "recover"]) {
    const { root, file, journal, approved } = fixture();
    assert.equal(hash(canonical(journal.approved_plan)), approved);
    continueUpgrade(root, mode, approved, 10);
    const terminal = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.deepEqual(terminal.approved_plan, journal.approved_plan);
    assert.equal(hash(canonical(terminal.approved_plan)), approved);
    assert.equal(fs.readFileSync(path.join(root, "owned/a.txt"), "utf8"), mode === "resume" ? "new a" : "old a");
    assert.equal(fs.existsSync(path.join(root, "owned/b.txt")), mode === "resume");
    const before = snapshot(root); continueUpgrade(root, mode, approved, 10); assert.deepEqual(snapshot(root), before);
    assert.equal(fs.readFileSync(path.join(root, "README.md"), "utf8"), "user original");
    assert.equal(fs.readFileSync(path.join(root, ".git/index"), "utf8"), "unchanged index");
  }
});
test("application refuses unreviewed or changed in-memory plans before lock or writes", () => {
  for (const change of ["operation", "dependency", "order", "unreviewed"]) {
    const root = makeTempDir("mdkg-upgrade-plan-approval-"); roots.push(root);
    const plan = new UpgradePlan(root); plan.write("a.txt", "a"); plan.write("b.txt", "b");
    const approved = change === "unreviewed" ? "0".repeat(64) : plan.hash({});
    if (change === "operation") plan.operations.get("a.txt").after = Buffer.from("changed").toString("base64");
    if (change === "dependency") plan.read("extra.txt");
    if (change === "order") { const op = plan.operations.get("a.txt"); plan.operations.delete("a.txt"); plan.operations.set("a.txt", op); }
    const before = snapshot(root);
    assert.throws(() => plan.apply(approved, 10), /not approved|plan changed/);
    assert.deepEqual(snapshot(root), before);
  }
});
test("validation callbacks cannot replace admitted operations", () => {
  const { root, approved } = fixture(); const before = snapshot(root);
  assert.throws(() => continueUpgrade(root, "resume", approved, 10, (journal: any) => { tamper.substitute(journal, "resume"); }), /approved plan/);
  assert.deepEqual(snapshot(root), before);
});

test("CLI recovery refuses substituted ordinary-file operations and legacy journals without any effects", () => {
  for (const mode of ["resume", "recover"]) for (const change of ["substitute", "legacy"]) {
    const { root, file, journal, approved } = fixture();
    const init = spawnSync(process.execPath, [path.join(runtime, "cli.js"), "init", "--graph-only"], { cwd: root, encoding: "utf8" });
    // Init correctly refuses an unfinished transaction. Initialize before
    // reinstalling only this fixture-owned interrupted journal.
    assert.notEqual(init.status, 0); assert.match(init.stderr + init.stdout, /unfinished upgrade/);
    fs.unlinkSync(file);
    const initialized = spawnSync(process.execPath, [path.join(runtime, "cli.js"), "init", "--graph-only"], { cwd: root, encoding: "utf8" });
    assert.equal(initialized.status, 0, initialized.stderr);
    if (change === "substitute") tamper.substitute(journal, mode);
    else { journal.schema_version = 2; delete journal.approved_plan; }
    save(file, journal);
    const before = snapshot(root);
    const result = spawnSync(process.execPath, [path.join(runtime, "cli.js"), "upgrade", `--${mode}`, "--plan-hash", approved, "--json"], { cwd: root, encoding: "utf8", timeout: 30000 });
    assert.equal(result.signal, null); assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /approved plan|unbound legacy/);
    assert.deepEqual(snapshot(root), before);
  }
});
