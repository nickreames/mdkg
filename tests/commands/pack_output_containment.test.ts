import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { runPackCommand } = require("../../commands/pack");
const outputPaths = require("../../util/output");
const marker = "private_pack_output_20";
const task = `---\nid: task-1\ntype: task\ntitle: ${marker}\nstatus: todo\npriority: 2\ntags: []\nlinks: []\nartifacts: []\nrelates: []\nblocked_by: []\nblocks: []\nrefs: []\naliases: []\ncreated: 2026-01-06\nupdated: 2026-01-06\n---\n\n# Overview\n${"synthetic detail ".repeat(1200)}\n`;

function fixture(t: { after(fn: () => void): void; mock: { method: Function } }) {
  const owner = makeTempDir("mdkg-pack-output-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  writeRootConfig(root); writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/work/task-1.md"), task);
  const out = path.join(root, ".mdkg/pack/fixed.md");
  t.mock.method(outputPaths, "buildDefaultPackPath", () => out);
  return { owner, root, outside, out };
}
function linkOrSkip(t: { skip(message?: string): void }, target: string, link: string, type: "dir" | "file" = "dir") {
  try { fs.symlinkSync(target, link, type); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error; t.skip("symbolic links unavailable"); return false; }
}
function pack(root: string, options: Record<string, unknown> = {}) {
  runPackCommand({ root, id: "task-1", skills: "none", noCache: true, ...options });
}

for (const kind of ["outward", "inward", "dangling"]) {
  test(`default pack rejects ${kind} directory link without writing outside`, (t) => {
    const f = fixture(t);
    const target = kind === "outward" ? f.outside : kind === "inward" ? path.join(f.root, "other") : path.join(f.outside, "missing");
    if (kind === "inward") fs.mkdirSync(target);
    if (!linkOrSkip(t, target, path.dirname(f.out))) return;
    assert.throws(() => pack(f.root, { stats: true, maxChars: 2000 }), /symbolic link|linked ancestor/);
    assert.deepEqual(fs.readdirSync(f.outside), []);
    if (kind === "inward") assert.deepEqual(fs.readdirSync(target), []);
  });
}
for (const suffix of ["", ".stats.json", ".truncation.json"]) {
  test(`default pack preflights ${suffix || "primary"} leaf before any output`, (t) => {
    const f = fixture(t);
    fs.mkdirSync(path.dirname(f.out));
    const sentinel = path.join(f.outside, "sentinel");
    writeFile(sentinel, "unchanged");
    if (!linkOrSkip(t, sentinel, f.out + suffix, "file")) return;
    assert.throws(() => pack(f.root, { stats: true, maxChars: 2000 }), /symbolic link/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "unchanged");
    assert.deepEqual(fs.readdirSync(path.dirname(f.out)), [path.basename(f.out + suffix)]);
  });
}
for (const flag of ["statsOut", "truncationReport"]) {
  test(`${flag} explicit authority does not escape into default primary`, (t) => {
    const f = fixture(t);
    if (!linkOrSkip(t, f.outside, path.dirname(f.out))) return;
    assert.throws(() => pack(f.root, { [flag]: path.join(f.outside, "report.json") }), /symbolic link|linked ancestor/);
    assert.deepEqual(fs.readdirSync(f.outside), []);
  });
}

test("healthy default pack emits all derived reports", (t) => {
  const f = fixture(t);
  pack(f.root, { stats: true, maxChars: 2000 });
  assert.match(fs.readFileSync(f.out, "utf8"), new RegExp(marker));
  assert.equal(JSON.parse(fs.readFileSync(f.out + ".stats.json", "utf8")).root, "root:task-1");
  assert.ok(JSON.parse(fs.readFileSync(f.out + ".truncation.json", "utf8")).body_truncated_nodes.length > 0);
});
for (const mode of ["absolute", "parent-relative"]) {
  test(`explicit ${mode} export preserves destination and inherited sidecars`, (t) => {
    const f = fixture(t);
    const out = path.join(f.outside, "export.md");
    pack(f.root, { out: mode === "absolute" ? out : path.relative(f.root, out), stats: true, maxChars: 2000 });
    assert.match(fs.readFileSync(out, "utf8"), new RegExp(marker));
    assert.ok(fs.existsSync(out + ".stats.json"));
    assert.ok(fs.existsSync(out + ".truncation.json"));
    assert.equal(fs.existsSync(f.out), false);
  });
}
test("explicit leaf links are rejected rather than dereferenced or replaced", (t) => {
  const f = fixture(t);
  const sentinel = path.join(f.outside, "sentinel"), out = path.join(f.outside, "export.md");
  writeFile(sentinel, "unchanged");
  if (!linkOrSkip(t, sentinel, out, "file")) return;
  assert.throws(() => pack(f.root, { out }), /regular file|symbolic link/);
  assert.equal(fs.readFileSync(sentinel, "utf8"), "unchanged");
  assert.ok(fs.lstatSync(out).isSymbolicLink());
});
test("explicit regular hardlink destination is atomically replaced without changing its peer", (t) => {
  const f = fixture(t);
  const sentinel = path.join(f.outside, "sentinel"), out = path.join(f.outside, "export.md");
  writeFile(sentinel, "unchanged"); fs.linkSync(sentinel, out);
  pack(f.root, { out });
  assert.equal(fs.readFileSync(sentinel, "utf8"), "unchanged");
  assert.match(fs.readFileSync(out, "utf8"), new RegExp(marker));
});
test("dry-run ignores linked and explicit outputs", (t) => {
  const f = fixture(t);
  if (!linkOrSkip(t, f.outside, path.dirname(f.out))) return;
  pack(f.root, { dryRun: true, out: path.join(f.outside, "a"), statsOut: path.join(f.outside, "b"), truncationReport: path.join(f.outside, "c") });
  assert.deepEqual(fs.readdirSync(f.outside), []);
});
test("explicit FIFO destination fails promptly and is preserved", (t) => {
  if (process.platform === "win32") { t.skip("POSIX FIFO fixture"); return; }
  const f = fixture(t), out = path.join(f.outside, "pipe");
  const mkfifo = spawnSync("mkfifo", [out], { encoding: "utf8" });
  assert.equal(mkfifo.status, 0, mkfifo.stderr);
  const result = spawnSync(process.execPath, [path.resolve(__dirname, "../../cli.js"), "pack", "task-1", "--out", out], { cwd: f.root, encoding: "utf8", timeout: 3000 });
  assert.equal(result.error, undefined, "special output must not block waiting for a reader");
  assert.notEqual(result.status, 0);
  assert.ok(fs.lstatSync(out).isFIFO());
});

test("explicit reports may leave the checkout without changing primary authority", (t) => {
  const f = fixture(t), stats = path.join(f.outside, "stats.json"), report = path.join(f.outside, "truncation.json");
  pack(f.root, { statsOut: stats, truncationReport: report });
  assert.ok(fs.existsSync(f.out));
  assert.equal(JSON.parse(fs.readFileSync(stats, "utf8")).root, "root:task-1");
  assert.ok(Array.isArray(JSON.parse(fs.readFileSync(report, "utf8")).dropped_nodes));
});
test("operator-selected ancestor links and native export names remain supported", (t) => {
  const f = fixture(t), alias = path.join(f.root, "export-alias");
  if (!linkOrSkip(t, f.outside, alias)) return;
  const name = process.platform === "win32" ? "..export-é.md" : "..export\\literal-é.md";
  pack(f.root, { out: path.join(alias, name), stats: true });
  assert.match(fs.readFileSync(path.join(f.outside, name), "utf8"), new RegExp(marker));
  assert.ok(fs.existsSync(path.join(f.outside, name + ".stats.json")));
});
test("rejected outputs leave the Git staging index byte-for-byte unchanged", (t) => {
  const f = fixture(t);
  for (const args of [["init", "-q"], ["add", "--", ".mdkg/work/task-1.md"]]) {
    const git = spawnSync("git", args, { cwd: f.root, encoding: "utf8" });
    assert.equal(git.status, 0, git.stderr);
  }
  const before = fs.readFileSync(path.join(f.root, ".git/index"));
  if (!linkOrSkip(t, f.outside, path.dirname(f.out))) return;
  assert.throws(() => pack(f.root), /symbolic link|linked ancestor/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, ".git/index")), before);
});

for (const explicit of [false, true]) {
  test(`${explicit ? "explicit" : "default"} replacement preserves private output permissions`, (t) => {
    if (process.platform === "win32") { t.skip("POSIX permission mode fixture"); return; }
    const f = fixture(t), out = explicit ? path.join(f.outside, "private.md") : f.out;
    const previousMask = process.umask(0o022);
    try {
      for (const suffix of ["", ".stats.json", ".truncation.json"]) {
        writeFile(out + suffix, "old"); fs.chmodSync(out + suffix, 0o600);
      }
      pack(f.root, { ...(explicit ? { out } : {}), stats: true, maxChars: 2000 });
      for (const suffix of ["", ".stats.json", ".truncation.json"]) {
        assert.equal(fs.statSync(out + suffix).mode & 0o777, 0o600, suffix || "primary");
      }
    } finally { process.umask(previousMask); }
  });
}
