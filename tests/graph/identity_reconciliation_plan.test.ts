import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
import { reviewedFixtureRecovery } from "../helpers/identity_recovery";
const { canonicalJson, createGraphFormat, identityHash, identityRef } = require("../../graph/identity");
const { reconciliationAcceptancePath } = require("../../graph/identity_acceptance");
const { planIdentityReconciliation } = require("../../graph/identity_reconciliation_plan");
const transaction = require("../../graph/identity_transaction");
const { applyGraphMigrationPlan, inspectGraphTransaction } = transaction;
const continueGraphTransaction = reviewedFixtureRecovery(transaction);
const { readAuthoredSnapshot, graphControlSnapshot } = require("../../graph/identity_snapshot");
const cli = path.resolve(__dirname, "../../cli.js");
const GRAPH = "e7403372-f270-4cd7-902d-64b792c781df";

function bytes(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) result[path.relative(root, file)] = fs.readFileSync(file).toString("base64");
    }
  };
  walk(root);
  return result;
}

function fixture() {
  const root = makeTempDir("mdkg-reconciliation-");
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat(GRAPH)));
  writeFile(path.join(root, ".gitignore"), ".mdkg/index/\n.mdkg/state/\n.mdkg/events/\n.mdkg/cache/\n");
  const git = (args: string[]) => {
    const result = spawnSync("git", ["-c", "user.name=mdkg test", "-c", "user.email=mdkg-test@example.invalid", ...args], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return result.stdout.trim();
  };
  const run = (args: string[]) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  };
  const add = (title: string, id: string, refs?: string) => {
    const node = run(["new", "task", title, "--status", "todo", "--priority", "3", ...(refs ? ["--refs", refs] : []), "--json"]).node;
    // One physical test checkout keeps its allocation cache across branch
    // switches. Model independently allocated aliases while retaining the real
    // CLI-authored random identity and all proven reference bindings.
    if (node.id !== id) {
      const nextPath = node.path.replace(`${node.id}-`, `${id}-`);
      const original = path.join(root, node.path);
      writeFile(original, fs.readFileSync(original, "utf8").replace(`id: ${node.id}\n`, `id: ${id}\n`));
      fs.renameSync(original, path.join(root, nextPath));
      return { ...node, id, path: nextPath };
    }
    return node;
  };
  const common = add("Common", "task-1");
  git(["init", "-b", "main"]); git(["add", "--", ".gitignore", ".mdkg/config.json", ".mdkg/graph.json", ".mdkg/templates", ".mdkg/core", ".mdkg/work"]);
  git(["commit", "-m", "common identity"]);
  const base = git(["rev-parse", "HEAD"]);
  const commit = (files: string[], title: string) => { git(["add", "--", ...files]); git(["commit", "-m", title]); return git(["rev-parse", "HEAD"]); };
  const edit = (file: string, before: string, after: string) => {
    const content = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(content.includes(before), `fixture edit missing ${before}`);
    writeFile(path.join(root, file), content.replace(before, after));
  };
  return { root, git, run, add, base, common, commit, edit };
}

test("reviewed local branch plan applies cross-linked identities without Git staging or source transplant", t => {
  const f = fixture();
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  f.git(["checkout", "-b", "incoming"]);
  const first = f.add("Incoming first", "task-2");
  const second = f.run(["new", "task", "Incoming linked", "--status", "todo", "--priority", "3",
    "--parent", first.id, "--refs", first.id, "--json"]).node;
  writeFile(path.join(f.root, "source.txt"), "incoming product change stays excluded\n");
  const incoming = f.commit([first.path, second.path, "source.txt"], "incoming graph and excluded source");
  f.git(["checkout", "main"]);
  const target = f.add("Target alias", "task-2");
  f.commit([target.path], "target alias");
  const untracked = f.add("Uncommitted target", "task-4");
  const before = bytes(f.root);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.deepEqual(plan.blocking, []);
  assert.equal(plan.plan_hash, planIdentityReconciliation(f.root, { ancestor: f.base, incoming }).plan_hash);
  assert.deepEqual(bytes(f.root), before, "preview does not touch Git/index/cache or authored bytes");
  assert.match(plan.path_manifest.find((entry: any) => entry.path === "source.txt").treatment, /excluded/);
  const control = graphControlSnapshot(f.root);
  assert.equal(applyGraphMigrationPlan(f.root, plan, plan.plan_hash).state, "applied");
  assert.deepEqual(graphControlSnapshot(f.root), control);
  assert.equal(fs.existsSync(path.join(f.root, "source.txt")), false);
  assert.equal(f.git(["diff", "--cached", "--name-only"]), "");
  assert.ok(fs.existsSync(path.join(f.root, untracked.path)));
  const snapshot = readAuthoredSnapshot(f.root);
  assert.equal(snapshot.nodes.length, 5);
  const receipt = JSON.parse(fs.readFileSync(path.join(f.root, plan.receipt_path), "utf8"));
  const mapped = receipt.mappings.find((entry: any) => entry.incoming?.path === first.path);
  assert.equal(mapped.output.alias, "root:task-5");
  const linked = snapshot.nodes.find((entry: any) => entry.node.title === "Incoming linked");
  assert.ok(linked.content.includes(mapped.stable_ref));
  const repeatBefore = bytes(f.root);
  const repeated = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.equal(repeated.replay.noop, true); assert.deepEqual(repeated.writes, []);
  assert.equal(applyGraphMigrationPlan(f.root, repeated, repeated.plan_hash).action, "graph.reconcile.noop");
  assert.deepEqual(bytes(f.root), repeatBefore);
  // Export the persisted result after replay, not a synthetic mapping. The
  // incoming numeric alias changed; its stable cross-link must not change.
  for (const format of ["json", "md", "xml", "toon"]) {
    const out = path.join(f.root, `reconciled.${format}`);
    const exported = spawnSync(process.execPath, [cli, "pack", identityRef(linked.node.identity),
      "--pack-profile", "headers", "--skills", "none", "--format", format, "--out", out],
    { cwd: f.root, encoding: "utf8" });
    assert.equal(exported.status, 0, exported.stderr || exported.stdout);
    const raw = fs.readFileSync(out, "utf8");
    assert.ok(raw.includes(identityRef(linked.node.identity)));
    assert.ok(raw.includes(mapped.stable_ref));
    if (format === "json" || format === "toon") {
      const payload = JSON.parse(raw), node = payload.nodes[0];
      assert.deepEqual(node.identity, linked.node.identity);
      assert.ok(node.frontmatter.refs.includes(mapped.output.alias));
      assert.equal(payload.nodes.find((item: any) => item.qid === mapped.output.alias).stable_ref, mapped.stable_ref);
    }
  }
  assert.equal(f.git(["diff", "--cached", "--name-only"]), "");
});

test("same identity lifecycle conflicts require a reasoned decision and unchanged reviewed plan", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  f.edit(f.common.path, "status: todo", "status: done");
  const incoming = f.commit([f.common.path], "incoming done");
  f.git(["checkout", "main"]);
  f.edit(f.common.path, "status: todo", "status: progress");
  const options = { ancestor: f.base, incoming };
  const blocked = planIdentityReconciliation(f.root, options);
  assert.ok(blocked.blocking.length > 0);
  const unchanged = bytes(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, blocked, blocked.plan_hash), /blocked/);
  assert.deepEqual(bytes(f.root), unchanged);
  const ref = identityRef(readAuthoredSnapshot(f.root).nodes[0].node.identity);
  const plan = planIdentityReconciliation(f.root, { ...options, decisions: { [ref]: { take: "target", reason: "Target owns current execution lifecycle" } } });
  assert.deepEqual(plan.blocking, []);
  f.edit(f.common.path, "priority: 3", "priority: 2");
  const moved = bytes(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /stale graph plan/);
  assert.deepEqual(bytes(f.root), moved);
});

test("committed reconciliation then Git revert is not silently resurrected on replay", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Revertible incoming", "task-2");
  const incoming = f.commit([added.path], "incoming identity");
  f.git(["checkout", "main"]);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  const integrated = f.commit(plan.writes.map((entry: any) => entry.path), "reviewed semantic integration");
  f.git(["revert", "--no-edit", integrated]);
  const before = bytes(f.root);
  const replay = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.equal(replay.replay.noop, true);
  assert.ok(replay.replay.receipt_path);
  assert.deepEqual(replay.writes, []);
  applyGraphMigrationPlan(f.root, replay, replay.plan_hash);
  assert.deepEqual(bytes(f.root), before);
  assert.equal(readAuthoredSnapshot(f.root).nodes.length, 1);
  const ref = identityRef(readAuthoredSnapshot(f.root, incoming).nodes.find((entry: any) => entry.path === added.path).node.identity);
  const intentional = planIdentityReconciliation(f.root, { ancestor: f.base, incoming,
    decisions: { [ref]: { take: "incoming", reason: "Explicitly reinstate the reviewed reverted identity" } } });
  assert.deepEqual(intentional.blocking, []);
  assert.equal(intentional.classifications.find((entry: any) => entry.stable_ref === ref).outcome, "explicit-incoming");
  applyGraphMigrationPlan(f.root, intentional, intentional.plan_hash);
  assert.equal(readAuthoredSnapshot(f.root).nodes.length, 2);
});

test("cherry-picked then reverted identity needs an explicit reintroduction decision without a semantic receipt", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Cherry picked identity", "task-2");
  const incoming = f.commit([added.path], "incoming identity");
  f.git(["checkout", "main"]);
  writeFile(path.join(f.root, "target-only.txt"), "unrelated target commit\n");
  f.commit(["target-only.txt"], "target diverges");
  f.git(["cherry-pick", incoming]);
  f.git(["revert", "--no-edit", "HEAD"]);
  const before = bytes(f.root);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.ok(plan.blocking.some((entry: string) => /reintroduc/.test(entry)), JSON.stringify(plan.blocking));
  assert.equal(plan.replay.previously_present.length, 1);
  assert.deepEqual(bytes(f.root), before);
});

test("successive incoming revision uses the accepted semantic base and preserves target later edits", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Incoming evolving", "task-2");
  const first = f.commit([added.path], "first incoming");
  f.git(["checkout", "main"]);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming: first });
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  f.commit(plan.writes.map((entry: any) => entry.path), "accept first");
  fs.rmSync(path.join(f.root, ".mdkg/state/identity-transactions"), { recursive: true });
  f.edit(added.path, "priority: 3", "priority: 2");
  f.commit([added.path], "target priority decision");
  f.git(["checkout", "incoming"]);
  f.edit(added.path, "title: Incoming evolving", "title: Incoming evolved");
  const second = f.commit([added.path], "second incoming");
  f.git(["checkout", "main"]);
  const next = planIdentityReconciliation(f.root, { ancestor: f.base, incoming: second });
  assert.deepEqual(next.blocking, []);
  assert.equal(next.semantic_base.revision, first);
  applyGraphMigrationPlan(f.root, next, next.plan_hash);
  const content = fs.readFileSync(path.join(f.root, added.path), "utf8");
  assert.ok(content.includes("priority: 2")); assert.ok(content.includes("title: Incoming evolved"));
});

for (const continuation of ["clone", "renamed-branch"]) {
  test(`accepted reconciliation survives pre-commit authored edits in ${continuation}`, (t) => {
    const f = fixture();
    t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
    f.git(["checkout", "-b", "incoming"]);
    f.edit(f.common.path, "status: todo", "status: done");
    const incoming = f.commit([f.common.path], "incoming done");
    f.git(["checkout", "main"]);
    f.edit(f.common.path, "status: todo", "status: progress");
    f.commit([f.common.path], "target progress");
    const ref = identityRef(readAuthoredSnapshot(f.root).nodes[0].node.identity);
    const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming,
      decisions: { [ref]: { take: "target", reason: "Keep target lifecycle" } } });
    applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
    f.edit(f.common.path, "status: progress", "status: todo");
    let target = f.root;
    if (continuation === "clone") {
      f.commit([...plan.writes.map((entry: any) => entry.path), f.common.path], "accept then revise before first commit");
      target = makeTempDir("mdkg-reconciliation-clone-");
      t.after(() => fs.rmSync(target, { recursive: true, force: true }));
      f.git(["clone", "--no-hardlinks", "--no-local", f.root, target]);
    } else {
      f.git(["branch", "-m", "renamed-target"]);
    }
    const before = bytes(target);
    const replay = planIdentityReconciliation(target, { ancestor: f.base, incoming });
    assert.equal(replay.replay.noop, true, "accepted choices survive later authored edits without a local journal");
    assert.deepEqual(replay.writes, []);
    assert.match(fs.readFileSync(path.join(target, f.common.path), "utf8"), /status: todo/);
    assert.deepEqual(bytes(target), before);
  });
}

test("reconciliation recovery preserves unknown work and resumes exact reviewed owned bytes", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Incoming recoverable", "task-2");
  const incoming = f.commit([added.path], "incoming");
  f.git(["checkout", "main"]);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, { afterWrite: () => { throw new Error("fixture interruption"); } }), /fixture interruption/);
  const partial = bytes(f.root);
  const inspected = inspectGraphTransaction(f.root, plan.plan_hash);
  assert.deepEqual(inspected.completed_write_paths, [plan.writes[0].path]);
  assert.deepEqual(inspected.collision_paths, []);
  assert.deepEqual(bytes(f.root), partial);
  assert.throws(() => planIdentityReconciliation(f.root, { ancestor: f.base, incoming }), /unfinished/);
  const changedPath = plan.writes[0].path;
  const owned = fs.readFileSync(path.join(f.root, changedPath), "utf8");
  writeFile(path.join(f.root, changedPath), `${owned}\nUnowned concurrent bytes\n`);
  const before = bytes(f.root);
  assert.throws(() => continueGraphTransaction(f.root, plan.plan_hash, "resume"), /custody collision|malformed identity evidence/);
  assert.deepEqual(bytes(f.root), before);
  writeFile(path.join(f.root, changedPath), owned); // Test owner withdraws only its injected collision.
  assert.equal(continueGraphTransaction(f.root, plan.plan_hash, "resume").state, "applied");
  assert.equal(f.git(["diff", "--cached", "--name-only"]), "");
});

test("public CLI preview and exact-hash apply preserve existing staged user work", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("CLI incoming", "task-2");
  const incoming = f.commit([added.path], "incoming");
  f.git(["checkout", "main"]);
  writeFile(path.join(f.root, "user-notes.txt"), "staged user bytes\n");
  f.git(["add", "--", "user-notes.txt"]);
  const before = bytes(f.root);
  const args = ["graph", "reconcile", "--ancestor", f.base, "--incoming", incoming, "--json"];
  const plan = f.run(args);
  assert.equal(plan.safe_to_apply, true);
  assert.equal(plan.writes[0].after, undefined, "public output omits raw receipt/node bodies");
  assert.deepEqual(bytes(f.root), before);
  const invalid = spawnSync(process.execPath, [cli, ...args, "--apply", "--plan-hash", `sha256:${"0".repeat(64)}`], { cwd: f.root, encoding: "utf8" });
  assert.notEqual(invalid.status, 0); assert.match(invalid.stderr, /exact unchanged reviewed plan hash/);
  assert.deepEqual(bytes(f.root), before);
  assert.equal(f.run([...args, "--apply", "--plan-hash", plan.plan_hash]).state, "applied");
  assert.equal(f.git(["diff", "--cached", "--name-only"]), "user-notes.txt");
  assert.equal(fs.readFileSync(path.join(f.root, "user-notes.txt"), "utf8"), "staged user bytes\n");
});

test("historical archive sidecar cannot be applied without exact local payload dependency", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  writeFile(path.join(f.root, "evidence.txt"), "immutable historical proof\n");
  f.run(["archive", "add", "evidence.txt", "--id", "archive.proof", "--title", "Historical proof", "--json"]);
  const archive = readAuthoredSnapshot(f.root).nodes.find((entry: any) => entry.node.type === "archive");
  assert.ok(archive);
  const zipPath = path.posix.join(path.posix.dirname(archive.path), archive.node.attributes.compressed_path);
  const zipBytes = fs.readFileSync(path.join(f.root, zipPath));
  const incoming = f.commit([archive.path, zipPath], "historical archive and cache");
  f.git(["checkout", "main"]);
  const before = bytes(f.root);
  const blocked = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.ok(blocked.blocking.some((entry: string) => /archive dependency/.test(entry)), JSON.stringify(blocked.blocking));
  assert.deepEqual(bytes(f.root), before);
  assert.ok(blocked.path_manifest.some((entry: any) => entry.path === zipPath && /excluded/.test(entry.treatment)));
  fs.mkdirSync(path.dirname(path.join(f.root, zipPath)), { recursive: true });
  fs.writeFileSync(path.join(f.root, zipPath), zipBytes); // Separate fixture-owned exact artifact transfer, not reconciliation.
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.deepEqual(plan.blocking, []);
  assert.ok(plan.dependency_files[zipPath]);
  fs.writeFileSync(path.join(f.root, zipPath), "changed cache bytes");
  const moved = bytes(f.root);
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash), /dependency baseline moved/);
  assert.deepEqual(bytes(f.root), moved);
  fs.writeFileSync(path.join(f.root, zipPath), zipBytes);
  assert.equal(applyGraphMigrationPlan(f.root, plan, plan.plan_hash).state, "applied");
  assert.deepEqual(fs.readFileSync(path.join(f.root, zipPath)), zipBytes);
});

test("interrupted reconciliation rolls back authored paths without changing Git or input identities", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Rollback incoming", "task-2");
  const incoming = f.commit([added.path], "incoming");
  f.git(["checkout", "main"]);
  const original = readAuthoredSnapshot(f.root);
  const control = graphControlSnapshot(f.root);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.throws(() => applyGraphMigrationPlan(f.root, plan, plan.plan_hash, { afterWrite: (_file: string, index: number) => {
    if (index === plan.writes.length - 1) throw new Error("fixture final write interruption");
  } }), /fixture final write interruption/);
  assert.equal(continueGraphTransaction(f.root, plan.plan_hash, "rollback").state, "rolled-back");
  assert.equal(readAuthoredSnapshot(f.root).tree_hash, original.tree_hash);
  assert.deepEqual(graphControlSnapshot(f.root), control);
  assert.equal(continueGraphTransaction(f.root, plan.plan_hash, "rollback").state, "rolled-back");
});

for (const placement of ["working-tree", "committed", "transported", "transported-binding", "transported-reverted"]) {
  for (const claim of ["base", "replay"]) {
    test(`unapplied self-hashed ${claim} receipt is inert in ${placement} evidence`, (t) => {
      const f = fixture();
      t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
      f.git(["checkout", "-b", "incoming"]);
      f.edit(f.common.path, "status: todo", "status: progress");
      const intermediate = f.commit([f.common.path], "incoming intermediate lifecycle");
      f.edit(f.common.path, "status: progress", "status: done");
      const incoming = f.commit([f.common.path], "incoming completed lifecycle");
      f.git(["checkout", "main"]);
      f.edit(f.common.path, "status: todo", "status: progress");
      f.commit([f.common.path], "target independent lifecycle");
      const ref = identityRef(readAuthoredSnapshot(f.root).nodes[0].node.identity);
      // A genuine, internally consistent preview is still not an application.
      // In the replay case even its target/output hashes and mappings agree.
      const unaccepted = planIdentityReconciliation(f.root, { ancestor: f.base,
        incoming: claim === "base" ? intermediate : incoming,
        ...(claim === "replay" ? { decisions: { [ref]: { take: "target", reason: "Unapproved receipt claim" } } } : {}),
      });
      assert.deepEqual(unaccepted.blocking, []);
      const evidence = unaccepted.writes.find((entry: any) => entry.path === unaccepted.receipt_path);
      assert.ok(evidence?.after);
      if (placement.startsWith("transported")) {
        f.git(["checkout", "-b", "receipt-only", f.base]);
        writeFile(path.join(f.root, evidence.path), evidence.after);
        const incomingFiles = [evidence.path];
        if (placement === "transported-binding") {
          const binding = unaccepted.writes.find((entry: any) => entry.path === reconciliationAcceptancePath(evidence.path));
          assert.ok(binding?.after);
          writeFile(path.join(f.root, binding.path), binding.after);
          incomingFiles.push(binding.path);
        }
        const receiptBranch = f.commit(incomingFiles, "transport an unaccepted receipt");
        f.git(["checkout", "main"]);
        const transport = planIdentityReconciliation(f.root, { ancestor: f.base, incoming: receiptBranch });
        assert.deepEqual(transport.blocking, []);
        applyGraphMigrationPlan(f.root, transport, transport.plan_hash);
        if (placement === "transported-binding") {
          assert.equal(fs.existsSync(path.join(f.root, reconciliationAcceptancePath(evidence.path))), false);
          const binding = unaccepted.writes.find((entry: any) => entry.path === reconciliationAcceptancePath(evidence.path));
          const inert = `.mdkg/identity/transported/${identityHash(binding.after).slice(7)}.json`;
          assert.equal(fs.readFileSync(path.join(f.root, inert), "utf8"), binding.after, "transport preserves exact inert binding bytes");
        }
        const acceptedTransport = f.commit(transport.writes.map((entry: any) => entry.path), "accept evidence transport only");
        if (placement === "transported-reverted") f.git(["revert", "--no-edit", acceptedTransport]);
      } else {
        writeFile(path.join(f.root, evidence.path), evidence.after);
        if (placement === "committed") f.commit([evidence.path], "retain receipt bytes only");
      }
      const before = bytes(f.root);
      const planned = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
      assert.equal(planned.semantic_base.revision, f.base, "receipt consistency is not target acceptance");
      assert.equal(planned.replay.noop, false, "unaccepted evidence must not suppress integration");
      assert.ok(planned.blocking.length > 0, "real ancestor requires a lifecycle decision");
      assert.deepEqual(bytes(f.root), before, "preview is observational even with adversarial provenance");
    });
  }
}

test("pre-binding v2 receipts use only their own applied local journal, not their self-hash", (t) => {
  const f = fixture();
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Legacy accepted input", "task-2");
  const incoming = f.commit([added.path], "incoming node");
  f.git(["checkout", "main"]);
  const { plan_hash: _hash, ...preview } = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  preview.writes = preview.writes.filter((entry: any) => entry.path !== reconciliationAcceptancePath(preview.receipt_path));
  const legacy = { ...preview, plan_hash: identityHash(canonicalJson(preview)) };
  applyGraphMigrationPlan(f.root, legacy, legacy.plan_hash);
  assert.equal(planIdentityReconciliation(f.root, { ancestor: f.base, incoming }).replay.noop, true);
  f.commit(legacy.writes.map((entry: any) => entry.path), "legacy integration without binding");
  fs.rmSync(path.join(f.root, ".mdkg/state/identity-transactions"), { recursive: true });
  const unproven = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  assert.equal(unproven.replay.noop, false, "receipt-only Git history is not retrospectively attested");
  assert.equal(unproven.semantic_base.revision, f.base);
});

test("independent fork keeps foreign acceptance bytes inert even without their source Git objects", (t) => {
  const f = fixture();
  const fork = makeTempDir("mdkg-reconciliation-fork-");
  t.after(() => { fs.rmSync(f.root, { recursive: true, force: true }); fs.rmSync(fork, { recursive: true, force: true }); });
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Accepted source graph node", "task-2");
  const incoming = f.commit([added.path], "incoming node");
  f.git(["checkout", "main"]);
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming });
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  const source = readAuthoredSnapshot(f.root);
  const entries = new Map<string, Buffer>(Object.keys(source.files).map((file) => [file, fs.readFileSync(path.join(f.root, file))]));
  const { planTransportIdentity } = require("../../graph/identity_transport");
  const transport = planTransportIdentity(entries, "fork", source.tree_hash);
  writeDefaultTemplates(fork);
  for (const [file, content] of entries) writeFile(path.join(fork, file), (transport.replacements.get(file) ?? content).toString("utf8"));
  for (const [file, content] of transport.additions as Map<string, Buffer>) writeFile(path.join(fork, file), content.toString("utf8"));
  assert.equal(fs.readFileSync(path.join(fork, plan.receipt_path), "utf8"), fs.readFileSync(path.join(f.root, plan.receipt_path), "utf8"));
  const git = (args: string[]) => {
    const result = spawnSync("git", ["-c", "user.name=mdkg test", "-c", "user.email=mdkg-test@example.invalid", ...args], { cwd: fork, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git(["init", "-b", "main"]);
  git(["add", "--", ".mdkg/config.json", ".mdkg/graph.json", ".mdkg/identity", ".mdkg/work", ".mdkg/templates"]);
  git(["commit", "-m", "independent fork seed"]);
  const base = git(["rev-parse", "HEAD"]);
  const before = bytes(fork);
  const preview = planIdentityReconciliation(fork, { ancestor: base, incoming: base });
  assert.deepEqual(preview.blocking, []);
  assert.equal(preview.semantic_base.revision, base);
  assert.equal(preview.semantic_base.receipt_path, null);
  assert.deepEqual(bytes(fork), before);
});

test("target acceptance tampering fails before planning writes", (t) => {
  const f = fixture();
  t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const plan = planIdentityReconciliation(f.root, { ancestor: f.base, incoming: f.base });
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  const bindingPath = path.join(f.root, reconciliationAcceptancePath(plan.receipt_path));
  const binding = JSON.parse(fs.readFileSync(bindingPath, "utf8"));
  binding.receipt_hash = `sha256:${"f".repeat(64)}`;
  writeFile(bindingPath, JSON.stringify(binding));
  const before = bytes(f.root);
  assert.throws(() => planIdentityReconciliation(f.root, { ancestor: f.base, incoming: f.base }), /target acceptance does not bind/);
  assert.deepEqual(bytes(f.root), before);
});

test("unverified provenance and nonancestor input are refused without any writes", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Untrusted provenance input", "task-2");
  const incoming = f.commit([added.path], "incoming");
  f.git(["checkout", "main"]);
  const before = bytes(f.root);
  assert.throws(() => planIdentityReconciliation(f.root, { ancestor: incoming, incoming }), /accepted --ancestor/);
  assert.deepEqual(bytes(f.root), before);
  writeFile(path.join(f.root, `.mdkg/identity/reconciliations/${"f".repeat(64)}.json`), JSON.stringify({
    schema_version: 1, kind: "graph-identity-reconciliation", graph_id: GRAPH,
    incoming: { revision: incoming, tree_hash: readAuthoredSnapshot(f.root, incoming).tree_hash }, mappings: [], classifications: [],
  }));
  const unverified = bytes(f.root);
  assert.throws(() => planIdentityReconciliation(f.root, { ancestor: f.base, incoming }), /unverified reconciliation provenance/);
  assert.deepEqual(bytes(f.root), unverified);
});

test("reconciliation validates mounted source identity but never mutates its graph or bundle", () => {
  const f = fixture();
  const child = fixture();
  const childGraph = "abdd32d5-e359-4908-a0fe-8d921f2f0186";
  writeFile(path.join(child.root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat(childGraph)));
  child.edit(child.common.path, `graph_id: ${GRAPH}`, `graph_id: ${childGraph}`);
  const foreign = identityRef(readAuthoredSnapshot(child.root).nodes[0].node.identity);
  child.run(["bundle", "create", "--output", "child.mdkg.zip", "--json"]);
  const bundleBytes = fs.readFileSync(path.join(child.root, "child.mdkg.zip"));
  fs.writeFileSync(path.join(f.root, "child.mdkg.zip"), bundleBytes);
  f.run(["subgraph", "add", "child", "child.mdkg.zip", "--json"]);
  const base = f.commit([".mdkg/config.json", "child.mdkg.zip"], "mount immutable child context");
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("Depends on read-only child", "task-2", foreign);
  const incoming = f.commit([added.path], "incoming external reference");
  f.git(["checkout", "main"]);
  const childBefore = bytes(child.root);
  const plan = planIdentityReconciliation(f.root, { ancestor: base, incoming });
  assert.deepEqual(plan.blocking, []);
  assert.ok(plan.dependency_files["child.mdkg.zip"]);
  assert.equal(applyGraphMigrationPlan(f.root, plan, plan.plan_hash).state, "applied");
  assert.deepEqual(fs.readFileSync(path.join(f.root, "child.mdkg.zip")), bundleBytes);
  assert.deepEqual(bytes(child.root), childBefore);
  assert.ok(fs.readFileSync(path.join(f.root, added.path), "utf8").includes(foreign));
});

test("a newer accepted Git ancestor supersedes an older semantic receipt base", () => {
  const f = fixture();
  f.git(["checkout", "-b", "incoming"]);
  const added = f.add("First incoming", "task-2");
  const first = f.commit([added.path], "first incoming");
  f.git(["checkout", "main"]);
  const initial = planIdentityReconciliation(f.root, { ancestor: f.base, incoming: first });
  applyGraphMigrationPlan(f.root, initial, initial.plan_hash);
  f.commit(initial.writes.map((entry: any) => entry.path), "accept first");
  f.git(["merge", "--no-edit", "incoming"]); // Fixture-only ordinary Git integration, never performed by mdkg.
  const common = f.add("Newer common node", "task-3");
  const ancestor = f.commit([common.path], "newer accepted ancestor");
  f.git(["checkout", "incoming"]);
  f.git(["merge", "--ff-only", "main"]);
  f.edit(common.path, "title: Newer common node", "title: Incoming title");
  const incoming = f.commit([common.path], "incoming title edit");
  f.git(["checkout", "main"]);
  f.edit(common.path, "priority: 3", "priority: 2");
  const plan = planIdentityReconciliation(f.root, { ancestor, incoming });
  assert.equal(plan.semantic_base.revision, ancestor);
  assert.equal(plan.semantic_base.receipt_path, null);
  assert.deepEqual(plan.blocking, []);
  applyGraphMigrationPlan(f.root, plan, plan.plan_hash);
  const content = fs.readFileSync(path.join(f.root, common.path), "utf8");
  assert.ok(content.includes("title: Incoming title")); assert.ok(content.includes("priority: 2"));
});
