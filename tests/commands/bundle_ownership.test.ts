import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { buildBundle } = require("../../commands/bundle");
const { readZipEntries } = require("../../util/zip");
const { buildIndex } = require("../../graph/indexer");
const { loadConfig } = require("../../core/config");
const { buildCapabilitiesIndex } = require("../../graph/capabilities_indexer");
const { buildSkillsIndex } = require("../../graph/skills_indexer");
const marker = "SYNTHETIC_PRIVATE_WORKSPACE_MARKER";
function task(file: string, id: number, title: string, refs = "[]") {
  writeFile(file, `---\nid: task-${id}\ntype: task\ntitle: ${title}\nstatus: backlog\npriority: 1\ncreated: 2026-09-08\nupdated: 2026-09-08\nrefs: ${refs}\n---\n${title}\n`);
}
function fixture(t: { after(fn: () => void): void }, location = ".mdkg/children/child", mdkgDir = ".mdkg") {
  const root = makeTempDir("mdkg-bundle-ownership-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces.root.visibility = "public";
  config.workspaces.child = { path: location, mdkg_dir: mdkgDir, enabled: true, visibility: "private" };
  const save = () => writeFile(configPath, JSON.stringify(config)); save();
  task(path.join(root, ".mdkg/work/task-1-parent.md"), 1, "Public parent");
  const child = path.join(location, mdkgDir);
  task(path.join(root, child, "work/task-2-child.md"), 2, marker);
  writeFile(path.join(root, child, "support.bin"), marker);
  return { root, child, config, save };
}
function exported(root: string, profile = "public", ws?: string) {
  const result = buildBundle({ root, profile, ...(ws ? { ws } : {}) });
  const entries = new Map<string, Buffer>(readZipEntries(result.zip).map((e: any) => [e.name, e.data]));
  return { ...result, entries, global: JSON.parse(entries.get(".mdkg/index/global.json")!.toString()) };
}
for (const location of [".mdkg/children/child", ".mdkg/work/child", ".mdkg/design/child", ".mdkg/archive/child"]) {
  for (const enabled of [true, false]) {
    test(`public bundle excludes nested ${enabled ? "private" : "disabled"} root at ${location}`, (t) => {
      const f = fixture(t, location); f.config.workspaces.child.enabled = enabled; f.save();
      const result = exported(f.root);
      for (const [file, data] of result.entries) {
        assert.ok(!file.startsWith(f.child + "/"), `private path included: ${file}`);
        assert.ok(!data.includes(Buffer.from(marker)), `private bytes included in ${file}`);
      }
      assert.deepEqual(Object.keys(result.global.nodes), ["root:task-1"]);
    });
  }
}
test("selected nested public roots are exported once with correct file and graph ownership", (t) => {
  const f = fixture(t, ".mdkg/work/child"); f.config.workspaces.child.visibility = "public"; f.save();
  const result = exported(f.root), files = result.manifest.files.filter((entry: any) => entry.path.startsWith(f.child + "/"));
  assert.ok(files.length > 0); assert.ok(files.every((entry: any) => entry.workspace === "child"));
  assert.equal(new Set(result.manifest.files.map((entry: any) => entry.path)).size, result.manifest.files.length);
  assert.deepEqual(Object.keys(result.global.nodes).sort(), ["child:task-2", "root:task-1"]);
  const parentOnly = exported(f.root, "public", "root"); assert.ok(!parentOnly.entries.has(`${f.child}/support.bin`));
  const childOnly = exported(f.root, "public", "child"); assert.ok(childOnly.entries.has(`${f.child}/support.bin`)); assert.ok(!childOnly.entries.has(".mdkg/work/task-1-parent.md"));
});
test("private bundle includes each enabled owner once and still excludes disabled owners", (t) => {
  const f = fixture(t, ".mdkg/work/child");
  const result = exported(f.root, "private"); assert.ok(result.entries.has(`${f.child}/support.bin`));
  assert.deepEqual(Object.keys(result.global.nodes).sort(), ["child:task-2", "root:task-1"]);
  f.config.workspaces.child.enabled = false; f.save();
  assert.ok(!exported(f.root, "private").entries.has(`${f.child}/support.bin`));
});
test("nested workspace roots cannot leak through parent skill and capability indexes", (t) => {
  const f = fixture(t, ".mdkg/skills", "private-skill");
  writeFile(path.join(f.root, f.child, "SKILL.md"), `---\nname: private-skill\ndescription: ${marker}\n---\n${marker}\n`);
  const result = exported(f.root);
  for (const [file, data] of result.entries) assert.ok(!data.includes(Buffer.from(marker)), `private bytes in ${file}`);
  const config = loadConfig(f.root), index = buildIndex(f.root, config), caps = buildCapabilitiesIndex(f.root, config, index);
  assert.ok(!caps.records.some((record: any) => record.workspace === "root" && record.path.startsWith(f.child)));
  assert.deepEqual(Object.keys(buildSkillsIndex(f.root, config).skills), []);
});
test("segment boundaries preserve similarly named sibling paths", (t) => {
  const f = fixture(t); writeFile(path.join(f.root, `${f.child}-public`, "support.txt"), "public sibling");
  assert.ok(exported(f.root).entries.has(`${f.child}-public/support.txt`));
});
test("public references to a nested private owner still fail closed", (t) => {
  const f = fixture(t, ".mdkg/work/child"); task(path.join(f.root, ".mdkg/work/task-1-parent.md"), 1, "Public parent", "[child:task-2]");
  assert.throws(() => exported(f.root), /private references/);
});
test("disabled nested malformed documents are not borrowed by the parent parser", (t) => {
  const f = fixture(t, ".mdkg/work/child"); f.config.workspaces.child.enabled = false; f.save();
  writeFile(path.join(f.root, f.child, "work/task-2-child.md"), "not a valid graph node");
  assert.deepEqual(Object.keys(exported(f.root).global.nodes), ["root:task-1"]);
});
test("working and historical graph snapshots use identical deepest workspace ownership", (t) => {
  const f = fixture(t, ".mdkg/work/child"), { readAuthoredSnapshot } = require("../../graph/identity_snapshot");
  const git = (args: string[]) => {
    const result = spawnSync("git", ["-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], { cwd: f.root, encoding: "utf8", env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" } });
    assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
  };
  git(["init", "-b", "main"]); git(["add", "--", ".mdkg"]); git(["commit", "-m", "synthetic ownership baseline"]);
  const before = git(["status", "--porcelain"]);
  for (const revision of [undefined, "HEAD"]) {
    const snapshot = readAuthoredSnapshot(f.root, revision);
    assert.deepEqual(snapshot.nodes.map((entry: any) => entry.qid).sort(), ["child:task-2", "root:task-1"]);
  }
  assert.equal(git(["status", "--porcelain"]), before);
});
test("public grandchild can be selected without borrowing a disabled private ancestor", (t) => {
  const f = fixture(t); f.config.workspaces.child.enabled = false;
  const leaf = path.join(f.child, "descendants/leaf");
  f.config.workspaces.leaf = { path: leaf, mdkg_dir: "memory", enabled: true, visibility: "public" }; f.save();
  task(path.join(f.root, leaf, "memory/work/task-3-leaf.md"), 3, "Public leaf");
  const result = exported(f.root);
  assert.deepEqual(Object.keys(result.global.nodes).sort(), ["leaf:task-3", "root:task-1"]);
  assert.ok(result.manifest.files.filter((entry: any) => entry.path.startsWith(leaf + "/")).every((entry: any) => entry.workspace === "leaf"));
  for (const [file, data] of result.entries) assert.ok(!data.includes(Buffer.from(marker)), `private bytes in ${file}`);
});

for (const syntax of ["./.mdkg//work/./child", ".mdkg\\work\\child"]) {
  test(`normalized workspace path ${syntax} retains the same ownership`, (t) => {
    const f = fixture(t, ".mdkg/work/child");
    f.config.workspaces.child.path = syntax;
    f.config.workspaces.child.mdkg_dir = "./.mdkg//.";
    f.config.workspaces.child.visibility = "public"; f.save();
    const result = exported(f.root);
    assert.deepEqual(Object.keys(result.global.nodes).sort(), ["child:task-2", "root:task-1"]);
    assert.equal(result.manifest.files.find((entry: any) => entry.path === `${f.child}/support.bin`).workspace, "child");
    assert.ok(!exported(f.root, "private", "root").entries.has(`${f.child}/support.bin`));
  });
}
test("a disabled nested symlink is a lexical boundary, not an opened workspace", (t) => {
  const f = fixture(t, ".mdkg/work/child"); f.config.workspaces.child.enabled = false; f.save();
  const childPath = path.join(f.root, f.child);
  fs.renameSync(childPath, path.join(f.root, "private-target"));
  fs.symlinkSync(path.join(f.root, "private-target"), childPath, "dir");
  for (const data of exported(f.root).entries.values()) assert.ok(!data.includes(Buffer.from(marker)));
});
test("normal nested documents and public skill resources retain their parent ownership", (t) => {
  const f = fixture(t);
  task(path.join(f.root, ".mdkg/work/normal/sub/task-3.md"), 3, "Normal nested task");
  writeFile(path.join(f.root, ".mdkg/skills/public-skill/SKILLS.md"), "---\nname: public-skill\ndescription: Normal public skill\n---\nPublic skill body\n");
  writeFile(path.join(f.root, ".mdkg/skills/public-skill/assets/icon.bin"), "public asset");
  const result = exported(f.root);
  assert.ok(result.entries.has(".mdkg/skills/public-skill/assets/icon.bin"));
  assert.ok(result.global.nodes["root:task-3"]);
  assert.equal(JSON.parse(result.entries.get(".mdkg/index/skills.json")!.toString()).skills["public-skill"].ws, "root");
});
test("independent fork mappings preserve nested owner aliases and cross-workspace bindings", (t) => {
  const f = fixture(t, ".mdkg/work/child");
  const { createGraphFormat, newIdentityUuid } = require("../../graph/identity");
  const { planTransportIdentity } = require("../../graph/identity_transport");
  const { parseFrontmatter } = require("../../graph/frontmatter");
  const format = createGraphFormat();
  writeFile(path.join(f.root, ".mdkg/graph.json"), JSON.stringify(format));
  task(path.join(f.root, ".mdkg/work/task-1-parent.md"), 1, "Public parent", "[child:task-2]");
  for (const relative of [".mdkg/work/task-1-parent.md", `${f.child}/work/task-2-child.md`]) {
    const file = path.join(f.root, relative);
    writeFile(file, fs.readFileSync(file, "utf8").replace(/^---\n/, `---\ngraph_id: ${format.graph_id}\nnode_id: ${newIdentityUuid()}\n`));
  }
  const { entries } = exported(f.root, "private");
  const historical = Buffer.from('{"synthetic":"immutable historical receipt"}');
  entries.set(".mdkg/identity/migrations/historical.json", historical);
  const fork = planTransportIdentity(entries, "fork", "sha256:" + "1".repeat(64));
  const receipt = JSON.parse([...fork.additions.values()][0]!.toString());
  assert.deepEqual(receipt.mappings.map((m: any) => m.alias).sort(), ["child:task-2", "root:task-1"]);
  const parent = parseFrontmatter(fork.replacements.get(".mdkg/work/task-1-parent.md").toString(), "parent");
  assert.deepEqual(parent.frontmatter.refs, [receipt.mappings.find((m: any) => m.alias === "child:task-2").to]);
  assert.ok(!fork.replacements.has(".mdkg/identity/migrations/historical.json"));
  assert.deepEqual(entries.get(".mdkg/identity/migrations/historical.json"), historical);
});
test("Git-stage repair attributes an independent nested conflict to its child, without staging", (t) => {
  const f = fixture(t, ".mdkg/work/child");
  const git = (args: string[], success = true) => {
    const result = spawnSync("git", ["-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], { cwd: f.root, encoding: "utf8", env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" } });
    if (success) assert.equal(result.status, 0, result.stderr);
    else assert.notEqual(result.status, 0); return result.stdout.trim();
  };
  git(["init", "-b", "main"]); git(["add", "--", ".mdkg"]); git(["commit", "-m", "synthetic ancestor"]);
  const base = git(["rev-parse", "HEAD"]), relative = `${f.child}/work/task-9.md`;
  for (const branch of ["one", "two"]) {
    git(["checkout", "-b", branch, base]); task(path.join(f.root, relative), 9, `Independent ${branch}`);
    git(["add", "--", relative]); git(["commit", "-m", branch]);
  }
  git(["merge", "--no-edit", "one"], false);
  const before = fs.readFileSync(path.join(f.root, ".git/index"));
  const result = spawnSync(process.execPath, [path.resolve(__dirname, "../../cli.js"), "fix", "ids", "--target", "child:task-9", "--json"], { cwd: f.root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const receipt = JSON.parse(result.stdout);
  assert.equal(receipt.proposed_changes.length, 1);
  assert.equal(receipt.proposed_changes[0].reason, "git_stage_duplicate_id");
  assert.ok(receipt.proposed_changes[0].paths.every((file: string) => file.startsWith(f.child + "/")));
  assert.deepEqual(fs.readFileSync(path.join(f.root, ".git/index")), before);
});
for (const basename of ["SKILL.md", "SKILLS.md"]) {
  test(`disabled ownership at a ${basename} leaf excludes generated skill metadata`, (t) => {
    const f = fixture(t, ".mdkg/skills/demo", basename);
    // Replace this fixture-owned document-root directory with the registered
    // leaf file. Disabled roots must remain boundaries without being opened.
    fs.rmSync(path.join(f.root, f.child), { recursive: true });
    writeFile(path.join(f.root, f.child), `---\nname: demo\ndescription: ${marker}\n---\n${marker}\n`);
    f.config.workspaces.child.enabled = false; f.save();
    for (const [file, data] of exported(f.root).entries) assert.ok(!data.includes(Buffer.from(marker)), file);
  });
}
test("case aliases of configured roots fail closed on case-insensitive filesystems", (t) => {
  const f = fixture(t, ".mdkg/work/child");
  f.config.workspaces.child.path = ".mdkg/work/CHILD";
  f.config.workspaces.child.enabled = false; f.save();
  const aliasesExistingRoot = fs.existsSync(path.join(f.root, ".mdkg/work/CHILD/.mdkg"));
  if (aliasesExistingRoot) {
    assert.throws(() => exported(f.root), /workspace.*spelling/i);
  } else {
    // Separate case-sensitive paths are legitimate: the lowercase folder is
    // not the registered uppercase root, so it remains parent-owned.
    assert.ok(exported(f.root).entries.has(`${f.child}/support.bin`));
  }
});
test("normalized workspace skill cache invalidation follows the same source as discovery", (t) => {
  const f = fixture(t, "projects/child");
  f.config.workspaces.child.path = "projects\\child"; f.save();
  const skill = path.join(f.root, f.child, "skills/demo/SKILL.md");
  writeFile(skill, "---\nname: demo\ndescription: Before edit\n---\nBody\n");
  const { loadCapabilitiesIndex } = require("../../graph/capabilities_index_cache");
  const config = loadConfig(f.root);
  const initial = loadCapabilitiesIndex({ root: f.root, config });
  assert.ok(initial.index.records.some((r: any) => r.description === "Before edit"));
  writeFile(skill, "---\nname: demo\ndescription: After edit\n---\nBody\n");
  fs.utimesSync(skill, new Date(), new Date(Date.now() + 2000));
  const refreshed = loadCapabilitiesIndex({ root: f.root, config });
  assert.ok(refreshed.rebuilt);
  assert.ok(refreshed.index.records.some((r: any) => r.description === "After edit"));
});
