import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = path.resolve(process.cwd());
const manifestPath = path.join(repoRoot, "scripts", "smoke-manifest.json");
const workflowPath = path.join(repoRoot, ".github", "workflows", "release-readiness.yml");
const generatorPath = path.join(repoRoot, "scripts", "generate-ci-workflow.js");
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const ladder = require(path.join(repoRoot, "scripts", "release-ladder.js")) as {
  validateManifest(candidate: unknown, packageJson: unknown): void;
  canonicalEntries(
    candidate: unknown,
    mode: "ci" | "prepublish" | "full-prepare" | "full-shard",
    shardId?: string,
    scope?: "package" | "repository",
  ): Array<{ canonical: string; prerequisites: string[] }>;
  writeFullContext(
    contextDir: string,
    tarballPath: string,
    artifactHash: string,
    trackedBefore: { head: string },
    root?: string,
  ): {
    source_head: string;
    package: { sha256: string; bytes: number };
    dist: { sha256: string; file_count: number };
  };
  loadFullContext(
    contextDir: string,
    expectedHead: string,
    root?: string,
  ): { artifactHash: string; context: { source_head: string } };
};
const generator = require(generatorPath) as {
  readTopology(): typeof manifest.ci_topology;
  renderWorkflow(topology: typeof manifest.ci_topology): string;
  validateShaInput(value: string): string;
  validateWorkflowProjection(actual: string, expected?: string): { ok: boolean; bytes: number };
  verifyExactSha(value: string, root?: string): { expected: string; actual: string; detached: boolean };
};

function cloneManifest() {
  return JSON.parse(JSON.stringify(manifest));
}

function expectInvalid(mutate: (candidate: any) => void, pattern: RegExp) {
  const candidate = cloneManifest();
  mutate(candidate);
  assert.throws(() => ladder.validateManifest(candidate, packageJson), pattern);
}

function runGit(root: string, args: string[]) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test("accepted manifest topology has exact fast membership and five complete full shards", () => {
  assert.doesNotThrow(() => ladder.validateManifest(manifest, packageJson));
  const full = ladder.canonicalEntries(manifest, "prepublish", undefined, "repository");
  const fast = ladder.canonicalEntries(manifest, "ci");
  const sharded: Array<{ canonical: string; prerequisites: string[] }> =
    manifest.ci_topology.full.shards.flatMap((shard: { id: string }) =>
    ladder.canonicalEntries(manifest, "full-shard", shard.id),
  );

  assert.equal(manifest.ci_topology.decision_ref, "root:dec-91");
  assert.equal(manifest.ci_topology.runtime_decision_ref, "root:dec-98");
  assert.deepEqual(
    manifest.ci_topology.fast.runtimes,
    [
      { id: "minimum", version: "24.18.0" },
      { id: "floating", version: "24.x" },
    ],
  );
  assert.equal(fast.length, 13);
  assert.deepEqual(fast.map((entry) => entry.canonical), manifest.ci_topology.fast.canonical);
  assert.equal(manifest.ci_topology.full.shards.length, 5);
  assert.deepEqual(manifest.ci_topology.full.linux_filesystem, {
    state: "unqualified_stub",
    qualification_scope: "portable-node-installed-contracts",
    test_ref: "root:test-487",
    timeout_minutes: 5,
    runners: [
      { id: "x64", label: "ubuntu-24.04" },
      { id: "arm64", label: "ubuntu-24.04-arm" },
    ],
  });
  assert.equal(sharded.length, 46);
  assert.equal(new Set(sharded.map((entry) => entry.canonical)).size, 46);
  assert.deepEqual(
    sharded.map((entry) => entry.canonical).sort(),
    full.map((entry) => entry.canonical).sort(),
  );
});

test("topology validation identifies runtime timeout membership partition and profile drift", () => {
  assert.throws(() => ladder.validateManifest(manifest, { ...packageJson, engines: { node: ">=24.15.0" } }), /package Node range/);
  expectInvalid(candidate => { candidate.ci_topology.runtime_decision_ref = "root:dec-91"; }, /runtime root:dec-98/);
  expectInvalid(candidate => { candidate.ci_topology.full.linux_filesystem.qualification_scope = "native-helper"; }, /unqualified stub/);
  expectInvalid(
    (candidate) => {
      candidate.ci_topology.fast.runtimes[0].version = "24.x";
    },
    /runtime matrix/,
  );
  expectInvalid(
    (candidate) => {
      candidate.ci_topology.fast.timeout_minutes = 0;
    },
    /fast timeout/,
  );
  expectInvalid(
    (candidate) => {
      candidate.ci_topology.full.linux_filesystem.state = "qualified";
    },
    /Test487 x64\/ARM64 unqualified stub/,
  );
  expectInvalid(
    (candidate) => {
      candidate.ci_topology.full.linux_filesystem.runners.pop();
    },
    /Test487 x64\/ARM64 unqualified stub/,
  );
  expectInvalid(
    (candidate) => {
      candidate.ci_topology.fast.canonical.pop();
    },
    /13 unique/,
  );
  expectInvalid(
    (candidate) => {
      candidate.ci_topology.full.shards[0].canonical.push(
        candidate.ci_topology.full.shards[1].canonical[0],
      );
    },
    /partition all 46/,
  );
  expectInvalid(
    (candidate) => {
      const sites = candidate.ci_topology.full.shards.find(
        (shard: { id: string }) => shard.id === "sites-git-repair",
      );
      const target = candidate.ci_topology.full.shards.find(
        (shard: { id: string }) => shard.id === "package-command",
      );
      const moved = sites.canonical.pop();
      target.canonical.push(moved);
    },
    /site profile smokes/,
  );
});

test("generated workflow byte-matches source-owned topology and exposes the accepted DAG", () => {
  const workflow = fs.readFileSync(workflowPath, "utf8");
  const generated = generator.renderWorkflow(generator.readTopology());
  const generatorSource = fs.readFileSync(generatorPath, "utf8");

  assert.equal(workflow, generated);
  for (const expected of [
    "Fast / ${{ matrix.id }} / Node ${{ matrix.node }}",
    'node: "24.18.0"',
    'node: "24.x"',
    "timeout-minutes: 15",
    "npm run deps:bootstrap",
    "npm run ci:release",
    "Preserve interrupted fixture evidence and report failed cases",
    "node scripts/collect-ci-evidence.js",
    "!${{ runner.temp }}/mdkg-fast/run-*/tmp/**",
    "${{ runner.temp }}/mdkg-fast-fixtures",
    "full_prepare:",
    "full_smoke:",
    "needs: full_prepare",
    "full_linux_filesystem:",
    "runner: ubuntu-24.04",
    "runner: ubuntu-24.04-arm",
    "Refuse missing Test487 installed-artifact qualification",
    "exit 1",
    "full_release:",
    "needs: [full_prepare, full_smoke, full_linux_filesystem]",
    "test \"$LINUX_FILESYSTEM_RESULT\" = success",
    "npm run ci:full:prepare",
    "npm run ci:full:shard",
    "if: ${{ always() }}",
    "if-no-files-found: error",
    "retention-days: 14",
    "retention-days: 30",
    "--verify-sha",
  ]) {
    assert.match(workflow, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const shard of manifest.ci_topology.full.shards) {
    assert.match(workflow, new RegExp(`shard: ${shard.id}`));
  }
  assert.doesNotMatch(workflow, /continue-on-error/);
  assert.equal(Object.keys(packageJson.dependencies || {}).some((name) => /ya?ml/i.test(name)), false);
  assert.equal(Object.keys(packageJson.devDependencies || {}).some((name) => /ya?ml/i.test(name)), false);
  assert.doesNotMatch(generatorSource, /require\(["']ya?ml/);
});

test("workflow projection check fails at the exact first removed topology contract", () => {
  const expected = generator.renderWorkflow(generator.readTopology());
  assert.deepEqual(generator.validateWorkflowProjection(expected, expected), {
    ok: true,
    bytes: Buffer.byteLength(expected),
  });
  for (const contract of [
    "    timeout-minutes: 15\n",
    "        if: ${{ always() }}\n",
    "    needs: [full_prepare, full_smoke, full_linux_filesystem]\n",
    "          name: mdkg-full-context-${{ inputs.commit_sha }}\n",
  ]) {
    const changed = expected.replace(contract, "");
    assert.notEqual(changed, expected, `fixture contract must exist: ${contract.trim()}`);
    assert.throws(
      () => generator.validateWorkflowProjection(changed, expected),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /^workflow projection mismatch at line \d+: expected /);
        assert.ok(error.message.includes(contract.trim()), error.message);
        return true;
      },
    );
  }
});

test("exact SHA validation rejects ambiguous input and requires a detached matching checkout", () => {
  for (const invalid of ["", "abc", "A".repeat(40), "a".repeat(39), `${"a".repeat(39)}g`]) {
    assert.throws(() => generator.validateShaInput(invalid), /40 lowercase hexadecimal/);
  }
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-ci-exact-sha-"));
  runGit(root, ["init", "-q"]);
  runGit(root, ["config", "user.name", "mdkg test"]);
  runGit(root, ["config", "user.email", "mdkg-test@example.invalid"]);
  fs.writeFileSync(path.join(root, "tracked.txt"), "fixture\n", "utf8");
  runGit(root, ["add", "tracked.txt"]);
  runGit(root, ["commit", "-qm", "fixture"]);
  const sha = runGit(root, ["rev-parse", "HEAD"]);

  assert.throws(() => generator.verifyExactSha(sha, root), /must be detached/);
  runGit(root, ["checkout", "--detach", "-q", sha]);
  assert.deepEqual(generator.verifyExactSha(sha, root), {
    expected: sha,
    actual: sha,
    detached: true,
  });
  assert.throws(
    () => generator.verifyExactSha("0".repeat(40), root),
    /does not match requested SHA/,
  );
});

test("full shards restore one hash-bound package and dist context and reject drift", (t) => {
  const fixture = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "mdkg-ci-context-"));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const producer = path.join(fixture, "producer");
  const consumer = path.join(fixture, "consumer");
  const contextDir = path.join(fixture, "context");
  fs.mkdirSync(path.join(producer, "dist", "nested"), { recursive: true });
  fs.mkdirSync(consumer, { recursive: true });
  fs.writeFileSync(path.join(producer, "dist", "cli.js"), "export const value = 1;\n", "utf8");
  fs.writeFileSync(path.join(producer, "dist", "nested", "data.json"), "{\"ok\":true}\n", "utf8");
  const tarballPath = path.join(fixture, "package.tgz");
  fs.writeFileSync(tarballPath, "immutable package fixture\n", "utf8");
  const artifactHash = require("node:crypto")
    .createHash("sha256")
    .update(fs.readFileSync(tarballPath))
    .digest("hex");
  const sourceHead = "a".repeat(40);

  const written = ladder.writeFullContext(
    contextDir,
    tarballPath,
    artifactHash,
    { head: sourceHead },
    producer,
  );
  assert.equal(written.source_head, sourceHead);
  assert.equal(written.package.sha256, artifactHash);
  assert.equal(written.dist.file_count, 2);
  assert.match(written.dist.sha256, /^[a-f0-9]{64}$/);

  const loaded = ladder.loadFullContext(contextDir, sourceHead, consumer);
  assert.equal(loaded.artifactHash, artifactHash);
  assert.equal(
    fs.readFileSync(path.join(consumer, "dist", "nested", "data.json"), "utf8"),
    "{\"ok\":true}\n",
  );
  assert.throws(
    () => ladder.loadFullContext(contextDir, "b".repeat(40), consumer),
    /identity does not match/,
  );

  fs.appendFileSync(path.join(contextDir, "dist", "cli.js"), "// tampered\n", "utf8");
  assert.throws(
    () => ladder.loadFullContext(contextDir, sourceHead, consumer),
    /dist hash or file count mismatch/,
  );
  fs.writeFileSync(path.join(contextDir, "dist", "cli.js"), "export const value = 1;\n", "utf8");
  assert.equal(fs.statSync(path.join(contextDir, "package.tgz")).mode & 0o777, 0o444);
  fs.chmodSync(path.join(contextDir, "package.tgz"), 0o644);
  fs.appendFileSync(path.join(contextDir, "package.tgz"), "tampered\n", "utf8");
  assert.throws(
    () => ladder.loadFullContext(contextDir, sourceHead, consumer),
    /package hash or size mismatch/,
  );
});
