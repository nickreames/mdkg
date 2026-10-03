import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const target = path.resolve(process.env.MDKG_WORKING_PACKAGE ?? new URL("..", import.meta.url).pathname);
const { createOwnedFixture } = require("../scripts/qualification-fixture.js");
const { runInitCommand } = require(path.join(target, "dist/commands/init.js"));
const { previewWorking, applyWorking, resumeWorking, inspectWorking, inspectWorkingRecovery } = require(path.join(target, "dist/commands/working.js"));
const { readWorkingHost, WORKING_HOST_PATH } = require(path.join(target, "dist/core/working_host.js"));
const { createGraphFormat, canonicalJson, identityHash } = require(path.join(target, "dist/graph/identity.js"));
const { loadConfig } = require(path.join(target, "dist/core/config.js"));
const { buildIndex } = require(path.join(target, "dist/graph/indexer.js"));
const { loadIndex, writeIndex } = require(path.join(target, "dist/graph/index_cache.js"));
const { loadCapabilitiesIndex, writeCapabilitiesIndex } = require(path.join(target, "dist/graph/capabilities_index_cache.js"));
const { buildCapabilitiesIndex, resolveCapabilitiesIndexPath } = require(path.join(target, "dist/graph/capabilities_indexer.js"));
const { buildBundle } = require(path.join(target, "dist/commands/bundle.js"));
const { readZipEntries } = require(path.join(target, "dist/util/zip.js"));
function fixtureTest(name, fn) {
  test(name, () => { const f = createOwnedFixture({ prefix: "mdkg-working-feature-" });
    try { fn(f); } finally { f.cleanup(); } });
}
function quiet(fn) { const log = console.log; console.log = () => {}; try { return fn(); } finally { console.log = log; } }
function project(f, name = "project", kind = "fresh") {
  const root = f.resolve(name); fs.mkdirSync(root);
  quiet(() => runInitCommand({ root }));
  if (kind === "legacy") fs.unlinkSync(path.join(root, WORKING_HOST_PATH));
  if (kind === "v2") {
    for (const directory of ["core", "work", "design"]) fs.rmSync(path.join(root, ".mdkg", directory), { recursive: true });
    fs.writeFileSync(path.join(root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat()));
    fs.unlinkSync(path.join(root, WORKING_HOST_PATH));
  }
  return root;
}
function legacyProject(f, name) {
  const legacy = process.env.MDKG_WORKING_LEGACY_PACKAGE;
  if (legacy) {
    const root = f.resolve(name); fs.mkdirSync(root, { recursive: true });
    const r = f.runNode([path.join(legacy, "dist/cli.js"), "init"], { cwd: root, timeout: 30000 });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(fs.existsSync(path.join(root, WORKING_HOST_PATH)), false);
    return root;
  }
  // Standalone test fallback models the pre-working initializer's two differences.
  const root = project(f, name, "legacy"), ignore = path.join(root, ".gitignore");
  fs.writeFileSync(ignore, fs.readFileSync(ignore, "utf8").replace(".mdkg/working/\n", ""));
  return root;
}
function inventory(root) {
  const files = {};
  const visit = (dir) => { for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const file = path.join(dir, e.name), rel = path.relative(root, file);
    if (rel === ".mdkg/index" || rel.startsWith(".mdkg/index/") || rel === ".git") continue;
    if (e.isDirectory()) visit(file);
    else if (e.isSymbolicLink()) files[rel] = `link:${fs.readlinkSync(file)}`;
    else files[rel] = identityHash(fs.readFileSync(file));
  } }; visit(root); return files;
}
function run(root, action, options = {}, hook) {
  const p = previewWorking(root, { action, ids: [], ...options });
  applyWorking(root, p, p.plan_hash, hook); return p;
}
function entry(root, text = "synthetic private draft canary\n", options = {}) {
  const file = `input-${crypto.randomUUID()}.txt`; fs.writeFileSync(path.join(root, file), text);
  const p = run(root, "add", { file, owner: "synthetic-owner", ...options });
  return p.manifest_after.entries.at(-1);
}
function release(root, e) { run(root, "release", { ids: [e.id], owner: e.owner, confirm_stopped: true }); }
function cli(f, root, args) {
  const r = f.runNode([path.join(target, "dist/cli.js"), ...args], { cwd: root, timeout: 30000 });
  assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout);
}

fixtureTest("fresh init creates independent host markers; repeat init preserves marker and legacy instructions", f => {
  const a = project(f, "a"), b = project(f, "b");
  assert.notDeepEqual(readWorkingHost(a), readWorkingHost(b));
  assert.equal(fs.existsSync(path.join(a, ".mdkg/graph.json")), false);
  assert.equal(fs.existsSync(path.join(a, ".mdkg/working")), false);
  fs.writeFileSync(path.join(a, "CLAUDE.md"), "authored legacy instructions\n");
  const before = inventory(a); quiet(() => runInitCommand({ root: a }));
  assert.deepEqual(inventory(a), before);
});
fixtureTest("existing legacy adoption previews without effects and never migrates nodes or instructions", f => {
  const root = project(f, "legacy", "legacy"); const before = inventory(root);
  quiet(() => runInitCommand({ root })); assert.deepEqual(inventory(root), before);
  const p = previewWorking(root, { action: "init", ids: [] });
  assert.deepEqual(inventory(root), before); assert.equal(p.host.kind, "working-host-v1");
  applyWorking(root, p, p.plan_hash); assert.equal(inspectWorking(root, "verify").ok, true);
  for (const [file, bytes] of Object.entries(before)) assert.equal(inventory(root)[file], bytes);
  assert.equal(fs.existsSync(path.join(root, ".mdkg/graph.json")), false);
  const after = inventory(root); applyWorking(root, p, p.plan_hash); assert.deepEqual(inventory(root), after);
});
fixtureTest("v2 graphs reuse their independently verified canonical identity", f => {
  const root = project(f, "v2", "v2"), before = inventory(root);
  const p = run(root, "init"); assert.equal(p.host.kind, "canonical-v2");
  assert.equal(p.host.id, JSON.parse(fs.readFileSync(path.join(root, ".mdkg/graph.json"))).graph_id);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, WORKING_HOST_PATH))).host_id, p.host.id);
  for (const [file, bytes] of Object.entries(before)) assert.equal(inventory(root)[file], bytes);
});
fixtureTest("owned storage persists through separate CLI processes; explicit search and original input stay intact", f => {
  const root = project(f); run(root, "init"); const e = entry(root);
  assert.equal(cli(f, root, ["working", "show", e.id, "--json"]).text, "synthetic private draft canary\n");
  assert.equal(cli(f, root, ["working", "search", "private draft", "--json"]).entries.length, 1);
  assert.equal(cli(f, root, ["working", "list", "--json"]).entries.length, 1);
  assert.equal(cli(f, root, ["working", "verify", "--json"]).ok, true);
  assert.equal(fs.readFileSync(path.join(root, e.source), "utf8"), "synthetic private draft canary\n");
});
fixtureTest("store copies cannot bootstrap missing or different host identity; same-ID clone retains logical host", f => {
  const a = project(f, "a"), b = project(f, "b"); run(a, "init"); entry(a);
  fs.cpSync(path.join(a, ".mdkg/working"), path.join(b, ".mdkg/working"), { recursive: true });
  let before = inventory(b); assert.throws(() => inspectWorking(b, "verify"), /foreign/); assert.deepEqual(inventory(b), before);
  fs.unlinkSync(path.join(b, WORKING_HOST_PATH)); before = inventory(b);
  assert.throws(() => inspectWorking(b, "verify"), /host absent/);
  assert.throws(() => previewWorking(b, { action: "init", ids: [] }), /host absent/); assert.deepEqual(inventory(b), before);
  fs.copyFileSync(path.join(a, WORKING_HOST_PATH), path.join(b, WORKING_HOST_PATH));
  assert.equal(inspectWorking(b, "verify").ok, true);
});
fixtureTest("changed/removed/unknown host and independent v2 fork refuse without repair", f => {
  for (const kind of ["fresh", "v2"]) {
    const root = project(f, kind, kind); run(root, "init"); entry(root);
    const marker = path.join(root, kind === "v2" ? ".mdkg/graph.json" : WORKING_HOST_PATH), old = fs.readFileSync(marker);
    for (const value of ["{broken", JSON.stringify(kind === "v2" ? createGraphFormat() : { format: "mdkg-working-host", version: 1, host_id: crypto.randomUUID() }),
      JSON.stringify({ format: "mdkg-working-host", version: 99, host_id: crypto.randomUUID() })]) {
      fs.writeFileSync(marker, value); const before = inventory(root);
      assert.throws(() => inspectWorking(root, "verify")); assert.deepEqual(inventory(root), before);
    }
    fs.writeFileSync(marker, old); assert.equal(inspectWorking(root, "verify").ok, true);
    fs.unlinkSync(marker); const before = inventory(root); assert.throws(() => inspectWorking(root, "verify")); assert.deepEqual(inventory(root), before);
  }
});
fixtureTest("stale source, owner, pin and malformed plan refuse before effects", f => {
  const root = project(f); run(root, "init"); fs.writeFileSync(path.join(root, "input.txt"), "old");
  let p = previewWorking(root, { action: "add", ids: [], file: "input.txt", owner: "synthetic-owner" });
  fs.writeFileSync(path.join(root, "input.txt"), "new"); let before = inventory(root);
  assert.throws(() => applyWorking(root, p, p.plan_hash), /stale/); assert.deepEqual(inventory(root), before);
  const e = entry(root); release(root, e);
  p = previewWorking(root, { action: "gc", ids: [e.id], owner: e.owner });
  run(root, "pin", { ids: [e.id], owner: e.owner }); before = inventory(root);
  assert.throws(() => applyWorking(root, p, p.plan_hash), /protected/); assert.deepEqual(inventory(root), before);
  assert.throws(() => applyWorking(root, { ...p, unknown: true }, p.plan_hash), /unsupported/);
  assert.throws(() => previewWorking(root, { action: "release", ids: [e.id], owner: e.owner }), /confirm-stopped/);
  assert.throws(() => previewWorking(root, { action: "unpin", ids: [e.id], owner: "foreign-owner" }), /exact recorded/);
});
fixtureTest("explicit quarantine/recover/purge preserves unrelated data and completed commands are idempotent", f => {
  const root = project(f); run(root, "init"); const a = entry(root, "retain-me"), b = entry(root, "unrelated");
  assert.throws(() => previewWorking(root, { action: "gc", ids: [a.id], owner: a.owner }), /protected/);
  release(root, a); const g = run(root, "gc", { ids: [a.id], owner: a.owner });
  assert.equal(inspectWorking(root, "show", a.id).text, "retain-me");
  assert.equal(inspectWorking(root, "show", b.id).text, "unrelated");
  const before = inventory(root); applyWorking(root, g, g.plan_hash); assert.deepEqual(inventory(root), before);
  run(root, "recover", { ids: [a.id], owner: a.owner });
  assert.equal(inspectWorking(root, "show", a.id).entry.state, "live");
  run(root, "gc", { ids: [a.id], owner: a.owner });
  assert.throws(() => previewWorking(root, { action: "purge", ids: [a.id], owner: a.owner }), /confirm-loss/);
  const p = run(root, "purge", { ids: [a.id], owner: a.owner, confirm_loss: true });
  assert.equal(inspectWorking(root, "show", a.id).text, null); assert.equal(inspectWorking(root, "show", b.id).text, "unrelated");
  assert.equal(fs.readFileSync(path.join(root, a.source), "utf8"), "retain-me"); // only managed copy purged
  assert.throws(() => previewWorking(root, { action: "recover", ids: [a.id], owner: a.owner }), /retained quarantine/);
  const after = inventory(root); resumeWorking(root, p.operation_id, p.plan_hash); assert.deepEqual(inventory(root), after);
});
fixtureTest("source adoption copies selected custom bytes; unmanaged store and links never become owned", f => {
  const root = project(f); fs.mkdirSync(path.join(root, ".mdkg/working")); fs.writeFileSync(path.join(root, ".mdkg/working/custom.txt"), "custom");
  const before = inventory(root); assert.throws(() => previewWorking(root, { action: "init", ids: [] }), /custom\/nonempty/); assert.deepEqual(inventory(root), before);
  fs.renameSync(path.join(root, ".mdkg/working"), path.join(root, "retained-custom")); // explicit synthetic operator relocation
  run(root, "init"); const p = run(root, "adopt", { file: "retained-custom/custom.txt", owner: "synthetic-owner" });
  assert.equal(inspectWorking(root, "show", p.manifest_after.entries[0].id).text, "custom");
  assert.equal(fs.readFileSync(path.join(root, "retained-custom/custom.txt"), "utf8"), "custom");
});
fixtureTest("private payload is excluded from graph discovery and transport even when deliberately tracked", f => {
  const root = project(f); run(root, "init"); const e = entry(root, "private canary MANIFEST SKILL --- id: task-999999\n");
  const cfg = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/config.json")));
  cfg.workspaces.root.visibility = "public";
  fs.writeFileSync(path.join(root, ".mdkg/config.json"), JSON.stringify(cfg));
  const init = spawnSync("git", ["-c", "init.defaultBranch=fixture", "init", root], { encoding: "utf8" }); assert.equal(init.status, 0, init.stderr);
  const stage = spawnSync("git", ["-C", root, "add", "-f", ".mdkg/working"], { encoding: "utf8" }); assert.equal(stage.status, 0, stage.stderr);
  const index = buildIndex(root, loadConfig(root)); assert.equal(JSON.stringify(index).includes("private canary"), false);
  for (const profile of ["private", "public"]) {
    const bundle = buildBundle({ root, profile });
    const entries = readZipEntries(bundle.zip);
    assert.equal(entries.some(f => f.name === `.mdkg/working/entries/${e.id}.bin`), false);
    assert.equal(entries.some(f => f.data.includes(Buffer.from("private canary"))), false);
    if (profile === "private") assert.ok(entries.some(f => f.name === WORKING_HOST_PATH));
  }
  cfg.workspaces.secret = { ...cfg.workspaces.root, path: ".mdkg/working" };
  fs.writeFileSync(path.join(root, ".mdkg/config.json"), JSON.stringify(cfg)); const before = inventory(root);
  assert.throws(() => loadConfig(root), /working/); assert.deepEqual(inventory(root), before);
});
fixtureTest("legacy registered canonical working paths remain usable and managed adoption refuses the overlap", f => {
  const root = project(f, "legacy-path", "legacy"), cfg = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/config.json")));
  cfg.workspaces.legacy = { ...cfg.workspaces.root, path: ".mdkg/working" };
  fs.writeFileSync(path.join(root, ".mdkg/config.json"), JSON.stringify(cfg));
  fs.mkdirSync(path.join(root, ".mdkg/working/.mdkg/work"), { recursive: true });
  const node = "---\nid: task-999991\ntype: task\ntitle: Legacy canonical record\nstatus: done\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-10-03\nupdated: 2026-10-03\n---\nLegacy canonical body.\n";
  fs.writeFileSync(path.join(root, ".mdkg/working/.mdkg/work/task-999991.md"), node);
  const index = buildIndex(root, loadConfig(root)); assert.equal(index.nodes["legacy:task-999991"].title, "Legacy canonical record");
  writeIndex(root, loadConfig(root).index.global_index_path, index);
  const packed = f.runNode([path.join(target, "dist/cli.js"), "pack", "legacy:task-999991"], { cwd: root, timeout: 30000 });
  assert.equal(packed.status, 0, packed.stderr);
  assert.ok(fs.readdirSync(path.join(root, ".mdkg/pack")).filter(file => file.endsWith(".md")).some(file =>
    fs.readFileSync(path.join(root, ".mdkg/pack", file), "utf8").includes("Legacy canonical body")));
  const bundle = buildBundle({ root, profile: "private" }); assert.ok(readZipEntries(bundle.zip).some(e => e.data.includes(Buffer.from("Legacy canonical body"))));
  const before = inventory(root); assert.throws(() => previewWorking(root, { action: "init", ids: [] }), /overlaps.*working/); assert.deepEqual(inventory(root), before);
});
fixtureTest("ordinary discovery and forged stale caches cannot read managed scratch", f => {
  const root = project(f); run(root, "init"); const e = entry(root, "PRIVATE_CACHE_CANARY");
  const cfg = loadConfig(root), index = buildIndex(root, cfg);
  writeIndex(root, cfg.index.global_index_path, index);
  assert.ok(Object.keys(loadIndex({ root, config: cfg, allowReindex: false }).index.nodes).length);
  const forged = structuredClone(index), node = Object.values(forged.nodes)[0];
  node.path = `.mdkg/working/entries/${e.id}.bin`;
  writeIndex(root, cfg.index.global_index_path, forged);
  assert.throws(() => loadIndex({ root, config: cfg, allowReindex: false, persistReindex: false }), /private working/);
  const capabilities = buildCapabilitiesIndex(root, cfg);
  writeCapabilitiesIndex(root, resolveCapabilitiesIndexPath(root, cfg), capabilities);
  assert.ok(loadCapabilitiesIndex({ root, config: cfg, allowReindex: false }).index.records.length);
  capabilities.records[0].path = `.mdkg/working/entries/${e.id}.bin`;
  writeCapabilitiesIndex(root, resolveCapabilitiesIndexPath(root, cfg), capabilities);
  assert.throws(() => loadCapabilitiesIndex({ root, config: cfg, allowReindex: false, persistReindex: false }), /private working/);
  assert.equal(f.runNode([path.join(target, "dist/cli.js"), "index"], { cwd: root, timeout: 30000 }).status, 0); // authored sources replace caches
  for (const args of [["search", "PRIVATE_CACHE_CANARY", "--json"], ["capability", "search", "PRIVATE_CACHE_CANARY", "--json"],
    ["skill", "search", "PRIVATE_CACHE_CANARY", "--json"]]) {
    const result = f.runNode([path.join(target, "dist/cli.js"), ...args], { cwd: root, timeout: 30000 });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    if (output.query !== undefined) assert.equal(output.query, "PRIVATE_CACHE_CANARY");
    delete output.query; // explicit capability query echo is not a discovered payload
    assert.equal(JSON.stringify(output).includes("PRIVATE_CACHE_CANARY"), false, JSON.stringify(args));
  }
  const packed = f.runNode([path.join(target, "dist/cli.js"), "pack", Object.values(index.nodes)[0].id, "--dry-run"], { cwd: root, timeout: 30000 });
  assert.equal(packed.status, 0, packed.stderr); assert.equal(packed.stdout.includes("PRIVATE_CACHE_CANARY"), false);
});
fixtureTest("review regression: unmanaged parent cannot pack managed child private payload from poisoned caches", f => {
  for (const [i, childPath] of ["child", ".mdkg/children/child", "child-cafe\u0301"].entries()) {
    const root = legacyProject(f, `parent-${i}`);
    const child = path.join(root, childPath); fs.mkdirSync(child, { recursive: true });
    quiet(() => runInitCommand({ root: child })); run(child, "init");
    // Matching frontmatter ensures a later node parser cannot accidentally mask the cache-admission defect.
    const e = entry(child, fs.readFileSync(path.join(child, ".mdkg/core/COLLABORATION.md"), "utf8") + "\nPRIVATE_CHILD_CANARY\n");
    const raw = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/config.json")));
    raw.workspaces.child = { ...raw.workspaces.root, path: childPath };
    fs.writeFileSync(path.join(root, ".mdkg/config.json"), JSON.stringify(raw));
    const cfg = loadConfig(root), index = buildIndex(root, cfg);
    writeIndex(root, cfg.index.global_index_path, index);
    assert.ok(loadIndex({ root, config: cfg, allowReindex: false, persistReindex: false }).index.nodes["child:rule-7"]);
    const good = f.runNode([path.join(target, "dist/cli.js"), "pack", "child:rule-7"], { cwd: root, timeout: 30000 });
    assert.equal(good.status, 0, good.stderr);
    const packDir = path.join(root, ".mdkg/pack");
    const packs = () => fs.readdirSync(packDir).filter(file => file.endsWith(".md")).map(file => fs.readFileSync(path.join(packDir, file), "utf8"));
    assert.ok(packs().length); assert.equal(packs().some(text => text.includes("PRIVATE_CHILD_CANARY")), false);
    index.nodes["child:rule-7"].path = `${childPath}/.mdkg/working/entries/${e.id}.bin`;
    writeIndex(root, cfg.index.global_index_path, index);
    const before = inventory(child);
    const poisoned = f.runNode([path.join(target, "dist/cli.js"), "pack", "child:rule-7"], { cwd: root, timeout: 30000 });
    if (poisoned.status === 0) assert.ok(packs().some(text => text.includes("PRIVATE_CHILD_CANARY")), "baseline must reproduce a real disclosure");
    assert.notEqual(poisoned.status, 0, "ordinary pack must refuse a managed child's private cache path");
    assert.match(poisoned.stderr, /private working/);
    assert.equal(packs().some(text => text.includes("PRIVATE_CHILD_CANARY")), false);
    assert.throws(() => loadIndex({ root, config: cfg, allowReindex: false, persistReindex: false }), /private working/);
    // A forged ancestor identity must not confer authority over the same managed child boundary.
    const ancestor = Object.values(index.nodes).find(n => n.ws === "root");
    ancestor.path = index.nodes["child:rule-7"].path;
    delete index.nodes["child:rule-7"]; writeIndex(root, cfg.index.global_index_path, index);
    assert.throws(() => loadIndex({ root, config: cfg, allowReindex: false, persistReindex: false }), /private working/);
    const caps = buildCapabilitiesIndex(root, cfg);
    writeCapabilitiesIndex(root, resolveCapabilitiesIndexPath(root, cfg), caps);
    assert.ok(loadCapabilitiesIndex({ root, config: cfg, allowReindex: false }).index.records.length);
    caps.records[0].path = ancestor.path;
    writeCapabilitiesIndex(root, resolveCapabilitiesIndexPath(root, cfg), caps);
    assert.throws(() => loadCapabilitiesIndex({ root, config: cfg, allowReindex: false, persistReindex: false }), /private working/);
    assert.deepEqual(inventory(child), before);
    raw.workspaces.forbidden = { ...raw.workspaces.root, path: `${childPath}/.mdkg/working` };
    fs.writeFileSync(path.join(root, ".mdkg/config.json"), JSON.stringify(raw));
    assert.throws(() => buildIndex(root, loadConfig(root)), /private working/);
    assert.deepEqual(inventory(child), before);
  }
});
fixtureTest("review regression: repeated init preserves unmanaged legacy canonical workspace Git visibility", f => {
  const root = legacyProject(f, "legacy-ignore"), raw = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/config.json")));
  raw.workspaces.legacy = { ...raw.workspaces.root, path: ".mdkg/working" };
  fs.writeFileSync(path.join(root, ".mdkg/config.json"), JSON.stringify(raw));
  fs.mkdirSync(path.join(root, ".mdkg/working/.mdkg/work"), { recursive: true });
  const node = id => `---\nid: task-${id}\ntype: task\ntitle: Legacy canonical record\nstatus: done\npriority: 1\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-10-03\nupdated: 2026-10-03\n---\nLegacy canonical body.\n`;
  const tracked = ".mdkg/working/.mdkg/work/task-999991.md", untracked = ".mdkg/working/.mdkg/work/task-999992.md";
  fs.writeFileSync(path.join(root, tracked), node(999991)); fs.writeFileSync(path.join(root, untracked), node(999992));
  const git = args => spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(git(["-c", "init.defaultBranch=fixture", "init"]).status, 0);
  assert.equal(git(["add", tracked]).status, 0);
  const before = inventory(root), ignore = fs.readFileSync(path.join(root, ".gitignore"));
  const manifestBefore = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/init-manifest.json")));
  const visible = () => { assert.equal(git(["check-ignore", "--no-index", "-v", untracked]).status, 1); assert.ok(git(["status", "--porcelain", "--untracked-files=all"]).stdout.includes(untracked)); };
  visible(); assert.ok(buildIndex(root, loadConfig(root)).nodes["legacy:task-999991"]);
  quiet(() => runInitCommand({ root }));
  assert.deepEqual(fs.readFileSync(path.join(root, ".gitignore")), ignore); visible();
  const after = inventory(root);
  // The initializer legitimately updates its package-version receipt across releases.
  const manifestAfter = JSON.parse(fs.readFileSync(path.join(root, ".mdkg/init-manifest.json")));
  assert.equal(manifestAfter.mdkg_version, JSON.parse(fs.readFileSync(path.join(target, "package.json"))).version);
  assert.deepEqual({ ...manifestAfter, mdkg_version: manifestBefore.mdkg_version }, manifestBefore);
  delete before[".mdkg/init-manifest.json"];
  const preserved = { ...after }; delete preserved[".mdkg/init-manifest.json"];
  assert.deepEqual(preserved, before); assert.equal(fs.existsSync(path.join(root, WORKING_HOST_PATH)), false);
  quiet(() => runInitCommand({ root })); assert.deepEqual(inventory(root), after); visible();
  assert.ok(buildIndex(root, loadConfig(root)).nodes["legacy:task-999992"]);
});
fixtureTest("review regression: explicit working adoption handles absent empty and authored Gitignore separately", f => {
  for (const [label, content] of [["absent", null], ["empty", ""], ["authored", "# authored ignore\n"]]) {
    const root = legacyProject(f, `ignore-${label}`), ignore = path.join(root, ".gitignore");
    if (content === null) fs.unlinkSync(ignore); else fs.writeFileSync(ignore, content);
    const before = inventory(root), p = cli(f, root, ["working", "init", "--json"]);
    assert.deepEqual(inventory(root), before);
    assert.equal(p.effects.find(e => e.path === ".gitignore").before, content === null ? null : identityHash(content));
    fs.writeFileSync(path.join(root, "plan.json"), JSON.stringify(p));
    cli(f, root, ["working", "init", "--apply", "--plan", "plan.json", "--plan-hash", p.plan_hash, "--json"]);
    assert.equal(inspectWorking(root, "verify").ok, true);
    assert.equal(fs.readFileSync(ignore, "utf8"), (content ?? "") + ".mdkg/working/\n");
    const after = inventory(root); applyWorking(root, p, p.plan_hash); assert.deepEqual(inventory(root), after);
  }
  const root = legacyProject(f, "ignore-empty-resume"), ignore = path.join(root, ".gitignore");
  fs.writeFileSync(ignore, ""); const stale = previewWorking(root, { action: "init", ids: [] });
  fs.writeFileSync(ignore, "# changed after preview\n"); const before = inventory(root);
  assert.throws(() => applyWorking(root, stale, stale.plan_hash), /changed|stale/); assert.deepEqual(inventory(root), before);
  fs.writeFileSync(ignore, ""); const p = previewWorking(root, { action: "init", ids: [] });
  const cut = `effect:${p.effects.findIndex(e => e.path === ".gitignore")}`;
  assert.throws(() => applyWorking(root, p, p.plan_hash, step => { if (step === cut) throw new Error("synthetic empty-ignore interruption"); }), /synthetic empty-ignore interruption/);
  resumeWorking(root, p.operation_id, p.plan_hash); assert.equal(inspectWorking(root, "verify").ok, true);
  assert.equal(fs.readFileSync(ignore, "utf8"), ".mdkg/working/\n");
});
fixtureTest("explicit init journal cuts resume; a pre-journal killed adoption preserves unknown custody", f => {
  for (const cut of ["journal", "effect:1", "effect:2", "completed"]) {
    const root = project(f, `init-${cut.replace(":", "-")}`, "legacy");
    const ignoreFile = path.join(root, ".gitignore");
    fs.writeFileSync(ignoreFile, fs.readFileSync(ignoreFile, "utf8").replace(".mdkg/working/\n", ""));
    const p = previewWorking(root, { action: "init", ids: [] });
    assert.throws(() => applyWorking(root, p, p.plan_hash, step => { if (step === cut) throw new Error("synthetic interruption"); }), /synthetic interruption/);
    resumeWorking(root, p.operation_id, p.plan_hash); assert.equal(inspectWorking(root, "verify").ok, true);
    const after = inventory(root); resumeWorking(root, p.operation_id, p.plan_hash); assert.deepEqual(inventory(root), after);
  }
  const root = project(f, "pre-journal", "legacy");
  const cfgFile = path.join(root, ".mdkg/config.json"), cfg = JSON.parse(fs.readFileSync(cfgFile)); cfg.index.lock_timeout_ms = 50;
  fs.writeFileSync(cfgFile, JSON.stringify(cfg));
  const p = previewWorking(root, { action: "init", ids: [] }); fs.writeFileSync(path.join(root, "plan.json"), JSON.stringify(p));
  const code = `const fs=require('fs');const a=require(${JSON.stringify(path.join(target, "dist/core/filesystem_authority.js"))});const original=a.writeContainedFileExclusive;a.writeContainedFileExclusive=(input,data)=>{const result=original(input,data);if(input.relativePath==='.mdkg/working-host.json')process.kill(process.pid,'SIGKILL');return result};const w=require(${JSON.stringify(path.join(target, "dist/commands/working.js"))});const p=JSON.parse(fs.readFileSync('plan.json'));w.applyWorking(process.cwd(),p,p.plan_hash);`;
  assert.throws(() => f.runNode(["-e", code], { cwd: root, timeout: 30000 }), /fixture child terminated by SIGKILL/);
  assert.equal(fs.existsSync(path.join(root, `.mdkg/working/operations/${p.operation_id}.json`)), false);
  const before = inventory(root), lock = fs.readFileSync(path.join(root, ".mdkg/index/write.lock/owner.json"));
  assert.throws(() => inspectWorkingRecovery(root, p.operation_id, p.plan_hash));
  const retry = previewWorking(root, { action: "init", ids: [] });
  assert.throws(() => applyWorking(root, retry, retry.plan_hash), /timed out waiting/);
  assert.deepEqual(inventory(root), before); assert.deepEqual(fs.readFileSync(path.join(root, ".mdkg/index/write.lock/owner.json")), lock);
});
fixtureTest("sanitized promotion uses verifiable archive evidence and does not export raw scratch", f => {
  const root = project(f); run(root, "init"); const e = entry(root, "PRIVATE RAW CANARY");
  fs.writeFileSync(path.join(root, "sanitized.md"), "Synthetic sanitized finding\n");
  const p = run(root, "promote", { ids: [e.id], owner: e.owner, summary: "sanitized.md", archive_id: "archive.working-synthetic" });
  assert.equal(inspectWorking(root, "show", e.id).text, "PRIVATE RAW CANARY");
  assert.equal(cli(f, root, ["archive", "verify", "archive.working-synthetic", "--json"]).ok, true);
  const zip = fs.readFileSync(path.join(root, ".mdkg/archive/archive.working-synthetic/summary.md.zip"));
  assert.equal(readZipEntries(zip).some(e => e.data.includes(Buffer.from("PRIVATE RAW CANARY"))), false);
  assert.ok(readZipEntries(zip).some(e => e.data.includes(Buffer.from("Synthetic sanitized finding"))));
  assert.throws(() => previewWorking(root, { action: "promote", ids: [e.id], owner: e.owner, summary: "sanitized.md", archive_id: "archive.working-synthetic" }), /new explicit/);
  const after = inventory(root); applyWorking(root, p, p.plan_hash); assert.deepEqual(inventory(root), after);
});
fixtureTest("crash boundaries resume exact journal effects once; purge never claims deleted bytes recoverable", f => {
  for (const action of ["add", "gc", "recover", "purge", "promote"]) {
    const count = action === "promote" ? 4 : 2;
    for (const cut of ["journal", ...Array.from({ length: count }, (_, i) => `effect:${i}`), "completed"]) {
      const root = project(f, `${action}-${cut.replace(":", "-")}`); run(root, "init");
      let e = entry(root, "synthetic original"); let options;
      if (action === "add") { fs.writeFileSync(path.join(root, "second.txt"), "new selected"); options = { file: "second.txt", owner: e.owner }; }
      else if (action === "promote") { fs.writeFileSync(path.join(root, "safe.md"), "safe finding"); options = { ids: [e.id], owner: e.owner, summary: "safe.md", archive_id: "archive.crash" }; }
      else { release(root, e); if (["recover", "purge"].includes(action)) run(root, "gc", { ids: [e.id], owner: e.owner }); options = { ids: [e.id], owner: e.owner, ...(action === "purge" ? { confirm_loss: true } : {}) }; }
      const p = previewWorking(root, { action, ids: [], ...options });
      assert.throws(() => applyWorking(root, p, p.plan_hash, step => { if (step === cut) throw new Error("synthetic interruption"); }), /synthetic interruption/);
      resumeWorking(root, p.operation_id, p.plan_hash, e.owner, true);
      assert.equal(inspectWorking(root, "verify").ok, true);
      const after = inventory(root); resumeWorking(root, p.operation_id, p.plan_hash, e.owner, true); assert.deepEqual(inventory(root), after);
    }
  }
});
fixtureTest("hardlinks, symlinks, case aliases, traversal, nested Git and unknown store files refuse without mutation", f => {
  const root = project(f); run(root, "init"); fs.writeFileSync(path.join(root, "plain.txt"), "protected");
  fs.linkSync(path.join(root, "plain.txt"), path.join(root, "hard.txt")); fs.symlinkSync("plain.txt", path.join(root, "link.txt"));
  fs.mkdirSync(path.join(root, "nested")); fs.mkdirSync(path.join(root, "nested/.git")); fs.writeFileSync(path.join(root, "nested/source.txt"), "nested");
  for (const file of ["../outside", "/absolute", "PLAIN.txt", "hard.txt", "link.txt", "nested/source.txt"]) {
    const before = inventory(root); assert.throws(() => previewWorking(root, { action: "add", ids: [], file, owner: "synthetic-owner" })); assert.deepEqual(inventory(root), before);
  }
  fs.writeFileSync(path.join(root, ".mdkg/working/unknown.txt"), "authored store bytes"); const before = inventory(root);
  assert.throws(() => inspectWorking(root, "verify"), /unmanaged/); assert.deepEqual(inventory(root), before);
});
fixtureTest("CLI preview/apply uses saved exact plans; unknown or conflicting options refuse", f => {
  const root = project(f); const before = inventory(root); const p = cli(f, root, ["working", "init", "--json"]);
  assert.deepEqual(inventory(root), before); fs.writeFileSync(path.join(root, "plan.json"), JSON.stringify(p));
  cli(f, root, ["working", "init", "--apply", "--plan", "plan.json", "--plan-hash", p.plan_hash, "--json"]);
  for (const args of [["working", "list", "--owner", "oops"], ["working", "unknown"], ["working", "init", "--apply", "--plan", "plan.json", "--plan-hash", "wrong"]]) {
    const b = inventory(root), r = f.runNode([path.join(target, "dist/cli.js"), ...args], { cwd: root, timeout: 30000 });
    assert.notEqual(r.status, 0); assert.deepEqual(inventory(root), b);
  }
});
fixtureTest("actual killed writer retains lock; recovery requires fresh evidence and explicit quiescence", f => {
  const root = project(f); run(root, "init"); fs.writeFileSync(path.join(root, "input.txt"), "selected restart bytes");
  const p = previewWorking(root, { action: "add", ids: [], file: "input.txt", owner: "synthetic-owner" });
  fs.writeFileSync(path.join(root, "plan.json"), JSON.stringify(p));
  const code = `const fs=require('fs');const w=require(${JSON.stringify(path.join(target, "dist/commands/working.js"))});const p=JSON.parse(fs.readFileSync('plan.json'));w.applyWorking(process.cwd(),p,p.plan_hash,s=>{if(s==='effect:0')process.kill(process.pid,'SIGKILL')});`;
  assert.throws(() => f.runNode(["-e", code], { cwd: root, timeout: 30000 }), /fixture child terminated by SIGKILL/);
  const before = inventory(root); assert.throws(() => resumeWorking(root, p.operation_id, p.plan_hash, "synthetic-owner", true), /retained writer lock/); assert.deepEqual(inventory(root), before);
  const review = inspectWorkingRecovery(root, p.operation_id, p.plan_hash); assert.equal(review.requires_quiescence, true);
  assert.throws(() => resumeWorking(root, p.operation_id, p.plan_hash, "synthetic-owner", true, undefined, { lockEvidence: review.lock_evidence }), /confirm-quiescent/);
  resumeWorking(root, p.operation_id, p.plan_hash, "synthetic-owner", true, undefined, { lockEvidence: review.lock_evidence, confirmQuiescent: true });
  assert.equal(inspectWorking(root, "verify").ok, true);
  assert.equal(inspectWorking(root, "show", p.manifest_after.entries[0].id).text, "selected restart bytes");
  assert.equal(fs.existsSync(path.join(root, ".mdkg/index/write.lock")), false);
});
fixtureTest("forged journal, duplicate move and changed parent preserve uncertain data", f => {
  const root = project(f); run(root, "init"); const e = entry(root); release(root, e);
  const p = previewWorking(root, { action: "gc", ids: [e.id], owner: e.owner });
  assert.throws(() => applyWorking(root, p, p.plan_hash, step => { if (step === "effect:0") throw new Error("synthetic stop"); }), /synthetic stop/);
  const destination = p.effects[0].path, old = p.effects[0].from;
  fs.copyFileSync(path.join(root, destination), path.join(root, old)); let before = inventory(root);
  assert.throws(() => resumeWorking(root, p.operation_id, p.plan_hash, e.owner, true), /ambiguous working move/); assert.deepEqual(inventory(root), before);
  fs.unlinkSync(path.join(root, old));
  const file = path.join(root, `.mdkg/working/operations/${p.operation_id}.json`), original = fs.readFileSync(file);
  const j = JSON.parse(original); j.effects[0].path = "README.md"; fs.writeFileSync(file, JSON.stringify(j)); before = inventory(root);
  assert.throws(() => resumeWorking(root, p.operation_id, p.plan_hash, e.owner, true), /differs from approved/); assert.deepEqual(inventory(root), before);
  fs.writeFileSync(file, original); resumeWorking(root, p.operation_id, p.plan_hash, e.owner, true);
  const b = entry(root, "parent-bound bytes"); release(root, b); const g = previewWorking(root, { action: "gc", ids: [b.id], owner: b.owner });
  assert.throws(() => applyWorking(root, g, g.plan_hash, step => {
    if (step === "effect:0") {
      fs.renameSync(path.join(root, ".mdkg/working/entries"), path.join(root, ".mdkg/working/entries-retained"));
      fs.mkdirSync(path.join(root, ".mdkg/working/entries"));
    }
  }), /parent changed/);
  assert.equal(fs.readFileSync(path.join(root, g.effects[0].path), "utf8"), "parent-bound bytes");
  fs.rmdirSync(path.join(root, ".mdkg/working/entries")); fs.renameSync(path.join(root, ".mdkg/working/entries-retained"), path.join(root, ".mdkg/working/entries"));
  resumeWorking(root, g.operation_id, g.plan_hash, b.owner, true);
});
fixtureTest("local checkout loss loses ignored scratch; selected retained sanitized export restores only selected bytes", f => {
  const root = project(f, "before"); run(root, "init"); const e = entry(root, "PRIVATE UNEXPORTED BODY");
  fs.writeFileSync(path.join(root, "safe.md"), "selected sanitized finding\n");
  run(root, "promote", { ids: [e.id], owner: e.owner, summary: "safe.md", archive_id: "archive.exported" });
  const retained = f.resolve("selected-export.zip"); fs.copyFileSync(path.join(root, ".mdkg/archive/archive.exported/summary.md.zip"), retained);
  const checksum = identityHash(fs.readFileSync(retained));
  fs.rmSync(root, { recursive: true }); // deliberate disposable checkout-loss rehearsal
  const restored = project(f, "after"); run(restored, "init");
  assert.equal(inspectWorking(restored, "list").entries.length, 0);
  assert.equal(identityHash(fs.readFileSync(retained)), checksum);
  const selected = readZipEntries(fs.readFileSync(retained)); assert.equal(selected.length, 1);
  fs.writeFileSync(path.join(restored, "reviewed-summary.md"), selected[0].data);
  const p = run(restored, "adopt", { file: "reviewed-summary.md", owner: "synthetic-owner" });
  assert.equal(inspectWorking(restored, "show", p.manifest_after.entries[0].id).text, "selected sanitized finding\n");
  assert.equal(JSON.stringify(inspectWorking(restored, "list")).includes("PRIVATE UNEXPORTED BODY"), false);
});
fixtureTest("selected paused-goal claims protect done work; malformed selection and newly active work invalidate cleanup", f => {
  const root = project(f); const work = cli(f, root, ["new", "task", "Synthetic completed work", "--status", "done", "--json"]).node;
  const goal = cli(f, root, ["new", "goal", "Synthetic paused goal", "--json"]).node;
  run(root, "init"); const e = entry(root, "linked retained bytes", { work_ref: work.qid }); release(root, e);
  const p = previewWorking(root, { action: "gc", ids: [e.id], owner: e.owner });
  const goalFile = path.join(root, goal.path);
  let doc = fs.readFileSync(goalFile, "utf8");
  doc = doc.replace(/^goal_state:.*$/m, "goal_state: paused");
  if (/^last_active_node:/m.test(doc)) doc = doc.replace(/^last_active_node:.*$/m, `last_active_node: ${work.id}`);
  else doc = doc.replace(/^---\n/, `---\nlast_active_node: ${work.id}\n`);
  fs.writeFileSync(goalFile, doc); fs.mkdirSync(path.join(root, ".mdkg/state"), { recursive: true });
  const selection = path.join(root, ".mdkg/state/selected-goal.json");
  fs.writeFileSync(selection, JSON.stringify({ qid: goal.qid, id: goal.id, ws: "root", selected_at: new Date().toISOString() }));
  let before = inventory(root); assert.throws(() => applyWorking(root, p, p.plan_hash), /protected/); assert.deepEqual(inventory(root), before);
  fs.writeFileSync(selection, "{broken"); before = inventory(root);
  assert.throws(() => previewWorking(root, { action: "gc", ids: [e.id], owner: e.owner }), /selected goal state/); assert.deepEqual(inventory(root), before);
  fs.unlinkSync(selection); assert.equal(previewWorking(root, { action: "gc", ids: [e.id], owner: e.owner }).request.action, "gc");
});
