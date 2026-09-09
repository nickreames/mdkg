import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { loadConfig } = require("../../core/config");
const { loadIndex } = require("../../graph/index_cache");
const { createGraphFormat } = require("../../graph/identity");
const cli = path.resolve(__dirname, "../../cli.js");

function run(root: string, args: string[], expected = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, expected, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (dir: string) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      result[path.relative(root, file)] = stat.isDirectory() ? `directory:${stat.mode}` :
        `${stat.mode}:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
      if (stat.isDirectory()) visit(file);
    }
  };
  visit(root);
  return result;
}

function assertUnchanged(root: string, before: Record<string, string>, label = "inspection") {
  const after = snapshot(root);
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter(file => before[file] !== after[file]);
  assert.deepEqual(changed, [], `${label} must be observational`);
}

function configure(root: string, change: (config: any) => void) {
  const file = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  change(config); writeFile(file, JSON.stringify(config));
}

function fixture(t: { after(fn: () => void): void }, version: number, backend: string) {
  const root = makeTempDir("mdkg-observational-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  configure(root, config => { config.index.backend = backend; });
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  if (version === 2) writeFile(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat()));
  const task = JSON.parse(run(root, ["new", "task", "Alpha", "--json"]).stdout).node;
  writeFile(path.join(root, ".mdkg/skills/focused/SKILL.md"),
    "---\nname: focused\ndescription: Focused test skill\n---\n# Purpose\nRead synthetic context.\n");
  const taskPath = path.join(root, task.path);
  writeFile(taskPath, fs.readFileSync(taskPath, "utf8").replace("skills: []", "skills: [focused]"));
  run(root, ["index"]);
  // Real staged and unstaged authoring state plus unrelated local bytes.
  for (const args of [["init", "-q"], ["add", ".mdkg/work"]]) {
    const git = spawnSync("git", args, { cwd: root, encoding: "utf8", env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" } });
    assert.equal(git.status, 0, git.stderr);
  }
  writeFile(taskPath, `${fs.readFileSync(taskPath, "utf8")}\nUnstaged intent.\n`);
  writeFile(path.join(root, ".mdkg/db/runtime/preserved.bin"), "checkout-local sentinel\n");
  writeFile(path.join(root, "user-notes.txt"), "unrelated user content\n");
  return { root, task };
}

function prepareCache(root: string, state: "missing" | "stale") {
  const dir = path.join(root, ".mdkg/index");
  if (state === "missing") fs.rmSync(dir, { recursive: true, force: true });
  else for (const name of fs.readdirSync(dir)) fs.utimesSync(path.join(dir, name), 1, 1);
}

const commands = [
  ["show", "task-1", "--json"], ["list", "--json"], ["search", "Alpha", "--json"],
  ["next"], ["pack", "task-1", "--dry-run", "--skills", "none"],
  ["pack", "task-1", "--dry-run", "--skills", "auto"],
];

for (const version of [1, 2]) for (const backend of ["json", "sqlite"]) {
  for (const state of ["missing", "stale"] as const) {
    test(`v${version} ${backend} inspection preserves ${state} caches and all checkout bytes`, t => {
      const { root } = fixture(t, version, backend);
      prepareCache(root, state);
      const before = snapshot(root);
      for (const args of commands) {
        const result = run(root, args);
        assert.match(result.stdout, /Alpha|task-1/);
        assertUnchanged(root, before, args.join(" "));
      }
      run(root, ["index"]);
      assert.ok(fs.existsSync(path.join(root, ".mdkg/index/global.json")));
      if (backend === "sqlite") run(root, ["db", "index", "verify", "--json"]);
      run(root, ["validate", "--json"]);
    });
  }

  test(`v${version} ${backend} no-cache inspection derives current nodes without writes`, t => {
    const { root } = fixture(t, version, backend);
    prepareCache(root, "missing");
    configure(root, config => { config.index.auto_reindex = false; });
    const before = snapshot(root);
    for (const args of commands) {
      run(root, [...args, "--no-cache", "--no-reindex"]);
      assertUnchanged(root, before);
    }
  });
}

for (const backend of ["json", "sqlite"]) {
  for (const policy of ["config", "flag"] as const) {
    test(`legacy ${backend} ${policy} auto-reindex opt-out refuses a missing cache without writes`, t => {
      const { root } = fixture(t, 1, backend);
      prepareCache(root, "missing");
      if (policy === "config") configure(root, config => { config.index.auto_reindex = false; });
      const before = snapshot(root);
      for (const args of commands) {
        const result = run(root, policy === "flag" ? [...args, "--no-reindex"] : args, 4);
        assert.match(result.stderr, /index missing and auto-reindex is disabled/);
        assertUnchanged(root, before);
      }
    });
  }

  test(`legacy ${backend} disabled reindex uses a stale cache without refreshing it`, t => {
    const { root } = fixture(t, 1, backend);
    configure(root, config => { config.index.auto_reindex = false; });
    prepareCache(root, "stale");
    const before = snapshot(root);
    for (const args of commands) {
      const result = run(root, args);
      assert.match(result.stderr, /index is stale/);
      assertUnchanged(root, before);
    }
  });
}

for (const version of [1, 2]) for (const backend of ["json", "sqlite"]) {
test(`v${version} ${backend} inspection overrides persistence for authored and imported caches`, t => {
  const { root } = fixture(t, version, backend);
  const child = path.join(root, "child");
  fs.mkdirSync(child); writeRootConfig(child); writeDefaultTemplates(child);
  writeFile(path.join(child, ".mdkg/core/core.md"), "# Child\n");
  run(child, ["new", "task", "Child context", "--json"]);
  run(child, ["bundle", "create", "--profile", "private", "--json"]);
  configure(root, config => {
    config.subgraphs.child = { enabled: true, visibility: "private", sources: [
      { path: "child/.mdkg/bundles/private/all.mdkg.zip", enabled: true, expected_profile: "private" },
    ] };
  });
  prepareCache(root, "missing");
  const before = snapshot(root);
  const loaded = loadIndex({ root, config: loadConfig(root), inspection: true, persistReindex: true });
  assert.ok(loaded.index.nodes["child:task-1"]);
  assertUnchanged(root, before);
  run(root, ["show", "child:task-1", "--json"]);
  const ambiguous = run(root, ["show", "task-1", "--json"], 3);
  assert.match(ambiguous.stderr, /ambiguous id/);
  assertUnchanged(root, before);
  for (const args of commands) {
    run(root, args.map(arg => arg === "task-1" ? "root:task-1" : arg));
    assertUnchanged(root, before);
  }
  run(root, ["index"]);
  assert.ok(fs.existsSync(path.join(root, ".mdkg/index/subgraphs.json")));
});
}

test("legacy inspection succeeds on a read-only graph without creating caches", t => {
  if (process.platform === "win32" || process.getuid?.() === 0) { t.skip("requires enforced POSIX permissions"); return; }
  const { root } = fixture(t, 1, "json");
  prepareCache(root, "missing");
  const directories: string[] = [];
  const protect = (dir: string) => {
    directories.push(dir);
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      if (fs.statSync(file).isDirectory()) protect(file); else fs.chmodSync(file, 0o444);
    }
    fs.chmodSync(dir, 0o555);
  };
  protect(path.join(root, ".mdkg"));
  try {
    const before = snapshot(root);
    for (const args of commands) { run(root, args); assertUnchanged(root, before); }
  } finally {
    for (const dir of directories) fs.chmodSync(dir, 0o755);
  }
});
