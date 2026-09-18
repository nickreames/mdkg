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
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.allocUnsafe(64 * 1024);
  try {
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, count));
  } finally { fs.closeSync(fd); }
  return hash.digest("hex");
}

function hashTree(root, { source = false, excluded = [] } = {}) {
  if (!fs.lstatSync(root).isDirectory()) fail(`unsupported linked or non-directory ${source ? "input" : "output"} root`);
  const files = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(current, entry.name);
      const relative = path.relative(root, absolute).split(path.sep).join("/");
      // Source inputs are conservative: include the whole repository, not just
      // one site's import syntax. Installed packages are lockfile-owned; these
      // reserved outputs and checkout-local stores are never authored inputs.
      if (source && (["node_modules", ".astro", ".git", ".cache"].includes(entry.name) ||
        /(^|\/)\.mdkg\/(index|pack|state|subgraphs|db\/runtime)(\/|$)/.test(relative) ||
        excluded.some(dir => absolute === dir || absolute.startsWith(dir + path.sep)))) continue;
      if (entry.isSymbolicLink()) fail(`unsupported symbolic-link ${source ? "input" : "output"}: ${relative}`);
      if (entry.isDirectory()) {
        visit(absolute);
      } else if (entry.isFile()) {
        if (source && /^\.env(?:\.|$)/.test(entry.name)) fail(`unsupported implicit environment input: ${relative}; use a declared build profile without dotenv files`);
        const stat = fs.lstatSync(absolute);
        files.push({ path: relative, sha256: hashFile(absolute), mode: stat.mode & 0o777 });
      } else fail(`unsupported ${source ? "input" : "output"} type: ${relative}`);
    }
  }
  visit(root);
  return { files, sha256: crypto.createHash("sha256").update(JSON.stringify(files)).digest("hex") };
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
  if (!/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/.test(profile.id)) fail("unsupported site profile identity");
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
  const cacheRoot = process.env.MDKG_SITE_CACHE_DIR;
  const receiptRoot = process.env.MDKG_BUILD_RECEIPT_DIR;
  if (!cacheRoot || !receiptRoot) fail("MDKG_SITE_CACHE_DIR and MDKG_BUILD_RECEIPT_DIR are required for site builds");
  const sinks = [path.resolve(cacheRoot), path.resolve(receiptRoot)];
  for (const sink of sinks) {
    if (sink === repoRoot || repoRoot.startsWith(sink + path.sep) || sink === ownerRoot || sink.startsWith(ownerRoot + path.sep)) {
      fail("site cache/receipt directories must not overlap the repository root or site source tree");
    }
  }
  const excluded = [path.join(repoRoot, "dist"), path.join(repoRoot, "docs/dist"), path.join(repoRoot, "mdkg-dev/dist"), ...sinks];
  const snapshot = () => hashTree(repoRoot, { source: true, excluded });
  const inputs = snapshot();
  const sourceHash = inputs.sha256;
  const key = crypto.createHash("sha256").update(JSON.stringify({
    schema_version: 2,
    owner,
    profile: profile.id,
    profile_env: profile.env,
    build_args: args,
    source_hash: sourceHash,
    lockfile_hash: hashFile(lockfile),
    node: process.version,
  })).digest("hex");
  const entryRoot = path.join(cacheRoot, owner, profile.id, key);
  const cachedDist = path.join(entryRoot, "dist");
  const sealPath = path.join(entryRoot, "seal.json");
  const manifestFile = path.join(entryRoot, "inputs.json");
  const liveDist = path.join(ownerRoot, "dist");
  const cacheHit = fs.existsSync(entryRoot);
  let outputHash;
  const inputManifest = JSON.stringify({ schema_version: 2, files: inputs.files }, null, 2) + "\n";
  const inputManifestHash = crypto.createHash("sha256").update(inputManifest).digest("hex");
  if (cacheHit) {
    if (!fs.lstatSync(entryRoot).isDirectory()) fail("unsupported symbolic-link cache entry");
    if (!fs.existsSync(sealPath) || !fs.existsSync(cachedDist) || !fs.existsSync(manifestFile)) fail("incomplete site cache; preserve it for inspection instead of accepting a hit");
    if (!fs.lstatSync(sealPath).isFile() || !fs.lstatSync(manifestFile).isFile()) fail("unsupported symbolic-link cache metadata");
    const seal = JSON.parse(fs.readFileSync(sealPath, "utf8"));
    if (seal.schema_version !== 2 || seal.cache_key !== key || seal.source_hash !== sourceHash) fail("site cache seal identity mismatch");
    if (seal.input_manifest_sha256 !== inputManifestHash || hashFile(manifestFile) !== inputManifestHash) fail("site cache input manifest integrity mismatch");
    outputHash = hashTree(cachedDist).sha256;
    if (outputHash !== seal.output_hash) fail("site cache output integrity hash mismatch");
    fs.rmSync(liveDist, { recursive: true, force: true });
    fs.cpSync(cachedDist, liveDist, { recursive: true });
  } else {
    fs.rmSync(liveDist, { recursive: true, force: true });
    const result = spawnReal("npm", args);
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
    if (!fs.existsSync(liveDist)) {
      fail(`${owner} build did not create dist`);
    }
    outputHash = hashTree(liveDist).sha256;
  }
  if (snapshot().sha256 !== sourceHash) fail("site source inputs changed during build/restore; no cache seal or acceptance receipt emitted");
  if (hashTree(liveDist).sha256 !== outputHash) fail("restored site output integrity mismatch");
  if (!cacheHit) {
    fs.mkdirSync(entryRoot, { recursive: true });
    fs.cpSync(liveDist, cachedDist, { recursive: true });
    if (hashTree(cachedDist).sha256 !== outputHash) fail("site cache copy integrity mismatch");
    fs.writeFileSync(manifestFile, inputManifest);
    fs.writeFileSync(sealPath, JSON.stringify({ schema_version: 2, cache_key: key, source_hash: sourceHash, output_hash: outputHash, input_manifest_sha256: inputManifestHash }, null, 2) + "\n");
  }
  recordBuildReceipt({
    kind: "site",
    owner,
    profile: profile.id,
    cache_hit: cacheHit,
    cache_key: key,
    source_hash: sourceHash,
    output_hash: outputHash,
    input_count: inputs.files.length,
    input_manifest: manifestFile,
    input_manifest_sha256: inputManifestHash,
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
