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
  if (!pkg.scripts || !pkg.scripts["smoke:db-queue-cli"]) {
    fail("package.json is missing smoke:db-queue-cli");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:db-queue-cli")) {
    fail("prepublishOnly is missing smoke:db-queue-cli");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:cli-ux-polish"]) {
    fail("package.json is missing smoke:cli-ux-polish");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:work-invocation && npm run smoke:cli-ux-polish")) {
    fail("prepublishOnly must run smoke:cli-ux-polish immediately after smoke:work-invocation");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:operator-health"]) {
    fail("package.json is missing smoke:operator-health");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:operator-health")) {
    fail("prepublishOnly is missing smoke:operator-health");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:fix-plan"]) {
    fail("package.json is missing smoke:fix-plan");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:operator-health && npm run smoke:fix-plan")) {
    fail("prepublishOnly must run smoke:fix-plan immediately after smoke:operator-health");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:branch-conflicts"]) {
    fail("package.json is missing smoke:branch-conflicts");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:fix-plan && npm run smoke:branch-conflicts")) {
    fail("prepublishOnly must run smoke:branch-conflicts immediately after smoke:fix-plan");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:id-repair"]) {
    fail("package.json is missing smoke:id-repair");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:branch-conflicts && npm run smoke:id-repair")) {
    fail("prepublishOnly must run smoke:id-repair immediately after smoke:branch-conflicts");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:command-docs"]) {
    fail("package.json is missing smoke:command-docs");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:id-repair && npm run smoke:command-docs")) {
    fail("prepublishOnly must run smoke:command-docs immediately after smoke:id-repair");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:spike"]) {
    fail("package.json is missing smoke:spike");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:command-docs && npm run smoke:spike")) {
    fail("prepublishOnly must run smoke:spike immediately after smoke:command-docs");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:goal-lifecycle"]) {
    fail("package.json is missing smoke:goal-lifecycle");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run smoke:spike && npm run smoke:goal-lifecycle")) {
    fail("prepublishOnly must run smoke:goal-lifecycle immediately after smoke:spike");
  }
  if (!pkg.scripts || !pkg.scripts["cli:contract"]) {
    fail("package.json is missing cli:contract");
  }
  if (!String(pkg.scripts.prepublishOnly || "").includes("npm run cli:check && npm run cli:contract")) {
    fail("prepublishOnly must run cli:contract immediately after cli:check");
  }
  if (!Array.isArray(pkg.files) || !pkg.files.includes("dist/command-contract.json")) {
    fail("package files must include dist/command-contract.json");
  }
}

function requireCliBuild() {
  const cli = requireFile("dist/cli.js");
  if (!cli.startsWith("#!/usr/bin/env node\n")) {
    fail("dist/cli.js is missing the Node shebang");
  }
  const contract = JSON.parse(requireFile("dist/command-contract.json"));
  if (contract.schema_version !== 1 || contract.tool !== "mdkg" || !/^[a-f0-9]{64}$/.test(contract.contract_hash || "")) {
    fail("dist/command-contract.json is not a valid mdkg command contract");
  }
  if (!Array.isArray(contract.commands) || contract.commands.length < 70) {
    fail("dist/command-contract.json has too few command records");
  }
  const byKey = new Map(contract.commands.map((command) => [command.key, command]));
  for (const key of ["status", "doctor", "fix plan", "fix apply", "fix ids", "db", "subgraph sync", "workspace", "skill new", "task start"]) {
    if (!byKey.has(key)) {
      fail(`dist/command-contract.json is missing ${key}`);
    }
  }
  for (const key of ["db", "subgraph sync", "workspace", "skill new", "task start"]) {
    const command = byKey.get(key);
    if (
      !command ||
      command.danger_level === "read-only" ||
      !Array.isArray(command.write_paths) ||
      command.write_paths.length === 0 ||
      command.lock_policy === "none-read-only" ||
      command.atomic_write_policy === "none-read-only"
    ) {
      fail(`dist/command-contract.json is missing mutating safety metadata for ${key}`);
    }
  }
  const fixPlan = byKey.get("fix plan");
  if (!fixPlan || fixPlan.dry_run?.apply_supported !== true || fixPlan.dry_run?.apply_family !== "ids" || fixPlan.danger_level !== "read-only") {
    fail("dist/command-contract.json must keep fix plan read-only with ids apply metadata");
  }
  const fixApply = byKey.get("fix apply");
  if (!fixApply || fixApply.danger_level !== "high" || fixApply.lock_policy === "none-read-only" || fixApply.dry_run?.apply_family !== "ids") {
    fail("dist/command-contract.json is missing fix apply mutation safety metadata");
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
  requireFile("dist/commands/status.js");
  requireFile("dist/commands/fix.js");
  const doctor = requireFile("dist/commands/doctor.js");
  if (!doctor.includes("goal.selected_achieved") || !doctor.includes("db.project_verify")) {
    fail("dist/commands/doctor.js is missing strict typed operator-health checks");
  }
  requireFile("dist/graph/goal_scope.js");
  requireFile("dist/commands/subgraph.js");
  const subgraph = requireFile("dist/commands/subgraph.js");
  if (!subgraph.includes("runSubgraphAuditCommand") || !subgraph.includes("runSubgraphUpgradePlanCommand")) {
    fail("dist/commands/subgraph.js is missing audit or upgrade-plan command support");
  }
  requireFile("dist/graph/subgraphs.js");
  requireFile("dist/graph/sqlite_index.js");
  requireFile("dist/core/project_db_migrations.js");
  requireFile("dist/core/project_db_queue.js");
  requireFile("dist/core/project_db_events.js");
  requireFile("dist/core/project_db_materializer.js");
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
  if (!seededAgentStart.includes("mdkg goal activate") || !seededAgentStart.includes("mdkg goal claim")) {
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
  if (
    !seededAgentStart.includes("public local") ||
    !seededAgentStart.includes("node:sqlite queue") ||
    !seededAgentStart.includes("mdkg db queue ...") ||
    !seededAgentStart.includes("--queue-policy paused")
  ) {
    fail("dist/init/AGENT_START.md is missing public queue CLI guidance");
  }
  if (
    !seededAgentStart.includes("event/receipt/reducer") ||
    !seededAgentStart.includes("writer lease/CAS") ||
    !seededAgentStart.includes("materializer") ||
    !seededAgentStart.includes("`mdkg db event`") ||
    !seededAgentStart.includes("`mdkg db reducer`") ||
    !seededAgentStart.includes("`mdkg db lease`") ||
    !seededAgentStart.includes("`mdkg db materializer`")
  ) {
    fail("dist/init/AGENT_START.md is missing internal event/reducer/lease/materializer boundary guidance");
  }
  const seededReadme = requireFile("dist/init/README.md");
  if (!seededReadme.includes("mdkg status --json") || !seededReadme.includes("mdkg doctor --strict --json")) {
    fail("dist/init/README.md is missing operator health guidance");
  }
  if (!seededReadme.includes("mdkg fix plan") || !seededReadme.includes("fix apply")) {
    fail("dist/init/README.md is missing fix plan dry-run guidance");
  }
  if (!seededReadme.includes("mdkg subgraph add") || !seededReadme.includes("mdkg subgraph verify")) {
    fail("dist/init/README.md is missing subgraph onboarding guidance");
  }
  if (!seededReadme.includes("mdkg graph clone") || !seededReadme.includes("mdkg graph import-template")) {
    fail("dist/init/README.md is missing graph clone/import onboarding guidance");
  }
  if (
    !seededReadme.includes("mdkg new goal") ||
    !seededReadme.includes("mdkg goal activate/current/next/claim/evaluate")
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
  if (
    !seededReadme.includes("local node:sqlite queue delivery") ||
    !seededReadme.includes("mdkg db queue ...") ||
    !seededReadme.includes("--queue-policy paused")
  ) {
    fail("dist/init/README.md is missing public queue CLI guidance");
  }
  if (
    !seededReadme.includes("event/receipt/reducer") ||
    !seededReadme.includes("lease/CAS") ||
    !seededReadme.includes("materializer") ||
    !seededReadme.includes("`mdkg db event`") ||
    !seededReadme.includes("`mdkg db reducer`") ||
    !seededReadme.includes("`mdkg db lease`") ||
    !seededReadme.includes("`mdkg db materializer`")
  ) {
    fail("dist/init/README.md is missing internal event/reducer/lease/materializer boundary guidance");
  }
  if (
    !seededReadme.includes("mdkg new spike") ||
    !seededReadme.includes("Spikes use the existing task lifecycle") ||
    !seededReadme.includes("perform web") ||
    !seededReadme.includes("SKILL.md") ||
    !seededReadme.includes("skill candidates")
  ) {
    fail("dist/init/README.md is missing spike research-node guidance");
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
    "spike.md",
    "spec.md",
    "task.md",
    "test.md",
    "work.md",
    "work_order.md",
  ]) {
    requireFile(path.join("dist/init/templates/default", template));
  }
  const spikeTemplate = requireFile("dist/init/templates/default/spike.md");
  for (const expected of [
    "# Research Question",
    "# Search Plan",
    "# Findings",
    "# Recommendation",
    "# Follow-Up Nodes To Create",
    "# Skill Candidates",
    "# Evidence And Sources",
  ]) {
    if (!spikeTemplate.includes(expected)) {
      fail(`dist/init/templates/default/spike.md is missing ${expected}`);
    }
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
  const rootReadme = requireFile("README.md");
  if (!rootReadme.includes("mdkg status --json") || !rootReadme.includes("mdkg doctor --strict --json")) {
    fail("README.md is missing operator health guidance");
  }
  if (!rootReadme.includes("mdkg fix plan") || !rootReadme.includes("fix apply")) {
    fail("README.md is missing fix plan dry-run guidance");
  }
  if (!rootReadme.includes("mdkg graph clone") || !rootReadme.includes("mdkg graph import-template")) {
    fail("README.md is missing graph clone/import guidance");
  }
  if (
    !rootReadme.includes("mdkg new spike") ||
    !rootReadme.includes("Research spikes") ||
    !rootReadme.includes("perform web search") ||
    !rootReadme.includes("SKILL.md") ||
    !rootReadme.includes("follow-up node ideas")
  ) {
    fail("README.md is missing spike research-node guidance");
  }
  const matrix = requireFile("CLI_COMMAND_MATRIX.md");
  if (!matrix.includes("mdkg status [--json]") || !matrix.includes("mdkg doctor [--strict] [--json]")) {
    fail("CLI_COMMAND_MATRIX.md is missing operator health command references");
  }
  if (
    !matrix.includes("mdkg fix plan [--family index|refs|ids|all]") ||
    !matrix.includes("mdkg fix apply [--family ids]") ||
    !matrix.includes("mdkg fix ids [--target <id-or-qid>]")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing fix plan command references");
  }
  if (!matrix.includes("mdkg subgraph audit [alias|--all]") || !matrix.includes("mdkg subgraph upgrade-plan [alias|--all]")) {
    fail("CLI_COMMAND_MATRIX.md is missing subgraph audit or upgrade-plan command references");
  }
  if (
    !matrix.includes("mdkg graph clone <source-bundle-or-mdkg-dir>") ||
    !matrix.includes("mdkg graph fork <source-bundle-or-mdkg-dir>") ||
    !matrix.includes("mdkg graph import-template <source-bundle-or-mdkg-dir>")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing graph clone/fork/import-template command references");
  }
  if (
    !matrix.includes("mdkg new spike") ||
    !matrix.includes("mdkg task start|update|done <spike-id>") ||
    !matrix.includes("no `mdkg spike ...` namespace")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing spike command references");
  }
  const smokeOperatorHealth = requireFile("scripts/smoke-operator-health.js");
  if (!smokeOperatorHealth.includes("doctor --strict") && !smokeOperatorHealth.includes('"doctor", "--strict"')) {
    fail("scripts/smoke-operator-health.js is missing strict doctor proof");
  }
  const smokeFixPlan = requireFile("scripts/smoke-fix-plan.js");
  for (const expected of ["generated_cache_missing", "generated_cache_stale", "graph_ref_missing", "duplicate_id"]) {
    if (!smokeFixPlan.includes(expected)) {
      fail(`scripts/smoke-fix-plan.js is missing ${expected} proof`);
    }
  }
  const smokeIdRepair = requireFile("scripts/smoke-id-repair.js");
  for (const expected of ["base-mdkg", "git_stage_duplicate_id", "ls-files", "task-901"]) {
    if (!smokeIdRepair.includes(expected)) {
      fail(`scripts/smoke-id-repair.js is missing ${expected} proof`);
    }
  }
  const smokeSubgraph = requireFile("scripts/smoke-subgraph.js");
  for (const expected of ["subgraph.bundle.root_owned", "subgraph.materialize.target_safe", "upgrade-plan"]) {
    if (!smokeSubgraph.includes(expected)) {
      fail(`scripts/smoke-subgraph.js is missing ${expected} proof`);
    }
  }
  const smokeGraphClone = requireFile("scripts/smoke-graph-clone.js");
  for (const expected of ["graph clone", "graph fork", "import-template", "--select-goal"]) {
    if (!smokeGraphClone.includes(expected)) {
      fail(`scripts/smoke-graph-clone.js is missing ${expected} proof`);
    }
  }
  const smokeCommandDocs = requireFile("scripts/smoke-command-docs.js");
  for (const expected of [
    "dist/command-contract.json",
    "generated-from: dist/command-contract.json",
    "contract_hash",
    "Do not hand-maintain command metadata here.",
    "executeDocumentedExamples",
  ]) {
    if (!smokeCommandDocs.includes(expected)) {
      fail(`scripts/smoke-command-docs.js is missing ${expected} proof`);
    }
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
