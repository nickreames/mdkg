import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { loadConfig } = require("../../core/config");
const { buildBundle } = require("../../commands/bundle");
const { buildIndex } = require("../../graph/indexer");
const { buildSkillsIndex } = require("../../graph/skills_indexer");
const { buildCapabilitiesIndex } = require("../../graph/capabilities_indexer");
const { buildSubgraphsIndex } = require("../../graph/subgraphs");
const { sqliteSourceFingerprint, writeSqliteIndex, readSqliteIndexMeta } = require("../../graph/sqlite_index");
const { writeDerivedIndexes } = require("../../graph/reindex");

function seed(root: string) {
  writeRootConfig(root);
  writeFile(path.join(root, ".mdkg/work/task-1.md"), "---\nid: task-1\ntype: task\ntitle: Synthetic task\nstatus: backlog\npriority: 1\ncreated: 2026-09-08\nupdated: 2026-09-08\n---\nAuthored body\n");
  // Exercise the existing legacy extension adapter, not a new vendor policy.
  writeFile(path.join(root, ".mdkg/skills/demo/SKILL.md"), "---\nname: demo\ndescription: Synthetic skill\nochatr_generated_at: authored-generation\nochatr_indexed_at: authored-index\n---\nSkill body\n");
}
function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-sqlite-fingerprint-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "root"), source = path.join(owner, "source");
  fs.mkdirSync(root); fs.mkdirSync(source); seed(root); seed(source);
  const bundle = buildBundle({ root: source, profile: "private" }).zip;
  const bundlePath = path.join(root, "bundles/child.zip");
  fs.mkdirSync(path.dirname(bundlePath)); fs.writeFileSync(bundlePath, bundle);
  const configPath = path.join(root, ".mdkg/config.json"), raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  raw.index.backend = "sqlite";
  raw.subgraphs = { child: { sources: [{ path: "bundles/child.zip", expected_profile: "private" }], max_stale_seconds: 10 } };
  const save = () => writeFile(configPath, JSON.stringify(raw)); save();
  return { root, source, bundle, bundlePath, raw, save };
}
function inputs(root: string) {
  const config = loadConfig(root), nodeIndex = buildIndex(root, config);
  return { root, config, nodeIndex, skillsIndex: buildSkillsIndex(root, config), capabilitiesIndex: buildCapabilitiesIndex(root, config, nodeIndex), subgraphsIndex: buildSubgraphsIndex(root, config).index };
}
test("SQLite source fingerprint is invariant across bundle-age warning thresholds", (t) => {
  const f = fixture(t), epoch = fs.statSync(f.bundlePath).mtimeMs;
  let now = epoch + 1000; t.mock.method(Date, "now", () => now);
  const fresh = inputs(f.root), expected = sqliteSourceFingerprint(fresh);
  assert.equal(fresh.subgraphsIndex.subgraphs[0].stale, false);
  for (const elapsed of [11000, 25000, 100000]) {
    now = epoch + elapsed;
    const aged = inputs(f.root);
    assert.equal(aged.subgraphsIndex.subgraphs[0].stale, true);
    assert.match(aged.subgraphsIndex.subgraphs[0].warnings.join("\n"), /bundle age/);
    assert.equal(sqliteSourceFingerprint(aged), expected);
  }
  assert.deepEqual(fs.readFileSync(f.bundlePath), f.bundle);
});
test("SQLite metadata and observational verification agree after only time passes", (t) => {
  const f = fixture(t), epoch = fs.statSync(f.bundlePath).mtimeMs;
  let now = epoch + 1000; t.mock.method(Date, "now", () => now);
  writeDerivedIndexes(f.root, loadConfig(f.root));
  const sqlite = path.join(f.root, ".mdkg/index/mdkg.sqlite"), before = fs.readFileSync(sqlite);
  now = epoch + 25000;
  assert.equal(readSqliteIndexMeta(f.root, loadConfig(f.root)).source_fingerprint, sqliteSourceFingerprint(inputs(f.root)));
  const { runDbIndexVerifyCommand } = require("../../commands/db");
  const lines: string[] = []; t.mock.method(console, "log", (line: string) => lines.push(line));
  runDbIndexVerifyCommand({ root: f.root, json: true });
  const receipt = JSON.parse(lines[0]);
  assert.equal(receipt.ok, true);
  assert.deepEqual(fs.readFileSync(sqlite), before);
  assert.deepEqual(fs.readFileSync(f.bundlePath), f.bundle);
});
test("source fingerprints bind configuration without stripping authored timestamp-named fields", (t) => {
  const f = fixture(t), before = sqliteSourceFingerprint(inputs(f.root));
  f.raw.pack.limits.max_bytes += 1; f.save();
  assert.notEqual(sqliteSourceFingerprint(inputs(f.root)), before);
  const first = inputs(f.root), second = structuredClone(first);
  first.skillsIndex.skills.demo.extensions.audit = { generated_at: "authored-generation" };
  second.skillsIndex.skills.demo.extensions.audit = { generated_at: "authored-generation" };
  second.skillsIndex.skills.demo.extensions.audit.generated_at = "authored-change";
  assert.notEqual(sqliteSourceFingerprint(second), sqliteSourceFingerprint(first));
});
test("SQLite JSON preserves nested authored generated_at and indexed_at fields", (t) => {
  const f = fixture(t), data = inputs(f.root);
  const extension = data.skillsIndex.skills.demo.extensions.ochatr;
  assert.deepEqual(extension, { generated_at: "authored-generation", indexed_at: "authored-index" });
  writeSqliteIndex(data);
  const { DatabaseSync } = require("node:sqlite"), db = new DatabaseSync(path.join(f.root, ".mdkg/index/mdkg.sqlite"), { readOnly: true });
  try {
    const stored = JSON.parse(db.prepare("SELECT json FROM skills WHERE slug='demo'").get().json);
    assert.deepEqual(stored.extensions.ochatr, extension);
    const capability = JSON.parse(db.prepare("SELECT json FROM capabilities WHERE kind='skill' AND workspace='root'").get().json);
    assert.deepEqual(capability.skill.extensions.ochatr, extension);
  } finally { db.close(); }
});
test("node, skill and imported bundle body changes invalidate source fingerprints", (t) => {
  const f = fixture(t);
  let before = sqliteSourceFingerprint(inputs(f.root));
  for (const relative of [".mdkg/work/task-1.md", ".mdkg/skills/demo/SKILL.md"]) {
    fs.appendFileSync(path.join(f.root, relative), "Changed authored body\n");
    const next = sqliteSourceFingerprint(inputs(f.root)); assert.notEqual(next, before); before = next;
  }
  fs.appendFileSync(path.join(f.source, ".mdkg/work/task-1.md"), "New imported body\n");
  fs.writeFileSync(f.bundlePath, buildBundle({ root: f.source, profile: "private" }).zip);
  assert.notEqual(sqliteSourceFingerprint(inputs(f.root)), before);
});
test("different invalid bundle bytes remain distinguishable source states", (t) => {
  const f = fixture(t); fs.writeFileSync(f.bundlePath, "invalid bundle one");
  const before = sqliteSourceFingerprint(inputs(f.root));
  fs.writeFileSync(f.bundlePath, "invalid bundle two");
  assert.notEqual(sqliteSourceFingerprint(inputs(f.root)), before);
});
test("disabled imports and checkout-local selection do not become fingerprint read inputs", (t) => {
  const f = fixture(t); f.raw.subgraphs.child.enabled = false; f.save();
  const before = sqliteSourceFingerprint(inputs(f.root));
  fs.unlinkSync(f.bundlePath); fs.symlinkSync(path.join(f.root, "missing"), f.bundlePath);
  writeFile(path.join(f.root, ".mdkg/state/selected-goal.json"), '{"synthetic":"local selection"}');
  assert.equal(sqliteSourceFingerprint(inputs(f.root)), before);
});
