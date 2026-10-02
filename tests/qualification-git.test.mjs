import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import test from "node:test";
const require = createRequire(import.meta.url);
const { createOwnedFixture } = require("../scripts/qualification-fixture");
const { acceptOwnedGitFixture } = require("../scripts/qualification-git");

function fixture(t, env = process.env) {
  const parent = createOwnedFixture({ prefix: "mdkg-git-fixture-test-" });
  t.after(() => parent.cleanup());
  const root = parent.resolve("owned"); fs.mkdirSync(root);
  return { parent, root, git: acceptOwnedGitFixture(root, env) };
}
function ok(git, root, args) {
  const result = git.run(root, args);
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.error?.message || result.stderr}`);
  return result.stdout.trim();
}
function repository(f, name = "repo") {
  const root = path.join(f.root, name); fs.mkdirSync(root);
  ok(f.git, root, ["init", "-b", "main"]);
  fs.writeFileSync(path.join(root, "file.txt"), "base\n");
  ok(f.git, root, ["add", "--", "file.txt"]); ok(f.git, root, ["commit", "-qm", "base"]);
  return root;
}
function inventory(root) {
  const result = {};
  const walk = p => { for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const file = path.join(p, entry.name);
    if (entry.isDirectory()) walk(file);
    else result[path.relative(root, file)] = entry.isSymbolicLink() ? fs.readlinkSync(file) : crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } }; walk(root); return result;
}

test("fixture Git clears all inherited redirects and preserves an outside sentinel repository", t => {
  const f = fixture(t), outside = f.parent.resolve("outside"); fs.mkdirSync(outside);
  const other = acceptOwnedGitFixture(outside); ok(other, outside, ["init", "-q"]);
  fs.writeFileSync(path.join(outside, "file.txt"), "outside\n");
  const before = inventory(outside);
  const poison = { ...process.env, GIT_DIR: path.join(outside, ".git"), GIT_WORK_TREE: outside,
    GIT_INDEX_FILE: path.join(outside, ".git/index"), GIT_COMMON_DIR: path.join(outside, ".git"),
    GIT_OBJECT_DIRECTORY: path.join(outside, ".git/objects"), GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "core.worktree", GIT_CONFIG_VALUE_0: outside, GIT_CONFIG_PARAMETERS: "'core.worktree'='outside'",
    GIT_EXEC_PATH: outside, git_config_global: path.join(outside, "config"), GIT_OPTIONAL_LOCKS: "1" };
  f.git = acceptOwnedGitFixture(f.root, poison);
  const repo = repository(f);
  assert.equal(ok(f.git, repo, ["ls-files"]), "file.txt");
  assert.deepEqual(inventory(outside), before);
});

test("fixture check-ignore distinguishes ignored/unignored without writing either worktree index", t => {
  const f = fixture(t), repo = repository(f), linked = path.join(f.root, "linked");
  fs.writeFileSync(path.join(repo, ".gitignore"), "runtime/\n");
  ok(f.git, repo, ["add", "--", ".gitignore"]); ok(f.git, repo, ["commit", "-qm", "ignore runtime"]);
  ok(f.git, repo, ["worktree", "add", "-b", "linked", linked]);
  const outside = f.parent.resolve("outside"); fs.mkdirSync(outside);
  const other = acceptOwnedGitFixture(outside); ok(other, outside, ["init", "-q"]);
  const poisoned = acceptOwnedGitFixture(f.root, { ...process.env, GIT_DIR: path.join(outside, ".git"),
    GIT_WORK_TREE: outside, GIT_INDEX_FILE: path.join(outside, ".git/index") });
  const before = inventory(f.parent.root);
  for (const cwd of [repo, linked]) {
    const ignored = poisoned.run(cwd, ["check-ignore", "runtime/project.sqlite"]);
    assert.equal(ignored.status, 0); assert.equal(ignored.stdout.trim(), "runtime/project.sqlite");
    assert.equal(poisoned.run(cwd, ["check-ignore", "schema.sql"]).status, 1);
  }
  assert.deepEqual(inventory(f.parent.root), before);
});

test("fixture check-ignore refuses options and paths outside its checkout without effects", t => {
  const f = fixture(t), repo = repository(f), sibling = repository(f, "sibling");
  fs.symlinkSync(sibling, path.join(repo, "linked"), "dir");
  const before = inventory(f.parent.root);
  for (const args of [["check-ignore"], ["check-ignore", "--stdin"], ["check-ignore", "--no-index", "file.txt"],
    ["check-ignore", path.join(sibling, "file.txt")], ["check-ignore", "../sibling/file.txt"],
    ["check-ignore", "linked/file.txt"], ["check-ignore", f.parent.resolve("foreign")]]) {
    assert.throws(() => f.git.run(repo, args), /requires explicit|leaves its checkout|link|escapes/);
    assert.deepEqual(inventory(f.parent.root), before);
  }
});

for (const mode of ["xdg", "home", "local-config"]) {
  test(`fixture Git ignores ambient ${mode} excludes but preserves checkout-owned rules`, t => {
    const f = fixture(t), home = f.parent.resolve("home"), xdg = f.parent.resolve("xdg");
    fs.mkdirSync(path.join(home, ".config/git"), { recursive: true });
    fs.mkdirSync(path.join(xdg, "git"), { recursive: true });
    const ignore = mode === "home" ? path.join(home, ".config/git/ignore") : path.join(xdg, "git/ignore");
    fs.writeFileSync(ignore, "*.sqlite\n*.sql\n");
    f.git = acceptOwnedGitFixture(f.root, { ...process.env, HOME: home, XDG_CONFIG_HOME: mode === "home" ? "" : xdg });
    const repo = repository(f);
    if (mode === "local-config") fs.appendFileSync(path.join(repo, ".git/config"), `\n[core]\n excludesFile = ${JSON.stringify(ignore)}\n`);
    for (const file of ["runtime.sqlite", "migration.sql", "local-only.tmp"]) fs.writeFileSync(path.join(repo, file), "fixture\n");
    const before = inventory(f.parent.root);
    for (const file of ["runtime.sqlite", "migration.sql"]) assert.equal(f.git.run(repo, ["check-ignore", file]).status, 1);
    assert.deepEqual(ok(f.git, repo, ["ls-files", "--others", "--exclude-standard"]).split("\n"), ["local-only.tmp", "migration.sql", "runtime.sqlite"]);
    assert.deepEqual(inventory(f.parent.root), before);

    fs.writeFileSync(path.join(repo, ".gitignore"), "runtime.sqlite\n");
    fs.mkdirSync(path.join(repo, ".git/info"), { recursive: true });
    fs.writeFileSync(path.join(repo, ".git/info/exclude"), "local-only.tmp\n");
    const withLocalRules = inventory(f.parent.root);
    for (const file of ["runtime.sqlite", "local-only.tmp"]) assert.equal(f.git.run(repo, ["check-ignore", file]).status, 0);
    assert.equal(f.git.run(repo, ["check-ignore", "migration.sql"]).status, 1);
    assert.deepEqual(ok(f.git, repo, ["ls-files", "--others", "--exclude-standard"]).split("\n"), [".gitignore", "migration.sql"]);
    assert.deepEqual(inventory(f.parent.root), withLocalRules);
    ok(f.git, repo, ["add", "--", "migration.sql"]);
    assert.equal(ok(f.git, repo, ["ls-files", "--error-unmatch", "migration.sql"]), "migration.sql");
    assert.equal(fs.readFileSync(ignore, "utf8"), "*.sqlite\n*.sql\n");
  });
}

test("configured hooks and fsmonitor do not run during ordinary fixture commits/status", t => {
  const f = fixture(t), repo = repository(f), marker = f.parent.resolve("helper-executed");
  const hook = path.join(repo, ".git/hooks/pre-commit"); fs.mkdirSync(path.dirname(hook), { recursive: true });
  fs.writeFileSync(hook, `#!${process.execPath}\nrequire('node:fs').writeFileSync(${JSON.stringify(marker)},'bad')\n`, { mode: 0o700 });
  fs.appendFileSync(path.join(repo, ".git/config"), `\n[core]\n fsmonitor = ${JSON.stringify(hook)}\n hooksPath = ${JSON.stringify(path.dirname(hook))}\n`);
  fs.appendFileSync(path.join(repo, "file.txt"), "change\n");
  ok(f.git, repo, ["add", "--", "file.txt"]); ok(f.git, repo, ["commit", "-qm", "change"]); ok(f.git, repo, ["status", "--short"]);
  assert.equal(fs.existsSync(marker), false);
});

test("native local clone, fetch and ancestry-preserving merge keep independent repository bindings", t => {
  const f = fixture(t), seed = repository(f), clone = path.join(f.root, "clone");
  ok(f.git, f.root, ["clone", "--no-local", seed, clone]);
  fs.writeFileSync(path.join(clone, "incoming.txt"), "incoming\n");
  ok(f.git, clone, ["add", "--", "incoming.txt"]); ok(f.git, clone, ["commit", "-qm", "incoming"]);
  const incoming = ok(f.git, clone, ["rev-parse", "HEAD"]);
  ok(f.git, seed, ["fetch", clone, "main:refs/heads/incoming"]);
  ok(f.git, seed, ["merge", "--no-ff", "--no-edit", "incoming"]);
  assert.equal(ok(f.git, seed, ["rev-parse", "HEAD^2"]), incoming);
  assert.notEqual(f.git.describe(seed).gitDir, f.git.describe(clone).gitDir);
});

test("real linked worktrees bind separate indexes and a common owned Git directory", t => {
  const f = fixture(t), repo = repository(f), worktree = path.join(f.root, "worktree");
  ok(f.git, repo, ["worktree", "add", "-b", "parallel", worktree]);
  const a = f.git.describe(repo), b = f.git.describe(worktree);
  assert.equal(a.common, b.common); assert.notEqual(a.gitDir, b.gitDir);
  const index = fs.readFileSync(path.join(a.gitDir, "index"));
  fs.writeFileSync(path.join(worktree, "parallel.txt"), "independent\n");
  ok(f.git, worktree, ["add", "--", "parallel.txt"]); ok(f.git, worktree, ["commit", "-qm", "parallel"]);
  assert.deepEqual(fs.readFileSync(path.join(a.gitDir, "index")), index);
  assert.notEqual(ok(f.git, repo, ["rev-parse", "HEAD"]), ok(f.git, worktree, ["rev-parse", "HEAD"]));
});

test("explicit native index refresh affects only the admitted linked checkout", t => {
  const f = fixture(t), repo = repository(f), worktree = path.join(f.root, "worktree");
  ok(f.git, repo, ["worktree", "add", "--quiet", "-b", "parallel", worktree]);
  const outside = f.parent.resolve("outside"); fs.mkdirSync(outside);
  const other = acceptOwnedGitFixture(outside); ok(other, outside, ["init", "-q"]);
  const poisoned = acceptOwnedGitFixture(f.root, { ...process.env, GIT_DIR: path.join(outside, ".git"),
    GIT_INDEX_FILE: path.join(outside, ".git/index"), GIT_WORK_TREE: outside });
  const a = poisoned.describe(repo), b = poisoned.describe(worktree);
  const oldRootIndex = fs.readFileSync(path.join(a.gitDir, "index"));
  const oldLinkedIndex = fs.readFileSync(path.join(b.gitDir, "index"));
  const staged = ok(poisoned, worktree, ["ls-files", "--stage", "-z"]), sentinel = inventory(outside);
  fs.utimesSync(path.join(worktree, "file.txt"), new Date(), new Date(Date.now() + 60000));
  assert.equal(poisoned.refreshIndexForControl(worktree).status, 0);
  assert.notDeepEqual(fs.readFileSync(path.join(b.gitDir, "index")), oldLinkedIndex);
  assert.deepEqual(fs.readFileSync(path.join(a.gitDir, "index")), oldRootIndex);
  assert.equal(ok(poisoned, worktree, ["ls-files", "--stage", "-z"]), staged);
  assert.deepEqual(inventory(outside), sentinel);
  assert.throws(() => poisoned.refreshIndexForControl(outside), /escapes/);
});

test("native local submodules and explicit rename keep owned metadata and refuse outside paths", t => {
  const f = fixture(t), repo = repository(f), origin = repository(f, "origin");
  fs.mkdirSync(path.join(repo, "projects"));
  ok(f.git, repo, ["submodule", "add", "--force", origin, "projects/child"]);
  const child = path.join(repo, "projects/child"), description = f.git.describe(child);
  assert.equal(fs.statSync(path.join(child, ".git")).isFile(), true);
  assert.ok(description.gitDir.startsWith(path.join(repo, ".git/modules") + path.sep));
  ok(f.git, child, ["mv", "file.txt", "renamed.txt"]);
  assert.equal(ok(f.git, child, ["ls-files"]), "renamed.txt");
  const before = inventory(f.root);
  for (const action of [
    () => f.git.run(repo, ["submodule", "add", "--force", "https://example.invalid/project", "projects/remote"]),
    () => f.git.run(repo, ["submodule", "add", "--force", origin, "../sibling"]),
    () => f.git.run(child, ["mv", "renamed.txt", "../outside.txt"]),
    () => f.git.run(child, ["mv", "--force", "renamed.txt", "overwritten.txt"]),
  ]) { assert.throws(action, /escapes|no explicit repository|leaves its checkout|explicit paths|absolute owned path/); assert.deepEqual(inventory(f.root), before); }
});

test("fixture rename refuses a submodule whose gitdir is outside the accepted root", t => {
  const f = fixture(t), repo = repository(f), origin = repository(f, "origin");
  fs.mkdirSync(path.join(repo, "projects"));
  ok(f.git, repo, ["submodule", "add", "--force", origin, "projects/child"]);
  ok(f.git, repo, ["add", "--", ".gitmodules", "projects/child"]);
  ok(f.git, repo, ["commit", "-qm", "add child"]);
  const child = path.join(repo, "projects/child");
  const outsideGitDir = f.parent.resolve("outside-gitdir");
  fs.cpSync(f.git.describe(child).gitDir, outsideGitDir, { recursive: true });
  fs.writeFileSync(path.join(child, ".git"), `gitdir: ${outsideGitDir}\n`);
  const before = inventory(f.parent.root);
  assert.throws(() => f.git.run(repo, ["mv", "projects/child", "projects/moved"]), /independent regular file/);
  assert.deepEqual(inventory(f.parent.root), before);
});

test("native separate-git-dir repositories remain usable within the owned fixture", t => {
  const f = fixture(t), repo = path.join(f.root, "repo"), metadata = path.join(f.root, "metadata"); fs.mkdirSync(repo);
  ok(f.git, repo, ["init", "-b", "main", "--separate-git-dir", metadata]);
  assert.equal(f.git.describe(repo).gitDir, metadata);
  fs.writeFileSync(path.join(repo, "file.txt"), "owned\n"); ok(f.git, repo, ["add", "--", "file.txt"]); ok(f.git, repo, ["commit", "-qm", "bound"]);
});

test("bare fixture repositories remain usable as explicit local clone sources", t => {
  const f = fixture(t), repo = repository(f), bare = path.join(f.root, "bare"), clone = path.join(f.root, "clone");
  ok(f.git, f.root, ["clone", "--bare", "--no-local", repo, bare]);
  assert.equal(f.git.describe(bare).bare, true);
  ok(f.git, f.root, ["clone", "--no-local", bare, clone]);
  assert.equal(ok(f.git, repo, ["rev-parse", "HEAD"]), ok(f.git, clone, ["rev-parse", "HEAD"]));
});

test("outside cwd, clone/fetch sources, destinations and separate metadata refuse without changes", t => {
  const f = fixture(t), repo = repository(f), outside = f.parent.resolve("outside"); fs.mkdirSync(outside);
  const before = inventory(f.parent.root);
  for (const action of [() => f.git.run(outside, ["init"]), () => f.git.run(f.root, ["clone", outside, path.join(f.root, "new")]),
    () => f.git.run(f.root, ["clone", repo, path.join(outside, "new")]), () => f.git.run(repo, ["fetch", outside, "main"]),
    () => f.git.run(repo, ["worktree", "add", "-b", "outside", path.join(outside, "new")])]) {
    assert.throws(action, /escapes/); assert.deepEqual(inventory(f.parent.root), before);
  }
});

test("Git does not discover an ancestor repository for an uninitialized fixture child", t => {
  const f = fixture(t), repo = repository(f), child = path.join(repo, "uninitialized"); fs.mkdirSync(child);
  assert.throws(() => f.git.run(child, ["add", "."]), /ancestor discovery is forbidden/);
});

test("root and gitdir pointer substitution fail before a native mutation", t => {
  const f = fixture(t), repo = repository(f), other = repository(f, "other");
  fs.renameSync(path.join(repo, ".git"), path.join(repo, ".git-original"));
  fs.writeFileSync(path.join(repo, ".git"), `gitdir: ${path.join(other, ".git")}\n`);
  const before = inventory(f.root);
  assert.throws(() => f.git.run(repo, ["add", "."]), /identity changed/);
  assert.deepEqual(inventory(f.root), before);
});

test("foreign gitdir/commondir and symlinked Git metadata are rejected before effects", t => {
  const f = fixture(t), repo = repository(f), outside = f.parent.resolve("outside"); fs.mkdirSync(outside);
  fs.writeFileSync(path.join(repo, ".git/commondir"), outside);
  assert.throws(() => f.git.run(repo, ["status"]), /escapes/);
  fs.unlinkSync(path.join(repo, ".git/commondir"));
  fs.renameSync(path.join(repo, ".git/objects"), path.join(repo, ".git/objects-original"));
  fs.symlinkSync(outside, path.join(repo, ".git/objects"), "dir");
  const before = inventory(outside);
  assert.throws(() => f.git.run(repo, ["add", "."]), /linked or special/);
  assert.deepEqual(inventory(outside), before);
});

test("executable filters, merge drivers, includes and URL rewrites refuse before execution", t => {
  for (const config of ['[filter "trap"]\n clean = malicious\n', '[merge "trap"]\n driver = malicious\n',
    '[include]\n path = /unowned/config\n', '[url "/unowned/"]\n insteadOf = local\n', '[remote "origin"]\n uploadpack = malicious\n']) {
    const f = fixture(t), repo = repository(f); fs.appendFileSync(path.join(repo, ".git/config"), "\n" + config);
    const before = inventory(f.root); assert.throws(() => f.git.run(repo, ["add", "."]), /policy is unsupported/); assert.deepEqual(inventory(f.root), before);
  }
});

test("authority flags, config file writes and remote protocols are rejected without effects", t => {
  const f = fixture(t), repo = repository(f), before = inventory(f.root);
  for (const args of [["-C", "/", "status"], ["config", "--global", "user.name", "bad"], ["config", "--file", "/unowned", "x.y", "bad"],
    ["commit", "--output=/unowned"], ["fetch", "https://example.invalid/repo", "main"], ["fetch", "origin"],
    ["clone", "ext::malicious", path.join(f.root, "new")], ["push", "origin", "main"]]) {
    assert.throws(() => f.git.run(repo, args)); assert.deepEqual(inventory(f.root), before);
  }
});

test("ownership changes invalidate a previously accepted fixture root", t => {
  const f = fixture(t); fs.renameSync(f.root, f.root + "-original"); fs.mkdirSync(f.root);
  assert.throws(() => f.git.run(f.root, ["init"]), /ownership changed/);
  assert.equal(fs.existsSync(path.join(f.root, ".git")), false);
});

test("hard-linked mutable Git metadata refuses without modifying an outside inode", t => {
  const f = fixture(t), repo = repository(f), outside = f.parent.resolve("outside-reflog");
  const reflog = path.join(repo, ".git/logs/HEAD");
  fs.copyFileSync(reflog, outside); fs.unlinkSync(reflog); fs.linkSync(outside, reflog);
  const before = inventory(f.parent.root);
  assert.throws(() => f.git.run(repo, ["commit", "--allow-empty", "-qm", "must refuse"]), /hard.link|independent/);
  assert.deepEqual(inventory(f.parent.root), before);
});

test("native local clone may share immutable objects but not mutable metadata", t => {
  const f = fixture(t), repo = repository(f), clone = path.join(f.root, "local-clone");
  ok(f.git, f.root, ["clone", repo, clone]);
  const objects = path.join(repo, ".git/objects");
  const directory = fs.readdirSync(objects).find(name => /^[a-f0-9]{2}$/.test(name));
  const file = path.join(objects, directory, fs.readdirSync(path.join(objects, directory))[0]);
  assert.ok(fs.statSync(file).nlink > 1, "control must exercise native Git hard-linked object delivery");
  const original = inventory(path.join(repo, ".git"));
  ok(f.git, clone, ["commit", "--allow-empty", "-qm", "independent clone metadata"]);
  assert.deepEqual(inventory(path.join(repo, ".git")), original);
});

test("fixture identity settings are respected by later native commits", t => {
  const f = fixture(t), repo = repository(f);
  ok(f.git, repo, ["config", "user.name", "Fixture Developer"]);
  ok(f.git, repo, ["config", "user.email", "developer@example.invalid"]);
  ok(f.git, repo, ["commit", "--allow-empty", "-qm", "explicit identity"]);
  assert.equal(ok(f.git, repo, ["log", "-1", "--format=%an <%ae>"]), "Fixture Developer <developer@example.invalid>");
});

test("explicit editor signing diff-helper and recursive options refuse before mutation", t => {
  const f = fixture(t), repo = repository(f), before = inventory(f.root);
  for (const args of [["commit", "--allow-empty", "--edit", "-m", "bad"], ["commit", "--allow-empty", "-qe", "-m", "bad"],
    ["commit", "--allow-empty", "--gpg-sign", "-m", "bad"], ["commit", "--allow-empty", "-S", "-m", "bad"],
    ["log", "--show-signature"], ["diff", "--ext-diff"], ["show", "--textconv", "HEAD:file.txt"],
    ["checkout", "--recurse-submodules", "main"], ["merge", "--strategy=untrusted", "main"]]) {
    assert.throws(() => f.git.run(repo, args), /unsupported|forbidden|noninteractive/);
    assert.deepEqual(inventory(f.root), before);
  }
});

test("inherited and configured editors cannot execute during a message-free commit", t => {
  const f = fixture(t), repo = repository(f), marker = f.parent.resolve("editor-ran"), editor = f.parent.resolve("editor.cjs");
  fs.writeFileSync(editor, `#!${process.execPath}\nrequire('node:fs').writeFileSync(${JSON.stringify(marker)},'unexpected editor');\n`, {mode:0o700});
  fs.appendFileSync(path.join(repo, ".git/config"), `\n[core]\n editor = ${JSON.stringify(editor)}\n`);
  const git = acceptOwnedGitFixture(f.root, {...process.env, EDITOR: editor, VISUAL: editor});
  assert.throws(() => git.run(repo, ["commit", "--allow-empty"]), /unsupported|forbidden|noninteractive/);
  assert.equal(fs.existsSync(marker), false);
});

test("ambient submodule recursion cannot reach an unadmitted nested Git directory", t => {
  const f = fixture(t), repo = repository(f), outside = f.parent.resolve("outside-module"); fs.mkdirSync(outside);
  const other = acceptOwnedGitFixture(outside);
  ok(other, outside, ["init", "-b", "main", "--separate-git-dir", path.join(outside, "nested")]);
  fs.writeFileSync(path.join(outside, "file.txt"), "one\n");
  ok(other, outside, ["add", "file.txt"]); ok(other, outside, ["commit", "-qm", "one"]);
  const first = ok(other, outside, ["rev-parse", "HEAD"]);
  fs.writeFileSync(path.join(outside, "file.txt"), "two\n");
  ok(other, outside, ["add", "file.txt"]); ok(other, outside, ["commit", "-qm", "two"]);
  const second = ok(other, outside, ["rev-parse", "HEAD"]);
  fs.writeFileSync(path.join(repo, ".gitmodules"), `[submodule "nested"]\n path = nested\n url = ${outside}\n`);
  ok(f.git, repo, ["add", ".gitmodules"]);
  ok(f.git, repo, ["update-index", "--add", "--cacheinfo", `160000,${first},nested`]);
  ok(f.git, repo, ["commit", "-qm", "first gitlink"]);
  ok(f.git, repo, ["branch", "first-gitlink"]);
  ok(f.git, repo, ["update-index", "--add", "--cacheinfo", `160000,${second},nested`]);
  ok(f.git, repo, ["commit", "-qm", "second gitlink"]);
  const nested = path.join(repo, "nested"); fs.mkdirSync(nested);
  fs.writeFileSync(path.join(nested, ".git"), `gitdir: ${path.join(outside, "nested")}\n`);
  fs.writeFileSync(path.join(nested, "file.txt"), "two\n");
  fs.appendFileSync(path.join(repo, ".git/config"), `\n[submodule]\n recurse = true\n[submodule "nested"]\n active = true\n url = ${outside}\n[fetch]\n recurseSubmodules = true\n`);
  const before = inventory(outside);
  ok(f.git, repo, ["checkout", "-f", "first-gitlink"]);
  assert.deepEqual(inventory(outside), before, "top-level fixture checkout cannot mutate an unadmitted submodule Git directory");
});

for (const timeoutOwner of ["inner", "outer"]) test(`${timeoutOwner} timeouts kill nested Git descendant writers before owned cleanup`, async t => {
  const f = fixture(t), repo = repository(f), marker = f.parent.resolve("late-git-descendant");
  const source = `
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const native=cp.spawnSync;
const descendant=${JSON.stringify(`setTimeout(()=>require('node:fs').writeFileSync(${JSON.stringify(marker)},'late'),350)`)};
const simulatedGit="require('node:child_process').spawn(process.execPath,['-e',"+JSON.stringify(descendant)+"],{stdio:'ignore'});setInterval(()=>{},1000)";
cp.spawnSync=function(command,args,options){
 if(command==='git'&&args.includes('status'))return native(process.execPath,['-e',simulatedGit],{...options,timeout:${timeoutOwner === "inner" ? 150 : 60000}});
 return native(command,args,options);
};
const {acceptOwnedGitFixture}=require(${JSON.stringify(path.resolve(import.meta.dirname, "../scripts/qualification-git.js"))});
const git=acceptOwnedGitFixture(${JSON.stringify(f.root)});
git.run(${JSON.stringify(repo)},['status']);
`;
  assert.throws(() => f.parent.runNode(["-e", source], {timeout:timeoutOwner === "inner" ? 3000 : 250}), /fixture process failed/);
  try { f.git.assertQuiescent(); } catch (error) { assert.match(error.message, /process group .* has not exited/); }
  await new Promise(resolve => setTimeout(resolve, 550));
  assert.equal(fs.existsSync(marker), false, "nested Git descendant wrote after timeout");
  f.git.assertQuiescent();
});

test("inactive worktree config does not override native repository identity", t => {
  const f = fixture(t), repo = repository(f);
  ok(f.git, repo, ["config", "user.name", "Active Developer"]);
  fs.writeFileSync(path.join(repo, ".git/config.worktree"), '[user]\n name = Inactive Developer\n');
  ok(f.git, repo, ["commit", "--allow-empty", "-qm", "inactive worktree config"]);
  assert.equal(ok(f.git, repo, ["log", "-1", "--format=%an"]), "Active Developer");
  fs.appendFileSync(path.join(repo, ".git/config"), '\n[extensions]\n worktreeConfig = true\n');
  ok(f.git, repo, ["commit", "--allow-empty", "-qm", "active worktree config"]);
  assert.equal(ok(f.git, repo, ["log", "-1", "--format=%an"]), "Inactive Developer");
  const config = path.join(repo, ".git/config"), bytes = fs.readFileSync(config, "utf8");
  for (const setting of ["worktreeConfig", "worktreeConfig = 2", "worktreeConfig = false"]) {
    fs.writeFileSync(config, bytes.replace("worktreeConfig = true", setting));
    ok(f.git, repo, ["commit", "--allow-empty", "-qm", setting]);
    assert.equal(ok(f.git, repo, ["log", "-1", "--format=%an"]), setting.endsWith("false") ? "Active Developer" : "Inactive Developer");
  }
});
