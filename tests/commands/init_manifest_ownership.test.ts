import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const cli = path.join(runtime, "cli.js");
const { writeInitManifest } = require(path.join(runtime, "commands/init_manifest"));
const roots: string[] = [];
after(() => { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); });
const hash = (p: string) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  function walk(dir: string) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name), relative = path.relative(root, file);
    if (entry.isDirectory()) { result[relative + "/"] = "directory"; walk(file); }
    else result[relative] = entry.isSymbolicLink() ? fs.readlinkSync(file) : hash(file);
  } }
  walk(root); return result;
}
function fixture() {
  const owned = makeTempDir("mdkg-init-manifest-ownership-"); roots.push(owned);
  const root = path.join(owned, "project"), peer = path.join(owned, "peer.json");
  fs.mkdirSync(root);
  const result = spawnSync(process.execPath, [cli, "init"], { cwd: root, encoding: "utf8", timeout: 30000 });
  assert.equal(result.status, 0, result.stderr);
  const manifest = path.join(root, ".mdkg/init-manifest.json");
  const original = JSON.parse(fs.readFileSync(manifest, "utf8")); original.mdkg_version = "fixture-before";
  fs.writeFileSync(manifest, JSON.stringify(original));
  fs.mkdirSync(path.join(root, ".git")); fs.writeFileSync(path.join(root, ".git/index"), "staged bytes");
  return { owned, root, peer, manifest };
}
for (const flags of [[], ["--agent"], ["--graph-only"]]) for (const force of [false, true]) {
  test(`init refuses a hard-linked manifest before effects: ${flags.join(" ") || "default"} force=${force}`, () => {
    const { owned, root, peer, manifest } = fixture();
    fs.linkSync(manifest, peer);
    const before = snapshot(owned), stat = fs.statSync(peer);
    const result = spawnSync(process.execPath, [cli, "init", ...flags, ...(force ? ["--force"] : [])], { cwd: root, encoding: "utf8", timeout: 30000 });
    assert.equal(result.signal, null); assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /hard.link|multiple links|single.link/);
    assert.deepEqual(snapshot(owned), before);
    assert.equal(fs.statSync(peer).ino, stat.ino); assert.equal(fs.statSync(peer).nlink, 2);
  });
}
test("ordinary repeated init retains the manifest inode, mode and owner while refreshing provenance", () => {
  const { root, manifest } = fixture(); fs.chmodSync(manifest, 0o600);
  const before = fs.statSync(manifest);
  for (const flags of [[], ["--agent"], ["--graph-only"], ["--force"]]) {
    const result = spawnSync(process.execPath, [cli, "init", ...flags], { cwd: root, encoding: "utf8", timeout: 30000 });
    assert.equal(result.status, 0, result.stderr);
    const current = fs.statSync(manifest);
    assert.equal(current.ino, before.ino); assert.equal(current.mode, before.mode);
    assert.equal(current.uid, before.uid); assert.equal(current.gid, before.gid);
    assert.notEqual(JSON.parse(fs.readFileSync(manifest, "utf8")).mdkg_version, "fixture-before");
    assert.equal(fs.readFileSync(path.join(root, ".git/index"), "utf8"), "staged bytes");
  }
});

test("manifest writer independently refuses existing linked and non-file targets", () => {
  for (const kind of ["hardlink", "symlink", "directory"]) {
    const { owned, root, peer, manifest } = fixture();
    if (kind === "hardlink") fs.linkSync(manifest, peer);
    else { fs.renameSync(manifest, peer); if (kind === "symlink") fs.symlinkSync(peer, manifest); else fs.mkdirSync(manifest); }
    const before = snapshot(owned);
    assert.throws(() => writeInitManifest(root, ".mdkg/init-manifest.json", { changed: true }), /single-link|symbolic link|file|directory/);
    assert.deepEqual(snapshot(owned), before);
  }
});

for (const timing of ["before-open", "after-open", "move-open-inode"]) {
  test(`manifest writer rechecks descriptor and pathname custody ${timing}`, () => {
    const { root, peer, manifest } = fixture(), before = fs.readFileSync(manifest);
    const open = fs.openSync; let injected = false;
    fs.openSync = ((file: any, ...args: any[]) => {
      if (String(file) !== manifest || injected) return (open as any)(file, ...args);
      injected = true;
      if (timing === "before-open") fs.linkSync(manifest, peer);
      const handle = (open as any)(file, ...args);
      if (timing === "after-open") fs.linkSync(manifest, peer);
      if (timing === "move-open-inode") { fs.renameSync(manifest, peer); fs.writeFileSync(manifest, "replacement"); }
      return handle;
    }) as typeof fs.openSync;
    try {
      assert.throws(() => writeInitManifest(root, ".mdkg/init-manifest.json", { changed: true }), /single-link|changed before write/);
      assert.equal(injected, true);
      assert.deepEqual(fs.readFileSync(peer), before);
      assert.deepEqual(fs.readFileSync(manifest), timing === "move-open-inode" ? Buffer.from("replacement") : before);
    } finally { fs.openSync = open; }
  });
}

test("manifest writer creates missing owned parents and a valid exclusive new file", () => {
  const root = makeTempDir("mdkg-manifest-create-"); roots.push(root);
  const manifest = { schema_version: 1, tool: "mdkg", mdkg_version: "fixture", files: [] };
  writeInitManifest(root, "legacy/init-manifest.json", manifest);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "legacy/init-manifest.json"), "utf8")), manifest);
  assert.equal(fs.statSync(path.join(root, "legacy/init-manifest.json")).nlink, 1);
});
