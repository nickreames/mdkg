const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

// Installed CLI only: no source imports, direct ID edits or shared allocator.
// Every Git operation is confined to independently cloned disposable fixtures.
function exerciseIdentityCollaboration(binPath, ownedRoot) {
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null" };
  const run = (root, command, args, allowFailure = false) => {
    const r = spawnSync(command, args, { cwd: root, env, encoding: "utf8", timeout: 60000, maxBuffer: 16 * 1024 * 1024 });
    if (!allowFailure) assert.equal(r.status, 0, `${command} ${args.join(" ")}\n${r.stderr}\n${r.stdout}`);
    return r;
  };
  const git = (root, args) => run(root, process.env.GIT || "git", ["-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args]).stdout.trim();
  const cli = (root, args) => JSON.parse(run(root, binPath, [...args, "--json"]).stdout);
  const files = root => {
    const output = {};
    const visit = directory => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const p = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(p);
        else if (entry.isFile()) output[path.relative(root, p)] = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
        else throw new Error("unexpected linked/special fixture file: " + p);
      }
    }; visit(root); return output;
  };
  const commit = (root, paths, title) => {
    git(root, ["add", "--", ...paths]); git(root, ["commit", "-m", title]); return git(root, ["rev-parse", "HEAD"]);
  };
  const create = (root, title, args = []) => cli(root, ["new", "task", title, "--status", "todo", ...args]).node;
  const root = path.join(ownedRoot, "identity-collaboration"); fs.mkdirSync(root);
  const seed = path.join(root, "seed"); fs.mkdirSync(seed);
  run(seed, binPath, ["init", "--graph-only"]);
  const migrationArgs = ["graph", "migrate", "--graph-id", crypto.randomUUID(), "--origin", crypto.randomUUID()];
  const migration = cli(seed, migrationArgs);
  assert.deepEqual(migration.blocking, []);
  cli(seed, [...migrationArgs, "--apply", "--plan-hash", migration.plan_hash]);
  const common = create(seed, "Common ancestor");
  assert.ok(common.stable_ref, "fixture must use CLI-persisted v2 identity");
  git(seed, ["init", "-b", "main"]);
  const base = commit(seed, [".gitignore", ".mdkg/config.json", ".mdkg/graph.json", ".mdkg/templates", ".mdkg/core", ".mdkg/work"], "common graph");
  const target = path.join(root, "developer-a"), incoming = path.join(root, "developer-b");
  git(root, ["clone", "--no-local", seed, target]);
  git(root, ["clone", "--no-local", seed, incoming]);
  git(incoming, ["checkout", "-b", "developer-b"]);
  const a = create(target, "Developer A work");
  const b = create(incoming, "Developer B work");
  const linked = create(incoming, "Developer B linked work", ["--parent", b.id, "--refs", common.id + "," + b.id]);
  assert.equal(a.id, b.id, "independent checkouts must naturally allocate the same short alias");
  assert.notEqual(a.stable_ref, b.stable_ref, "independent creations must have different stable identities");
  assert.ok(fs.readFileSync(path.join(incoming, linked.path), "utf8").includes(b.stable_ref));
  git(incoming, ["add", "--", b.path]);
  const authoredBefore = files(incoming);
  for (const node of [b, linked]) {
    assert.equal(cli(incoming, ["show", node.stable_ref]).item.stable_ref, node.stable_ref);
    assert.equal(cli(incoming, ["show", node.id]).item.title, node.title);
  }
  cli(incoming, ["list", "--type", "task"]);
  cli(incoming, ["search", "Developer"]);
  cli(incoming, ["validate"]);
  assert.deepEqual(files(incoming), authoredBefore, "ordinary staged/untracked reads must be observational");
  const externalReceipt = JSON.stringify({ schema_version: 1, subject: b.stable_ref, result: "synthetic accepted evidence" }) + "\n";
  const externalPath = "external-receipt.json";
  fs.writeFileSync(path.join(incoming, externalPath), externalReceipt);
  const incomingHead = commit(incoming, [b.path, linked.path, externalPath], "offline cross-linked contribution");
  commit(target, [a.path], "independent target work");
  // This is a local fixture fetch, never origin or a network Git endpoint.
  git(target, ["fetch", incoming, "developer-b:refs/heads/review-incoming"]);
  const uncommitted = create(target, "Uncommitted target work");
  git(target, ["add", "--", uncommitted.path]);
  const index = fs.readFileSync(path.join(target, ".git/index"));
  const args = ["graph", "reconcile", "--ancestor", base, "--incoming", incomingHead];
  const before = files(target), plan = cli(target, args), repeatPlan = cli(target, args);
  assert.deepEqual(plan.blocking, []);
  assert.equal(plan.plan_hash, repeatPlan.plan_hash);
  assert.deepEqual(files(target), before, "integration preview must not write Git, graph or cache bytes");
  assert.match(plan.path_manifest.find(p => p.path === externalPath).treatment, /excluded/);
  cli(target, [...args, "--apply", "--plan-hash", plan.plan_hash]);
  assert.deepEqual(fs.readFileSync(path.join(target, ".git/index")), index);
  assert.equal(fs.existsSync(path.join(target, externalPath)), false, "semantic integration must not import non-graph files");
  assert.equal(fs.readFileSync(path.join(incoming, externalPath), "utf8"), externalReceipt);
  assert.equal(cli(target, ["show", a.id]).item.stable_ref, a.stable_ref, "target keeps its alias");
  const bShown = cli(target, ["show", b.stable_ref]).item;
  assert.notEqual(bShown.id, b.id, "incoming colliding alias must be remapped");
  const receipt = JSON.parse(fs.readFileSync(path.join(target, plan.receipt_path), "utf8"));
  const mapping = receipt.mappings.find(m => m.stable_ref === b.stable_ref);
  assert.equal(mapping.output.alias, "root:" + bShown.id);
  const linkedShown = cli(target, ["show", linked.stable_ref]).item;
  assert.ok(fs.readFileSync(path.join(target, linkedShown.path), "utf8").includes(b.stable_ref));
  cli(target, ["validate"]);
  const repeatBefore = files(target), replay = cli(target, args);
  assert.equal(replay.replay.noop, true);
  assert.deepEqual(replay.writes, []);
  cli(target, [...args, "--apply", "--plan-hash", replay.plan_hash]);
  assert.deepEqual(files(target), repeatBefore, "repeat integration must be a byte-preserving no-op");
  // Commit the user's already-staged work independently, then the exact semantic
  // plan. Reverting the integration must not resurrect previously accepted work.
  git(target, ["commit", "--only", "-m", "retain staged target work", "--", uncommitted.path]);
  const integrated = commit(target, plan.writes.map(w => w.path), "reviewed graph integration");
  git(target, ["revert", "--no-edit", integrated]);
  const revertedBefore = files(target), revertedReplay = cli(target, args);
  assert.equal(revertedReplay.replay.noop, true);
  cli(target, [...args, "--apply", "--plan-hash", revertedReplay.plan_hash]);
  assert.deepEqual(files(target), revertedBefore, "revert must survive repeated integration");
  const decisionsPath = path.join(target, "reviewed-decisions.json");
  const reinstatement = Object.fromEntries([b, linked].map(n => [n.stable_ref, { take: "incoming", reason: "Explicitly reintroduce reviewed work after intentional revert" }]));
  fs.writeFileSync(decisionsPath, JSON.stringify(reinstatement));
  const reinstateArgs = [...args, "--decisions", path.basename(decisionsPath)];
  const reinstated = cli(target, reinstateArgs);
  assert.deepEqual(reinstated.blocking, []);
  cli(target, [...reinstateArgs, "--apply", "--plan-hash", reinstated.plan_hash]);
  assert.equal(cli(target, ["show", b.stable_ref]).item.stable_ref, b.stable_ref);
  commit(target, reinstated.writes.map(w => w.path), "explicit identity reintroduction");

  // Real divergent edits to a shared ancestor identity are semantic conflicts,
  // never independent creations or numeric-ID repair candidates.
  cli(incoming, ["task", "update", common.stable_ref, "--status", "done"]);
  const newerIncoming = commit(incoming, [common.path], "incoming lifecycle done");
  cli(target, ["task", "update", common.stable_ref, "--status", "progress"]);
  commit(target, [common.path], "target lifecycle in progress");
  git(target, ["fetch", incoming, "developer-b:refs/heads/review-incoming"]);
  const semanticArgs = ["graph", "reconcile", "--ancestor", base, "--incoming", newerIncoming];
  const conflictBefore = files(target), conflict = cli(target, semanticArgs);
  assert.ok(conflict.blocking.length, "same-node lifecycle disagreement requires explicit review");
  const rejected = run(target, binPath, [...semanticArgs, "--apply", "--plan-hash", conflict.plan_hash, "--json"], true);
  assert.notEqual(rejected.status, 0);
  assert.deepEqual(files(target), conflictBefore, "ambiguous application must fail without writes");
  fs.writeFileSync(decisionsPath, JSON.stringify({ [common.stable_ref]: { take: "target", reason: "Target owner has authoritative current lifecycle evidence" } }));
  const resolvedArgs = [...semanticArgs, "--decisions", path.basename(decisionsPath)];
  const reviewed = cli(target, resolvedArgs);
  assert.deepEqual(reviewed.blocking, []);
  cli(target, ["task", "update", common.stable_ref, "--priority", "2"]);
  const staleBefore = files(target);
  const stale = run(target, binPath, [...resolvedArgs, "--apply", "--plan-hash", reviewed.plan_hash, "--json"], true);
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr + stale.stdout, /stale|hash/i);
  assert.deepEqual(files(target), staleBefore, "stale reviewed plan must not mutate graph or Git");
  const refreshed = cli(target, resolvedArgs);
  const semanticIndex = fs.readFileSync(path.join(target, ".git/index"));
  cli(target, [...resolvedArgs, "--apply", "--plan-hash", refreshed.plan_hash]);
  assert.deepEqual(fs.readFileSync(path.join(target, ".git/index")), semanticIndex);
  assert.equal(cli(target, ["show", common.stable_ref]).item.status, "progress");
  cli(target, ["validate"]);

  const cherry = path.join(root, "cherry-pick-review");
  git(root, ["clone", "--no-local", seed, cherry]);
  git(cherry, ["fetch", incoming, "developer-b:refs/heads/review-incoming"]);
  git(cherry, ["cherry-pick", incomingHead]);
  const picked = git(cherry, ["rev-parse", "HEAD"]);
  assert.equal(fs.readFileSync(path.join(cherry, externalPath), "utf8"), externalReceipt);
  git(cherry, ["revert", "--no-edit", picked]);
  const cherryBefore = files(cherry), cherryReplay = cli(cherry, args);
  assert.ok(cherryReplay.blocking.some(b => /reintroduc/.test(b)), "cherry-picked and reverted identity requires an explicit reintroduction decision");
  assert.deepEqual([...cherryReplay.replay.previously_present].sort(), [b.stable_ref, linked.stable_ref].sort());
  const cherryRejected = run(cherry, binPath, [...args, "--apply", "--plan-hash", cherryReplay.plan_hash, "--json"], true);
  assert.notEqual(cherryRejected.status, 0);
  assert.deepEqual(files(cherry), cherryBefore);
  assert.equal(fs.readFileSync(path.join(incoming, externalPath), "utf8"), externalReceipt);
  return { runtime: process.version, common_ancestor: base, incoming: incomingHead,
    natural_collision: a.id, target_identity: a.stable_ref, incoming_identity: b.stable_ref,
    incoming_alias_after: mapping.output.alias, plan_hash: plan.plan_hash,
    cross_links_preserved: true, ordinary_uncommitted_reads_observational: true,
    git_index_unchanged: true, external_receipt_sha256: crypto.createHash("sha256").update(externalReceipt).digest("hex"), replay_noop: true,
    reviewed_reintroduction: true, revert_replay_noop: true, cherry_pick_revert_requires_decision: true,
    same_identity_conflict_requires_decision: true, stale_plan_refused_without_writes: true, newer_incoming_reviewed: true };
}

module.exports = { exerciseIdentityCollaboration };
