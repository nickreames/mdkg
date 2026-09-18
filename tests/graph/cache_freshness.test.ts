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
const { writeDerivedIndexes } = require("../../graph/reindex");
const { isIndexStale } = require("../../graph/staleness");
const { loadIndex } = require("../../graph/index_cache");
const { buildIndex } = require("../../graph/indexer");
const { writeIndex } = require("../../graph/index_cache");
const { isSkillsIndexStale, loadSkillsIndex } = require("../../graph/skills_index_cache");
const { isCapabilitiesIndexStale, loadCapabilitiesIndex } = require("../../graph/capabilities_index_cache");
const { buildCapabilitiesIndex } = require("../../graph/capabilities_indexer");
const cli = path.resolve(__dirname, "../../cli.js");

test("capability skill metadata and freshness evidence use the same captured bytes", t => {
  const f = fixture(t), skills = require("../../graph/skills_indexer");
  const original = skills.buildSkillIndexEntryForWorkspace;
  const stub = t.mock.method(skills, "buildSkillIndexEntryForWorkspace", (...args: any[]) => {
    const entry = original(...args);
    if (entry.slug === "focused") edit(f.root, ".mdkg/skills/focused/SKILL.md", "Before skill", "After skill", 1);
    return entry;
  });
  const index = buildCapabilitiesIndex(f.root, f.config);
  stub.mock.restore();
  writeFile(f.paths.capabilities, JSON.stringify(index));
  assert.equal(index.records.find((record: any) => record.kind === "skill").description, "Before skill");
  assert.equal(isCapabilitiesIndexStale(f.root, f.config), true);
  const loaded = loadCapabilitiesIndex({ ...f, persistReindex: false });
  assert.equal(loaded.index.records.find((record: any) => record.kind === "skill").description, "After skill");
});

test("explicit stale-cache opt-out remains available when current strict parsing would fail", t => {
  const f = fixture(t), config = { ...f.config, index: { ...f.config.index, tolerant: false } };
  writeIndex(f.root, f.paths.nodes, buildIndex(f.root, config));
  const file = path.join(f.root, ".mdkg/work/task-1.md");
  writeFile(file, "Malformed document without frontmatter\n"); fs.utimesSync(file, 1, 1);
  const before = inventory(f.root);
  const cached = loadIndex({ root: f.root, config, allowReindex: false, persistReindex: false });
  assert.equal(cached.stale, true); assert.equal(cached.rebuilt, false);
  assert.equal(cached.index.nodes["root:task-1"].title, "Before task");
  assert.throws(() => loadIndex({ root: f.root, config, allowReindex: true, persistReindex: false }), /frontmatter/);
  assert.equal(inventory(f.root), before);
});

for (const state of ["zip-restored", "raw-repaired", "zip-corrupted"] as const) {
  test(`node freshness binds archive dependencies when ${state}`, t => {
    const f = fixture(t), { createDeterministicZip } = require("../../util/zip");
    const { hashArchiveBuffer } = require("../../graph/archive_integrity");
    const { formatFrontmatter } = require("../../graph/frontmatter");
    const dir = path.join(f.root, ".mdkg/archive/archive.proof");
    const payload = Buffer.from("Synthetic archive payload\n"), zip = createDeterministicZip("payload.txt", payload);
    const raw = path.join(dir, "source/payload.txt"), compressed = path.join(dir, "payload.zip");
    const fields = { id: "archive.proof", type: "archive", title: "Archive proof", created: "2026-09-15", updated: "2026-09-15",
      archive_kind: "source", source_path: "input.txt", stored_path: "source/payload.txt", compressed_path: "payload.zip",
      mime_type: "text/plain", byte_size: String(payload.length), sha256: hashArchiveBuffer(payload),
      compressed_sha256: hashArchiveBuffer(zip), visibility: "private", provenance: "synthetic", ingest_status: "verified" };
    writeFile(path.join(dir, "proof.md"), ["---", ...formatFrontmatter(fields), "---", "Synthetic archive."].join("\n"));
    fs.mkdirSync(path.dirname(raw), { recursive: true });
    fs.writeFileSync(raw, state === "raw-repaired" ? "Corrupt" : payload);
    if (state !== "zip-restored") fs.writeFileSync(compressed, zip);
    const config = { ...f.config, index: { ...f.config.index, tolerant: true } };
    const cached = buildIndex(f.root, config);
    assert.equal(Boolean(cached.nodes["root:archive.proof"]), state === "zip-corrupted");
    writeIndex(f.root, f.paths.nodes, cached);
    if (state === "raw-repaired") fs.writeFileSync(raw, payload);
    else fs.writeFileSync(compressed, state === "zip-restored" ? zip : Buffer.from("Corrupt ZIP"));
    fs.utimesSync(state === "raw-repaired" ? raw : compressed, 1, 1);
    const before = inventory(f.root);
    assert.equal(isIndexStale(f.root, config), true);
    const loaded = loadIndex({ root: f.root, config, persistReindex: false });
    assert.equal(Boolean(loaded.index.nodes["root:archive.proof"]), state !== "zip-corrupted");
    assert.equal(inventory(f.root), before);
  });
}

function document(id: string, type: string, title: string): string {
  return `---\nid: ${id}\ntype: ${type}\ntitle: ${title}\n${type === "task" ? "status: todo\nskills: []\nblocked_by: []\nblocks: []\n" : ""}tags: []\nowners: []\nlinks: []\nartifacts: []\nrefs: []\naliases: []\nrelates: []\ncreated: 2026-09-15\nupdated: 2026-09-15\n---\n# Context\nOriginal body.\n`;
}

function inventory(root: string): string {
  const result: unknown[] = [];
  const visit = (dir: string) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      result.push([path.relative(root, file), stat.mode,
        stat.isFile() ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : "directory"]);
      if (stat.isDirectory()) visit(file);
    }
  };
  visit(root);
  return JSON.stringify(result);
}

function fixture(t: { after(fn: () => void): void }, backend = "json") {
  const root = makeTempDir("mdkg-cache-freshness-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  const configPath = path.join(root, ".mdkg/config.json");
  const settings = JSON.parse(fs.readFileSync(configPath, "utf8"));
  settings.index.backend = backend;
  writeFile(configPath, JSON.stringify(settings));
  writeFile(path.join(root, ".mdkg/work/task-1.md"), document("task-1", "task", "Before task"));
  writeFile(path.join(root, ".mdkg/core/rule-1.md"), document("rule-1", "rule", "Before rule"));
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  writeFile(path.join(root, ".mdkg/skills/focused/SKILL.md"),
    "---\nname: focused\ndescription: Before skill\ntags: [before]\n---\n# Purpose\nOriginal skill body.\n");
  const config = loadConfig(root);
  const paths = writeDerivedIndexes(root, config).paths;
  return { root, config, paths };
}

function edit(root: string, relative: string, from: string, to: string, time: number) {
  const file = path.join(root, relative);
  const previous = fs.readFileSync(file, "utf8");
  assert.ok(previous.includes(from));
  writeFile(file, previous.replace(from, to));
  fs.utimesSync(file, time, time);
}

const projections = [
  { name: "nodes", path: ".mdkg/work/task-1.md", old: "Before task", next: "After task", stale: isIndexStale,
    load: loadIndex, value: (index: any) => index.nodes["root:task-1"]?.title },
  { name: "skills", path: ".mdkg/skills/focused/SKILL.md", old: "Before skill", next: "After skill", stale: isSkillsIndexStale,
    load: loadSkillsIndex, value: (index: any) => index.skills.focused?.description },
  { name: "capabilities", path: ".mdkg/core/rule-1.md", old: "Before rule", next: "After rule", stale: isCapabilitiesIndexStale,
    load: loadCapabilitiesIndex, value: (index: any) => index.records.find((record: any) => record.qid === "root:rule-1")?.title },
];

for (const projection of projections) {
  for (const timing of ["older", "equal"] as const) {
    test(`${projection.name} cache binds authored content despite ${timing} timestamps`, t => {
      const f = fixture(t), cache = f.paths[projection.name];
      assert.equal(projection.stale(f.root, f.config), false, "positive fresh cache");
      const time = timing === "older" ? 1 : fs.statSync(cache).mtimeMs / 1000;
      edit(f.root, projection.path, projection.old, projection.next, time);
      const before = inventory(f.root);
      assert.equal(projection.stale(f.root, f.config), true);
      const loaded = projection.load({ ...f, persistReindex: false, inspection: true });
      assert.equal(projection.value(loaded.index), projection.next);
      assert.equal(loaded.rebuilt, true);
      assert.equal(inventory(f.root), before, "observation must not refresh cache or checkout state");
    });
  }

  test(`${projection.name} cache detects removed and renamed sources without timestamp authority`, t => {
    const f = fixture(t);
    const source = path.join(f.root, projection.path);
    fs.renameSync(source, `${source}.removed`);
    fs.utimesSync(path.dirname(source), 1, 1);
    const before = inventory(f.root);
    assert.equal(projection.stale(f.root, f.config), true);
    const loaded = projection.load({ ...f, persistReindex: false, inspection: true });
    assert.equal(projection.value(loaded.index), undefined);
    assert.equal(inventory(f.root), before);
  });

  test(`${projection.name} explicit reindex opt-out labels copied stale metadata honestly`, t => {
    const f = fixture(t);
    edit(f.root, projection.path, projection.old, projection.next, 1);
    const before = inventory(f.root);
    const cached = projection.load({ ...f, allowReindex: false, persistReindex: false });
    assert.equal(cached.stale, true);
    assert.equal(cached.rebuilt, false);
    assert.equal(projection.value(cached.index), projection.old, "explicit stale-cache behavior stays supported");
    const current = projection.load({ ...f, useCache: false, allowReindex: false });
    assert.equal(projection.value(current.index), projection.next);
    assert.equal(inventory(f.root), before);
  });

  test(`${projection.name} unsigned legacy cache is rebuildable but never declared fresh`, t => {
    const f = fixture(t), cache = f.paths[projection.name];
    const content = JSON.parse(fs.readFileSync(cache, "utf8"));
    delete content.meta.source_fingerprint;
    writeFile(cache, JSON.stringify(content));
    const before = inventory(f.root);
    assert.equal(projection.stale(f.root, f.config), true);
    const loaded = projection.load({ ...f, persistReindex: false, inspection: true });
    assert.equal(projection.value(loaded.index), projection.old);
    assert.equal(inventory(f.root), before);
  });

  test(`${projection.name} unchanged copied caches remain usable across checkout roots`, t => {
    const f = fixture(t);
    const copy = path.join(f.root, "copy");
    fs.mkdirSync(copy);
    fs.cpSync(path.join(f.root, ".mdkg"), path.join(copy, ".mdkg"), { recursive: true, preserveTimestamps: true });
    // cp preserves file timestamps but not directory timestamps. Make the
    // existing timestamp heuristic non-stale to isolate content admission.
    const future = Date.now() / 1000 + 60;
    for (const cache of Object.values(f.paths) as string[]) {
      const target = path.join(copy, path.relative(f.root, cache));
      fs.utimesSync(target, future, future);
    }
    const before = inventory(copy);
    const loaded = projection.load({ root: copy, config: loadConfig(copy), allowReindex: false, persistReindex: false });
    assert.equal(loaded.stale, false);
    assert.equal(loaded.rebuilt, false);
    assert.equal(projection.value(loaded.index), projection.old);
    assert.equal(inventory(copy), before);
  });

  for (const corrupt of ["{\n", "{}", "null"]) {
    test(`${projection.name} corrupt cache retains read-error diagnostics without automatic repair: ${corrupt.trim()}`, t => {
      const f = fixture(t);
      writeFile(f.paths[projection.name], corrupt);
      const before = inventory(f.root);
      assert.throws(() => projection.load({ ...f, persistReindex: false }), /failed to read .*index/);
      assert.equal(inventory(f.root), before);
    });
  }
}

test("new and renamed documents invalidate path inventories even with older mtimes", t => {
  const f = fixture(t);
  const added = path.join(f.root, ".mdkg/work/task-2.md");
  writeFile(added, document("task-2", "task", "New task"));
  fs.utimesSync(added, 1, 1);
  assert.equal(isIndexStale(f.root, f.config), true);
  assert.ok(loadIndex({ ...f, persistReindex: false }).index.nodes["root:task-2"]);
  writeDerivedIndexes(f.root, f.config);
  const renamed = path.join(f.root, ".mdkg/work", process.platform === "win32" ? "renamed.md" : "renamed\\literal.md");
  fs.renameSync(added, renamed);
  fs.utimesSync(renamed, 1, 1);
  assert.equal(isIndexStale(f.root, f.config), true);
  const loaded = loadIndex({ ...f, persistReindex: false });
  assert.equal(loaded.index.nodes["root:task-2"].path, path.relative(f.root, renamed));
});

test("current configuration participates in all JSON admission without timestamp assumptions", t => {
  const f = fixture(t);
  const file = path.join(f.root, ".mdkg/config.json");
  const settings = JSON.parse(fs.readFileSync(file, "utf8"));
  settings.pack.default_depth += 1;
  writeFile(file, JSON.stringify(settings)); fs.utimesSync(file, 1, 1);
  const config = loadConfig(f.root);
  for (const projection of projections) assert.equal(projection.stale(f.root, config), true, projection.name);
});

test("a tolerant cache cannot bypass a requested strict parse", t => {
  const f = fixture(t);
  const broken = path.join(f.root, ".mdkg/work/broken.md");
  writeFile(broken, "not a graph node\n");
  const tolerant = buildIndex(f.root, f.config, { tolerant: true });
  writeIndex(f.root, f.paths.nodes, tolerant);
  assert.equal(loadIndex({ ...f, tolerant: true, persistReindex: false }).rebuilt, false);
  assert.throws(() => loadIndex({ ...f, tolerant: false, persistReindex: false }), /frontmatter|id/);
});

test("root skill cache excludes child skills while capabilities bind enabled child skills", t => {
  const f = fixture(t);
  const configFile = path.join(f.root, ".mdkg/config.json");
  const settings = JSON.parse(fs.readFileSync(configFile, "utf8"));
  settings.workspaces.child = { path: "child", mdkg_dir: ".mdkg", enabled: true, visibility: "internal" };
  writeFile(configFile, JSON.stringify(settings));
  writeFile(path.join(f.root, "child/.mdkg/skills/child-skill/SKILL.md"),
    "---\nname: child-skill\ndescription: Before child\n---\n# Purpose\nChild context.\n");
  const config = loadConfig(f.root); writeDerivedIndexes(f.root, config);
  edit(f.root, "child/.mdkg/skills/child-skill/SKILL.md", "Before child", "After child", 1);
  assert.equal(isSkillsIndexStale(f.root, config), false);
  assert.equal(isCapabilitiesIndexStale(f.root, config), true);
  const loaded = loadCapabilitiesIndex({ root: f.root, config, persistReindex: false });
  assert.equal(loaded.index.records.find((r: any) => r.qid === "child:skill:child-skill").description, "After child");
});

test("capability cache binds workspace skills and resource-directory presence", t => {
  const f = fixture(t);
  edit(f.root, ".mdkg/skills/focused/SKILL.md", "Before skill", "After skill", 1);
  fs.mkdirSync(path.join(f.root, ".mdkg/skills/focused/scripts"));
  fs.utimesSync(path.join(f.root, ".mdkg/skills/focused"), 1, 1);
  fs.utimesSync(path.join(f.root, ".mdkg/skills/focused/scripts"), 1, 1);
  const before = inventory(f.root);
  assert.equal(isSkillsIndexStale(f.root, f.config), true);
  assert.equal(isCapabilitiesIndexStale(f.root, f.config), true);
  const capability = loadCapabilitiesIndex({ ...f, persistReindex: false }).index.records.find((record: any) => record.kind === "skill");
  assert.equal(capability.description, "After skill");
  assert.equal(capability.skill.has_scripts, true);
  assert.equal(inventory(f.root), before);
});

test("cached authored custom fields remain lossless and template changes invalidate admission", t => {
  const f = fixture(t);
  const template = path.join(f.root, ".mdkg/templates/default/task.md");
  const source = path.join(f.root, ".mdkg/work/task-1.md");
  writeFile(template, fs.readFileSync(template, "utf8").replace("type: task", "type: task\ncustom_marker: template"));
  writeFile(source, fs.readFileSync(source, "utf8").replace("type: task", "type: task\ncustom_marker: authored").replace("Before task", "After task"));
  fs.utimesSync(template, 1, 1); fs.utimesSync(source, 1, 1);
  const before = inventory(f.root);
  const loaded = loadIndex({ ...f, persistReindex: false, inspection: true });
  assert.equal(loaded.index.nodes["root:task-1"].title, "After task");
  assert.match(fs.readFileSync(source, "utf8"), /custom_marker: authored/);
  assert.equal(inventory(f.root), before);
  writeDerivedIndexes(f.root, f.config);
  writeFile(template, fs.readFileSync(template, "utf8").replace("custom_marker: template\n", ""));
  fs.utimesSync(template, 1, 1);
  assert.equal(isIndexStale(f.root, f.config), true, "template-only changes matter");
  assert.throws(() => loadIndex({ ...f, persistReindex: false }), /unknown key: custom_marker/);
});

for (const backend of ["json", "sqlite"]) {
  test(`${backend} copied graph show/search/list/pack agree with current body without writes`, t => {
    const f = fixture(t, backend);
    edit(f.root, ".mdkg/work/task-1.md", "Before task", "After task", 1);
    const source = path.join(f.root, ".mdkg/work/task-1.md");
    fs.appendFileSync(source, "\nCurrent authored body marker.\n");
    fs.utimesSync(source, 1, 1);
    const copy = path.join(f.root, "copied");
    fs.mkdirSync(copy);
    // Ordinary copies can create the cache after the authoritative documents.
    fs.cpSync(path.join(f.root, ".mdkg"), path.join(copy, ".mdkg"), { recursive: true, filter: file => !file.includes(`${path.sep}index`) });
    fs.cpSync(path.join(f.root, ".mdkg/index"), path.join(copy, ".mdkg/index"), { recursive: true });
    const before = inventory(copy);
    for (const args of [["show", "task-1", "--json"], ["search", "After task", "--json"],
      ["list", "--json"], ["pack", "task-1", "--dry-run", "--skills", "none"]]) {
      const result = spawnSync(process.execPath, [cli, ...args], { cwd: copy, encoding: "utf8" });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout, args[0] === "pack" ? /root:task-1/ : /After task/);
      if (args[0] === "show") assert.match(result.stdout, /Current authored body marker/);
      assert.equal(inventory(copy), before, args.join(" "));
    }
    const stale = spawnSync(process.execPath, [cli, "show", "task-1", "--no-reindex", "--json"], { cwd: copy, encoding: "utf8" });
    assert.equal(stale.status, 0);
    assert.match(stale.stderr, /index is stale/);
    assert.match(stale.stdout, /Before task/);
    assert.equal(inventory(copy), before);
    const mcp = spawnSync(process.execPath, [cli, "mcp", "serve", "--stdio"], { cwd: copy, encoding: "utf8", input:
      JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "mdkg_pack", arguments: { id: "task-1", profile: "standard" } } }) + "\n" });
    assert.equal(mcp.status, 0, mcp.stderr);
    const response = JSON.parse(mcp.stdout);
    assert.equal(response.error, undefined);
    assert.match(JSON.stringify(response.result.structuredContent), /After task/);
    assert.match(JSON.stringify(response.result.structuredContent), /Current authored body marker/);
    assert.equal(inventory(copy), before);
  });
}
