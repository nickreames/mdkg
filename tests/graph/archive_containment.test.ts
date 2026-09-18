import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { createDeterministicZip } = require("../../util/zip");
const { hashArchiveBuffer, checkArchiveIntegrity } = require("../../graph/archive_integrity");
const { formatFrontmatter } = require("../../graph/frontmatter");
const cli = path.resolve(__dirname, "../../cli.js");
const payload = Buffer.from("SYNTHETIC_ARCHIVE_PAYLOAD\n");
const zip = createDeterministicZip("payload.txt", payload);
function command(root: string, args: string[]) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
}
function fixture(t: { after(fn: () => void): void }) {
  const owner = makeTempDir("mdkg-archive-boundary-");
  t.after(() => fs.rmSync(owner, { recursive: true, force: true }));
  const root = path.join(owner, "repo"), outside = path.join(owner, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside); writeRootConfig(root);
  const dir = path.join(root, ".mdkg/archive/archive.synthetic");
  fs.mkdirSync(path.join(dir, "source"), { recursive: true });
  const raw = path.join(dir, "source/payload.txt"), compressed = path.join(dir, "payload.zip"), sidecar = path.join(dir, "payload.md");
  fs.writeFileSync(raw, payload); fs.writeFileSync(compressed, zip);
  const sentinel = Buffer.from("SYNTHETIC_EXTERNAL_SENTINEL\n");
  fs.writeFileSync(path.join(outside, "sentinel"), sentinel);
  fs.writeFileSync(path.join(outside, "payload.zip"), zip);
  const metadata: Record<string, any> = { id: "archive.synthetic", type: "archive", title: "Synthetic archive", created: "2026-09-08", updated: "2026-09-08", archive_kind: "source", source_path: "inputs/payload.txt", stored_path: "source/payload.txt", compressed_path: "payload.zip", mime_type: "text/plain", byte_size: String(payload.length), sha256: hashArchiveBuffer(payload), compressed_sha256: hashArchiveBuffer(zip), visibility: "private", provenance: "synthetic fixture", ingest_status: "verified" };
  const save = () => writeFile(sidecar, ["---", ...formatFrontmatter(metadata), "---", "Synthetic sidecar", ""].join("\n"));
  save();
  return { root, outside, dir, raw, compressed, sidecar, metadata, save, sentinel,
    options: { root, rawPath: raw, zipPath: compressed, expectedRawHash: metadata.sha256, expectedCompressedHash: metadata.compressed_sha256, expectedByteSize: metadata.byte_size } };
}
function rejected(f: ReturnType<typeof fixture>, args: string[]) {
  const result = command(f.root, args);
  assert.equal(result.error, undefined, `${args.join(" ")}: ${result.error}`);
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout + result.stderr, new RegExp(hashArchiveBuffer(f.sentinel)));
  assert.deepEqual(fs.readFileSync(path.join(f.outside, "sentinel")), f.sentinel);
  return result;
}
for (const kind of ["absolute", "traversal", "normalized-traversal", "windows", "nul"]) {
  test(`direct archive verification rejects ${kind} authored payload paths before hashing`, (t) => {
    const f = fixture(t);
    f.metadata.stored_path = kind === "absolute" ? path.join(f.outside, "sentinel") : kind === "traversal" ? "../../../../outside/sentinel" : kind === "normalized-traversal" ? "source/../source/payload.txt" : kind === "windows" ? "C:\\outside\\sentinel" : "source/pay\0load.txt";
    f.save(); rejected(f, ["archive", "verify", "archive.synthetic", "--json"]);
  });
}
for (const target of ["raw", "compressed"] as const) {
  for (const kind of ["leaf", "ancestor", "dangling", "directory"]) {
    test(`archive ${target} ${kind} replacements fail in verification and normal parsing`, (t) => {
      const f = fixture(t), file = target === "raw" ? f.raw : f.compressed;
      if (kind === "ancestor") {
        const nested = path.join(f.dir, "nested"); fs.mkdirSync(nested);
        const field = target === "raw" ? "stored_path" : "compressed_path";
        f.metadata[field] = `nested/${target === "raw" ? "sentinel" : "payload.zip"}`; f.save();
        fs.rmdirSync(nested); fs.symlinkSync(f.outside, nested, "dir");
      } else {
        fs.unlinkSync(file);
        if (kind === "directory") fs.mkdirSync(file);
        else fs.symlinkSync(path.join(f.outside, kind === "dangling" ? "missing" : target === "raw" ? "sentinel" : "payload.zip"), file);
      }
      rejected(f, ["archive", "verify", "--json"]); rejected(f, ["validate", "--json"]);
    });
  }
}
test("archive root ancestry cannot redirect direct sidecar discovery", (t) => {
  const f = fixture(t), archive = path.join(f.root, ".mdkg/archive"), moved = path.join(f.outside, "archive");
  fs.renameSync(archive, moved); fs.symlinkSync(moved, archive, "dir");
  rejected(f, ["archive", "verify", "--json"]);
});
for (const target of ["raw", "compressed"] as const) {
  test(`archive ${target} oversized files are rejected before reading or hashing bytes`, (t) => {
    const f = fixture(t), file = target === "raw" ? f.raw : f.compressed;
    const handle = fs.openSync(file, "r+");
    try { fs.ftruncateSync(handle, (target === "raw" ? 64 : 128) * 1024 * 1024 + 1); } finally { fs.closeSync(handle); }
    const original = fs.readFileSync; let unsafeRead = false;
    t.mock.method(fs, "readFileSync", (...args: any[]) => { if (args[0] === file) { unsafeRead = true; throw new Error("unexpected whole-file read"); } return (original as any)(...args); });
    const read = fs.readSync;
    t.mock.method(fs, "readSync", (...args: any[]) => { if (fs.fstatSync(args[0]).size > (target === "raw" ? 64 : 128) * 1024 * 1024) { unsafeRead = true; throw new Error("unexpected descriptor byte read"); } return (read as any)(...args); });
    const result = checkArchiveIntegrity(f.options);
    assert.equal(result.ok, false); assert.equal(unsafeRead, false); assert.match(result.errors.join("\n"), /byte limit/);
  });
}
test("archive verification preserves contained files, missing raw caches and native relative spelling", (t) => {
  const f = fixture(t);
  f.metadata.stored_path = "./source//payload.txt"; f.metadata.compressed_path = "./payload.zip"; f.save();
  for (const args of [["archive", "verify", "archive.synthetic", "--json"], ["validate", "--json"]]) {
    const result = command(f.root, args); assert.equal(result.status, 0, result.stdout + result.stderr);
  }
  fs.unlinkSync(f.raw);
  const result = command(f.root, ["archive", "verify", "archive.synthetic", "--json"]);
  assert.equal(result.status, 0, result.stdout + result.stderr); assert.equal(JSON.parse(result.stdout).results[0].raw_present, false);
});
test("legacy archive ID filtering does not verify unrelated malformed sidecars", (t) => {
  const f = fixture(t), other = path.join(f.root, ".mdkg/archive/archive.other/other.md");
  const metadata = { ...f.metadata, id: "archive.other", stored_path: path.join(f.outside, "sentinel"), compressed_path: path.join(f.outside, "payload.zip") };
  writeFile(other, ["---", ...formatFrontmatter(metadata), "---", ""].join("\n"));
  const result = command(f.root, ["archive", "verify", "archive.synthetic", "--json"]);
  assert.equal(result.status, 0, result.stdout + result.stderr); assert.equal(JSON.parse(result.stdout).results.length, 1);
  const { runArchiveVerifyCommand } = require("../../commands/archive");
  const original = fs.readFileSync; let outsideRead = false;
  t.mock.method(console, "log", () => {});
  t.mock.method(fs, "readFileSync", (...args: any[]) => { if (typeof args[0] === "string" && args[0].startsWith(f.outside)) { outsideRead = true; throw new Error("unrelated payload read"); } return (original as any)(...args); });
  assert.doesNotThrow(() => runArchiveVerifyCommand({ root: f.root, id: "archive.synthetic", json: true }));
  assert.equal(outsideRead, false);
});
test("format-v2 archive identity targeting uses the same contained verification boundary", (t) => {
  const f = fixture(t), { createGraphFormat, identityRef } = require("../../graph/identity");
  const graph_id = "e7403372-f270-4cd7-902d-64b792c781df", node_id = "9e194311-fdca-4e03-a494-15638a62b104";
  writeFile(path.join(f.root, ".mdkg/graph.json"), JSON.stringify(createGraphFormat(graph_id)));
  Object.assign(f.metadata, { graph_id, node_id }); f.save();
  const id = identityRef({ graph_id, node_id });
  const good = command(f.root, ["archive", "verify", id, "--json"]);
  assert.equal(good.status, 0, good.stdout + good.stderr);
  fs.unlinkSync(f.raw); fs.symlinkSync(path.join(f.outside, "sentinel"), f.raw);
  rejected(f, ["archive", "verify", id, "--json"]);
});
test("live archive parsing requires explicit root while historical parsing remains non-reading", (t) => {
  const f = fixture(t), { parseNode } = require("../../graph/node"), { loadConfig } = require("../../core/config"), { loadTemplateSchemas } = require("../../graph/template_schema");
  const config = loadConfig(f.root), options = { workStatusEnum: config.work.status_enum, priorityMin: 0, priorityMax: 9, templateSchemas: loadTemplateSchemas(f.root, config, ["archive"]) };
  const text = fs.readFileSync(f.sidecar, "utf8");
  assert.throws(() => parseNode(text, f.sidecar, options), /explicit repository root/);
  assert.doesNotThrow(() => parseNode(text, path.relative(f.root, f.sidecar), { ...options, archiveRoot: f.root }));
  fs.unlinkSync(f.raw); fs.symlinkSync(path.join(f.outside, "sentinel"), f.raw);
  assert.doesNotThrow(() => parseNode(text, f.sidecar, { ...options, deferArchiveIntegrity: true }));
  assert.throws(() => parseNode(text, f.sidecar, { ...options, archiveRoot: f.root }), /symbolic link/);
});
test("archive verification rejects FIFO payloads without blocking", (t) => {
  if (process.platform === "win32") { t.skip("POSIX FIFO fixture"); return; }
  const f = fixture(t); fs.unlinkSync(f.raw);
  const fifo = spawnSync("mkfifo", [f.raw], { encoding: "utf8" }); assert.equal(fifo.status, 0, fifo.stderr);
  const result = rejected(f, ["archive", "verify", "--json"]);
  assert.match(result.stdout + result.stderr, /must be a file/);
});
for (const bound of ["max_file_bytes", "max_files", "max_depth", "entries"] as const) {
  test(`direct archive discovery enforces ${bound} before unrestricted reads`, (t) => {
    const f = fixture(t), configFile = path.join(f.root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configFile, "utf8"));
    config.index.limits = { max_files: 100, max_file_bytes: 8192, max_total_bytes: 65536, max_depth: 64 };
    if (bound === "max_file_bytes") config.index.limits.max_file_bytes = 16;
    if (bound === "max_files") { config.index.limits.max_files = 1; writeFile(path.join(f.dir, "other.md"), "---\nid: archive.other\n---\n"); }
    if (bound === "max_depth") { config.index.limits.max_depth = 1; fs.mkdirSync(path.join(f.dir, "nested")); }
    if (bound === "entries") { config.index.limits.max_files = 1; for (let i = 0; i < 11; i++) writeFile(path.join(f.dir, `ignored-${i}`), ""); }
    writeFile(configFile, JSON.stringify(config));
    const result = rejected(f, ["archive", "verify", "--json"]);
    assert.match(result.stdout + result.stderr, /limit|budget/);
  });
}
