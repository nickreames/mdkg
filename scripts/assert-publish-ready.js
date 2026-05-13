#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function fail(message) {
  console.error(`publish readiness failed: ${message}`);
  process.exitCode = 1;
}

function requireFile(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    fail(`missing required file ${relativePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function requireDir(relativePath) {
  const dirPath = path.join(root, relativePath);
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    fail(`missing required directory ${relativePath}`);
  }
}

function requirePackageVersions() {
  const pkg = JSON.parse(requireFile("package.json"));
  const lock = JSON.parse(requireFile("package-lock.json"));
  const lockRootVersion = lock.packages && lock.packages[""] && lock.packages[""].version;
  if (pkg.version !== lock.version || pkg.version !== lockRootVersion) {
    fail(
      `package version mismatch: package.json=${pkg.version}, package-lock.json=${lock.version}, package-lock root=${lockRootVersion}`
    );
  }
}

function requireCliBuild() {
  const cli = requireFile("dist/cli.js");
  if (!cli.startsWith("#!/usr/bin/env node\n")) {
    fail("dist/cli.js is missing the Node shebang");
  }
}

function requireBuildFolders() {
  for (const relativePath of [
    "dist/commands",
    "dist/core",
    "dist/graph",
    "dist/init",
    "dist/pack",
    "dist/templates",
    "dist/util",
  ]) {
    requireDir(relativePath);
  }
}

function requireInitAssets() {
  requireFile("dist/init/config.json");
  const initManifest = JSON.parse(requireFile("dist/init/init-manifest.json"));
  if (initManifest.tool !== "mdkg" || initManifest.schema_version !== 1 || !Array.isArray(initManifest.files)) {
    fail("dist/init/init-manifest.json is not a valid mdkg init manifest");
  }
  requireFile("dist/init/legacy/v0.0.9-init-manifest.json");
  for (const startupDoc of [
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "llms.txt",
    "AGENT_START.md",
    "CLI_COMMAND_MATRIX.md",
  ]) {
    requireFile(path.join("dist/init", startupDoc));
  }
  for (const template of [
    "bug.md",
    "chk.md",
    "dec.md",
    "dispute.md",
    "edd.md",
    "epic.md",
    "feat.md",
    "feedback.md",
    "prd.md",
    "prop.md",
    "proposal.md",
    "receipt.md",
    "rule.md",
    "spec.md",
    "task.md",
    "test.md",
    "work.md",
    "work_order.md",
  ]) {
    requireFile(path.join("dist/init/templates/default", template));
  }
}

requirePackageVersions();
requireCliBuild();
requireBuildFolders();
requireInitAssets();

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("publish readiness ok");
