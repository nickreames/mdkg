import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
function fixture(t: any) {
  const base = makeTempDir("diagnostic-containment-"); t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const root = path.join(base, "repo"), outside = path.join(base, "outside"); fs.mkdirSync(root); fs.mkdirSync(outside);
  writeRootConfig(root); writeDefaultTemplates(root); writeFile(path.join(root, ".mdkg/core/core.md"), "# Fixture\n");
  const run = (args: string[]) => {
    const result = spawnSync(process.execPath, [path.join(runtime, "cli.js"), ...args, "--json"], { cwd: root, encoding: "utf8", timeout: 10000 });
    assert.equal(result.signal, null, result.stderr); assert.ok(result.stdout, result.stderr);
    return { result, value: JSON.parse(result.stdout) };
  };
  const config = (change: (config: any) => void) => {
    const file = path.join(root, ".mdkg/config.json"), value = JSON.parse(fs.readFileSync(file, "utf8"));
    value.index.limits ??= { max_files: 100000, max_file_bytes: 8 * 1024 * 1024, max_total_bytes: 512 * 1024 * 1024, max_depth: 64 };
    change(value); writeFile(file, JSON.stringify(value));
  };
  return { root, outside, config, run };
}
for (const kind of ["global", "capabilities", "subgraphs"]) {
  test(`db diagnostics refuse linked ${kind} JSON without accepting outside evidence`, t => {
    const f = fixture(t), source = path.join(f.outside, "private.json");
    writeFile(source, JSON.stringify({ private_marker: "NOT_A_PROJECT_CACHE" }));
    const file = path.join(f.root, ".mdkg/index", kind + ".json"); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.symlinkSync(source, file);
    const { value } = f.run(["db", "index", "status"]), check = value.checks.find((c: any) => c.name === kind);
    assert.equal(check.ok, false); assert.match(check.errors.join(" "), /symbolic link/);
    assert.equal(check.size, undefined); assert.equal(value.ok, false);
    assert.equal(fs.readFileSync(source, "utf8"), JSON.stringify({ private_marker: "NOT_A_PROJECT_CACHE" }));
  });
}
test("status refuses linked changelog and preserves its single JSON failure receipt", t => {
  const f = fixture(t), source = path.join(f.outside, "changelog.md");
  writeFile(source, "## 0.6.0\nPRIVATE\n"); fs.symlinkSync(source, path.join(f.root, "CHANGELOG.md"));
  const { value } = f.run(["status"]);
  assert.equal(value.ok, false); assert.equal(value.release.changelog_has_version, false);
  assert.match(value.summary.errors.join(" "), /changelog.*symbolic link/);
});
for (const area of ["archive", "bundles"]) test(`doctor refuses linked ${area} storage instead of listing external files`, t => {
  const f = fixture(t); writeFile(path.join(f.outside, "private.mdkg.zip"), "PRIVATE");
  fs.symlinkSync(f.outside, path.join(f.root, ".mdkg", area), "dir");
  const { value } = f.run(["doctor", "--strict", "--no-reindex"]);
  const check = value.checks.find((c: any) => c.id === (area === "archive" ? "archive.storage" : "bundle.storage"));
  assert.equal(check.ok, false); assert.match(check.detail, /symbolic link/);
  assert.equal(check.refs, undefined); assert.equal(fs.readFileSync(path.join(f.outside, "private.mdkg.zip"), "utf8"), "PRIVATE");
});
for (const kind of ["entry", "depth"]) test(`doctor storage walking enforces ${kind} budgets with an explicit failed check`, t => {
  const f = fixture(t); f.config(config => { if (kind === "entry") config.index.limits.max_files = 3; else config.index.limits.max_depth = 1; });
  if (kind === "entry") for (let i = 0; i < 4; i++) writeFile(path.join(f.root, ".mdkg/bundles", `${i}.mdkg.zip`), "fixture");
  else writeFile(path.join(f.root, ".mdkg/bundles/a/b/c.mdkg.zip"), "fixture");
  const { value } = f.run(["doctor", "--strict", "--no-reindex"]), check = value.checks.find((c: any) => c.id === "bundle.storage");
  assert.equal(check.ok, false); assert.match(check.detail, new RegExp(`${kind} limit`));
});
test("cache diagnostics admit contained JSON larger than one Markdown document", t => {
  const f = fixture(t); f.config(config => { config.index.limits.max_file_bytes = 1024; });
  writeFile(path.join(f.root, ".mdkg/index/global.json"), JSON.stringify({ large: "x".repeat(2048) }));
  const { value } = f.run(["db", "index", "status"]), check = value.checks.find((c: any) => c.name === "global");
  assert.ok(check.size > 1024); assert.ok(!check.errors.some((e: string) => /byte limit/.test(e)));
});
test("diagnostic cache reader rejects oversized sparse files before reading their contents", t => {
  const f = fixture(t), file = path.join(f.root, "large.json"); writeFile(file, "{}"); fs.truncateSync(file, 512 * 1024 * 1024 + 1);
  const { readJsonCacheText } = require(path.join(runtime, "graph/json_cache_fingerprint"));
  assert.throws(() => readJsonCacheText(f.root, file), /byte limit/);
});
test("status accepts a normal contained changelog and reports a missing one honestly", t => {
  const f = fixture(t);
  const missing = f.run(["status"]).value.release;
  assert.equal(missing.changelog_path, null);
  assert.equal(missing.changelog_has_version, false);
  assert.match(missing.package_version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  writeFile(path.join(f.root, "CHANGELOG.md"), "## 0.0.0-fixture-mismatch\nFixture\n");
  assert.equal(f.run(["status"]).value.release.changelog_has_version, false);
  writeFile(path.join(f.root, "CHANGELOG.md"), `## ${missing.package_version}\nFixture\n`);
  const contained = f.run(["status"]).value.release;
  assert.equal(contained.package_version, missing.package_version);
  assert.equal(contained.changelog_has_version, true);
});

test("fix planning refuses linked cache and selection evidence without reading or repairing it", t => {
  const f = fixture(t), cache = path.join(f.outside, "cache.json"), selection = path.join(f.outside, "selected.json");
  writeFile(cache, "{}");
  writeFile(selection, JSON.stringify({ qid: "root:goal-999", id: "goal-999", ws: "root", selected_at: "2026-09-29" }));
  fs.mkdirSync(path.join(f.root, ".mdkg/index"), { recursive: true }); fs.mkdirSync(path.join(f.root, ".mdkg/state"), { recursive: true });
  fs.symlinkSync(cache, path.join(f.root, ".mdkg/index/global.json"));
  fs.symlinkSync(selection, path.join(f.root, ".mdkg/state/selected-goal.json"));
  const { value } = f.run(["fix", "plan"]);
  assert.ok(value.proposed_changes.some((c: any) => c.reason === "generated_cache_unreadable" && /symbolic link/.test(c.before.error)));
  assert.ok(value.proposed_changes.some((c: any) => c.reason === "selected_goal_state_malformed"));
  assert.equal(fs.readFileSync(cache, "utf8"), "{}");
  assert.ok(fs.lstatSync(path.join(f.root, ".mdkg/state/selected-goal.json")).isSymbolicLink());
});

for (const kind of ["skills", "capabilities"]) test(`${kind} freshness refuses a linked skill tree before outside traversal`, t => {
  const f = fixture(t), target = path.join(f.root, ".mdkg/index", kind + ".json");
  writeFile(target, JSON.stringify({ meta: {}, skills: {}, records: [] }));
  fs.utimesSync(target, 4102444800, 4102444800);
  writeFile(path.join(f.outside, "private.txt"), "NOT_PROJECT_DATA"); fs.symlinkSync(f.outside, path.join(f.root, ".mdkg/skills"), "dir");
  const { value } = f.run(["db", "index", "status"]), check = value.checks.find((c: any) => c.name === kind);
  assert.equal(check.ok, false); assert.match(check.errors.join(" "), /symbolic link/);
});
test("skill freshness bounds entry traversal and preserves legitimate small inventories", t => {
  const f = fixture(t), { cacheSourceStats } = require(path.join(runtime, "graph/cache_sources"));
  const directory = path.join(f.root, ".mdkg/skills");
  for (let i = 0; i < 4; i++) writeFile(path.join(directory, "skill/assets", `${i}.txt`), "fixture");
  assert.throws(() => cacheSourceStats(f.root, directory, { max_depth: 8, max_files: 3 }), /entry limit/);
  assert.throws(() => cacheSourceStats(f.root, directory, { max_depth: 1, max_files: 20 }), /depth limit/);
  assert.ok(cacheSourceStats(f.root, directory, { max_depth: 8, max_files: 20 }).some((item: any) => item.path.endsWith("0.txt")));
});
test("skill fingerprints enforce per-document and combined source-byte budgets", t => {
  const f = fixture(t), { loadConfig } = require(path.join(runtime, "core/config"));
  const { currentSkillCacheSources, buildSkillsIndex } = require(path.join(runtime, "graph/skills_indexer"));
  const config = loadConfig(f.root), content = "---\nname: small\ndescription: Fixture\n---\n" + "x".repeat(96);
  writeFile(path.join(f.root, ".mdkg/skills/small/SKILL.md"), content);
  config.index.limits.max_file_bytes = 128;
  assert.throws(() => currentSkillCacheSources(f.root, config), /byte limit/);
  assert.throws(() => buildSkillsIndex(f.root, config), /byte limit/);
  config.index.limits.max_file_bytes = 512; config.index.limits.max_total_bytes = Buffer.byteLength(content) + 1;
  writeFile(path.join(f.root, ".mdkg/skills/second/SKILL.md"), content.replace("name: small", "name: second"));
  assert.throws(() => currentSkillCacheSources(f.root, config), /byte limit/);
  config.index.limits.max_total_bytes = 1024;
  assert.equal(currentSkillCacheSources(f.root, config).length, 2);
});
