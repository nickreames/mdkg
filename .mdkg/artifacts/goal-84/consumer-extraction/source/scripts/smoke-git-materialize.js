#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const NPM_CMD = process.platform === "win32" ? "npm.cmd" : "npm";
const GIT_CMD = process.platform === "win32" ? "git.exe" : "git";
const TEMP_BASE = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CACHE = process.env.NPM_CONFIG_CACHE || path.join(TEMP_BASE, "mdkg-npm-cache");

function runResult(command, args, options = {}) {
  fs.mkdirSync(NPM_CACHE, { recursive: true });
  return spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NPM_CONFIG_CACHE: NPM_CACHE,
      npm_config_cache: NPM_CACHE,
      NPM_CONFIG_DRY_RUN: "false",
      npm_config_dry_run: "false",
    },
    input: options.input,
    stdio: "pipe",
  });
}

function run(command, args, options = {}) {
  const result = runResult(command, args, options);
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result.stdout.trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFile(filePath) {
  assert(fs.existsSync(filePath) && fs.statSync(filePath).isFile(), `expected file not found: ${filePath}`);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function installedPackageRoot(prefix) {
  const candidates = [
    path.join(prefix, "lib", "node_modules", "mdkg"),
    path.join(prefix, "node_modules", "mdkg"),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error(`installed mdkg package not found under ${prefix}`);
  return found;
}

function runSmoke() {
  const repoRoot = path.resolve(__dirname, "..");
  const tempRoot = fs.mkdtempSync(path.join(TEMP_BASE, "mdkg-git-materialize-"));

  try {
    const packDir = path.join(tempRoot, "pack");
    fs.mkdirSync(packDir, { recursive: true });
    const packOutput = run(
      NPM_CMD,
      ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir],
      { cwd: repoRoot }
    );
    const tarballName = packOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
    assert(tarballName, "unable to determine npm pack output tarball");
    const tarballPath = path.join(packDir, path.basename(tarballName));
    assertFile(tarballPath);

    const prefix = path.join(tempRoot, "prefix");
    run(NPM_CMD, ["install", "--global", "--prefix", prefix, tarballPath], { cwd: tempRoot });
    const packageRoot = installedPackageRoot(prefix);
    const cliPath = path.join(packageRoot, "dist", "cli.js");
    for (const relativePath of [
      "dist/cli.js",
      "dist/commands/git_materialize.js",
      "dist/command-contract.json",
      "README.md",
      "CLI_COMMAND_MATRIX.md",
      "CHANGELOG.md",
    ]) {
      assertFile(path.join(packageRoot, relativePath));
    }

    const installedPackage = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
    assert(Object.keys(installedPackage.dependencies || {}).length === 0, "packed mdkg must not add downstream runtime dependencies");
    const runCli = (args, options = {}) => run(process.execPath, [cliPath, ...args], options);
    const runCliResult = (args, options = {}) => runResult(process.execPath, [cliPath, ...args], options);

    const help = runCli(["help", "git", "materialize"], { cwd: tempRoot });
    assert(help.includes("mdkg git materialize --request <file|-> [--json]"), "installed help is missing git materialize usage");
    assert(help.includes("mdkg.git.materialize.request.v1"), "installed help is missing the request schema");

    const contract = JSON.parse(fs.readFileSync(path.join(packageRoot, "dist", "command-contract.json"), "utf8"));
    const materializeContract = contract.commands.find((command) => command.key === "git materialize");
    assert(materializeContract, "installed command contract is missing git materialize");
    assert(materializeContract.atomic_write_policy === "same-parent-temporary-tree-rename-after-verification", "installed command contract has stale materialize atomicity");
    assert(materializeContract.receipts.includes("mdkg.git.materialize.receipt.v1"), "installed command contract has stale materialize receipt metadata");
    const neutralSurface = `${help}\n${JSON.stringify(materializeContract)}`;
    assert(!/omni-room|omni-chat|ochatr|control-plane/i.test(neutralSurface), "materialization public contract contains downstream product naming");

    const sourceDir = path.join(tempRoot, "source");
    fs.mkdirSync(sourceDir, { recursive: true });
    run(GIT_CMD, ["init", "-q", "-b", "main"], { cwd: sourceDir });
    run(GIT_CMD, ["config", "user.name", "mdkg smoke"], { cwd: sourceDir });
    run(GIT_CMD, ["config", "user.email", "smoke@example.invalid"], { cwd: sourceDir });
    fs.writeFileSync(path.join(sourceDir, "README.md"), "# Neutral source fixture\n", "utf8");
    run(GIT_CMD, ["add", "README.md"], { cwd: sourceDir });
    run(GIT_CMD, ["commit", "-q", "-m", "fixture"], { cwd: sourceDir });
    const expectedCommit = run(GIT_CMD, ["rev-parse", "HEAD"], { cwd: sourceDir });
    const expectedTree = run(GIT_CMD, ["rev-parse", "HEAD^{tree}"], { cwd: sourceDir });
    const repositoryRef = pathToFileURL(sourceDir).href;

    const consumerDir = path.join(tempRoot, "consumer");
    fs.mkdirSync(consumerDir, { recursive: true });
    run(GIT_CMD, ["init", "-q"], { cwd: consumerDir });
    runCli(["init", "--agent"], { cwd: consumerDir });

    const request = {
      schema: "mdkg.git.materialize.request.v1",
      source_ref: "neutral-source-fixture-v1",
      repository_ref: repositoryRef,
      access_ref: "local-file-transport",
      auth_capability: "unauthenticated",
      target_ref: "refs/heads/main",
      expected_commit: expectedCommit,
      expected_tree: expectedTree,
      destination: "sources/accepted",
      depth: "full",
      submodule_policy: "deny",
      project_memory_policy: "optional",
      correlation_ref: "smoke-run",
      evidence_refs: ["packed-consumer"],
    };
    const requestPath = path.join(consumerDir, "materialize.json");
    writeJson(requestPath, request);
    const receiptText = runCli(["git", "materialize", "--request", requestPath, "--json"], { cwd: consumerDir });
    const receipt = JSON.parse(receiptText);
    assert(receipt.ok && receipt.reason_code === "accepted", "installed materialization did not accept the verified source");
    assert(receipt.destination.path === "sources/accepted" && receipt.destination.published, "installed materialization did not publish the contained destination");
    assert(receipt.observed_revision.commit === expectedCommit && receipt.observed_revision.tree === expectedTree, "installed materialization receipt has the wrong revision");
    assert(!receiptText.includes(sourceDir), "materialization receipt leaked an absolute local source path");
    assertFile(path.join(consumerDir, "sources", "accepted", "README.md"));

    const rejectedRequest = {
      ...request,
      expected_commit: "f".repeat(expectedCommit.length),
      destination: "sources/rejected",
      correlation_ref: "smoke-rejected",
    };
    const rejectedPath = path.join(consumerDir, "materialize-rejected.json");
    writeJson(rejectedPath, rejectedRequest);
    const rejected = runCliResult(["git", "materialize", "--request", rejectedPath, "--json"], { cwd: consumerDir });
    assert(rejected.status === 2, `representative materialization failure used unexpected exit ${rejected.status}`);
    const rejectedReceipt = JSON.parse(rejected.stdout);
    assert(!rejectedReceipt.ok && rejectedReceipt.reason_code === "commit_mismatch", "representative materialization failure has the wrong reason code");
    assert(!fs.existsSync(path.join(consumerDir, "sources", "rejected")), "rejected materialization left an accepted destination");

    const cloneReceipt = JSON.parse(
      runCli(["git", "clone", repositoryRef, "--target", "clones/legacy", "--branch", "main", "--json"], { cwd: consumerDir })
    );
    assert(cloneReceipt.ok, "installed git clone compatibility check failed");
    assertFile(path.join(consumerDir, "clones", "legacy", "README.md"));

    console.log("git materialize packed-consumer smoke passed");
    console.log(`version=${installedPackage.version}`);
    console.log(`commit=${expectedCommit}`);
    console.log("success=accepted");
    console.log("failure=commit_mismatch");
    console.log("clone=compatible");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

try {
  runSmoke();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
