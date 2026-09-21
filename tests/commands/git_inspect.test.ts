import { test, TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { writeRootConfig } from "../helpers/config";

const cli = path.resolve(__dirname, "../../cli.js");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
function git(root: string, args: string[]) {
  const result = spawnSync("git", ["-c", "core.hooksPath=/dev/null", ...args], {
    cwd: root, encoding: "utf8", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}`);
  return result.stdout.trim();
}
function fixture(t: TestContext, commit = true) {
  const root = fs.mkdtempSync(path.join(tempBase, "mdkg-inspect-receipt-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  git(root, ["init", "-q", "-b", "main"]);
  git(root, ["config", "user.name", "mdkg fixture"]);
  git(root, ["config", "user.email", "fixture@example.invalid"]);
  fs.writeFileSync(path.join(root, "tracked.txt"), "base\n");
  if (commit) { git(root, ["add", "."]); git(root, ["commit", "-q", "-m", "base"]); }
  return root;
}
function inspect(root: string, env: NodeJS.ProcessEnv = {}, json = true) {
  return spawnSync(process.execPath, [cli, "git", "inspect", ...(json ? ["--json"] : [])], {
    cwd: root, encoding: "utf8", env: { ...process.env, ...env }, maxBuffer: 4 * 1024 * 1024,
  });
}
function receipt(root: string) {
  const result = inspect(root);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}
function shim(root: string, body: string) {
  const command = spawnSync(process.platform === "win32" ? "where" : "which", ["git"], { encoding: "utf8" });
  assert.equal(command.status, 0);
  const realGit = command.stdout.trim().split(/\r?\n/)[0];
  const bin = path.join(root, ".git/test-bin"); fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "git"), `#!${process.execPath}\nconst args=process.argv.slice(2);if(args.includes('status')){${body}}else{const r=require('child_process').spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});process.exit(r.status ?? 1);}\n`, { mode: 0o755 });
  return { PATH: bin + path.delimiter + process.env.PATH };
}

function markerFilter(root: string, kind = "clean") {
  const gitDir = git(root, ["rev-parse", "--absolute-git-dir"]);
  const marker = path.join(gitDir, "filter-called");
  const script = path.join(gitDir, "filter.cjs");
  fs.writeFileSync(script, `require('fs').appendFileSync(${JSON.stringify(marker)},'called');process.stdin.pipe(process.stdout);`);
  git(root, ["config", `filter.fixture.${kind}`, `${JSON.stringify(process.execPath)} ${JSON.stringify(script)}`]);
  return marker;
}

test("inspection keeps the first unstaged status column and full path", (t) => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, "tracked.txt"), "changed\n");
  assert.deepEqual(receipt(root).status.entries, [{ index: " ", worktree: "M", path: "tracked.txt" }]);
});

test("inspection preserves mixed rename and unusual path records", (t) => {
  const root = fixture(t);
  git(root, ["mv", "tracked.txt", "renamed.txt"]);
  fs.appendFileSync(path.join(root, "renamed.txt"), "unstaged\n");
  const names = ["unicode-λ", ...(process.platform === "win32" ? [] : [" space ", "tab\tname", "line\nname", 'quote"name', "literal?token=value#part"])];
  for (const name of names) fs.writeFileSync(path.join(root, name), "untracked\n");
  const rows = receipt(root).status.entries;
  assert.deepEqual(rows.find((r: { path: string }) => r.path === "renamed.txt"), {
    index: "R", worktree: "M", path: "renamed.txt", original_path: "tracked.txt",
  });
  for (const name of names) assert.deepEqual(rows.find((r: { path: string }) => r.path === name), { index: "?", worktree: "?", path: name });
});

for (const [name, body] of [
  ["failed status", "process.stderr.write('SENSITIVE_HELPER_OUTPUT');process.exit(77);"],
  ["oversized output", "process.stdout.write('x'.repeat(2*1024*1024));"],
  ["truncated record", "process.stdout.write(' M tracked.txt');"],
  ["malformed record", "process.stdout.write('bad record\\0');"],
  ["incomplete rename", "process.stdout.write('R  renamed.txt\\0');"],
  ["invalid UTF-8 path", "process.stdout.write(Buffer.from([32,77,32,255,0]));"],
  ["invalid status pair", "process.stdout.write('?M file\\0');"],
]) {
  test(`inspection fails closed on ${name}`, { skip: process.platform === "win32" }, (t) => {
    const root = fixture(t);
    const result = inspect(root, shim(root, body));
    assert.equal(result.status, 2, `${result.stdout}\n${result.stderr}`);
    assert.doesNotMatch(result.stdout + result.stderr, /SENSITIVE_HELPER_OUTPUT|"clean": true/);
    assert.match(result.stderr, /Git.*(?:observation|status)|git.*(?:observation|status)/);
  });
}

test("inspection pairs the actual remote name with its descriptor", (t) => {
  const root = fixture(t);
  assert.equal(receipt(root).source_descriptor.remote, null);
  git(root, ["remote", "add", "upstream", "https://example.invalid/source.git"]);
  assert.deepEqual(receipt(root).source_descriptor, {
    kind: "git", repository_ref: "https://example.invalid/source.git", remote: "upstream", branch: "main", access_ref: "external-git-auth",
  });
  git(root, ["remote", "add", "origin", "https://example.invalid/target.git"]);
  assert.equal(receipt(root).source_descriptor.remote, "origin");
  assert.equal(receipt(root).source_descriptor.repository_ref, "https://example.invalid/target.git");
});

test("inspection redacts all URL suffixes across fetch push and text descriptors", (t) => {
  const root = fixture(t);
  git(root, ["remote", "add", "origin", "https://user:password-marker@example.invalid/repo?ToKeN=query-marker&%74oken=encoded-marker#fragment-marker"]);
  git(root, ["remote", "set-url", "--push", "origin", "ssh://git@example.invalid:2222/repo?arbitrary=push-marker#push-fragment"]);
  const result = inspect(root);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /password-marker|query-marker|encoded-marker|fragment-marker|push-marker|push-fragment/);
  assert.doesNotMatch(inspect(root, {}, false).stdout, /password-marker|query-marker|encoded-marker|fragment-marker/);
  const r = JSON.parse(result.stdout);
  assert.equal(r.source_descriptor.repository_ref, r.remotes[0].fetch_url);
  assert.match(r.remotes[0].fetch_url, /example\.invalid\/repo/);
  assert.match(r.remotes[0].push_url, /example\.invalid:2222\/repo/);
});

test("inspection preserves legitimate URL encoded paths SCP and local descriptors", (t) => {
  const root = fixture(t);
  const values = ["https://example.invalid/repo%3Fname%23part", "git@example.invalid:org/repo", "../local?name#part", "C:\\repos\\project", "\\\\server\\share\\project"];
  values.forEach((value, i) => git(root, ["remote", "add", `r${i}`, value]));
  const r = receipt(root);
  assert.deepEqual(r.remotes.map((remote: { fetch_url: string }) => remote.fetch_url), values);
});

test("inspection preserves copy source records and nested untracked paths", { skip: process.platform === "win32" }, (t) => {
  const root = fixture(t);
  const result = inspect(root, shim(root, "process.stdout.write('C  copied.txt\\0original.txt\\0?? nested/file\\0');"));
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).status.entries, [
    { index: "C", worktree: " ", path: "copied.txt", original_path: "original.txt" },
    { index: "?", worktree: "?", path: "nested/file" },
  ]);
});

test("inspection withholds opaque helpers malformed URLs and control characters", (t) => {
  const root = fixture(t);
  const values = ["ext::opaque-marker", "fixture_helper::underscore-marker", "custom::https://user:helper-marker@example.invalid/repo", "https://user:malformed-marker@[bad/repo?query-marker", "https://example.invalid/repo\ncontrol-marker"];
  values.forEach((value, i) => git(root, ["remote", "add", `r${i}`, value]));
  const result = inspect(root);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /opaque-marker|underscore-marker|helper-marker|malformed-marker|query-marker|control-marker/);
  assert(JSON.parse(result.stdout).remotes.every((r: { fetch_url: string }) => r.fetch_url.startsWith("<redacted remote")));
});

test("inspection outside a repository does not claim a clean Git tree", (t) => {
  const root = fs.mkdtempSync(path.join(tempBase, "mdkg-inspect-no-git-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  const r = receipt(root);
  assert.equal(r.inside_work_tree, false);
  assert.equal(r.status.clean, false);
  assert.equal(r.source_descriptor.remote, null);
  assert.equal(r.head_sha, null);
  assert.deepEqual(r.warnings, ["not inside a Git work tree"]);
});

test("inspection does not execute configured fsmonitor or update index bytes", { skip: process.platform === "win32" }, (t) => {
  const root = fixture(t);
  const marker = path.join(root, ".git/helper-called");
  const hook = path.join(root, ".git/fsmonitor-fixture");
  fs.writeFileSync(hook, `#!${process.execPath}\nrequire('fs').writeFileSync(${JSON.stringify(marker)},'called');process.stdout.write('fixture-token\\0');\n`, { mode: 0o755 });
  git(root, ["config", "core.fsmonitor", hook]);
  git(root, ["config", "core.fsmonitorHookVersion", "2"]);
  const index = path.join(root, ".git/index");
  const before = fs.readFileSync(index);
  fs.utimesSync(path.join(root, "tracked.txt"), new Date(), new Date(Date.now() + 3000));
  const result = inspect(root, { GIT_OPTIONAL_LOCKS: "1" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(marker), false, "repository-configured helper must not execute");
  assert.deepEqual(fs.readFileSync(index), before);
});

test("inspection supports unborn and detached repositories without invented revisions", (t) => {
  const unborn = receipt(fixture(t, false));
  assert.equal(unborn.head_sha, null); assert.equal(unborn.tree_hash, null); assert.equal(unborn.branch, "main");
  const root = fixture(t);
  const head = git(root, ["rev-parse", "HEAD"]);
  git(root, ["checkout", "--detach", "-q", head]);
  const detached = receipt(root);
  assert.equal(detached.branch, null); assert.equal(detached.head_sha, head); assert.equal(detached.status.clean, true);
});

for (const kind of ["clean", "process"]) {
  test(`inspection refuses active ${kind} filters without executing them`, { skip: process.platform === "win32" }, (t) => {
    const root = fixture(t);
    const marker = markerFilter(root, kind);
    // An unused configured filter must not make an ordinary repo unsupported.
    assert.equal(receipt(root).status.clean, true);
    fs.writeFileSync(path.join(root, ".gitattributes"), "tracked.txt filter=fixture\n");
    fs.utimesSync(path.join(root, "tracked.txt"), new Date(), new Date(Date.now() + 5000));
    const index = fs.readFileSync(path.join(root, ".git/index"));
    const result = inspect(root);
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /configured content filter.*refuses helper execution/);
    assert.equal(fs.existsSync(marker), false);
    assert.deepEqual(fs.readFileSync(path.join(root, ".git/index")), index);
    assert.doesNotMatch(result.stdout + result.stderr, /filter\.cjs|"clean": true/);
    for (const overrides of [
      { GIT_LITERAL_PATHSPECS: "1" }, { GIT_GLOB_PATHSPECS: "1" }, { GIT_ICASE_PATHSPECS: "1" },
      { GIT_DIR: path.join(root, ".git"), GIT_WORK_TREE: root, GIT_INDEX_FILE: path.join(root, ".git/index") },
    ]) {
      const redirected = inspect(root, overrides);
      assert.equal(redirected.status, 2, redirected.stderr);
      assert.match(redirected.stderr, /configured content filter/);
      assert.equal(fs.existsSync(marker), false);
      assert.deepEqual(fs.readFileSync(path.join(root, ".git/index")), index);
    }
  });
}

test("inspection checks content filters in initialized linked submodules", { skip: process.platform === "win32" }, (t) => {
  const parent = fixture(t), source = fixture(t);
  git(parent, ["-c", "protocol.file.allow=always", "submodule", "add", "-q", source, "child"]);
  git(parent, ["commit", "-q", "-m", "add child"]);
  const child = path.join(parent, "child");
  const marker = markerFilter(child);
  fs.writeFileSync(path.join(child, ".gitattributes"), "tracked.txt filter=fixture\n");
  fs.utimesSync(path.join(child, "tracked.txt"), new Date(), new Date(Date.now() + 5000));
  const childIndex = path.join(git(child, ["rev-parse", "--absolute-git-dir"]), "index");
  const before = [fs.readFileSync(path.join(parent, ".git/index")), fs.readFileSync(childIndex)];
  const result = inspect(parent);
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /configured content filter/);
  assert.equal(fs.existsSync(marker), false);
  assert.deepEqual([fs.readFileSync(path.join(parent, ".git/index")), fs.readFileSync(childIndex)], before);
  const redirected = inspect(parent, {
    GIT_DIR: path.join(parent, ".git"), GIT_WORK_TREE: parent, GIT_INDEX_FILE: path.join(parent, ".git/index"),
  });
  assert.equal(redirected.status, 2, redirected.stderr);
  assert.match(redirected.stderr, /configured content filter/);
  assert.equal(fs.existsSync(marker), false);
  assert.deepEqual([fs.readFileSync(path.join(parent, ".git/index")), fs.readFileSync(childIndex)], before);
});

test("inspection binds tree hash to the captured immutable commit", { skip: process.platform === "win32" }, (t) => {
  const root = fixture(t);
  const first = git(root, ["rev-parse", "HEAD"]), firstTree = git(root, ["rev-parse", "HEAD^{tree}"]);
  fs.appendFileSync(path.join(root, "tracked.txt"), "second\n");
  git(root, ["add", "tracked.txt"]); git(root, ["commit", "-q", "-m", "second"]);
  const second = git(root, ["rev-parse", "HEAD"]);
  git(root, ["update-ref", "HEAD", first]);
  const realGit = spawnSync("which", ["git"], { encoding: "utf8" }).stdout.trim();
  const bin = path.join(root, ".git/revision-bin"); fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "git"), `#!${process.execPath}\nconst {spawnSync}=require('child_process'),a=process.argv.slice(2);const r=spawnSync(${JSON.stringify(realGit)},a,{encoding:'utf8'});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(a.includes('--quiet')&&a.includes('HEAD')){const moved=spawnSync(${JSON.stringify(realGit)},['update-ref','HEAD',${JSON.stringify(second)}]);if(moved.status!==0)process.exit(88);}process.exit(r.status??1);\n`, { mode: 0o755 });
  const result = inspect(root, { PATH: bin + path.delimiter + process.env.PATH });
  assert.equal(result.status, 0, result.stderr);
  const r = JSON.parse(result.stdout);
  assert.equal(r.accepted_revision.commit_sha, first);
  assert.equal(r.accepted_revision.tree_hash, firstTree);
  assert.equal(git(root, ["rev-parse", "HEAD"]), second, "fixture must actually advance the live ref");
});
