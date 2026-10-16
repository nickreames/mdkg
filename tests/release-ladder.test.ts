import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = path.resolve(process.cwd());
const manifestPath = path.join(repoRoot, "scripts", "smoke-manifest.json");
const proxyPath = path.join(repoRoot, "scripts", "npm-smoke-proxy.js");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const ladder = require(path.join(repoRoot, "scripts", "release-ladder.js")) as {
  failureEvidence(result: { status: number | null; stdout?: string; stderr?: string; signal?: string; error?: { code: string } }, limit?: number): any;
  validateManifest(manifest: unknown, packageJson: unknown): void;
  canonicalEntries(
    manifest: unknown,
    mode: "ci" | "prepublish" | "full-prepare" | "full-shard",
    shardId?: string,
    scope?: "package" | "repository",
  ): Array<{
    canonical: string;
    aliases: string[];
    prerequisites: string[];
  }>;
  captureTrackedBoundary(root: string): {
    tracked_tree_sha256: string;
    tracked_hashes: Record<string, string>;
  };
  compareTrackedBoundaries(
    before: { tracked_hashes: Record<string, string> },
    after: { tracked_hashes: Record<string, string> },
  ): {
    ok: boolean;
    changed_tracked_paths: string[];
    checks: Record<string, boolean>;
  };
};

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

test("failed gate evidence preserves exact outcome and full-stream hashes with bounded readable tails", () => {
  const stdout = "prefix must stay in full log\n".repeat(1000) + "failed: retained regression case\n";
  const input = Object.freeze({ status: 1, stdout, stderr: "coverage floor failed\n" });
  const evidence = ladder.failureEvidence(input);
  assert.equal(evidence.status, 1);
  assert.equal(evidence.stdout.sha256, crypto.createHash("sha256").update(stdout).digest("hex"));
  assert.equal(evidence.stdout.bytes, Buffer.byteLength(stdout));
  assert.equal(evidence.stdout.truncated, true);
  assert.ok(Buffer.byteLength(evidence.stdout.tail_utf8) <= 8192);
  assert.match(evidence.stdout.tail_utf8, /failed: retained regression case/);
  assert.equal(evidence.stderr.tail_utf8, input.stderr);
  assert.equal(evidence.stderr.truncated, false);
  assert.equal(input.stdout, stdout);
});

test("failure excerpt retains timeout/signal identity, handles absent output and does not split UTF8", () => {
  const evidence = ladder.failureEvidence({ status: null, signal: "SIGTERM", error: { code: "ETIMEDOUT" }, stdout: "😀😀😀😀end" }, 9);
  assert.equal(evidence.signal, "SIGTERM");assert.equal(evidence.error_code, "ETIMEDOUT");assert.equal(evidence.status, null);
  assert.equal(evidence.stderr.tail_utf8, "");assert.equal(evidence.stderr.bytes, 0);
  assert.ok(Buffer.byteLength(evidence.stdout.tail_utf8) <= 9);assert.ok(!evidence.stdout.tail_utf8.includes("\ufffd"));
  for (const limit of [0, -1, 8193, 1.5]) assert.throws(() => ladder.failureEvidence({ status: 1 }, limit), /1\.\.8192/);
});

function sha256(filePath: string) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function runProxy(args: string[], env: NodeJS.ProcessEnv, cwd: string) {
  return spawnSync(process.execPath, [proxyPath, ...args], {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
}

function runGit(root: string, args: string[]) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test("smoke manifest maps package aliases to 46 canonical executions", () => {
  assert.doesNotThrow(() => ladder.validateManifest(manifest, packageJson));
  const full = ladder.canonicalEntries(manifest, "prepublish", undefined, "repository");
  const ci = ladder.canonicalEntries(manifest, "ci");
  const subgraph = full.find((entry) => entry.canonical === "smoke:subgraph");

  assert.equal(manifest.alias_count, 47);
  assert.equal(full.length, 46);
  assert.equal(ci.length, 13);
  assert.deepEqual(ci.map((entry) => entry.canonical), manifest.ci_topology.fast.canonical);
  assert.deepEqual(subgraph?.aliases.sort(), ["smoke:bundle-import", "smoke:subgraph"]);
  assert.equal(
    full.filter((entry) => entry.prerequisites.includes("immutable_package_artifact")).length,
    34,
  );
  assert.equal(manifest.profiles.docs.length, 4);
  assert.equal(manifest.profiles["mdkg-dev"].length, 5);
});

test("full CI shards partition all canonical smokes exactly once", () => {
  const full = ladder.canonicalEntries(manifest, "prepublish", undefined, "repository");
  const sharded: Array<{ canonical: string; prerequisites: string[] }> =
    manifest.ci_topology.full.shards.flatMap((shard: { id: string }) =>
    ladder.canonicalEntries(manifest, "full-shard", shard.id),
  );
  const siteSmokes = full
    .filter((entry) => entry.prerequisites.includes("site_profile_cache"))
    .map((entry) => entry.canonical);
  const siteShard = manifest.ci_topology.full.shards.find((shard: { canonical: string[] }) =>
    siteSmokes.every((id) => shard.canonical.includes(id)),
  );

  assert.equal(manifest.ci_topology.decision_ref, "root:dec-91");
  assert.equal(manifest.ci_topology.full.shards.length, 5);
  assert.deepEqual(
    sharded.map((entry) => entry.canonical).sort(),
    full.map((entry) => entry.canonical).sort(),
  );
  assert.equal(new Set(sharded.map((entry) => entry.canonical)).size, 46);
  assert.ok(siteShard);
});

test("npm smoke proxy supplies the same immutable artifact and records its hash", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-artifact-proxy-"));
  const artifact = path.join(root, "mdkg-0.0.0.tgz");
  const destination = path.join(root, "pack");
  fs.writeFileSync(artifact, "immutable artifact bytes\n", "utf8");
  const hash = sha256(artifact);
  const result = runProxy(
    ["npm", "pack", "--silent", "--pack-destination", destination],
    {
      MDKG_SMOKE_TARBALL: artifact,
      MDKG_SMOKE_TARBALL_SHA256: hash,
      MDKG_BUILD_RECEIPT_DIR: root,
      MDKG_SMOKE_ID: "smoke:fixture",
      MDKG_REAL_NPM: process.execPath,
      MDKG_REAL_NPX: process.execPath,
    },
    root,
  );
  const provided = path.join(destination, path.basename(artifact));
  const usage = JSON.parse(fs.readFileSync(path.join(root, "artifact-usages.jsonl"), "utf8").trim());

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), path.basename(artifact));
  assert.equal(sha256(provided), hash);
  assert.equal(usage.smoke, "smoke:fixture");
  assert.equal(usage.sha256, hash);
});

test("site build proxy caches once per declared profile and invalidates on source change", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-site-cache-"));
  const receiptDir = path.join(root, "receipts");
  const fakeNpm = path.join(root, "fake-npm.js");
  writeJson(path.join(root, "package.json"), { name: "fixture-root", version: "1.0.0" });
  writeJson(path.join(root, "docs", "package.json"), { name: "fixture-docs", version: "1.0.0" });
  writeJson(path.join(root, "docs", "package-lock.json"), {
    name: "fixture-docs",
    version: "1.0.0",
    lockfileVersion: 3,
    packages: { "": { name: "fixture-docs", version: "1.0.0" } },
  });
  fs.mkdirSync(path.join(root, "docs", "src"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs", "src", "page.md"), "first\n", "utf8");
  fs.mkdirSync(path.join(root, "release"), { recursive: true });
  fs.writeFileSync(path.join(root, "release", "state.json"), "{}\n", "utf8");
  fs.writeFileSync(
    fakeNpm,
    [
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      'const dist = path.join(process.cwd(), "docs", "dist");',
      "fs.mkdirSync(dist, { recursive: true });",
      'fs.writeFileSync(path.join(dist, "marker.txt"), process.env.VERCEL_ENV || "default");',
    ].join("\n"),
    "utf8",
  );
  runGit(root, ["init", "-q"]);
  const baseEnv = {
    MDKG_REAL_NPM: fakeNpm,
    MDKG_REAL_NPX: fakeNpm,
    MDKG_REPO_ROOT: root,
    MDKG_SMOKE_MANIFEST: manifestPath,
    MDKG_SITE_CACHE_DIR: path.join(receiptDir, "site-cache"),
    MDKG_BUILD_RECEIPT_DIR: receiptDir,
    MDKG_SMOKE_ID: "smoke:fixture-site",
  };

  const first = runProxy(["npm", "--prefix", "docs", "run", "build"], baseEnv, root);
  const second = runProxy(["npm", "--prefix", "docs", "run", "build"], baseEnv, root);
  const preview = runProxy(
    ["npm", "--prefix", "docs", "run", "build"],
    { ...baseEnv, VERCEL_ENV: "preview" },
    root,
  );
  fs.writeFileSync(path.join(root, "docs", "src", "page.md"), "changed\n", "utf8");
  const invalidated = runProxy(["npm", "--prefix", "docs", "run", "build"], baseEnv, root);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(preview.status, 0, preview.stderr);
  assert.equal(invalidated.status, 0, invalidated.stderr);
  const events = fs.readFileSync(path.join(receiptDir, "build-events.jsonl"), "utf8")
    .trim()
    .split(/\r?\n/)
    .map((line) => JSON.parse(line));

  assert.deepEqual(
    events.map((event) => [event.profile, event.cache_hit]),
    [
      ["default", false],
      ["default", true],
      ["preview", false],
      ["default", false],
    ],
  );
});

function externalSiteFixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-site-external-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  runGit(root, ["init", "-q"]);
  const put = (relative: string, content: string) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  };
  put(".gitignore", "**/dist/\nnode_modules/\n");
  put("package.json", JSON.stringify({ name: "fixture", version: "1.0.0" }));
  put("mdkg-dev/package.json", JSON.stringify({ name: "site", version: "1.0.0" }));
  put("mdkg-dev/package-lock.json", JSON.stringify({ lockfileVersion: 3, packages: {} }));
  put("mdkg-dev/src/page.astro", "import Portable from '../../presentations/example/site/src/Portable.astro';\n");
  put("presentations/example/site/src/Portable.astro", "first component\n");
  put("shared/message.txt", "first transitive input\n");
  put("fake-npm.js", [
    'const fs=require("node:fs"),path=require("node:path");',
    'const files=["presentations/example/site/src/Portable.astro", "shared/message.txt", "shared/optional.txt"];',
    'const output=files.map(file=>fs.existsSync(file)?fs.readFileSync(file,"utf8"):"absent").join("\\n");',
    'if(process.env.MDKG_TEST_CHANGE_INPUT) fs.writeFileSync("shared/message.txt","changed during build");',
    'fs.mkdirSync("mdkg-dev/dist",{recursive:true});fs.writeFileSync("mdkg-dev/dist/index.html",output);',
  ].join("\n"));
  const env = {
    MDKG_REAL_NPM: path.join(root, "fake-npm.js"), MDKG_REAL_NPX: path.join(root, "fake-npm.js"),
    MDKG_REPO_ROOT: root, MDKG_SMOKE_MANIFEST: manifestPath,
    MDKG_SITE_CACHE_DIR: path.join(root, "receipts/site-cache"), MDKG_BUILD_RECEIPT_DIR: path.join(root, "receipts"),
    MDKG_SMOKE_ID: "smoke:external-inputs",
  };
  const run = (extra: NodeJS.ProcessEnv = {}) => runProxy(["npm", "--prefix", "mdkg-dev", "run", "build"], { ...env, ...extra }, root);
  const events = () => {
    const file = path.join(root, "receipts/build-events.jsonl");
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim().split("\n").map(line => JSON.parse(line)) : [];
  };
  const output = () => fs.readFileSync(path.join(root, "mdkg-dev/dist/index.html"), "utf8");
  return { root, put, run, events, output };
}

test("site cache binds external direct and transitive sources including additions and deletions", t => {
  const f = externalSiteFixture(t);
  const build = () => { const r = f.run(); assert.equal(r.status, 0, r.stderr); };
  build(); build();
  f.put("presentations/example/site/src/Portable.astro", "second component\n");
  build(); assert.match(f.output(), /second component/);
  f.put("shared/message.txt", "second transitive input\n");
  build(); assert.match(f.output(), /second transitive input/);
  f.put("shared/optional.txt", "added input\n");
  build(); assert.match(f.output(), /added input/);
  fs.unlinkSync(path.join(f.root, "shared/optional.txt"));
  build(); assert.doesNotMatch(f.output(), /added input/);
  build();
  // Deleting the optional input returns to a previously sealed exact input set.
  assert.deepEqual(f.events().map(e => e.cache_hit), [false, true, false, false, false, true, true]);
  assert.equal(f.events()[0].source_hash, f.events()[1].source_hash);
  assert.notEqual(f.events()[1].source_hash, f.events()[2].source_hash);
  assert.ok(f.events().every(e => /^[a-f0-9]{64}$/.test(e.source_hash) && /^[a-f0-9]{64}$/.test(e.output_hash)));
});

test("site cache refuses unsupported linked input without issuing build acceptance", t => {
  const f = externalSiteFixture(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-site-outside-"));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.writeFileSync(path.join(outside, "message.txt"), "outside input\n");
  fs.unlinkSync(path.join(f.root, "shared/message.txt"));
  fs.symlinkSync(path.join(outside, "message.txt"), path.join(f.root, "shared/message.txt"));
  const r = f.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /symlink|symbolic|unsupported/i);
  assert.deepEqual(f.events(), []);
});

test("site cache refuses source movement during the build without sealing stale output", t => {
  const f = externalSiteFixture(t), r = f.run({ MDKG_TEST_CHANGE_INPUT: "1" });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /changed|moved|unstable/i);
  assert.deepEqual(f.events(), []);
  const retry = f.run(); assert.equal(retry.status, 0, retry.stderr);
  assert.match(f.output(), /changed during build/);
  assert.equal(f.events()[0].cache_hit, false);
});

test("site cache detects corrupted output instead of accepting a poisoned hit", t => {
  const f = externalSiteFixture(t), first = f.run(); assert.equal(first.status, 0, first.stderr);
  const event = f.events()[0];
  f.put(`receipts/site-cache/mdkg-dev/default/${event.cache_key}/dist/index.html`, "poisoned output\n");
  const second = f.run();
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /integrity|hash|corrupt/i);
  assert.equal(f.events().length, 1);
});

test("site cache binds lockfiles and verifies its persisted input evidence", t => {
  const f = externalSiteFixture(t);
  let r = f.run(); assert.equal(r.status, 0, r.stderr);
  f.put("mdkg-dev/package-lock.json", JSON.stringify({ lockfileVersion: 3, packages: { changed: {} } }));
  r = f.run(); assert.equal(r.status, 0, r.stderr);
  const events = f.events();
  assert.deepEqual(events.map(e => e.cache_hit), [false, false]);
  assert.notEqual(events[0].cache_key, events[1].cache_key);
  assert.equal(sha256(events[1].input_manifest), events[1].input_manifest_sha256);
  fs.writeFileSync(events[1].input_manifest, "tampered manifest\n");
  r = f.run(); assert.notEqual(r.status, 0);
  assert.match(r.stderr, /manifest integrity/);
  assert.equal(f.events().length, 2);
});

test("site cache refuses implicit dotenv inputs before reading or building them", t => {
  const f = externalSiteFixture(t);
  f.put("mdkg-dev/.env", "PRIVATE_FIXTURE_VALUE=not-a-real-secret\n");
  const r = f.run(); assert.notEqual(r.status, 0);
  assert.match(r.stderr, /implicit environment input/);
  assert.doesNotMatch(r.stderr, /not-a-real-secret/);
  assert.deepEqual(f.events(), []);
});

test("release scripts preserve standalone smoke behavior and use bounded runners", () => {
  assert.equal(packageJson.scripts["ci:release"], "node scripts/release-ladder.js ci");
  assert.equal(packageJson.scripts.prepublishOnly, "node scripts/release-ladder.js prepublish");
  assert.match(packageJson.scripts.test, /^npm run build && npm run test:built$/);
  assert.match(packageJson.scripts["cli:check"], /^npm run build && npm run cli:check:built$/);
  for (const entry of manifest.aliases.filter((item: { alias: string }) => item.alias !== "smoke:bundle-import")) {
    assert.match(packageJson.scripts[entry.alias], /^npm run build && node scripts\/smoke-/);
  }
});

test("release ladder proves tracked state, lockfiles, and the selected goal are unchanged", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-release-boundary-"));
  runGit(root, ["init", "-q"]);
  runGit(root, ["config", "user.name", "mdkg test"]);
  runGit(root, ["config", "user.email", "mdkg-test@example.invalid"]);
  for (const relativePath of [
    ".mdkg/work/goal-73-make-the-docs-current-release-supplement-version-driven.md",
    "package-lock.json",
    "docs/package-lock.json",
    "mdkg-dev/package-lock.json",
    "src/tracked.txt",
  ]) {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${relativePath}\n`, "utf8");
  }
  runGit(root, ["add", "."]);
  runGit(root, ["commit", "-qm", "fixture"]);

  const before = ladder.captureTrackedBoundary(root);
  const unchanged = ladder.compareTrackedBoundaries(before, ladder.captureTrackedBoundary(root));
  assert.equal(unchanged.ok, true);
  assert.deepEqual(unchanged.changed_tracked_paths, []);
  assert.equal(unchanged.checks.selected_goal_unchanged, true);
  assert.equal(unchanged.checks.lockfiles_unchanged, true);

  fs.writeFileSync(path.join(root, "src", "tracked.txt"), "changed\n", "utf8");
  const drifted = ladder.compareTrackedBoundaries(before, ladder.captureTrackedBoundary(root));
  assert.equal(drifted.ok, false);
  assert.deepEqual(drifted.changed_tracked_paths, ["src/tracked.txt"]);
  assert.equal(drifted.checks.tracked_tree_unchanged, false);
  assert.equal(drifted.checks.status_unchanged, false);
});

test("demo graph smoke accepts only warning-only stale subgraph verification", () => {
  const utilities = require(path.join(repoRoot, "scripts", "mdkg-dev-smoke-utils.js")) as {
    run(command: string, args: string[], options?: { allowFailure?: boolean }): {
      status: number;
      stdout: string;
      stderr: string;
    };
  };
  const allowed = utilities.run(process.execPath, ["-e", "process.exit(2)"], { allowFailure: true });
  const source = fs.readFileSync(path.join(repoRoot, "scripts", "smoke-demo-graph.js"), "utf8");

  assert.equal(allowed.status, 2);
  assert.throws(
    () => utilities.run(process.execPath, ["-e", "process.exit(2)"]),
    /command failed/,
  );
  assert.match(source, /subgraphResult\.status === 2/);
  assert.match(source, /entry\.error_count === 0/);
  assert.match(source, /bundle age/);
});
