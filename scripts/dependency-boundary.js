#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const DEFAULT_REPO_ROOT = path.resolve(__dirname, "..");
const BOOTSTRAP_COMMAND = "npm run deps:bootstrap";
const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];
const DEPENDENCY_DOMAINS = [
  {
    id: "root",
    directory: ".",
    package_json: "package.json",
    lockfile: "package-lock.json",
    bootstrap_command: "npm ci",
  },
  {
    id: "docs",
    directory: "docs",
    package_json: "docs/package.json",
    lockfile: "docs/package-lock.json",
    bootstrap_command: "npm ci --prefix docs",
  },
  {
    id: "mdkg-dev",
    directory: "mdkg-dev",
    package_json: "mdkg-dev/package.json",
    lockfile: "mdkg-dev/package-lock.json",
    bootstrap_command: "npm ci --prefix mdkg-dev",
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeSlashes(value) {
  return value.split(path.sep).join("/");
}

function dependencyMap(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function manifestLockMismatches(manifest, lockRoot) {
  const mismatches = [];
  for (const field of DEPENDENCY_FIELDS) {
    const declared = dependencyMap(manifest[field]);
    const locked = dependencyMap(lockRoot[field]);
    const names = [...new Set([...Object.keys(declared), ...Object.keys(locked)])].sort();
    for (const name of names) {
      if (declared[name] !== locked[name]) {
        mismatches.push({
          field,
          package: name,
          manifest: declared[name] ?? null,
          lockfile: locked[name] ?? null,
        });
      }
    }
  }
  return mismatches;
}

function scanNodeModules(ownerRoot, relativeNodeModules = "node_modules", found = new Map()) {
  const absoluteNodeModules = path.join(ownerRoot, relativeNodeModules);
  if (!fs.existsSync(absoluteNodeModules)) {
    return found;
  }

  for (const entry of fs.readdirSync(absoluteNodeModules, { withFileTypes: true })) {
    if (entry.name === ".bin" || entry.name.startsWith(".")) {
      continue;
    }
    if (entry.name.startsWith("@") && entry.isDirectory()) {
      const scopeRoot = path.join(absoluteNodeModules, entry.name);
      for (const scopedEntry of fs.readdirSync(scopeRoot, { withFileTypes: true })) {
        if (!scopedEntry.isDirectory() && !scopedEntry.isSymbolicLink()) {
          continue;
        }
        const packagePath = normalizeSlashes(path.join(relativeNodeModules, entry.name, scopedEntry.name));
        recordInstalledPackage(ownerRoot, packagePath, found);
      }
      continue;
    }
    if (!entry.isDirectory() && !entry.isSymbolicLink()) {
      continue;
    }
    const packagePath = normalizeSlashes(path.join(relativeNodeModules, entry.name));
    recordInstalledPackage(ownerRoot, packagePath, found);
  }
  return found;
}

function recordInstalledPackage(ownerRoot, packagePath, found) {
  const packageRoot = path.join(ownerRoot, packagePath);
  const manifestPath = path.join(packageRoot, "package.json");
  let version = null;
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = readJson(manifestPath);
      version = typeof manifest.version === "string" ? manifest.version : null;
    } catch {
      version = null;
    }
  }
  found.set(packagePath, { version, manifest_present: fs.existsSync(manifestPath) });
  scanNodeModules(ownerRoot, normalizeSlashes(path.join(packagePath, "node_modules")), found);
}

function inspectDependencyDomain(repoRoot, domain) {
  const ownerRoot = path.resolve(repoRoot, domain.directory);
  const packagePath = path.resolve(repoRoot, domain.package_json);
  const lockPath = path.resolve(repoRoot, domain.lockfile);
  const issues = [];

  if (!fs.existsSync(packagePath)) {
    issues.push({ kind: "missing_package_json", path: domain.package_json });
  }
  if (!fs.existsSync(lockPath)) {
    issues.push({ kind: "missing_lockfile", path: domain.lockfile });
  }
  if (issues.length > 0) {
    return {
      ...domain,
      ok: false,
      expected_package_count: 0,
      installed_package_count: 0,
      issues,
    };
  }

  let manifest;
  let lockfile;
  try {
    manifest = readJson(packagePath);
  } catch (error) {
    issues.push({ kind: "invalid_package_json", path: domain.package_json, message: error.message });
  }
  try {
    lockfile = readJson(lockPath);
  } catch (error) {
    issues.push({ kind: "invalid_lockfile", path: domain.lockfile, message: error.message });
  }
  if (!manifest || !lockfile) {
    return {
      ...domain,
      ok: false,
      expected_package_count: 0,
      installed_package_count: 0,
      issues,
    };
  }
  if (!lockfile.packages || typeof lockfile.packages !== "object" || Array.isArray(lockfile.packages)) {
    issues.push({ kind: "unsupported_lockfile", path: domain.lockfile });
    return {
      ...domain,
      ok: false,
      expected_package_count: 0,
      installed_package_count: 0,
      issues,
    };
  }

  for (const mismatch of manifestLockMismatches(manifest, lockfile.packages[""] || {})) {
    issues.push({ kind: "manifest_lock_mismatch", ...mismatch });
  }

  const expected = new Map(
    Object.entries(lockfile.packages)
      .filter(([packagePath]) => packagePath.includes("node_modules/") || packagePath.startsWith("node_modules/"))
      .map(([packagePath, metadata]) => [normalizeSlashes(packagePath), metadata || {}]),
  );
  const installed = scanNodeModules(ownerRoot);
  const nodeModulesPath = path.join(ownerRoot, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    issues.push({ kind: "missing_dependency_tree", path: normalizeSlashes(path.relative(repoRoot, nodeModulesPath)) });
  }

  for (const [packagePath, metadata] of expected) {
    const actual = installed.get(packagePath);
    if (!actual) {
      if (!metadata.optional) {
        issues.push({
          kind: "missing_dependency",
          path: normalizeSlashes(path.join(domain.directory, packagePath)),
          expected_version: metadata.version ?? null,
        });
      }
      continue;
    }
    if (!actual.manifest_present) {
      issues.push({
        kind: "missing_dependency_manifest",
        path: normalizeSlashes(path.join(domain.directory, packagePath, "package.json")),
      });
    } else if (metadata.version && actual.version !== metadata.version) {
      issues.push({
        kind: "version_mismatch",
        path: normalizeSlashes(path.join(domain.directory, packagePath)),
        expected_version: metadata.version,
        installed_version: actual.version,
      });
    }
  }

  for (const [packagePath, actual] of installed) {
    if (!expected.has(packagePath)) {
      issues.push({
        kind: "extraneous_dependency",
        path: normalizeSlashes(path.join(domain.directory, packagePath)),
        installed_version: actual.version,
      });
    }
  }

  issues.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  return {
    ...domain,
    ok: issues.length === 0,
    expected_package_count: expected.size,
    installed_package_count: installed.size,
    issues,
  };
}

function inspectDependencyTrees(repoRoot = DEFAULT_REPO_ROOT) {
  const domains = DEPENDENCY_DOMAINS.map((domain) => inspectDependencyDomain(repoRoot, domain));
  const issueCount = domains.reduce((total, domain) => total + domain.issues.length, 0);
  return {
    action: "dependency-preflight",
    ok: issueCount === 0,
    network_access: false,
    mutation: false,
    bootstrap_command: BOOTSTRAP_COMMAND,
    domain_count: domains.length,
    issue_count: issueCount,
    domains,
  };
}

function formatPreflightFailure(receipt) {
  const lines = [
    `dependency preflight failed across ${receipt.issue_count} issue(s)`,
    `run the explicit bootstrap command: ${receipt.bootstrap_command}`,
  ];
  for (const domain of receipt.domains.filter((item) => !item.ok)) {
    lines.push(`${domain.id} (${domain.lockfile}):`);
    for (const issue of domain.issues) {
      lines.push(`  - ${issue.kind}: ${issue.path || issue.package || "dependency metadata"}`);
    }
  }
  return lines.join("\n");
}

function assertDependencyTreesReady(repoRoot = DEFAULT_REPO_ROOT) {
  const receipt = inspectDependencyTrees(repoRoot);
  if (!receipt.ok) {
    const error = new Error(formatPreflightFailure(receipt));
    error.code = "DEPENDENCY_PREFLIGHT_FAILED";
    error.receipt = receipt;
    throw error;
  }
  return receipt;
}

function bootstrapPlan(repoRoot = DEFAULT_REPO_ROOT) {
  return DEPENDENCY_DOMAINS.map((domain) => ({
    domain: domain.id,
    directory: domain.directory,
    lockfile: domain.lockfile,
    command: domain.bootstrap_command,
    cwd: repoRoot,
  }));
}

function runBootstrap(repoRoot = DEFAULT_REPO_ROOT, options = {}) {
  const commands = bootstrapPlan(repoRoot);
  if (options.dryRun) {
    return {
      action: "dependency-bootstrap",
      ok: true,
      executed: false,
      dry_run: true,
      network_capable: true,
      domain_count: commands.length,
      commands,
    };
  }

  const npmCommand = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
  const results = [];
  for (const command of commands) {
    const args = command.domain === "root" ? ["ci"] : ["ci", "--prefix", command.directory];
    const result = spawnSync(npmCommand, args, {
      cwd: repoRoot,
      env: process.env,
      encoding: "utf8",
      stdio: options.json ? "pipe" : "inherit",
    });
    results.push({ domain: command.domain, command: command.command, exit_code: result.status });
    if (result.status !== 0) {
      return {
        action: "dependency-bootstrap",
        ok: false,
        executed: true,
        dry_run: false,
        network_capable: true,
        failed_domain: command.domain,
        domain_count: commands.length,
        results,
      };
    }
  }
  return {
    action: "dependency-bootstrap",
    ok: true,
    executed: true,
    dry_run: false,
    network_capable: true,
    domain_count: commands.length,
    results,
  };
}

function parseArgs(argv) {
  const options = { command: "preflight", json: false, dryRun: false, repoRoot: DEFAULT_REPO_ROOT, help: false };
  const args = [...argv];
  if (args[0] === "preflight" || args[0] === "bootstrap") {
    options.command = args.shift();
  }
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--root") {
      const root = args.shift();
      if (!root) {
        throw new Error("--root requires a path");
      }
      options.repoRoot = path.resolve(root);
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function helpText() {
  return [
    "Usage:",
    "  node scripts/dependency-boundary.js preflight [--json] [--root <path>]",
    "  node scripts/dependency-boundary.js bootstrap [--dry-run] [--json] [--root <path>]",
    "",
    "Commands:",
    "  preflight  Read package.json, package-lock.json, and node_modules for root, docs,",
    "             and mdkg-dev. This command is local-only and never installs packages.",
    "  bootstrap  Run npm ci once for each independent lockfile owner. This command may",
    "             access the configured registry and mutates dependency trees.",
    "",
    `Repair command: ${BOOTSTRAP_COMMAND}`,
    "Verification boundary: run preflight, then set NPM_CONFIG_OFFLINE=true for tests and smokes.",
  ].join("\n");
}

function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return 2;
  }
  if (options.help) {
    process.stdout.write(`${helpText()}\n`);
    return 0;
  }

  const receipt = options.command === "bootstrap"
    ? runBootstrap(options.repoRoot, options)
    : inspectDependencyTrees(options.repoRoot);
  if (options.json) {
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  } else if (receipt.ok) {
    const verb = options.command === "bootstrap" && !options.dryRun ? "bootstrapped" : "verified";
    process.stdout.write(`dependency trees ${verb}: root, docs, mdkg-dev\n`);
  } else {
    process.stderr.write(`${options.command === "preflight" ? formatPreflightFailure(receipt) : "dependency bootstrap failed"}\n`);
  }
  return receipt.ok ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  BOOTSTRAP_COMMAND,
  DEPENDENCY_DOMAINS,
  assertDependencyTreesReady,
  bootstrapPlan,
  formatPreflightFailure,
  helpText,
  inspectDependencyDomain,
  inspectDependencyTrees,
  main,
  parseArgs,
  runBootstrap,
};
