#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { releaseScope, scopeForMode } = require("./release-scope");
const { admitRetainedCandidate, captureQualificationInputs, retainedOptions } = require("./retained-release-candidate");
const { readJsonLines } = require("./build-receipts");
const { copyVerifiedArtifact, verifyArtifactFile, withVerifiedArtifact } = require("./qualification-artifact");
const { assertDirectoryChain, createRunDirectory, prepareEmptyDirectory, readRegularJsonFile, within } = require("./qualification-output");

const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "scripts", "smoke-manifest.json");
const selectedGoalPath = ".mdkg/work/goal-73-make-the-docs-current-release-supplement-version-driven.md";
const lockfilePaths = [
  "package-lock.json",
  "docs/package-lock.json",
  "mdkg-dev/package-lock.json",
];
const profileEnvKeys = [
  "VERCEL",
  "VERCEL_ENV",
  "PUBLIC_MDKG_PREVIEW_NOINDEX",
  "PUBLIC_MDKG_RELEASE_PREVIEW",
];

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function hashDirectory(directory) {
  assertDirectoryChain(directory);
  const files = [];
  function visit(current, relative) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const entryPath = path.join(current, entry.name);
      const relativePath = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) {
        throw new Error(`immutable context cannot contain symbolic link: ${relativePath}`);
      }
      if (entry.isDirectory()) {
        visit(entryPath, relativePath);
      } else if (entry.isFile()) {
        if (fs.lstatSync(entryPath).nlink !== 1) throw new Error(`immutable context cannot contain hard link: ${relativePath}`);
        files.push({ path: relativePath, sha256: hashFile(entryPath) });
      } else {
        throw new Error(`immutable context has unsupported entry: ${relativePath}`);
      }
    }
  }
  visit(directory, "");
  const sha256 = crypto
    .createHash("sha256")
    .update(files.map((file) => `${file.path}\0${file.sha256}\n`).join(""))
    .digest("hex");
  return { sha256, file_count: files.length };
}

function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function runGit(root, args) {
  const result = spawnSync("git", ["-C", root, ...args], {
    env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${(result.stderr || result.stdout || "").trim()}`);
  }
  return result.stdout;
}

function hashTrackedPath(root, relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    return "missing";
  }
  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink()) {
    return `symlink:${hashText(fs.readlinkSync(filePath))}`;
  }
  if (!stat.isFile()) {
    return `unsupported:${stat.mode}`;
  }
  return `file:${hashFile(filePath)}`;
}

function captureTrackedBoundary(root = repoRoot) {
  if (runGit(root, ["rev-parse", "--is-inside-work-tree"]).trim() !== "true") {
    throw new Error("release ladder requires a Git worktree for tracked-state proof");
  }
  const head = runGit(root, ["rev-parse", "HEAD"]).trim();
  const branch = runGit(root, ["branch", "--show-current"]).trim();
  const statusPorcelain = runGit(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  const trackedPaths = runGit(root, ["ls-files", "-z"])
    .split("\0")
    .filter(Boolean)
    .sort();
  const trackedHashes = Object.fromEntries(
    trackedPaths.map((relativePath) => [relativePath, hashTrackedPath(root, relativePath)]),
  );
  const trackedTreeInput = trackedPaths
    .map((relativePath) => `${relativePath}\0${trackedHashes[relativePath]}\0`)
    .join("");
  const diffCheck = spawnSync("git", ["-C", root, "diff", "--check"], {
    env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const requiredPaths = [selectedGoalPath, ...lockfilePaths];
  for (const relativePath of requiredPaths) {
    if (!Object.hasOwn(trackedHashes, relativePath) || trackedHashes[relativePath] === "missing") {
      throw new Error(`tracked-state proof is missing required tracked path ${relativePath}`);
    }
  }
  return {
    head,
    branch,
    status_porcelain_sha256: hashText(statusPorcelain),
    status_entry_count: statusPorcelain.split("\0").filter(Boolean).length,
    tracked_tree_sha256: hashText(trackedTreeInput),
    tracked_count: trackedPaths.length,
    selected_goal: {
      path: selectedGoalPath,
      sha256: trackedHashes[selectedGoalPath],
    },
    lockfiles: Object.fromEntries(
      lockfilePaths.map((relativePath) => [relativePath, trackedHashes[relativePath]]),
    ),
    diff_check: {
      ok: diffCheck.status === 0,
      output: `${diffCheck.stdout || ""}${diffCheck.stderr || ""}`.trim(),
    },
    tracked_hashes: trackedHashes,
  };
}

function summarizeTrackedBoundary(boundary) {
  const { tracked_hashes: _trackedHashes, ...summary } = boundary;
  return summary;
}

function compareTrackedBoundaries(before, after) {
  const paths = new Set([
    ...Object.keys(before.tracked_hashes),
    ...Object.keys(after.tracked_hashes),
  ]);
  const changedTrackedPaths = [...paths]
    .filter((relativePath) => before.tracked_hashes[relativePath] !== after.tracked_hashes[relativePath])
    .sort();
  const checks = {
    head_unchanged: before.head === after.head,
    branch_unchanged: before.branch === after.branch,
    status_unchanged: before.status_porcelain_sha256 === after.status_porcelain_sha256,
    tracked_tree_unchanged: before.tracked_tree_sha256 === after.tracked_tree_sha256,
    selected_goal_unchanged: before.selected_goal.sha256 === after.selected_goal.sha256,
    lockfiles_unchanged: lockfilePaths.every(
      (relativePath) => before.lockfiles[relativePath] === after.lockfiles[relativePath],
    ),
    diff_check_clean: before.diff_check.ok && after.diff_check.ok,
  };
  return {
    ok: Object.values(checks).every(Boolean) && changedTrackedPaths.length === 0,
    checks,
    changed_tracked_paths: changedTrackedPaths,
    before: summarizeTrackedBoundary(before),
    after: summarizeTrackedBoundary(after),
  };
}

function commandPath(name) {
  const lookup = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(lookup, [name], { encoding: "utf8" });
  const resolved = result.stdout?.split(/\r?\n/).find(Boolean);
  if (result.status !== 0 || !resolved) {
    throw new Error(`unable to resolve ${name}`);
  }
  return resolved.trim();
}

function resolveTools() {
  const npm = process.env.npm_execpath || commandPath(process.platform === "win32" ? "npm.cmd" : "npm");
  let npx;
  if (npm.endsWith("npm-cli.js")) {
    const candidate = path.join(path.dirname(npm), "npx-cli.js");
    npx = fs.existsSync(candidate) ? candidate : undefined;
  }
  return {
    npm,
    npx: npx || commandPath(process.platform === "win32" ? "npx.cmd" : "npx"),
  };
}

function runExecutable(command, args, options) {
  const commandArgs = command.endsWith(".js") ? [command, ...args] : args;
  const executable = command.endsWith(".js") ? process.execPath : command;
  return spawnSync(executable, commandArgs, options);
}

function writeLog(receiptDir, id, result) {
  const logDir = path.join(receiptDir, "logs");
  fs.mkdirSync(logDir, { recursive: true });
  const safeId = id.replace(/[^a-zA-Z0-9_.-]+/g, "-");
  fs.writeFileSync(
    path.join(logDir, `${safeId}.log`),
    [`stdout:`, result.stdout || "", ``, `stderr:`, result.stderr || "", ``].join("\n"),
    "utf8",
  );
}

function canonicalEntryMap(manifest) {
  const grouped = new Map();
  for (const entry of manifest.aliases) {
    const current = grouped.get(entry.canonical);
    if (current) {
      current.aliases.push(entry.alias);
      if (current.entrypoint !== entry.entrypoint) {
        throw new Error(`canonical smoke ${entry.canonical} has inconsistent entrypoints`);
      }
    } else {
      grouped.set(entry.canonical, { ...entry, aliases: [entry.alias] });
    }
  }
  return grouped;
}

function validateCiTopology(manifest, grouped) {
  const topology = manifest.ci_topology;
  if (!topology || topology.decision_ref !== "root:dec-91" || topology.runtime_decision_ref !== "root:dec-98") {
    throw new Error("smoke manifest CI topology must remain bound to root:dec-91 and runtime root:dec-98");
  }
  if (
    JSON.stringify(topology.fast?.runtimes) !== JSON.stringify([
      { id: "minimum", version: "24.18.0" },
      { id: "floating", version: "24.x" },
    ])
  ) {
    throw new Error("fast CI runtime matrix must be Node 24.18.0 and 24.x");
  }
  for (const [field, value] of [
    ["fast timeout", topology.fast?.timeout_minutes],
    ["full prepare timeout", topology.full?.prepare_timeout_minutes],
    ["full shard timeout", topology.full?.shard_timeout_minutes],
    ["full aggregate timeout", topology.full?.aggregate_timeout_minutes],
    ["full Linux filesystem timeout", topology.full?.linux_filesystem?.timeout_minutes],
    ["fast artifact retention", topology.fast?.artifact_retention_days],
    ["full context retention", topology.full?.context_retention_days],
    ["full evidence retention", topology.full?.evidence_retention_days],
  ]) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`smoke manifest has invalid ${field}`);
    }
  }
  if (
    topology.full.runtime !== "24.18.0" ||
    topology.full.exact_sha_pattern !== "^[a-f0-9]{40}$"
  ) {
    throw new Error("full CI must use Node 24.18.0 and a strict lowercase full SHA");
  }
  if (
    topology.full.linux_filesystem?.state !== "unqualified_stub" ||
    topology.full.linux_filesystem?.qualification_scope !== "portable-node-installed-contracts" ||
    topology.full.linux_filesystem?.test_ref !== "root:test-487" ||
    JSON.stringify(topology.full.linux_filesystem?.runners) !== JSON.stringify([
      { id: "x64", label: "ubuntu-24.04" },
      { id: "arm64", label: "ubuntu-24.04-arm" },
    ])
  ) {
    throw new Error("full Linux filesystem qualification must remain an explicit Test487 x64/ARM64 unqualified stub");
  }
  const canonicalIds = [...grouped.keys()].sort();
  const fastIds = topology.fast.canonical;
  if (
    !Array.isArray(fastIds) ||
    fastIds.length !== 13 ||
    new Set(fastIds).size !== fastIds.length ||
    fastIds.some((id) => !grouped.has(id))
  ) {
    throw new Error("fast CI must contain 13 unique canonical smoke identities");
  }
  if (!Array.isArray(topology.full.shards) || topology.full.shards.length !== 5) {
    throw new Error("full CI must contain five shards");
  }
  const shardIds = new Set();
  const fullIds = [];
  for (const shard of topology.full.shards) {
    if (
      typeof shard.id !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(shard.id) ||
      shardIds.has(shard.id) ||
      !Array.isArray(shard.canonical) ||
      shard.canonical.length === 0
    ) {
      throw new Error(`full CI has invalid shard ${shard.id || "unknown"}`);
    }
    shardIds.add(shard.id);
    fullIds.push(...shard.canonical);
  }
  const fullUnique = [...new Set(fullIds)].sort();
  if (
    fullIds.length !== canonicalIds.length ||
    fullUnique.length !== canonicalIds.length ||
    JSON.stringify(fullUnique) !== JSON.stringify(canonicalIds)
  ) {
    throw new Error("full CI shards must partition all 46 canonical smokes exactly once");
  }
  const siteIds = canonicalIds.filter((id) => grouped.get(id).prerequisites.includes("site_profile_cache"));
  const siteShard = topology.full.shards.find((shard) => siteIds.every((id) => shard.canonical.includes(id)));
  if (!siteShard) {
    throw new Error("all site profile smokes must share one full CI shard");
  }
}

function validateManifest(manifest, packageJson) {
  if (packageJson.engines?.node !== ">=24.18.0 <25") {
    throw new Error("release runtime must match the package Node range >=24.18.0 <25");
  }
  if (manifest.schema_version !== 1 || !Array.isArray(manifest.aliases)) {
    throw new Error("unsupported smoke manifest");
  }
  if (manifest.aliases.length !== manifest.alias_count || manifest.alias_count !== 47) {
    throw new Error(`smoke manifest must contain 47 aliases, got ${manifest.aliases.length}`);
  }
  const packageAliases = Object.keys(packageJson.scripts || {}).filter((name) => name.startsWith("smoke:")).sort();
  const manifestAliases = manifest.aliases.map((entry) => entry.alias).sort();
  if (JSON.stringify(packageAliases) !== JSON.stringify(manifestAliases)) {
    throw new Error("smoke manifest aliases do not match package.json");
  }
  const canonical = new Set();
  for (const entry of manifest.aliases) {
    for (const field of ["alias", "canonical", "entrypoint", "subsystem"]) {
      if (typeof entry[field] !== "string" || !entry[field]) {
        throw new Error(`smoke manifest ${entry.alias || "entry"} is missing ${field}`);
      }
    }
    if (!Array.isArray(entry.prerequisites) || entry.prerequisites.length === 0) {
      throw new Error(`smoke manifest ${entry.alias} is missing prerequisites`);
    }
    if (!Array.isArray(entry.environment_profiles) || entry.environment_profiles.length === 0) {
      throw new Error(`smoke manifest ${entry.alias} is missing environment profiles`);
    }
    if (!Number.isInteger(entry.timeout_seconds) || entry.timeout_seconds <= 0) {
      throw new Error(`smoke manifest ${entry.alias} has invalid timeout`);
    }
    if (!fs.existsSync(path.join(repoRoot, entry.entrypoint))) {
      throw new Error(`smoke manifest ${entry.alias} entrypoint is missing`);
    }
    canonical.add(entry.canonical);
    const packageScript = packageJson.scripts[entry.alias];
    if (entry.alias === "smoke:bundle-import") {
      if (packageScript !== "npm run smoke:subgraph" || entry.canonical !== "smoke:subgraph") {
        throw new Error("smoke:bundle-import must remain a compatibility alias of smoke:subgraph");
      }
    } else if (!packageScript.includes(`node ${entry.entrypoint}`)) {
      throw new Error(`${entry.alias} package command does not match its manifest entrypoint`);
    }
  }
  if (canonical.size !== manifest.canonical_execution_count || canonical.size !== 46) {
    throw new Error(`smoke manifest must contain 46 canonical executions, got ${canonical.size}`);
  }
  const profiles = manifest.release_profiles;
  const siteCount = [...canonicalEntryMap(manifest).values()].filter((entry) => entry.prerequisites.includes("site_profile_cache")).length;
  if (profiles?.decision_ref !== "root:dec-100" || profiles.package?.canonical_execution_count !== 37 ||
      profiles.package?.excluded_prerequisite !== "site_profile_cache" ||
      JSON.stringify(profiles.package?.dependency_domains) !== JSON.stringify(["root"]) ||
      profiles.repository?.canonical_execution_count !== 46 ||
      JSON.stringify(profiles.repository?.dependency_domains) !== JSON.stringify(["root", "docs", "mdkg-dev"]) || siteCount !== 9) {
    throw new Error("release profiles must preserve the Dec100 package37 / repository46 split and nine website smokes");
  }
  validateCiTopology(manifest, canonicalEntryMap(manifest));
}

function canonicalEntries(manifest, mode, shardId, scope = scopeForMode(mode)) {
  scope = releaseScope(scope);
  const grouped = canonicalEntryMap(manifest);
  if (mode === "prepublish") {
    return [...grouped.values()].filter((entry) => scope === "repository" || !entry.prerequisites.includes("site_profile_cache"));
  }
  if (mode === "ci") {
    return manifest.ci_topology.fast.canonical.map((id) => grouped.get(id));
  }
  if (mode === "full-prepare") {
    return [];
  }
  if (mode === "full-shard") {
    const shard = manifest.ci_topology.full.shards.find((item) => item.id === shardId);
    if (!shard) {
      throw new Error(`unknown full CI shard: ${shardId || "missing"}`);
    }
    return shard.canonical.map((id) => grouped.get(id));
  }
  throw new Error(`unsupported release ladder mode: ${mode}`);
}

function createProxyBin(receiptDir) {
  const binDir = path.join(receiptDir, "bin");
  const proxyPath = path.join(repoRoot, "scripts", "npm-smoke-proxy.js");
  fs.mkdirSync(binDir, { recursive: true });
  for (const tool of ["npm", "npx"]) {
    if (process.platform === "win32") {
      fs.writeFileSync(
        path.join(binDir, `${tool}.cmd`),
        `@\"${process.execPath}\" \"${proxyPath}\" ${tool} %*\r\n`,
        "utf8",
      );
    } else {
      const wrapper = path.join(binDir, tool);
      fs.writeFileSync(
        wrapper,
        `#!/usr/bin/env node\nprocess.argv.splice(2, 0, ${JSON.stringify(tool)});\nrequire(${JSON.stringify(proxyPath)});\n`,
        { encoding: "utf8", mode: 0o755 },
      );
    }
  }
  return binDir;
}

function releaseEnvironment(receiptDir, tools, scope = "repository") {
  const env = {
    ...process.env,
    MDKG_RELEASE_SCOPE: releaseScope(scope),
    GIT_OPTIONAL_LOCKS: "0",
    NPM_CONFIG_OFFLINE: "true",
    npm_config_offline: "true",
    NPM_CONFIG_AUDIT: "false",
    npm_config_audit: "false",
    NPM_CONFIG_FUND: "false",
    npm_config_fund: "false",
    NPM_CONFIG_CACHE: path.join(receiptDir, "npm-cache"),
    npm_config_cache: path.join(receiptDir, "npm-cache"),
    NPM_CONFIG_REGISTRY: "http://127.0.0.1:9",
    npm_config_registry: "http://127.0.0.1:9",
    TMPDIR: path.join(receiptDir, "tmp"),
    MDKG_BUILD_RECEIPT_DIR: receiptDir,
    MDKG_REAL_NPM: tools.npm,
    MDKG_REAL_NPX: tools.npx,
    MDKG_REPO_ROOT: repoRoot,
    MDKG_SMOKE_MANIFEST: manifestPath,
    MDKG_SITE_CACHE_DIR: path.join(receiptDir, "site-cache"),
    MDKG_COVERAGE_DIR: path.join(receiptDir, "coverage"),
  };
  for (const key of profileEnvKeys) {
    delete env[key];
  }
  for (const directory of [env.NPM_CONFIG_CACHE, env.TMPDIR, env.MDKG_SITE_CACHE_DIR]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  return env;
}

function writeFullContext(contextDir, tarballPath, artifactHash, trackedBefore, root = repoRoot) {
  if (!contextDir) {
    throw new Error("full-prepare requires MDKG_RELEASE_CONTEXT_DIR");
  }
  contextDir = path.resolve(contextDir);
  const distSource = path.join(root, "dist");
  if (!fs.existsSync(distSource)) {
    throw new Error("full release context is missing built dist output");
  }
  if (within(contextDir, path.resolve(tarballPath)) || within(distSource, contextDir) || within(contextDir, distSource)) {
    throw new Error("full release context output overlaps its package or build input");
  }
  verifyArtifactFile(tarballPath, artifactHash);
  const distIdentity = hashDirectory(distSource);
  prepareEmptyDirectory(contextDir, { forbiddenRoots: [root] });
  const contextTarball = path.join(contextDir, "package.tgz");
  copyVerifiedArtifact(tarballPath, contextTarball, artifactHash);
  const contextDist = path.join(contextDir, "dist");
  fs.cpSync(distSource, contextDist, { recursive: true, force: false, errorOnExist: true });
  if (JSON.stringify(hashDirectory(contextDist)) !== JSON.stringify(distIdentity) ||
      JSON.stringify(hashDirectory(distSource)) !== JSON.stringify(distIdentity)) {
    throw new Error("full release context build changed during preparation");
  }
  const context = {
    schema_version: 1,
    decision_ref: "root:dec-91",
    source_head: trackedBefore.head,
    package: {
      file: "package.tgz",
      sha256: artifactHash,
      bytes: fs.statSync(contextTarball).size,
    },
    dist: {
      directory: "dist",
      ...distIdentity,
    },
  };
  verifyArtifactFile(tarballPath, artifactHash);
  verifyArtifactFile(contextTarball, artifactHash);
  fs.writeFileSync(path.join(contextDir, "context.json"), `${JSON.stringify(context, null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
  return context;
}

function loadFullContext(contextDir, expectedHead, root = repoRoot) {
  if (!contextDir) {
    throw new Error("full-shard requires MDKG_RELEASE_CONTEXT_DIR");
  }
  assertDirectoryChain(contextDir);
  const contextPath = path.join(contextDir, "context.json");
  if (!fs.existsSync(contextPath)) {
    throw new Error("full release context manifest is missing");
  }
  const context = readRegularJsonFile(contextPath);
  if (
    context.schema_version !== 1 ||
    context.decision_ref !== "root:dec-91" ||
    context.source_head !== expectedHead ||
    context.package?.file !== "package.tgz" ||
    !/^[a-f0-9]{64}$/.test(context.package.sha256 || "") ||
    !Number.isInteger(context.package.bytes) ||
    context.package.bytes <= 0 ||
    context.dist?.directory !== "dist" ||
    !/^[a-f0-9]{64}$/.test(context.dist.sha256 || "") ||
    !Number.isInteger(context.dist.file_count) ||
    context.dist.file_count <= 0
  ) {
    throw new Error("full release context identity does not match the checked-out source");
  }
  const tarballPath = path.join(contextDir, context.package.file || "");
  let artifact;
  try { artifact = verifyArtifactFile(tarballPath, context.package.sha256); }
  catch (error) { throw new Error(`full release context package hash or size mismatch: ${error.message}`); }
  if (artifact.bytes !== context.package.bytes) throw new Error("full release context package hash or size mismatch");
  const contextDist = path.join(contextDir, context.dist?.directory || "");
  if (!fs.existsSync(contextDist)) {
    throw new Error("full release context dist output is missing");
  }
  const contextDistIdentity = hashDirectory(contextDist);
  if (
    contextDistIdentity.sha256 !== context.dist.sha256 ||
    contextDistIdentity.file_count !== context.dist.file_count
  ) {
    throw new Error("full release context dist hash or file count mismatch");
  }
  const targetDist = path.join(root, "dist");
  let targetExists;
  try { fs.lstatSync(targetDist); targetExists = true; }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (targetExists) {
    const existingIdentity = hashDirectory(targetDist);
    if (existingIdentity.sha256 !== context.dist.sha256 || existingIdentity.file_count !== context.dist.file_count) {
      throw new Error("existing dist differs from the qualified context; preserve it and use a fresh checkout");
    }
  } else {
    prepareEmptyDirectory(targetDist, { forbiddenRoots: [root] });
    fs.cpSync(contextDist, targetDist, { recursive: true, force: false, errorOnExist: true });
  }
  const restoredIdentity = hashDirectory(targetDist);
  if (
    restoredIdentity.sha256 !== context.dist.sha256 ||
    restoredIdentity.file_count !== context.dist.file_count
  ) {
    throw new Error("restored full release context does not match its identity");
  }
  verifyArtifactFile(tarballPath, context.package.sha256);
  return {
    context,
    tarballPath,
    artifactHash: context.package.sha256,
  };
}

function runner(mode, receiptDir, deadline, trackedBefore = captureTrackedBoundary(repoRoot)) {
  const scope = scopeForMode(mode);
  const retained = retainedOptions();
  if (retained && mode !== "prepublish") throw new Error("retained candidate inputs are supported only by local prepublish");
  // Reject stale/partial admission before builds or consuming any candidate.
  const admitted = retained ? admitRetainedCandidate(repoRoot, retained, { verifyBuild: false }) : undefined;
  const qualificationInputs = captureQualificationInputs(repoRoot);
  const tools = resolveTools();
  const env = releaseEnvironment(receiptDir, tools, scope);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  validateManifest(manifest, packageJson);
  const gateReceipts = [];
  const smokeReceipts = [];
  let coverageSummary;
  let fullContext;
  const progressPath = path.join(receiptDir, "progress.json");
  const isFullShard = mode === "full-shard";
  const shardId = isFullShard ? process.env.MDKG_RELEASE_SHARD : undefined;

  function writeProgress() {
    fs.writeFileSync(progressPath, `${JSON.stringify({
      mode,
      gates: gateReceipts,
      smokes: smokeReceipts,
    }, null, 2)}\n`, "utf8");
  }

  function remainingMs(limitMs) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      throw new Error(`${mode} release ladder exceeded its time budget`);
    }
    return Math.min(limitMs, remaining);
  }

  function run(id, command, args, options = {}) {
    const started = Date.now();
    const result = runExecutable(command, args, {
      cwd: repoRoot,
      env: options.env || env,
      encoding: "utf8",
      stdio: "pipe",
      timeout: remainingMs(options.timeoutMs || 15 * 60 * 1000),
    });
    const receipt = {
      id,
      command: [command, ...args].join(" "),
      exit_code: result.status,
      duration_ms: Date.now() - started,
      timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
    };
    if (result.status !== 0) receipt.failure_evidence = failureEvidence(result);
    writeLog(receiptDir, id, result);
    (options.smoke ? smokeReceipts : gateReceipts).push(receipt);
    writeProgress();
    if (result.status !== 0) {
      throw new Error(`${id} failed with exit ${result.status}${receipt.timed_out ? " after timeout" : ""}`);
    }
    return result;
  }

  run("dependency-preflight", process.execPath, [path.join(repoRoot, "scripts", "dependency-boundary.js"), "preflight", "--json"]);
  if (!isFullShard) {
    run("coverage", tools.npm, ["run", "test:coverage"], { timeoutMs: 30 * 60 * 1000 });
    const coverageSummaryPath = path.join(env.MDKG_COVERAGE_DIR, "summary.json");
    if (!fs.existsSync(coverageSummaryPath)) {
      throw new Error("coverage gate did not produce its concise summary");
    }
    coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, "utf8"));
    if (!coverageSummary.ok || coverageSummary.thresholds === null) {
      throw new Error("coverage gate did not produce a passing thresholded receipt");
    }
    run("cli-check", tools.npm, ["run", "cli:check:built"]);
    run("cli-contract", tools.npm, ["run", "cli:contract:built"]);
    run("docs-check", tools.npm, ["run", "docs:check:built"]);
    run("graph-validate", process.execPath, [path.join(repoRoot, "dist", "cli.js"), "validate"]);
    run("security-verify", tools.npm, ["run", "security:verify"]);
  }

  let tarballPath;
  let artifactHash;
  let retainedReceipt;
  if (isFullShard) {
    const loaded = loadFullContext(process.env.MDKG_RELEASE_CONTEXT_DIR, trackedBefore.head);
    tarballPath = loaded.tarballPath;
    artifactHash = loaded.artifactHash;
    fullContext = loaded.context;
  } else if (retained) {
    retainedReceipt = admitRetainedCandidate(repoRoot, retained, { previous: admitted });
    tarballPath = retained.tarball;
    artifactHash = retained.sha256;
  } else {
    const artifactDir = path.join(receiptDir, "artifact");
    fs.mkdirSync(artifactDir, { recursive: true });
    const packed = run("package-artifact", tools.npm, [
      "pack",
      "--silent",
      "--dry-run=false",
      "--pack-destination",
      artifactDir,
    ], { timeoutMs: 15 * 60 * 1000 });
    const tarballName = packed.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).pop();
    if (!tarballName) {
      throw new Error("npm pack did not report the immutable package artifact");
    }
    tarballPath = path.join(artifactDir, path.basename(tarballName));
    if (!fs.existsSync(tarballPath)) {
      throw new Error(`immutable package artifact is missing: ${tarballPath}`);
    }
    artifactHash = hashFile(tarballPath);
    fs.chmodSync(tarballPath, 0o444);
    fs.writeFileSync(path.join(receiptDir, "artifact.json"), `${JSON.stringify({
      path: tarballPath,
      sha256: artifactHash,
      bytes: fs.statSync(tarballPath).size,
      mode: "0444",
    }, null, 2)}\n`, "utf8");
    if (mode === "full-prepare") {
      fullContext = writeFullContext(
        process.env.MDKG_RELEASE_CONTEXT_DIR,
        tarballPath,
        artifactHash,
        trackedBefore,
      );
    }
  }

  const proxyBin = createProxyBin(receiptDir);
  const smokeEnv = {
    ...env,
    PATH: `${proxyBin}${path.delimiter}${env.PATH || ""}`,
    npm_execpath: path.join(proxyBin, process.platform === "win32" ? "npm.cmd" : "npm"),
    MDKG_SMOKE_TARBALL: tarballPath,
    MDKG_SMOKE_TARBALL_SHA256: artifactHash,
  };
  const executions = canonicalEntries(manifest, mode, shardId, scope);
  for (const entry of executions) {
    const { result, verification } = withVerifiedArtifact(tarballPath, artifactHash, () => run(
      entry.canonical,
      process.execPath,
      [path.join(repoRoot, entry.entrypoint)],
      {
        env: { ...smokeEnv, MDKG_SMOKE_ID: entry.canonical },
        timeoutMs: entry.timeout_seconds * 1000,
        smoke: true,
      },
    ));
    const last = smokeReceipts[smokeReceipts.length - 1];
    last.aliases = entry.aliases;
    last.entrypoint = entry.entrypoint;
    last.artifact_required = entry.prerequisites.includes("immutable_package_artifact");
    last.artifact_verification = verification;
    writeProgress();
    process.stdout.write(`smoke passed: ${entry.canonical} (${last.duration_ms}ms)\n`);
    void result;
  }
  if (!isFullShard) {
    run("publish-readiness", process.execPath, [path.join(repoRoot, "scripts", "assert-publish-ready.js")]);
  }

  const buildEvents = readJsonLines(path.join(receiptDir, "build-events.jsonl"));
  const artifactUsages = readJsonLines(path.join(receiptDir, "artifact-usages.jsonl"));
  const rootBuildCount = buildEvents.filter((event) => event.kind === "root").length;
  if (rootBuildCount > 3) {
    throw new Error(`root build count ${rootBuildCount} exceeds limit 3`);
  }
  const siteBuilds = {};
  for (const owner of ["docs", "mdkg-dev"]) {
    const ownerEvents = buildEvents.filter((event) => event.kind === "site" && event.owner === owner);
    const declaredProfiles = manifest.profiles[owner].map((profile) => profile.id).sort();
    const observedProfiles = [...new Set(ownerEvents.map((event) => event.profile))].sort();
    const shardRequiresOwner = isFullShard && executions.some((entry) =>
      entry.environment_profiles.some((profile) => profile.startsWith(`${owner}:`)),
    );
    if (
      ((mode === "prepublish" && scope === "repository") || shardRequiresOwner) &&
      JSON.stringify(declaredProfiles) !== JSON.stringify(observedProfiles)
    ) {
      throw new Error(`${owner} profile coverage mismatch: declared ${declaredProfiles}, observed ${observedProfiles}`);
    }
    const actualByProfile = Object.fromEntries(declaredProfiles.map((profile) => [
      profile,
      ownerEvents.filter((event) => event.profile === profile && !event.cache_hit).length,
    ]));
    if (Object.values(actualByProfile).some((count) => count > 1)) {
      throw new Error(`${owner} performed more than one actual build for a normalized profile`);
    }
    siteBuilds[owner] = {
      declared_profiles: declaredProfiles,
      observed_profiles: observedProfiles,
      actual_by_profile: actualByProfile,
      cache_hits: ownerEvents.filter((event) => event.cache_hit).length,
    };
  }
  for (const smoke of smokeReceipts.filter((entry) => entry.artifact_required)) {
    const usages = artifactUsages.filter((usage) => usage.smoke === smoke.id);
    if (usages.length === 0 || usages.some((usage) => usage.sha256 !== artifactHash)) {
      throw new Error(`${smoke.id} did not consume the immutable package artifact`);
    }
  }
  const finalArtifact = verifyArtifactFile(tarballPath, artifactHash);
  if (retained) admitRetainedCandidate(repoRoot, retained, { previous: admitted });
  if (captureQualificationInputs(repoRoot).sha256 !== qualificationInputs.sha256) {
    throw new Error("qualification harness inputs changed during the release ladder");
  }
  const trackedAfter = captureTrackedBoundary(repoRoot);
  const gitBoundary = compareTrackedBoundaries(trackedBefore, trackedAfter);
  if (!gitBoundary.ok) {
    throw new Error(
      `release ladder changed Git-visible state: ${gitBoundary.changed_tracked_paths.join(", ") || "status, branch, HEAD, selected goal, lockfile, or diff-check invariant"}`,
    );
  }

  return {
    action: "release-ladder",
    ok: true,
    mode,
    scope,
    deferred: scope === "package" ? { website_canonical_count: 9, hosted_ci: "unverified", owners: ["root:epic-258", "root:epic-257"] } : undefined,
    shard: shardId,
    offline: true,
    registry: env.NPM_CONFIG_REGISTRY,
    receipt_dir: receiptDir,
    alias_count: executions.reduce((sum, entry) => sum + entry.aliases.length, 0),
    canonical_execution_count: executions.length,
    artifact: {
      path: tarballPath,
      sha256: artifactHash,
      bytes: finalArtifact.bytes,
      final_verified_sha256: finalArtifact.sha256,
      retained_admission: retainedReceipt,
    },
    build_counts: {
      root: rootBuildCount,
      sites: siteBuilds,
    },
    artifact_usage_count: artifactUsages.length,
    qualification_inputs: qualificationInputs,
    coverage: coverageSummary,
    full_context: fullContext,
    git_boundary: gitBoundary,
    gates: gateReceipts,
    smokes: smokeReceipts,
  };
}

// Preserve the original failure/outcome and full log. A bounded excerpt in the
// ordinary progress receipt makes CI diagnosis possible without a huge V8 ZIP.
function failureEvidence(result, limit = 8192) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 8192) throw new Error("failure excerpt limit must be 1..8192 bytes");
  const capture = (raw) => {
    const bytes = Buffer.from(String(raw ?? ""), "utf8");
    let start = Math.max(0, bytes.length - limit);
    while (start < bytes.length && (bytes[start] & 0xc0) === 0x80) start++;
    return { bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      truncated: start > 0, tail_utf8: bytes.subarray(start).toString("utf8") };
  };
  return { kind: "bounded-failure-output-excerpt", limit_bytes_per_stream: limit,
    status: result.status, signal: result.signal ?? null, error_code: result.error?.code ?? null,
    stdout: capture(result.stdout), stderr: capture(result.stderr) };
}

function main() {
  const mode = process.argv[2];
  if (!["ci", "prepublish", "full-prepare", "full-shard"].includes(mode)) {
    process.stderr.write("Usage: node scripts/release-ladder.js <ci|prepublish|full-prepare|full-shard>\n");
    return 2;
  }
  try {
    releaseScope(); scopeForMode(mode);
    const retained = retainedOptions();
    if (retained && mode !== "prepublish") throw new Error("retained candidate inputs require local prepublish");
  }
  catch (error) { process.stderr.write(`${error.message}\n`); return 2; }
  const started = Date.now();
  const timeoutMinutes = {
    ci: 15,
    prepublish: 60,
    "full-prepare": 30,
    "full-shard": 20,
  }[mode];
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const base = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
  let receiptDir;
  try {
    // A configured collection directory grants creation of a fresh run, never
    // replacement of old receipts. CI's workflow-start.json remains untouched.
    receiptDir = createRunDirectory(
      process.env.MDKG_RELEASE_RECEIPT_DIR ?? path.join(fs.realpathSync(base), `mdkg-${mode}-release`),
      { forbiddenRoots: [repoRoot] },
    );
  } catch (error) {
    process.stderr.write(`release receipt directory refused: ${error.message}\n`);
    return 1;
  }
  let receipt;
  let trackedBefore;
  try {
    trackedBefore = captureTrackedBoundary(repoRoot);
    receipt = runner(mode, receiptDir, started + timeoutMs, trackedBefore);
    receipt.duration_ms = Date.now() - started;
    receipt.within_budget = receipt.duration_ms <= timeoutMs;
  } catch (error) {
    const progressPath = path.join(receiptDir, "progress.json");
    let gitBoundary;
    if (trackedBefore) {
      try {
        gitBoundary = compareTrackedBoundaries(trackedBefore, captureTrackedBoundary(repoRoot));
      } catch (boundaryError) {
        gitBoundary = {
          ok: false,
          error: boundaryError instanceof Error ? boundaryError.message : String(boundaryError),
        };
      }
    }
    receipt = {
      action: "release-ladder",
      ok: false,
      mode,
      offline: true,
      receipt_dir: receiptDir,
      duration_ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
      progress: fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : undefined,
      git_boundary: gitBoundary,
    };
  }
  fs.writeFileSync(path.join(receiptDir, "receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  return receipt.ok ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  releaseEnvironment,
  canonicalEntryMap,
  canonicalEntries,
  captureTrackedBoundary,
  compareTrackedBoundaries,
  hashDirectory,
  loadFullContext,
  main,
  summarizeTrackedBoundary,
  validateCiTopology,
  validateManifest,
  failureEvidence,
  writeFullContext,
};
