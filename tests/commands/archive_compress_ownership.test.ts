import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], { cwd, encoding: "utf8" });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function runGit(args: string[], cwd: string): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return result.stdout.trim();
}

function hashFile(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function hashTree(root: string): string {
  const hash = crypto.createHash("sha256");
  const walk = (current: string): void => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const fullPath = path.join(current, entry.name);
      const relative = path.relative(root, fullPath).split(path.sep).join("/");
      hash.update(`${entry.isDirectory() ? "d" : "f"}:${relative}\n`);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        hash.update(fs.readFileSync(fullPath));
      }
    }
  };
  walk(root);
  return hash.digest("hex");
}

function updateConfig(root: string, mutate: (config: any) => void): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  mutate(config);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function setUpdatedDate(sidecarPath: string, value: string): void {
  const content = fs.readFileSync(sidecarPath, "utf8");
  fs.writeFileSync(sidecarPath, content.replace(/^updated: .*$/m, `updated: ${value}`), "utf8");
}

function addArchive(root: string, id: string, filename: string, contents: string): void {
  fs.writeFileSync(path.join(root, filename), contents, "utf8");
  run(["archive", "add", filename, "--id", id, "--json"], root);
}

type Fixture = {
  root: string;
  child: string;
  bundle: string;
  rootRaw: string;
  rootZip: string;
  rootSidecar: string;
  secondary?: string;
  secondaryRaw?: string;
  secondaryZip?: string;
  secondarySidecar?: string;
};

function createFixture(withSecondary = false): Fixture {
  const root = makeTempDir("mdkg-archive-ownership-");
  run(["init", "--agent"], root);
  addArchive(root, "archive.shared", "root.txt", "root initial\n");

  const child = path.join(root, "child-repo");
  fs.mkdirSync(child, { recursive: true });
  run(["init", "--agent"], child);
  addArchive(child, "archive.shared", "child.txt", "child immutable\n");
  const childBundle = JSON.parse(run(["bundle", "create", "--profile", "private", "--json"], child).stdout);
  const bundle = path.join(child, childBundle.path);
  run([
    "subgraph",
    "add",
    "child_subgraph",
    path.relative(root, bundle),
    "--source-path",
    "child-repo",
    "--json",
  ], root);

  const fixture: Fixture = {
    root,
    child,
    bundle,
    rootRaw: path.join(root, ".mdkg", "archive", "archive.shared", "source", "root.txt"),
    rootZip: path.join(root, ".mdkg", "archive", "archive.shared", "root.txt.zip"),
    rootSidecar: path.join(root, ".mdkg", "archive", "archive.shared", "root.txt.md"),
  };

  if (withSecondary) {
    const secondary = path.join(root, "secondary");
    fs.mkdirSync(secondary, { recursive: true });
    run(["init", "--agent"], secondary);
    addArchive(secondary, "archive.shared", "secondary.txt", "secondary initial\n");
    updateConfig(root, (config) => {
      config.workspaces.secondary = {
        path: "secondary",
        enabled: true,
        mdkg_dir: ".mdkg",
        visibility: "private",
      };
    });
    run(["index"], root);
    fixture.secondary = secondary;
    fixture.secondaryRaw = path.join(secondary, ".mdkg", "archive", "archive.shared", "source", "secondary.txt");
    fixture.secondaryZip = path.join(secondary, ".mdkg", "archive", "archive.shared", "secondary.txt.zip");
    fixture.secondarySidecar = path.join(secondary, ".mdkg", "archive", "archive.shared", "secondary.txt.md");
  }
  return fixture;
}

test("archive compress --all excludes imported archives and reports the mutation boundary", () => {
  const fixture = createFixture();
  run(["subgraph", "materialize", "child_subgraph", "--target", ".mdkg/subgraphs", "--json"], fixture.root);
  const materialized = path.join(fixture.root, ".mdkg", "subgraphs", "child_subgraph");
  runGit(["init"], fixture.child);
  runGit(["config", "user.email", "archive-fixture@example.test"], fixture.child);
  runGit(["config", "user.name", "Archive Fixture"], fixture.child);
  runGit(["add", "."], fixture.child);
  runGit(["commit", "-m", "fixture child"], fixture.child);
  runGit(["init"], fixture.root);
  runGit(["add", "child-repo"], fixture.root);
  setUpdatedDate(fixture.rootSidecar, "2020-01-01");
  const rootZipBefore = hashFile(fixture.rootZip);
  const rootSidecarBefore = hashFile(fixture.rootSidecar);
  const bundleBefore = hashFile(fixture.bundle);
  const childBefore = hashTree(fixture.child);
  const materializedBefore = hashTree(materialized);
  const gitlinkBefore = runGit(["ls-files", "--stage", "child-repo"], fixture.root);
  assert.match(gitlinkBefore, /^160000 /);

  const receipt = JSON.parse(run(["archive", "compress", "--all", "--json"], fixture.root).stdout);
  assert.equal(receipt.action, "compressed");
  assert.equal(receipt.count, 1);
  assert.deepEqual(receipt.archives.map((item: { qid: string }) => item.qid), ["root:archive.shared"]);
  assert.deepEqual(receipt.selection, {
    requested_workspace: null,
    selected_workspaces: ["root"],
    excluded_read_only: [
      {
        workspace: "child_subgraph",
        qid: "child_subgraph:archive.shared",
        reason: "read_only_imported_subgraph",
      },
    ],
  });
  assert.equal(hashFile(fixture.rootZip), rootZipBefore);
  assert.notEqual(hashFile(fixture.rootSidecar), rootSidecarBefore);
  assert.equal(hashFile(fixture.bundle), bundleBefore);
  assert.equal(hashTree(fixture.child), childBefore);
  assert.equal(hashTree(materialized), materializedBefore);
  assert.equal(runGit(["ls-files", "--stage", "child-repo"], fixture.root), gitlinkBefore);

  const listed = JSON.parse(run(["archive", "list", "--ws", "child_subgraph", "--json"], fixture.root).stdout);
  assert.equal(listed.count, 1);
  assert.equal(listed.items[0].qid, "child_subgraph:archive.shared");
  const shown = JSON.parse(run(["archive", "show", "child_subgraph:archive.shared", "--json"], fixture.root).stdout);
  assert.equal(shown.item.qid, "child_subgraph:archive.shared");

  const human = run(["archive", "compress", "--all"], fixture.root).stdout;
  assert.match(human, /archive compressed: 1/);
  assert.match(human, /selected workspaces: root/);
  assert.match(human, /excluded read-only projections: 1/);
  assert.match(human, /child_subgraph:archive\.shared \(read_only_imported_subgraph\)/);
});

test("archive compress rejects imported workspace and direct imported qid before writes", () => {
  const fixture = createFixture();
  const rootZipBefore = hashFile(fixture.rootZip);
  const rootSidecarBefore = hashFile(fixture.rootSidecar);
  const bundleBefore = hashFile(fixture.bundle);
  const childBefore = hashTree(fixture.child);

  const workspaceFailure = runFailure(
    ["archive", "compress", "--all", "--ws", "child_subgraph", "--json"],
    fixture.root
  );
  assert.match(workspaceFailure.stderr, /cannot compress archives in read-only imported workspace child_subgraph/);

  const directFailure = runFailure(
    ["archive", "compress", "child_subgraph:archive.shared", "--json"],
    fixture.root
  );
  assert.match(directFailure.stderr, /cannot compress read-only archive child_subgraph:archive\.shared/);
  assert.doesNotMatch(directFailure.stderr, /refusing to derive filesystem paths|\.zip#/);
  assert.equal(hashFile(fixture.rootZip), rootZipBefore);
  assert.equal(hashFile(fixture.rootSidecar), rootSidecarBefore);
  assert.equal(hashFile(fixture.bundle), bundleBefore);
  assert.equal(hashTree(fixture.child), childBefore);
});

test("archive compress --all --ws limits mutation to one local workspace", () => {
  const fixture = createFixture(true);
  setUpdatedDate(fixture.rootSidecar, "2020-01-01");
  setUpdatedDate(fixture.secondarySidecar as string, "2020-01-01");
  const rootZipBefore = hashFile(fixture.rootZip);
  const rootSidecarBefore = hashFile(fixture.rootSidecar);
  const secondaryZipBefore = hashFile(fixture.secondaryZip as string);
  const secondarySidecarBefore = hashFile(fixture.secondarySidecar as string);
  const bundleBefore = hashFile(fixture.bundle);

  const receipt = JSON.parse(
    run(["archive", "compress", "--all", "--ws", "secondary", "--json"], fixture.root).stdout
  );
  assert.equal(receipt.count, 1);
  assert.deepEqual(receipt.archives.map((item: { qid: string }) => item.qid), ["secondary:archive.shared"]);
  assert.deepEqual(receipt.selection, {
    requested_workspace: "secondary",
    selected_workspaces: ["secondary"],
    excluded_read_only: [],
  });
  assert.equal(hashFile(fixture.rootZip), rootZipBefore);
  assert.equal(hashFile(fixture.rootSidecar), rootSidecarBefore);
  assert.equal(hashFile(fixture.secondaryZip as string), secondaryZipBefore);
  assert.notEqual(hashFile(fixture.secondarySidecar as string), secondarySidecarBefore);
  assert.equal(hashFile(fixture.bundle), bundleBefore);
});

test("archive compression qids disambiguate duplicate local and imported ids", () => {
  const fixture = createFixture(true);
  const receipt = JSON.parse(run(["archive", "compress", "--all", "--json"], fixture.root).stdout);
  assert.deepEqual(receipt.archives.map((item: { qid: string }) => item.qid), [
    "root:archive.shared",
    "secondary:archive.shared",
  ]);
  assert.deepEqual(receipt.selection.excluded_read_only.map((item: { qid: string }) => item.qid), [
    "child_subgraph:archive.shared",
  ]);

  const qidReceipt = JSON.parse(
    run(["archive", "compress", "secondary:archive.shared", "--json"], fixture.root).stdout
  );
  assert.deepEqual(qidReceipt.archives.map((item: { qid: string }) => item.qid), [
    "secondary:archive.shared",
  ]);
  const conflict = runFailure(
    ["archive", "compress", "secondary:archive.shared", "--ws", "root", "--json"],
    fixture.root
  );
  assert.match(conflict.stderr, /archive qid secondary:archive\.shared conflicts with --ws root/);
});

test("archive compression completes full-set preflight before writing any archive", () => {
  const fixture = createFixture(true);
  setUpdatedDate(fixture.rootSidecar, "2020-01-01");
  fs.rmSync(fixture.secondaryRaw as string);
  const rootZipBefore = hashFile(fixture.rootZip);
  const rootSidecarBefore = hashFile(fixture.rootSidecar);
  const secondaryZipBefore = hashFile(fixture.secondaryZip as string);
  const secondarySidecarBefore = hashFile(fixture.secondarySidecar as string);

  const failure = runFailure(["archive", "compress", "--all", "--json"], fixture.root);
  assert.match(failure.stderr, /raw archive file missing for secondary:archive\.shared/);
  assert.equal(hashFile(fixture.rootZip), rootZipBefore);
  assert.equal(hashFile(fixture.rootSidecar), rootSidecarBefore);
  assert.equal(hashFile(fixture.secondaryZip as string), secondaryZipBefore);
  assert.equal(hashFile(fixture.secondarySidecar as string), secondarySidecarBefore);
});

test("archive compression ownership is identical with the JSON index backend", () => {
  const fixture = createFixture();
  updateConfig(fixture.root, (config) => {
    config.index.backend = "json";
  });
  run(["index"], fixture.root);

  const receipt = JSON.parse(run(["archive", "compress", "--all", "--json"], fixture.root).stdout);
  assert.deepEqual(receipt.archives.map((item: { qid: string }) => item.qid), ["root:archive.shared"]);
  assert.deepEqual(receipt.selection.excluded_read_only.map((item: { qid: string }) => item.qid), [
    "child_subgraph:archive.shared",
  ]);
});
