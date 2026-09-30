import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
import { reviewedFixtureRecovery } from "../helpers/identity_recovery";
const { planLegacyIdentityMigration } = require("../../graph/identity_migration");
const { applyGraphMigrationPlan, continueGraphTransaction, inspectGraphTransaction } = require("../../graph/identity_transaction");
const { graphControlSnapshot } = require("../../graph/identity_snapshot");
const { readMutationLock, assertRecoveryLockEvidence } = require("../../util/lock_evidence");
const recoverOwnedFixture = reviewedFixtureRecovery(require("../../graph/identity_transaction"));
const { identityHash } = require("../../graph/identity");
const dist = path.resolve(__dirname, "../.."), cli = path.join(dist, "cli.js");
const parameters = { graphId: "e7403372-f270-4cd7-902d-64b792c781df", origin: "ddf626b6-073f-4f99-9d30-5e30912922fd" };

const worker = `
const fs=require('fs'),path=require('path');
const [dist,root,action,boundary,hash,mode,evidence,parameters]=process.argv.slice(1);
const tx=require(path.join(dist,'graph/identity_transaction.js'));
const plan=action==='apply'?require(path.join(dist,'graph/identity_migration.js')).planLegacyIdentityMigration(root,JSON.parse(parameters)):null;
const stop=()=>{fs.writeSync(1,JSON.stringify({pid:process.pid,hash:hash||plan.plan_hash})+'\\n');Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,120000);throw Error('fixture parent did not terminate owned child');};
const hooks={afterWrite:(p,i)=>{if(boundary==='write:'+i)stop();},afterJournal:s=>{if(boundary==='journal:'+s)stop();},afterClaim:()=>{if(boundary==='claim')stop();}};
if(action==='apply')tx.applyGraphMigrationPlan(root,plan,plan.plan_hash,hooks);
else tx.continueGraphTransaction(root,hash,mode,hooks,{lockEvidence:evidence||tx.inspectGraphTransaction(root,hash).recovery[mode].lock_evidence,confirmQuiescent:true});
throw Error('requested interruption boundary was not reached');
`;

function inventory(root: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file), relative = path.relative(root, file);
      out[relative] = `${stat.mode}:` + (stat.isDirectory() ? "directory" : stat.isSymbolicLink() ? fs.readlinkSync(file) : crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"));
      if (stat.isDirectory()) walk(file);
    }
  };
  walk(root); return out;
}

function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(process.platform === "darwin" ? "/private/tmp" : os.tmpdir(), "mdkg-interrupted-writer-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  for (let n = 1; n <= 3; n++) writeFile(path.join(root, `.mdkg/work/task-${n}-fixture.md`),
    `---\nid: task-${n}\ntype: task\ntitle: Fixture ${n}\nstatus: todo\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrefs: [${n === 1 ? "" : "task-1"}]\ncreated: 2026-09-17\nupdated: 2026-09-17\n---\n\nHistorical body task-1.\n`);
  const run = (args: string[]) => spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 30000 });
  return { root, run, plan: planLegacyIdentityMigration(root, parameters) };
}

async function halted(root: string, boundary: string, hash = "", mode = "resume", evidence = "", options = parameters) {
  const child = spawn(process.execPath, ["-e", worker, dist, root, hash ? "recover" : "apply", boundary, hash, mode, evidence, JSON.stringify(options)], { stdio: ["ignore", "pipe", "pipe"] });
  let output = "", errors = "";
  child.stderr!.on("data", chunk => { errors += String(chunk); });
  const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(resolve => child.once("exit", (code, signal) => resolve({ code, signal })));
  const marker = await new Promise<{ pid: number; hash: string }>((resolve, reject) => {
    const timer = setTimeout(() => { child.kill("SIGKILL"); reject(Error(`owned child boundary timed out: ${errors}`)); }, 30000);
    child.once("error", error => { clearTimeout(timer); reject(error); });
    child.once("exit", () => { clearTimeout(timer); reject(Error(`owned child exited before marker: ${errors}`)); });
    child.stdout!.on("data", chunk => {
      output += String(chunk);
      if (output.includes("\n")) { clearTimeout(timer); resolve(JSON.parse(output.split("\n")[0])); }
    });
  });
  assert.equal(marker.pid, child.pid);
  const kill = async () => { child.kill("SIGKILL"); const result = await exited; assert.equal(result.signal, "SIGKILL"); };
  return { child, marker, kill };
}

async function interrupted(t: { after(fn: () => void): void }, boundary = "write:0") {
  const f = fixture(t), owned = await halted(f.root, boundary);
  await owned.kill();
  assert.equal(owned.marker.hash, f.plan.plan_hash);
  return f;
}

function approval(root: string, hash: string, mode: "resume" | "rollback"): string {
  const before = inventory(root), result = inspectGraphTransaction(root, hash);
  assert.deepEqual(inventory(root), before, "inspection must remain observational");
  assert.equal(result.recovery[mode].ready, true, JSON.stringify(result.recovery));
  assert.equal(result.recovery[mode].quiescence, "operator-confirmation-required");
  assert.match(result.recovery[mode].lock_evidence, /^sha256:[0-9a-f]{64}$/);
  return result.recovery[mode].lock_evidence;
}

for (const mode of ["resume", "rollback"] as const) for (const boundary of ["journal:applying", "write:0", "write:2", "write:5", "journal:applied"]) {
  test(`operator-confirmed killed writer ${mode} after ${boundary} preserves exact transaction bytes`, async t => {
    const f = await interrupted(t, boundary), control = graphControlSnapshot(f.root);
    const evidence = approval(f.root, f.plan.plan_hash, mode), before = inventory(f.root);
    assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, mode), /confirm-quiescent/);
    assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, mode, {}, { confirmQuiescent: true }), /exact fresh --lock-evidence/);
    assert.deepEqual(inventory(f.root), before);
    const result = f.run(["graph", "recover", f.plan.plan_hash, `--${mode}`, "--lock-evidence", evidence, "--confirm-quiescent", "--json"]);
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.equal(JSON.parse(result.stdout).state, mode === "resume" ? "applied" : "rolled-back");
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/write.lock")), false);
    for (const op of f.plan.writes) {
      const file = path.join(f.root, op.path), desired = mode === "resume" ? op.after : op.before;
      assert.equal(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null, desired, op.path);
    }
    const journal = JSON.parse(fs.readFileSync(path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`), "utf8"));
    assert.equal(journal.lock_epochs.length, 1);
    assert.equal(journal.lock_epochs[0].files.length, 2, "original owner and recovery approval remain journaled");
    assert.equal(journal.recovery_approvals[0].confirmation, "all-checkout-writers-stopped");
    assert.equal(journal.recovery_approvals[0].approval_hash, evidence);
    assert.equal(graphControlSnapshot(f.root).git_index, control.git_index);
    const terminal = inventory(f.root);
    continueGraphTransaction(f.root, f.plan.plan_hash, mode);
    assert.deepEqual(inventory(f.root), terminal, "terminal no-lock repeat must not write");
  });
}

for (const mode of ["resume", "rollback"] as const) for (const boundary of ["claim", `journal:${mode === "resume" ? "applying" : "rolling-back"}`, "write:1"]) {
  test(`killed ${mode} recovery at ${boundary} retains intent and supports a new bound approval`, async t => {
    const f = await interrupted(t), evidence = approval(f.root, f.plan.plan_hash, mode);
    const owned = await halted(f.root, boundary, f.plan.plan_hash, mode, evidence);
    await owned.kill();
    if (mode === "rollback") {
      const before = inventory(f.root), inspection = inspectGraphTransaction(f.root, f.plan.plan_hash);
      assert.equal(inspection.recovery.resume.ready, false);
      assert.match(inspection.recovery.resume.reason, /rollback was requested/);
      assert.deepEqual(inventory(f.root), before);
    }
    const next = approval(f.root, f.plan.plan_hash, mode);
    assert.notEqual(next, evidence);
    continueGraphTransaction(f.root, f.plan.plan_hash, mode, {}, { lockEvidence: next, confirmQuiescent: true });
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/write.lock")), false);
  });
}

test("a fresh normal-recovery epoch remains recoverable after a caught error then SIGKILL", async t => {
  const f = fixture(t);
  assert.throws(() => applyGraphMigrationPlan(f.root, f.plan, f.plan.plan_hash, { afterWrite: () => { throw Error("caught fixture error"); } }), /caught fixture/);
  assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/write.lock")), false);
  const owned = await halted(f.root, "write:1", f.plan.plan_hash);
  await owned.kill();
  const evidence = approval(f.root, f.plan.plan_hash, "resume");
  continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, { lockEvidence: evidence, confirmQuiescent: true });
  const journal = JSON.parse(fs.readFileSync(path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`), "utf8"));
  assert.equal(journal.lock_epochs.length, 2);
});

test("live and suspended owners refuse inspection approval and cannot be displaced", async t => {
  const f = fixture(t), owned = await halted(f.root, "write:0");
  try {
    for (const suspended of [false, true]) {
      if (suspended) owned.child.kill("SIGSTOP");
      const before = inventory(f.root), result = inspectGraphTransaction(f.root, f.plan.plan_hash);
      assert.equal(result.recovery.resume.ready, false);
      assert.match(result.recovery.resume.reason, /live, suspended or reused/);
      assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, { lockEvidence: `sha256:${"0".repeat(64)}`, confirmQuiescent: true }), /live, suspended or reused/);
      assert.deepEqual(inventory(f.root), before);
    }
  } finally { await owned.kill(); }
});

for (const mutation of ["journal-whitespace", "owned-before-to-after", "unknown-node", "unknown-lock-file", "legacy-owner", "partial-owner", "journal-temp", "invalid-utf8", "lock-mode"] as const) {
  test(`recovery approval refuses stale or insufficient ${mutation} evidence without writes`, async t => {
    const f = await interrupted(t), evidence = approval(f.root, f.plan.plan_hash, "resume");
    const journal = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
    const owner = path.join(f.root, ".mdkg/index/write.lock/owner.json");
    if (mutation === "journal-whitespace") fs.appendFileSync(journal, "\n");
    if (mutation === "owned-before-to-after") writeFile(path.join(f.root, f.plan.writes[2].path), f.plan.writes[2].after);
    if (mutation === "unknown-node") writeFile(path.join(f.root, ".mdkg/work/task-99-unknown.md"), "unknown authored bytes\n");
    if (mutation === "unknown-lock-file") writeFile(path.join(f.root, ".mdkg/index/write.lock/unknown.txt"), "unowned bytes\n");
    if (mutation === "legacy-owner") fs.writeFileSync(owner, JSON.stringify({ pid: 999999, created_at: "1970-01-01" }));
    if (mutation === "partial-owner") fs.writeFileSync(owner, '{"schema_version":');
    if (mutation === "journal-temp") fs.writeFileSync(`${journal}.interrupted.tmp`, "partial journal bytes\n");
    if (mutation === "invalid-utf8") fs.appendFileSync(journal, Buffer.from([0xff]));
    if (mutation === "lock-mode") fs.chmodSync(owner, 0o644);
    const before = inventory(f.root);
    assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, { lockEvidence: evidence, confirmQuiescent: true }));
    assert.deepEqual(inventory(f.root), before);
  });
}

test("ambiguous liveness and reused PID proof refuse even when other evidence is exact", async t => {
  const f = await interrupted(t), journalPath = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")), record = readMutationLock(f.root), before = inventory(f.root);
  const probe = t.mock.method(process, "kill", () => { throw Object.assign(Error("permission denied"), { code: "EPERM" }); });
  assert.throws(() => assertRecoveryLockEvidence(f.root, record, journal.lock_epochs[0], f.plan.plan_hash, identityHash(fs.readFileSync(journalPath)), "resume"), /ambiguous or inaccessible/);
  probe.mock.restore();
  const live = t.mock.method(process, "kill", () => true);
  assert.throws(() => assertRecoveryLockEvidence(f.root, record, journal.lock_epochs[0], f.plan.plan_hash, identityHash(fs.readFileSync(journalPath)), "resume"), /live, suspended or reused/);
  live.mock.restore(); assert.deepEqual(inventory(f.root), before);
});

test("complete legacy owner evidence is preserved but requires the new operator approval", async t => {
  const f = await interrupted(t), jp = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
  const ownerPath = path.join(f.root, ".mdkg/index/write.lock/owner.json");
  const owner = JSON.parse(fs.readFileSync(ownerPath, "utf8"));
  owner.schema_version = 1;
  owner.environment = { platform: "historical-fixture", boot_hash: "untrusted-historical-only" };
  const originalOwner = JSON.stringify(owner, null, 2) + "\n";
  fs.writeFileSync(ownerPath, originalOwner);
  const journal = JSON.parse(fs.readFileSync(jp, "utf8"));
  journal.lock_epochs[0] = readMutationLock(f.root);
  fs.writeFileSync(jp, JSON.stringify(journal, null, 2) + "\n");
  const evidence = approval(f.root, f.plan.plan_hash, "resume"), before = inventory(f.root);
  assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, evidence), /confirm-quiescent/);
  assert.deepEqual(inventory(f.root), before);
  continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, { lockEvidence: evidence, confirmQuiescent: true });
  const completed = JSON.parse(fs.readFileSync(jp, "utf8"));
  assert.equal(completed.lock_epochs[0].files.find((file: any) => file.name === "owner.json").content, originalOwner);
  const claim = JSON.parse(completed.lock_epochs[0].files.find((file: any) => file.name.startsWith("claim-")).content);
  assert.equal(claim.schema_version, 2);
  assert.equal(claim.recovery_contract, "operator-confirmed-quiescence-v1");
  assert.equal(claim.confirmation, "all-checkout-writers-stopped");
});

test("a malformed portable recovery assertion never becomes recovery authority", async t => {
  const f = await interrupted(t), evidence = approval(f.root, f.plan.plan_hash, "resume");
  const owned = await halted(f.root, "claim", f.plan.plan_hash, "resume", evidence);
  await owned.kill();
  const lock = path.join(f.root, ".mdkg/index/write.lock"), claimPath = path.join(lock, fs.readdirSync(lock).find(file => file.startsWith("claim-"))!);
  const claim = JSON.parse(fs.readFileSync(claimPath, "utf8"));
  claim.confirmation = "PID-was-absent";
  fs.writeFileSync(claimPath, JSON.stringify(claim));
  const before = inventory(f.root), inspection = inspectGraphTransaction(f.root, f.plan.plan_hash);
  assert.equal(inspection.recovery.resume.ready, false);
  assert.match(inspection.recovery.resume.reason, /complete evidence binding/);
  assert.throws(() => continueGraphTransaction(f.root, f.plan.plan_hash, "resume", {}, { lockEvidence: evidence, confirmQuiescent: true }), /complete evidence binding/);
  assert.deepEqual(inventory(f.root), before);
});

for (const changed of ["checkout", "directory-epoch"] as const) {
  test(`recovery refuses foreign ${changed} proof`, async t => {
    const f = await interrupted(t), jp = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
    const journal = JSON.parse(fs.readFileSync(jp, "utf8")), record = readMutationLock(f.root);
    const base = record.files.find((file: any) => file.name === "owner.json"), owner = JSON.parse(base.content);
    if (changed === "checkout") owner.checkout.path_hash = `sha256:${"0".repeat(64)}`;
    if (changed !== "directory-epoch") { base.content = JSON.stringify(owner); journal.lock_epochs[0] = record; }
    else journal.lock_epochs[0].directory.inode = "0";
    const before = inventory(f.root);
    assert.throws(() => assertRecoveryLockEvidence(f.root, record, journal.lock_epochs[0], f.plan.plan_hash, identityHash(fs.readFileSync(jp)), "resume"), /different checkout|does not bind/);
    assert.deepEqual(inventory(f.root), before);
  });
}

test("journal replacement during a transaction is preserved and stops later owned writes", t => {
  const f = fixture(t), jp = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
  let replaced = "";
  assert.throws(() => applyGraphMigrationPlan(f.root, f.plan, f.plan.plan_hash, { afterWrite: (_p: string, i: number) => {
    if (i === 0) { fs.appendFileSync(jp, "\n"); replaced = fs.readFileSync(jp, "utf8"); }
  } }), /journal byte custody/);
  assert.equal(fs.readFileSync(jp, "utf8"), replaced);
  for (const op of f.plan.writes.slice(1)) assert.equal(fs.existsSync(path.join(f.root, op.path)) ? fs.readFileSync(path.join(f.root, op.path), "utf8") : null, op.before);
});

test("a new unknown journal entry between owned writes stops the next mutation", t => {
  const f = fixture(t), unexpected = path.join(f.root, ".mdkg/state/identity-transactions/unowned.tmp");
  assert.throws(() => applyGraphMigrationPlan(f.root, f.plan, f.plan.plan_hash, { afterWrite: (_p: string, i: number) => {
    if (i === 0) fs.writeFileSync(unexpected, "unowned interrupted journal\n");
  } }), /journal.*custody|unclassifiable graph journal/);
  assert.equal(fs.readFileSync(unexpected, "utf8"), "unowned interrupted journal\n");
  for (const op of f.plan.writes.slice(1)) assert.equal(fs.existsSync(path.join(f.root, op.path)) ? fs.readFileSync(path.join(f.root, op.path), "utf8") : null, op.before);
});

test("changed other terminal journal bytes invalidate custody during apply", t => {
  const f = fixture(t);
  applyGraphMigrationPlan(f.root, f.plan, f.plan.plan_hash);
  recoverOwnedFixture(f.root, f.plan.plan_hash, "rollback");
  const previous = path.join(f.root, `.mdkg/state/identity-transactions/${f.plan.plan_hash.slice(7)}.json`);
  const expected = fs.readFileSync(previous, "utf8") + "\n";
  const plan = planLegacyIdentityMigration(f.root, { ...parameters, graphId: "12a5dbb3-fb65-4b82-8170-75bcd8e8ace7" });
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, { afterWrite: (_p: string, i: number) => {
    if (i === 0) fs.writeFileSync(previous, expected);
  } }), /journal.*custody/);
  assert.equal(fs.readFileSync(previous, "utf8"), expected);
  for (const op of plan.writes.slice(1)) assert.equal(fs.existsSync(path.join(f.root, op.path)) ? fs.readFileSync(path.join(f.root, op.path), "utf8") : null, op.before);
});

for (const mode of ["resume", "rollback"] as const) test(`terminal ${mode} inspection cannot promise recovery of nonterminal owned bytes`, t => {
  const f = fixture(t);
  applyGraphMigrationPlan(f.root, f.plan, f.plan.plan_hash);
  if (mode === "rollback") recoverOwnedFixture(f.root, f.plan.plan_hash, "rollback");
  const op = f.plan.writes.find((entry: any) => entry.path.startsWith(".mdkg/work/"));
  fs.writeFileSync(path.join(f.root, op.path), mode === "resume" ? op.before : op.after);
  const before = inventory(f.root), inspection = inspectGraphTransaction(f.root, f.plan.plan_hash);
  assert.equal(inspection.recovery[mode].ready, false);
  assert.match(inspection.recovery[mode].reason, /terminal bytes/);
  assert.deepEqual(inventory(f.root), before);
});

test("simultaneous opposite recovery modes have one owner and one terminal outcome", async t => {
  const f = await interrupted(t);
  const approvals = { resume: approval(f.root, f.plan.plan_hash, "resume"), rollback: approval(f.root, f.plan.plan_hash, "rollback") };
  const results = await Promise.all((["resume", "rollback"] as const).map(mode => new Promise<{ mode: string; code: number | null; output: string }>(resolve => {
    const child = spawn(process.execPath, [cli, "graph", "recover", f.plan.plan_hash, `--${mode}`, "--lock-evidence", approvals[mode], "--confirm-quiescent", "--json"], { cwd: f.root });
    let output = ""; child.stdout!.on("data", chunk => { output += String(chunk); }); child.stderr!.on("data", chunk => { output += String(chunk); });
    child.once("exit", code => resolve({ mode, code, output }));
  })));
  assert.equal(results.filter(result => result.code === 0).length, 1, JSON.stringify(results));
  const winner = results.find(result => result.code === 0)!;
  assert.equal(inspectGraphTransaction(f.root, f.plan.plan_hash).state, winner.mode === "resume" ? "applied" : "rolled-back");
  assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/write.lock")), false);
});

test("native linked worktrees retain independent lock authority, graph writes and Git indexes", async t => {
  const f = fixture(t);
  const git = (cwd: string, args: string[]) => {
    const r = spawnSync("git", ["--no-optional-locks", "-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
      "-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], { cwd, encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  };
  git(f.root, ["init", "-q", "-b", "main"]);
  git(f.root, ["add", "--", ".mdkg/config.json", ".mdkg/templates", ".mdkg/core", ".mdkg/work"]);
  git(f.root, ["commit", "-qm", "synthetic common graph"]);
  const ancestor = git(f.root, ["rev-parse", "HEAD"]), peer = path.join(f.root, "peer");
  git(f.root, ["worktree", "add", "-q", "-b", "peer", peer]);
  const initialA = graphControlSnapshot(f.root), initialB = graphControlSnapshot(peer);
  const options = { ...parameters, ancestor }, plan = planLegacyIdentityMigration(f.root, options);
  const owned = await halted(f.root, "write:0", "", "resume", "", options);
  await owned.kill();
  const peerWrite = spawnSync(process.execPath, [cli, "new", "task", "Independent peer addition", "--json"], { cwd: peer, encoding: "utf8" });
  assert.equal(peerWrite.status, 0, peerWrite.stderr);
  const journal = `.mdkg/state/identity-transactions/${plan.plan_hash.slice(7)}.json`;
  writeFile(path.join(peer, journal), fs.readFileSync(path.join(f.root, journal), "utf8"));
  fs.cpSync(path.join(f.root, ".mdkg/index/write.lock"), path.join(peer, ".mdkg/index/write.lock"), { recursive: true });
  const peerBefore = inventory(peer), peerReview = inspectGraphTransaction(peer, plan.plan_hash);
  assert.equal(peerReview.recovery.resume.ready, false);
  assert.throws(() => continueGraphTransaction(peer, plan.plan_hash, "resume", {}, { lockEvidence: `sha256:${"0".repeat(64)}`, confirmQuiescent: true }));
  assert.deepEqual(inventory(peer), peerBefore);
  const evidence = approval(f.root, plan.plan_hash, "resume");
  continueGraphTransaction(f.root, plan.plan_hash, "resume", {}, { lockEvidence: evidence, confirmQuiescent: true });
  assert.deepEqual(inventory(peer), peerBefore, "recovery must never retire another checkout's lock");
  assert.equal(graphControlSnapshot(f.root).git_index, initialA.git_index);
  assert.equal(graphControlSnapshot(peer).git_index, initialB.git_index);
});
