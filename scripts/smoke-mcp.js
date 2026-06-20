#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
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

function createChildBundle(binPath, root) {
  const child = path.join(root, "projects", "child_demo");
  fs.mkdirSync(child, { recursive: true });
  git(child, ["init", "-q"]);
  git(child, ["config", "user.email", "mdkg@example.test"]);
  git(child, ["config", "user.name", "mdkg test"]);
  mdkg(binPath, ["init", "--agent"], child);
  mdkg(binPath, ["new", "task", "MCP child demo task", "--status", "todo", "--priority", "1", "--json"], child);
  const head = commitAll(child, "initial child mdkg graph");
  const bundlePath = ".mdkg/bundles/private/subgraphs/child_demo.mdkg.zip";
  const bundleAbs = path.join(root, bundlePath);
  mdkg(binPath, ["bundle", "create", "--profile", "private", "--output", bundleAbs, "--json"], child);
  return { child, bundlePath, bundleAbs, head };
}

function setupRoot(binPath, tempRoot) {
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "mdkg@example.test"]);
  git(root, ["config", "user.name", "mdkg test"]);
  mdkg(binPath, ["init", "--agent"], root);
  const goal = parseJson(mdkg(binPath, ["new", "goal", "MCP smoke goal", "--json"], root).stdout).node;
  const task = parseJson(
    mdkg(
      binPath,
      ["new", "task", "MCP smoke task", "--status", "todo", "--priority", "1", "--parent", goal.id, "--json"],
      root
    ).stdout
  ).node;
  mdkg(binPath, ["goal", "activate", goal.id, "--json"], root);
  const child = createChildBundle(binPath, root);
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

async function exerciseMcp(binPath, fixture) {
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

    const packed = await call("mdkg_pack", { id: fixture.goal.id, max_nodes: 10 });
    assert(packed.result.structuredContent.pack.meta.root === `root:${fixture.goal.id}`, "pack root mismatch");
    assert(packed.result.structuredContent.pack.nodes.some((node) => node.qid === `root:${fixture.task.id}`), "pack missing scoped task");

    const current = await call("mdkg_goal_current");
    assert(current.result.structuredContent.goal.qid === `root:${fixture.goal.id}`, "goal current mismatch");

    const next = await call("mdkg_goal_next");
    assert(next.result.structuredContent.node.qid === `root:${fixture.task.id}`, "goal next did not return scoped task");

    mdkg(binPath, ["goal", "done", fixture.goal.id, "--json"], fixture.root);
    const closedNext = await call("mdkg_goal_next", { goal: fixture.goal.id });
    assert(closedNext.result.structuredContent.node === null, "achieved goal returned actionable MCP next work");
    assert(
      !closedNext.result.structuredContent.warnings.some((warning) => warning.includes("active_node")),
      "achieved goal MCP next emitted stale active_node warning"
    );

    const validate = await call("mdkg_validate");
    assert(validate.result.structuredContent.action === "validated", "validate action mismatch");
    assert(validate.result.structuredContent.ok === true, "validate reported not ok");

    const unknown = await call("mdkg_task_update", { id: fixture.task.id, status: "done" });
    assert(unknown.error && unknown.error.code === -32602, "unknown mutation-shaped tool did not fail closed");
  } finally {
    await server.stop();
  }
}

async function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-mcp-smoke."));
  const { binPath, tarballPath } = packAndInstall(tempRoot);
  const fixture = setupRoot(binPath, tempRoot);
  await exerciseMcp(binPath, fixture);
  console.log(
    JSON.stringify(
      {
        smoke: "mcp",
        ok: true,
        packageVersion,
        tempRoot,
        tarballPath,
        root: fixture.root,
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
