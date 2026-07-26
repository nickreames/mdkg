#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { readJsonLines } = require("./build-receipts");

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

function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function runGit(root, args) {
  const result = spawnSync("git", ["-C", root, ...args], {
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

function validateManifest(manifest, packageJson) {
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
    for (const field of ["alias", "canonical", "entrypoint", "subsystem", "future_ci_tier"]) {
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
}

function canonicalEntries(manifest, mode) {
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
  const entries = [...grouped.values()];
  return mode === "ci" ? entries.filter((entry) => entry.future_ci_tier === "current") : entries;
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

function releaseEnvironment(receiptDir, tools) {
  const env = {
    ...process.env,
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

function runner(mode, receiptDir, deadline, trackedBefore = captureTrackedBoundary(repoRoot)) {
  const tools = resolveTools();
  const env = releaseEnvironment(receiptDir, tools);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  validateManifest(manifest, packageJson);
  const gateReceipts = [];
  const smokeReceipts = [];
  let coverageSummary;
  const progressPath = path.join(receiptDir, "progress.json");

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
    writeLog(receiptDir, id, result);
    (options.smoke ? smokeReceipts : gateReceipts).push(receipt);
    writeProgress();
    if (result.status !== 0) {
      throw new Error(`${id} failed with exit ${result.status}${receipt.timed_out ? " after timeout" : ""}`);
    }
    return result;
  }

  run("dependency-preflight", process.execPath, [path.join(repoRoot, "scripts", "dependency-boundary.js"), "preflight", "--json"]);
  if (mode === "prepublish") {
    run("coverage", tools.npm, ["run", "test:coverage"], { timeoutMs: 30 * 60 * 1000 });
    const coverageSummaryPath = path.join(env.MDKG_COVERAGE_DIR, "summary.json");
    if (!fs.existsSync(coverageSummaryPath)) {
      throw new Error("coverage gate did not produce its concise summary");
    }
    coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, "utf8"));
    if (!coverageSummary.ok || coverageSummary.thresholds === null) {
      throw new Error("coverage gate did not produce a passing thresholded receipt");
    }
  } else {
    run("test", tools.npm, ["run", "test"], { timeoutMs: 20 * 60 * 1000 });
  }
  run("cli-check", tools.npm, ["run", "cli:check:built"]);
  run("cli-contract", tools.npm, ["run", "cli:contract:built"]);
  run("docs-check", tools.npm, ["run", "docs:check:built"]);
  if (mode === "prepublish") {
    run("graph-validate", process.execPath, [path.join(repoRoot, "dist", "cli.js"), "validate"]);
  }
  run("security-verify", tools.npm, ["run", "security:verify"]);

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
  const tarballPath = path.join(artifactDir, path.basename(tarballName));
  if (!fs.existsSync(tarballPath)) {
    throw new Error(`immutable package artifact is missing: ${tarballPath}`);
  }
  const artifactHash = hashFile(tarballPath);
  fs.chmodSync(tarballPath, 0o444);
  fs.writeFileSync(path.join(receiptDir, "artifact.json"), `${JSON.stringify({
    path: tarballPath,
    sha256: artifactHash,
    bytes: fs.statSync(tarballPath).size,
    mode: "0444",
  }, null, 2)}\n`, "utf8");

  const proxyBin = createProxyBin(receiptDir);
  const smokeEnv = {
    ...env,
    PATH: `${proxyBin}${path.delimiter}${env.PATH || ""}`,
    npm_execpath: path.join(proxyBin, process.platform === "win32" ? "npm.cmd" : "npm"),
    MDKG_SMOKE_TARBALL: tarballPath,
    MDKG_SMOKE_TARBALL_SHA256: artifactHash,
  };
  const executions = canonicalEntries(manifest, mode);
  for (const entry of executions) {
    const result = run(
      entry.canonical,
      process.execPath,
      [path.join(repoRoot, entry.entrypoint)],
      {
        env: { ...smokeEnv, MDKG_SMOKE_ID: entry.canonical },
        timeoutMs: entry.timeout_seconds * 1000,
        smoke: true,
      },
    );
    const last = smokeReceipts[smokeReceipts.length - 1];
    last.aliases = entry.aliases;
    last.entrypoint = entry.entrypoint;
    last.artifact_required = entry.prerequisites.includes("immutable_package_artifact");
    writeProgress();
    process.stdout.write(`smoke passed: ${entry.canonical} (${last.duration_ms}ms)\n`);
    void result;
  }
  run("publish-readiness", process.execPath, [path.join(repoRoot, "scripts", "assert-publish-ready.js")]);

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
    if (mode === "prepublish" && JSON.stringify(declaredProfiles) !== JSON.stringify(observedProfiles)) {
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
    offline: true,
    registry: env.NPM_CONFIG_REGISTRY,
    receipt_dir: receiptDir,
    alias_count: mode === "prepublish" ? manifest.alias_count : executions.reduce((sum, entry) => sum + entry.aliases.length, 0),
    canonical_execution_count: executions.length,
    artifact: {
      path: tarballPath,
      sha256: artifactHash,
      bytes: fs.statSync(tarballPath).size,
    },
    build_counts: {
      root: rootBuildCount,
      sites: siteBuilds,
    },
    artifact_usage_count: artifactUsages.length,
    coverage: coverageSummary,
    git_boundary: gitBoundary,
    gates: gateReceipts,
    smokes: smokeReceipts,
  };
}

function main() {
  const mode = process.argv[2];
  if (mode !== "ci" && mode !== "prepublish") {
    process.stderr.write("Usage: node scripts/release-ladder.js <ci|prepublish>\n");
    return 2;
  }
  const started = Date.now();
  const timeoutMs = mode === "ci" ? 30 * 60 * 1000 : 60 * 60 * 1000;
  const base = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
  const receiptDir = path.resolve(
    process.env.MDKG_RELEASE_RECEIPT_DIR ||
      path.join(base, `mdkg-${mode}-release-${Date.now()}-${process.pid}`),
  );
  fs.mkdirSync(receiptDir, { recursive: true });
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
  canonicalEntries,
  captureTrackedBoundary,
  compareTrackedBoundaries,
  main,
  summarizeTrackedBoundary,
  validateManifest,
};
