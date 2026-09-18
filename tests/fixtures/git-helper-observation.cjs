// CLI-only regression, also reusable with an independently installed package.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function inventory(root) {
  const result = {};
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      const relative = path.relative(root, file);
      if (stat.isSymbolicLink()) result[relative] = ["link", fs.readlinkSync(file)];
      else if (stat.isDirectory()) { result[relative] = ["directory", stat.mode]; walk(file); }
      else if (stat.isFile()) result[relative] = ["file", stat.mode,
        crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")];
      else throw new Error(`Unexpected fixture type: ${relative}`);
    }
  }
  walk(root);
  return result;
}

function qualifyGitHelperObservation({ cli, tempRoot, node = process.execPath,
  topology = "standalone", failureVariants = true }) {
  assert(path.isAbsolute(cli) && fs.statSync(cli).isFile());
  assert(path.isAbsolute(tempRoot) && fs.statSync(tempRoot).isDirectory());
  assert(["standalone", "worktree", "submodule", "gitdir", "nested"].includes(topology));
  const owned = fs.mkdtempSync(path.join(tempRoot, "git-helper-observation-"));
  const env = { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, LC_ALL: "C",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_TERMINAL_PROMPT: "0", TMPDIR: owned, TMP: owned, TEMP: owned };
  const run = (exe, args, cwd, extra = {}) => {
    const r = spawnSync(exe, args, { cwd, env: { ...env, ...extra }, encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024, timeout: 30000 });
    assert.equal(r.error, undefined, `${exe} ${args.join(" ")}: ${r.error}`);
    return r;
  };
  const git = (cwd, args) => {
    const r = run("git", ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
      "-c", "user.name=mdkg fixture", "-c", "user.email=fixture@example.invalid", ...args], cwd,
      { GIT_OPTIONAL_LOCKS: "0" });
    assert.equal(r.status, 0, `${args.join(" ")}\n${r.stderr}`);
    return r.stdout.trim();
  };
  const mdkg = (cwd, args, extra = {}) => run(node, [cli, ...args], cwd, extra);
  const ok = r => { assert.equal(r.status, 0, `${r.stdout}\n${r.stderr}`); return r; };
  const commit = cwd => { git(cwd, ["add", "--all"]); git(cwd, ["commit", "-q", "-m", "fixture"]); };
  const seed = (cwd, gitDir) => {
    fs.mkdirSync(cwd, { recursive: true });
    git(cwd, ["init", "-q", "-b", "main", ...(gitDir ? ["--separate-git-dir", gitDir] : [])]);
    ok(mdkg(cwd, ["init", "--graph-only"]));
    ok(mdkg(cwd, ["new", "task", "Observation fixture", "--status", "todo", "--json"]));
    fs.writeFileSync(path.join(cwd, "tracked.txt"), "tracked unchanged bytes\n");
    fs.writeFileSync(path.join(cwd, ".gitignore"), ".mdkg/index/\n.mdkg/pack/\n.mdkg/state/\n.mdkg/work/events/\n");
    commit(cwd);
  };
  const results = [], controls = [];
  try {
    let root = path.join(owned, "root"), repo = root;
    if (topology === "submodule") {
      const source = path.join(owned, "source"), parent = path.join(owned, "parent");
      seed(source); seed(parent);
      git(parent, ["-c", "protocol.file.allow=always", "submodule", "add", "-q", source, "child"]);
      commit(parent); root = repo = path.join(parent, "child");
    } else {
      seed(root, topology === "gitdir" ? path.join(owned, "metadata") : undefined);
      if (topology === "worktree") {
        const linked = path.join(owned, "linked");
        git(root, ["worktree", "add", "-q", "-b", "fixture-linked", linked]);
        root = repo = linked;
      } else if (topology === "nested") {
        root = path.join(repo, "nested"); fs.mkdirSync(root);
        fs.cpSync(path.join(repo, ".mdkg"), path.join(root, ".mdkg"), { recursive: true });
        commit(repo);
      }
    }
    ok(mdkg(root, ["index"]));
    const gitDir = git(repo, ["rev-parse", "--absolute-git-dir"]);
    const marker = path.join(owned, "helper-executed"), trap = path.join(owned, "forbidden-git-executed");
    const helper = path.join(owned, "helper.cjs"), bin = path.join(owned, "bin"); fs.mkdirSync(bin);
    const realGit = run(process.platform === "win32" ? "where" : "which", ["git"], owned).stdout.trim().split(/\r?\n/)[0];
    assert(path.isAbsolute(realGit));
    const output = path.join(owned, "result.zip");
    const commands = [["status"], ["fix", "plan"], ["validate", "--changed-only"],
      ["bundle", "create", "--profile", "private", "--output", output], ["git", "inspect"]];
    const task = fs.readdirSync(path.join(root, ".mdkg/work")).find(name => name.startsWith("task-1-"));
    assert(task);
    const nodePath = path.relative(repo, path.join(root, ".mdkg/work", task)).split(path.sep).join("/");
    const failures = {
      failed: "process.stderr.write('SENSITIVE_FIXTURE_DETAIL');process.exit(77);",
      truncated: "process.stdout.write(' M tracked.txt');",
      malformed: "process.stdout.write('bad record\\0');",
      rename: "process.stdout.write('R  renamed.txt\\0');",
      utf8: "process.stdout.write(Buffer.from([32,77,32,255,0]));",
      pair: "process.stdout.write('?M invalid\\0');",
      oversized: "process.stdout.write('x'.repeat(17*1024*1024));",
    };
    const modes = ["fsmonitor", "unused-clean", "unused-process", "active-clean", "active-process",
      "active-config-clean", "active-config-process", "unused-unspecified-clean", "unused-set-clean", "unused-unset-clean",
      "boolean-set-clean", "boolean-unset-clean", "active-set-clean", "active-unset-clean", "active-unspecified-clean",
      ...(failureVariants ? Object.keys(failures) : ["failed"])];
    for (const mode of modes) {
      fs.writeFileSync(path.join(bin, "git"), `#!${node}\nconst a=process.argv.slice(2),fs=require('fs');if(a.some(x=>['fetch','push','pull','clone','add','commit','checkout','merge','rebase','reset','clean','tag','credential'].includes(x))){fs.writeFileSync(${JSON.stringify(trap)},'forbidden');process.exit(89);}if(a.includes('status')&&${JSON.stringify(Boolean(failures[mode]))}){${failures[mode] || ""}}else{const r=require('child_process').spawnSync(${JSON.stringify(realGit)},a,{stdio:'inherit'});process.exit(r.status??1);}`, { mode: 0o755 });
      const callEnv = { PATH: bin + path.delimiter + env.PATH, GIT_OPTIONAL_LOCKS: "1" };
      if (mode.startsWith("active-config")) callEnv.GIT_CONFIG = "/dev/null";
      const driver = ["unspecified", "unset", "set"].find(value => mode.includes(`-${value}-`)) || "fixture";
      if (mode === "fsmonitor") {
        fs.writeFileSync(helper, `#!${node}\nrequire('fs').appendFileSync(${JSON.stringify(marker)},'called');process.stdout.write('fixture-token\\0');`, { mode: 0o755 });
        git(repo, ["config", "core.fsmonitor", helper]); git(repo, ["config", "core.fsmonitorHookVersion", "2"]);
      } else if (mode.includes("clean") || mode.includes("process")) {
        const kind = mode.endsWith("clean") ? "clean" : "process";
        fs.writeFileSync(helper, `require('fs').appendFileSync(${JSON.stringify(marker)},'called');process.stdin.pipe(process.stdout);`);
        git(repo, ["config", `filter.${driver}.${kind}`, `${JSON.stringify(node)} ${JSON.stringify(helper)}`]);
        if (mode.startsWith("active") || mode.startsWith("boolean")) {
          const attribute = mode.startsWith("boolean") ? (driver === "set" ? "filter" : "-filter") : `filter=${driver}`;
          fs.writeFileSync(path.join(repo, ".gitattributes"), `tracked.txt ${attribute}\n${nodePath} ${attribute}\n`);
        }
      }
      const future = new Date(Date.now() + 60000);
      for (const file of [path.join(repo, "tracked.txt"), path.join(root, ".mdkg/work", task)]) {
        if (fs.existsSync(file)) fs.utimesSync(file, future, future);
      }
      for (const command of commands) {
        const before = inventory(owned), args = [...command, "--json"];
        const r = mdkg(root, args, callEnv), expected = mode.startsWith("active") || failures[mode] ? 2 : 0;
        assert.equal(r.status, expected, `${topology}/${mode}/${command.join(" ")}\n${r.stdout}\n${r.stderr}`);
        assert.equal(fs.existsSync(marker), false, `${mode}: configured helper executed`);
        assert.equal(fs.existsSync(trap), false, "forbidden Git command executed");
        assert.doesNotMatch(r.stdout + r.stderr, /SENSITIVE_FIXTURE_DETAIL|helper\.cjs/);
        if (expected !== 0) assert.match(r.stderr, /Git.*(?:observation|content filter)/);
        if (command[0] === "bundle" && expected === 0) {
          assert(fs.statSync(output).size > 0); fs.unlinkSync(output);
        }
        assert.deepEqual(inventory(owned), before, `${topology}/${mode}/${command.join(" ")}: fixture changed`);
        results.push({ topology, mode, command: command.slice(0, 2), exit: r.status,
          helper_executed: false, inventory_preserved: true });
      }
      if (mode === "fsmonitor" || mode.startsWith("active")) {
        // Prove the fixture can reach the helper through ordinary native Git.
        run("git", ["status", "--porcelain"], repo, { GIT_OPTIONAL_LOCKS: "0" });
        assert(fs.existsSync(marker), `${topology}/${mode}: native helper positive control`);
        fs.unlinkSync(marker); controls.push({ topology, mode, native_helper_executed: true });
      }
      if (mode === "fsmonitor") git(repo, ["config", "--unset", "core.fsmonitor"]);
      if (mode.includes("clean") || mode.includes("process")) {
        git(repo, ["config", "--remove-section", `filter.${driver}`]);
        if (mode.startsWith("active") || mode.startsWith("boolean")) fs.unlinkSync(path.join(repo, ".gitattributes"));
      }
    }
    // The observer does not disable intentional graph mutations or staging truth.
    const beforeIndex = fs.readFileSync(path.join(gitDir, "index"));
    ok(mdkg(root, ["new", "task", "Legitimate mutation", "--json"]));
    assert.deepEqual(fs.readFileSync(path.join(gitDir, "index")), beforeIndex);
    const status = JSON.parse(ok(mdkg(root, ["status", "--json"])).stdout);
    assert.equal(status.git.dirty, true);
    controls.push({ topology, graph_mutation_supported: true, git_index_preserved: true });
    return { topology, cases: results, controls };
  } finally {
    fs.rmSync(owned, { recursive: true, force: true });
  }
}

function qualifyUpgradeGitObservation({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, "git-upgrade-observation-"));
  const env = { PATH: process.env.PATH, LC_ALL: "C", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_OPTIONAL_LOCKS: "1", TMPDIR: owned };
  const run = (exe, args, root) => spawnSync(exe, args, { cwd: root, env, encoding: "utf8", timeout: 30000 });
  const rows = [];
  try {
    // On macOS /usr/bin/git is an xcrun launcher. Initialize its isolated
    // TMPDIR cache before the complete measured inventory, as Git fixture init
    // already does in the other topologies; do not hide or exclude that file.
    assert.equal(run("git", ["--version"], owned).status, 0);
    for (const useGit of [false, true]) {
      const root = path.join(owned, useGit ? "git" : "non-git"); fs.mkdirSync(root);
      const init = run(node, [cli, "init"], root); assert.equal(init.status, 0, init.stderr);
      const marker = path.join(owned, "helper-executed"), helper = path.join(owned, "helper.cjs");
      if (useGit) {
        for (const args of [["init", "-q", "-b", "main"], ["add", "."], ["commit", "-q", "-m", "fixture"]]) {
          const r = run("git", ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null", "-c", "user.name=fixture",
            "-c", "user.email=fixture@example.invalid", ...args], root); assert.equal(r.status, 0, r.stderr);
        }
        fs.writeFileSync(helper, `#!${node}\nrequire('fs').appendFileSync(${JSON.stringify(marker)},'called');process.stdout.write('token\\0');`, { mode: 0o755 });
        for (const args of [["config", "core.fsmonitor", helper], ["config", "core.fsmonitorHookVersion", "2"]]) {
          const r = run("git", args, root); assert.equal(r.status, 0, r.stderr);
        }
      }
      const events = path.join(root, ".mdkg/work/events/events.jsonl"); assert(fs.existsSync(events)); fs.unlinkSync(events);
      const before = inventory(owned), r = run(node, [cli, "upgrade", "--json"], root);
      assert.equal(r.status, 0, r.stderr); assert.equal(JSON.parse(r.stdout).dry_run, true);
      assert.equal(fs.existsSync(marker), false); assert.equal(fs.existsSync(events), false);
      assert.deepEqual(inventory(owned), before);
      if (useGit) {
        run("git", ["check-ignore", "--quiet", "--", ".mdkg/work/events/events.jsonl"], root);
        assert(fs.existsSync(marker), "native check-ignore must prove the configured helper trigger"); fs.unlinkSync(marker);
      }
      rows.push({ git: useGit, helper_executed: false, inventory_preserved: true, deleted_history_not_restored: true });
    }
    return rows;
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}

function qualifyBundleGitProvenance({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, "git-bundle-provenance-"));
  const root = path.join(owned, "root"); fs.mkdirSync(root);
  const env = { PATH: process.env.PATH, LC_ALL: "C", TMPDIR: owned, GIT_OPTIONAL_LOCKS: "0",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null", GIT_TERMINAL_PROMPT: "0" };
  const run = (exe, args, cwd = root) => {
    const r = spawnSync(exe, args, { cwd, env, encoding: "utf8", timeout: 30000 });
    assert.equal(r.error, undefined, String(r.error)); return r;
  };
  const ok = r => { assert.equal(r.status, 0, r.stdout + r.stderr); return r; };
  const git = args => ok(run("git", ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
    "-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", ...args]));
  const mdkg = (args, cwd = root) => run(node, [cli, ...args, "--json"], cwd);
  const rows = [];
  try {
    ok(run("git", ["--version"])); ok(run(node, [cli, "init", "--graph-only"]));
    const plain = path.join(owned, "nongit.zip");
    const created = JSON.parse(ok(mdkg(["bundle", "create", "--output", plain])).stdout);
    assert.equal(created.source.git_head, null); assert.equal(JSON.parse(ok(mdkg(["bundle", "verify", plain])).stdout).ok, true);
    rows.push({ case: "native-nongit-bundle", verified: true });
    git(["init", "-q", "-b", "main"]);
    fs.writeFileSync(path.join(root, ".gitignore"), ".mdkg/index/\n.mdkg/pack/\n.mdkg/state/\n.mdkg/work/events/\n");
    const literal = path.join(root, ".mdkg\\bundles\\sentinel"); fs.writeFileSync(literal, "before\n");
    const realBundlePath = path.join(root, ".mdkg/bundles/private/tracked.txt");
    fs.mkdirSync(path.dirname(realBundlePath), { recursive: true }); fs.writeFileSync(realBundlePath, "before\n");
    git(["add", "--all"]); git(["commit", "-q", "-m", "fixture"]);
    const bundle = path.join(owned, "committed.zip");
    const make = () => {
      const before = inventory(owned), r = JSON.parse(ok(mdkg(["bundle", "create", "--output", bundle])).stdout);
      fs.unlinkSync(bundle); assert.deepEqual(inventory(owned), before); return r;
    };
    fs.writeFileSync(realBundlePath, "after\n");
    assert.equal(make().source.dirty, false); rows.push({ case: "real-bundle-directory", excluded: true });
    fs.writeFileSync(literal, "after\n");
    assert.equal(make().source.dirty, true); rows.push({ case: "literal-backslash-path", dirty: true });
    ok(mdkg(["bundle", "create", "--output", bundle]));
    assert.equal(JSON.parse(ok(mdkg(["bundle", "verify", bundle])).stdout).ok, true);
    rows.push({ case: "recorded-committed-head", verified: true });
    git(["symbolic-ref", "HEAD", "refs/heads/unborn-fixture"]);
    const nongit = path.join(owned, "nongit"); fs.mkdirSync(nongit);
    fs.cpSync(path.join(root, ".mdkg"), path.join(nongit, ".mdkg"), { recursive: true });
    for (const [kind, cwd] of [["unborn", root], ["nongit-copy", nongit]]) {
      const before = inventory(owned), r = mdkg(["bundle", "verify", bundle], cwd);
      assert.equal(r.status, 2, r.stdout + r.stderr);
      const receipt = JSON.parse(r.stdout); assert.equal(receipt.ok, false);
      assert.equal(receipt.stale, true); assert(receipt.stale_paths.includes("git:HEAD"));
      assert.equal(JSON.parse(ok(mdkg(["bundle", "show", bundle], cwd)).stdout).action, "show");
      assert.deepEqual(inventory(owned), before); rows.push({ case: kind, stale: true, historical_inspection: true });
    }
    return rows;
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}

module.exports = { qualifyGitHelperObservation, qualifyUpgradeGitObservation, qualifyBundleGitProvenance, inventory };
