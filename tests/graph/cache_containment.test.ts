import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { loadConfig } = require("../../core/config");
const { writeDerivedIndexes } = require("../../graph/reindex");
const { buildIndex } = require("../../graph/indexer");
const { buildSkillsIndex } = require("../../graph/skills_indexer");
const { buildCapabilitiesIndex } = require("../../graph/capabilities_indexer");
const { buildSubgraphsIndex, writeSubgraphsIndex } = require("../../graph/subgraphs");
const { writeIndex, loadIndex } = require("../../graph/index_cache");
const { writeSkillsIndex, loadSkillsIndex } = require("../../graph/skills_index_cache");
const { writeCapabilitiesIndex, loadCapabilitiesIndex } = require("../../graph/capabilities_index_cache");
const cli = path.resolve(__dirname, "../../cli.js");

function linkOrSkip(t: { skip(message?: string): void }, target: string, link: string, type: "dir" | "file",
  create: (target: string, link: string, type: "dir" | "file") => void = fs.symlinkSync): boolean {
  try { create(target, link, type); return true; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error;
    t.skip("symbolic links unavailable"); return false;
  }
}

function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-cache-containment-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  fs.mkdirSync(path.join(root, ".mdkg/index"));
  const configPath = path.join(root, ".mdkg/config.json");
  const configure = (change: (config: any) => void) => {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    change(config); writeFile(configPath, JSON.stringify(config));
    return loadConfig(root);
  };
  return { root, outside, configure };
}

for (const command of [["index"], ["db", "index", "rebuild"]]) {
  for (const cache of ["nodes", "capabilities"]) {
    test(`${command.join(" ")} rejects linked custom ${cache} destination without outside writes`, (t) => {
      const f = fixture(t);
      writeFile(path.join(f.outside, "victim.json"), "preserved victim\n");
      if (!linkOrSkip(t, f.outside, path.join(f.root, "redirected"), "dir")) return;
      f.configure((config) => {
        if (cache === "nodes") config.index.global_index_path = "redirected/victim.json";
        else config.capabilities.cache_path = "redirected/victim.json";
      });
      const result = spawnSync(process.execPath, [cli, ...command], { cwd: f.root, encoding: "utf8" });
      assert.notEqual(result.status, 0, "unsafe cache write must fail");
      assert.match(result.stdout + result.stderr, /linked ancestor|symbolic link/);
      assert.equal(fs.readFileSync(path.join(f.outside, "victim.json"), "utf8"), "preserved victim\n");
      assert.deepEqual(fs.readdirSync(f.outside), ["victim.json"]);
    });
  }
}

for (const unsafe of ["capabilities", "sqlite"]) {
  test(`aggregate preflight rejects unsafe ${unsafe} before creating any earlier cache output`, (t) => {
    const f = fixture(t);
    if (!linkOrSkip(t, f.outside, path.join(f.root, "redirected"), "dir")) return;
    const config = f.configure((config) => {
      config.index.global_index_path = "safe/new/nodes.json";
      if (unsafe === "capabilities") config.capabilities.cache_path = "redirected/victim.json";
      else { config.index.backend = "sqlite"; config.index.sqlite_path = "redirected/victim.sqlite"; }
    });
    assert.throws(() => writeDerivedIndexes(f.root, config), /linked ancestor|symbolic link/);
    assert.equal(fs.existsSync(path.join(f.root, "safe")), false, "preflight must not create earlier parents");
    assert.deepEqual(fs.readdirSync(path.join(f.root, ".mdkg/index")), []);
    assert.deepEqual(fs.readdirSync(f.outside), []);
  });
}

test("JSON rebuild ignores an unused SQLite destination and preserves native custom JSON paths", (t) => {
  const f = fixture(t);
  if (!linkOrSkip(t, f.outside, path.join(f.root, "redirected"), "dir")) return;
  const nodes = process.platform === "win32" ? "./nested//nodes.json" : "./..cache\\literal//nodes.json";
  const config = f.configure((config) => {
    config.index.global_index_path = nodes;
    config.capabilities.cache_path = "nested/capabilities.json";
    config.index.sqlite_path = "redirected/unused.sqlite";
  });
  const first = writeDerivedIndexes(f.root, config);
  assert.equal(first.paths.nodes, path.resolve(f.root, nodes));
  assert.deepEqual(JSON.parse(fs.readFileSync(first.paths.nodes, "utf8")).nodes, {});
  writeFile(first.paths.nodes, "old cache\n");
  writeDerivedIndexes(f.root, config);
  assert.deepEqual(JSON.parse(fs.readFileSync(first.paths.nodes, "utf8")).nodes, {});
  assert.deepEqual(fs.readdirSync(f.outside), []);
});

const writers = [
  { name: "nodes", write: writeIndex, build: buildIndex },
  { name: "skills", write: writeSkillsIndex, build: buildSkillsIndex },
  { name: "capabilities", write: writeCapabilitiesIndex, build: buildCapabilitiesIndex },
  { name: "subgraphs", write: writeSubgraphsIndex, build: (root: string, config: any) => buildSubgraphsIndex(root, config).index },
];
for (const writer of writers) {
  for (const target of ["parent-link", "final-link", "dangling-link", "inward-link"]) {
    test(`${writer.name} cache writer rejects ${target} without relying on a mutation lock`, (t) => {
      const f = fixture(t);
      const index = writer.build(f.root, loadConfig(f.root));
      let destination = path.join(f.root, "output/victim.json");
      if (target === "parent-link") {
        if (!linkOrSkip(t, f.outside, path.join(f.root, "output"), "dir")) return;
      }
      else {
        fs.mkdirSync(path.dirname(destination));
        const sentinel = target === "inward-link" ? path.join(f.root, "inside.json") : path.join(f.outside, "victim.json");
        if (target !== "dangling-link") writeFile(sentinel, "preserved\n");
        if (!linkOrSkip(t, sentinel, destination, "file")) return;
      }
      if (target === "parent-link") writeFile(path.join(f.outside, "victim.json"), "preserved\n");
      const outsideBefore = fs.readdirSync(f.outside).map(name => [name, fs.readFileSync(path.join(f.outside, name), "utf8")]);
      assert.throws(() => writer.write(f.root, destination, index), /linked ancestor|symbolic link/);
      assert.deepEqual(fs.readdirSync(f.outside).map(name => [name, fs.readFileSync(path.join(f.outside, name), "utf8")]), outsideBefore);
      if (target === "inward-link") assert.equal(fs.readFileSync(path.join(f.root, "inside.json"), "utf8"), "preserved\n");
      assert.deepEqual(fs.readdirSync(path.dirname(destination)).filter(name => name.endsWith(".tmp")), []);
    });
  }
  test(`${writer.name} cache writer preserves contained replacement and explicit root authority`, (t) => {
    const f = fixture(t);
    const index = writer.build(f.root, loadConfig(f.root));
    const destination = path.join(f.root, "nested/new/cache.json");
    writer.write(f.root, destination, index);
    const content = fs.readFileSync(destination, "utf8");
    writeFile(destination, "previous bytes");
    writer.write(f.root, destination, index);
    assert.equal(fs.readFileSync(destination, "utf8"), content);
    // A forged metadata root must not promote an external destination.
    index.meta.root = f.outside;
    assert.throws(() => writer.write(f.root, path.join(f.outside, "escaped.json"), index), /root|parent|outside/);
    assert.deepEqual(fs.readdirSync(f.outside), []);
  });
}

for (const kind of ["nodes", "skills", "capabilities", "subgraphs"]) {
  test(`${kind} loader auto-persistence uses contained cache writer`, (t) => {
    const f = fixture(t);
    const config = loadConfig(f.root);
    const filename = kind === "nodes" ? "global.json" : `${kind}.json`;
    const external = path.join(f.outside, filename);
    writeFile(external, "preserved non-cache bytes\n");
    fs.utimesSync(external, 1, 1); // Force the existing legacy cache-rebuild path.
    if (!linkOrSkip(t, external, path.join(f.root, ".mdkg/index", filename), "file")) return;
    const options = { root: f.root, config, persistReindex: true };
    let load: () => unknown;
    if (kind === "skills") load = () => loadSkillsIndex(options);
    else if (kind === "capabilities") load = () => loadCapabilitiesIndex(options);
    else if (kind === "nodes") load = () => loadIndex(options);
    else {
      config.subgraphs = { inert: { enabled: false, visibility: "private", sources: [] } };
      load = () => loadIndex({ ...options, useCache: false });
    }
    assert.throws(load, /linked ancestor|symbolic link/);
    assert.equal(fs.readFileSync(external, "utf8"), "preserved non-cache bytes\n");
    assert.deepEqual(fs.readdirSync(f.outside), [filename]);
  });
}

test("cache loaders with persistence disabled do not create derived cache files", (t) => {
  const f = fixture(t);
  const options = { root: f.root, config: loadConfig(f.root), persistReindex: false };
  loadIndex(options); loadSkillsIndex(options); loadCapabilitiesIndex(options);
  assert.deepEqual(fs.readdirSync(path.join(f.root, ".mdkg/index")), []);
});

test("default SQLite aggregate rebuild remains supported", (t) => {
  const f = fixture(t);
  const config = f.configure(config => { config.index.backend = "sqlite"; });
  const result = writeDerivedIndexes(f.root, config);
  assert.equal(fs.readFileSync(result.paths.sqlite).subarray(0, 16).toString(), "SQLite format 3\0");
  for (const file of Object.values(result.paths) as string[]) assert.ok(fs.statSync(file).isFile());
});

test("link-unavailable fixture handling skips only EPERM and exposes unrelated errors", () => {
  const messages: string[] = [];
  const context = { skip(message = "") { messages.push(message); } };
  const denied = Object.assign(new Error("fixture lacks link privilege"), { code: "EPERM" });
  assert.equal(linkOrSkip(context, "target", "link", "file", () => { throw denied; }), false);
  assert.deepEqual(messages, ["symbolic links unavailable"]);
  const unrelated = Object.assign(new Error("fixture path collision"), { code: "EEXIST" });
  assert.throws(() => linkOrSkip(context, "target", "link", "file", () => { throw unrelated; }), error => error === unrelated);
  assert.equal(linkOrSkip(context, "target", "link", "file", () => undefined), true);
  assert.equal(messages.length, 1);
});
