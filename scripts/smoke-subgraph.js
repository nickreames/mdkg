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

function git(cwd, args) {
  return run("git", args, { cwd }).stdout;
}

function commitAll(repo, message) {
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", message]);
  return git(repo, ["rev-parse", "HEAD"]);
}

function sha256File(filePath) {
  const crypto = require("node:crypto");
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
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

function createChildBundle(binPath, root, alias = "child_subgraph") {
  const child = path.join(root, "projects", alias);
  fs.mkdirSync(child, { recursive: true });
  git(child, ["init"]);
  git(child, ["config", "user.email", "mdkg@example.test"]);
  git(child, ["config", "user.name", "mdkg test"]);
  mdkg(binPath, ["init", "--agent"], child);
  mdkg(binPath, ["new", "spec", "Child Agent", "--id", "agent.child-agent", "--json"], child);
  mdkg(binPath, ["new", "work", "Child Work", "--id", "work.child-work", "--json"], child);
  mdkg(
    binPath,
    [
      "work",
      "order",
      "new",
      "Child Order",
      "--id",
      "order.child-order",
      "--work-id",
      "work.child-work",
      "--requester",
      "user://child",
      "--json",
    ],
    child
  );
  mdkg(
    binPath,
    [
      "work",
      "receipt",
      "new",
      "Child Receipt",
      "--id",
      "receipt.child-receipt",
      "--work-order-id",
      "order.child-order",
      "--outcome",
      "success",
      "--json",
    ],
    child
  );
  mdkg(binPath, ["new", "task", "Child Task", "--status", "todo", "--priority", "1", "--json"], child);
  const head = commitAll(child, "initial child graph");
  const bundlePath = `.mdkg/bundles/private/subgraphs/${alias}.mdkg.zip`;
  const bundleAbs = path.join(root, bundlePath);
  mdkg(binPath, ["bundle", "create", "--profile", "private", "--output", bundleAbs, "--json"], child);
  return { child, bundlePath, bundleAbs, head };
}

function exerciseSubgraphs(binPath, tempRoot) {
  const root = path.join(tempRoot, "root-repo");
  fs.mkdirSync(root, { recursive: true });
  mdkg(binPath, ["init", "--agent"], root);
  const child = createChildBundle(binPath, root);

  const added = parseJson(
    mdkg(
      binPath,
      [
        "subgraph",
        "add",
        "child_subgraph",
        child.bundlePath,
        "--source-path",
        "projects/child_subgraph",
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
  const dryRun = parseJson(mdkg(binPath, ["subgraph", "sync", "child_subgraph", "--dry-run", "--json"], root).stdout);
  assert(dryRun.ok === true && dryRun.action === "sync_dry_run", "subgraph sync dry-run failed");
  assert(fs.existsSync(child.bundleAbs), "dry-run removed existing bundle");
  const audit = parseJson(mdkg(binPath, ["subgraph", "audit", "child_subgraph", "--target", ".mdkg/subgraphs", "--json"], root).stdout);
  assert(audit.ok === true && audit.action === "audited", "subgraph audit failed");
  assert(audit.subgraphs[0].capability_summary.work_count === 1, "subgraph audit capability summary did not count work records");
  assert(
    audit.subgraphs[0].checks.some((check) => check.id === "subgraph.bundle.root_owned" && check.ok === true),
    "subgraph audit did not prove root-owned bundle path"
  );
  const upgradePlan = parseJson(mdkg(binPath, ["subgraph", "upgrade-plan", "child_subgraph", "--json"], root).stdout);
  assert(upgradePlan.ok === true && upgradePlan.apply_supported === false, "subgraph upgrade-plan did not return read-only ok plan");
  assert(upgradePlan.subgraphs[0].capability_summary.work_count === 1, "subgraph upgrade-plan capability summary did not count work records");
  assert(
    upgradePlan.subgraphs[0].actions.some((action) => action.action === "subgraph.sync" && action.status === "planned"),
    "subgraph upgrade-plan did not plan a sync for missing source_repo"
  );
  const materialized = parseJson(
    mdkg(binPath, ["subgraph", "materialize", "child_subgraph", "--target", ".mdkg/subgraphs", "--gitignore", "--json"], root).stdout
  );
  assert(materialized.ok === true, "subgraph materialize failed");
  assertExists(path.join(root, ".mdkg", "subgraphs", "child_subgraph", ".mdkg-materialized.json"));
  const materializedAudit = parseJson(mdkg(binPath, ["subgraph", "audit", "child_subgraph", "--target", ".mdkg/subgraphs", "--json"], root).stdout);
  assert(
    materializedAudit.subgraphs[0].checks.some((check) => check.id === "subgraph.materialize.target_safe" && check.ok === true),
    "subgraph audit did not prove materialized target marker safety"
  );
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
  mdkg(
    binPath,
    [
      "work",
      "order",
      "new",
      "Root Order For Child Work",
      "--id",
      "order.root-child",
      "--work-id",
      "child_subgraph:work.child-work",
      "--requester",
      "user://root",
      "--json",
    ],
    root
  );
  mdkg(
    binPath,
    [
      "work",
      "receipt",
      "new",
      "Root Receipt For Child Order",
      "--id",
      "receipt.root-child",
      "--work-order-id",
      "child_subgraph:order.child-order",
      "--outcome",
      "success",
      "--json",
    ],
    root
  );
  mdkg(binPath, ["validate"], root);

  const mutation = mdkgFailure(binPath, ["task", "update", "child_subgraph:task-1", "--status", "review"], root);
  assert(mutation.stderr.includes("cannot mutate read-only subgraph node"), "mutation guard did not fire");

  const oldBundleHash = sha256File(child.bundleAbs);
  mdkg(binPath, ["new", "task", "Child Refreshed Task", "--status", "todo", "--priority", "1", "--json"], child.child);
  const nextHead = commitAll(child.child, "child refreshed task");
  const synced = parseJson(mdkg(binPath, ["subgraph", "sync", "child_subgraph", "--json"], root).stdout);
  assert(synced.ok === true, "subgraph sync failed after child commit");
  assert(synced.subgraphs[0].new_source_repo.endsWith(nextHead), "subgraph sync did not record child head");
  assert(sha256File(child.bundleAbs) !== oldBundleHash, "subgraph sync did not update bundle hash");
  const refreshedSearch = parseJson(mdkg(binPath, ["search", "Child Refreshed Task", "--json"], root).stdout);
  assert(refreshedSearch.items.some((item) => item.qid.startsWith("child_subgraph:")), "search did not find refreshed subgraph task");

  const old = new Date(Date.now() - 10_000);
  fs.utimesSync(child.bundleAbs, old, old);
  const staleSearch = mdkg(binPath, ["search", "Child Task", "--json"], root);
  assert(staleSearch.stderr.includes("subgraph child_subgraph: bundle age"), "stale read did not warn");
  const stalePlan = parseJson(mdkg(binPath, ["subgraph", "upgrade-plan", "child_subgraph", "--json"], root).stdout);
  assert(
    stalePlan.subgraphs[0].actions.some((action) => action.action === "subgraph.sync" && action.status === "planned"),
    "stale subgraph upgrade-plan did not plan sync"
  );
  const freshOnly = parseJson(mdkg(binPath, ["capability", "resolve", "Child Work", "--fresh-only", "--json"], root).stdout);
  assert(freshOnly.count === 0, "fresh-only did not exclude stale subgraph capability");
  const staleVerify = mdkgFailure(binPath, ["subgraph", "verify", "child_subgraph", "--json"], root);
  assert(staleVerify.status === 2, "stale verify did not fail with validation status");
  assert(parseJson(staleVerify.stdout).ok === false, "stale verify receipt was not ok=false");
  mdkg(binPath, ["subgraph", "sync", "child_subgraph", "--json"], root);
  const verify = parseJson(mdkg(binPath, ["subgraph", "verify", "child_subgraph", "--json"], root).stdout);
  assert(verify.ok === true, "subgraph verify did not pass after sync");
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
