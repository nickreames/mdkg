import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { buildBundle } = require("../../commands/bundle");
const { createDeterministicZip, readZipEntries } = require("../../util/zip");
const hash = (data: Buffer) => "sha256:" + crypto.createHash("sha256").update(data).digest("hex");
function fixture(t: any) {
  const root = makeTempDir("mdkg-bundle-archive-visibility-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root); writeDefaultTemplates(root);
  const configPath = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.workspaces.root.visibility = "public";
  writeFile(configPath, JSON.stringify(config));
  return root;
}
function archive(root: string, dir: string, id: string, visibility: string, payload: string, cache = `cache/${id}.zip`) {
  const bytes = Buffer.from(payload), zip = createDeterministicZip("payload.txt", bytes);
  const sidecar = path.join(dir, `${id}.md`), stored = `source/${id}/payload.txt`;
  writeFile(path.join(root, dir, stored), payload);
  writeFile(path.join(root, dir, cache), zip);
  writeFile(path.join(root, sidecar), ["---", `id: archive.${id}`, "type: archive", `title: ${id}`,
    "archive_kind: source", "source_path: external:synthetic", `stored_path: ${stored}`, `compressed_path: ${cache}`,
    "mime_type: text/plain", `byte_size: ${bytes.length}`, `sha256: ${hash(bytes)}`, `compressed_sha256: ${hash(zip)}`,
    `visibility: ${visibility}`, "provenance: synthetic fixture", "ingest_status: verified", "created: 2026-09-29", "updated: 2026-09-29", "---", ""].join("\n"));
  return { sidecar, cache: path.join(dir, cache), bytes };
}
function bundle(root: string, profile: string) {
  const result = buildBundle({ root, profile });
  return { ...result, entries: new Map<string, Buffer>(readZipEntries(result.zip).map((e: any) => [e.name, e.data])) };
}
for (const reverse of [false, true]) for (const nested of [false, true]) {
  test(`public archive payload visibility is exact, reversed=${reverse}, nested=${nested}`, t => {
    const root = fixture(t), dir = ".mdkg/archive/shared";
    const privateArchive = archive(root, nested ? `${dir}/nested` : dir, reverse ? "z-private" : "a-private", "private", "PRIVATE_ARCHIVE_SENTINEL");
    const publicArchive = archive(root, dir, reverse ? "a-public" : "z-public", "public", "PUBLIC_ARCHIVE_CONTROL");
    writeFile(path.join(root, dir, "unknown.bin"), "UNOWNED_PRIVATE_SENTINEL");
    const result = bundle(root, "public");
    assert.ok(result.entries.has(publicArchive.sidecar)); assert.ok(result.entries.has(publicArchive.cache));
    assert.ok(!result.entries.has(privateArchive.sidecar)); assert.ok(!result.entries.has(privateArchive.cache));
    assert.ok(!result.entries.has(`${dir}/unknown.bin`));
    for (const [name, data] of result.entries) {
      assert.ok(!data.includes(privateArchive.bytes), name);
      assert.ok(!data.includes(Buffer.from("UNOWNED_PRIVATE_SENTINEL")), name);
    }
    assert.ok(!result.manifest.files.some((f: any) => f.path === privateArchive.cache));
    const privateBundle = bundle(root, "private");
    assert.ok(privateBundle.entries.has(privateArchive.cache));
    assert.ok(privateBundle.entries.has(`${dir}/unknown.bin`));
  });
}
for (const profile of ["public", "private"]) test(`ambiguous shared archive cache refuses ${profile} export`, t => {
  const root = fixture(t), dir = ".mdkg/archive/shared";
  archive(root, dir, "one", "private", "SAME_PAYLOAD", "shared.zip");
  archive(root, dir, "two", "public", "SAME_PAYLOAD", "shared.zip");
  assert.throws(() => bundle(root, profile), /archive.*(overlap|ownership|claim)/);
});

test("public archive resources preserve native case aliases without borrowing distinct files", t => {
  const root = fixture(t), dir = ".mdkg/archive/shared";
  const owned = archive(root, dir, "public", "public", "PUBLIC_CONTROL", "cache/REPORT.zip");
  const lower = path.join(dir, "cache/report.zip");
  fs.renameSync(path.join(root, owned.cache), path.join(root, lower));
  if (!fs.existsSync(path.join(root, owned.cache))) {
    // Case-sensitive hosts have two distinct resources, not one native alias.
    fs.renameSync(path.join(root, lower), path.join(root, owned.cache));
    writeFile(path.join(root, lower), "UNKNOWN_PRIVATE_CONTROL");
    assert.ok(!bundle(root, "public").entries.has(lower));
  } else {
    assert.ok(bundle(root, "public").entries.has(lower));
  }
});
