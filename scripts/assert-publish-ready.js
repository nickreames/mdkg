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
  requireFile("dist/commands/goal.js");
  requireFile("dist/graph/goal_scope.js");
  requireFile("dist/commands/subgraph.js");
  requireFile("dist/graph/subgraphs.js");
  requireFile("dist/graph/sqlite_index.js");
  requireFile("dist/core/project_db_migrations.js");
  requireFile("dist/core/project_db_snapshot.js");
  requireFile("dist/graph/reindex.js");
  requireFile("dist/graph/visibility.js");
  requireFile("dist/graph/node_body.js");
  requireFile("dist/util/atomic.js");
  requireFile("dist/util/lock.js");
}

function requireInitAssets() {
  const initConfig = JSON.parse(requireFile("dist/init/config.json"));
  if (
    !initConfig.index ||
    initConfig.index.backend !== "sqlite" ||
    initConfig.index.sqlite_path !== ".mdkg/index/mdkg.sqlite" ||
    initConfig.index.sqlite_commit_warning_bytes !== 52428800 ||
    initConfig.index.lock_timeout_ms !== 10000
  ) {
    fail("dist/init/config.json is missing the default SQLite index backend config");
  }
  if (!initConfig.capabilities || initConfig.capabilities.cache_path !== ".mdkg/index/capabilities.json") {
    fail("dist/init/config.json is missing the default capability cache path");
  }
  if (!initConfig.archive || initConfig.archive.large_cache_warning_bytes !== 26214400) {
    fail("dist/init/config.json is missing the default archive large-cache warning threshold");
  }
  if (!initConfig.bundles || initConfig.bundles.output_dir !== ".mdkg/bundles" || initConfig.bundles.default_profile !== "private") {
    fail("dist/init/config.json is missing the default bundle config");
  }
  if (!initConfig.subgraphs || Object.keys(initConfig.subgraphs).length !== 0) {
    fail("dist/init/config.json is missing empty subgraphs defaults");
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
  const seededAgentStart = requireFile("dist/init/AGENT_START.md");
  if (!seededAgentStart.includes("mdkg subgraph add/list/verify")) {
    fail("dist/init/AGENT_START.md is missing subgraph onboarding guidance");
  }
  if (!seededAgentStart.includes("mdkg pack <id> --visibility public|internal")) {
    fail("dist/init/AGENT_START.md is missing visibility pack guidance");
  }
  if (!seededAgentStart.includes("mdkg goal select") || !seededAgentStart.includes("mdkg goal claim")) {
    fail("dist/init/AGENT_START.md is missing goal onboarding guidance");
  }
  if (
    !seededAgentStart.includes("mdkg db init") ||
    !seededAgentStart.includes("mdkg db migrate") ||
    !seededAgentStart.includes("mdkg db verify") ||
    !seededAgentStart.includes("mdkg db stats") ||
    !seededAgentStart.includes("mdkg db snapshot seal")
  ) {
    fail("dist/init/AGENT_START.md is missing project DB onboarding guidance");
  }
  const seededReadme = requireFile("dist/init/README.md");
  if (!seededReadme.includes("mdkg subgraph add") || !seededReadme.includes("mdkg subgraph verify")) {
    fail("dist/init/README.md is missing subgraph onboarding guidance");
  }
  if (
    !seededReadme.includes("mdkg new goal") ||
    !seededReadme.includes("mdkg goal select/current/next/claim/evaluate")
  ) {
    fail("dist/init/README.md is missing goal onboarding guidance");
  }
  if (
    !seededReadme.includes("mdkg db init") ||
    !seededReadme.includes("mdkg db migrate") ||
    !seededReadme.includes("mdkg db verify") ||
    !seededReadme.includes("mdkg db stats") ||
    !seededReadme.includes("mdkg db snapshot seal")
  ) {
    fail("dist/init/README.md is missing project DB onboarding guidance");
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
    "goal.md",
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
  const seededGoalSkill = requireFile("dist/init/skills/default/pursue-mdkg-goal/SKILL.md");
  if (!seededGoalSkill.includes("mdkg goal next") || !seededGoalSkill.includes("Skill Improvement Candidates")) {
    fail("dist/init pursue-mdkg-goal skill is missing goal pursuit guidance");
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
