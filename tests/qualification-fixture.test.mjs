import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { createOwnedFixture, isolatedFixtureEnvironment, finalizeFixture } = require("../scripts/qualification-fixture.js");
const { prepareDemoFixture } = require("../scripts/demo-graph-fixture.js");
const repoRoot = path.resolve(import.meta.dirname, "..");

function parentFixture(t) {
  const owned = createOwnedFixture({ base: fs.realpathSync(require("node:os").tmpdir()), prefix: "mdkg-fixture-test-" });
  t.after(() => owned.cleanup());
  return owned;
}

test("cleanup is bound to the created root and preserves prefix-matching siblings", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  const neighbor = `${owned.root}-not-owned`;
  fs.mkdirSync(neighbor);
  fs.writeFileSync(path.join(neighbor, "keep.txt"), "preserved\n");
  fs.writeFileSync(owned.resolve("mine.txt"), "owned\n");
  assert.equal(owned.cleanup().removed, true);
  assert.equal(fs.existsSync(owned.root), false);
  assert.equal(fs.readFileSync(path.join(neighbor, "keep.txt"), "utf8"), "preserved\n");
  assert.equal(owned.cleanup().already_released, true);
});

test("cleanup refuses an unowned directory substituted at the same root path", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  fs.renameSync(owned.root, `${owned.root}-original`);
  fs.mkdirSync(owned.root);
  fs.writeFileSync(path.join(owned.root, "keep.txt"), "replacement\n");
  assert.throws(() => owned.cleanup(), /fixture identity changed/);
  assert.equal(fs.readFileSync(path.join(owned.root, "keep.txt"), "utf8"), "replacement\n");
  assert.equal(fs.existsSync(`${owned.root}-original`), true);
});

test("cleanup refuses a substituted root symlink without following its target", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  const outside = parent.resolve("outside");
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, "keep.txt"), "outside\n");
  fs.renameSync(owned.root, `${owned.root}-original`);
  fs.symlinkSync(outside, owned.root, "dir");
  assert.throws(() => owned.cleanup(), /fixture identity changed/);
  assert.equal(fs.readFileSync(path.join(outside, "keep.txt"), "utf8"), "outside\n");
});

test("cleanup refuses a substituted ancestor and leaves both trees intact", (t) => {
  const parent = parentFixture(t), base = parent.resolve("base");
  fs.mkdirSync(base);
  const owned = createOwnedFixture({ base, prefix: "run-" });
  fs.renameSync(base, `${base}-original`);
  fs.mkdirSync(base);
  fs.mkdirSync(owned.root);
  fs.writeFileSync(path.join(owned.root, "keep.txt"), "replacement\n");
  assert.throws(() => owned.cleanup(), /fixture identity changed/);
  assert.equal(fs.readFileSync(path.join(owned.root, "keep.txt"), "utf8"), "replacement\n");
  assert.equal(fs.existsSync(path.join(`${base}-original`, path.basename(owned.root))), true);
});

test("cleanup unlinks an owned descendant symlink without deleting its outside target", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  const outside = parent.resolve("outside");
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, "keep.txt"), "outside\n");
  fs.symlinkSync(outside, owned.resolve("link"), "dir");
  owned.cleanup();
  assert.equal(fs.readFileSync(path.join(outside, "keep.txt"), "utf8"), "outside\n");
});

test("fixture path and prefix validation cannot grant arbitrary cleanup targets", (t) => {
  const owned = parentFixture(t);
  for (const relative of ["", ".", "..", "../escape", path.parse(owned.root).root]) {
    assert.throws(() => owned.resolve(relative), /relative|escapes/);
  }
  assert.throws(() => createOwnedFixture({ base: owned.root, prefix: "../escape-" }), /basename prefix/);
  assert.equal(Object.isFrozen(owned), true);
  assert.throws(() => { owned.root = "/"; }, TypeError);
});

test("fixture environment removes inherited Git redirects/config and does not alter its input", () => {
  const original = {
    PATH: "synthetic-path", GIT_DIR: "outside", GIT_WORK_TREE: "outside", GIT_INDEX_FILE: "outside",
    GIT_COMMON_DIR: "outside", GIT_OBJECT_DIRECTORY: "outside", GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "core.hooksPath", GIT_CONFIG_VALUE_0: "outside", GIT_CONFIG_GLOBAL: "outside",
    GIT_SSH_COMMAND: "outside", GIT_EXEC_PATH: "outside", git_config_system: "outside", GIT_OPTIONAL_LOCKS: "1",
  };
  const env = isolatedFixtureEnvironment(original);
  assert.equal(original.GIT_DIR, "outside");
  assert.equal(env.PATH, "synthetic-path");
  for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_COMMON_DIR", "GIT_OBJECT_DIRECTORY", "GIT_CONFIG_COUNT", "GIT_CONFIG_KEY_0", "GIT_CONFIG_VALUE_0", "GIT_SSH_COMMAND", "GIT_EXEC_PATH", "git_config_system"]) {
    assert.equal(Object.hasOwn(env, key), false, key);
  }
  assert.equal(env.GIT_CONFIG_GLOBAL, process.platform === "win32" ? "NUL" : "/dev/null");
  assert.equal(env.GIT_CONFIG_NOSYSTEM, "1");
  assert.equal(env.GIT_OPTIONAL_LOCKS, "0");
  assert.equal(env.GIT_TERMINAL_PROMPT, "0");
});

test("demo fixture copies exact runtime/graph inputs but no app dependencies or canonical private graph", (t) => {
  const owned = parentFixture(t), prepared = prepareDemoFixture(owned, repoRoot);
  assert.ok(prepared.inputIdentity.file_count > 100);
  assert.ok(prepared.inputIdentity.bytes > 0);
  assert.equal(fs.existsSync(path.join(prepared.repoRoot, "dist/cli.js")), true);
  assert.equal(fs.existsSync(path.join(prepared.repoRoot, "dist/tests")), false);
  assert.equal(fs.existsSync(path.join(prepared.repoRoot, ".mdkg/work")), false);
  for (const root of Object.values(prepared.copiedRoots)) {
    assert.equal(fs.existsSync(path.join(root, ".mdkg/config.json")), true);
    assert.equal(fs.existsSync(path.join(root, ".agents/skills")), true);
    assert.equal(fs.existsSync(path.join(root, ".claude/skills")), true);
    assert.equal(fs.existsSync(path.join(root, "node_modules")), false);
  }
  assert.equal(fs.existsSync(path.join(prepared.copiedRoots["examples/demo-runs/demo-001"], "src")), false);
  const original = fs.statSync(path.join(repoRoot, "dist/cli.js"));
  const copy = fs.statSync(path.join(prepared.repoRoot, "dist/cli.js"));
  assert.ok(original.dev !== copy.dev || original.ino !== copy.ino);
  prepared.assertSourceUnchanged();
});

test("demo smoke no longer discovers cleanup targets by scratch prefix", () => {
  const source = fs.readFileSync(path.join(repoRoot, "scripts/smoke-demo-graph.js"), "utf8");
  assert.doesNotMatch(source, /entry\.startsWith\(scratchName\)|rmSync\(|rmdirSync\(/);
  assert.match(source, /finalizeFixture\(fixture/);
  assert.doesNotMatch(source, /spawnSync/);
});

test("upgrade smoke uses owned finalization before reporting success", () => {
  const source=fs.readFileSync(path.join(repoRoot,"scripts/smoke-upgrade.js"),"utf8");
  assert.match(source,/fixture = createUpgradeFixture\(/);
  assert.match(source,/finalizeFixture\(fixture, \{ error: primaryFailure \}\)/);
  assert.doesNotMatch(source,/rmSync\(tempRoot/);
  assert.ok(source.indexOf('finalizeFixture(fixture') < source.indexOf('console.log("upgrade smoke passed")'));
});

test("upgrade fixture canonicalizes only the default OS temporary base", (t) => {
  const {createUpgradeFixture}=require("../scripts/smoke-upgrade.js");
  const owned=createUpgradeFixture({});t.after(()=>owned.cleanup());
  assert.equal(path.dirname(owned.root),fs.realpathSync(require("node:os").tmpdir()));
  assert.ok(fs.statSync(owned.root).isDirectory());
  const parent=parentFixture(t),alias=parent.resolve("alias");fs.symlinkSync(parent.root,alias,"dir");
  assert.throws(()=>createUpgradeFixture({MDKG_SMOKE_TMPDIR:alias}),/directory|link/);
  const explicit=createUpgradeFixture({MDKG_SMOKE_TMPDIR:parent.root});
  assert.equal(path.dirname(explicit.root),parent.root);explicit.cleanup();
});

test("source drift does not skip independently owned cleanup or mask a smoke failure", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  const primary = new Error("original smoke failure"), drift = new Error("source drift");
  assert.throws(() => finalizeFixture(owned, { error: primary, verify() { throw drift; } }), (error) => {
    assert.deepEqual(error.errors, [primary, drift]);
    assert.match(error.message, /original smoke failure/);
    assert.match(error.message, /source drift/);
    assert.match(error.message, /"removed":true/);
    return true;
  });
  assert.equal(fs.existsSync(owned.root), false);
});

test("source and ownership failures are both reported and uncertain fixtures are retained", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  fs.renameSync(owned.root, `${owned.root}-original`);
  fs.mkdirSync(owned.root);
  const drift = new Error("source drift");
  assert.throws(() => finalizeFixture(owned, { verify() { throw drift; } }), (error) => {
    assert.equal(error.errors[0], drift);
    assert.match(error.errors[1].message, /fixture identity changed/);
    assert.match(error.message, /source drift/);
    assert.match(error.message, /fixture identity changed/);
    assert.match(error.message, /"removed":false/);
    assert.ok(error.message.includes(owned.root));
    return true;
  });
  assert.ok(fs.existsSync(owned.root));
  assert.ok(fs.existsSync(`${owned.root}-original`));
});

test("successful fixture finalization verifies inputs then removes only its owned root", (t) => {
  const parent = parentFixture(t), owned = createOwnedFixture({ base: parent.root, prefix: "run-" });
  let verified = false;
  const receipt = finalizeFixture(owned, { verify() { assert.ok(fs.existsSync(owned.root)); verified = true; } });
  assert.equal(verified, true);
  assert.deepEqual(receipt, { removed: true, root: owned.root });
});

test("fixture failure text retains nested aggregate causes without cycling", (t) => {
  const owned = parentFixture(t), leaf = new Error("original command diagnostic");
  const nested = new AggregateError([leaf], "artifact verification wrapper");
  nested.cause = nested;
  assert.throws(() => finalizeFixture(owned, { error: nested }), error => {
    assert.equal(error.errors[0], nested);
    assert.match(error.message, /original command diagnostic/);
    assert.match(error.message, /artifact verification wrapper/);
    assert.match(error.message, /previously reported failure/);
    assert.match(error.message, /"removed":true/);
    return true;
  });
});

function templateSource(t) {
  const owned = parentFixture(t);
  const prepared = prepareDemoFixture(owned, repoRoot);
  const manifestPath = path.join(prepared.repoRoot, "presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json");
  return { owned, prepared, manifestPath };
}

test("demo copies exclude actual unlisted template files, dependencies and private root data", (t) => {
  const { owned, prepared } = templateSource(t);
  const sentinels = [".env", ".git/config", "site/node_modules/unreleased/data.txt", "notes-private.txt", ".agents/skills/unreleased/secret.txt"];
  for (const relative of sentinels) {
    const target = path.join(prepared.repoRoot, "examples/website-demo-template", relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "synthetic unlisted input\n");
  }
  const target = createOwnedFixture({ base: owned.root, prefix: "copy-" });
  const copied = prepareDemoFixture(target, prepared.repoRoot);
  for (const relative of sentinels) assert.equal(fs.existsSync(path.join(copied.copiedRoots["examples/website-demo-template"], relative)), false, relative);
  assert.ok(fs.existsSync(path.join(copied.copiedRoots["examples/website-demo-template"], "README.md")));
  copied.assertSourceUnchanged();
  target.cleanup();
});

test("invalid or privileged operator source paths refuse before creating a copied repository", (t) => {
  const { owned, prepared, manifestPath } = templateSource(t);
  const original = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const relative of ["../outside", "/absolute", "a//b", "a/./b", "a\\b", "C:/file", ".git/config", ".env", ".env.local", "site/node_modules/private/file", ".mdkg/db/runtime/project.sqlite",
    ".GiT/config", ".ENV", ".EnV.local", "site/NoDe_MoDuLeS/private/file", ".MdKg/db/runtime/project.sqlite"]) {
    const target = createOwnedFixture({ base: owned.root, prefix: "invalid-" });
    const manifest = structuredClone(original);
    manifest.entries[0].source_path = relative;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => prepareDemoFixture(target, prepared.repoRoot), /invalid demo operator source/);
    assert.equal(fs.existsSync(target.resolve("repository")), false);
    target.cleanup();
  }
});

test("operator identities, duplicate paths and nonregular source entries fail closed", (t) => {
  const { owned, prepared, manifestPath } = templateSource(t);
  const original = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const kind of ["hash", "duplicate", "directory", "symlink"]) {
    const target = createOwnedFixture({ base: owned.root, prefix: "invalid-" });
    const manifest = structuredClone(original);
    if (kind === "hash") manifest.entries[0].sha256 = "0".repeat(64);
    if (kind === "duplicate") manifest.entries.push(manifest.entries[0]);
    if (kind === "directory" || kind === "symlink") {
      const input = path.join(prepared.repoRoot, "examples/website-demo-template", kind);
      if (kind === "directory") fs.mkdirSync(input);
      else fs.symlinkSync("README.md", input);
      manifest.entries[0].source_path = kind;
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => prepareDemoFixture(target, prepared.repoRoot), /hash mismatch|duplicate|regular file/);
    assert.equal(fs.existsSync(target.resolve("repository")), false);
    target.cleanup();
  }
});

test("owned Node execution preserves normal results, clears Git redirects and releases before cleanup", (t) => {
  const owned = parentFixture(t);
  const result = owned.runNode(["-e", "console.log(JSON.stringify({cwd:process.cwd(),gitDir:process.env.GIT_DIR}));"], { env: { ...process.env, GIT_DIR: "outside" } });
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), { cwd: owned.root });
  const failure = owned.runNode(["-e", "process.exitCode=7"]);
  assert.equal(failure.status, 7);
  assert.equal(owned.cleanup().removed, true);
});

test("owned Node execution refuses escaped or symlinked cwd and invalid timeout", (t) => {
  const owned = parentFixture(t), marker = owned.resolve("unexpected");
  const args = ["-e", `require('node:fs').writeFileSync(${JSON.stringify(marker)},'bad')`];
  assert.throws(() => owned.runNode(args, { cwd: path.dirname(owned.root) }), /owned root/);
  const link = owned.resolve("link");
  fs.symlinkSync(owned.root, link, "dir");
  assert.throws(() => owned.runNode(args, { cwd: link }), /directory|symlink/);
  assert.throws(() => owned.runNode(args, { timeout: 0 }), /positive integer/);
  assert.equal(fs.existsSync(marker), false);
});

test("timed-out bootstrap descendants cannot keep writing while fixture cleanup runs", async (t) => {
  const owned = parentFixture(t), marker = owned.resolve("late-child.txt");
  const child = `setTimeout(()=>require('node:fs').writeFileSync(${JSON.stringify(marker)},'late child wrote'),350)`;
  const outer = `require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(child)}],{stdio:'ignore'});setInterval(()=>{},1000)`;
  assert.throws(() => owned.runNode(["-e", outer], { timeout: 150 }), /fixture process failed/);
  // Cleanup may briefly refuse a not-yet-reaped group; it must never delete
  // while group identity still exists. Recheck the same execution, no restart.
  try { owned.cleanup(); } catch (error) { assert.match(error.message, /process group .* has not exited/); assert.ok(fs.existsSync(owned.root)); }
  await new Promise((resolve) => setTimeout(resolve, 500));
  assert.equal(fs.existsSync(marker), false);
  owned.cleanup();
});

test("successful immediate-parent exit with surviving descendants is not qualification success", async (t) => {
  const owned = parentFixture(t), marker = owned.resolve("late-child.txt");
  const child = `setTimeout(()=>require('node:fs').writeFileSync(${JSON.stringify(marker)},'late child wrote'),350)`;
  const outer = `require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(child)}],{stdio:'ignore'}).unref()`;
  assert.throws(() => owned.runNode(["-e", outer]), /descendants still running/);
  await new Promise((resolve) => setTimeout(resolve, 500));
  assert.equal(fs.existsSync(marker), false);
  owned.cleanup();
});

test("nested Node supervisors share the outer shutdown boundary and cannot clean it early", async (t) => {
  const owned = parentFixture(t), marker = owned.resolve("nested-late.txt");
  const modulePath = path.join(repoRoot, "scripts/qualification-process.js");
  const leaf = `setTimeout(()=>require('node:fs').writeFileSync(${JSON.stringify(marker)},'late'),400);setInterval(()=>{},1000)`;
  const inner = `require(${JSON.stringify(modulePath)}).runFixtureProcess(process.cwd(),process.execPath,['-e',${JSON.stringify(leaf)}],{timeout:60000})`;
  const outer = `const p=require(${JSON.stringify(modulePath)});require('node:assert/strict').throws(()=>p.assertFixtureProcessesQuiescent(process.cwd()),/outer supervisor/);p.runFixtureProcess(process.cwd(),process.execPath,['-e',${JSON.stringify(inner)}],{timeout:60000});`;
  assert.throws(() => owned.runNode(["-e", outer], {timeout:250}), /fixture process failed/);
  await new Promise(resolve=>setTimeout(resolve,550));
  assert.equal(fs.existsSync(marker),false);
  owned.cleanup();
});
