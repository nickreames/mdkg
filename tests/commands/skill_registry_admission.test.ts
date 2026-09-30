import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { makeTempDir } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { qualifySkillRegistryAdmission } = require("../../../tests/fixtures/skill-registry-admission.cjs");
const { loadConfig } = require("../../core/config");
const { readSkillsRegistry, ensureSkillsRegistry, refreshSkillsRegistry, prepareSkillsRegistry } = require("../../commands/skill_support");
const { runSkillNewCommand } = require("../../commands/skill");
const skillsIndexer = require("../../graph/skills_indexer");

function fixture(t: { after(fn: () => void): void }) {
  const root = makeTempDir("mdkg-registry-unit-"); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  const registry = path.join(root, ".mdkg/skills/registry.md"), sentinel = path.join(root, "outside-sentinel.md");
  fs.mkdirSync(path.dirname(registry), { recursive: true }); fs.writeFileSync(sentinel, "SYNTHETIC PRIVATE SENTINEL\n");
  return { root, registry, sentinel, config: loadConfig(root) };
}
const create = (root: string) => runSkillNewCommand({ root, slug: "registry-control", name: "Registry control", description: "Synthetic fixture" });

test("skill registry CLI admission preserves unsafe inputs and valid customization", { skip: process.platform === "win32" }, () => {
  const result = qualifySkillRegistryAdmission({ cli: path.resolve(__dirname, "../../cli.js"), tempRoot: fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir() });
  assert.equal(result.pass, true, JSON.stringify(result.cases.filter((c: any) => !c.pass), null, 2));
});

test("registry observation is non-writing and helpers admit missing and regular files", t => {
  const f = fixture(t);
  assert.equal(readSkillsRegistry(f.root, f.config), null); assert.equal(fs.existsSync(f.registry), false);
  assert.equal(ensureSkillsRegistry(f.root, f.config), f.registry);
  assert.match(readSkillsRegistry(f.root, f.config), /Skills Registry/);
  fs.writeFileSync(f.registry, "# Authored notes\n"); const ino = fs.statSync(f.registry).ino;
  ensureSkillsRegistry(f.root, f.config); assert.equal(fs.statSync(f.registry).ino, ino);
  refreshSkillsRegistry(f.root, f.config); assert.match(fs.readFileSync(f.registry, "utf8"), /^# Authored notes\n/);
});

test("registry helpers enforce UTF8 output budget before creating or replacing files", t => {
  const f = fixture(t);
  const content = prepareSkillsRegistry(f.root, f.config);
  f.config.index.limits.max_file_bytes = Buffer.byteLength(content) - 1;
  assert.throws(() => ensureSkillsRegistry(f.root, f.config), /output exceeds byte limit/);
  assert.throws(() => refreshSkillsRegistry(f.root, f.config), /output exceeds byte limit/);
  assert.equal(fs.existsSync(f.registry), false);
  f.config.index.limits.max_file_bytes++;
  refreshSkillsRegistry(f.root, f.config);
  assert.equal(fs.readFileSync(f.registry, "utf8"), content);
  fs.writeFileSync(f.registry, "é".repeat(400));
  f.config.index.limits.max_file_bytes = 819;
  assert.throws(() => refreshSkillsRegistry(f.root, f.config), /output exceeds byte limit/);
  assert.equal(fs.readFileSync(f.registry, "utf8"), "é".repeat(400));
});

test("force preflight uses replacement metadata even when the existing skill is malformed", t => {
  const f = fixture(t);
  const target = path.join(f.root, ".mdkg/skills/registry-control/SKILL.md");
  fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, "broken old skill\n");
  runSkillNewCommand({ root: f.root, slug: "registry-control", name: "Repaired", description: "Valid replacement", force: true });
  assert.match(fs.readFileSync(f.registry, "utf8"), /Valid replacement/);
});

test("pending source uses UTF8 file, combined and count budgets exactly once", t => {
  const f = fixture(t), existing = path.join(f.root, ".mdkg/skills/existing/SKILL.md"), pending = path.join(f.root, ".mdkg/skills/new/SKILL.md");
  fs.mkdirSync(path.dirname(existing), { recursive: true }); fs.writeFileSync(existing, "éé");
  f.config.index.limits.max_file_bytes = 4; f.config.index.limits.max_total_bytes = 8; f.config.index.limits.max_files = 2;
  const read = skillsIndexer.createSkillDocumentReader(f.root, f.config, { filePath: pending, content: "éé" });
  assert.equal(read(existing), "éé"); assert.equal(read(existing), "éé");
  assert.equal(read(pending), "éé"); assert.equal(read(pending), "éé");
  assert.equal(fs.existsSync(pending), false);
  assert.throws(() => skillsIndexer.createSkillDocumentReader(f.root, f.config, { filePath: pending, content: "ééé" })(pending), /byte limit/);
  const total = skillsIndexer.createSkillDocumentReader(f.root, { ...f.config, index: { ...f.config.index, limits: { ...f.config.index.limits, max_total_bytes: 7 } } }, { filePath: pending, content: "éé" });
  total(existing); assert.throws(() => total(pending), /byte limit/);
  const count = skillsIndexer.createSkillDocumentReader(f.root, { ...f.config, index: { ...f.config.index, limits: { ...f.config.index.limits, max_files: 1 } } }, { filePath: pending, content: "éé" });
  count(existing); assert.throws(() => count(pending), /file limit/);
});

test("pending force budgets replacement bytes rather than superseded bytes", t => {
  const f = fixture(t), filePath = path.join(f.root, ".mdkg/skills/replaced/SKILL.md");
  fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, "x".repeat(20000));
  f.config.index.limits.max_file_bytes = 8192; f.config.index.limits.max_total_bytes = 8192;
  const content = "---\nname: replacement\ndescription: bounded replacement\n---\n";
  assert.match(prepareSkillsRegistry(f.root, f.config, { slug: "replaced", filePath, content }), /bounded replacement/);
  assert.equal(fs.statSync(filePath).size, 20000);
});

test("shared registry helpers use the supplied canonical location without granting CLI config compatibility", t => {
  const f = fixture(t);
  f.config.workspaces.root.path = "nested"; f.config.workspaces.root.mdkg_dir = ".graph";
  const registry = path.join(f.root, "nested/.graph/skills/registry.md");
  assert.equal(ensureSkillsRegistry(f.root, f.config), registry);
  fs.writeFileSync(registry, "# Custom canonical location\n"); refreshSkillsRegistry(f.root, f.config);
  assert.match(fs.readFileSync(registry, "utf8"), /^# Custom canonical location/);
  assert.equal(fs.existsSync(f.registry), false);
});

for (const operation of [readSkillsRegistry, ensureSkillsRegistry, refreshSkillsRegistry]) {
  test(`shared registry ${operation.name} refuses a linked leaf without reading its target`, t => {
    const f = fixture(t), open = fs.openSync;
    fs.symlinkSync(f.sentinel, f.registry);
    t.mock.method(fs, "openSync", (...args: any[]) => {
      assert.notEqual(String(args[0]), f.registry, "linked registry reached an open");
      assert.notEqual(String(args[0]), f.sentinel, "external target reached an open");
      return (open as any)(...args);
    });
    assert.throws(() => operation(f.root, f.config), /symbolic|linked|contained/);
    assert.equal(fs.readlinkSync(f.registry), f.sentinel);
  });
}

test("registry substitution after command preflight is refused at refresh without copying target bytes", t => {
  const f = fixture(t), rename = fs.renameSync;
  fs.writeFileSync(f.registry, "# Safe original\n");
  const target = path.join(f.root, ".mdkg/skills/registry-control/SKILL.md");
  t.mock.method(fs, "renameSync", (from: fs.PathLike, to: fs.PathLike) => {
    const result = rename(from, to);
    if (String(to) === target) { fs.unlinkSync(f.registry); fs.symlinkSync(f.sentinel, f.registry); }
    return result;
  });
  assert.throws(() => create(f.root), /symbolic|linked|contained/);
  assert.equal(fs.readlinkSync(f.registry), f.sentinel);
  assert.doesNotMatch(fs.readFileSync(target, "utf8"), /SYNTHETIC PRIVATE SENTINEL/);
  assert.equal(fs.readFileSync(f.sentinel, "utf8"), "SYNTHETIC PRIVATE SENTINEL\n");
  // A concurrent post-preflight replacement is not a rollback transaction.
  assert.equal(fs.existsSync(path.join(f.root, ".mdkg/index/write.lock")), false);
});

test("registry replacement rechecks its destination after index construction", t => {
  const f = fixture(t), build = skillsIndexer.buildSkillsIndex;
  fs.writeFileSync(f.registry, "# Safe original\n");
  t.mock.method(skillsIndexer, "buildSkillsIndex", (...args: any[]) => {
    const index = build(...args); fs.unlinkSync(f.registry); fs.symlinkSync(f.sentinel, f.registry); return index;
  });
  assert.throws(() => refreshSkillsRegistry(f.root, f.config), /symbolic|linked|contained/);
  assert.equal(fs.readlinkSync(f.registry), f.sentinel);
  assert.equal(fs.readFileSync(f.sentinel, "utf8"), "SYNTHETIC PRIVATE SENTINEL\n");
});

test("registry input bounds actual UTF8 bytes despite stale metadata and closes its descriptor", t => {
  const f = fixture(t), open = fs.openSync, fstat = fs.fstatSync, read = fs.readSync, close = fs.closeSync;
  f.config.index.limits.max_file_bytes = 8; fs.writeFileSync(f.registry, "ééééé");
  let descriptor: number | undefined, consumed = 0, closed = false;
  t.mock.method(fs, "openSync", (...args: any[]) => { const fd = (open as any)(...args); if (String(args[0]) === f.registry) descriptor = fd; return fd; });
  t.mock.method(fs, "fstatSync", (...args: any[]) => { const stat = (fstat as any)(...args); return args[0] === descriptor ? Object.assign(stat, { size: 0 }) : stat; });
  t.mock.method(fs, "readSync", (...args: any[]) => { const n = (read as any)(...args); if (args[0] === descriptor && !closed) consumed += n; return n; });
  t.mock.method(fs, "closeSync", (fd: number) => { if (fd === descriptor) closed = true; return close(fd); });
  assert.throws(() => readSkillsRegistry(f.root, f.config), /byte limit/);
  assert.equal(consumed, 9); assert.equal(closed, true);
});
