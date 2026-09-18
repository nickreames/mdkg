import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { loadConfig } = require("../../core/config");
const { loadTemplateSchemasWithInfo } = require("../../graph/template_schema");
const { loadTemplate } = require("../../templates/loader");
const template = "---\nid: '{{id}}'\ntype: task\ntitle: '{{title}}'\ntags: []\n---\nlocal body\n";
function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-template-containment-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside); writeRootConfig(root);
  const config = loadConfig(root), set = path.join(root, ".mdkg/templates/default");
  writeFile(path.join(set, "task.md"), template);
  writeFile(path.join(outside, "task.md"), template.replace("local body", "external fixture"));
  return { root, outside, set, config };
}
function load(f: any) { return loadTemplateSchemasWithInfo(f.root, f.config, ["task"]); }
for (const selector of ["../other", "a/../default", "a\\..\\default", "/absolute", "C:\\outside", "C:outside", "\\\\server\\share", "bad\0set"]) {
  test(`template selectors reject unsafe syntax ${JSON.stringify(selector)} before schema or body lookup`, (t) => {
    const f = fixture(t); f.config.templates.default_set = selector;
    writeFile(path.join(f.root, ".mdkg/config.json"), JSON.stringify(f.config));
    assert.throws(() => loadConfig(f.root), /templates.default_set/);
    assert.throws(() => load(f), /template|relative|component|NUL/);
    assert.throws(() => loadTemplate(f.root, f.config, "task", selector), /template|relative|component|NUL/);
  });
}
test("absolute and sibling selectors cannot import schemas or bodies outside configured template root", (t) => {
  const f = fixture(t);
  for (const selector of [f.outside, "../other"]) {
    writeFile(path.join(f.root, ".mdkg/templates/other/task.md"), template);
    writeFile(path.join(f.root, ".mdkg/other/task.md"), template);
    f.config.templates.default_set = selector;
    assert.throws(() => load(f), /relative|parent-directory|component/);
    assert.throws(() => loadTemplate(f.root, f.config, "task", selector), /relative|parent-directory|component/);
  }
});
for (const kind of ["root", "set", "dangling"]) {
  test(`template schema rejects ${kind} linked discovery roots without fallback`, (t) => {
    const f = fixture(t), link = kind === "root" ? path.dirname(f.set) : f.set;
    fs.rmSync(link, { recursive: true });
    try { fs.symlinkSync(kind === "dangling" ? f.outside + ".missing" : f.outside, link, "dir"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error; t.skip("symlink privilege unavailable"); return; }
    assert.throws(() => load(f), /symbolic link|linked/);
  });
}
for (const kind of ["file", "total", "count", "depth", "entries"]) {
  test(`template schema enforces ${kind} resource budget before parsing`, (t) => {
    const f = fixture(t), size = Buffer.byteLength(template);
    if (kind === "file") f.config.index.limits.max_file_bytes = size - 1;
    if (kind === "total") { f.config.index.limits.max_total_bytes = size * 2 - 1; writeFile(path.join(f.set, "second.md"), template); }
    if (kind === "count") { f.config.index.limits.max_files = 1; writeFile(path.join(f.set, "second.md"), template); }
    if (kind === "depth") { f.config.index.limits.max_depth = 1; writeFile(path.join(f.set, "a/b/third.md"), template); }
    if (kind === "entries") { f.config.index.limits.max_files = 1; for (let i = 0; i < 11; i++) writeFile(path.join(f.set, `ignored-${i}.txt`), ""); }
    assert.throws(() => load(f), /limit|budget|exceed/);
  });
}
test("template body loader enforces the same local file byte bound", (t) => {
  const f = fixture(t); f.config.index.limits.max_file_bytes = 10;
  assert.throws(() => loadTemplate(f.root, f.config, "task"), /limit|budget|exceed/);
});
test("schema discovery-to-read substitution is rejected at the actual file sink", (t) => {
  const f = fixture(t);
  // A schema-file open has no earlier descriptor; static ancestor/leaf checks
  // must reject a leaf swapped between enumeration and contained read.
  const readDir = fs.readdirSync;
  const openDir = fs.opendirSync;
  let swapped = false;
  const swap = () => {
    if (!swapped) {
      swapped = true; fs.unlinkSync(path.join(f.set, "task.md")); fs.symlinkSync(path.join(f.outside, "task.md"), path.join(f.set, "task.md"));
    }
  };
  t.mock.method(fs, "readdirSync", (...args: any[]) => {
    const result = (readDir as any)(...args);
    if (args[0] === f.set) swap();
    return result;
  });
  t.mock.method(fs, "opendirSync", (...args: any[]) => {
    const directory = (openDir as any)(...args);
    const read = directory.readSync.bind(directory);
    directory.readSync = () => { const entry = read(); if (args[0] === f.set && entry?.name === "task.md") swap(); return entry; };
    return directory;
  });
  assert.throws(() => load(f), /symbolic link|linked/);
});
test("nested sets, dotted roots, partial fallback and manifest alias retain local semantics", (t) => {
  const f = fixture(t); f.config.templates.root_path = "./.mdkg/templates"; f.config.templates.default_set = "Team/Nested";
  writeFile(path.join(f.root, ".mdkg/templates/Team/Nested/task.md"), template.replace("tags: []", "tags: []\ncustom: []"));
  const result = loadTemplateSchemasWithInfo(f.root, f.config, ["task", "bug", "spec"]);
  assert.equal(result.schemas.task.allowedKeys.has("custom"), true);
  assert.deepEqual(result.fallbackTypes, ["bug"]); assert.ok(result.schemas.spec);
  assert.equal(result.templateRoot, path.join(f.root, ".mdkg/templates/Team/Nested"));
  f.config.templates.default_set = "default";
  assert.equal(loadTemplate(f.root, f.config, "task").body.trim(), "local body");
  assert.equal(load(f).schemas.task.allowedKeys.has("custom"), false);
});
test("explicit dot selectors and repository-root templates remain contained and usable", (t) => {
  const f = fixture(t); f.config.templates.root_path = "."; f.config.templates.default_set = ".";
  fs.rmSync(path.join(f.root, ".mdkg/templates"), { recursive: true });
  writeFile(path.join(f.root, "task.md"), template);
  assert.ok(load(f).schemas.task); assert.equal(loadTemplate(f.root, f.config, "task").source, "local");
});
test("missing local templates retain bundled fallback outside untrusted local byte budget", (t) => {
  const f = fixture(t); fs.rmSync(f.set, { recursive: true }); f.config.index.limits.max_file_bytes = 1;
  assert.ok(load(f).schemas.task); assert.equal(loadTemplate(f.root, f.config, "task").source, "bundled");
  assert.throws(() => loadTemplate(f.root, f.config, "task", "missing"), /template not found/);
});

for (const args of [["index"], ["validate", "--json"], ["doctor", "--strict", "--json"], ["new", "task", "Must not create"]]) {
  test(`installed CLI ${args[0]} rejects an escaping template selector before mutation`, (t) => {
    const f = fixture(t); f.config.templates.default_set = f.outside;
    writeFile(path.join(f.root, ".mdkg/config.json"), JSON.stringify(f.config));
    const result = spawnSync(process.execPath, [path.resolve(__dirname, "../../cli.js"), ...args], { cwd: f.root, encoding: "utf8", timeout: 5000 });
    assert.equal(result.error, undefined); assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /templates.default_set/);
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/global.json")), false);
    assert.equal(fs.existsSync(path.join(f.root, ".mdkg/work")), false);
  });
}
