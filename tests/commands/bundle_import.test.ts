import { test } from "node:test";
import assert from "node:assert/strict";
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

function run(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}

function json<T>(output: string): T {
  return JSON.parse(output) as T;
}

function updateConfig(root: string, mutate: (config: any) => void): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  mutate(config);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function createChildBundle(root: string): string {
  const child = path.join(root, "child-repo");
  fs.mkdirSync(child, { recursive: true });
  run(["init", "--agent"], child);
  run(["new", "spec", "Child Agent", "--id", "agent.child-agent", "--json"], child);
  run(["new", "work", "Child Work", "--id", "work.child-work", "--json"], child);
  run(["new", "task", "Child Task", "--status", "todo", "--priority", "1", "--json"], child);
  run(["bundle", "create", "--profile", "private", "--json"], child);
  return "child-repo/.mdkg/bundles/private/all.mdkg.zip";
}

function removeBundleEntry(bundlePath: string, entryName: string): void {
  const entries = readZipEntries(fs.readFileSync(bundlePath));
  const manifestEntry = entries.find((entry) => entry.name === "manifest.json");
  assert.ok(manifestEntry, "bundle missing manifest");
  const manifest = JSON.parse(manifestEntry.data.toString("utf8"));
  manifest.files = (manifest.files ?? []).filter((file: { path: string }) => file.path !== entryName);
  const nextEntries = entries
    .filter((entry) => entry.name !== entryName)
    .map((entry) =>
      entry.name === "manifest.json"
        ? { name: entry.name, data: Buffer.from(JSON.stringify(manifest, null, 2), "utf8") }
        : entry
    );
  fs.writeFileSync(bundlePath, createDeterministicZipFromEntries(nextEntries));
}

test("bundle import projects child bundle nodes into read-only root graph", () => {
  const root = makeTempDir("mdkg-bundle-import-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);

  const added = json<{ import: { alias: string; stale: boolean; error_count: number } }>(
    run([
      "bundle",
      "import",
      "add",
      "child_import",
      bundlePath,
      "--source-path",
      "child-repo",
      "--json",
    ], root).stdout
  );
  assert.equal(added.import.alias, "child_import");
  assert.equal(added.import.error_count, 0);

  const listed = json<{ count: number; imports: Array<{ alias: string }> }>(
    run(["bundle", "import", "list", "--json"], root).stdout
  );
  assert.equal(listed.count, 1);
  assert.equal(listed.imports[0].alias, "child_import");

  run(["index"], root);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "imports.json")), true);

  const search = json<{ items: Array<{ qid: string; source?: { imported: boolean } }> }>(
    run(["search", "Child Task", "--json"], root).stdout
  );
  assert.equal(search.items.some((item) => item.qid === "child_import:task-1" && item.source?.imported), true);

  const shown = json<{ item: { qid: string; body: string; source?: { original_qid: string } } }>(
    run(["show", "child_import:task-1", "--json"], root).stdout
  );
  assert.equal(shown.item.qid, "child_import:task-1");
  assert.match(shown.item.body, /Overview/);
  assert.equal(shown.item.source?.original_qid, "root:task-1");

  const pack = run(["pack", "child_import:task-1", "--dry-run", "--stats"], root);
  assert.match(pack.stdout, /child_import:task-1/);

  const capability = json<{ items: Array<{ qid: string; source?: { imported: boolean } }> }>(
    run(["capability", "search", "Child Work", "--json"], root).stdout
  );
  assert.equal(capability.items.some((item) => item.qid === "child_import:work.child-work" && item.source?.imported), true);

  const mutation = runFailure(["task", "update", "child_import:task-1", "--status", "review"], root);
  assert.equal(mutation.status, 1);
  assert.match(mutation.stderr, /cannot mutate read-only imported node child_import:task-1/);

  run(["bundle", "import", "disable", "child_import", "--json"], root);
  const disabledSearch = json<{ count: number }>(run(["search", "Child Task", "--json"], root).stdout);
  assert.equal(disabledSearch.count, 0);
});

test("bundle import verify fails stale imports while read commands warn and continue", () => {
  const root = makeTempDir("mdkg-bundle-import-stale-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  run([
    "bundle",
    "import",
    "add",
    "child_import",
    bundlePath,
    "--source-path",
    "child-repo",
    "--max-stale-seconds",
    "1",
    "--json",
  ], root);

  const absoluteBundle = path.join(root, bundlePath);
  const old = new Date(Date.now() - 10_000);
  fs.utimesSync(absoluteBundle, old, old);

  const search = run(["search", "Child Task", "--json"], root);
  assert.equal(search.status, 0);
  assert.match(search.stderr, /bundle import child_import: bundle age/);

  const verify = runFailure(["bundle", "import", "verify", "child_import", "--json"], root);
  assert.equal(verify.status, 2);
  const receipt = json<{ ok: boolean; imports: Array<{ stale: boolean }> }>(verify.stdout);
  assert.equal(receipt.ok, false);
  assert.equal(receipt.imports[0].stale, true);
});

test("public bundles fail when public local nodes reference private imports", () => {
  const root = makeTempDir("mdkg-bundle-import-public-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  run(["bundle", "import", "add", "child_import", bundlePath, "--json"], root);
  updateConfig(root, (config) => {
    config.workspaces.root.visibility = "public";
  });
  run([
    "new",
    "task",
    "Public Import Ref",
    "--status",
    "todo",
    "--priority",
    "1",
    "--relates",
    "child_import:task-1",
    "--json",
  ], root);

  const failure = runFailure(["bundle", "create", "--profile", "public", "--json"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /references private bundle import child_import:task-1/);
});

test("bundle import rejects bundles missing generated skills index", () => {
  const root = makeTempDir("mdkg-bundle-import-missing-skills-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  removeBundleEntry(path.join(root, bundlePath), ".mdkg/index/skills.json");

  const failure = runFailure(["bundle", "import", "add", "child_import", bundlePath, "--json"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /missing bundle entry: \.mdkg\/index\/skills\.json/);
});
