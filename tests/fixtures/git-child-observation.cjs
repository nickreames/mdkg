const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { inventory } = require("./git-helper-observation.cjs");

function qualifyGitChildObservation({ cli, tempRoot, node = process.execPath, topology = "nested" }) {
  assert(["nested", "worktree", "submodule", "gitdir"].includes(topology));
  const owned = fs.mkdtempSync(path.join(tempRoot, "git-child-observation-"));
  const env = { PATH: process.env.PATH, LC_ALL: "C", TMPDIR: owned,
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null", GIT_TERMINAL_PROMPT: "0" };
  const run = (exe, args, cwd, extra = {}) => {
    const r = spawnSync(exe, args, { cwd, env: { ...env, ...extra }, encoding: "utf8",
      timeout: 30000, maxBuffer: 16 * 1024 * 1024 });
    assert.equal(r.error, undefined, String(r.error)); return r;
  };
  const ok = r => { assert.equal(r.status, 0, r.stdout + r.stderr); return r; };
  const git = (cwd, args) => ok(run("git", ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
    "-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], cwd,
    { GIT_OPTIONAL_LOCKS: "0" })).stdout.trim();
  const mdkg = (cwd, args, extra = {}) => run(node, [cli, ...args], cwd, extra);
  const commit = root => { git(root, ["add", "--all"]); git(root, ["commit", "-q", "-m", "fixture"]); };
  const seed = (root, gitDir) => {
    fs.mkdirSync(root, { recursive: true });
    git(root, ["init", "-q", "-b", "main", ...(gitDir ? ["--separate-git-dir", gitDir] : [])]);
    ok(mdkg(root, ["init", "--graph-only"]));
    ok(mdkg(root, ["new", "task", "Observation fixture", "--status", "todo", "--json"]));
    fs.writeFileSync(path.join(root, "tracked.txt"), "base\n");
    fs.writeFileSync(path.join(root, ".gitignore"), "projects/\n.mdkg/index/\n.mdkg/pack/\n.mdkg/state/\n.mdkg/work/events/\n");
    commit(root);
  };
  const cases = [];
  try {
    let root = path.join(owned, "root"); seed(root);
    let child = path.join(root, "projects/child");
    if (topology === "submodule") {
      const source = path.join(owned, "source"); seed(source);
      git(root, ["-c", "protocol.file.allow=always", "submodule", "add", "--force", "-q", source, "projects/child"]);
      commit(root);
    } else seed(child, topology === "gitdir" ? path.join(owned, "child-metadata") : undefined);
    ok(mdkg(child, ["new", "spec", "Child Capability", "--id", "agent.child-fixture", "--json"]));
    commit(child);
    const bundle = ".mdkg/bundles/private/child.mdkg.zip";
    ok(mdkg(child, ["bundle", "create", "--profile", "private", "--output", path.join(root, bundle), "--json"]));
    ok(mdkg(root, ["subgraph", "add", "child", bundle, "--source-path", "projects/child", "--json"]));
    commit(root);
    if (topology === "worktree") {
      const linked = path.join(owned, "linked");
      git(root, ["worktree", "add", "-q", "-b", "fixture-linked", linked]);
      const linkedChild = path.join(linked, "projects/child"); fs.mkdirSync(path.dirname(linkedChild), { recursive: true });
      fs.cpSync(child, linkedChild, { recursive: true }); root = linked; child = linkedChild;
    }
    ok(mdkg(root, ["index"]));
    assert.equal(JSON.parse(ok(mdkg(root, ["subgraph", "list", "--json"])).stdout).subgraphs[0].stale, false);
    assert(JSON.parse(ok(mdkg(root, ["capability", "resolve", "Child Capability", "--fresh-only", "--json"])).stdout).count > 0);
    const marker = path.join(owned, "helper-executed"), helper = path.join(owned, "helper.cjs");
    const bin = path.join(owned, "bin"); fs.mkdirSync(bin);
    const realGit = ok(run("which", ["git"], owned)).stdout.trim();
    for (const mode of ["fsmonitor", "unused-clean", "active-clean", "active-process", "active-config-clean", "active-config-process", "failed", "truncated"]) {
      const failure = mode === "failed" ? "process.stderr.write('SENSITIVE_FIXTURE_DETAIL');process.exit(77);"
        : mode === "truncated" ? "process.stdout.write(' M tracked.txt');" : "";
      fs.writeFileSync(path.join(bin, "git"), `#!${node}\nconst a=process.argv.slice(2);if(process.cwd()===${JSON.stringify(child)}&&a.includes('status')&&${JSON.stringify(Boolean(failure))}){${failure}}else{const r=require('child_process').spawnSync(${JSON.stringify(realGit)},a,{stdio:'inherit'});process.exit(r.status??1);}`, { mode: 0o755 });
      if (mode === "fsmonitor") {
        fs.writeFileSync(helper, `#!${node}\nrequire('fs').appendFileSync(${JSON.stringify(marker)},'called');process.stdout.write('fixture-token\\0');`, { mode: 0o755 });
        git(child, ["config", "core.fsmonitor", helper]); git(child, ["config", "core.fsmonitorHookVersion", "2"]);
      } else if (mode.includes("clean") || mode.includes("process")) {
        const kind = mode.endsWith("clean") ? "clean" : "process";
        fs.writeFileSync(helper, `require('fs').appendFileSync(${JSON.stringify(marker)},'called');process.stdin.pipe(process.stdout);`);
        git(child, ["config", `filter.fixture.${kind}`, `${JSON.stringify(node)} ${JSON.stringify(helper)}`]);
        if (mode.startsWith("active")) fs.writeFileSync(path.join(child, ".gitattributes"), "tracked.txt filter=fixture\n");
      }
      const time = new Date(Date.now() + 60000); fs.utimesSync(path.join(child, "tracked.txt"), time, time);
      const callEnv = { PATH: bin + path.delimiter + env.PATH, GIT_OPTIONAL_LOCKS: "1" };
      if (mode.startsWith("active-config")) callEnv.GIT_CONFIG = "/dev/null";
      const stale = mode.startsWith("active") || Boolean(failure);
      const commands = [["show", "child:task-1"], ["validate"], ["subgraph", "list"],
        ["subgraph", "show", "child"], ["subgraph", "verify", "child"], ["subgraph", "audit", "child"],
        ["subgraph", "upgrade-plan", "child"], ["subgraph", "sync", "child", "--dry-run", "--allow-dirty"],
        ["capability", "resolve", "Child Capability", "--fresh-only"]];
      for (const command of commands) {
        const before = inventory(owned), r = mdkg(root, [...command, "--json"], callEnv);
        const refusal = stale && command[0] === "subgraph" && ["verify", "audit", "upgrade-plan", "sync"].includes(command[1]);
        assert.equal(r.status, refusal ? 2 : 0, `${topology}/${mode}/${command.join(" ")}\n${r.stdout}\n${r.stderr}`);
        assert.equal(fs.existsSync(marker), false, `${topology}/${mode}: helper executed`);
        assert.doesNotMatch(r.stdout + r.stderr, /SENSITIVE_FIXTURE_DETAIL|helper\.cjs/);
        if (stale && command[0] !== "capability") {
          assert.match(r.stdout + r.stderr, refusal ? /Git.*observation|freshness is unknown/ : /freshness is unknown/);
        }
        if (command[0] === "subgraph" && command[1] === "list") {
          const health = JSON.parse(r.stdout).subgraphs[0];
          assert.equal(health.stale, stale); assert.equal(health.error_count, 0);
        }
        if (command[0] === "capability") assert.equal(JSON.parse(r.stdout).count > 0, !stale);
        assert.deepEqual(inventory(owned), before, `${topology}/${mode}/${command.join(" ")}: fixture changed`);
        cases.push({ topology, mode, command: command.slice(0, 2), exit: r.status, stale,
          helper_executed: false, inventory_preserved: true });
      }
      if (mode === "fsmonitor") git(child, ["config", "--unset", "core.fsmonitor"]);
      if (mode.includes("clean") || mode.includes("process")) {
        git(child, ["config", "--remove-section", "filter.fixture"]);
        if (mode.startsWith("active")) fs.unlinkSync(path.join(child, ".gitattributes"));
      }
    }
    return { topology, cases };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}

module.exports = { qualifyGitChildObservation };
