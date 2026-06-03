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

function git(cwd: string, args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
}

function sha256File(filePath: string): string {
  const crypto = require("node:crypto") as typeof import("node:crypto");
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
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

function commitAll(repo: string, message: string): string {
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", message]);
  return git(repo, ["rev-parse", "HEAD"]);
}

function createGitChildBundle(root: string, alias = "child_repo"): { child: string; bundlePath: string; bundleAbs: string; head: string } {
  const child = path.join(root, "projects", alias);
  fs.mkdirSync(child, { recursive: true });
  git(child, ["init"]);
  git(child, ["config", "user.email", "mdkg@example.test"]);
  git(child, ["config", "user.name", "mdkg test"]);
  run(["init", "--agent"], child);
  run(["new", "spec", `${alias} Agent`, "--id", `agent.${alias}-agent`, "--json"], child);
  run([
    "work",
    "contract",
    "new",
    `${alias} Work`,
    "--id",
    `work.${alias}-work`,
    "--agent-id",
    `agent.${alias}-agent`,
    "--kind",
    `${alias}_capability`,
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
    `${alias} Order`,
    "--id",
    `order.${alias}-order`,
    "--work-id",
    `work.${alias}-work`,
    "--requester",
    "user://child",
    "--json",
  ], child);
  run([
    "work",
    "receipt",
    "new",
    `${alias} Receipt`,
    "--id",
    `receipt.${alias}-receipt`,
    "--work-order-id",
    `order.${alias}-order`,
    "--outcome",
    "success",
    "--json",
  ], child);
  run(["new", "task", `${alias} Task`, "--status", "todo", "--priority", "1", "--json"], child);
  const head = commitAll(child, "initial child graph");
  const bundlePath = `.mdkg/bundles/private/subgraphs/${alias}.mdkg.zip`;
  const bundleAbs = path.join(root, bundlePath);
  run(["bundle", "create", "--profile", "private", "--output", bundleAbs, "--json"], child);
  return { child, bundlePath, bundleAbs, head };
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

test("subgraph sync dry-run writes nothing and sync refreshes root-owned bundle metadata", () => {
  const root = makeTempDir("mdkg-subgraph-sync-");
  run(["init", "--agent"], root);
  const child = createGitChildBundle(root, "child_a");
  run([
    "subgraph",
    "add",
    "child_a",
    child.bundlePath,
    "--source-path",
    "projects/child_a",
    "--json",
  ], root);
  const beforeHash = sha256File(child.bundleAbs);
  const beforeConfig = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.equal(beforeConfig.subgraphs.child_a.source_repo, undefined);

  const dryRun = json<{
    action: string;
    ok: boolean;
    subgraphs: Array<{ alias: string; skipped: boolean; sources: Array<{ new_zip_sha256?: string }> }>;
  }>(run(["subgraph", "sync", "child_a", "--dry-run", "--json"], root).stdout);
  assert.equal(dryRun.action, "sync_dry_run");
  assert.equal(dryRun.ok, true);
  assert.equal(dryRun.subgraphs[0].alias, "child_a");
  assert.equal(dryRun.subgraphs[0].skipped, true);
  assert.match(dryRun.subgraphs[0].sources[0].new_zip_sha256 ?? "", /^sha256:/);
  assert.equal(sha256File(child.bundleAbs), beforeHash);
  const afterDryRunConfig = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.equal(afterDryRunConfig.subgraphs.child_a.source_repo, undefined);

  run(["new", "task", "child_a Followup", "--status", "todo", "--priority", "1", "--json"], child.child);
  const nextHead = commitAll(child.child, "child followup");
  const synced = json<{
    action: string;
    ok: boolean;
    updated: string[];
    subgraphs: Array<{ alias: string; new_source_repo?: string; updated: boolean }>;
  }>(run(["subgraph", "sync", "child_a", "--json"], root).stdout);
  assert.equal(synced.action, "synced");
  assert.equal(synced.ok, true);
  assert.deepEqual(synced.updated, ["child_a"]);
  assert.equal(synced.subgraphs[0].updated, true);
  assert.match(synced.subgraphs[0].new_source_repo ?? "", new RegExp(`${nextHead}$`));
  assert.notEqual(sha256File(child.bundleAbs), beforeHash);
  const afterSyncConfig = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.match(afterSyncConfig.subgraphs.child_a.source_repo, new RegExp(`${nextHead}$`));
  run(["subgraph", "verify", "child_a", "--json"], root);
  const search = json<{ items: Array<{ title: string; qid: string }> }>(
    run(["search", "Followup", "--json"], root).stdout
  );
  assert.equal(search.items.some((item) => item.title === "child_a Followup" && item.qid.startsWith("child_a:")), true);
});

test("subgraph sync refuses dirty tracked child changes unless allow-dirty is explicit", () => {
  const root = makeTempDir("mdkg-subgraph-sync-dirty-");
  run(["init", "--agent"], root);
  const child = createGitChildBundle(root, "child_dirty");
  run([
    "subgraph",
    "add",
    "child_dirty",
    child.bundlePath,
    "--source-path",
    "projects/child_dirty",
    "--json",
  ], root);
  fs.appendFileSync(path.join(child.child, ".mdkg", "README.md"), "\nDirty test note.\n", "utf8");

  const failure = runFailure(["subgraph", "sync", "child_dirty", "--json"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /subgraph sync failed/);
  const failedReceipt = json<{ ok: boolean; errors: string[] }>(failure.stdout);
  assert.equal(failedReceipt.ok, false);
  assert.equal(failedReceipt.errors.some((item) => item.includes("dirty tracked changes")), true);

  const allowed = json<{
    ok: boolean;
    subgraphs: Array<{ dirty_tracked?: boolean; dirty_tracked_paths?: string[] }>;
  }>(run(["subgraph", "sync", "child_dirty", "--allow-dirty", "--json"], root).stdout);
  assert.equal(allowed.ok, true);
  assert.equal(allowed.subgraphs[0].dirty_tracked, true);
  assert.equal(allowed.subgraphs[0].dirty_tracked_paths?.includes(".mdkg/README.md"), true);
});

test("subgraph materialize extracts bundles safely and local graph ignores materialized views", () => {
  const root = makeTempDir("mdkg-subgraph-materialize-");
  run(["init", "--agent"], root);
  const child = createGitChildBundle(root, "child_view");
  run(["subgraph", "add", "child_view", child.bundlePath, "--source-path", "projects/child_view", "--json"], root);

  const materialized = json<{
    ok: boolean;
    target: string;
    results: Array<{ alias: string; ok: boolean; output_path: string; bundle_hash?: string }>;
  }>(run(["subgraph", "materialize", "child_view", "--target", ".mdkg/subgraphs", "--gitignore", "--json"], root).stdout);
  assert.equal(materialized.ok, true);
  assert.equal(materialized.results[0].alias, "child_view");
  const outputDir = path.join(root, materialized.results[0].output_path);
  const markerPath = path.join(outputDir, ".mdkg-materialized.json");
  assert.equal(fs.existsSync(markerPath), true);
  const marker = JSON.parse(fs.readFileSync(markerPath, "utf8"));
  assert.equal(marker.alias, "child_view");
  assert.match(marker.bundle_hash, /^sha256:/);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "subgraphs", ".gitignore")), true);
  assert.equal(fs.existsSync(path.join(outputDir, ".mdkg", "work")), true);

  const existsFailure = runFailure(["subgraph", "materialize", "child_view", "--target", ".mdkg/subgraphs", "--json"], root);
  assert.equal(existsFailure.status, 2);
  assert.match(existsFailure.stdout, /use --clean/);
  run(["subgraph", "materialize", "child_view", "--target", ".mdkg/subgraphs", "--clean", "--json"], root);

  run(["subgraph", "disable", "child_view", "--json"], root);
  run(["index"], root);
  const search = json<{ count: number }>(run(["search", "child_view Task", "--json"], root).stdout);
  assert.equal(search.count, 0);
  run(["validate"], root);
});

test("subgraph materialize refuses to clean non-marker directories", () => {
  const root = makeTempDir("mdkg-subgraph-materialize-clean-");
  run(["init", "--agent"], root);
  const child = createGitChildBundle(root, "child_clean");
  run(["subgraph", "add", "child_clean", child.bundlePath, "--source-path", "projects/child_clean", "--json"], root);
  const outputDir = path.join(root, ".mdkg", "subgraphs", "child_clean");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "note.txt"), "not generated by mdkg\n", "utf8");

  const failure = runFailure([
    "subgraph",
    "materialize",
    "child_clean",
    "--target",
    ".mdkg/subgraphs",
    "--clean",
    "--json",
  ], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stdout, /refusing to clean non-materialized directory/);
});

test("cross-subgraph qid refs validate against enabled subgraph targets", () => {
  const root = makeTempDir("mdkg-subgraph-cross-ref-");
  run(["init", "--agent"], root);
  const childA = createGitChildBundle(root, "child_a");
  const childB = createGitChildBundle(root, "child_b");
  run(["subgraph", "add", "child_a", childA.bundlePath, "--source-path", "projects/child_a", "--json"], root);
  run(["subgraph", "add", "child_b", childB.bundlePath, "--source-path", "projects/child_b", "--json"], root);
  run([
    "new",
    "task",
    "Cross Subgraph Ref",
    "--status",
    "todo",
    "--priority",
    "1",
    "--relates",
    "child_b:work.child_b-work",
    "--refs",
    "child_a:task-1,https://example.test/ref",
    "--json",
  ], root);
  run([
    "work",
    "order",
    "new",
    "Root Order For Child Work",
    "--id",
    "order.root-child-b",
    "--work-id",
    "child_b:work.child_b-work",
    "--requester",
    "user://root",
    "--json",
  ], root);
  run([
    "work",
    "receipt",
    "new",
    "Root Receipt For Child Order",
    "--id",
    "receipt.root-child-b",
    "--work-order-id",
    "child_b:order.child_b-order",
    "--outcome",
    "success",
    "--json",
  ], root);
  run(["validate"], root);

  run(["subgraph", "disable", "child_b", "--json"], root);
  const failure = runFailure(["validate"], root);
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /references missing node child_b:work\.child_b-work/);
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
