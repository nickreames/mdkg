import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const { loadConfig } = require(path.join(runtime, "core/config"));
const { writeDerivedIndexes } = require(path.join(runtime, "graph/reindex"));
const { writeCacheFile } = require(path.join(runtime, "graph/cache_output"));
const { reservePlannedNumericIds } = require(path.join(runtime, "graph/sqlite_index"));
const { identityDerivedOutputConflicts } = require(path.join(runtime, "graph/identity_validation"));
const env = { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_SYSTEM: "/dev/null", GIT_CONFIG_NOSYSTEM: "1", GIT_TERMINAL_PROMPT: "0" };
function git(root: string, args: string[]) {
  const r = spawnSync("git", args, { cwd: root, env, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
}
function fixture(t: any, topology = "normal") {
  const base = makeTempDir("cache-git-metadata-");
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  let root = path.join(base, "repo"); fs.mkdirSync(root);
  if (topology === "separate") git(base, ["init", "-q", "--separate-git-dir", path.join(root, "admin"), root]);
  else git(root, ["init", "-q"]);
  if (topology === "worktree") {
    git(root, ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "--no-verify", "-qm", "fixture"]);
    const child = path.join(root, "child"); git(root, ["worktree", "add", "-qb", "child", child]); root = child;
  }
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Fixture\n");
  return { base, root, config: loadConfig(root) };
}
function inventory(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name), key = path.relative(root, file);
    if (entry.isDirectory()) { result[key] = "directory"; walk(file); }
    else if (entry.isSymbolicLink()) result[key] = "link:" + fs.readlinkSync(file);
    else result[key] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } } walk(root); return result;
}
function refused(f: { base: string }, action: () => unknown) {
  const before = inventory(f.base); assert.throws(action, /Git metadata/i); assert.deepEqual(inventory(f.base), before);
}

test("ambiguous Git administration refuses generated writes without weakening non-Git use", t => {
  const root = makeTempDir("cache-ambiguous-git-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeCacheFile(root, "valid-cache.json", "{}\n");
  writeFile(path.join(root, ".git/index"), "synthetic invalid metadata");
  const before = inventory(root);
  assert.throws(() => writeCacheFile(root, "another-cache.json", "{}\n"), /Git.*observation failed/);
  assert.deepEqual(inventory(root), before);
});

for (const topology of ["normal", "separate", "worktree"]) {
  test(`direct cache writes protect ${topology} Git administration`, t => {
    const f = fixture(t, topology), target = topology === "separate" ? "admin/config" : topology === "worktree" ? ".git" : ".git/index";
    refused(f, () => writeCacheFile(f.root, path.join(f.root, target), "{}\n"));
  });
  test(`ordinary generated caches remain usable in ${topology} Git topology`, t => {
    const f = fixture(t, topology), admin = git(f.root, ["rev-parse", "--absolute-git-dir"]), before = inventory(admin);
    f.config.index.global_index_path = "custom/nodes.json";
    const result = writeDerivedIndexes(f.root, f.config);
    assert.ok(fs.statSync(result.paths.nodes).isFile()); assert.deepEqual(inventory(admin), before);
  });
}
for (const backend of ["nodes", "capabilities", "sqlite"]) {
  test(`aggregate ${backend} cache refuses Git destination before any earlier outputs`, t => {
    const f = fixture(t, "separate"); f.config.index.global_index_path = "safe/new/nodes.json";
    if (backend === "nodes") f.config.index.global_index_path = "admin/config";
    if (backend === "capabilities") f.config.capabilities.cache_path = "admin/config";
    if (backend === "sqlite") { f.config.index.backend = "sqlite"; f.config.index.sqlite_path = "admin/config"; }
    refused(f, () => writeDerivedIndexes(f.root, f.config));
  });
}
for (const variable of ["GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES"]) {
  test(`cache sinks protect native ${variable} redirection`, t => {
    const f = fixture(t, "worktree"), target = path.join(f.root, "native-store");
    if (variable !== "GIT_INDEX_FILE") fs.mkdirSync(target); else writeFile(target, "native index sentinel");
    const old = process.env[variable]; process.env[variable] = target;
    try { refused(f, () => writeCacheFile(f.root, variable === "GIT_INDEX_FILE" ? target : path.join(target, "new.json"), "{}")); }
    finally { if (old === undefined) delete process.env[variable]; else process.env[variable] = old; }
  });
}
test("configured hook stores and SQLite journal destinations are protected", t => {
  const f = fixture(t); git(f.root, ["config", "core.hooksPath", path.join(f.root, "hooks")]);
  refused(f, () => writeCacheFile(f.root, "hooks/new.json", "{}"));
  f.config.index.backend = "sqlite"; f.config.index.sqlite_path = "portable/cache.sqlite";
  const old = process.env.GIT_INDEX_FILE; process.env.GIT_INDEX_FILE = path.join(f.root, f.config.index.sqlite_path + "-journal");
  try {
    refused(f, () => writeDerivedIndexes(f.root, f.config));
    refused(f, () => reservePlannedNumericIds({ root: f.root, config: f.config, reservations: [{ ws: "root", prefix: "task", id: "task-1", existingIds: [] }] }));
  } finally { if (old === undefined) delete process.env.GIT_INDEX_FILE; else process.env.GIT_INDEX_FILE = old; }
});
test("identity derived-output preflight protects relocated Git administration without writing", t => {
  const f = fixture(t, "separate"); f.config.index.global_index_path = "admin/config";
  const before = inventory(f.base), conflicts = identityDerivedOutputConflicts(f.root, f.config, [], []);
  assert.ok(conflicts.some((s: string) => /Git metadata/.test(s)), JSON.stringify(conflicts));
  assert.deepEqual(inventory(f.base), before);
});
test("native cache selectors do not reinterpret literal POSIX backslashes", t => {
  if (process.platform === "win32") { t.skip("POSIX literal-backslash semantics"); return; }
  const f = fixture(t); writeCacheFile(f.root, ".git\\not-metadata.json", "{}\n");
  assert.equal(fs.readFileSync(path.join(f.root, ".git\\not-metadata.json"), "utf8"), "{}\n");
  const target = path.join(f.root, "native\\index"), old = process.env.GIT_INDEX_FILE;
  process.env.GIT_INDEX_FILE = target;
  try { refused(f, () => writeCacheFile(f.root, target, "{}")); }
  finally { if (old === undefined) delete process.env.GIT_INDEX_FILE; else process.env.GIT_INDEX_FILE = old; }
});

for (const kind of ["separate", "bare"]) test(`nested ${kind} Git administration is protected from direct and aggregate caches`, t => {
  const f = fixture(t), child = path.join(f.root, "child"); fs.mkdirSync(child);
  if (kind === "separate") git(child, ["init", "-q", "--separate-git-dir", path.join(child, "admin")]);
  else git(child, ["init", "--bare", "-q"]);
  const target = kind === "separate" ? "child/admin/config" : "child/config";
  refused(f, () => writeCacheFile(f.root, target, "{}"));
  f.config.index.global_index_path = "safe/nodes.json"; f.config.capabilities.cache_path = target;
  refused(f, () => writeDerivedIndexes(f.root, f.config));
  f.config.capabilities.cache_path = "safe/capabilities.json"; f.config.index.backend = "sqlite"; f.config.index.sqlite_path = target;
  refused(f, () => writeDerivedIndexes(f.root, f.config));
});
