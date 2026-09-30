import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import childProcess from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { newLockOwner } = require("../../util/lock_evidence");
const { planLegacyIdentityMigration } = require("../../graph/identity_migration");
const { applyGraphMigrationPlan, continueGraphTransaction, inspectGraphTransaction } = require("../../graph/identity_transaction");
const { runCli, runCliAsync } = require("../../cli");

function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-portable-recovery-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Portable recovery fixture\n");
  writeFile(path.join(root, ".mdkg/work/task-1-fixture.md"),
    "---\nid: task-1\ntype: task\ntitle: Fixture\nstatus: todo\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrefs: []\ncreated: 2026-09-28\nupdated: 2026-09-28\n---\n");
  const plan = planLegacyIdentityMigration(root, { graphId: crypto.randomUUID(), origin: crypto.randomUUID() });
  return { root, plan };
}

function inventory(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  function walk(dir: string) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file), relative = path.relative(root, file);
      files[relative] = `${stat.mode}:` + (stat.isDirectory() ? "directory" : stat.isSymbolicLink() ? fs.readlinkSync(file) : crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"));
      if (stat.isDirectory()) walk(file);
    }
  }
  walk(root); return files;
}

function caught(t: { after(fn: () => void): void }) {
  const f = fixture(t);
  assert.throws(() => applyGraphMigrationPlan(f.root, f.plan, f.plan.plan_hash, {
    afterWrite: () => { throw Error("owned caught interruption"); },
  }), /owned caught interruption/);
  assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/write.lock")), false);
  return f;
}

test("transaction lock owners require no OS utility or UID eligibility probe", t => {
  const f = fixture(t);
  const subprocess = t.mock.method(childProcess, "spawnSync", () => { throw Error("OS utility forbidden"); });
  const uid = process.getuid && t.mock.method(process as NodeJS.Process & { getuid(): number }, "getuid", () => { throw Error("UID eligibility forbidden"); });
  const euid = process.geteuid && t.mock.method(process as NodeJS.Process & { geteuid(): number }, "geteuid", () => { throw Error("UID eligibility forbidden"); });
  const owner = newLockOwner(f.root, { plan_hash: f.plan.plan_hash, mode: "apply" });
  assert.equal(subprocess.mock.callCount(), 0);
  assert.equal(uid?.mock.callCount() ?? 0, 0);
  assert.equal(euid?.mock.callCount() ?? 0, 0);
  assert.equal(owner.schema_version, 2);
  assert.equal(Object.prototype.hasOwnProperty.call(owner, "environment"), false);
});

test("unfinished no-lock recovery requires explicit quiescence confirmation before writes", t => {
  const f = caught(t), before = inventory(f.root);
  assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, "resume"), /confirm-quiescent/);
  assert.deepEqual(inventory(f.root), before);
  const inspection = inspectGraphTransaction(f.root, f.plan.plan_hash);
  assert.equal(inspection.recovery.resume.quiescence, "operator-confirmation-required");
  assert.match(inspection.recovery.resume.lock_evidence, /^sha256:[0-9a-f]{64}$/);
  assert.deepEqual(inventory(f.root), before);
});

for (const mode of ["resume", "rollback"] as const) {
  test(`no-lock ${mode} binds explicit confirmation and approval to this exact journal`, t => {
    const f = caught(t), before = inventory(f.root);
    const review = inspectGraphTransaction(f.root, f.plan.plan_hash).recovery;
    assert.equal(review[mode].approval_contract, "operator-confirmed-quiescence-v1");
    assert.equal(review[mode].lock_state, "absent");
    assert.equal(review[mode].mutation_required, true);
    assert.notEqual(review.resume.lock_evidence, review.rollback.lock_evidence);
    // Neither the former bare-hash API nor a truthy non-Boolean may assert intent.
    for (const authorization of [review[mode].lock_evidence, { lockEvidence: review[mode].lock_evidence },
      { lockEvidence: review[mode].lock_evidence, confirmQuiescent: "true" },
      { lockEvidence: review[mode].lock_evidence, confirmQuiescent: false }]) {
      assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, mode, {}, authorization), /confirm-quiescent/);
      assert.deepEqual(inventory(f.root), before);
    }
    for (const lockEvidence of [undefined, `sha256:${"0".repeat(64)}`, review[mode === "resume" ? "rollback" : "resume"].lock_evidence]) {
      assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, mode, {}, { lockEvidence, confirmQuiescent: true }), /exact fresh --lock-evidence/);
      assert.deepEqual(inventory(f.root), before);
    }
    const result = continueGraphTransaction(f.root, f.plan.plan_hash, mode, {}, { lockEvidence: review[mode].lock_evidence, confirmQuiescent: true });
    assert.equal(result.state, mode === "resume" ? "applied" : "rolled-back");
    const journal = JSON.parse(fs.readFileSync(path.join(f.root, result.journal_path), "utf8"));
    assert.equal(journal.recovery_approvals.length, 1);
    assert.equal(journal.recovery_approvals[0].schema_version, 2);
    assert.equal(journal.recovery_approvals[0].lock_hash, null);
    assert.equal(journal.recovery_approvals[0].confirmation, "all-checkout-writers-stopped");
    assert.equal(journal.recovery_approvals[0].approval_hash, review[mode].lock_evidence);
    const terminal = inventory(f.root), terminalReview = inspectGraphTransaction(f.root, f.plan.plan_hash).recovery[mode];
    assert.equal(terminalReview.quiescence, "not-required-read-only");
    assert.equal(terminalReview.lock_evidence, null);
    assert.equal(terminalReview.mutation_required, false);
    continueGraphTransaction(f.root, f.plan.plan_hash, mode);
    assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, mode, {}, { lockEvidence: review[mode].lock_evidence, confirmQuiescent: true }), /stale approval/);
    assert.deepEqual(inventory(f.root), terminal);
  });
}

for (const change of ["journal", "file", "approval-history"] as const) test(`no-lock recovery refuses changed ${change} evidence`, t => {
  const f = caught(t), lockEvidence = inspectGraphTransaction(f.root, f.plan.plan_hash).recovery.resume.lock_evidence;
  const journalPath = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
  if (change === "journal") fs.appendFileSync(journalPath, "\n");
  if (change === "file") writeFile(path.join(f.root, f.plan.writes[1].path), f.plan.writes[1].after);
  if (change === "approval-history") {
    const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
    journal.recovery_approvals = [{ schema_version: 1, confirmation: "implicit" }];
    fs.writeFileSync(journalPath, JSON.stringify(journal));
  }
  const before = inventory(f.root);
  assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, { lockEvidence, confirmQuiescent: true }), /fresh --lock-evidence|approval history/);
  assert.deepEqual(inventory(f.root), before);
});

for (const [name, invoke] of [["sync", runCli], ["async", runCliAsync]] as const) {
  test(`${name} CLI requires both recovery flags and never treats preview as confirmation`, async t => {
    const f = caught(t), before = inventory(f.root);
    const token = inspectGraphTransaction(f.root, f.plan.plan_hash).recovery.resume.lock_evidence;
    for (const flags of [["--resume"], ["--resume", "--lock-evidence", token],
      ["--resume", "--lock-evidence", token, "--confirm-quiescent=false"],
      ["--resume", "--confirm-quiescent"], ["--confirm-quiescent"]]) {
      const errors: string[] = [];
      const result = await invoke(["--root", f.root, "graph", "recover", f.plan.plan_hash, ...flags, "--json"], {
        cwd: () => f.root, log: () => {}, error: (...args: unknown[]) => errors.push(args.map(String).join(" ")),
      });
      assert.notEqual(result, 0, flags.join(" "));
      assert.match(errors.join("\n"), /confirm-quiescent|lock-evidence/);
      assert.deepEqual(inventory(f.root), before);
    }
    const output: string[] = [], capture = t.mock.method(console, "log", (...args: unknown[]) => { output.push(args.map(String).join(" ")); });
    const result = await invoke(["--root", f.root, "graph", "recover", f.plan.plan_hash, "--resume", "--lock-evidence", token, "--confirm-quiescent", "--json"]);
    capture.mock.restore();
    assert.equal(result, 0);
    assert.equal(JSON.parse(output.join("\n")).state, "applied");
  });
}

test("no-lock approval is checkout-bound even for an exact copied journal", t => {
  const f = caught(t), original = inspectGraphTransaction(f.root, f.plan.plan_hash).recovery.rollback.lock_evidence;
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-portable-recovery-copy-"));
  t.after(() => fs.rmSync(copy, { recursive: true, force: true }));
  fs.cpSync(f.root, copy, { recursive: true });
  const local = inspectGraphTransaction(copy, f.plan.plan_hash).recovery.rollback.lock_evidence;
  assert.notEqual(local, original);
  const before = inventory(copy);
  assert.throws(() => continueGraphTransaction(copy, f.plan.plan_hash, "rollback", {}, { lockEvidence: original, confirmQuiescent: true }), /fresh --lock-evidence/);
  assert.deepEqual(inventory(copy), before);
});
