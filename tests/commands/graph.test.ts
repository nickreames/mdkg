import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function json<T>(output: string): T {
  return JSON.parse(output) as T;
}

function updateFrontmatter(filePath: string, replacements: Record<string, string>): void {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const seen = new Set<string>();
    const lines = rawFrontmatter.split(/\r?\n/).map((line: string) => {
      for (const [key, value] of Object.entries(replacements)) {
        if (line.startsWith(`${key}:`)) {
          seen.add(key);
          return `${key}: ${value}`;
        }
      }
      return line;
    });
    for (const [key, value] of Object.entries(replacements)) {
      if (!seen.has(key)) {
        lines.push(`${key}: ${value}`);
      }
    }
    return `---\n${lines.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
}

function convertManifestScaffoldToLegacySpec(root: string, node: { path: string }): { path: string } {
  const manifestPath = path.join(root, node.path);
  const specPath = path.join(path.dirname(manifestPath), "SPEC.md");
  fs.renameSync(manifestPath, specPath);
  updateFrontmatter(specPath, { type: "spec" });
  return { ...node, path: path.relative(root, specPath).split(path.sep).join("/") };
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    })
    .sort();
}

function hashTree(root: string): string {
  const hash = crypto.createHash("sha256");
  for (const file of listFiles(root)) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    hash.update(relative);
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function createSourceGraph(root: string, name: string): string {
  const source = path.join(root, name);
  fs.mkdirSync(source, { recursive: true });
  run(["init", "--agent"], source);
  run(["new", "goal", "demo start goal", "--status", "todo", "--priority", "1", "--json"], source);
  run(["new", "task", "demo implementation task", "--status", "todo", "--priority", "1", "--json"], source);
  run(["index"], source);
  return source;
}

function createLinkedTemplateGraph(root: string, name: string, activateStartGoal = false): string {
  const source = path.join(root, name);
  fs.mkdirSync(source, { recursive: true });
  run(["init", "--agent"], source);
  run(["new", "goal", "template start goal", "--status", "todo", "--priority", "1", "--json"], source);
  run([
    "new",
    "task",
    "template linked task",
    "--status",
    "todo",
    "--priority",
    "1",
    "--parent",
    "goal-1",
    "--refs",
    "goal-1",
    "--json",
  ], source);
  const taskPath = path.join(source, ".mdkg", "work", "task-1-template-linked-task.md");
  fs.appendFileSync(taskPath, "\nMentions root:goal-1 and task-1 for rewrite proof.\n", "utf8");
  if (activateStartGoal) {
    run(["goal", "activate", "goal-1", "--json"], source);
  }
  run(["index"], source);
  return source;
}

function migrateFixture(root: string): void {
  // Legacy seed prose carries references to its authoring repository. They
  // are not identity evidence in this disposable graph; remove explicitly.
  for (const name of ["SOUL.md", "COLLABORATION.md"]) {
    const file = path.join(root, ".mdkg/core", name);
    if (fs.existsSync(file)) updateFrontmatter(file, { refs: "[]" });
  }
  const args = ["graph", "migrate", "--graph-id", crypto.randomUUID(), "--origin", crypto.randomUUID(), "--json"];
  const plan = JSON.parse(run(args, root).stdout);
  assert.deepEqual(plan.blocking, []);
  run([...args, "--apply", "--plan-hash", plan.plan_hash], root);
}

test("v2 transport preserves same-project clone identities and gives independent forks bound lineage", () => {
  const root = makeTempDir("mdkg-identity-transport-");
  run(["init", "--graph-only"], root);
  const source = createLinkedTemplateGraph(root, "source");
  migrateFixture(source);
  const sourceFormat = JSON.parse(fs.readFileSync(path.join(source, ".mdkg/graph.json"), "utf8"));
  fs.mkdirSync(path.join(source, ".mdkg/state"), { recursive: true });
  fs.writeFileSync(path.join(source, ".mdkg/state/selected-goal.json"), "private checkout selection");
  const sourceBefore = hashTree(source);
  const cloned = JSON.parse(run(["graph", "clone", "source", "--target", "clone", "--json"], root).stdout);
  const forked = JSON.parse(run(["graph", "fork", "source", "--target", "fork", "--json"], root).stdout);
  assert.equal(hashTree(source), sourceBefore, "transport never mutates source bytes");
  assert.equal(cloned.identity.target_graph_id, sourceFormat.graph_id);
  assert.equal(cloned.identity.preserved_node_identities, true);
  assert.notEqual(forked.identity.target_graph_id, sourceFormat.graph_id);
  assert.equal(forked.identity.preserved_node_identities, false);
  const task = ".mdkg/work/task-1-template-linked-task.md";
  const original = fs.readFileSync(path.join(source, task), "utf8");
  assert.equal(fs.readFileSync(path.join(root, "clone", task), "utf8"), original);
  const forkBody = fs.readFileSync(path.join(root, "fork", task), "utf8");
  assert.ok(forkBody.includes(`graph_id: ${forked.identity.target_graph_id}`));
  assert.ok(!forkBody.includes(`parent: mdkg://${sourceFormat.graph_id}/`));
  assert.ok(forkBody.includes(`parent: mdkg://${forked.identity.target_graph_id}/`));
  assert.ok(forkBody.includes("Mentions root:goal-1 and task-1 for rewrite proof."));
  const forkFormat = JSON.parse(fs.readFileSync(path.join(root, "fork/.mdkg/graph.json"), "utf8"));
  assert.equal(forkFormat.lineage.source_graph_id, sourceFormat.graph_id);
  assert.equal(forkFormat.migration_receipt, undefined);
  assert.ok(fs.existsSync(path.join(root, "fork", forked.identity.receipt_path)));
  for (const target of ["clone", "fork"]) {
    assert.equal(fs.existsSync(path.join(root, target, ".mdkg/state/selected-goal.json")), false);
    assert.equal(fs.existsSync(path.join(root, target, ".mdkg/state/identity-transactions")), false);
    run(["validate", "--json"], path.join(root, target));
  }
});

test("v2 template imports are target-owned, deterministically previewed, cross-linked and body-preserving", () => {
  const root = makeTempDir("mdkg-identity-template-");
  run(["init", "--graph-only"], root);
  run(["new", "task", "Existing local node"], root);
  migrateFixture(root);
  const source = createLinkedTemplateGraph(root, "template");
  migrateFixture(source);
  const before = hashTree(root);
  const preview = JSON.parse(run(["graph", "import-template", "template", "--json"], root).stdout);
  const repeated = JSON.parse(run(["graph", "import-template", "template", "--json"], root).stdout);
  assert.deepEqual(preview.identity, repeated.identity);
  assert.equal(hashTree(root), before);
  const applied = JSON.parse(run(["graph", "import-template", "template", "--apply", "--json"], root).stdout);
  assert.deepEqual(applied.identity, preview.identity);
  const targetFormat = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/graph.json"), "utf8"));
  const task = applied.rewritten_ids.find((item: any) => item.from_id === "task-1");
  const goal = applied.identity.mappings.find((item: any) => item.from_alias === "goal-1");
  const raw = fs.readFileSync(path.join(root, task.to_path), "utf8");
  assert.ok(raw.includes(`graph_id: ${targetFormat.graph_id}`));
  assert.ok(raw.includes(`parent: ${goal.to}`));
  assert.ok(raw.includes("Mentions root:goal-1 and task-1 for rewrite proof."));
  assert.ok(fs.existsSync(path.join(root, applied.identity.receipt_path)));
  const second = JSON.parse(run(["graph", "import-template", "template", "--json"], root).stdout);
  assert.notEqual(second.identity.mappings[0].to, applied.identity.mappings[0].to);
  run(["validate", "--json"], root);
});

test("v2 template ownership and missing-binding failures happen before target writes", () => {
  const root = makeTempDir("mdkg-identity-template-refusal-");
  run(["init", "--graph-only"], root);
  const source = createLinkedTemplateGraph(root, "template");
  migrateFixture(source);
  let before = hashTree(root);
  assert.match(runFailure(["graph", "import-template", "template", "--apply"], root).stderr, /explicitly migrate the target/);
  assert.equal(hashTree(root), before);
  migrateFixture(root);
  updateFrontmatter(path.join(source, ".mdkg/work/task-1-template-linked-task.md"), { refs: "[rule-999]" });
  before = hashTree(root);
  assert.match(runFailure(["graph", "import-template", "template", "--apply"], root).stderr, /lacks an imported identity binding/);
  assert.equal(hashTree(root), before);
});

test("v2 read-only subgraph mounts retain source identities without source mutation authority", () => {
  const root = makeTempDir("mdkg-identity-mount-");
  run(["init", "--graph-only"], root);
  const source = createLinkedTemplateGraph(root, "child");
  migrateFixture(source);
  const format = JSON.parse(fs.readFileSync(path.join(source, ".mdkg/graph.json"), "utf8"));
  run(["bundle", "create", "--output", path.join(root, "child.mdkg.zip"), "--json"], source);
  run(["subgraph", "add", "child", "child.mdkg.zip", "--json"], root);
  const { loadIndex } = require("../../graph/index_cache");
  const { loadConfig } = require("../../core/config");
  const { index } = loadIndex({ root, config: loadConfig(root), noCache: true });
  const node = index.nodes["child:task-1"];
  assert.equal(node.identity.graph_id, format.graph_id);
  assert.equal(node.source.read_only, true);
  const sourceBefore = hashTree(source);
  assert.match(runFailure(["task", "start", "child:task-1"], root).stderr, /read.only|imported/);
  assert.equal(hashTree(source), sourceBefore);
});

test("graph clone preserves IDs from a bundle into an empty target", () => {
  const root = makeTempDir("mdkg-graph-clone-");
  run(["init", "--agent"], root);
  const source = createSourceGraph(root, "source");
  const bundle = json<{ path: string; bundle_hash: string }>(
    run(["bundle", "create", "--output", path.join(root, "source.mdkg.zip"), "--json"], source).stdout
  );

  const cloned = json<{
    action: string;
    ok: boolean;
    mode: string;
    target: string;
    preserved_ids: boolean;
    files_written: string[];
    skipped_paths: string[];
    source_hash: { bundle_hash: string };
    validation: { ok: boolean; error_count: number };
  }>(run(["graph", "clone", "source.mdkg.zip", "--target", "clones/demo", "--json"], root).stdout);

  assert.equal(cloned.action, "graph.clone");
  assert.equal(cloned.ok, true);
  assert.equal(cloned.mode, "clone");
  assert.equal(cloned.target, "clones/demo");
  assert.equal(cloned.preserved_ids, true);
  assert.equal(cloned.source_hash.bundle_hash, bundle.bundle_hash);
  assert.equal(cloned.validation.ok, true);
  assert.equal(cloned.validation.error_count, 0);
  assert.ok(cloned.files_written.includes(".mdkg/config.json"));
  assert.ok(cloned.skipped_paths.includes(".mdkg/index/global.json"));

  const target = path.join(root, "clones", "demo");
  run(["validate", "--json"], target);
  const goal = json<{ item: { id: string; title: string } }>(run(["show", "goal-1", "--json"], target).stdout);
  const task = json<{ item: { id: string; title: string } }>(run(["show", "task-1", "--json"], target).stdout);
  assert.equal(goal.item.id, "goal-1");
  assert.equal(goal.item.title, "demo start goal");
  assert.equal(task.item.id, "task-1");
  assert.equal(task.item.title, "demo implementation task");
});

test("graph refs reports canonical manifest and legacy spec workflow relationships", () => {
  const root = makeTempDir("mdkg-graph-manifest-refs-");
  run(["init", "--agent"], root);
  const manifest = json<{ node: { path: string } }>(
    run(["new", "manifest", "Manifest Worker", "--id", "agent.manifest-worker", "--json"], root).stdout
  ).node;
  const manifestWork = json<{ node: { path: string } }>(
    run([
      "work",
      "contract",
      "new",
      "Manifest Work",
      "--id",
      "work.manifest",
      "--agent-id",
      "agent.manifest-worker",
      "--kind",
      "analysis",
      "--inputs",
      "request:text:required",
      "--outputs",
      "result:text:required",
      "--json",
    ], root).stdout
  ).node;
  updateFrontmatter(path.join(root, manifest.path), {
    work_contracts: `[${path.basename(path.dirname(manifestWork.path))}/WORK.md]`,
    relates: "[work.manifest]",
  });

  const legacy = convertManifestScaffoldToLegacySpec(
    root,
    json<{ node: { path: string } }>(
      run(["new", "manifest", "Legacy Worker", "--id", "agent.legacy-worker", "--json"], root).stdout
    ).node
  );
  const legacyWork = json<{ node: { path: string } }>(
    run([
      "work",
      "contract",
      "new",
      "Legacy Work",
      "--id",
      "work.legacy",
      "--agent-id",
      "agent.legacy-worker",
      "--kind",
      "analysis",
      "--inputs",
      "request:text:required",
      "--outputs",
      "result:text:required",
      "--json",
    ], root).stdout
  ).node;
  updateFrontmatter(path.join(root, legacy.path), {
    work_contracts: `[${path.basename(path.dirname(legacyWork.path))}/WORK.md]`,
    relates: "[work.legacy]",
  });
  run(["index"], root);

  const manifestRefs = json<{
    target: { type: string; path: string };
    incoming: { relates: Array<{ node?: { qid: string; type: string; path: string } }> };
    outgoing: { relates: Array<{ node?: { qid: string; type: string; path: string } }> };
  }>(run(["graph", "refs", "agent.manifest-worker", "--json"], root).stdout);
  assert.equal(manifestRefs.target.type, "manifest");
  assert.equal(manifestRefs.target.path, ".mdkg/work/agent.manifest-worker-manifest-worker/MANIFEST.md");
  assert.ok(manifestRefs.incoming.relates.some((ref) => ref.node?.qid === "root:work.manifest"));
  assert.ok(manifestRefs.outgoing.relates.some((ref) => ref.node?.qid === "root:work.manifest"));

  const legacyRefs = json<{
    target: { type: string; path: string };
    incoming: { relates: Array<{ node?: { qid: string; type: string; path: string } }> };
    outgoing: { relates: Array<{ node?: { qid: string; type: string; path: string } }> };
  }>(run(["graph", "refs", "agent.legacy-worker", "--json"], root).stdout);
  assert.equal(legacyRefs.target.type, "spec");
  assert.equal(legacyRefs.target.path, ".mdkg/work/agent.legacy-worker-legacy-worker/SPEC.md");
  assert.ok(legacyRefs.incoming.relates.some((ref) => ref.node?.qid === "root:work.legacy"));
  assert.ok(legacyRefs.outgoing.relates.some((ref) => ref.node?.qid === "root:work.legacy"));
});

test("graph fork preserves IDs from a directory and selects the requested start goal", () => {
  const root = makeTempDir("mdkg-graph-fork-");
  run(["init", "--agent"], root);
  const source = createSourceGraph(root, "templates/source");
  const beforeHash = hashTree(source);

  const forked = json<{
    action: string;
    ok: boolean;
    mode: string;
    target: string;
    preserved_ids: boolean;
    start_goal?: { requested: string; qid: string; path: string };
    selected_goal?: { qid: string; path: string };
    validation: { ok: boolean; error_count: number };
  }>(
    run([
      "graph",
      "fork",
      "templates/source",
      "--target",
      "forks/demo",
      "--start-goal",
      "goal-1",
      "--json",
    ], root).stdout
  );

  assert.equal(forked.action, "graph.fork");
  assert.equal(forked.ok, true);
  assert.equal(forked.mode, "fork");
  assert.equal(forked.target, "forks/demo");
  assert.equal(forked.preserved_ids, true);
  assert.equal(forked.start_goal?.requested, "goal-1");
  assert.equal(forked.start_goal?.qid, "root:goal-1");
  assert.match(forked.start_goal?.path ?? "", /\.mdkg\/work\/goal-1-demo-start-goal\.md$/);
  assert.equal(forked.selected_goal?.qid, "root:goal-1");
  assert.equal(forked.validation.ok, true);
  assert.equal(forked.validation.error_count, 0);
  assert.equal(hashTree(source), beforeHash, "source directory changed during graph fork");

  const target = path.join(root, "forks", "demo");
  const current = json<{ goal: { id: string; qid: string } }>(run(["goal", "current", "--json"], target).stdout);
  assert.equal(current.goal.id, "goal-1");
  assert.equal(current.goal.qid, "root:goal-1");
  run(["validate", "--json"], target);
});

test("graph clone refuses unsafe targets and live-source self nesting", () => {
  const root = makeTempDir("mdkg-graph-safety-");
  run(["init", "--agent"], root);
  createSourceGraph(root, "source");

  const parentTarget = runFailure(["graph", "clone", "source", "--target", "../outside", "--json"], root);
  assert.equal(parentTarget.status, 1);
  assert.match(parentTarget.stderr, /--target cannot contain parent-directory components/);

  const nestedTarget = runFailure(["graph", "clone", "source", "--target", "source/clone", "--json"], root);
  assert.equal(nestedTarget.status, 1);
  assert.match(nestedTarget.stderr, /target must not be inside the live directory source/);
});

test(
  "graph clone and fork reject target symlink escapes before writing",
  { skip: process.platform === "win32" ? "symlink creation requires elevated Windows privileges" : false },
  () => {
    const root = makeTempDir("mdkg-graph-target-symlink-");
    run(["init", "--agent"], root);
    createSourceGraph(root, "source");

    const directOutside = makeTempDir("mdkg-graph-target-direct-outside-");
    const directTarget = path.join(root, "clones", "demo");
    fs.mkdirSync(path.dirname(directTarget), { recursive: true });
    fs.symlinkSync(directOutside, directTarget, "dir");

    const directFailure = runFailure(
      ["graph", "clone", "source", "--target", "clones/demo", "--json"],
      root
    );
    assert.match(directFailure.stderr, /--target must not contain symbolic links/);
    assert.deepEqual(fs.readdirSync(directOutside), []);

    const ancestorOutside = makeTempDir("mdkg-graph-target-ancestor-outside-");
    fs.symlinkSync(ancestorOutside, path.join(root, "forks"), "dir");
    const ancestorFailure = runFailure(
      [
        "graph",
        "fork",
        "source",
        "--target",
        "forks/demo",
        "--start-goal",
        "goal-1",
        "--json",
      ],
      root
    );
    assert.match(ancestorFailure.stderr, /--target must not contain symbolic links/);
    assert.deepEqual(fs.readdirSync(ancestorOutside), []);

    const validTarget = path.join(root, "valid", "empty");
    fs.mkdirSync(validTarget, { recursive: true });
    run(["graph", "clone", "source", "--target", "valid/empty", "--json"], root);
    assert.equal(fs.existsSync(path.join(validTarget, ".mdkg", "config.json")), true);
  }
);

test("graph import-template rewrites same-repo IDs and links with dry-run then apply", () => {
  const root = makeTempDir("mdkg-graph-import-");
  run(["init", "--agent"], root);
  run(["new", "goal", "local existing goal", "--status", "todo", "--priority", "1", "--json"], root);
  run(["goal", "activate", "goal-1", "--json"], root);
  run(["new", "task", "local existing task", "--status", "todo", "--priority", "1", "--json"], root);
  const source = createLinkedTemplateGraph(root, "templates/source", true);
  const sourceHashBefore = hashTree(source);
  const beforeHash = hashTree(path.join(root, ".mdkg", "work"));

  const noSelect = runFailure(["graph", "import-template", "templates/source", "--apply", "--json"], root);
  assert.match(noSelect.stderr, /would create multiple active root goals/);
  assert.equal(hashTree(path.join(root, ".mdkg", "work")), beforeHash, "failed import mutated root work tree");

  const dryRun = json<{
    action: string;
    mode: string;
    files_written: string[];
    planned_paths: string[];
    rewritten_ids: Array<{ from_id: string; to_id: string }>;
    rewritten_refs: Array<{ field: string; from: string; to: string }>;
    selected_goal?: { qid: string; planned: boolean };
    activated_goal?: { qid: string; status: string; goal_state: string; planned: boolean };
    paused_goals: Array<{ qid: string; status: string; goal_state: string; source: string; planned: boolean }>;
  }>(
    run([
      "graph",
      "import-template",
      "templates/source",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--dry-run",
      "--json",
    ], root).stdout
  );

  assert.equal(dryRun.action, "graph.import_template");
  assert.equal(dryRun.mode, "import_template_dry_run");
  assert.deepEqual(dryRun.files_written, []);
  assert.ok(dryRun.planned_paths.includes(".mdkg/work/goal-2-template-start-goal.md"));
  assert.ok(dryRun.planned_paths.includes(".mdkg/work/task-2-template-linked-task.md"));
  assert.ok(dryRun.rewritten_ids.some((item) => item.from_id === "goal-1" && item.to_id === "goal-2"));
  assert.ok(dryRun.rewritten_ids.some((item) => item.from_id === "task-1" && item.to_id === "task-2"));
  assert.ok(dryRun.rewritten_refs.some((item) => item.field === "parent" && item.from === "goal-1" && item.to === "goal-2"));
  assert.equal(dryRun.selected_goal?.qid, "root:goal-2");
  assert.equal(dryRun.selected_goal?.planned, true);
  assert.equal(dryRun.activated_goal?.qid, "root:goal-2");
  assert.equal(dryRun.activated_goal?.status, "progress");
  assert.equal(dryRun.activated_goal?.goal_state, "active");
  assert.equal(dryRun.activated_goal?.planned, true);
  assert.deepEqual(
    dryRun.paused_goals.map((item) => [item.qid, item.status, item.goal_state, item.source, item.planned]),
    [["root:goal-1", "blocked", "paused", "local", true]]
  );
  assert.equal(hashTree(path.join(root, ".mdkg", "work")), beforeHash, "dry-run mutated root work tree");

  const applied = json<{
    mode: string;
    files_written: string[];
    validation?: { ok: boolean; error_count: number };
    selected_goal?: { qid: string; planned: boolean };
    activated_goal?: { qid: string; status: string; goal_state: string; planned: boolean };
    paused_goals: Array<{ qid: string; status: string; goal_state: string; source: string; planned: boolean }>;
  }>(
    run([
      "graph",
      "import-template",
      "templates/source",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--apply",
      "--json",
    ], root).stdout
  );

  assert.equal(applied.mode, "import_template_applied");
  assert.ok(applied.files_written.includes(".mdkg/work/goal-2-template-start-goal.md"));
  assert.ok(applied.files_written.includes(".mdkg/work/task-2-template-linked-task.md"));
  assert.equal(applied.validation?.ok, true);
  assert.equal(applied.validation?.error_count, 0);
  assert.equal(applied.selected_goal?.qid, "root:goal-2");
  assert.equal(applied.selected_goal?.planned, false);
  assert.equal(applied.activated_goal?.qid, "root:goal-2");
  assert.equal(applied.activated_goal?.planned, false);
  assert.deepEqual(
    applied.paused_goals.map((item) => [item.qid, item.status, item.goal_state, item.source, item.planned]),
    [["root:goal-1", "blocked", "paused", "local", false]]
  );

  const importedTask = fs.readFileSync(path.join(root, ".mdkg", "work", "task-2-template-linked-task.md"), "utf8");
  assert.match(importedTask, /parent: goal-2/);
  assert.match(importedTask, /refs: \[goal-2\]/);
  assert.match(importedTask, /Mentions root:goal-2 and task-2/);
  const localGoal = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1-local-existing-goal.md"), "utf8");
  assert.match(localGoal, /status: blocked/);
  assert.match(localGoal, /goal_state: paused/);
  const importedGoal = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-2-template-start-goal.md"), "utf8");
  assert.match(importedGoal, /status: progress/);
  assert.match(importedGoal, /goal_state: active/);
  const current = json<{ goal: { id: string; qid: string } }>(run(["goal", "current", "--json"], root).stdout);
  assert.equal(current.goal.id, "goal-2");
  run(["validate", "--json"], root);
  assert.equal(hashTree(source), sourceHashBefore, "source directory changed during import-template");
});

test("graph import-template rejects closed selected start goals before writing", () => {
  for (const action of ["done", "archive"] as const) {
    const root = makeTempDir(`mdkg-graph-import-${action}-`);
    run(["init", "--agent"], root);
    const source = createLinkedTemplateGraph(root, "templates/source");
    if (action === "done") {
      run(["goal", "done", "goal-1", "--json"], source);
    } else {
      // Goal archive has no reason option; exercise the actual lifecycle
      // transition rather than relying on a formerly ignored queue-only flag.
      run(["goal", "archive", "goal-1", "--json"], source);
    }
    run(["index"], source);
    const beforeHash = hashTree(path.join(root, ".mdkg", "work"));

    const failed = runFailure([
      "graph",
      "import-template",
      "templates/source",
      "--start-goal",
      "goal-1",
      "--select-goal",
      "--apply",
      "--json",
    ], root);

    assert.match(failed.stderr, /cannot select achieved or archived imported start goal/);
    assert.equal(hashTree(path.join(root, ".mdkg", "work")), beforeHash, "closed start-goal import mutated root work tree");
  }
});
