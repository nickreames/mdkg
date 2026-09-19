const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");

// Consumer qualification only: invoke the installed CLI, never graph internals.
// Fixture generation/edits below represent authored Markdown and local Git input.
function runInstalledScaleGoal({ bin, tempBase = os.tmpdir(), nodeCount = 2000, onCase = () => {} }) {
  assert.ok(path.isAbsolute(bin) && fs.statSync(bin).isFile(), "installed CLI required");
  assert.ok(Number.isSafeInteger(nodeCount) && nodeCount >= 100 && nodeCount <= 10000);
  const roots = [], cases = [], commands = [];
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));
  Object.assign(env, { GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: os.devNull, GIT_TERMINAL_PROMPT: "0" });
  const hash = value => crypto.createHash("sha256").update(value).digest("hex");
  function run(root, executable, args, expected = 0, input) {
    const start = Date.now();
    const r = spawnSync(executable, args, { cwd: root, env, encoding: "utf8", input, timeout: 180000, maxBuffer: 32 * 1024 * 1024 });
    commands.push({ fixture: path.basename(root), executable: path.basename(executable), args, exit: r.status, signal: r.signal,
      elapsed_ms: Date.now() - start, stdout_bytes: Buffer.byteLength(r.stdout || ""), stdout_sha256: hash(r.stdout || ""), stderr_sha256: hash(r.stderr || "") });
    assert.equal(r.status, expected, `${args.join(" ")}\n${r.error || ""}\n${(r.stdout || "").slice(-6000)}\n${(r.stderr || "").slice(-2000)}`);
    return r;
  }
  const cli = (root, args, expected = 0) => run(root, process.execPath, [bin, ...args], expected);
  const json = (root, args) => JSON.parse(cli(root, [...args, "--json"]).stdout);
  const git = (root, args, input) => run(root, process.env.GIT || "git", args, 0, input).stdout.trim();
  function snapshot(root) {
    const files = {};
    function visit(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
        const absolute = path.join(dir, entry.name), relative = path.relative(root, absolute);
        if (entry.isDirectory()) { files[relative] = "directory"; visit(absolute); }
        else if (entry.isFile()) files[relative] = hash(fs.readFileSync(absolute));
        else throw new Error(`unexpected special fixture file ${relative}`);
      }
    }
    visit(root); return files;
  }
  function record(item) { cases.push(item); onCase(item); }
  function fixture(label, backend = "sqlite") {
    const root = fs.mkdtempSync(path.join(tempBase, `mdkg-installed-${label}-`)); roots.push(root);
    cli(root, ["init", "--graph-only"]);
    const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath));
    config.index.backend = backend; fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
    return root;
  }
  function edit(root, file, fields) {
    const absolute = path.join(root, file); let text = fs.readFileSync(absolute, "utf8");
    for (const [key, value] of Object.entries(fields)) {
      const line = `${key}: ${Array.isArray(value) ? `[${value.join(", ")}]` : value}`;
      const pattern = new RegExp(`^${key}:.*$`, "m");
      text = pattern.test(text) ? text.replace(pattern, () => line) : text.replace(/^---\n/, `---\n${line}\n`);
    }
    fs.writeFileSync(absolute, text);
  }
  function migrate(root) {
    const args = ["graph", "migrate", "--graph-id", crypto.randomUUID(), "--origin", crypto.randomUUID()];
    const before = snapshot(root), plan = json(root, args);
    assert.deepEqual(snapshot(root), before, "migration preview must be observational");
    assert.deepEqual(plan.blocking, []); assert.equal(plan.safe_to_apply, true);
    json(root, [...args, "--apply", "--plan-hash", plan.plan_hash]);
    assert.equal(json(root, ["validate"]).ok, true);
  }
  function initializeGit(root) {
    git(root, ["init", "-b", "main"]);
    assert.equal(fs.realpathSync(git(root, ["rev-parse", "--show-toplevel"])), fs.realpathSync(root));
    assert.equal(fs.realpathSync(git(root, ["rev-parse", "--absolute-git-dir"])), fs.realpathSync(path.join(root, ".git")));
    git(root, ["config", "user.name", "Synthetic Fixture"]);
    git(root, ["config", "user.email", "fixture@example.invalid"]);
    git(root, ["add", "--", ".mdkg", ".gitignore"]);
    git(root, ["-c", "commit.gpgsign=false", "commit", "-m", "Synthetic fixture baseline"]);
  }
  try {
    // No new policy or reduced production limits: this uses untouched defaults.
    for (const backend of ["json", "sqlite"]) {
      const root = fixture("scale", backend), work = path.join(root, ".mdkg/work");
      let authoredBytes = 0;
      for (let n = 1; n <= nodeCount; n++) {
        const content = `---\nid: task-${n}\ntype: task\ntitle: Scale fixture ${n}\nstatus: todo\npriority: 2\nowners: [fixture]\nrelates: [${n > 1 ? `task-${n-1}` : ""}]\ncreated: 2026-09-09\nupdated: 2026-09-09\n---\n\n# Overview\n\nSynthetic cross-linked project memory ${n}.\n\n# Acceptance Criteria\n\nPreserve references.\n\n# Files Affected\n\nFixture only.\n\n# Implementation Notes\n\nSynthetic input.\n\n# Test Plan\n\nInstalled CLI checks.\n\n# Links / Artifacts\n\nNone.\n`;
        fs.writeFileSync(path.join(work, `task-${n}.md`), content); authoredBytes += Buffer.byteLength(content);
      }
      const event = JSON.stringify({ ts:"2026-09-09T00:00:00Z", run_id:"fixture", workspace:"root", agent:"fixture", kind:"RUN_COMPLETED", status:"ok", refs:["task-1"], artifacts:[], notes:"Synthetic memory" }) + "\n";
      const eventPath = path.join(work, "events/events.jsonl"); fs.mkdirSync(path.dirname(eventPath), {recursive:true});
      fs.writeFileSync(eventPath, event.repeat(20000));
      for (const version of ["legacy", "v2"]) {
      if (version === "v2") migrate(root);
      cli(root, ["index"]);
      for (const state of ["warm", "cold"]) {
        if (state === "cold") fs.rmSync(path.join(root, ".mdkg/index"), {recursive:true});
        const before = snapshot(root), started = commands.length;
        assert.equal(json(root, ["list", "--type", "task"]).items.length, nodeCount);
        assert.equal(json(root, ["show", `task-${nodeCount}`]).item.id, `task-${nodeCount}`);
        assert.ok(json(root, ["search", `Scale fixture ${nodeCount}`]).items.some(n => n.id === `task-${nodeCount}`));
        const pack = cli(root, ["pack", `task-${nodeCount}`, "--pack-profile", "concise", "--dry-run", "--stats"]);
        assert.match(pack.stdout, new RegExp(`root:task-${nodeCount}(?:\\s|$)`));
        assert.match(pack.stdout, new RegExp(`root:task-${nodeCount-1}(?:\\s|$)`), "pack must include the linked neighbor");
        assert.equal(json(root, ["validate"]).ok, true);
        assert.deepEqual(snapshot(root), before, `${backend}/${state} reads wrote files`);
        record({ family:"scale", backend, version, state, node_count:nodeCount, legacy_authored_bytes:authoredBytes, event_records:20000,
          event_bytes:Buffer.byteLength(event)*20000, command_ms:commands.slice(started).map(c => c.elapsed_ms), observational:true });
      }
      }
    }
    // Default 8MiB graph-node and 1MiB event-line ceilings, with intact bytes.
    for (const kind of ["node", "event"]) {
      const root = fixture("limits"), file = kind === "node" ? ".mdkg/work/task-1.md" : ".mdkg/work/events/events.jsonl";
      const absolute = path.join(root, file); fs.mkdirSync(path.dirname(absolute), {recursive:true});
      fs.writeFileSync(absolute, "x".repeat((kind === "node" ? 8 : 1) * 1024 * 1024 + 1));
      const before = snapshot(root), result = cli(root, ["validate", "--json"], kind === "node" ? 4 : 2);
      assert.match(result.stdout + result.stderr, kind === "node" ? /graph file exceeds index\.limits\.max_file_bytes \(8388608\)/ : /events\.validation\.max_line_bytes exceeded/);
      assert.deepEqual(snapshot(root), before, "limit refusal must preserve all bytes");
      record({family:"default-limit", kind, bytes:fs.statSync(absolute).size, failed_closed:true, observational:true});
    }
    // Real Git history, not a mocked limit. Empty commits count for legacy ancestry.
    {
      const root = fixture("history"); initializeGit(root);
      const ancestor = git(root, ["rev-parse", "HEAD"]);
      let stream = "";
      for (let n=1;n<=2049;n++) stream += `commit refs/heads/main\nmark :${n}\ncommitter Synthetic Fixture <fixture@example.invalid> ${1700000000+n} +0000\ndata 1\nx\nfrom ${n===1?ancestor:`:${n-1}`}\n\n`;
      git(root, ["fast-import", "--quiet"], stream);
      assert.equal(git(root, ["rev-list", "--count", `${ancestor}..HEAD`]), "2049");
      const before = snapshot(root), result = cli(root, ["graph", "migrate", "--graph-id", crypto.randomUUID(), "--origin", crypto.randomUUID(), "--ancestor", ancestor, "--json"], 1);
      assert.match(result.stdout + result.stderr, /legacy identity history exceeds the bounded review limit/);
      assert.deepEqual(snapshot(root), before);
      record({family:"history-limit", commits:2049, existing_limit:2048, failed_closed:true, observational:true});
    }
    for (const backend of ["json", "sqlite"]) for (const version of ["legacy", "v2"]) {
      const root = fixture("goals", backend);
      const create = (type, title) => json(root, ["new", type, title, "--status", "todo", "--owners", "fixture"]).node;
      const implementation = create("task", "Implement synthetic audit work");
      const verification = create("test", "Independently verify synthetic blocker");
      const publication = create("task", "Recheck exact artifact and request publication approval");
      const audit = create("goal", "Audit synthetic candidate"), blockers = create("goal", "Verify synthetic blockers"), publish = create("goal", "Future synthetic publication");
      const acceptance = json(root, ["new", "checkpoint", "Accept synthetic audit", "--status", "backlog"]).node;
      edit(root, audit.path, {scope_refs:[implementation.id], required_checks:["touch must-not-execute"], goal_state:"paused"});
      edit(root, blockers.path, {scope_refs:[verification.id], goal_state:"paused"});
      edit(root, publish.path, {scope_refs:[publication.id], context_refs:[audit.id, blockers.id], goal_state:"paused"});
      json(root, ["task", "update", verification.id, "--add-blocked-by", implementation.id]);
      json(root, ["task", "update", publication.id, "--add-blocked-by", `${acceptance.id},${verification.id}`]);
      fs.writeFileSync(path.join(root, "candidate.txt"), "synthetic candidate\n");
      const sealedHash = hash(fs.readFileSync(path.join(root, "candidate.txt")));
      if (version === "v2") migrate(root);
      initializeGit(root); const gitIndex = fs.readFileSync(path.join(root, ".git/index"));
      const next = goal => json(root, ["goal", "next", goal.id]);
      const blocked = () => {const n=next(publish);assert.equal(n.node,null);assert.deepEqual(n.warnings,[]);};
      blocked(); assert.equal(next(blockers).node, null);
      assert.equal(next(audit).node.id, implementation.id);
      const beforeEvaluate = snapshot(root), evaluated = json(root, ["goal", "evaluate", audit.id]);
      assert.equal(evaluated.report_only, true); assert.equal(evaluated.runs_scripts, false);
      assert.deepEqual(snapshot(root), beforeEvaluate);
      json(root, ["goal", "claim", audit.id, implementation.id]);
      json(root, ["task", "start", implementation.id]);
      const done = json(root, ["task", "done", implementation.id, "--checkpoint", "Synthetic implementation proof"]);
      assert.ok(done.checkpoint.id);
      const proof=json(root,["show",done.checkpoint.id]).item;
      assert.equal(proof.type,"checkpoint"); assert.equal(proof.status,"done");
      assert.ok(proof.edges.relates.includes(`root:${implementation.id}`));
      const achieved=json(root, ["goal", "done", audit.id]); blocked();
      assert.equal(achieved.goal.goal_state,"achieved"); assert.equal(achieved.goal.status,"done");
      assert.equal(achieved.goal.active_node,undefined);
      const completedNode=json(root,["show",implementation.id]).item;
      assert.equal(achieved.goal.last_active_node,version === "v2" ? completedNode.stable_ref : implementation.id);
      assert.equal(next(blockers).node.id, verification.id);
      json(root, ["goal", "claim", blockers.id, verification.id]);
      json(root, ["task", "start", verification.id]);
      json(root, ["task", "done", verification.id]); blocked();
      json(root, ["goal", "done", blockers.id]); blocked();
      // Checkpoints have no task lifecycle command: the owner authors acceptance.
      edit(root, acceptance.path, {status:"done"}); cli(root,["index"]);
      assert.equal(next(publish).node.id, publication.id);
      json(root,["task","update",verification.id,"--status","todo"]); blocked();
      edit(root, acceptance.path, {status:"backlog"}); cli(root,["index"]); blocked();
      edit(root, acceptance.path, {status:"done"}); cli(root,["index"]); blocked();
      json(root,["task","done",verification.id]); assert.equal(next(publish).node.id,publication.id);
      // Routability is not artifact verification or publication authority.
      fs.appendFileSync(path.join(root,"candidate.txt"),"changed after synthetic seal\n");
      assert.notEqual(hash(fs.readFileSync(path.join(root,"candidate.txt"))),sealedHash);
      const publishEvaluation=json(root,["goal","evaluate",publish.id]);
      assert.equal(publishEvaluation.report_only,true); assert.equal(publishEvaluation.runs_scripts,false);
      assert.equal(fs.existsSync(path.join(root,"must-not-execute")),false);
      assert.equal(fs.existsSync(path.join(root,".mdkg/state/selected-goal.json")),false);
      assert.deepEqual(fs.readFileSync(path.join(root,".git/index")),gitIndex);
      assert.equal(json(root,["validate"]).ok,true);
      record({family:"goal-routing",backend,version,both_gate_orders:true,reopened_gate_blocks:true,goal_state_not_acceptance:true,
        evaluate_observational:true,artifact_recheck_required:true,publication_executed:false,git_index_preserved:true,selection_preserved:true});
    }
    for (const root of roots) fs.rmSync(root,{recursive:true,force:false});
    return {schema_version:1,runtime:process.version,installed_cli_sha256:hash(fs.readFileSync(bin)),cases,commands,fixtures_removed:roots.length,
      limitations:[`${nodeCount}-node graph is representative coverage, not a universal performance SLA`, "2049-commit refusal exercises the existing limit; exhaustive 2048-commit acceptance is not claimed", "goal routing stores guidance, not artifact verification or publication enforcement"]};
  } catch (error) { error.fixture_roots=roots; error.completed_cases=cases; error.command_receipts=commands; throw error; }
}

module.exports = { runInstalledScaleGoal };
