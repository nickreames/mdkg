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
  requireFile("dist/templates/builtin.js");
}

function requireInitAssets() {
  const initConfig = JSON.parse(requireFile("dist/init/config.json"));
  if (!initConfig.capabilities || initConfig.capabilities.cache_path !== ".mdkg/index/capabilities.json") {
    fail("dist/init/config.json is missing the default capability cache path");
  }
  if (!initConfig.bundles || initConfig.bundles.output_dir !== ".mdkg/bundles" || initConfig.bundles.default_profile !== "private") {
    fail("dist/init/config.json is missing the default bundle config");
  }
  if (!initConfig.workspaces?.root || initConfig.workspaces.root.visibility !== "private") {
    fail("dist/init/config.json is missing root workspace visibility metadata");
  }
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
    const content = requireFile(path.join("dist/init", startupDoc));
    if (content.includes("mdkg init --llm") || content.includes("--llm --agent")) {
      fail(`dist/init/${startupDoc} contains removed init onboarding guidance`);
    }
  }
  for (const template of [
    "archive.md",
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
  const seededReviewSkill = requireFile("dist/init/skills/default/verify-close-and-checkpoint/SKILL.md");
  for (const expected of [
    "Bundle-Aware Commit Gate",
    "mdkg archive compress --all",
    "mdkg archive verify --json",
    "mdkg bundle create --profile private",
  ]) {
    if (!seededReviewSkill.includes(expected)) {
      fail(`dist/init verify-close-and-checkpoint skill is missing ${expected}`);
    }
  }
  const seededExecuteSkill = requireFile("dist/init/skills/default/build-pack-and-execute-task/SKILL.md");
  if (!seededExecuteSkill.includes("mdkg archive compress --all") || !seededExecuteSkill.includes("mdkg bundle create --profile private")) {
    fail("dist/init build-pack-and-execute-task skill is missing pre-commit handoff guidance");
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
