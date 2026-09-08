import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { loadConfig } = require("../../core/config");
const { buildIndex } = require("../../graph/indexer");
const { listWorkspaceDocFiles, listWorkspaceDocFilesByAlias } = require("../../graph/workspace_files");
const cli = path.resolve(__dirname, "../../cli.js");
const marker = "external_workspace_marker_11";
const task = `---\nid: task-99\ntype: task\ntitle: ${marker}\nstatus: todo\npriority: 2\ntags: []\nlinks: []\nartifacts: []\nrelates: []\nblocked_by: []\nblocks: []\nrefs: []\naliases: []\ncreated: 2026-01-06\nupdated: 2026-01-06\n---\n\nBody\n`;

function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-workspace-containment-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  writeRootConfig(root); writeDefaultTemplates(root);
  return { root, outside };
}
function linkOrSkip(t: { skip(message?: string): void }, target: string, link: string, type: "dir" | "file" = "dir"): boolean {
  try { fs.symlinkSync(target, link, type); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error; t.skip("symbolic links unavailable"); return false; }
}

for (const folder of ["core", "design", "work", "archive"]) {
  for (const workspace of ["root", "secondary"]) {
    test(`discovery rejects linked ${workspace} ${folder} before exposing node metadata`, (t) => {
      const f = fixture(t);
      writeFile(path.join(f.outside, "node.md"), task);
      let documentRoot = path.join(f.root, ".mdkg");
      if (workspace === "secondary") {
        documentRoot = path.join(f.root, "project/.graph");
        fs.mkdirSync(documentRoot, { recursive: true });
        const configPath = path.join(f.root, ".mdkg/config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        config.workspaces.child = { path: "project", enabled: true, mdkg_dir: ".graph", visibility: "private" };
        writeFile(configPath, JSON.stringify(config));
      }
      if (!linkOrSkip(t, f.outside, path.join(documentRoot, folder))) return;
      const config = loadConfig(f.root);
      for (const discover of [listWorkspaceDocFiles, listWorkspaceDocFilesByAlias, buildIndex]) {
        assert.throws(() => discover(f.root, config), /linked ancestor|symbolic link/);
      }
      const result = spawnSync(process.execPath, [cli, "search", marker], { cwd: f.root, encoding: "utf8" });
      assert.notEqual(result.status, 0);
      assert.equal((result.stdout + result.stderr).includes(marker), false);
      assert.equal(fs.readFileSync(path.join(f.outside, "node.md"), "utf8"), task);
    });
  }
  for (const flags of [[], ["--headings", "--apply"]]) {
    test(`format ${flags.join(" ")} rejects linked ${folder} before any local or external replacement`, (t) => {
      const f = fixture(t);
      const local = path.join(f.root, ".mdkg/design/local.md");
      if (folder !== "design") writeFile(local, task.replace("task-99", "task-1"));
      const content = flags.length ? "---\ntype: task\n---\n\nBody\n" : task;
      writeFile(path.join(f.outside, "node.md"), content);
      if (!linkOrSkip(t, f.outside, path.join(f.root, ".mdkg", folder))) return;
      const result = spawnSync(process.execPath, [cli, "format", ...flags], { cwd: f.root, encoding: "utf8" });
      assert.notEqual(result.status, 0, result.stdout);
      assert.match(result.stdout + result.stderr, /linked ancestor|symbolic link/);
      assert.equal(fs.readFileSync(path.join(f.outside, "node.md"), "utf8"), content);
      assert.deepEqual(fs.readdirSync(f.outside), ["node.md"]);
      if (folder !== "design") assert.equal(fs.readFileSync(local, "utf8"), task.replace("task-99", "task-1"));
    });
  }
}

for (const kind of ["inward", "dangling"]) {
  test(`document roots reject ${kind} directory links`, (t) => {
    const f = fixture(t);
    const target = kind === "inward" ? path.join(f.root, "inside") : path.join(f.outside, "missing");
    if (kind === "inward") writeFile(path.join(target, "node.md"), task);
    if (!linkOrSkip(t, target, path.join(f.root, ".mdkg/work"))) return;
    assert.throws(() => listWorkspaceDocFiles(f.root, loadConfig(f.root)), /linked ancestor|symbolic link/);
  });
}

test("ordinary missing roots, nested files and excluded links retain discovery semantics", (t) => {
  const f = fixture(t);
  const config = loadConfig(f.root);
  assert.deepEqual(listWorkspaceDocFiles(f.root, config), []);
  const name = process.platform === "win32" ? "..nested/Unicode é.md" : "..nested\\literal/Unicode é.md";
  const node = path.join(f.root, ".mdkg/work", name);
  writeFile(node, task);
  writeFile(path.join(f.root, ".mdkg/archive/item/source/ignored.md"), "not a graph sidecar");
  if (!linkOrSkip(t, f.outside, path.join(f.root, ".mdkg/work/ignored-directory"))) return;
  if (!linkOrSkip(t, path.join(f.outside, "not-created"), path.join(f.root, ".mdkg/work/ignored-file.md"), "file")) return;
  assert.deepEqual(listWorkspaceDocFiles(f.root, config), [node]);
  assert.deepEqual(listWorkspaceDocFilesByAlias(f.root, config).root, [node]);
  assert.equal(buildIndex(f.root, config).nodes["root:task-99"].title, marker);
});

for (const mode of ["index-tolerant", "format", "headings"]) {
  test(`${mode} rechecks a document replaced with a link after discovery`, (t) => {
    const f = fixture(t);
    const local = path.join(f.root, ".mdkg/work/node.md");
    const outside = path.join(f.outside, "node.md");
    writeFile(local, task); writeFile(outside, task);
    const probe = path.join(f.root, "probe");
    if (!linkOrSkip(t, outside, probe, "file")) return;
    fs.unlinkSync(probe);
    const discovery = require("../../graph/workspace_files");
    const original = discovery.listWorkspaceDocFilesByAlias;
    t.mock.method(discovery, "listWorkspaceDocFilesByAlias", (...args: unknown[]) => {
      const result = original(...args);
      fs.unlinkSync(local);
      fs.symlinkSync(outside, local, "file");
      return result;
    });
    if (mode === "index-tolerant") {
      assert.throws(() => buildIndex(f.root, loadConfig(f.root), { tolerant: true }), /symbolic link/);
    } else {
      const { runFormatCommand } = require("../../commands/format");
      assert.throws(() => runFormatCommand({ root: f.root, headings: mode === "headings", apply: true }), /format(?: --headings)? failed/);
    }
    assert.equal(fs.readFileSync(outside, "utf8"), task);
    assert.deepEqual(fs.readdirSync(f.outside), ["node.md"]);
  });
}

test("disabled linked workspace is not scanned and ordinary formatting is idempotent", (t) => {
  const f = fixture(t);
  const local = path.join(f.root, ".mdkg/work/node.md");
  writeFile(local, task);
  if (!linkOrSkip(t, f.outside, path.join(f.root, "disabled"))) return;
  const configPath = path.join(f.root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces.disabled = { path: "disabled", enabled: false, mdkg_dir: ".mdkg", visibility: "private" };
  writeFile(configPath, JSON.stringify(config));
  assert.deepEqual(listWorkspaceDocFiles(f.root, loadConfig(f.root)), [local]);
  const { runFormatCommand } = require("../../commands/format");
  runFormatCommand({ root: f.root });
  const first = fs.readFileSync(local, "utf8");
  runFormatCommand({ root: f.root });
  assert.equal(fs.readFileSync(local, "utf8"), first);
  assert.equal(buildIndex(f.root, loadConfig(f.root)).nodes["root:task-99"].title, marker);
});
