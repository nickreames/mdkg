import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const runtime = process.env.MDKG_TEST_PACKAGE ? path.join(process.env.MDKG_TEST_PACKAGE, "dist") : path.resolve(__dirname, "../..");
const cli = path.join(runtime, "cli.js");
const { parseFrontmatter, formatFrontmatter } = require(path.join(runtime, "graph/frontmatter"));
const { runArchiveCompressCommand } = require(path.join(runtime, "commands/archive"));
const { readSingleFileZip } = require(path.join(runtime, "util/zip"));
function run(root: string, args: string[]) { return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 20000 }); }
function config(root: string, change: (value: any) => void) {
  const file = path.join(root, ".mdkg/config.json"), value = JSON.parse(fs.readFileSync(file, "utf8"));
  change(value); fs.writeFileSync(file, JSON.stringify(value));
}
function fields(file: string, change: Record<string, string>) {
  const parsed = parseFrontmatter(fs.readFileSync(file, "utf8"), file);
  fs.writeFileSync(file, ["---", ...formatFrontmatter({ ...parsed.frontmatter, ...change }), "---", parsed.body].join("\n"));
}
function inventory(root: string) {
  const result: Record<string, string> = {};
  function walk(dir: string) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name), key = path.relative(root, file);
    if (e.isDirectory()) { result[key] = "directory"; walk(file); }
    else result[key] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } }
  walk(root); return result;
}
function fixture(t: any) {
  const root = makeTempDir("archive-payload-owner-"); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root); writeFile(path.join(root, ".mdkg/core/core.md"), "# Core\n");
  writeFile(path.join(root, "payload.txt"), "PUBLIC_SYNTHETIC_INPUT\n");
  const added = run(root, ["archive", "add", "payload.txt", "--id", "archive.a", "--visibility", "public", "--json"]);
  assert.equal(added.status, 0, added.stderr);
  const dir = path.join(root, ".mdkg/archive/archive.a"), sidecar = path.join(dir, "payload.txt.md");
  fields(sidecar, { updated: "2000-01-01" });
  writeFile(path.join(root, ".git/index"), "index sentinel");
  writeFile(path.join(root, ".mdkg/state/selected-goal.json"), "{}\n");
  writeFile(path.join(root, ".mdkg/db/runtime/sentinel"), "runtime sentinel");
  return { root, dir, sidecar, raw: path.join(dir, "source/payload.txt"), zip: path.join(dir, "payload.txt.zip") };
}
function refusal(root: string, args = ["archive", "compress", "archive.a", "--json"]) {
  const before = inventory(root), result = run(root, args);
  assert.equal(result.error, undefined); assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, /owner|layout|overlap|collision|spelling|reserved|protected|resource/);
  assert.deepEqual(inventory(root), before);
}
for (const enabled of [false, true]) for (const kind of ["raw", "cache"]) {
  test(`compression refuses ${kind} payload owned by nested ${enabled ? "private" : "disabled"} workspace`, t => {
    const f = fixture(t), prefix = kind === "raw" ? "source/child" : "child";
    const child = path.join(f.dir, prefix, ".mdkg"); writeFile(path.join(child, "private.txt"), "PRIVATE_SYNTHETIC_SENTINEL\n");
    writeFile(path.join(child, "target.zip"), "PRIVATE_TARGET_SENTINEL\n");
    config(f.root, c => { c.workspaces.child = { path: path.relative(f.root, path.dirname(child)), mdkg_dir: ".mdkg", enabled, visibility: "private" }; });
    fields(f.sidecar, kind === "raw" ? { stored_path: `${prefix}/.mdkg/private.txt` } : { compressed_path: `${prefix}/.mdkg/target.zip` });
    refusal(f.root);
  });
}
for (const target of ["own-raw", "own-sidecar", "other-sidecar", "source-cache", "nested-metadata", "non-zip"]) {
  test(`compression refuses cache destination ${target}`, t => {
    const f = fixture(t);
    let destination = "";
    if (target === "own-raw") destination = "source/payload.txt";
    if (target === "own-sidecar") destination = "payload.txt.md";
    if (target === "other-sidecar") { destination = "other.md"; fs.copyFileSync(f.sidecar, path.join(f.dir, destination)); fields(path.join(f.dir, destination), { id: "archive.other" }); }
    if (target === "source-cache") { destination = "source/foreign.zip"; writeFile(path.join(f.dir, destination), "UNRELATED_RAW\n"); }
    if (target === "nested-metadata") { destination = ".mdkg/state/receipt.zip"; writeFile(path.join(f.dir, destination), "UNRELATED_STATE\n"); }
    if (target === "non-zip") { destination = "notes.txt"; writeFile(path.join(f.dir, destination), "USER_NOTES\n"); }
    fields(f.sidecar, { compressed_path: destination }); refusal(f.root);
  });
}
for (const kind of ["sidecar", "cache", "outside-source"]) {
  test(`compression refuses raw input from ${kind}`, t => {
    const f = fixture(t);
    const stored = kind === "sidecar" ? "payload.txt.md" : kind === "cache" ? "payload.txt.zip" : "private.txt";
    if (kind === "outside-source") writeFile(path.join(f.dir, stored), "PRIVATE_SYNTHETIC_SENTINEL\n");
    fields(f.sidecar, { stored_path: stored }); refusal(f.root);
  });
}
for (const all of [false, true]) for (const kind of ["raw", "cache"]) {
  test(`${all ? "all" : "direct"} compression refuses shared ${kind} claimed by another archive`, t => {
    const f = fixture(t), other = path.join(f.dir, "other.md"); fs.copyFileSync(f.sidecar, other);
    writeFile(path.join(f.dir, "source/other.txt"), "OTHER_INPUT\n");
    fields(other, { id: "archive.other", visibility: "private", stored_path: kind === "raw" ? "source/payload.txt" : "source/other.txt", compressed_path: kind === "cache" ? "payload.txt.zip" : "other.zip" });
    refusal(f.root, ["archive", "compress", ...(all ? ["--all"] : ["archive.a"]), "--json"]);
  });
}
test("all resource authority is checked before the first payload read", t => {
  const f = fixture(t), other = path.join(f.dir, "other.md"); fs.copyFileSync(f.sidecar, other);
  fields(other, { id: "archive.z", stored_path: "source/private.txt", compressed_path: "payload.txt.md" });
  writeFile(path.join(f.dir, "source/private.txt"), "SECOND_PAYLOAD\n");
  const before = inventory(f.root), target = fs.statSync(f.raw), original = fs.readSync; let reads = 0;
  t.mock.method(fs, "readSync", (...args: any[]) => { const s = fs.fstatSync(args[0]); if (s.dev === target.dev && s.ino === target.ino) reads++; return (original as any)(...args); });
  t.mock.method(console, "log", () => {});
  assert.throws(() => runArchiveCompressCommand({ root: f.root, all: true, json: true }), /owner|layout|overlap|collision|resource/);
  assert.equal(reads, 0); assert.deepEqual(inventory(f.root), before);
});
test("compression rejects configured runtime storage even inside archive layout", t => {
  const f = fixture(t), target = path.join(f.dir, "owned-db/runtime.zip"); writeFile(target, "RUNTIME_SENTINEL\n");
  config(f.root, c => { const base = path.relative(f.root, path.dirname(target)); c.db = { ...c.db, root_path: base, schema_path: `${base}/schema`, migrations_path: `${base}/schema/migrations`, runtime_path: `${base}/runtime.zip`, state_path: `${base}/state/project.sqlite`, receipts_path: `${base}/receipts` }; });
  fields(f.sidecar, { compressed_path: "owned-db/runtime.zip" }); refusal(f.root);
});
for (const separator of ["/", "\\"]) {
  test(`compression protects the actual template root with ${JSON.stringify(separator)} separators`, t => {
    const f = fixture(t), prefix = ".mdkg/archive/archive.a/source/templates";
    fs.cpSync(path.join(f.root, ".mdkg/templates"), path.join(f.root, prefix), { recursive: true });
    config(f.root, c => { c.templates.root_path = prefix.split("/").join(separator); });
    fields(f.sidecar, { stored_path: "source/templates/default/task.md" });
    refusal(f.root);
  });
}
for (const name of [".git", ".mdkg"]) {
  test(`explicit regular ${name} input remains regenerable`, t => {
    const f = fixture(t), outside = makeTempDir("archive-dotfile-source-");
    t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
    writeFile(path.join(outside, name), "EXPLICIT_REGULAR_DOTFILE\n");
    const added = run(f.root, ["archive", "add", path.join(outside, name), "--id", "archive.dotfile", "--json"]);
    assert.equal(added.status, 0, added.stderr);
    const receipt = JSON.parse(added.stdout).archive;
    fs.unlinkSync(path.join(f.root, receipt.compressed_path));
    const compressed = run(f.root, ["archive", "compress", "archive.dotfile", "--json"]);
    assert.equal(compressed.status, 0, compressed.stderr);
    assert.equal(run(f.root, ["archive", "verify", "archive.dotfile", "--json"]).status, 0);
  });
}
test("an unselected literal hash filename does not block another archive", t => {
  const f = fixture(t);
  writeFile(path.join(f.root, "literal#name.txt"), "EXPLICIT_LITERAL_FILENAME\n");
  const added = run(f.root, ["archive", "add", "literal#name.txt", "--id", "archive.literal", "--json"]);
  assert.equal(added.status, 0, added.stderr);
  const compressed = run(f.root, ["archive", "compress", "archive.a", "--json"]);
  assert.equal(compressed.status, 0, compressed.stderr);
  const literal = run(f.root, ["archive", "compress", "archive.literal", "--json"]);
  assert.equal(literal.status, 0, literal.stderr);
  assert.equal(run(f.root, ["archive", "verify", "archive.literal", "--json"]).status, 0);
});
for (const state of ["missing", "corrupt", "changed-raw", "normalized-layout"]) {
  test(`legitimate ${state} archive regeneration and verification remain supported`, t => {
    const f = fixture(t);
    if (state === "missing") fs.unlinkSync(f.zip);
    if (state === "corrupt") fs.writeFileSync(f.zip, "CORRUPT_OWNED_CACHE");
    if (state === "changed-raw") fs.appendFileSync(f.raw, "Approved local revision\n");
    if (state === "normalized-layout") { fields(f.sidecar, { stored_path: "./source//payload.txt", compressed_path: "./custom.zip" }); }
    const result = run(f.root, ["archive", "compress", "archive.a", "--json"]); assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).count, 1);
    const verified = run(f.root, ["archive", "verify", "archive.a", "--json"]); assert.equal(verified.status, 0, verified.stdout + verified.stderr);
  });
}
test("an explicitly supplied external archive-add input remains allowed", t => {
  const f = fixture(t), outside = makeTempDir("archive-explicit-source-"); t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  writeFile(path.join(outside, "input.txt"), "EXPLICIT_USER_SOURCE\n");
  const result = run(f.root, ["archive", "add", path.join(outside, "input.txt"), "--id", "archive.explicit", "--json"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(run(f.root, ["archive", "compress", "archive.explicit", "--json"]).status, 0);
});

test("private payload is never opened or copied into a public parent ZIP", t => {
  const f = fixture(t), child = path.join(f.dir, "source/child/.mdkg"), secret = path.join(child, "private.txt");
  writeFile(secret, "PRIVATE_SYNTHETIC_SENTINEL\n");
  config(f.root, c => { c.workspaces.root.visibility = "public"; c.workspaces.child = { path: path.relative(f.root, path.dirname(child)), mdkg_dir: ".mdkg", enabled: false, visibility: "private" }; });
  fields(f.sidecar, { stored_path: "source/child/.mdkg/private.txt" });
  const before = inventory(f.root), target = fs.statSync(secret), original = fs.readSync; let privateReads = 0;
  t.mock.method(fs, "readSync", (...args: any[]) => { const s = fs.fstatSync(args[0]); if (s.dev === target.dev && s.ino === target.ino) privateReads++; return (original as any)(...args); });
  t.mock.method(console, "log", () => {});
  assert.throws(() => runArchiveCompressCommand({ root: f.root, id: "archive.a", json: true }), /workspace owner/);
  assert.equal(privateReads, 0); assert.deepEqual(inventory(f.root), before);
  assert.equal(readSingleFileZip(fs.readFileSync(f.zip)).data.toString(), "PUBLIC_SYNTHETIC_INPUT\n");
  const exported = run(f.root, ["bundle", "create", "--profile", "public", "--json"]);
  assert.notEqual(exported.status, 0); assert.equal(fs.existsSync(path.join(f.root, ".mdkg/bundles/public/all.mdkg.zip")), false);
  assert.doesNotMatch(exported.stdout + exported.stderr, /PRIVATE_SYNTHETIC_SENTINEL/);
});

for (const [actual, supplied] of [["Private", "private"], ["caf\u00e9", "cafe\u0301"]]) {
  test(`filesystem alias ${JSON.stringify(supplied)} cannot bypass a configured nested owner`, t => {
    const f = fixture(t), child = path.join(f.dir, "source", actual, ".mdkg");
    writeFile(path.join(child, "private.txt"), "PRIVATE_ALIAS_SENTINEL\n");
    config(f.root, c => { c.workspaces.child = { path: path.relative(f.root, path.dirname(child)), mdkg_dir: ".mdkg", enabled: false, visibility: "private" }; });
    fields(f.sidecar, { stored_path: `source/${supplied}/.mdkg/private.txt` });
    // Exact-entry spelling rejects aliases on insensitive filesystems; reserved
    // metadata layout rejects the same attempted route on sensitive hosts.
    refusal(f.root);
  });
}

test("portable aliases between two missing cache destinations refuse before writes", t => {
  const f = fixture(t), other = path.join(f.dir, "other.md"); fs.copyFileSync(f.sidecar, other);
  writeFile(path.join(f.dir, "source/other.txt"), "OTHER\n");
  fields(f.sidecar, { compressed_path: "Cache.zip" });
  fields(other, { id: "archive.other", stored_path: "source/other.txt", compressed_path: "cache.zip" });
  refusal(f.root, ["archive", "compress", "--all", "--json"]);
});

test("POSIX literal backslash cache names do not redirect into another workspace", t => {
  if (path.sep !== "/") return t.skip("POSIX filename representation");
  const f = fixture(t), child = path.join(f.dir, "child/.mdkg"), target = path.join(child, "cache.zip");
  writeFile(target, "PRIVATE_CACHE_SENTINEL\n");
  config(f.root, c => { c.workspaces.child = { path: path.relative(f.root, path.dirname(child)), mdkg_dir: ".mdkg", enabled: false, visibility: "private" }; });
  const literal = "child\\.mdkg\\cache.zip"; fields(f.sidecar, { compressed_path: literal });
  const result = run(f.root, ["archive", "compress", "archive.a", "--json"]); assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(target, "utf8"), "PRIVATE_CACHE_SENTINEL\n");
  assert.equal(readSingleFileZip(fs.readFileSync(path.join(f.dir, literal))).data.toString(), "PUBLIC_SYNTHETIC_INPUT\n");
});

test("separate custom caches in a shared archive directory remain valid", t => {
  const f = fixture(t), other = path.join(f.dir, "other.md"); fs.copyFileSync(f.sidecar, other);
  writeFile(path.join(f.dir, "source/nested/other.txt"), "OTHER\n");
  fields(other, { id: "archive.other", stored_path: "source/nested/other.txt", compressed_path: "cache/other.zip" });
  // The existing cache parent is operator-owned; compression does not create it.
  fs.mkdirSync(path.join(f.dir, "cache"));
  const result = run(f.root, ["archive", "compress", "--all", "--json"]); assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).count, 2);
  assert.equal(run(f.root, ["archive", "verify", "--json"]).status, 0);
});

test("ancestor and descendant cache targets cannot overlap", t => {
  const f = fixture(t), other = path.join(f.dir, "other.md"); fs.copyFileSync(f.sidecar, other);
  writeFile(path.join(f.dir, "source/other.txt"), "OTHER\n");
  fields(f.sidecar, { compressed_path: "cache.zip" });
  fields(other, { id: "archive.other", stored_path: "source/other.txt", compressed_path: "cache.zip/nested.zip" });
  refusal(f.root, ["archive", "compress", "--all", "--json"]);
});

test("resource spelling inspection is bounded without payload reads or writes", t => {
  const f = fixture(t), { loadConfig } = require(path.join(runtime, "core/config"));
  config(f.root, c => { c.index.limits = { ...loadConfig(f.root).index.limits, max_files: 32 }; });
  for (let i = 0; i < 321; i++) writeFile(path.join(f.dir, `unrelated-${i}.txt`), "");
  refusal(f.root);
});

test("sidecar payload authority changed after index admission refuses before writes", t => {
  const f = fixture(t), authority = require(path.join(runtime, "core/filesystem_authority")), original = authority.readContainedFile;
  writeFile(path.join(f.dir, "source/changed.txt"), "CHANGED_INPUT\n");
  const before = inventory(f.root); let sidecarReads = 0;
  t.mock.method(authority, "readContainedFile", (input: any, encoding: any) => {
    if (path.resolve(input.root, input.relativePath) === f.sidecar && ++sidecarReads === 2) fields(f.sidecar, { stored_path: "source/changed.txt" });
    return original(input, encoding);
  });
  t.mock.method(console, "log", () => {});
  assert.throws(() => runArchiveCompressCommand({ root: f.root, id: "archive.a", json: true }), /resource authority changed/);
  assert.equal(sidecarReads, 2);
  before[path.relative(f.root, f.sidecar)] = crypto.createHash("sha256").update(fs.readFileSync(f.sidecar)).digest("hex");
  assert.deepEqual(inventory(f.root), before);
});
