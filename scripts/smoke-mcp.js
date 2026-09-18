#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const strict = require("node:assert/strict");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = process.env.MDKG_SMOKE_TMPDIR || (fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir());
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}`.trim() };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function git(cwd, args) {
  return run("git", args, { cwd }).stdout;
}

function commitAll(repo, message) {
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", message]);
  return git(repo, ["rev-parse", "HEAD"]);
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: repoRoot,
  }).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  if (!tarballName) {
    throw new Error("unable to determine npm pack output tarball");
  }
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assert(install.combined.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing version");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, tarballPath };
}

function initializeGraph(binPath, root, options) {
  mdkg(binPath, ["init", "--agent"], root);
  if (!options.v2) return;
  const configPath = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = options.backend;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  const args = ["graph", "migrate", "--graph-id", crypto.randomUUID(), "--origin", crypto.randomUUID()];
  const plan = parseJson(mdkg(binPath, [...args, "--json"], root).stdout);
  strict.deepEqual(plan.blocking, []);
  mdkg(binPath, [...args, "--apply", "--plan-hash", plan.plan_hash, "--json"], root);
}

function createChildBundle(binPath, root, options) {
  const child = path.join(root, "projects", "child_demo");
  fs.mkdirSync(child, { recursive: true });
  git(child, ["init", "-q"]);
  git(child, ["config", "user.email", "mdkg@example.test"]);
  git(child, ["config", "user.name", "mdkg test"]);
  initializeGraph(binPath, child, options);
  const task = parseJson(mdkg(binPath, ["new", "task", "MCP child demo task", "--status", "todo", "--priority", "1", "--json"], child).stdout).node;
  const head = commitAll(child, "initial child mdkg graph");
  const bundlePath = ".mdkg/bundles/private/subgraphs/child_demo.mdkg.zip";
  const bundleAbs = path.join(root, bundlePath);
  mdkg(binPath, ["bundle", "create", "--profile", "private", "--output", bundleAbs, "--json"], child);
  return { child, bundlePath, bundleAbs, head, task };
}

function setupRoot(binPath, tempRoot, options = {}) {
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "mdkg@example.test"]);
  git(root, ["config", "user.name", "mdkg test"]);
  initializeGraph(binPath, root, options);
  const goal = parseJson(mdkg(binPath, ["new", "goal", "MCP smoke goal", "--json"], root).stdout).node;
  const task = parseJson(
    mdkg(
      binPath,
      ["new", "task", "MCP smoke task", "--status", "todo", "--priority", "1", "--parent", goal.id, "--json"],
      root
    ).stdout
  ).node;
  mdkg(binPath, ["goal", "activate", goal.id, "--json"], root);
  const child = createChildBundle(binPath, root, options);
  mdkg(
    binPath,
    [
      "subgraph",
      "add",
      "child_demo",
      child.bundlePath,
      "--source-path",
      "projects/child_demo",
      "--source-repo",
      child.head,
      "--json",
    ],
    root
  );
  mdkg(binPath, ["index"], root);
  mdkg(binPath, ["validate", "--json"], root);
  if (options.v2) {
    assert(goal.stable_ref && task.stable_ref && child.task.stable_ref, "CLI must persist all v2 identities");
    assert(fs.readFileSync(path.join(root, task.path), "utf8").includes(goal.stable_ref), "authored parent must bind stable identity");
    git(root, ["add", "--", task.path]);
    fs.appendFileSync(path.join(root, task.path), "\nUnstaged developer intent.\n");
    fs.writeFileSync(path.join(root, "user-notes.txt"), "Unknown user work must survive reads.\n");
  }
  return { root, goal, task, child };
}

function startMcp(binPath, root) {
  const child = spawn(binPath, ["mcp", "serve", "--stdio", "--root", root], {
    cwd: root,
    env: commandEnv(),
    stdio: ["pipe", "pipe", "pipe"],
  });
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  const pending = new Map();
  let stdoutBuffer = "";
  let stderr = "";
  let nextId = 1;

  child.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    let newline = stdoutBuffer.indexOf("\n");
    while (newline !== -1) {
      const line = stdoutBuffer.slice(0, newline).trim();
      stdoutBuffer = stdoutBuffer.slice(newline + 1);
      if (line) {
        const message = JSON.parse(line);
        const entry = pending.get(message.id);
        if (entry) {
          pending.delete(message.id);
          clearTimeout(entry.timeout);
          entry.resolve(message);
        }
      }
      newline = stdoutBuffer.indexOf("\n");
    }
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  function request(method, params) {
    const id = nextId++;
    const payload = { jsonrpc: "2.0", id, method, ...(params === undefined ? {} : { params }) };
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`timed out waiting for MCP response to ${method}; stderr:\n${stderr}`));
      }, 10000);
      pending.set(id, { resolve, reject, timeout });
      child.stdin.write(`${JSON.stringify(payload)}\n`);
    });
  }

  function notify(method, params) {
    const payload = { jsonrpc: "2.0", method, ...(params === undefined ? {} : { params }) };
    child.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  async function stop() {
    child.stdin.end();
    const exit = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        child.kill("SIGTERM");
      }, 5000);
      child.on("exit", (code) => {
        clearTimeout(timeout);
        resolve(code);
      });
    });
    assert(exit === 0, `mcp server exited nonzero: ${exit}\nstderr:\n${stderr}`);
    assert(stderr.trim() === "", `mcp server wrote to stderr:\n${stderr}`);
  }

  return { request, notify, stop };
}

async function exerciseMcp(binPath, fixture, options = {}) {
  const server = startMcp(binPath, fixture.root);
  try {
    const initialized = await server.request("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "mdkg-smoke", version: "0" },
    });
    assert(initialized.result.protocolVersion === "2025-06-18", "initialize did not negotiate expected protocol");
    assert(initialized.result.serverInfo.name === "mdkg", "initialize did not report mdkg server");
    server.notify("notifications/initialized");

    const listed = await server.request("tools/list");
    const toolNames = listed.result.tools.map((tool) => tool.name);
    for (const expected of [
      "mdkg_status",
      "mdkg_workspace_list",
      "mdkg_search",
      "mdkg_show",
      "mdkg_pack",
      "mdkg_goal_current",
      "mdkg_goal_next",
      "mdkg_validate",
    ]) {
      assert(toolNames.includes(expected), `tools/list missing ${expected}`);
    }
    assert(toolNames.every((name) => !/task|activate|archive|import|queue|shell|sql/i.test(name)), "tools/list exposed mutation-shaped tool");

    const call = async (name, args = {}) =>
      server.request("tools/call", { name, arguments: args });
    const status = await call("mdkg_status");
    assert(status.result.structuredContent.action === "status", "mdkg_status did not return status receipt");
    assert(status.result.structuredContent.ok === true, "mdkg_status reported not ok");

    const workspaces = await call("mdkg_workspace_list");
    assert(workspaces.result.structuredContent.action === "mcp.workspace_list", "workspace tool action mismatch");
    assert(workspaces.result.structuredContent.subgraphs.some((item) => item.alias === "child_demo"), "workspace list missing child_demo subgraph");

    const searchRoot = await call("mdkg_search", { query: "MCP smoke task", limit: 5 });
    assert(searchRoot.result.structuredContent.items.some((item) => item.qid === `root:${fixture.task.id}`), "root search missed task");

    const searchChild = await call("mdkg_search", { query: "MCP child demo task", ws: "child_demo", limit: 20 });
    assert(searchChild.result.structuredContent.items.some((item) => item.qid === "child_demo:task-1"), "subgraph search missed child task");

    const shown = await call("mdkg_show", { id: fixture.task.id, ws: "root" });
    assert(shown.result.structuredContent.item.id === fixture.task.id, "show did not return root task");
    let importedPackNodes;

    if (options.v2) {
      strict.equal(shown.result.structuredContent.item.stable_ref, fixture.task.stable_ref);
      const byIdentity = await call("mdkg_show", { id: fixture.task.stable_ref });
      strict.equal(byIdentity.result.structuredContent.item.stable_ref, fixture.task.stable_ref);
      assert(byIdentity.result.structuredContent.item.body.includes("Unstaged developer intent."), "MCP must read current authored content, not stale staged bytes");
      const childShown = await call("mdkg_show", { id: `child_demo:${fixture.child.task.id}` });
      strict.equal(childShown.result.structuredContent.item.stable_ref, fixture.child.task.stable_ref);
      const childPack = await call("mdkg_pack", { id: `child_demo:${fixture.child.task.id}`, max_nodes: 10 });
      assert(childPack.result.structuredContent.pack.nodes.some(node => node.stable_ref === fixture.child.task.stable_ref), "imported pack lost stable identity");
      importedPackNodes = childPack.result.structuredContent.pack.nodes;
    }

    const packed = await call("mdkg_pack", { id: fixture.goal.id, max_nodes: 10 });
    assert(packed.result.structuredContent.pack.meta.root === `root:${fixture.goal.id}`, "pack root mismatch");
    assert(packed.result.structuredContent.pack.nodes.some((node) => node.qid === `root:${fixture.task.id}`), "pack missing scoped task");
    if (options.v2) {
      for (const expected of [fixture.goal, fixture.task]) {
        const node = packed.result.structuredContent.pack.nodes.find(item => item.stable_ref === expected.stable_ref);
        assert(node && node.identity.graph_id && node.identity.node_id, "MCP pack lost persisted identity");
      }
    }

    const current = await call("mdkg_goal_current");
    assert(current.result.structuredContent.goal.qid === `root:${fixture.goal.id}`, "goal current mismatch");

    const next = await call("mdkg_goal_next");
    assert(next.result.structuredContent.node.qid === `root:${fixture.task.id}`, "goal next did not return scoped task");

    if (!options.observational) {
      mdkg(binPath, ["goal", "done", fixture.goal.id, "--json"], fixture.root);
      const closedNext = await call("mdkg_goal_next", { goal: fixture.goal.id });
      assert(closedNext.result.structuredContent.node === null, "achieved goal returned actionable MCP next work");
      assert(
        !closedNext.result.structuredContent.warnings.some((warning) => warning.includes("active_node")),
        "achieved goal MCP next emitted stale active_node warning"
      );
    }

    const validate = await call("mdkg_validate");
    assert(validate.result.structuredContent.action === "validated", "validate action mismatch");
    assert(validate.result.structuredContent.ok === true, "validate reported not ok");

    const unknown = await call("mdkg_task_update", { id: fixture.task.id, status: "done" });
    assert(unknown.error && unknown.error.code === -32602, "unknown mutation-shaped tool did not fail closed");
    return {
      shown: shown.result.structuredContent.item,
      search: searchRoot.result.structuredContent.items,
      packNodes: packed.result.structuredContent.pack.nodes,
      importedPackNodes,
      current: current.result.structuredContent.goal,
      next: next.result.structuredContent.node,
    };
  } finally {
    await server.stop();
  }
}

// Hash every fixture file, including the Git index and caches. Modes and empty
// directories are included so a read cannot quietly recreate a cache or output.
function snapshot(root) {
  const result = { ".": { directory: true, mode: fs.lstatSync(root).mode & 0o777 } };
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name), relative = path.relative(root, absolute);
      const mode = fs.lstatSync(absolute).mode & 0o777;
      if (entry.isDirectory()) { result[relative] = { mode, directory: true }; visit(absolute); }
      else if (entry.isFile()) result[relative] = { mode, sha256: crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex") };
      else throw new Error(`unexpected linked or special fixture input: ${absolute}`);
    }
  };
  visit(root); return result;
}

function makeReadOnly(root) {
  const modes = [];
  const visit = absolute => {
    const stat = fs.lstatSync(absolute);
    assert(!stat.isSymbolicLink(), "refuse chmod of linked fixture input");
    modes.push([absolute, stat.mode & 0o777]);
    if (stat.isDirectory()) for (const name of fs.readdirSync(absolute)) visit(path.join(absolute, name));
    fs.chmodSync(absolute, stat.mode & 0o555);
  };
  visit(root);
  // Do not claim permission-enforced reads if the current user can bypass them.
  try { fs.accessSync(root, fs.constants.W_OK); }
  catch (error) {
    if (error.code === "EACCES") return () => { for (const [absolute, mode] of modes) fs.chmodSync(absolute, mode); };
    for (const [absolute, mode] of modes) fs.chmodSync(absolute, mode);
    throw error;
  }
  for (const [absolute, mode] of modes) fs.chmodSync(absolute, mode);
  throw new Error("read-only fixture permissions are not enforced for this user");
}

async function exerciseV2Reads(binPath, tempRoot, backend) {
  const container = path.join(tempRoot, `v2-${backend}`); fs.mkdirSync(container);
  const fixture = setupRoot(binPath, container, { v2: true, backend });
  const receipts = [];
  let expected;
  for (const state of ["stale-cache", "warm", "cold", "read-only-cold"]) {
    if (state === "warm") mdkg(binPath, ["index"], fixture.root);
    if (state === "cold") fs.rmSync(path.join(fixture.root, ".mdkg/index"), { recursive: true });
    const restore = state === "read-only-cold" && process.platform !== "win32" ? makeReadOnly(fixture.root) : () => {};
    try {
      const before = snapshot(fixture.root);
      for (const args of [["show", fixture.task.stable_ref], ["search", "MCP smoke task"], ["list", "--type", "task"], ["validate"]]) {
        mdkg(binPath, [...args, "--json"], fixture.root);
        strict.deepEqual(snapshot(fixture.root), before, `CLI ${args[0]} wrote in ${backend}/${state}`);
      }
      const semantic = await exerciseMcp(binPath, fixture, { v2: true, observational: true });
      if (expected) strict.deepEqual(semantic, expected, "cache availability changed semantic results");
      else expected = semantic;
      strict.deepEqual(snapshot(fixture.root), before, `MCP wrote in ${backend}/${state}`);
      receipts.push({ backend, state, ok: true, permission_enforced: state === "read-only-cold" && process.platform !== "win32", snapshot_sha256: crypto.createHash("sha256").update(JSON.stringify(before)).digest("hex") });
    } finally { restore(); }
  }
  // Compare the same persisted identities and authored bytes using both cache
  // backends, rather than treating two unrelated successful graphs as parity.
  const configPath = path.join(fixture.root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.index.backend = backend === "json" ? "sqlite" : "json";
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  mdkg(binPath, ["index"], fixture.root);
  const before = snapshot(fixture.root);
  strict.deepEqual(await exerciseMcp(binPath, fixture, { v2: true, observational: true }), expected, "backend switch changed semantic results");
  strict.deepEqual(snapshot(fixture.root), before, "backend parity read changed fixture bytes");
  receipts.push({ backend, state: "same-graph-backend-parity", comparison_backend: config.index.backend, ok: true });
  return receipts;
}

async function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-mcp-smoke."));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const fixture = setupRoot(binPath, tempRoot);
  await exerciseMcp(binPath, fixture);
  const identityReads = [];
  for (const backend of ["json", "sqlite"]) identityReads.push(...await exerciseV2Reads(binPath, tempRoot, backend));
  console.log(
    JSON.stringify(
      {
        smoke: "mcp",
        ok: true,
        packageVersion,
        tempRoot,
        tarballPath,
        root: fixture.root,
        identityReads,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack || err.message : String(err));
  process.exit(1);
});
