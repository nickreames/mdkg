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
  run([
    "work",
    "contract",
    "new",
    "Child Work",
    "--id",
    "work.child-work",
    "--agent-id",
    "agent.child-agent",
    "--kind",
    "child_capability",
    "--inputs",
    "prompt:text:required",
    "--outputs",
    "result:text:required",
    "--json",
  ], child);
  run([
    "work",
    "order",
    "new",
    "Child Order",
    "--id",
    "order.child-order-1",
    "--work-id",
    "work.child-work",
    "--requester",
    "user://child",
    "--json",
  ], child);
  run([
    "work",
    "receipt",
    "new",
    "Child Receipt",
    "--id",
    "receipt.child-order-1",
    "--work-order-id",
    "order.child-order-1",
    "--outcome",
    "success",
    "--json",
  ], child);
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

test("subgraph projects child bundle nodes into read-only root graph", () => {
  const root = makeTempDir("mdkg-subgraph-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);

  const added = json<{ subgraph: { alias: string; stale: boolean; error_count: number } }>(
    run([
      "subgraph",
      "add",
      "child_subgraph",
      bundlePath,
      "--source-path",
      "child-repo",
      "--json",
    ], root).stdout
  );
  assert.equal(added.subgraph.alias, "child_subgraph");
  assert.equal(added.subgraph.error_count, 0);

  const listed = json<{ count: number; subgraphs: Array<{ alias: string }> }>(
    run(["subgraph", "list", "--json"], root).stdout
  );
  assert.equal(listed.count, 1);
  assert.equal(listed.subgraphs[0].alias, "child_subgraph");

  const shownSubgraph = json<{ subgraph: { alias: string; sources: Array<{ path: string }> } }>(
    run(["subgraph", "show", "child_subgraph", "--json"], root).stdout
  );
  assert.equal(shownSubgraph.subgraph.sources[0].path, bundlePath);

  run(["index"], root);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "subgraphs.json")), true);

  const search = json<{ items: Array<{ qid: string; source?: { imported: boolean; subgraph_alias?: string } }> }>(
    run(["search", "Child Task", "--json"], root).stdout
  );
  assert.equal(search.items.some((item) => item.qid === "child_subgraph:task-1" && item.source?.imported), true);
  assert.equal(search.items.find((item) => item.qid === "child_subgraph:task-1")?.source?.subgraph_alias, "child_subgraph");

  const shown = json<{ item: { qid: string; body: string; source?: { original_qid: string } } }>(
    run(["show", "child_subgraph:task-1", "--json"], root).stdout
  );
  assert.equal(shown.item.qid, "child_subgraph:task-1");
  assert.match(shown.item.body, /Overview/);
  assert.equal(shown.item.source?.original_qid, "root:task-1");

  const pack = run(["pack", "child_subgraph:task-1", "--dry-run", "--stats"], root);
  assert.match(pack.stdout, /child_subgraph:task-1/);

  const capability = json<{ items: Array<{ qid: string; source?: { imported: boolean } }> }>(
    run(["capability", "search", "Child Work", "--json"], root).stdout
  );
  assert.equal(capability.items.some((item) => item.qid === "child_subgraph:work.child-work" && item.source?.imported), true);

  const resolved = json<{ items: Array<{ item: { qid: string } }> }>(
    run(["capability", "resolve", "Child Work", "--json"], root).stdout
  );
  assert.equal(resolved.items.some((item) => item.item.qid === "child_subgraph:work.child-work"), true);

  const mutation = runFailure(["task", "update", "child_subgraph:task-1", "--status", "review"], root);
  assert.equal(mutation.status, 1);
  assert.match(mutation.stderr, /cannot mutate read-only subgraph node child_subgraph:task-1/);

  run(["subgraph", "disable", "child_subgraph", "--json"], root);
  const disabledSearch = json<{ count: number }>(run(["search", "Child Task", "--json"], root).stdout);
  assert.equal(disabledSearch.count, 0);
});

test("work lifecycle mutations reject subgraph qids with read-only guidance", () => {
  const root = makeTempDir("mdkg-subgraph-work-readonly-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  run(["subgraph", "add", "child_subgraph", bundlePath, "--json"], root);

  const orderUpdate = runFailure([
    "work",
    "order",
    "update",
    "child_subgraph:order.child-order-1",
    "--status",
    "completed",
    "--json",
  ], root);
  assert.equal(orderUpdate.status, 1);
  assert.match(
    orderUpdate.stderr,
    /cannot mutate read-only subgraph node child_subgraph:order\.child-order-1; update the source workspace for subgraph child_subgraph/
  );

  const receiptUpdate = runFailure([
    "work",
    "receipt",
    "update",
    "child_subgraph:receipt.child-order-1",
    "--receipt-status",
    "verified",
    "--json",
  ], root);
  assert.equal(receiptUpdate.status, 1);
  assert.match(
    receiptUpdate.stderr,
    /cannot mutate read-only subgraph node child_subgraph:receipt\.child-order-1; update the source workspace for subgraph child_subgraph/
  );

  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "artifact.txt"), "artifact\n", "utf8");
  const artifactAdd = runFailure([
    "work",
    "artifact",
    "add",
    "child_subgraph:receipt.child-order-1",
    "inputs/artifact.txt",
    "--id",
    "archive.subgraph-artifact",
    "--kind",
    "artifact",
    "--json",
  ], root);
  assert.equal(artifactAdd.status, 1);
  assert.match(
    artifactAdd.stderr,
    /cannot mutate read-only subgraph node child_subgraph:receipt\.child-order-1; update the source workspace for subgraph child_subgraph/
  );
});

test("subgraph verify fails stale subgraphs while read commands warn and continue", () => {
  const root = makeTempDir("mdkg-subgraph-stale-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  run([
    "subgraph",
    "add",
    "child_subgraph",
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
  assert.match(search.stderr, /subgraph child_subgraph: bundle age/);

  const staleResolve = json<{ count: number }>(run(["capability", "resolve", "Child Work", "--fresh-only", "--json"], root).stdout);
  assert.equal(staleResolve.count, 0);

  const verify = runFailure(["subgraph", "verify", "child_subgraph", "--json"], root);
  assert.equal(verify.status, 2);
  const receipt = json<{ ok: boolean; subgraphs: Array<{ stale: boolean }> }>(verify.stdout);
  assert.equal(receipt.ok, false);
  assert.equal(receipt.subgraphs[0].stale, true);
});

test("public bundles fail when public local nodes reference private subgraphs", () => {
  const root = makeTempDir("mdkg-subgraph-public-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  run(["subgraph", "add", "child_subgraph", bundlePath, "--json"], root);
  updateConfig(root, (config) => {
    config.workspaces.root.visibility = "public";
  });
  run([
    "new",
    "task",
    "Public Subgraph Ref",
    "--status",
    "todo",
    "--priority",
    "1",
    "--relates",
    "child_subgraph:task-1",
    "--json",
  ], root);

  const failure = runFailure(["bundle", "create", "--profile", "public", "--json"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /references private child_subgraph:task-1/);
});

test("subgraph rejects public visibility over private bundle profiles", () => {
  const root = makeTempDir("mdkg-subgraph-profile-visibility-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);

  const failure = runFailure([
    "subgraph",
    "add",
    "child_subgraph",
    bundlePath,
    "--visibility",
    "public",
    "--profile",
    "private",
    "--json",
  ], root);
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /--profile public is required/);
});

test("subgraph rejects bundles missing generated skills index", () => {
  const root = makeTempDir("mdkg-subgraph-missing-skills-");
  run(["init", "--agent"], root);
  const bundlePath = createChildBundle(root);
  removeBundleEntry(path.join(root, bundlePath), ".mdkg/index/skills.json");

  const failure = runFailure(["subgraph", "add", "child_subgraph", bundlePath, "--json"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /missing bundle entry: \.mdkg\/index\/skills\.json/);
});

test("legacy bundle import command gives subgraph migration guidance", () => {
  const root = makeTempDir("mdkg-subgraph-legacy-command-");
  run(["init", "--agent"], root);
  const failure = runFailure(["bundle", "import", "list"], root);
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /replaced by mdkg subgraph/);
});
