#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { appendJsonLine, recordBuildReceipt } = require("./build-receipts");

const PROFILE_ENV_KEYS = [
  "VERCEL",
  "VERCEL_ENV",
  "PUBLIC_MDKG_PREVIEW_NOINDEX",
  "PUBLIC_MDKG_RELEASE_PREVIEW",
];

function fail(message) {
  process.stderr.write(`smoke npm proxy failed: ${message}\n`);
  process.exit(1);
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function hashTree(root, extras = []) {
  const hash = crypto.createHash("sha256");
  const roots = [root, ...extras].filter((entry) => fs.existsSync(entry));
  const files = [];
  function visit(current, base) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (["node_modules", "dist", ".astro", ".git", ".cache"].includes(entry.name)) {
        continue;
      }
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(absolute, base);
      } else if (entry.isFile()) {
        files.push([path.relative(base, absolute).split(path.sep).join("/"), absolute]);
      }
    }
  }
  for (const sourceRoot of roots) {
    if (fs.statSync(sourceRoot).isDirectory()) {
      visit(sourceRoot, sourceRoot);
    } else {
      files.push([path.basename(sourceRoot), sourceRoot]);
    }
  }
  for (const [relative, absolute] of files.sort((left, right) => left[0].localeCompare(right[0]))) {
    hash.update(relative);
    hash.update("\0");
    hash.update(fs.readFileSync(absolute));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function selectedProfileEnv() {
  return Object.fromEntries(
    PROFILE_ENV_KEYS
      .filter((key) => typeof process.env[key] === "string" && process.env[key] !== "")
      .map((key) => [key, process.env[key]]),
  );
}

function sameRecord(left, right) {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length && leftKeys.every(
    (key, index) => key === rightKeys[index] && left[key] === right[key],
  );
}

function resolveProfile(owner) {
  const manifestPath = process.env.MDKG_SMOKE_MANIFEST;
  if (!manifestPath) {
    fail("MDKG_SMOKE_MANIFEST is required for site builds");
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const selected = selectedProfileEnv();
  const profile = (manifest.profiles?.[owner] || []).find((item) => sameRecord(item.env || {}, selected));
  if (!profile) {
    fail(`undeclared ${owner} build profile: ${JSON.stringify(selected)}`);
  }
  return profile;
}

function realCommand(tool) {
  const command = tool === "npx" ? process.env.MDKG_REAL_NPX : process.env.MDKG_REAL_NPM;
  if (!command) {
    fail(`missing real ${tool} command`);
  }
  return command;
}

function spawnReal(tool, args, options = {}) {
  const command = realCommand(tool);
  const commandArgs = command.endsWith(".js") ? [command, ...args] : args;
  const executable = command.endsWith(".js") ? process.execPath : command;
  const env = { ...process.env, npm_execpath: process.env.MDKG_REAL_NPM || command };
  const result = spawnSync(executable, commandArgs, {
    cwd: options.cwd || process.cwd(),
    env,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });
  return result;
}

function packDestination(args) {
  const index = args.indexOf("--pack-destination");
  if (index >= 0 && args[index + 1]) {
    return path.resolve(process.cwd(), args[index + 1]);
  }
  const inline = args.find((arg) => arg.startsWith("--pack-destination="));
  return inline ? path.resolve(process.cwd(), inline.slice("--pack-destination=".length)) : process.cwd();
}

function provideArtifact(args) {
  const artifactPath = process.env.MDKG_SMOKE_TARBALL;
  const expectedHash = process.env.MDKG_SMOKE_TARBALL_SHA256;
  const receiptDir = process.env.MDKG_BUILD_RECEIPT_DIR;
  if (!artifactPath || !expectedHash || !receiptDir || !fs.existsSync(artifactPath)) {
    fail("immutable smoke artifact environment is incomplete");
  }
  const actualHash = hashFile(artifactPath);
  if (actualHash !== expectedHash) {
    fail(`immutable artifact hash mismatch: expected ${expectedHash}, got ${actualHash}`);
  }
  const destination = packDestination(args);
  fs.mkdirSync(destination, { recursive: true });
  const linkedPath = path.join(destination, path.basename(artifactPath));
  fs.rmSync(linkedPath, { force: true });
  try {
    fs.linkSync(artifactPath, linkedPath);
  } catch {
    fs.copyFileSync(artifactPath, linkedPath, fs.constants.COPYFILE_EXCL);
  }
  appendJsonLine(path.join(receiptDir, "artifact-usages.jsonl"), {
    schema_version: 1,
    smoke: process.env.MDKG_SMOKE_ID || "unknown",
    canonical_artifact: artifactPath,
    provided_path: linkedPath,
    sha256: actualHash,
  });
  process.stdout.write(`${path.basename(linkedPath)}\n`);
}

function siteBuildOwner(args) {
  if (args.length >= 4 && args[0] === "--prefix" && ["docs", "mdkg-dev"].includes(args[1]) && args[2] === "run" && args[3] === "build") {
    return args[1];
  }
  return undefined;
}

function runSiteBuild(owner, args) {
  const repoRoot = path.resolve(process.env.MDKG_REPO_ROOT || path.join(__dirname, ".."));
  const profile = resolveProfile(owner);
  const ownerRoot = path.join(repoRoot, owner);
  const lockfile = path.join(ownerRoot, "package-lock.json");
  const sourceHash = hashTree(ownerRoot, [
    path.join(repoRoot, "release"),
    path.join(repoRoot, "package.json"),
  ]);
  const key = crypto.createHash("sha256").update(JSON.stringify({
    owner,
    profile: profile.id,
    profile_env: profile.env,
    source_hash: sourceHash,
    lockfile_hash: hashFile(lockfile),
    node: process.version,
  })).digest("hex");
  const cacheRoot = process.env.MDKG_SITE_CACHE_DIR;
  if (!cacheRoot) {
    fail("MDKG_SITE_CACHE_DIR is required for site builds");
  }
  const cachedDist = path.join(cacheRoot, owner, profile.id, key, "dist");
  const liveDist = path.join(ownerRoot, "dist");
  const cacheHit = fs.existsSync(cachedDist);
  fs.rmSync(liveDist, { recursive: true, force: true });
  if (cacheHit) {
    fs.cpSync(cachedDist, liveDist, { recursive: true });
  } else {
    const result = spawnReal("npm", args);
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
    if (!fs.existsSync(liveDist)) {
      fail(`${owner} build did not create dist`);
    }
    fs.mkdirSync(path.dirname(cachedDist), { recursive: true });
    fs.cpSync(liveDist, cachedDist, { recursive: true });
  }
  recordBuildReceipt({
    kind: "site",
    owner,
    profile: profile.id,
    cache_hit: cacheHit,
    cache_key: key,
    node: process.version,
    smoke: process.env.MDKG_SMOKE_ID || "unknown",
  });
  process.stdout.write(`${owner} profile ${profile.id} ${cacheHit ? "restored" : "built"}\n`);
}

function mappedRootScript(args) {
  if (args[0] !== "run") {
    return undefined;
  }
  const mappings = {
    "docs:check": "docs:check:built",
    "docs:check-commands": "docs:check-commands:built",
  };
  return mappings[args[1]];
}

function main() {
  const toolArg = process.argv[2];
  const byName = path.basename(process.argv[1]).replace(/\.cmd$/i, "");
  const tool = toolArg === "npm" || toolArg === "npx" ? toolArg : byName;
  const args = process.argv.slice(toolArg === "npm" || toolArg === "npx" ? 3 : 2);
  if (tool !== "npm" && tool !== "npx") {
    fail(`unsupported proxy tool ${tool}`);
  }
  if (tool === "npm" && args[0] === "pack") {
    provideArtifact(args);
    return;
  }
  if (tool === "npm") {
    const owner = siteBuildOwner(args);
    if (owner) {
      runSiteBuild(owner, args);
      return;
    }
    const mapped = mappedRootScript(args);
    if (mapped) {
      args[1] = mapped;
    }
  }
  const result = spawnReal(tool, args);
  process.exit(result.status ?? 1);
}

main();
