import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { createOwnedFixture } = require("../scripts/qualification-fixture");
const { acceptOwnedGitFixture } = require("../scripts/qualification-git");
const { createSmokeCommands, runInstalledSmoke } = require("../scripts/qualification-smoke");
const { runFixtureNode } = require("../scripts/qualification-process");
const repo = path.resolve(import.meta.dirname, "..");
function owned(t) { const f = createOwnedFixture({ prefix: "smoke-commands-test-" }); t.after(() => f.cleanup()); return f; }
function snapshot(root) {
  const result = {};
  for (const entry of fs.readdirSync(root, { recursive: true, withFileTypes: true })) {
    const file = path.join(entry.parentPath, entry.name);
    if (entry.isFile()) result[path.relative(root, file)] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  }
  return result;
}

test("smoke Git ignores ambient repository/index/executable redirects and preserves a sentinel", t => {
  const parent = owned(t), sentinel = parent.resolve("sentinel"); fs.mkdirSync(sentinel);
  const g = acceptOwnedGitFixture(parent.root); assert.equal(g.run(sentinel, ["init", "-q"]).status, 0);
  fs.writeFileSync(path.join(sentinel, "sentinel.txt"), "sentinel\n");
  assert.equal(g.run(sentinel, ["add", "--", "sentinel.txt"]).status, 0);
  const before = snapshot(sentinel), fixture = createOwnedFixture({ base: parent.root, prefix: "run-" });
  const commands = createSmokeCommands(fixture, { ...process.env,
    GIT: parent.resolve("do-not-execute"), GIT_DIR: path.join(sentinel, ".git"), GIT_WORK_TREE: sentinel,
    GIT_INDEX_FILE: path.join(sentinel, ".git/index"), git_config_count: "1",
    GIT_CONFIG_KEY_0: "core.worktree", GIT_CONFIG_VALUE_0: sentinel,
    NPM_CONFIG_USERCONFIG: path.join(sentinel, "private.npmrc"), NPM_CONFIG_PREFIX: sentinel, NPM_CONFIG_CACHE: sentinel,
  });
  const target = fixture.resolve("repo"); fs.mkdirSync(target);
  commands.git(["init", "-q"], target); fs.writeFileSync(path.join(target, "authored.txt"), "new\n");
  commands.git(["add", "--", "authored.txt"], target); commands.git(["commit", "-m", "fixture positive control"], target);
  assert.equal(commands.git(["ls-files"], target).stdout.trim(), "authored.txt");
  assert.deepEqual(snapshot(sentinel), before);
  assert.equal(commands.environment.GIT, undefined); assert.equal(commands.environment.git_config_count, undefined);
  assert.equal(commands.environment.NPM_CONFIG_PREFIX, undefined);
  assert.equal(commands.environment.NPM_CONFIG_CACHE, fixture.resolve("npm-cache"));
  assert.equal(fs.statSync(fixture.resolve("user.npmrc")).mode & 0o777, 0o600);
  fixture.cleanup();
});

test("smoke Node uses the selected runtime, filters Git overrides and preserves expected refusal status", t => {
  const fixture = owned(t), commands = createSmokeCommands(fixture);
  const script = fixture.resolve("probe.cjs");
  fs.writeFileSync(script, 'console.log(JSON.stringify({runtime:process.execPath,git:process.env.GIT_DIR,supervised:globalThis[Symbol.for("mdkg.qualification.supervised-child")]}));process.exitCode=7;');
  const options = { allowFailure: true, env: { GIT_DIR: "/must-not-be-used" } };
  const result = commands.node(script, [], fixture.root, options);
  assert.equal(result.status, 7);
  assert.deepEqual(JSON.parse(result.stdout), { runtime: process.execPath, supervised: true });
  assert.throws(() => commands.node(script, [], fixture.root), /failed with 7/);
  assert.throws(() => commands.node(script, [], repo), /within its owned root/);
});

test("smoke npm JS entrypoints use private configuration and cannot restore ambient Git redirects", t => {
  const fixture = owned(t), script = fixture.resolve("npm.cjs");
  fs.writeFileSync(script, 'console.log(JSON.stringify({runtime:process.execPath,args:process.argv.slice(2),cache:process.env.npm_config_cache,user:process.env.npm_config_userconfig,global:process.env.npm_config_globalconfig,git:process.env.GIT_INDEX_FILE}));');
  const commands = createSmokeCommands(fixture, { ...process.env, npm_execpath: script,
    npm_config_prefix: repo, NPM_CONFIG_GLOBALCONFIG: repo, GIT_INDEX_FILE: "/must-not-be-used" });
  const result = commands.npm(["pack", "explicit-source"], { env: { GIT_INDEX_FILE: "bad", NPM_CONFIG_USERCONFIG: "bad", npm_config_userconfig: "bad" } });
  assert.deepEqual(JSON.parse(result.stdout), { runtime: process.execPath, args: ["pack", "explicit-source"],
    cache: fixture.resolve("npm-cache"), user: fixture.resolve("user.npmrc"), global: fixture.resolve("global.npmrc") });
});

test("smoke command controller retains explicit fault preloads and supervised refusal semantics", t => {
  const fixture = owned(t), commands = createSmokeCommands(fixture);
  const script = fixture.resolve("probe.cjs"), preload = fixture.resolve("fault.cjs");
  fs.writeFileSync(preload, 'globalThis.fixtureFault="loaded";');
  fs.writeFileSync(script, 'console.log(JSON.stringify({fault:globalThis.fixtureFault,supervised:globalThis[Symbol.for("mdkg.qualification.supervised-child")]}));process.exitCode=1;');
  const result = commands.node(script, [], fixture.root, { nodeArgs: ["--require", preload], allowFailure: true });
  assert.equal(result.status, 1);
  assert.deepEqual(JSON.parse(result.stdout), { fault: "loaded", supervised: true });
  assert.throws(() => commands.node(script, [], fixture.root, { nodeArgs: ["--require", preload] }), /failed with 1/);
  fs.writeFileSync(script, 'process.kill(process.pid,"SIGTERM");');
  assert.throws(() => commands.node(script, [], fixture.root, { allowFailure: true }), /terminated by SIGTERM/);
});

test("remaining synchronous callers and their transitive helpers use owned commands without bypasses", () => {
  for (const name of ["bundle", "archive-work", "command-matrix", "init", "spike", "work-invocation", "subgraph"]) {
    const source = fs.readFileSync(path.join(repo, "scripts", `smoke-${name}.js`), "utf8");
    assert.match(source, /runInstalledSmoke\(\{/);
    assert.match(source, /commands = ownedCommands/);
    assert.match(source, /commands\.node\(/);
    assert.match(source, /commands\.git\(/);
    assert.match(source, /commands\.npm\(\["pack", repoRoot,/);
    assert.match(source, /return \{ tarballPath, install\(\)/);
    assert.match(source, /"--foreground-scripts", "--offline"/);
    assert.doesNotMatch(source, /spawnSync|GIT_CMD|NPM_CMD|mdkg-npm-cache|fs\.mkdtempSync/);
    assert.match(source, /if \(require\.main === module\)/);
  }
  for (const file of ["scripts/installed-work-identity.js", "scripts/installed-generic-boundary.js", "tests/fixtures/transport-state.cjs"]) {
    const source = fs.readFileSync(path.join(repo, file), "utf8");
    assert.match(source, /commands\.node\(/);
    assert.doesNotMatch(source, /\bspawnSync\s*\(|process\.env\.GIT/);
  }
  const generic = fs.readFileSync(path.join(repo, "scripts/installed-generic-boundary.js"), "utf8");
  assert.match(generic, /nodeArgs, allowFailure: true/);
  assert.match(generic, /\["--require", preload\]/);
});

test("consumer smoke retains native offline package execution under artifact admission", () => {
  const source = fs.readFileSync(path.join(repo, "scripts/smoke-consumer.js"), "utf8");
  assert.match(source, /runInstalledSmoke\(\{/);
  assert.match(source, /commands\.git\(/);
  assert.match(source, /\["pack", repoRoot,/);
  assert.match(source, /return \{ tarballPath, install\(\)/);
  assert.match(source, /\["exec", "--yes", "--offline", "--package", tarballPath, "--", "mdkg",/);
  assert.doesNotMatch(source, /spawnSync|NPX_CMD|GIT_CMD|DEFAULT_NPM_CACHE|fs\.rmSync|fs\.mkdtempSync|"--global"/);
  const consumer = require("../scripts/smoke-consumer.js");
  assert.equal(typeof consumer.runSmoke, "function");
  assert.equal(consumer.extractVersion("notice\n0.6.0\n"), "0.6.0");
});

test("consumer catches artifact mutation after the first lazy execution before a later restoration", t => {
  const fixture = owned(t), sourcePath = path.join(repo, "scripts/smoke-consumer.js");
  const localRequire = createRequire(sourcePath), module = { exports: {} };
  let tarball, executions = 0;
  const shimRequire = name => name !== "./qualification-smoke" ? localRequire(name) : {
    runInstalledSmoke(options) {
      return runInstalledSmoke({ ...options, prepare(root, commands) {
        return options.prepare(root, { ...commands, npm(args) {
          if (args[0] === "pack") {
            tarball = path.join(args[args.indexOf("--pack-destination") + 1], "candidate.tgz");
            fs.writeFileSync(tarball, "candidate"); return { stdout: "candidate.tgz\n", status: 0 };
          }
          assert.equal(args[0], "exec"); executions++;
          if (executions === 1) { fs.writeFileSync(tarball, "changed!!"); return { stdout: "0.6.0\n", status: 0 }; }
          throw new Error("a later consumer could restore the candidate before final verification");
        } });
      } });
    },
  };
  localRequire("node:vm").runInNewContext(fs.readFileSync(sourcePath, "utf8"), {
    require: shimRequire, module, __dirname: path.dirname(sourcePath), process, console,
  });
  assert.throws(() => module.exports.runSmoke({ ...process.env, MDKG_SMOKE_TMPDIR: fixture.root }), /artifact hash or identity mismatch/);
  assert.equal(executions, 1, "changed bytes must stop execution before the next consumer");
  assert.deepEqual(fs.readdirSync(fixture.root), []);
});

test("Git boundary and shared observation fixtures preserve intentional probes under owned supervision", () => {
  const boundary = fs.readFileSync(path.join(repo, "scripts/smoke-git-boundary.js"), "utf8");
  assert.match(boundary, /runInstalledSmoke\(\{/);
  assert.match(boundary, /return \{ tarballPath: tarball, install\(\)/);
  assert.match(boundary, /runFixtureNode\(tempRoot/);
  assert.match(boundary, /\.\.\.commands\.environment, \.\.\.extraEnv/);
  assert.match(boundary, /beforeRefusals = inventory\(tempRoot\)/);
  assert.match(boundary, /assert\.deepEqual\(inventory\(tempRoot\), beforeRefusals/);
  assert.equal(typeof require("../scripts/smoke-git-boundary.js").runSmoke, "function");
  const observation = fs.readFileSync(path.join(repo, "tests/fixtures/git-observation.cjs"), "utf8");
  assert.match(observation, /createOwnedFixture\(\{ base: tempRoot/);
  assert.match(observation, /runFixtureProcess\(owned/);
  assert.match(observation, /fixtureGit\.refreshIndexForControl/);
  assert.match(observation, /finalizeFixture\(fixture, \{ error \}\)/);
  assert.doesNotMatch(observation, /spawnSync|fs\.mkdtempSync/);
});

test("MCP smoke runs its async server inside one owned worker and retains read parity cases", () => {
  const source = fs.readFileSync(path.join(repo, "scripts/smoke-mcp.js"), "utf8");
  assert.match(source, /runInstalledSmoke\(\{/);
  assert.match(source, /smokeCommands\.node\(__filename, \["--owned-worker"/);
  assert.match(source, /fixtureGit = acceptOwnedGitFixture\(ownedRoot, process\.env\)/);
  assert.match(source, /runFixtureNode\(ownedRoot/);
  assert.match(source, /spawn\(process\.execPath, \[binPath, "mcp", "serve"/);
  assert.match(source, /"SIGTERM"/);
  assert.match(source, /"SIGKILL"/);
  assert.match(source, /"read-only-cold"/);
  assert.match(source, /"same-graph-backend-parity"/);
  assert.doesNotMatch(source, /spawnSync|fs\.mkdtempSync|packAndInstall/);
  assert.equal(typeof require("../scripts/smoke-mcp.js").main, "function");
});

test("MCP worker refuses an installed CLI outside its admitted fixture before writing", t => {
  const fixture = owned(t), before = snapshot(fixture.root);
  const result = runFixtureNode(fixture.root, path.join(repo, "scripts/smoke-mcp.js"),
    ["--owned-worker", fixture.root, path.join(repo, "dist/cli.js")],
    { cwd: fixture.root, timeout: 10000, maxBuffer: 1024 * 1024 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /installed CLI must be inside the accepted fixture/);
  assert.deepEqual(snapshot(fixture.root), before);
});

test("MCP smoke rejects malformed output after its final successful response", async t => {
  const fixture = owned(t), serverFile = fixture.resolve("server.cjs");
  fs.writeFileSync(serverFile, `#!${process.execPath}\n` +
    'process.stdin.on("data", chunk => { const message=JSON.parse(chunk.toString().trim());' +
    'process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:message.id,result:{ok:true}})+"\\n"+"not-json\\n"); });' +
    'process.stdin.on("end",()=>process.exit(0));\n', { mode: 0o755 });
  const { startMcp } = require("../scripts/smoke-mcp.js");
  const server = startMcp(serverFile, fixture.root);
  const response = await server.request("initialize", {});
  assert.equal(response.result.ok, true);
  await assert.rejects(server.stop(), /Unexpected token|JSON/);
});

test("MCP smoke retains protocol and nonzero shutdown failures together", async t => {
  const fixture = owned(t), serverFile = fixture.resolve("server-failure.cjs");
  fs.writeFileSync(serverFile, `#!${process.execPath}\n` +
    'process.stdin.on("data", chunk => { const message=JSON.parse(chunk.toString().trim());' +
    'process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:message.id,result:{ok:true}})+"\\n"+"not-json\\n"); });' +
    'process.stdin.on("end",()=>{process.stderr.write("shutdown marker\\n");process.exit(17)});\n', { mode: 0o755 });
  const { startMcp, formatFailure } = require("../scripts/smoke-mcp.js");
  const server = startMcp(serverFile, fixture.root);
  assert.equal((await server.request("initialize", {})).result.ok, true);
  await assert.rejects(server.stop(), error => {
    assert.ok(error instanceof AggregateError);
    const detail = formatFailure(error);
    assert.match(detail, /Unexpected token|JSON/);
    assert.match(detail, /"code":17/);
    assert.match(detail, /shutdown marker/);
    return true;
  });
});

test("MCP smoke preserves both exercise and shutdown diagnostics", () => {
  const { formatFailure } = require("../scripts/smoke-mcp.js");
  const primary = new Error("primary MCP exercise failure");
  const shutdown = new Error("server shutdown failure");
  const result = formatFailure(new AggregateError([primary, shutdown], "both failed"));
  assert.match(result, /primary MCP exercise failure/);
  assert.match(result, /server shutdown failure/);
});

test("remaining release smokes bind their work to owned fixtures", () => {
  const capabilities = fs.readFileSync(path.join(repo, "scripts/smoke-capabilities.js"), "utf8");
  assert.match(capabilities, /createOwnedFixture\(\{/);
  assert.match(capabilities, /commands\.node\(/);
  assert.match(capabilities, /finalizeFixture\(fixture, \{ error \}\)/);
  assert.doesNotMatch(capabilities, /spawnSync|mkdtempSync/);

  const visibility = fs.readFileSync(path.join(repo, "scripts/smoke-visibility.js"), "utf8");
  assert.match(visibility, /runInstalledSmoke\(\{/);
  assert.match(visibility, /return \{ tarballPath, install\(\)/);
  assert.match(visibility, /commands\.node\(/);
  assert.doesNotMatch(visibility, /spawnSync|mkdtempSync|fs\.rmSync/);

  const parallel = fs.readFileSync(path.join(repo, "scripts/smoke-parallel.js"), "utf8");
  assert.match(parallel, /createOwnedFixture\(\{/);
  assert.match(parallel, /commands\.node\(__filename, \["--owned-worker"/);
  assert.match(parallel, /runFixtureNode\(ownedRoot/);
  assert.match(parallel, /finalizeFixture\(fixture, \{ error \}\)/);
  assert.match(parallel, /detached: false/);
  assert.doesNotMatch(parallel, /spawnSync|mkdtempSync/);
});

test("parallel smoke worker refuses direct and unowned entry before graph writes", t => {
  const fixture = owned(t), script = path.join(repo, "scripts/smoke-parallel.js");
  const before = snapshot(fixture.root);
  const direct = require("node:child_process").spawnSync(process.execPath,
    [script, "--owned-worker", fixture.root, "0".repeat(64)],
    { cwd: fixture.root, encoding: "utf8", timeout: 5000 });
  assert.equal(direct.status, 1);
  assert.match(direct.stderr, /requires its supervised owner/);
  assert.deepEqual(snapshot(fixture.root), before);
  const supervised = runFixtureNode(fixture.root, script,
    ["--owned-worker", fixture.root, "0".repeat(64)],
    { cwd: fixture.root, env: process.env, timeout: 5000 });
  assert.equal(supervised.status, 1);
  assert.match(supervised.stderr, /worker-admission\.json/);
  assert.deepEqual(snapshot(fixture.root), before);
});

test("actual installed-smoke entrypoint reports its underlying failure after owned cleanup", t => {
  const fixture = owned(t), npm = fixture.resolve("npm-failure.cjs");
  fs.writeFileSync(npm, 'console.error("synthetic packing refusal");process.exitCode=19;');
  // The entrypoint owns its child supervisors and finalization. An outer
  // instrumented supervisor would intentionally refuse its early cleanup.
  const result = require("node:child_process").spawnSync(process.execPath, [path.join(repo, "scripts/smoke-command-matrix.js")], {
    cwd: fixture.root, env: { ...process.env, npm_execpath: npm, MDKG_SMOKE_TMPDIR: fixture.root },
    encoding: "utf8", timeout: 15000, maxBuffer: 1024 * 1024,
  });
  assert.equal(result.error, undefined); assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /synthetic packing refusal/);
  assert.match(result.stderr, /"removed":true/);
  assert.deepEqual(fs.readdirSync(fixture.root), ["npm-failure.cjs"]);
});

test("imported init exercises require explicit owned commands before effects", t => {
  const fixture = owned(t), init = require("../scripts/smoke-init.js");
  const before = snapshot(fixture.root);
  assert.throws(() => init.exerciseBaseInit("unused", fixture.root), /requires explicit owned smoke commands/);
  assert.deepEqual(snapshot(fixture.root), before);
  assert.equal(typeof init.createInitExercises, "function");
});

test("imported init exercises accept factory and named-export owned controllers", t => {
  const fixture = owned(t), commands = createSmokeCommands(fixture), init = require("../scripts/smoke-init.js");
  const bin = fixture.resolve("synthetic-cli.cjs");
  fs.writeFileSync(bin, 'if(!globalThis[Symbol.for("mdkg.qualification.supervised-child")])throw Error("not supervised");' +
    'console.error("`mdkg init "+process.argv[3]+"` was removed; use `mdkg init` for compact agent setup (default); `mdkg init --graph-only` without agent setup");process.exitCode=1;');
  const factory = init.createInitExercises(commands);
  assert.equal(Object.isFrozen(factory), true);
  for (const mode of ["factory", "named"]) {
    const root = fixture.resolve(mode); fs.mkdirSync(root);
    if (mode === "factory") factory.exerciseRemovedFlags(bin, root);
    else init.exerciseRemovedFlags(bin, root, commands);
    for (const name of ["llm", "agents", "claude", "omni"]) {
      assert.ok(fs.statSync(path.join(root, `removed-${name}`, ".git")).isDirectory());
      assert.equal(fs.existsSync(path.join(root, `removed-${name}`, ".mdkg")), false);
    }
  }
  assert.throws(() => init.exerciseBaseInit(bin, fixture.root), /requires explicit owned smoke commands/);
  assert.equal(fs.existsSync(fixture.resolve("base-init")), false);
});

test("smoke command setup preserves existing configuration and refuses released custody", t => {
  const fixture = owned(t), config = fixture.resolve("user.npmrc"); fs.writeFileSync(config, "user bytes\n");
  assert.throws(() => createSmokeCommands(fixture), /EEXIST/);
  assert.equal(fs.readFileSync(config, "utf8"), "user bytes\n");
  fixture.cleanup(); assert.throws(() => createSmokeCommands(fixture), /released/);
});

test("both smoke entrypoints use owned command dispatch without raw Git or subprocess fallbacks", () => {
  for (const name of ["smoke-branch-conflicts", "smoke-upgrade"]) {
    const source = fs.readFileSync(path.join(repo, "scripts", name + ".js"), "utf8");
    assert.match(source, /commands = createSmokeCommands\(fixture\)/);
    assert.match(source, /commands\.git\(/); assert.match(source, /commands\.node\(/);
    assert.doesNotMatch(source, /spawnSync|GIT_CMD|process\.env\.GIT|mdkg-npm-cache/);
    assert.match(source, /finalizeFixture\(fixture/);
  }
});

test("branch fixture accepts a physical base and rejects an explicit symlink base", t => {
  const { createBranchFixture } = require("../scripts/smoke-branch-conflicts");
  const parent = owned(t), alias = parent.resolve("alias"); fs.symlinkSync(parent.root, alias, "dir");
  assert.throws(() => createBranchFixture({ MDKG_SMOKE_TMPDIR: alias }), /link|directory/);
  const fixture = createBranchFixture({ MDKG_SMOKE_TMPDIR: parent.root });
  assert.equal(path.dirname(fixture.root), parent.root); fixture.cleanup();
});

test("installed Node dispatch preserves fault preloads and ordinary refusals but rejects signals and timeouts", t => {
  const fixture = owned(t), bin = fixture.resolve("mdkg"), preload = fixture.resolve("fault.cjs");
  fs.writeFileSync(preload, 'globalThis.fixtureFault="loaded";');
  fs.writeFileSync(bin, '#!/not/the/selected/node\nconsole.log(JSON.stringify({runtime:process.execPath,fault:globalThis.fixtureFault,supervised:globalThis[Symbol.for("mdkg.qualification.supervised-child")]}));process.exitCode=3;');
  const r = runFixtureNode(fixture.root, bin, [], { nodeArgs: ["--require", preload] });
  assert.equal(r.status, 3);
  assert.deepEqual(JSON.parse(r.stdout), { runtime: process.execPath, fault: "loaded", supervised: true });
  fs.writeFileSync(bin, 'process.kill(process.pid,"SIGTERM");');
  assert.throws(() => runFixtureNode(fixture.root, bin, []), /terminated by SIGTERM/);
  fs.writeFileSync(bin, 'setInterval(()=>{},100);');
  assert.throws(() => runFixtureNode(fixture.root, bin, [], { timeout: 100 }), /ETIMEDOUT/);
});

test("all installed collaboration and recovery callers retain the supervised Node boundary", () => {
  for (const name of ["installed-identity-collaboration", "installed-graph-recovery", "installed-upgrade-recovery"]) {
    const source = fs.readFileSync(path.join(repo, "scripts", name + ".js"), "utf8");
    assert.match(source, /runFixtureNode\(ownedRoot,/); assert.doesNotMatch(source, /spawnSync/);
  }
});

test("six installed smoke callers preserve owned dispatch and offline installs", () => {
  for (const name of ["fix-plan", "loop", "handoff", "command-docs", "integration-ux", "operator-health"]) {
    const source = fs.readFileSync(path.join(repo, "scripts", `smoke-${name}.js`), "utf8");
    assert.match(source, /runInstalledSmoke\(\{/);
    assert.match(source, /commands = ownedCommands/);
    assert.match(source, /commands\.git\(/);
    assert.match(source, /commands\.node\(/);
    assert.match(source, /commands\.npm\(\["pack", repoRoot,/);
    assert.match(source, /"--foreground-scripts", "--offline"/);
    assert.doesNotMatch(source, /spawnSync|GIT_CMD|process\.env\.GIT|mdkg-npm-cache|fs\.mkdtempSync/);
    assert.match(source, /if \(require\.main === module\)/);
  }
});

test("DB/SQLite smoke callers retain installed helpers, guarded Git and exact ignore statuses", () => {
  for (const name of ["db", "db-events", "db-materializer", "db-queue", "db-queue-cli", "db-snapshot", "sqlite"]) {
    const source = fs.readFileSync(path.join(repo, "scripts", `smoke-${name}.js`), "utf8");
    assert.match(source, /runInstalledSmoke\(\{/);
    assert.match(source, /commands = ownedCommands/);
    assert.match(source, /commands\.node\(/);
    assert.match(source, /commands\.git\(/);
    assert.match(source, /commands\.npm\(\["pack", repoRoot,/);
    assert.match(source, /return \{ tarballPath, install\(\)/);
    assert.match(source, /"--foreground-scripts", "--offline"/);
    assert.doesNotMatch(source, /spawnSync|GIT_CMD|mdkg-npm-cache|fs\.mkdtempSync|\.\.\/dist\/|\.\.\/src\//);
    assert.doesNotMatch(source, /(?:\w+Ignored|ignored)\.status !== 0/);
    if (["db-events", "db-materializer", "db-queue"].includes(name)) {
      assert.match(source, /"node_modules", "mdkg"/);
      assert.match(source, /require\((?:helperPath|materializerPath)\)/);
    }
  }
});

test("graph workflow smoke callers use owned dispatch and defer installation until artifact admission", () => {
  for (const name of ["goal", "goal-lifecycle", "checkpoint-templates", "cli-ux-polish", "id-repair", "graph-clone", "warning-ux", "semantic-refs"]) {
    const source = fs.readFileSync(path.join(repo, "scripts", `smoke-${name}.js`), "utf8");
    assert.match(source, /runInstalledSmoke\(\{/);
    assert.match(source, /commands = ownedCommands/);
    assert.match(source, /commands\.node\(/);
    assert.match(source, /commands\.git\(/);
    assert.match(source, /commands\.npm\(\["pack", (?:repoRoot|packageRoot),/);
    assert.match(source, /return \{ tarballPath, install\(\)/);
    assert.match(source, /"--foreground-scripts", "--offline"/);
    assert.match(source, /if \(require\.main === module\)/);
    assert.doesNotMatch(source, /spawnSync|GIT_CMD|NPM_CMD|mdkg-npm-cache|fs\.mkdtempSync|process\.exit\(/);
    if (["goal", "goal-lifecycle", "checkpoint-templates", "semantic-refs"].includes(name)) {
      assert.match(source, /mdkg \$\{packageVersion\} installed\./);
    }
  }
});

test("installed smoke returns success only after artifact verification and cleanup", t => {
  const parent = owned(t); let root, commands;
  const result = runInstalledSmoke({ prefix: "installed-success-", env: { ...process.env, MDKG_SMOKE_TMPDIR: parent.root },
    prepare(directory, ownedCommands) {
      root = directory; commands = ownedCommands;
      const tarballPath = path.join(root, "synthetic.tgz"); fs.writeFileSync(tarballPath, "candidate");
      return { tarballPath, install: () => ({ tarballPath }) };
    },
    exercise(directory) {
      assert.equal(directory, root);
      commands.git(["init", "-q"], root);
      fs.writeFileSync(path.join(root, "authored.txt"), "fixture\n");
      commands.git(["add", "--", "authored.txt"], root);
      commands.git(["commit", "-m", "positive control"], root);
      return { ok: true, case: "synthetic fixture, not installed-package proof" };
    },
  });
  assert.equal(result.ok, true); assert.equal(result.cleanup.removed, true);
  assert.equal(fs.existsSync(root), false);
  assert.equal(result.tarball_sha256, crypto.createHash("sha256").update("candidate").digest("hex"));
});

test("installed smoke preserves primary and artifact failures and still checks cleanup", t => {
  const parent = owned(t); let root;
  assert.throws(() => runInstalledSmoke({ prefix: "installed-failure-", env: { ...process.env, MDKG_SMOKE_TMPDIR: parent.root },
    prepare(directory) { root = directory; const tarballPath = path.join(root, "synthetic.tgz"); fs.writeFileSync(tarballPath, "before"); return { tarballPath, install: () => ({ tarballPath }) }; },
    exercise(_directory, installed) { fs.writeFileSync(installed.tarballPath, "after!"); throw Error("original scenario failure"); },
  }), error => {
    assert.ok(error instanceof AggregateError);
    assert.match(error.message, /cleanup=\{"removed":true/);
    assert.ok(error.errors[0] instanceof AggregateError);
    assert.match(error.errors[0].message, /original scenario failure/);
    assert.match(error.errors[0].message, /artifact hash or identity mismatch/);
    return true;
  });
  assert.equal(fs.existsSync(root), false);
});

test("installed smoke cleans failed setup and refuses unsafe base or linked artifact", t => {
  const parent = owned(t); let root;
  const env = { ...process.env, MDKG_SMOKE_TMPDIR: parent.root };
  assert.throws(() => runInstalledSmoke({ prefix: "failed-setup-", env,
    prepare(directory) { root = directory; throw Error("packing failed"); }, exercise() { assert.fail("must not execute"); },
  }), /cleanup=\{"removed":true/);
  assert.equal(fs.existsSync(root), false);
  const alias = parent.resolve("alias"); fs.symlinkSync(parent.root, alias, "dir");
  assert.throws(() => runInstalledSmoke({ prefix: "bad-base-", env: { ...env, MDKG_SMOKE_TMPDIR: alias },
    prepare() { assert.fail("must not prepare"); }, exercise() { assert.fail("must not execute"); },
  }), /link|directory/);
  assert.throws(() => runInstalledSmoke({ prefix: "linked-artifact-", env,
    prepare(directory) { root = directory; const tarballPath = path.join(root, "linked.tgz"); fs.writeFileSync(path.join(root, "bytes"), "same"); fs.linkSync(path.join(root, "bytes"), tarballPath); return { tarballPath, install() { assert.fail("must not install"); } }; },
    exercise() { assert.fail("must not execute"); },
  }), error => { assert.match(error.errors[0].message, /independent regular file/); return true; });
  assert.equal(fs.existsSync(root), false);
});

test("standalone installed smoke detects installer mutation with and without install failure", t => {
  const parent = owned(t);
  for (const fail of [false, true]) {
    let root;
    assert.throws(() => runInstalledSmoke({ prefix: "installer-mutation-", env: { ...process.env, MDKG_SMOKE_TMPDIR: parent.root },
      prepare(directory) {
        root = directory;
        const tarballPath = path.join(root, "synthetic.tgz"); fs.writeFileSync(tarballPath, "packed");
        return { tarballPath, install() {
          fs.writeFileSync(tarballPath, "change");
          if (fail) throw Error("installer failed");
          return { tarballPath };
        } };
      },
      exercise() { return { ok: true }; },
    }), error => {
      assert.ok(error instanceof AggregateError);
      assert.match(error.message, /cleanup=\{"removed":true/);
      assert.match(error.errors[0].message, /artifact hash or identity mismatch/);
      if (fail) assert.match(error.errors[0].message, /installer failed/);
      return true;
    });
    assert.equal(fs.existsSync(root), false);
  }
});
