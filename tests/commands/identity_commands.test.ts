import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { createGraphFormat } = require("../../graph/identity");
const cli = path.resolve(__dirname, "../../cli.js");
const { handleMcpRequest } = require("../../commands/mcp");

function mcpCurrent(root: string) {
  const response = handleMcpRequest({ root }, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "mdkg_goal_current", arguments: {} } });
  assert.ok(!response.result.isError, JSON.stringify(response));
  return response.result.structuredContent;
}

function snapshotFiles(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (directory: string) => {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name);
      if (fs.lstatSync(file).isDirectory()) visit(file);
      else result[path.relative(root, file)] = fs.readFileSync(file).toString("base64");
    }
  };
  visit(root);
  return result;
}

function fixture(backend = "json") {
  const root = makeTempDir("mdkg-identity-commands-");
  writeRootConfig(root); writeDefaultTemplates(root);
  const config = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/config.json"), "utf8"));
  config.index.backend = backend;
  writeFile(path.join(root, ".mdkg/config.json"), JSON.stringify(config));
  writeFile(path.join(root, ".mdkg/core/core.md"), "# core\n");
  writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat()));
  const run = (args: string[]) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
    return JSON.parse(result.stdout);
  };
  const git = (args: string[]) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  return { root, run, git };
}

test("v2 ordinary alias inputs persist identity bindings, not future ambiguous aliases", () => {
  const { root, run } = fixture();
  const goal = run(["new", "goal", "Outcome", "--json"]).node;
  const task = run(["new", "task", "Branch work", "--parent", goal.id, "--refs", goal.qid, "--json"]).node;
  const raw = fs.readFileSync(path.join(root, task.path), "utf8");
  assert.ok(raw.includes(`parent: ${goal.stable_ref}`));
  assert.ok(raw.includes(`refs: [${goal.stable_ref}]`));
  run(["validate", "--json"]);
});

test("v2 rejects a competing active goal before reserving an alias or writing its source", () => {
  for (const backend of ["json", "sqlite"]) {
    const { root, run } = fixture(backend);
    run(["new", "goal", "Existing active", "--json"]);
    const before = snapshotFiles(root);
    const failed = spawnSync(process.execPath, [cli, "new", "goal", "Competing active", "--json"], { cwd: root, encoding: "utf8" });
    assert.notEqual(failed.status, 0);
    assert.match(failed.stderr, /active.*goal|goal.*active/);
    assert.deepEqual(snapshotFiles(root), before);
  }
});

test("v2 alias collisions retain all identity variants for read-only inspection and block ordinary mutation", () => {
  for (const backend of ["json", "sqlite"]) {
    const { root, run } = fixture(backend);
    const first = run(["new", "task", "Collision first", "--json"]).node;
    const second = run(["new", "task", "Collision second", "--relates", first.stable_ref, "--json"]).node;
    const third = run(["new", "task", "Collision third", "--relates", second.stable_ref, "--json"]).node;
    for (const candidate of [second, third]) {
      const source = path.join(root, candidate.path);
      const target = path.join(root, `.mdkg/work/${first.id}-${candidate.title.toLowerCase().replaceAll(" ", "-")}.md`);
      fs.renameSync(source, target);
      writeFile(target, fs.readFileSync(target, "utf8").replace(`id: ${candidate.id}\n`, `id: ${first.id}\n`));
    }
    const before = snapshotFiles(root);
    const mcp = (name: string, args: Record<string, unknown>) => {
      const result = handleMcpRequest({ root }, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } });
      assert.ok(!result.result.isError, JSON.stringify(result));
      return result.result.structuredContent;
    };
    for (const candidate of [first, second, third]) {
      const shown = run(["show", candidate.stable_ref, "--ws", "root", "--json"]).item;
      assert.equal(shown.title, candidate.title);
      assert.equal(shown.qid, candidate.stable_ref);
      assert.equal(shown.alias_qid, first.qid);
      assert.equal(shown.stable_ref, candidate.stable_ref);
      if (candidate === second) assert.deepEqual(shown.edges.relates, [first.stable_ref]);
      if (candidate === third) assert.deepEqual(shown.edges.relates, [second.stable_ref]);
      const refs = run(["graph", "refs", candidate.stable_ref, "--json"]);
      assert.ok(JSON.stringify(refs).includes(candidate.stable_ref));
      const packed = mcp("mdkg_pack", { id: candidate.stable_ref });
      assert.ok(packed.pack.nodes.some((node: any) => node.stable_ref === candidate.stable_ref));
      assert.ok(packed.warnings.some((warning: string) => warning.includes("ambiguous alias")));
    }
    assert.equal(run(["list", "--type", "task", "--json"]).items.length, 3);
    assert.equal(run(["search", "Collision", "--json"]).items.length, 3);
    for (const selector of [first.id, first.qid]) {
      const result = spawnSync(process.execPath, [cli, "show", selector, "--ws", "root", "--json"], { cwd: root, encoding: "utf8" });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /ambiguous/);
    }
    const mutation = spawnSync(process.execPath, [cli, "task", "start", second.stable_ref, "--json"], { cwd: root, encoding: "utf8" });
    assert.notEqual(mutation.status, 0);
    const validation = spawnSync(process.execPath, [cli, "validate", "--json"], { cwd: root, encoding: "utf8" });
    assert.notEqual(validation.status, 0);
    assert.deepEqual(snapshotFiles(root), before);
  }
});

test("v2 literal conflict markers produce source diagnostics and never become writable graph data", () => {
  const { root, run } = fixture();
  const task = run(["new", "task", "Conflicted node", "--json"]).node;
  const file = path.join(root, task.path);
  writeFile(file, `${fs.readFileSync(file, "utf8")}\n<<<<<<< ours\nfirst\n=======\nsecond\n>>>>>>> theirs\n`);
  const before = snapshotFiles(root);
  for (const args of [["show", task.stable_ref, "--json"], ["task", "start", task.stable_ref, "--json"], ["validate", "--json"]]) {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /unresolved Git conflict markers/);
    assert.ok((result.stdout + result.stderr).includes(path.basename(file)));
  }
  assert.deepEqual(snapshotFiles(root), before);
});

test("v2 checkout selection follows immutable identity across alias reuse without rewriting local state", () => {
  for (const backend of ["json", "sqlite"]) {
    const { root, run } = fixture(backend);
    const original = run(["new", "goal", "Selected original", "--json"]).node;
    run(["goal", "select", original.stable_ref, "--json"]);
    const statePath = path.join(root, ".mdkg/state/selected-goal.json");
    const state = fs.readFileSync(statePath, "utf8");
    assert.equal(JSON.parse(state).stable_ref, original.stable_ref);
    const nodePath = path.join(root, original.path);
    const renamedPath = path.join(root, ".mdkg/work/goal-99-selected-original.md");
    fs.renameSync(nodePath, renamedPath);
    writeFile(renamedPath, fs.readFileSync(renamedPath, "utf8").replace(`id: ${original.id}\n`, "id: goal-99\n"));
    const replacementIdentity = require("crypto").randomUUID();
    const reusedPath = path.join(root, `.mdkg/work/${original.id}-alias-replacement.md`);
    writeFile(reusedPath, fs.readFileSync(renamedPath, "utf8").replace("id: goal-99\n", `id: ${original.id}\n`)
      .replace(`node_id: ${original.identity.node_id}`, `node_id: ${replacementIdentity}`)
      .replace("goal_state: active", "goal_state: paused").replace("status: progress", "status: blocked"));
    const current = run(["goal", "current", "--json"]);
    assert.equal(current.source, "selected");
    assert.equal(current.goal.qid, "root:goal-99");
    assert.equal(current.goal.stable_ref, original.stable_ref);
    const status = run(["status", "--json"]);
    assert.equal(status.goal.selected_resolved_qid, "root:goal-99");
    assert.equal(status.goal.selected.stable_ref, original.stable_ref);
    assert.equal(mcpCurrent(root).goal.stable_ref, original.stable_ref);
    const doctor = spawnSync(process.execPath, [cli, "doctor", "--strict", "--json"], { cwd: root, encoding: "utf8" });
    const proof = JSON.parse(doctor.stdout);
    assert.ok(proof.checks.some((check: any) => check.id === "goal.selected_achieved" && check.refs.includes("root:goal-99")));
    assert.equal(fs.readFileSync(statePath, "utf8"), state);
  }
});

test("v2 unbound or missing selected identity does not fall back to a reused alias or another active goal", () => {
  const { root, run } = fixture();
  const original = run(["new", "goal", "Original", "--json"]).node;
  run(["goal", "select", original.stable_ref, "--json"]);
  const statePath = path.join(root, ".mdkg/state/selected-goal.json");
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  const candidatePath = path.join(root, original.path);
  writeFile(candidatePath, fs.readFileSync(candidatePath, "utf8").replace("status: todo", "status: progress").replace("goal_state: draft", "goal_state: active"));
  for (const binding of [undefined, `mdkg://${original.identity.graph_id}/00000000-0000-4000-8000-000000000000`, "mdkg://malformed"]) {
    writeFile(statePath, JSON.stringify({ ...state, stable_ref: binding }));
    const before = fs.readFileSync(statePath, "utf8");
    const current = run(["goal", "current", "--json"]);
    assert.equal(current.goal, null);
    assert.equal(current.source, "none");
    assert.ok(current.warnings.length > 0);
    assert.equal(mcpCurrent(root).goal, null);
    const result = spawnSync(process.execPath, [cli, "goal", "next", "--json"], { cwd: root, encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.equal(fs.readFileSync(statePath, "utf8"), before);
    assert.equal(run(["goal", "show", original.stable_ref, "--json"]).goal.qid, original.qid);
  }
});

test("v2 show/list/search and task lifecycle use the same identity before and after staging", () => {
  for (const backend of ["json", "sqlite"]) {
    const { root, run, git } = fixture(backend);
    git(["init", "-q"]);
    const task = run(["new", "task", "Unmerged work", "--json"]).node;
    for (const staged of [false, true]) {
      if (staged) git(["add", ".mdkg/work"]);
      const gitIndex = fs.existsSync(path.join(root, ".git/index")) ? fs.readFileSync(path.join(root, ".git/index")) : null;
      const shown = run(["show", task.stable_ref, "--json"]).item;
      assert.equal(shown.qid, task.qid);
      assert.deepEqual(shown.identity, task.identity);
      assert.equal(shown.stable_ref, task.stable_ref);
      const listed = run(["list", "--type", "task", "--json"]).items;
      assert.equal(listed[0].stable_ref, task.stable_ref);
      assert.equal(run(["search", "Unmerged", "--json"]).items[0].stable_ref, task.stable_ref);
      const started = run(["task", "start", task.stable_ref, "--json"]);
      assert.equal(started.task.qid, task.qid);
      assert.deepEqual(fs.existsSync(path.join(root, ".git/index")) ? fs.readFileSync(path.join(root, ".git/index")) : null, gitIndex);
    }
    run(["validate", "--json"]);
  }
});

test("v2 checkpoints accept stable scope/relates and allocate an independent persisted identity", () => {
  const { root, run } = fixture();
  const task = run(["new", "task", "Proof target", "--json"]).node;
  const checkpoint = run(["checkpoint", "new", "Proof", "--scope", task.stable_ref, "--relates", task.stable_ref, "--json"]).checkpoint;
  const shown = run(["show", checkpoint.qid, "--json"]).item;
  assert.ok(shown.identity);
  assert.notEqual(shown.stable_ref, task.stable_ref);
  const raw = fs.readFileSync(path.join(root, checkpoint.path), "utf8");
  assert.ok(raw.includes(`scope: [${task.stable_ref}]`));
  run(["validate", "--json"]);
});

test("v2 command-by-state matrix preserves exact targets and read hashes across index modes", () => {
  const { createHash } = require("node:crypto");
  const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  for (const backend of ["json", "sqlite"]) {
    const { root, run, git } = fixture(backend);
    git(["init", "-q"]);
    const goal = run(["new", "goal", "Matrix outcome", "--json"]).node;
    const task = run(["new", "task", "Matrix work", "--parent", goal.stable_ref, "--json"]).node;
    const proof = run(["checkpoint", "new", "Matrix proof", "--scope", task.stable_ref, "--json"]).checkpoint;
    const manifest = run(["new", "manifest", "Matrix worker", "--id", "agent.matrix", "--json"]).node;
    const work = run(["work", "contract", "new", "Matrix contract", "--id", "work.matrix", "--agent-id", manifest.stable_ref,
      "--kind", "example", "--inputs", "prompt:text:required", "--outputs", "result:text:required", "--json"]).node;
    const order = run(["work", "order", "new", "Matrix order", "--id", "order.matrix", "--work-id", work.stable_ref,
      "--requester", "user://example", "--json"]).node;
    const receipt = run(["work", "receipt", "new", "Matrix receipt", "--id", "receipt.matrix", "--work-order-id", order.stable_ref,
      "--outcome", "success", "--proof-refs", task.stable_ref, "--json"]).node;
    const matrix: Array<[string[], string]> = [
      [["show", task.stable_ref, "--json"], task.stable_ref],
      [["list", "--type", "task", "--json"], task.stable_ref],
      [["search", "Matrix work", "--json"], task.stable_ref],
      [["graph", "refs", task.stable_ref, "--json"], task.stable_ref],
      [["show", proof.stable_ref, "--json"], proof.stable_ref],
      [["goal", "show", goal.stable_ref, "--json"], goal.stable_ref],
      [["manifest", "show", manifest.stable_ref, "--json"], manifest.stable_ref],
      [["capability", "show", manifest.stable_ref, "--json"], manifest.stable_ref],
      [["work", "order", "status", order.stable_ref, "--json"], order.stable_ref],
      [["work", "receipt", "verify", receipt.stable_ref, "--json"], receipt.stable_ref],
    ];
    let currentPath = task.path;
    for (const state of ["untracked", "staged", "unstaged-alias-change"]) {
      if (state === "staged") git(["add", ".mdkg/work"]);
      if (state === "unstaged-alias-change") {
        const newPath = task.path.replace(task.id, "task-999");
        fs.renameSync(path.join(root, currentPath), path.join(root, newPath));
        currentPath = newPath;
        writeFile(path.join(root, currentPath), fs.readFileSync(path.join(root, currentPath), "utf8").replace(`id: ${task.id}\n`, "id: task-999\n"));
      }
      const before = hash(snapshotFiles(root));
      for (const [args, identity] of matrix) assert.ok(JSON.stringify(run(args)).includes(identity), `${backend}/${state}/${args.join(" ")}`);
      const packed = handleMcpRequest({ root }, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "mdkg_pack", arguments: { id: task.stable_ref } } });
      assert.ok(!packed.result.isError, JSON.stringify(packed));
      assert.ok(packed.result.structuredContent.pack.nodes.some((node: any) => node.stable_ref === task.stable_ref));
      run(["validate", "--json"]);
      assert.equal(hash(snapshotFiles(root)), before, `${backend}/${state}: read-only hashes changed`);
      const indexBefore = fs.existsSync(path.join(root, ".git/index")) ? hash(fs.readFileSync(path.join(root, ".git/index"))) : null;
      assert.equal(run(["task", "start", task.stable_ref, "--json"]).task.stable_ref, task.stable_ref);
      const authored = fs.readFileSync(path.join(root, currentPath), "utf8");
      const rebuilt = spawnSync(process.execPath, [cli, "index"], { cwd: root, encoding: "utf8" });
      assert.equal(rebuilt.status, 0, rebuilt.stderr);
      assert.equal(fs.readFileSync(path.join(root, currentPath), "utf8"), authored);
      assert.equal(run(["show", task.stable_ref, "--json"]).item.stable_ref, task.stable_ref);
      assert.equal(fs.existsSync(path.join(root, ".git/index")) ? hash(fs.readFileSync(path.join(root, ".git/index"))) : null, indexBefore);
    }
  }
});

test("v2 lifecycle mutations bind alias inputs and emit stable event targets", () => {
  const { root, run } = fixture();
  run(["event", "enable", "--json"]);
  const goal = run(["new", "goal", "Lifecycle goal", "--json"]).node;
  const task = run(["new", "task", "Owned task", "--parent", goal.id, "--json"]).node;
  const evidence = run(["new", "test", "Evidence", "--json"]).node;
  const updated = run(["task", "update", task.stable_ref, "--add-refs", evidence.id, "--json"]);
  assert.equal(updated.task.stable_ref, task.stable_ref);
  assert.ok(fs.readFileSync(path.join(root, task.path), "utf8").includes(`refs: [${evidence.stable_ref}]`));
  run(["goal", "claim", goal.stable_ref, task.stable_ref, "--json"]);
  assert.ok(fs.readFileSync(path.join(root, goal.path), "utf8").includes(`active_node: ${task.stable_ref}`));
  run(["goal", "pause", goal.stable_ref, "--json"]);
  run(["task", "start", task.stable_ref, "--json"]);
  const done = run(["task", "done", task.stable_ref, "--checkpoint", "Identity milestone", "--json"]);
  assert.equal(done.task.stable_ref, task.stable_ref);
  const events = fs.readFileSync(path.join(root, ".mdkg/work/events/events.jsonl"), "utf8").trim().split("\n").map((line) => JSON.parse(line));
  for (const kind of ["TASK_UPDATED", "TASK_STARTED", "TASK_DONE"]) {
    const event = events.find((entry) => entry.kind === kind);
    assert.ok(event, kind);
    assert.deepEqual(event.refs, [task.stable_ref]);
  }
  assert.deepEqual(events.find((entry) => entry.kind === "GOAL_CLAIM").refs, [goal.stable_ref, task.stable_ref]);
  const manual = run(["event", "append", "--kind", "MANUAL_PROOF", "--status", "ok", "--refs", task.id, "--json"]);
  assert.deepEqual(manual.event.refs, [task.stable_ref]);
  const beforeFailure = snapshotFiles(root);
  const invalidEvent = spawnSync(process.execPath, [cli, "event", "append", "--kind", "MISSING", "--status", "ok", "--refs", "task-9999", "--json"], { cwd: root, encoding: "utf8" });
  assert.notEqual(invalidEvent.status, 0);
  assert.deepEqual(snapshotFiles(root), beforeFailure);
  run(["validate", "--json"]);
});

test("v2 loop forks allocate fresh cross-linked identities and previews remain observational", () => {
  for (const backend of ["json", "sqlite"]) {
    const { root, run } = fixture(backend);
    const template = run(["new", "loop", "Reusable loop", "--json"]).node;
    const goal = run(["new", "goal", "Loop scope", "--json"]).node;
    const args = ["loop", "fork", template.stable_ref, "--scope", goal.stable_ref, "--materialization", "default_children", "--json"];
    const before = snapshotFiles(root);
    const preview = run([...args, "--dry-run"]);
    assert.equal(preview.identities_provisional, true);
    assert.deepEqual(snapshotFiles(root), before);
    const fork = run(args);
    assert.equal(fork.identities_provisional, false);
    assert.notEqual(fork.loop.stable_ref, template.stable_ref);
    assert.notEqual(fork.loop.stable_ref, preview.loop.stable_ref);
    const group = [fork.loop, ...fork.materialized_children];
    assert.equal(new Set(group.map((node: any) => node.stable_ref)).size, 4);
    for (const child of fork.materialized_children) {
      const raw = fs.readFileSync(path.join(root, child.path), "utf8");
      assert.ok(raw.includes(`parent: ${fork.loop.stable_ref}`));
      assert.equal(run(["show", child.stable_ref, "--json"]).item.qid, child.qid);
    }
    const raw = fs.readFileSync(path.join(root, fork.loop.path), "utf8");
    assert.ok(raw.includes(`template_refs: [${template.stable_ref}]`));
    assert.ok(raw.includes(`scope_refs: [${goal.stable_ref}]`));
    const plan = run(["loop", "plan", fork.loop.stable_ref, "--json"]);
    assert.equal(plan.readiness.lanes.children.length, 3);
    assert.equal(plan.readiness.template_lineage.provenance.state, "current");
    run(["loop", "next", fork.loop.stable_ref, "--json"]);
    run(["validate", "--json"]);
    const again = run(args);
    assert.notEqual(again.loop.stable_ref, fork.loop.stable_ref);
  }
});

test("v2 work helpers persist an identity-linked manifest contract order receipt chain", () => {
  const { root, run } = fixture();
  const manifest = run(["new", "manifest", "Worker", "--id", "agent.worker", "--json"]).node;
  const work = run(["work", "contract", "new", "Work", "--id", "work.example", "--agent-id", manifest.stable_ref,
    "--kind", "example", "--inputs", "prompt:text:required", "--outputs", "result:text:required", "--json"]).node;
  assert.ok(work.stable_ref);
  assert.ok(fs.readFileSync(path.join(root, work.path), "utf8").includes(`agent_id: ${manifest.stable_ref}`));
  const order = run(["work", "order", "new", "Order", "--id", "order.example", "--work-id", work.stable_ref,
    "--requester", "user://example", "--json"]).node;
  const updatedOrder = run(["work", "order", "update", order.stable_ref, "--add-input-refs", work.id, "--json"]).node;
  assert.equal(updatedOrder.stable_ref, order.stable_ref);
  assert.ok(fs.readFileSync(path.join(root, order.path), "utf8").includes(`input_refs: [${work.stable_ref}]`));
  const receipt = run(["work", "receipt", "new", "Receipt", "--id", "receipt.example", "--work-order-id", order.stable_ref,
    "--outcome", "success", "--proof-refs", work.stable_ref, "--json"]).node;
  assert.ok(order.stable_ref && receipt.stable_ref);
  assert.ok(fs.readFileSync(path.join(root, receipt.path), "utf8").includes(`work_order_id: ${order.stable_ref}`));
  assert.equal(run(["work", "order", "status", order.stable_ref, "--json"]).order.stable_ref, order.stable_ref);
  assert.equal(run(["work", "receipt", "verify", receipt.stable_ref, "--json"]).receipt.stable_ref, receipt.stable_ref);
  const manifestPath = path.join(root, manifest.path);
  writeFile(manifestPath, fs.readFileSync(manifestPath, "utf8").replace("work_contracts: []", `work_contracts: [${work.stable_ref}]`));
  run(["work", "trigger", manifest.stable_ref, "--id", "order.from-manifest", "--json"]);
  run(["work", "validate", "--json"]);
  run(["validate", "--json"]);
});

test("v2 work payload hashes depend on identities rather than selected alias spelling", () => {
  const { root, run } = fixture();
  const manifest = run(["new", "manifest", "Worker", "--id", "agent.hash-worker", "--json"]).node;
  const work = run(["work", "contract", "new", "Contract", "--id", "work.hash", "--agent-id", manifest.id,
    "--kind", "example", "--inputs", "prompt:text:required", "--outputs", "result:text:required", "--json"]).node;
  const input = run(["new", "task", "Input evidence", "--json"]).node;
  const hashes: string[] = [];
  for (const [suffix, workRef, inputRef] of [["alias", work.id, input.id], ["stable", work.stable_ref, input.stable_ref]]) {
    const order = run(["work", "order", "new", "Order", "--id", `order.${suffix}`, "--work-id", workRef,
      "--input-refs", inputRef, "--requester", "user://example", "--json"]).node;
    const raw = fs.readFileSync(path.join(root, order.path), "utf8");
    assert.ok(raw.includes(`work_id: ${work.stable_ref}`));
    assert.ok(raw.includes(`input_refs: [${input.stable_ref}]`));
    hashes.push(raw.match(/^payload_hash: (sha256:[a-f0-9]{64})$/m)![1]);
  }
  assert.equal(hashes[0], hashes[1]);
  const first = run(["work", "trigger", work.id, "--id", "order.trigger-first", "--json"]);
  const workPath = path.join(root, work.path);
  writeFile(workPath, fs.readFileSync(workPath, "utf8").replace("id: work.hash\n", "id: work.renamed\n"));
  const second = run(["work", "trigger", work.stable_ref, "--id", "order.trigger-second", "--json"]);
  assert.equal(first.trigger.payload_hash, second.trigger.payload_hash);
  run(["validate", "--json"]);
});

test("v2 decisions supersede exact identities and reject non-decision identity targets", () => {
  const { root, run } = fixture();
  const decision = run(["new", "dec", "Earlier decision", "--json"]).node;
  const successor = run(["new", "dec", "Successor", "--supersedes", decision.stable_ref, "--json"]).node;
  assert.ok(fs.readFileSync(path.join(root, successor.path), "utf8").includes(`supersedes: ${decision.stable_ref}`));
  const task = run(["new", "task", "Not a decision", "--json"]).node;
  const before = snapshotFiles(root);
  const wrong = spawnSync(process.execPath, [cli, "new", "dec", "Wrong", "--supersedes", task.stable_ref, "--json"], { cwd: root, encoding: "utf8" });
  assert.notEqual(wrong.status, 0);
  assert.match(wrong.stderr, /must resolve to one decision/);
  assert.deepEqual(snapshotFiles(root), before);
  const successorPath = path.join(root, successor.path);
  writeFile(successorPath, fs.readFileSync(successorPath, "utf8").replace(decision.stable_ref, task.stable_ref));
  const invalid = spawnSync(process.execPath, [cli, "validate", "--json"], { cwd: root, encoding: "utf8" });
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stdout, /different decision identity/);
});

test("v2 unresolved immutable refs are validation errors rather than opaque external URLs", () => {
  const { root, run } = fixture();
  const task = run(["new", "task", "Unresolved proof", "--json"]).node;
  const file = path.join(root, task.path);
  const missing = `mdkg://${task.identity.graph_id}/00000000-0000-4000-8000-000000000000`;
  writeFile(file, fs.readFileSync(file, "utf8").replace("refs: []", `refs: [${missing}]`));
  const before = snapshotFiles(root);
  const invalid = spawnSync(process.execPath, [cli, "validate", "--json"], { cwd: root, encoding: "utf8" });
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stdout, /unresolved or ambiguous immutable identity/);
  assert.deepEqual(snapshotFiles(root), before);
});

test("v2 manifest and capability discovery derive identity from authored data and retain ambiguous aliases", () => {
  const { root, run } = fixture();
  const first = run(["new", "manifest", "First capability", "--id", "agent.first", "--json"]).node;
  const second = run(["new", "manifest", "Second capability", "--id", "agent.second", "--json"]).node;
  const cachePath = path.join(root, ".mdkg/index/capabilities.json");
  const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
  cache.records = [];
  writeFile(cachePath, JSON.stringify(cache));
  assert.equal(run(["manifest", "show", first.stable_ref, "--json"]).item.stable_ref, first.stable_ref);
  assert.equal(run(["capability", "show", second.stable_ref, "--json"]).item.stable_ref, second.stable_ref);
  writeFile(path.join(root, second.path), fs.readFileSync(path.join(root, second.path), "utf8").replace("id: agent.second\n", "id: agent.first\n"));
  const before = snapshotFiles(root);
  for (const command of ["manifest", "capability"]) {
    for (const node of [first, second]) assert.equal(run([command, "show", node.stable_ref, "--json"]).item.title, node.title);
    const ambiguous = spawnSync(process.execPath, [cli, command, "show", first.id, "--json"], { cwd: root, encoding: "utf8" });
    assert.notEqual(ambiguous.status, 0);
    assert.match(ambiguous.stderr, /ambiguous/);
  }
  assert.deepEqual(snapshotFiles(root), before);
});

test("workflow path bindings survive legacy template import and independent identity fork", () => {
  const { root, run } = fixture();
  const source = path.join(root, "template");
  writeRootConfig(source); writeDefaultTemplates(source);
  writeFile(path.join(source, ".mdkg/core/core.md"), "# core\n");
  const sourceRun = (args: string[]) => run([...args, "--root", source]);
  const owner = sourceRun(["new", "manifest", "Template owner", "--id", "agent.template", "--json"]).node;
  const work = sourceRun(["work", "contract", "new", "Template contract", "--id", "work.template", "--agent-id", owner.id,
    "--kind", "example", "--inputs", "prompt:text:required", "--outputs", "result:text:required", "--json"]).node;
  const ownerPath = path.join(source, owner.path);
  writeFile(ownerPath, fs.readFileSync(ownerPath, "utf8").replace("work_contracts: []", `work_contracts: [${work.path}]`));
  const before = snapshotFiles(root);
  run(["graph", "import-template", source, "--json"]);
  assert.deepEqual(snapshotFiles(root), before);
  run(["graph", "import-template", source, "--apply", "--json"]);
  const importedOwner = run(["show", owner.id, "--json"]).item;
  const importedWork = run(["show", work.id, "--json"]).item;
  assert.ok(fs.readFileSync(path.join(root, importedOwner.path), "utf8").includes(`work_contracts: [${importedWork.stable_ref}]`));
  run(["validate", "--json"]);
  // Accepted legacy path syntax in a v2 source must also acquire the correct
  // target-owned identity when an independent project is forked.
  const importedOwnerPath = path.join(root, importedOwner.path);
  writeFile(importedOwnerPath, fs.readFileSync(importedOwnerPath, "utf8").replace(`work_contracts: [${importedWork.stable_ref}]`, `work_contracts: [${importedWork.path}]`));
  const forkSource = path.join(root, "fork-source");
  fs.cpSync(path.join(root, ".mdkg"), path.join(forkSource, ".mdkg"), { recursive: true });
  const target = path.join(root, "fork-target");
  run(["graph", "fork", forkSource, "--target", "fork-target", "--json"]);
  const forkedWork = run(["show", work.id, "--root", target, "--json"]).item;
  const forkedOwner = run(["show", owner.id, "--root", target, "--json"]).item;
  assert.notEqual(forkedWork.stable_ref, importedWork.stable_ref);
  assert.ok(fs.readFileSync(path.join(target, forkedOwner.path), "utf8").includes(`work_contracts: [${forkedWork.stable_ref}]`));
  run(["validate", "--root", target, "--json"]);
});

test("v2 archive sidecars allocate identities and bind graph references before writing artifacts", () => {
  const { root, run } = fixture();
  const task = run(["new", "task", "Archive proof", "--json"]).node;
  writeFile(path.join(root, "input.txt"), "immutable artifact bytes\n");
  const archive = run(["archive", "add", "input.txt", "--id", "archive.example", "--refs", task.stable_ref, "--json"]).archive;
  assert.ok(archive.stable_ref);
  const shown = run(["show", archive.stable_ref, "--json"]).item;
  assert.equal(shown.identity.graph_id, task.identity.graph_id);
  assert.ok(fs.readFileSync(path.join(root, archive.path), "utf8").includes(`refs: [${task.stable_ref}]`));
  const before = snapshotFiles(root);
  assert.equal(run(["archive", "show", archive.stable_ref, "--json"]).item.stable_ref, archive.stable_ref);
  assert.equal(run(["archive", "list", "--json"]).items[0].stable_ref, archive.stable_ref);
  assert.ok(JSON.stringify(run(["archive", "verify", archive.stable_ref, "--json"])).includes(archive.stable_ref));
  assert.deepEqual(snapshotFiles(root), before);
  run(["archive", "verify", "--json"]);
  const evidence = run(["new", "task", "Archive consumer", "--refs", archive.archive_uri,
    "--artifacts", `${archive.archive_uri},artifact://external/proof,docs/proof.txt`, "--json"]).node;
  const evidenceBytes = fs.readFileSync(path.join(root, evidence.path), "utf8");
  assert.ok(evidenceBytes.includes(`refs: [${archive.stable_ref}]`));
  assert.ok(evidenceBytes.includes(`artifacts: [${archive.stable_ref}, artifact://external/proof, docs/proof.txt]`));
  const sidecar = path.join(root, archive.path);
  writeFile(sidecar, fs.readFileSync(sidecar, "utf8").replace("id: archive.example\n", "id: archive.renamed\n"));
  assert.equal(run(["archive", "show", archive.stable_ref, "--json"]).item.id, "archive.renamed");
  run(["validate", "--json"]);
});
