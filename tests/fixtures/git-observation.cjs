// Shared by the built-CLI regression and the installed-package release smoke.
// Only CLI subprocesses exercise mdkg: no source or dist implementation imports.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const hash = file => sha(fs.readFileSync(file));

function inventory(root) {
  const result = {};
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      const relative = path.relative(root, file).split(path.sep).join("/");
      if (stat.isSymbolicLink()) result[relative] = ["link", fs.readlinkSync(file)];
      else if (stat.isDirectory()) { result[relative] = ["directory", stat.mode]; walk(file); }
      else if (stat.isFile()) result[relative] = ["file", stat.mode, hash(file)];
      else throw new Error(`Unexpected fixture file type: ${relative}`);
    }
  }
  walk(root);
  return result;
}

function qualifyGitObservation({ cli, tempRoot, node = process.execPath, topologies = ["standalone", "worktrees", "submodule", "gitdir"] }) {
  assert(path.isAbsolute(cli) && fs.statSync(cli).isFile(), "CLI must be an existing absolute path");
  assert(path.isAbsolute(tempRoot) && fs.statSync(tempRoot).isDirectory(), "fixture parent must already exist");
  const owned = fs.mkdtempSync(path.join(tempRoot, "git-observation-"));
  // Do not inherit the caller's Git directory/index/config overrides. In
  // particular, target commands must not inherit an optional-lock workaround.
  const env = {
    PATH: process.env.PATH, SystemRoot: process.env.SystemRoot,
    TMPDIR: owned, TEMP: owned, TMP: owned, LC_ALL: "C",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_TERMINAL_PROMPT: "0",
  };
  const run = (command, args, cwd, additions = {}, expectedExit = 0) => {
    const r = spawnSync(command, args, { cwd, env: { ...env, ...additions }, encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024, timeout: 30000 });
    assert.equal(r.error, undefined, `${command} ${args.join(" ")}: ${r.error}`);
    assert.equal(r.status, expectedExit, `${command} ${args.join(" ")}\n${r.stdout}\n${r.stderr}`);
    return r.stdout.trim();
  };
  const gitArgs = ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null",
    "-c", "user.name=mdkg observation fixture", "-c", "user.email=fixture@example.invalid"];
  const git = (cwd, args, optional = "0") => run("git", [...gitArgs, ...args], cwd, { GIT_OPTIONAL_LOCKS: optional });
  const mdkg = (cwd, args, policy = "unset", expectedExit = 0) => run(node, [cli, ...args], cwd,
    policy === "unset" ? {} : { GIT_OPTIONAL_LOCKS: policy }, expectedExit);
  const commit = (cwd, message) => {
    git(cwd, ["add", "--all"]);
    git(cwd, ["commit", "--quiet", "-m", message]);
  };
  const seedGraph = (cwd, separateGitDir) => {
    fs.mkdirSync(cwd, { recursive: true });
    git(cwd, ["init", "--quiet", "-b", "main", ...(separateGitDir ? ["--separate-git-dir", separateGitDir] : [])]);
    mdkg(cwd, ["init", "--graph-only"]);
    mdkg(cwd, ["new", "task", "Observation fixture", "--status", "todo", "--json"]);
    fs.writeFileSync(path.join(cwd, "tracked.txt"), "unchanged content with stale index stat data\n");
    fs.writeFileSync(path.join(cwd, ".gitignore"), "projects/\n.mdkg/index/\n.mdkg/pack/\n.mdkg/state/\n.mdkg/work/events/\n.mdkg/db/runtime/\n.mdkg/bundles/private/all.mdkg.zip\n.mdkg/bundles/private/observation.mdkg.zip\n");
    commit(cwd, "initial fixture graph");
  };
  const indexState = repos => repos.map(repo => {
    const file = path.resolve(repo, git(repo, ["rev-parse", "--git-path", "index"]));
    return { checkout: path.relative(owned, repo), index: path.relative(owned, file),
      sha256: hash(file), staged_sha256: sha(git(repo, ["ls-files", "--stage", "-z"])) };
  });
  let tick = 0;
  const staleStat = repos => {
    // A future mtime differs from the index without changing file content.
    const time = new Date(Date.now() + 60000 + (++tick * 2000));
    for (const repo of repos) {
      fs.utimesSync(path.join(repo, "tracked.txt"), time, time);
      // Directly exercise changed-only validation's .mdkg pathspec as well.
      const task = fs.readdirSync(path.join(repo, ".mdkg/work")).find(name => name.startsWith("task-1-"));
      assert(task, "fixture task must exist");
      fs.utimesSync(path.join(repo, ".mdkg/work", task), time, time);
    }
  };
  const results = [], controls = [];
  try {
    for (const topology of topologies) {
      assert(["standalone", "worktrees", "submodule", "gitdir"].includes(topology));
      const base = path.join(owned, topology), root = path.join(base, "root");
      fs.mkdirSync(base);
      seedGraph(root, topology === "gitdir" ? path.join(base, "root-metadata") : undefined);
      const child = path.join(root, "projects/child");
      if (topology === "submodule") {
        const origin = path.join(base, "local-child-source");
        seedGraph(origin);
        // Local synthetic source only. No provider, network remote or host config.
        git(root, ["-c", "protocol.file.allow=always", "submodule", "add", "--force", origin, "projects/child"]);
      } else seedGraph(child);
      const bundleRel = ".mdkg/bundles/private/subgraphs/child.mdkg.zip";
      mdkg(child, ["bundle", "create", "--profile", "private", "--output", path.join(root, bundleRel), "--json"]);
      mdkg(root, ["subgraph", "add", "child", bundleRel, "--source-path", "projects/child", "--json"]);
      commit(root, "register child graph snapshot");
      const targets = [root], repos = [root, child];
      if (topology === "worktrees") {
        for (const name of ["left", "right"]) {
          const worktree = path.join(base, name);
          git(root, ["worktree", "add", "--quiet", "-b", `fixture-${name}`, worktree]);
          const worktreeChild = path.join(worktree, "projects/child");
          fs.mkdirSync(path.dirname(worktreeChild), { recursive: true });
          fs.cpSync(child, worktreeChild, { recursive: true, force: false, errorOnExist: true });
          targets.push(worktree); repos.push(worktree, worktreeChild);
        }
        const rootCommon = path.resolve(root, git(root, ["rev-parse", "--git-common-dir"]));
        for (const target of targets.slice(1)) {
          assert.equal(path.resolve(target, git(target, ["rev-parse", "--git-common-dir"])), rootCommon);
        }
        assert.equal(new Set(indexState(targets).map(x => x.index)).size, 3, "linked checkout indexes must be distinct");
      }
      if (topology === "submodule") assert(fs.statSync(path.join(child, ".git")).isFile());
      if (topology === "gitdir") assert(fs.statSync(path.join(root, ".git")).isFile());

      // The native Git positive control proves that each index can actually
      // refresh on this filesystem; a vacuous stale-stat setup is not a pass.
      staleStat(repos);
      const beforeControl = indexState(repos);
      for (const repo of repos) git(repo, ["status", "--porcelain=v1"], "1");
      const afterControl = indexState(repos);
      for (let n = 0; n < repos.length; n++) {
        assert.notEqual(beforeControl[n].sha256, afterControl[n].sha256, `native refresh control: ${repos[n]}`);
        assert.equal(beforeControl[n].staged_sha256, afterControl[n].staged_sha256);
      }
      controls.push({ topology, native_refresh_observed: true, checkouts: repos.length });

      for (const dirtiness of ["clean", "staged-and-unstaged"]) {
        if (dirtiness !== "clean") for (const repo of repos) {
          fs.writeFileSync(path.join(repo, "staged.txt"), "staged\n");
          git(repo, ["add", "--", "staged.txt"]);
          fs.appendFileSync(path.join(repo, "staged.txt"), "unstaged\n");
          fs.writeFileSync(path.join(repo, "unknown.txt"), "unknown file must survive\n");
        }
        for (const target of targets) for (const policy of ["unset", "1"]) {
          const commands = [
            ["status"], ["show", "root:task-1"], ["validate"], ["validate", "--changed-only"],
            ["subgraph", "list"], ["subgraph", "show", "child"], ["subgraph", "audit"],
            ["subgraph", "verify", "child"], ["subgraph", "upgrade-plan"],
            ["subgraph", "sync", "child", "--dry-run", "--allow-dirty"], ["git", "inspect"],
            ["bundle", "create", "--profile", "private", "--output", ".mdkg/bundles/private/observation.mdkg.zip"],
          ];
          for (const args of commands) {
            staleStat(repos);
            const beforeIndexes = indexState(repos), before = inventory(base);
            const dirty = dirtiness !== "clean";
            const cachePresent = fs.existsSync(path.join(target, ".mdkg/index/global.json"));
            const expectedExit = dirty && args[0] === "subgraph" && ["verify", "upgrade-plan"].includes(args[1]) ? 2 : 0;
            const stdout = mdkg(target, [...args, "--json"], policy, expectedExit);
            const receipt = JSON.parse(stdout);
            // Assert meaningful execution, not just parseable JSON or a tolerated failure.
            if (args[0] === "status") {
              assert.equal(receipt.git.inside, true);
              assert.equal(receipt.git.dirty, dirty);
              assert.equal(receipt.graph.ok, cachePresent);
              assert.equal(receipt.graph.error_count, cachePresent ? 0 : 1);
              if (!cachePresent) {
                assert.equal(receipt.graph.node_count, null);
                assert(receipt.summary.errors.some(message => message === "graph: index missing and auto-reindex is disabled"), JSON.stringify(receipt.summary));
              }
            } else if (args[0] === "show") {
              assert.equal(receipt.command, "show");
              assert.equal(receipt.item.qid, "root:task-1");
              assert.equal(receipt.item.status, "todo");
            } else if (args[0] === "validate") {
              assert.equal(receipt.ok, true);
              assert.deepEqual(receipt.errors, []);
            } else if (args[0] === "git") {
              assert.equal(receipt.status.clean, !dirty);
              assert.match(receipt.accepted_revision.commit_sha, /^[a-f0-9]{40}$/);
            } else if (args[0] === "bundle") {
              assert.equal(receipt.action, "created");
              assert.equal(receipt.path, ".mdkg/bundles/private/observation.mdkg.zip");
              assert.equal(receipt.source.dirty, dirty);
              assert.match(receipt.zip_sha256, /^sha256:[a-f0-9]{64}$/);
            } else if (args[1] === "show") {
              assert.equal(receipt.action, "show");
              assert.equal(receipt.subgraph.alias, "child");
              assert.equal(receipt.subgraph.error_count, 0);
              assert.equal(receipt.subgraph.stale, dirty);
            } else {
              const action = { list: "list", audit: "audited", verify: "verified", "upgrade-plan": "upgrade_plan", sync: "sync_dry_run" }[args[1]];
              assert.equal(receipt.action, action);
              assert.equal(receipt.count, 1);
              assert.equal(receipt.subgraphs[0].alias, "child");
              if (["list", "verify"].includes(args[1])) {
                assert.equal(receipt.subgraphs[0].error_count, 0);
                assert.equal(receipt.subgraphs[0].stale, dirty);
              }
              if (args[1] !== "list") assert.equal(receipt.ok, expectedExit === 0);
              if (args[1] === "audit") assert.equal(receipt.subgraphs[0].dirty_tracked, dirty);
              if (args[1] === "upgrade-plan") {
                assert.equal(receipt.apply_supported, false);
                assert.equal(receipt.blockers.length > 0, dirty);
                if (dirty) assert(receipt.blockers.every(text => text.includes("dirty tracked changes")));
              }
              if (args[1] === "sync") {
                assert.deepEqual(receipt.updated, []);
                assert.deepEqual(receipt.skipped, ["child"]);
                assert.deepEqual(receipt.errors, []);
                assert.match(receipt.subgraphs[0].sources[0].new_zip_sha256, /^sha256:[a-f0-9]{64}$/);
              }
            }
            const afterIndexes = indexState(repos), after = inventory(base);
            assert.deepEqual(afterIndexes, beforeIndexes, `${topology}/${dirtiness}/${policy}: ${args.join(" ")} index custody`);
            if (args[0] === "bundle") {
              const output = path.relative(base, path.join(target, ".mdkg/bundles/private/observation.mdkg.zip")).split(path.sep).join("/");
              assert(after[output], "explicit bundle output must exist");
              delete before[output]; delete after[output];
            }
            const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
              .filter(file => JSON.stringify(before[file]) !== JSON.stringify(after[file])).sort();
            assert.deepEqual(changed, [], `${topology}/${dirtiness}/${policy}: ${args.join(" ")} full path/mode/content bookend`);
            results.push({ topology, checkout: path.relative(base, target), dirtiness, caller_optional_locks: policy,
              command: args, cache_present: cachePresent, expected_exit: expectedExit, typed_outcome_verified: true, indexes: beforeIndexes, stdout_sha256: sha(stdout),
              exact_indexes_preserved: true, staged_entries_preserved: true, filesystem_bookend_preserved: true,
              allowed_output: args[0] === "bundle" ? ".mdkg/bundles/private/observation.mdkg.zip" : null });
          }
        }
      }
      // Suppression belongs only to Git observation; normal mdkg mutations must
      // still work without staging graph files as a side effect.
      const beforeMutation = indexState(repos), nodeBefore = mdkg(root, ["show", "root:task-1", "--json"]);
      mdkg(root, ["task", "start", "root:task-1", "--json"], "1");
      const nodeAfter = mdkg(root, ["show", "root:task-1", "--json"]);
      assert.equal(JSON.parse(nodeBefore).item.status, "todo");
      assert.equal(JSON.parse(nodeAfter).item.status, "progress");
      assert.deepEqual(indexState(repos), beforeMutation);
      controls[controls.length - 1].intentional_graph_mutation_preserves_git_index = true;

      const previewArgs = [cli, "subgraph", "sync", "child", "--dry-run", "--allow-dirty", "--json"];
      const trap = path.join(base, "write-trap.cjs");
      fs.writeFileSync(trap, `const fs=require('node:fs'),path=require('node:path');
const owned=${JSON.stringify(path.join(root, ".mdkg"))};
for(const name of ['mkdirSync','rmSync','unlinkSync','renameSync','writeFileSync','appendFileSync','chmodSync','openSync']){
 const original=fs[name];fs[name]=function(...args){
  const file=typeof args[0]==='string'?path.resolve(args[0]):'';
  const flags=args[1],write=name!=='openSync'||(typeof flags==='string'?/[wa+]/.test(flags):(flags&(fs.constants.O_WRONLY|fs.constants.O_RDWR|fs.constants.O_CREAT|fs.constants.O_TRUNC|fs.constants.O_APPEND))!==0);
  if(write&&(file===owned||file.startsWith(owned+path.sep)))throw new Error('MDKG_FIXTURE_WRITE_ATTEMPT '+name+' '+path.relative(owned,file));
  return Reflect.apply(original,this,args);
 };
}
`);
      const trapEnv = { NODE_OPTIONS: `--require=${trap}`, GIT_OPTIONAL_LOCKS: "1" };
      const trapBefore = inventory(base);
      const preview = JSON.parse(run(node, previewArgs, root, trapEnv));
      assert.equal(preview.action, "sync_dry_run");
      assert.equal(preview.ok, true);
      const apply = spawnSync(node, [cli, "subgraph", "sync", "child", "--allow-dirty", "--json"],
        { cwd: root, env: { ...env, ...trapEnv }, encoding: "utf8", timeout: 30000 });
      assert.equal(apply.error, undefined);
      assert.notEqual(apply.status, 0, "real sync must still attempt mutation locking");
      assert.match(apply.stderr, /MDKG_FIXTURE_WRITE_ATTEMPT mkdirSync index\n/);
      assert.deepEqual(inventory(base), trapBefore, "preview and trapped real sync must preserve the fixture");

      const configFile = path.join(root, ".mdkg/config.json"), config = JSON.parse(fs.readFileSync(configFile, "utf8"));
      const normalLockTimeout = config.index.lock_timeout_ms;
      config.index.lock_timeout_ms = 1;
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + "\n");
      const lock = path.join(root, ".mdkg/index/write.lock");
      fs.mkdirSync(lock);
      fs.writeFileSync(path.join(lock, "owner.json"), JSON.stringify({ owner: "other-fixture-writer" }));
      const lockedBefore = inventory(base);
      assert.equal(JSON.parse(run(node, previewArgs, root, trapEnv)).ok, true, "preview must not acquire or clear another writer's lock");
      const busy = spawnSync(node, [cli, "subgraph", "sync", "child", "--allow-dirty", "--json"],
        { cwd: root, env, encoding: "utf8", timeout: 30000 });
      assert.equal(busy.error, undefined);
      assert.notEqual(busy.status, 0);
      assert.match(busy.stderr, /timed out waiting for mdkg mutation lock/);
      assert.deepEqual(inventory(base), lockedBefore);
      fs.rmSync(lock, { recursive: true });
      config.index.lock_timeout_ms = normalLockTimeout;
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + "\n");

      const manifest = path.join(root, ".mdkg/graph.json");
      assert.equal(fs.existsSync(manifest), false);
      fs.writeFileSync(manifest, JSON.stringify({ format: "mdkg-graph", format_version: 999 }));
      const unsupportedBefore = inventory(base);
      const unsupported = spawnSync(node, previewArgs, { cwd: root, env: { ...env, ...trapEnv }, encoding: "utf8", timeout: 30000 });
      assert.equal(unsupported.error, undefined);
      assert.notEqual(unsupported.status, 0);
      assert.match(unsupported.stderr, /unsupported graph format\/version/);
      assert.doesNotMatch(unsupported.stderr, /MDKG_FIXTURE_WRITE_ATTEMPT/);
      assert.deepEqual(inventory(base), unsupportedBefore);
      fs.unlinkSync(manifest);

      const missingOutput = ".mdkg/bundles/private/missing-preview/nested/child.mdkg.zip";
      config.subgraphs.child.sources[0].path = missingOutput;
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + "\n");
      assert.equal(fs.existsSync(path.dirname(path.join(root, missingOutput))), false);
      const missingBefore = inventory(base);
      const missingPreview = JSON.parse(run(node, previewArgs, root, trapEnv));
      assert.equal(missingPreview.ok, true);
      assert.match(missingPreview.subgraphs[0].sources[0].new_zip_sha256, /^sha256:[a-f0-9]{64}$/);
      assert.deepEqual(inventory(base), missingBefore, "preview must not create missing output parents");
      const beforeSyncIndexes = indexState(repos);
      const applied = JSON.parse(mdkg(root, ["subgraph", "sync", "child", "--allow-dirty", "--json"], "1"));
      assert.equal(applied.action, "synced");
      assert.equal(applied.ok, true);
      assert.deepEqual(applied.updated, ["child"]);
      assert.equal(fs.existsSync(path.join(root, missingOutput)), true);
      assert.equal(fs.existsSync(lock), false);
      assert.deepEqual(indexState(repos), beforeSyncIndexes);
      Object.assign(controls[controls.length - 1], { preview_zero_mutation_attempts: true,
        real_sync_mutation_attempt_verified: true, competing_lock_preserved: true, unsupported_format_refused: true,
        missing_output_parent_preview_preserved: true, real_sync_creates_output_parents: true });
    }
    return { schema: "mdkg.git-observation-qualification.v1", node: run(node, ["--version"], owned),
      platform: process.platform, cli_sha256: hash(cli), git: git(owned, ["--version"]),
      topologies, cases: results.length, controls, results,
      scope: "persistent path/mode/content and Git index custody; not proof against transient helper execution or lock syscalls",
      external_actions: "none" };
  } finally {
    // owned is the exact mkdtemp result created by this invocation.
    fs.rmSync(owned, { recursive: true, force: true });
  }
}

module.exports = { qualifyGitObservation };
