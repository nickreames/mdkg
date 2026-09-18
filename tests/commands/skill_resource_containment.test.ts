import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { loadConfig } = require("../../core/config");
const { syncSkillMirrors, auditSkillMirrors } = require("../../commands/skill_mirror");

function fixture(t: { after(fn: () => void): void }) {
  const root = makeTempDir("mdkg-skill-resource-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  const source = path.join(root, ".mdkg/skills/example");
  writeFile(path.join(source, "SKILL.md"), "---\nname: example\ndescription: inspect synthetic evidence\n---\n# Goal\n");
  const outside = path.join(root, "outside");
  writeFile(path.join(outside, "sentinel.txt"), "SYNTHETIC_EXTERNAL_RESOURCE");
  const config = loadConfig(root);
  const sync = () => syncSkillMirrors({ root, config, createRoots: true });
  const mirror = path.join(root, ".agents/skills/example");
  return { root, source, outside, config, sync, mirror };
}

for (const resource of ["assets", "references", "scripts"]) {
  test(`skill sync rejects ${resource} root links before any mirror writes`, (t) => {
    const f = fixture(t);
    fs.symlinkSync(f.outside, path.join(f.source, resource), "dir");
    assert.throws(f.sync, /symlink|symbolic|contained/i);
    assert.equal(fs.existsSync(path.join(f.root, ".agents")), false);
    assert.equal(fs.existsSync(path.join(f.root, ".claude")), false);
  });
}

for (const target of ["nested", "leaf", "dangling"]) {
  test(`skill sync rejects ${target} resource links and preserves existing mirrors`, (t) => {
    const f = fixture(t); f.sync();
    const before = fs.readFileSync(path.join(f.mirror, "SKILL.md"));
    writeFile(path.join(f.source, "SKILL.md"), "---\nname: example\ndescription: changed evidence\n---\nchanged\n");
    fs.mkdirSync(path.join(f.source, "assets"));
    fs.symlinkSync(target === "nested" ? f.outside : path.join(f.outside, target === "leaf" ? "sentinel.txt" : "absent"), path.join(f.source, "assets", target));
    assert.throws(f.sync, /symlink|symbolic|contained/i);
    assert.deepEqual(fs.readFileSync(path.join(f.mirror, "SKILL.md")), before);
  });
}

test("all skill inventories are validated before the first skill is changed", (t) => {
  const f = fixture(t); f.sync();
  writeFile(path.join(f.root, ".mdkg/skills/aaa/SKILL.md"), "---\nname: aaa\ndescription: earlier skill\n---\n# Goal\n");
  fs.symlinkSync(f.outside, path.join(f.source, "assets"), "dir");
  assert.throws(f.sync, /symlink|symbolic|contained/i);
  assert.equal(fs.existsSync(path.join(f.root, ".agents/skills/aaa")), false);
});

test("skill inventories enforce configured file and aggregate byte limits before writes", (t) => {
  const f = fixture(t);
  writeFile(path.join(f.source, "assets/a.bin"), "a".repeat(200));
  f.config.index.limits.max_file_bytes = 199;
  assert.throws(f.sync, /byte limit|limit.*bytes/i);
  assert.equal(fs.existsSync(f.mirror), false);
  f.config.index.limits.max_file_bytes = 300;
  f.config.index.limits.max_total_bytes = 210;
  assert.throws(f.sync, /byte limit|limit.*bytes/i);
  assert.equal(fs.existsSync(f.mirror), false);
  f.config.index.limits.max_total_bytes = 1000;
  assert.doesNotThrow(f.sync);
});

test("skill parity is byte exact and preserves empty directories and literal filenames", (t) => {
  const f = fixture(t);
  const filename = process.platform === "win32" ? "binary.bin" : "binary\\name.bin";
  fs.mkdirSync(path.join(f.source, "assets/empty"), { recursive: true });
  fs.writeFileSync(path.join(f.source, "assets", filename), Buffer.from([0x80]));
  f.sync();
  assert.deepEqual(auditSkillMirrors(f.root, f.config), []);
  assert.ok(fs.statSync(path.join(f.mirror, "assets/empty")).isDirectory());
  fs.writeFileSync(path.join(f.mirror, "assets", filename), Buffer.from([0x81]));
  assert.match(auditSkillMirrors(f.root, f.config).join("\n"), /drift/);
  f.sync();
  assert.deepEqual(fs.readFileSync(path.join(f.mirror, "assets", filename)), Buffer.from([0x80]));
  assert.deepEqual(auditSkillMirrors(f.root, f.config), []);
});

test("parity rejects unsafe source and destination resources without consuming linked bytes", (t) => {
  const f = fixture(t); f.sync();
  fs.symlinkSync(f.outside, path.join(f.source, "references"), "dir");
  assert.throws(() => auditSkillMirrors(f.root, f.config), /symlink|symbolic|contained/i);
  fs.unlinkSync(path.join(f.source, "references"));
  fs.symlinkSync(f.outside, path.join(f.mirror, "references"), "dir");
  assert.throws(() => auditSkillMirrors(f.root, f.config), /symlink|symbolic|contained/i);
});

test("disabled mirror targets do not consume resource trees", (t) => {
  const f = fixture(t); f.config.customization.skill_mirrors.targets = [];
  fs.symlinkSync(f.outside, path.join(f.source, "assets"), "dir");
  assert.deepEqual(f.sync(), { synced: 0, pruned: 0, targets: 0 });
  assert.deepEqual(auditSkillMirrors(f.root, f.config), []);
});

test("discovery-to-read skill document substitution fails before mirror writes", (t) => {
  const f = fixture(t), indexer = require("../../graph/skills_indexer");
  const original = indexer.buildSkillsIndex;
  indexer.buildSkillsIndex = (root: string, config: any, options: any) => original(root, config, {
    ...options,
    readDocument: (file: string) => {
      fs.unlinkSync(file);
      fs.symlinkSync(path.join(f.outside, "sentinel.txt"), file);
      return options.readDocument(file);
    },
  });
  try { assert.throws(f.sync, /symlink|symbolic|contained/i); }
  finally { indexer.buildSkillsIndex = original; }
  assert.equal(fs.existsSync(f.mirror), false);
});

test("stale directory entries cannot authorize linked resource reads", (t) => {
  const f = fixture(t), nested = path.join(f.source, "assets/nested");
  fs.mkdirSync(nested, { recursive: true });
  const original = fs.opendirSync;
  fs.opendirSync = ((...args: Parameters<typeof fs.opendirSync>) => {
    const dir = original(...args), read = dir.readSync.bind(dir);
    if (String(args[0]) === path.dirname(nested)) dir.readSync = () => {
      const entry = read();
      if (entry?.name === "nested") { fs.rmdirSync(nested); fs.symlinkSync(f.outside, nested, "dir"); }
      return entry;
    };
    return dir;
  }) as typeof fs.opendirSync;
  try { assert.throws(f.sync, /symlink|symbolic|contained/i); }
  finally { fs.opendirSync = original; }
  assert.equal(fs.existsSync(f.mirror), false);
});

test("mirror materialization never reopens source resource paths", (t) => {
  const f = fixture(t);
  writeFile(path.join(f.source, "assets/value.txt"), "accepted snapshot");
  const original = fs.mkdirSync; let swapped = false;
  fs.mkdirSync = ((...args: Parameters<typeof fs.mkdirSync>) => {
    if (!swapped && String(args[0]).startsWith(path.join(f.root, ".agents"))) {
      swapped = true;
      fs.rmSync(path.join(f.source, "assets"), { recursive: true });
      fs.symlinkSync(f.outside, path.join(f.source, "assets"), "dir");
    }
    return original(...args);
  }) as typeof fs.mkdirSync;
  try { f.sync(); } finally { fs.mkdirSync = original; }
  assert.equal(swapped, true);
  for (const target of [".agents", ".claude"]) {
    assert.equal(fs.readFileSync(path.join(f.root, target, "skills/example/assets/value.txt"), "utf8"), "accepted snapshot");
    assert.equal(fs.existsSync(path.join(f.root, target, "skills/example/assets/sentinel.txt")), false);
  }
});

test("resource entry and depth bounds reject before mirror writes", (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.source, "assets/a/b"), { recursive: true });
  f.config.index.limits.max_files = 2;
  assert.throws(f.sync, /entry\/depth limit/);
  f.config.index.limits.max_files = 100;
  f.config.index.limits.max_depth = 1;
  assert.throws(f.sync, /entry\/depth limit/);
  assert.equal(fs.existsSync(f.mirror), false);
});

test("legacy documents, ordinary resource-name files, and oversized mirror repair remain supported", (t) => {
  const f = fixture(t);
  fs.renameSync(path.join(f.source, "SKILL.md"), path.join(f.source, "SKILLS.md"));
  writeFile(path.join(f.source, "assets"), "not a resource directory");
  f.sync();
  assert.equal(fs.existsSync(path.join(f.mirror, "assets")), false);
  writeFile(path.join(f.mirror, "SKILL.md"), "large drift".repeat(100));
  f.config.index.limits.max_file_bytes = 100;
  f.sync();
  assert.deepEqual(auditSkillMirrors(f.root, f.config), []);
});

test("skill discovery cannot read oversized documents before inventory enforcement", (t) => {
  const f = fixture(t), authority = require("../../core/filesystem_authority");
  writeFile(path.join(f.source, "SKILL.md"), "---\nname: example\ndescription: example\n---\n" + "x".repeat(200));
  f.config.index.limits.max_file_bytes = 100;
  const original = authority.readContainedFile, calls: any[] = [];
  authority.readContainedFile = (input: any, ...args: any[]) => {
    if (input.relativePath.endsWith("SKILL.md")) calls.push(input);
    return original(input, ...args);
  };
  try { assert.throws(f.sync, /byte limit/); }
  finally { authority.readContainedFile = original; }
  assert.ok(calls.length > 0);
  assert.ok(calls.every((call) => call.maxBytes !== undefined && call.maxBytes <= 100), "document consumed before byte limit");
  assert.equal(fs.existsSync(f.mirror), false);
});

test("changed mirror files preserve existing permissions regardless of current umask", (t) => {
  const f = fixture(t);
  writeFile(path.join(f.source, "scripts/run.sh"), "original"); f.sync();
  const target = path.join(f.mirror, "scripts/run.sh"); fs.chmodSync(target, 0o775);
  writeFile(path.join(f.source, "scripts/run.sh"), "changed");
  const mask = process.umask(0o077);
  try { f.sync(); } finally { process.umask(mask); }
  assert.equal(fs.statSync(target).mode & 0o777, 0o775);
});
