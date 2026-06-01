#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

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

function runFailure(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status === 0) {
    throw new Error(`command unexpectedly succeeded: ${command} ${args.join(" ")}`);
  }
  return { status: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
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

function mdkgFailure(binPath, args, cwd) {
  return runFailure(binPath, args, { cwd });
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
  const child = path.join(root, "child-repo");
  fs.mkdirSync(child, { recursive: true });
  mdkg(binPath, ["init", "--agent"], child);
  mdkg(binPath, ["new", "spec", "Child Agent", "--id", "agent.child-agent", "--json"], child);
  mdkg(binPath, ["new", "work", "Child Work", "--id", "work.child-work", "--json"], child);
  mdkg(binPath, ["new", "task", "Child Task", "--status", "todo", "--priority", "1", "--json"], child);
  const bundle = parseJson(mdkg(binPath, ["bundle", "create", "--profile", "private", "--json"], child).stdout);
  return path.join("child-repo", bundle.path);
}

function exerciseSubgraphs(binPath, tempRoot) {
  const root = path.join(tempRoot, "root-repo");
  fs.mkdirSync(root, { recursive: true });
  mdkg(binPath, ["init", "--agent"], root);
  const bundlePath = createChildBundle(binPath, root);

  const added = parseJson(
    mdkg(
      binPath,
      [
        "subgraph",
        "add",
        "child_subgraph",
        bundlePath,
        "--source-path",
        "child-repo",
        "--max-stale-seconds",
        "1",
        "--json",
      ],
      root
    ).stdout
  );
  assert(added.subgraph.alias === "child_subgraph", "subgraph add did not return child_subgraph");
  mdkg(binPath, ["subgraph", "list", "--json"], root);
  mdkg(binPath, ["subgraph", "show", "child_subgraph", "--json"], root);
  mdkg(binPath, ["index"], root);
  assertExists(path.join(root, ".mdkg", "index", "subgraphs.json"));

  const search = parseJson(mdkg(binPath, ["search", "Child Task", "--json"], root).stdout);
  assert(search.items.some((item) => item.qid === "child_subgraph:task-1"), "search did not find subgraph task");
  const shown = parseJson(mdkg(binPath, ["show", "child_subgraph:task-1", "--json"], root).stdout);
  assert(shown.item.source.imported === true, "show did not include subgraph source metadata");
  mdkg(binPath, ["pack", "child_subgraph:task-1", "--dry-run", "--stats"], root);
  const capability = parseJson(mdkg(binPath, ["capability", "search", "Child Work", "--json"], root).stdout);
  assert(capability.items.some((item) => item.qid === "child_subgraph:work.child-work"), "capability search did not find subgraph work");
  const resolved = parseJson(mdkg(binPath, ["capability", "resolve", "Child Work", "--json"], root).stdout);
  assert(resolved.items.some((item) => item.item.qid === "child_subgraph:work.child-work"), "capability resolve did not find subgraph work");

  const mutation = mdkgFailure(binPath, ["task", "update", "child_subgraph:task-1", "--status", "review"], root);
  assert(mutation.stderr.includes("cannot mutate read-only subgraph node"), "mutation guard did not fire");

  const old = new Date(Date.now() - 10_000);
  fs.utimesSync(path.join(root, bundlePath), old, old);
  const staleSearch = mdkg(binPath, ["search", "Child Task", "--json"], root);
  assert(staleSearch.stderr.includes("subgraph child_subgraph: bundle age"), "stale read did not warn");
  const freshOnly = parseJson(mdkg(binPath, ["capability", "resolve", "Child Work", "--fresh-only", "--json"], root).stdout);
  assert(freshOnly.count === 0, "fresh-only did not exclude stale subgraph capability");
  const staleVerify = mdkgFailure(binPath, ["subgraph", "verify", "child_subgraph", "--json"], root);
  assert(staleVerify.status === 2, "stale verify did not fail with validation status");
  assert(parseJson(staleVerify.stdout).ok === false, "stale verify receipt was not ok=false");
  mdkg(binPath, ["subgraph", "refresh", "child_subgraph", "--json"], root);
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-subgraph-"));
    const { binPath, tarballPath } = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseSubgraphs(binPath, tempRoot);
    console.log("subgraph smoke passed");
    console.log(`version=${version}`);
    console.log(`tarball=${path.basename(tarballPath)}`);
  } finally {
    if (tempRoot && process.env.MDKG_KEEP_SMOKE_TMP !== "1") {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

try {
  runSmoke();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
