import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const {
  createDeterministicZipFromEntries,
  readZipEntries,
} = require("../../util/zip") as {
  createDeterministicZipFromEntries: (entries: Array<{ name: string; data: Buffer }>) => Buffer;
  readZipEntries: (zip: Buffer) => Array<{ name: string; data: Buffer }>;
};

function run(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function sha256(buffer: Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function readBundleEntries(bundlePath: string): Map<string, Buffer> {
  return new Map(readZipEntries(fs.readFileSync(bundlePath)).map((entry) => [entry.name, entry.data]));
}

function updateConfig(root: string, mutate: (config: any) => void): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  mutate(config);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

test("multi-file deterministic zip is byte-stable and sorted", () => {
  const entries = [
    { name: "b.txt", data: Buffer.from("b") },
    { name: "a.txt", data: Buffer.from("a") },
  ];
  const first = createDeterministicZipFromEntries(entries);
  const second = createDeterministicZipFromEntries([...entries].reverse());
  assert.equal(first.equals(second), true);
  assert.deepEqual(readZipEntries(first).map((entry) => entry.name), ["a.txt", "b.txt"]);
});

test("bundle create writes deterministic private bundles with generated indexes and exclusions", () => {
  const root = makeTempDir("mdkg-bundle-private-");
  run(["init", "--agent"], root);

  const inputDir = path.join(root, "inputs");
  fs.mkdirSync(inputDir, { recursive: true });
  fs.writeFileSync(path.join(inputDir, "source.txt"), "bundle source\n", "utf8");
  run([
    "archive",
    "add",
    "inputs/source.txt",
    "--id",
    "archive.bundle-source",
    "--kind",
    "source",
    "--json",
  ], root);
  run(["index"], root);
  fs.mkdirSync(path.join(root, ".mdkg", "pack"), { recursive: true });
  fs.writeFileSync(path.join(root, ".mdkg", "pack", "ignored.md"), "ignored\n", "utf8");

  const first = JSON.parse(run(["bundle", "create", "--json"], root).stdout);
  const second = JSON.parse(run(["bundle", "create", "--json"], root).stdout);
  assert.equal(first.zip_sha256, second.zip_sha256);
  assert.equal(first.profile, "private");
  assert.equal(first.path, ".mdkg/bundles/private/all.mdkg.zip");

  const bundlePath = path.join(root, first.path);
  const entries = readBundleEntries(bundlePath);
  assert.equal(entries.has("manifest.json"), true);
  assert.equal(entries.has(".mdkg/index/global.json"), true);
  assert.equal(entries.has(".mdkg/index/skills.json"), true);
  assert.equal(entries.has(".mdkg/index/capabilities.json"), true);
  assert.equal(entries.has(".mdkg/pack/ignored.md"), false);
  assert.equal(entries.has(".mdkg/bundles/private/all.mdkg.zip"), false);
  assert.equal(entries.has(".mdkg/archive/archive.bundle-source/source/source.txt"), false);
  assert.equal(entries.has(".mdkg/archive/archive.bundle-source/source.txt.md"), true);
  assert.equal(entries.has(".mdkg/archive/archive.bundle-source/source.txt.zip"), true);

  const manifest = JSON.parse(entries.get("manifest.json")!.toString("utf8"));
  assert.equal(manifest.file_count, manifest.files.length);
  assert.equal(manifest.index_hashes[".mdkg/index/global.json"], sha256(entries.get(".mdkg/index/global.json")!));

  const verify = JSON.parse(run(["bundle", "verify", first.path, "--json"], root).stdout);
  assert.equal(verify.ok, true);
  const shown = JSON.parse(run(["bundle", "show", first.path, "--json"], root).stdout);
  assert.equal(shown.bundle.bundle_hash, first.bundle_hash);
  const listed = JSON.parse(run(["bundle", "list", "--json"], root).stdout);
  assert.equal(listed.count, 1);
  assert.equal(listed.items[0].path, first.path);
});

test("public bundle includes public workspace content and fails closed on private archive refs", () => {
  const root = makeTempDir("mdkg-bundle-public-");
  run(["init", "--agent"], root);

  const noPublicWorkspace = runFailure(["bundle", "create", "--profile", "public"], root);
  assert.equal(noPublicWorkspace.status, 1);
  assert.match(noPublicWorkspace.stderr, /mark a selected workspace visibility public/);

  updateConfig(root, (config) => {
    config.workspaces.root.visibility = "public";
  });

  const inputDir = path.join(root, "inputs");
  fs.mkdirSync(inputDir, { recursive: true });
  fs.writeFileSync(path.join(inputDir, "private.txt"), "private archive\n", "utf8");
  run([
    "archive",
    "add",
    "inputs/private.txt",
    "--id",
    "archive.private-input",
    "--kind",
    "source",
    "--json",
  ], root);
  run(["new", "task", "Public Task", "--status", "todo", "--priority", "1", "--artifacts", "archive://archive.private-input"], root);

  const failure = runFailure(["bundle", "create", "--profile", "public", "--json"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /public bundle contains private references/);

  const sidecar = path.join(root, ".mdkg", "archive", "archive.private-input", "private.txt.md");
  let sidecarContent = fs.readFileSync(sidecar, "utf8");
  sidecarContent = sidecarContent.replace("visibility: private", "visibility: public");
  fs.writeFileSync(sidecar, sidecarContent, "utf8");

  const created = JSON.parse(run(["bundle", "create", "--profile", "public", "--json"], root).stdout);
  const entries = readBundleEntries(path.join(root, created.path));
  assert.equal(entries.has(".mdkg/config.json"), false);
  assert.equal(entries.has(".mdkg/archive/archive.private-input/private.txt.md"), true);
  assert.equal(entries.has(".mdkg/archive/archive.private-input/private.txt.zip"), true);
  const manifest = JSON.parse(entries.get("manifest.json")!.toString("utf8"));
  assert.equal(manifest.profile, "public");
  assert.equal(
    manifest.files.some((file: { visibility?: string }) => file.visibility === "private"),
    false
  );
});

test("bundle verify reports stale source changes and malformed bundles", () => {
  const root = makeTempDir("mdkg-bundle-verify-");
  run(["init", "--agent"], root);
  const created = JSON.parse(run(["bundle", "create", "--json"], root).stdout);
  fs.appendFileSync(path.join(root, ".mdkg", "README.md"), "\nlocal edit\n", "utf8");

  const stale = runFailure(["bundle", "verify", created.path, "--json"], root);
  assert.equal(stale.status, 2);
  const staleReceipt = JSON.parse(stale.stdout);
  assert.equal(staleReceipt.ok, false);
  assert.equal(staleReceipt.stale, true);
  assert.ok(staleReceipt.stale_paths.includes(".mdkg/README.md"));

  const badBundle = path.join(root, ".mdkg", "bundles", "private", "bad.mdkg.zip");
  fs.writeFileSync(badBundle, "not a zip", "utf8");
  const malformed = runFailure(["bundle", "verify", ".mdkg/bundles/private/bad.mdkg.zip", "--json"], root);
  assert.equal(malformed.status, 2);
  assert.match(malformed.stdout, /zip local header missing/);
});
