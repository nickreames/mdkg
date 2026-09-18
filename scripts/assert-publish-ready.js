#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { validateGoalPursuitContract } = require("./goal-pursuit-contract.js");
const { verifyMatrix } = require("./verify-security-remediation.js");

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
  const rootReadme = requireFile("README.md");
  const matrix = requireFile("CLI_COMMAND_MATRIX.md");
  if (!rootReadme.includes(`Current package version in source: \`${pkg.version}\``)) {
    fail(`README.md current package version does not match package.json ${pkg.version}`);
  }
  if (!matrix.includes(`package_version_in_source: ${pkg.version}`)) {
    fail(`CLI_COMMAND_MATRIX.md package_version_in_source does not match package.json ${pkg.version}`);
  }
  const changelog = requireFile("CHANGELOG.md");
  const escapedVersion = pkg.version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`^## ${escapedVersion}(?:\\s+-|$)`, "m").test(changelog)) {
    fail(`CHANGELOG.md is missing a release section for package version ${pkg.version}`);
  }
  const releaseNotes = JSON.parse(requireFile("docs/_generated/release-notes.json"));
  if (releaseNotes.package_version !== pkg.version || releaseNotes.latest_release !== pkg.version) {
    fail(
      `generated release notes version mismatch: package=${pkg.version}, generated package=${releaseNotes.package_version}, latest=${releaseNotes.latest_release}`
    );
  }
  if (!Array.isArray(releaseNotes.releases) || !releaseNotes.releases.some((release) => release.version === pkg.version)) {
    fail(`generated release notes are missing package version ${pkg.version}`);
  }
  if (!pkg.scripts || !pkg.scripts["smoke:db-queue-cli"]) {
    fail("package.json is missing smoke:db-queue-cli");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:handoff"]) {
    fail("package.json is missing smoke:handoff");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:integration-ux"]) {
    fail("package.json is missing smoke:integration-ux");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:loop"]) {
    fail("package.json is missing smoke:loop");
  }
  if (!pkg.scripts || pkg.scripts["smoke:git-materialize"] !== "npm run build && node scripts/smoke-git-materialize.js") {
    fail("package.json is missing the canonical smoke:git-materialize command");
  }
  if (pkg.scripts["ci:release"] !== "node scripts/release-ladder.js ci") {
    fail("package.json is missing the canonical bounded ci:release runner");
  }
  if (pkg.scripts["ci:full:prepare"] !== "node scripts/release-ladder.js full-prepare") {
    fail("package.json is missing the canonical full preparation runner");
  }
  if (pkg.scripts["ci:full:shard"] !== "node scripts/release-ladder.js full-shard") {
    fail("package.json is missing the canonical full shard runner");
  }
  if (pkg.scripts["ci:workflow:check"] !== "node scripts/generate-ci-workflow.js --check") {
    fail("package.json is missing the deterministic CI workflow drift check");
  }
  if (pkg.scripts.prepublishOnly !== "node scripts/release-ladder.js prepublish") {
    fail("package.json is missing the canonical bounded prepublishOnly runner");
  }
  if (pkg.scripts["test:coverage"] !== "npm run build && npm run build:test && npm run test:coverage:built") {
    fail("package.json is missing the canonical complete coverage wrapper");
  }
  if (pkg.scripts["test:coverage:built"] !== "node scripts/coverage-contract.js run") {
    fail("package.json is missing the build-free coverage contract runner");
  }
  if (pkg.scripts["deps:preflight"] !== "node scripts/dependency-boundary.js preflight") {
    fail("package.json is missing the canonical local-only deps:preflight command");
  }
  if (pkg.scripts["deps:bootstrap"] !== "node scripts/dependency-boundary.js bootstrap") {
    fail("package.json is missing the canonical explicit deps:bootstrap command");
  }
  if (!String(pkg.scripts.prepack || "").startsWith("npm run deps:preflight && ")) {
    fail("prepack must fail closed through deps:preflight before other gates");
  }
  if (!String(pkg.scripts.build || "").startsWith("npm run deps:preflight && ")) {
    fail("build must fail closed through deps:preflight before smoke-visible output changes");
  }
  const dependencyBoundary = requireFile("scripts/dependency-boundary.js");
  for (const expected of ["root", "docs", "mdkg-dev", "npm run deps:bootstrap", "NPM_CONFIG_OFFLINE=true"]) {
    if (!dependencyBoundary.includes(expected)) {
      fail(`scripts/dependency-boundary.js is missing ${expected}`);
    }
  }
  const siteSmokeUtils = requireFile("scripts/mdkg-dev-smoke-utils.js");
  if (!siteSmokeUtils.includes("assertDependencyTreesReady(repoRoot)")) {
    fail("mdkg-dev smoke utilities must preflight all dependency owners before building");
  }
  if (siteSmokeUtils.includes('["ci", "--prefix", "mdkg-dev"') || siteSmokeUtils.includes("ensureSiteDeps")) {
    fail("mdkg-dev smoke utilities must not install dependencies implicitly");
  }
  if (!pkg.scripts || pkg.scripts["security:verify"] !== "node scripts/verify-security-remediation.js") {
    fail("package.json is missing the canonical security:verify command");
  }
  if (!String(pkg.scripts.prepack || "").includes("npm run security:verify")) {
    fail("prepack is missing security:verify");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:warning-ux"]) {
    fail("package.json is missing smoke:warning-ux");
  }
  for (const scriptName of [
    "smoke:mdkg-dev",
    "smoke:mdkg-dev-docs",
    "smoke:mdkg-dev-seo",
    "smoke:mdkg-dev-polish-pass2",
    "smoke:mdkg-dev-polish-pass3",
    "smoke:mdkg-dev-polish-pass4",
    "smoke:mdkg-dev-polish-pass5",
    "smoke:mdkg-dev-a11y",
    "smoke:mdkg-dev-perf",
    "smoke:demo-graph",
    "docs:check",
    "docs:release-notes",
    "docs:release-notes:check",
  ]) {
    if (!pkg.scripts || !pkg.scripts[scriptName]) {
      fail(`package.json is missing ${scriptName}`);
    }
  }
  const docsCheck = String(pkg.scripts["docs:check"] || "");
  const docsCheckBuilt = String(pkg.scripts["docs:check:built"] || "");
  if (!docsCheck.includes("npm run build && npm run docs:check:built")) {
    fail("standalone docs:check must build before using the built-only gate");
  }
  if (!docsCheckBuilt.includes("generate-docs-reference.js --check")) {
    fail("docs:check must verify generated CLI docs");
  }
  if (!docsCheckBuilt.includes("generate-release-notes-data.js --check")) {
    fail("docs:check must verify generated release notes data");
  }
  if (!docsCheckBuilt.includes("check-doc-command-examples.js")) {
    fail("docs:check must validate public command examples");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:cli-ux-polish"]) {
    fail("package.json is missing smoke:cli-ux-polish");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:operator-health"]) {
    fail("package.json is missing smoke:operator-health");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:fix-plan"]) {
    fail("package.json is missing smoke:fix-plan");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:branch-conflicts"]) {
    fail("package.json is missing smoke:branch-conflicts");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:id-repair"]) {
    fail("package.json is missing smoke:id-repair");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:command-docs"]) {
    fail("package.json is missing smoke:command-docs");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:spike"]) {
    fail("package.json is missing smoke:spike");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:goal-lifecycle"]) {
    fail("package.json is missing smoke:goal-lifecycle");
  }
  if (!pkg.scripts || !pkg.scripts["cli:contract"]) {
    fail("package.json is missing cli:contract");
  }
  if (!pkg.scripts || !pkg.scripts["smoke:mcp"]) {
    fail("package.json is missing smoke:mcp");
  }

  const releaseLadder = requireFile("scripts/release-ladder.js");
  for (const expected of [
    "dependency-preflight",
    "cli:check:built",
    "cli:contract:built",
    "docs:check:built",
    "graph-validate",
    "security-verify",
    "package-artifact",
    "publish-readiness",
    "NPM_CONFIG_OFFLINE",
    "http://127.0.0.1:9",
    "root build count",
    "profile coverage mismatch",
    "captureTrackedBoundary",
    "compareTrackedBoundaries",
    "selected_goal_unchanged",
    "lockfiles_unchanged",
    "diff_check_clean",
    "test:coverage",
    "coverage gate did not produce its concise summary",
  ]) {
    if (!releaseLadder.includes(expected)) {
      fail(`scripts/release-ladder.js is missing ${expected}`);
    }
  }
  const coverageContract = requireFile("scripts/coverage-contract.js");
  const coverageReporter = requireFile("scripts/coverage-reporter.js");
  const coverageConfig = JSON.parse(requireFile("scripts/coverage-contract.json"));
  const coverageBaseline = JSON.parse(requireFile("scripts/coverage-baseline.json"));
  for (const expected of [
    "discoverTestContract",
    "NODE_V8_COVERAGE",
    "summary.json",
    "manifest.json",
    "validateThresholdRatchet",
    "root:dec-88",
  ]) {
    if (!coverageContract.includes(expected) && expected !== "root:dec-88") {
      fail(`scripts/coverage-contract.js is missing ${expected}`);
    }
  }
  if (!coverageReporter.includes("test:coverage") || !coverageReporter.includes("test:summary")) {
    fail("coverage reporter must capture structured coverage and test-summary events");
  }
  if (
    coverageConfig.decision_ref !== "root:dec-88" ||
    coverageBaseline.decision_ref !== "root:dec-88" ||
    JSON.stringify(coverageConfig.thresholds) !== JSON.stringify(coverageBaseline.thresholds)
  ) {
    fail("coverage config and measured baseline must remain bound to root:dec-88");
  }
  const prepublishCoverageOccurrences = (releaseLadder.match(/run\(\"coverage\"/g) || []).length;
  if (prepublishCoverageOccurrences !== 1 || !releaseLadder.includes("!isFullShard")) {
    fail("shared CI preparation must execute the coverage contract exactly once");
  }
  const smokeManifest = JSON.parse(requireFile("scripts/smoke-manifest.json"));
  const { canonicalEntries, validateManifest } = require("./release-ladder.js");
  try {
    validateManifest(smokeManifest, pkg);
  } catch (error) {
    fail(`smoke manifest topology is invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
  const smokeAliases = Object.keys(pkg.scripts).filter((name) => name.startsWith("smoke:")).sort();
  const manifestAliases = smokeManifest.aliases.map((entry) => entry.alias).sort();
  const canonicalSmokes = new Set(smokeManifest.aliases.map((entry) => entry.canonical));
  if (smokeManifest.alias_count !== 47 || manifestAliases.length !== 47) {
    fail("smoke manifest must map all 47 aliases");
  }
  if (smokeManifest.canonical_execution_count !== 46 || canonicalSmokes.size !== 46) {
    fail("smoke manifest must map aliases to 46 canonical executions");
  }
  if (JSON.stringify(smokeAliases) !== JSON.stringify(manifestAliases)) {
    fail("smoke manifest aliases must match package.json");
  }
  const bundleImport = smokeManifest.aliases.find((entry) => entry.alias === "smoke:bundle-import");
  if (!bundleImport || bundleImport.canonical !== "smoke:subgraph") {
    fail("smoke:bundle-import must remain an alias of smoke:subgraph");
  }
  const fastCi = canonicalEntries(smokeManifest, "ci");
  if (fastCi.length !== 13 || smokeManifest.ci_topology?.decision_ref !== "root:dec-91") {
    fail("smoke manifest fast CI membership must contain the 13 Decision 91 identities");
  }
  const sharded = smokeManifest.ci_topology.full.shards.flatMap((shard) =>
    canonicalEntries(smokeManifest, "full-shard", shard.id),
  );
  if (sharded.length !== 46 || new Set(sharded.map((entry) => entry.canonical)).size !== 46) {
    fail("smoke manifest full shards must partition all 46 canonical identities");
  }
  if (smokeManifest.profiles?.docs?.length !== 4 || smokeManifest.profiles?.["mdkg-dev"]?.length !== 5) {
    fail("smoke manifest must bind four docs and five mdkg-dev behavior profiles");
  }
  const artifactConsumers = smokeManifest.aliases.filter(
    (entry) => entry.prerequisites.includes("immutable_package_artifact"),
  );
  if (artifactConsumers.length !== 35) {
    fail(`smoke manifest must identify 35 artifact-consuming aliases including the compatibility alias; got ${artifactConsumers.length}`);
  }
  if (!Array.isArray(pkg.files) || !pkg.files.includes("dist/command-contract.json")) {
    fail("package files must include dist/command-contract.json");
  }
  for (const requiredPayloadRoot of ["dist/commands/", "dist/graph/", "dist/init/", "dist/pack/"]) {
    if (!Array.isArray(pkg.files) || !pkg.files.includes(requiredPayloadRoot)) {
      fail(`package files must include ${requiredPayloadRoot}`);
    }
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
  const generatedSummary = JSON.parse(requireFile("docs/_generated/command-contract-summary.json"));
  const generatedReference = requireFile("docs/_generated/cli-reference.md");
  const pkg = JSON.parse(requireFile("package.json"));
  if (generatedSummary.contract_hash !== contract.contract_hash || generatedSummary.package_version !== pkg.version) {
    fail("generated command contract summary is stale");
  }
  if (
    !generatedReference.includes(`<!-- contract-hash: ${contract.contract_hash} -->`) ||
    !generatedReference.includes(`- Package version: ${pkg.version}`)
  ) {
    fail("generated CLI reference is stale");
  }
  const byKey = new Map(contract.commands.map((command) => [command.key, command]));
  for (const key of [
    "status",
    "mcp",
    "mcp serve",
    "doctor",
    "fix plan",
    "fix apply",
    "fix ids",
    "manifest",
    "manifest list",
    "manifest show",
    "manifest validate",
    "db",
    "subgraph sync",
    "workspace",
    "skill new",
    "task start",
    "work validate",
    "loop",
    "loop list",
    "loop show",
    "loop fork",
    "loop plan",
    "loop next",
    "loop runs",
    "git materialize",
  ]) {
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
  const mcpServe = byKey.get("mcp serve");
  if (
    !mcpServe ||
    mcpServe.danger_level !== "read-only" ||
    !Array.isArray(mcpServe.write_paths) ||
    mcpServe.write_paths.length !== 0 ||
    mcpServe.lock_policy !== "none-read-only" ||
    !mcpServe.usage.includes("  mdkg mcp serve --stdio") ||
    !mcpServe.flags.some((flag) => flag.name === "--stdio")
  ) {
    fail("dist/command-contract.json must keep mcp serve read-only");
  }
  const workValidate = byKey.get("work validate");
  if (
    !workValidate ||
    workValidate.danger_level !== "read-only" ||
    !Array.isArray(workValidate.write_paths) ||
    workValidate.write_paths.length !== 0 ||
    workValidate.lock_policy !== "none-read-only" ||
    workValidate.json_schema_ref !== "mdkg.work_validate.v1"
  ) {
    fail("dist/command-contract.json must keep work validate read-only with typed JSON schema metadata");
  }
  for (const key of ["loop list", "loop show", "loop plan", "loop next", "loop runs"]) {
    const command = byKey.get(key);
    if (!command || command.danger_level !== "read-only" || command.write_paths.length !== 0 || !command.side_effects.includes("none")) {
      fail(`dist/command-contract.json must keep ${key} observational`);
    }
  }
  const loopFork = byKey.get("loop fork");
  if (
    !loopFork ||
    !loopFork.side_effects.includes("reserve-sqlite-node-ids-when-configured") ||
    !loopFork.write_paths.includes(".mdkg/events/*.jsonl") ||
    loopFork.dry_run?.reserves_ids !== false ||
    !Array.isArray(loopFork.dry_run?.write_paths) ||
    loopFork.dry_run.write_paths.length !== 0
  ) {
    fail("dist/command-contract.json is missing truthful loop fork and dry-run safety metadata");
  }
  const gitMaterialize = byKey.get("git materialize");
  if (
    !gitMaterialize ||
    gitMaterialize.danger_level !== "moderate" ||
    !gitMaterialize.write_paths.includes("<destination>/**") ||
    gitMaterialize.lock_policy !== "not-required-for-contained-destination" ||
    gitMaterialize.atomic_write_policy !== "same-parent-temporary-tree-rename-after-verification" ||
    gitMaterialize.dry_run?.supported !== false ||
    gitMaterialize.json_schema_ref !== "mdkg.git.materialize.receipt.v1" ||
    !gitMaterialize.receipts.includes("mdkg.git.materialize.receipt.v1")
  ) {
    fail("dist/command-contract.json is missing truthful git materialize safety metadata");
  }
  const materializeRequestFlag = gitMaterialize && gitMaterialize.flags.find((flag) => flag.name === "--request");
  const materializeJsonFlag = gitMaterialize && gitMaterialize.flags.find((flag) => flag.name === "--json");
  if (
    !materializeRequestFlag ||
    materializeRequestFlag.value !== "<file|->" ||
    materializeRequestFlag.required !== true
  ) {
    fail("dist/command-contract.json must mark git materialize --request <file|-> as required");
  }
  if (!materializeJsonFlag || materializeJsonFlag.value !== null || materializeJsonFlag.required !== false) {
    fail("dist/command-contract.json must keep bracketed git materialize --json optional and discoverable");
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
  requireFile("dist/commands/loop.js");
  requireFile("dist/commands/loop_descriptors.js");
  requireFile("dist/graph/loop_bindings.js");
  requireFile("dist/commands/status.js");
  requireFile("dist/commands/fix.js");
  const mcp = requireFile("dist/commands/mcp.js");
  for (const expected of ["mdkg_status", "mdkg_workspace_list", "mdkg_search", "mdkg_pack", "mdkg_goal_next", "runMcpServeCommand"]) {
    if (!mcp.includes(expected)) {
      fail(`dist/commands/mcp.js is missing ${expected}`);
    }
  }
  const doctor = requireFile("dist/commands/doctor.js");
  if (!doctor.includes("goal.selected_achieved") || !doctor.includes("db.project_verify")) {
    fail("dist/commands/doctor.js is missing strict typed operator-health checks");
  }
  requireFile("dist/graph/goal_scope.js");
  requireFile("dist/commands/subgraph.js");
  const gitMaterialize = requireFile("dist/commands/git_materialize.js");
  for (const expected of ["mdkg.git.materialize.request.v1", "mdkg.git.materialize.receipt.v1", "collectGitMaterializeReceipt"]) {
    if (!gitMaterialize.includes(expected)) {
      fail(`dist/commands/git_materialize.js is missing ${expected}`);
    }
  }
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
  if (seededAgentStart.split(/\s+/).length > 450 ||
      !seededAgentStart.includes("mdkg skill search") ||
      !seededAgentStart.includes("mdkg goal next <qid>") ||
      !seededAgentStart.includes("mdkg help <command>") ||
      !seededAgentStart.includes("separate approval")) {
    fail("compact startup router must remain bounded with focused discovery and authority boundaries");
  }
  for (const adapter of ["AGENTS.md", "CLAUDE.md"]) {
    const body = requireFile("dist/init/" + adapter);
    if (!body.includes("<!-- mdkg:instructions:start -->") || !body.includes(".mdkg/AGENT_START.md") ||
        !body.includes("<!-- mdkg:instructions:end -->")) fail(adapter + " lacks the compact managed adapter");
  }
  for (const name of ["AGENT_START.md", "CLI_COMMAND_MATRIX.md", "llms.txt"]) {
    if (!initManifest.files.some(file => file.path === ".mdkg/" + name)) fail("manifest lacks compact guidance: " + name);
  }
  // Detailed domain guidance is still required, but lives behind focused
  // discovery instead of being mandatory startup context.
  const detailedGuidance = (requireFile("dist/init/README.md") + requireFile("dist/init/CLI_COMMAND_MATRIX.md")).replace(/\s+/g, " ");
  for (const command of ["mdkg subgraph", "mdkg pack", "--visibility", "mdkg goal claim", "mdkg db init",
    "mdkg db migrate", "mdkg db verify", "mdkg db stats", "mdkg db snapshot seal", "mdkg db queue contract",
    "--queue-policy paused", "event/receipt/reducer", "writer lease/CAS", "materializer",
    "`mdkg db event`", "`mdkg db reducer`", "`mdkg db lease`", "`mdkg db materializer`"]) {
    if (!detailedGuidance.includes(command)) fail("focused guidance missing: " + command);
  }
  const seededReadme = requireFile("dist/init/README.md");
  const normalizedSeededReadme = seededReadme.replace(/\s+/g, " ");
  if (!seededReadme.includes("mdkg status --json") || !seededReadme.includes("mdkg doctor --strict --json")) {
    fail("dist/init/README.md is missing operator health guidance");
  }
  if (!seededReadme.includes("mdkg fix plan") || !seededReadme.includes("fix apply")) {
    fail("dist/init/README.md is missing fix plan dry-run guidance");
  }
  if (!seededReadme.includes("mdkg subgraph add") || !seededReadme.includes("mdkg subgraph verify")) {
    fail("dist/init/README.md is missing subgraph onboarding guidance");
  }
  if (!seededReadme.includes("mdkg mcp serve --stdio") || !seededReadme.includes("read-only tools")) {
    fail("dist/init/README.md is missing MCP read-only server guidance");
  }
  if (
    !seededReadme.includes("mdkg graph clone") ||
    !seededReadme.includes("mdkg graph import-template") ||
    !normalizedSeededReadme.includes("activates the rewritten imported start goal") ||
    !normalizedSeededReadme.includes("pauses competing active root goals")
  ) {
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
    !seededReadme.includes("mdkg db queue contract --json") ||
    !seededReadme.includes("canonical payload hashing") ||
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
  if (!seededReadme.includes("mdkg work validate") || !seededReadme.includes("typed diagnostics")) {
    fail("dist/init/README.md is missing workflow validation guidance");
  }
  if (
    !seededReadme.includes("mdkg validate --changed-only --json") ||
    !seededReadme.includes("mdkg validate --summary --json --limit 20") ||
    !seededReadme.includes("--json-out <path>") ||
    !seededReadme.includes("mdkg format --headings --dry-run --summary --json --limit 20")
  ) {
    fail("dist/init/README.md is missing warning filter or heading migration guidance");
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
    "loop.md",
    "manifest.md",
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
  for (const template of [
    "security-audit.loop.md",
    "design-frontend-ux-audit.loop.md",
    "backend-api-cli-bloat-audit.loop.md",
    "tech-stack-best-practices-audit.loop.md",
    "duplicate-code-and-linting-audit.loop.md",
    "test-ci-skill-infrastructure-audit.loop.md",
    "user-story-audit-and-recommendations.loop.md",
  ]) {
    requireFile(path.join("dist/init/templates/loops", template));
  }
  const seededLoopSkill = requireFile("dist/init/skills/default/pursue-mdkg-loop/SKILL.md");
  for (const expected of ["mdkg loop plan", "mdkg loop next", "whole_loop_blocked", "proposal"]) {
    if (!seededLoopSkill.includes(expected)) {
      fail(`dist/init pursue-mdkg-loop skill is missing ${expected}`);
    }
  }
  for (const template of [
    "agent.MANIFEST.md",
    "api.MANIFEST.md",
    "base.MANIFEST.md",
    "capability.MANIFEST.md",
    "integration.MANIFEST.md",
    "model.MANIFEST.md",
    "project.MANIFEST.md",
    "runtime-agent.MANIFEST.md",
    "runtime-image.MANIFEST.md",
    "tool.MANIFEST.md",
  ]) {
    requireFile(path.join("dist/init/templates/specs", template));
  }
  for (const legacyTemplate of [
    "agent.SPEC.md",
    "api.SPEC.md",
    "base.SPEC.md",
    "capability.SPEC.md",
    "integration.SPEC.md",
    "model.SPEC.md",
    "project.SPEC.md",
    "runtime-agent.SPEC.md",
    "runtime-image.SPEC.md",
    "tool.SPEC.md",
  ]) {
    requireFile(path.join("dist/init/templates/specs", legacyTemplate));
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
    "Authority-Separated Release Handoff",
    "does not prescribe or perform",
    "repository-owned release skill",
  ]) {
    if (!seededReviewSkill.includes(expected)) {
      fail(`dist/init verify-close-and-checkpoint skill is missing ${expected}`);
    }
  }
  const seededAuthorSkill = requireFile("dist/init/skills/default/author-mdkg-skill/SKILL.md");
  for (const expected of ["MANIFEST.md", "customization.skill_mirrors.targets", "mdkg skill sync --json"]) {
    if (!seededAuthorSkill.includes(expected)) {
      fail(`dist/init author-mdkg-skill skill is missing ${expected}`);
    }
  }
  const seededExecuteSkill = requireFile("dist/init/skills/default/build-pack-and-execute-task/SKILL.md");
  if (!seededExecuteSkill.includes("separately authorized archive/bundle refresh") || !seededExecuteSkill.includes("do not infer that authority")) {
    fail("dist/init build-pack-and-execute-task skill is missing authority-separated handoff guidance");
  }
  const goalSkillProjections = [
    ["canonical", ".mdkg/skills/pursue-mdkg-goal/SKILL.md"],
    ["Codex mirror", ".agents/skills/pursue-mdkg-goal/SKILL.md"],
    ["Claude mirror", ".claude/skills/pursue-mdkg-goal/SKILL.md"],
    ["public seed", "assets/init/skills/default/pursue-mdkg-goal/SKILL.md"],
    ["built public seed", "dist/init/skills/default/pursue-mdkg-goal/SKILL.md"],
  ].map(([identity, relativePath]) => ({
    identity,
    relativePath,
    content: requireFile(relativePath),
  }));
  const canonicalGoalSkill = goalSkillProjections[0].content;
  for (const projection of goalSkillProjections) {
    const contract = validateGoalPursuitContract(projection.content);
    if (!contract.ok) {
      fail(
        `${projection.identity} pursue-mdkg-goal skill is missing lifecycle behavior: ${contract.missing.join(", ")}`
      );
    }
    if (projection.content !== canonicalGoalSkill) {
      fail(
        `${projection.identity} pursue-mdkg-goal skill does not match canonical .mdkg/skills/pursue-mdkg-goal/SKILL.md`
      );
    }
  }
  const { validatePublicSkillProjection } = require(
    path.join(root, "dist", "core", "public_skill_projection.js")
  );
  const projectionReceipt = validatePublicSkillProjection({
    policyPath: path.join(root, "assets", "init", "skills", "public-seed-policy.json"),
    canonicalRoot: path.join(root, ".mdkg", "skills"),
    mirrorRoots: [
      path.join(root, ".agents", "skills"),
      path.join(root, ".claude", "skills"),
    ],
    publicRoot: path.join(root, "assets", "init", "skills", "default"),
    builtRoot: path.join(root, "dist", "init", "skills", "default"),
  });
  for (const error of projectionReceipt.errors) {
    fail(`public skill projection: ${error}`);
  }
  try {
    require("./public-core-seed.js").assertPublicCoreSeed({
      publicRoot: path.join(root, "assets", "init", "core"),
      builtRoot: path.join(root, "dist", "init", "core"),
    });
  } catch (error) {
    fail(`public core seed: ${error.message}`);
  }
  const rootReadme = requireFile("README.md");
  const normalizedRootReadme = rootReadme.replace(/\s+/g, " ");
  if (
    !rootReadme.includes("mdkg-dev/") ||
    !rootReadme.includes("docs/") ||
    !rootReadme.includes("examples/") ||
    !rootReadme.includes("npm run smoke:mdkg-dev") ||
    !rootReadme.includes("npm run smoke:demo-graph") ||
    !rootReadme.includes("durable `demo-N.mdkg.dev` promotion")
  ) {
    fail("README.md is missing mdkg.dev launch workspace guidance");
  }
  if (!rootReadme.includes("mdkg status --json") || !rootReadme.includes("mdkg doctor --strict --json")) {
    fail("README.md is missing operator health guidance");
  }
  if (!rootReadme.includes("mdkg fix plan") || !rootReadme.includes("fix apply")) {
    fail("README.md is missing fix plan dry-run guidance");
  }
  if (
    !rootReadme.includes("mdkg mcp serve --stdio") ||
    !rootReadme.includes("read-only tools") ||
    !rootReadme.includes("Future mutation allowlists remain design work")
  ) {
    fail("README.md is missing MCP read-only server guidance");
  }
  if (
    !rootReadme.includes("mdkg graph clone") ||
    !rootReadme.includes("mdkg graph import-template") ||
    !normalizedRootReadme.includes("activates the rewritten imported start goal") ||
    !normalizedRootReadme.includes("pauses competing active root goals")
  ) {
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
  if (!rootReadme.includes("mdkg work validate") || !rootReadme.includes("typed diagnostics")) {
    fail("README.md is missing workflow validation guidance");
  }
  if (
    !rootReadme.includes("mdkg validate --changed-only --json") ||
    !rootReadme.includes("mdkg validate --summary --json --limit 20") ||
    !rootReadme.includes("--json-out <path>") ||
    !rootReadme.includes("mdkg format --headings --dry-run --summary --json --limit 20")
  ) {
    fail("README.md is missing warning filter or heading migration guidance");
  }
  if (
    !rootReadme.includes("mdkg handoff create") ||
    !rootReadme.includes("sanitized, copy-ready agent") ||
    !rootReadme.includes("without copying raw node bodies")
  ) {
    fail("README.md is missing handoff command guidance");
  }
  if (
    !rootReadme.includes("mdkg db queue contract --json") ||
    !rootReadme.includes("canonical payload hashing") ||
    !rootReadme.includes("oldest-ready claim order") ||
    !rootReadme.includes("lease-owner checked")
  ) {
    fail("README.md is missing project DB queue adapter contract guidance");
  }
  const matrix = requireFile("CLI_COMMAND_MATRIX.md");
  if (
    !matrix.includes("npm run smoke:mdkg-dev") ||
    !matrix.includes("npm run smoke:mdkg-dev-docs") ||
    !matrix.includes("npm run smoke:mdkg-dev-seo") ||
    !matrix.includes("npm run smoke:demo-graph") ||
    !matrix.includes("demo_agentic_coding:goal-1") ||
    !matrix.includes("template_mdkg_dev:goal-1")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing mdkg.dev launch-readiness references");
  }
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
    !matrix.includes("mdkg mcp serve --stdio") ||
    !matrix.includes("mdkg_workspace_list") ||
    !matrix.includes("no task, goal activation, graph import, queue, event, archive, format, SQL, shell")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing MCP command references");
  }
  if (
    !matrix.includes("mdkg graph clone <source-bundle-or-mdkg-dir>") ||
    !matrix.includes("mdkg graph fork <source-bundle-or-mdkg-dir>") ||
    !matrix.includes("mdkg graph import-template <source-bundle-or-mdkg-dir>") ||
    !matrix.includes("activated_goal?") ||
    !matrix.includes("paused_goals")
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
  if (!matrix.includes("mdkg work validate [<id-or-qid>]") || !matrix.includes("work-validate-receipt")) {
    fail("CLI_COMMAND_MATRIX.md is missing workflow validation command references");
  }
  if (
    !matrix.includes("mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]") ||
    !matrix.includes("warning_summary") ||
    !matrix.includes("json_receipt_path") ||
    !matrix.includes("mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing warning filter or heading migration command references");
  }
  const warningSmoke = requireFile("scripts/smoke-warning-ux.js");
  for (const expected of ["--summary", "--json-out", "warning_summary", "format", "--headings"]) {
    if (!warningSmoke.includes(expected)) {
      fail(`scripts/smoke-warning-ux.js is missing warning UX proof ${expected}`);
    }
  }
  if (
    !matrix.includes("mdkg handoff create <id-or-qid>") ||
    !matrix.includes("handoff-created") ||
    !matrix.includes("raw_marker_warning_count")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing handoff command references");
  }
  if (
    !matrix.includes("mdkg db queue contract [--json]") ||
    !matrix.includes("canonical payload hashing") ||
    !matrix.includes("oldest-ready claim order") ||
    !matrix.includes("lease-owner checked settlement")
  ) {
    fail("CLI_COMMAND_MATRIX.md is missing project DB queue adapter contract references");
  }
  const smokeWorkInvocation = requireFile("scripts/smoke-work-invocation.js");
  for (const expected of ["work", "validate", "workflowValidation", "orderValidation"]) {
    if (!smokeWorkInvocation.includes(expected)) {
      fail(`scripts/smoke-work-invocation.js is missing workflow validation proof ${expected}`);
    }
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
  for (const expected of ["graph clone", "graph fork", "import-template", "--select-goal", "activated_goal", "paused_goals"]) {
    if (!smokeGraphClone.includes(expected)) {
      fail(`scripts/smoke-graph-clone.js is missing ${expected} proof`);
    }
  }
  const smokeMcp = requireFile("scripts/smoke-mcp.js");
  for (const expected of ["mcp", "serve", "--stdio", "tools/list", "mdkg_workspace_list", "child_demo", "mdkg_task_update"]) {
    if (!smokeMcp.includes(expected)) {
      fail(`scripts/smoke-mcp.js is missing ${expected} proof`);
    }
  }
  const smokeHandoff = requireFile("scripts/smoke-handoff.js");
  for (const expected of ["handoff", "create", "raw_payload", ".mdkg/handoffs", "proof://handoff/smoke"]) {
    if (!smokeHandoff.includes(expected)) {
      fail(`scripts/smoke-handoff.js is missing ${expected} proof`);
    }
  }
  const smokeIntegrationUx = requireFile("scripts/smoke-integration-ux.js");
  for (const expected of [
    "integration-ux",
    "context_refs",
    "evidence_refs",
    "checkpointKinds",
    "work",
    "validate",
    "db",
    "queue",
    "contract",
    "handoff",
    "RAW_PAYLOAD_MARKER",
    "format",
    "--headings",
  ]) {
    if (!smokeIntegrationUx.includes(expected)) {
      fail(`scripts/smoke-integration-ux.js is missing ${expected} proof`);
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
  const smokeMdkgDev = requireFile("scripts/smoke-mdkg-dev.js");
  for (const expected of ["buildSite", "llms-full.txt", "social-card.svg", "Git-native project memory", "Customize standards without forking the kernel"]) {
    if (!smokeMdkgDev.includes(expected)) {
      fail(`scripts/smoke-mdkg-dev.js is missing ${expected} proof`);
    }
  }
  const smokeMdkgDevDocs = requireFile("scripts/smoke-mdkg-dev-docs.js");
  for (const expected of ["docs:check", "SUMMARY.md", "cli-reference.md", "assertMarkdownLinks", "astro.config.mjs", "Starlight", "docs.mdkg.dev", "release-grid"]) {
    if (!smokeMdkgDevDocs.includes(expected)) {
      fail(`scripts/smoke-mdkg-dev-docs.js is missing ${expected} proof`);
    }
  }
  const smokeMdkgDevSeo = requireFile("scripts/smoke-mdkg-dev-seo.js");
  for (const expected of ["JSON-LD", "softwareVersion", "sitemap.xml", "robots.txt", "llms-full.txt", "PUBLIC_MDKG_PREVIEW_NOINDEX", "vercel.app"]) {
    if (!smokeMdkgDevSeo.includes(expected)) {
      fail(`scripts/smoke-mdkg-dev-seo.js is missing ${expected} proof`);
    }
  }
  const smokeMdkgDevPolishPass2 = requireFile("scripts/smoke-mdkg-dev-polish-pass2.js");
  for (const expected of ["TerminalBlock", "Plan -> Work -> Evidence", "Read-only MCP", "noindex", "https://docs.mdkg.dev"]) {
    if (!smokeMdkgDevPolishPass2.includes(expected)) {
      fail(`scripts/smoke-mdkg-dev-polish-pass2.js is missing ${expected} proof`);
    }
  }
  const smokeDemoGraph = requireFile("scripts/smoke-demo-graph.js");
  for (const expected of ["demo_agentic_coding", "template_mdkg_dev", "goal next", "subgraph", "read_only"]) {
    if (!smokeDemoGraph.includes(expected)) {
      fail(`scripts/smoke-demo-graph.js is missing ${expected} proof`);
    }
  }
  const smokeLoop = requireFile("scripts/smoke-loop.js");
  for (const expected of [
    "security-audit",
    "design-frontend-ux-audit",
    "backend-api-cli-bloat-audit",
    "tech-stack-best-practices-audit",
    "duplicate-code-and-linting-audit",
    "test-ci-skill-infrastructure-audit",
    "user-story-audit-and-recommendations",
    "--dry-run",
    "whole_loop_blocked",
    "SQLite backend",
  ]) {
    if (!smokeLoop.includes(expected)) {
      fail(`scripts/smoke-loop.js is missing ${expected} proof`);
    }
  }
  const releaseWorkflow = requireFile(".github/workflows/release-readiness.yml");
  const { readTopology, renderWorkflow } = require("./generate-ci-workflow.js");
  if (releaseWorkflow !== renderWorkflow(readTopology())) {
    fail("release-readiness workflow does not match its deterministic source");
  }
  for (const expected of [
    "24.15.0",
    "24.x",
    "npm run deps:bootstrap",
    "npm run ci:release",
    "npm run ci:full:prepare",
    "npm run ci:full:shard",
    "full_release:",
    "if-no-files-found: error",
  ]) {
    if (!releaseWorkflow.includes(expected)) {
      fail(`release-readiness workflow is missing ${expected}`);
    }
  }
  requireDir("mdkg-dev");
  requireFile("mdkg-dev/package.json");
  requireFile("mdkg-dev/astro.config.mjs");
  requireFile("mdkg-dev/CLAIMS.md");
  requireFile("mdkg-dev/DESIGN.md");
  requireDir("docs");
  requireFile("docs/package.json");
  requireFile("docs/astro.config.mjs");
  requireFile("docs/src/content.config.ts");
  requireFile("docs/src/content/docs/index.md");
  requireFile("docs/SUMMARY.md");
  requireFile("docs/_generated/cli-reference.md");
  requireFile("docs/project/claims-evidence-matrix.md");
  const docsReadme = requireFile("docs/README.md");
  if (!docsReadme.includes("repo-owned source") || docsReadme.includes("GitBook")) {
    fail("docs/README.md must describe repo-owned source docs and not GitBook");
  }
  requireDir("examples/demo-agentic-coding/.mdkg");
  requireDir("examples/template-mdkg-dev/.mdkg");
  requireFile(".mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip");
  requireFile(".mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip");
  const npmignore = requireFile(".npmignore");
  for (const expected of ["mdkg-dev/", "docs/", "examples/", "mdkg_planning_docs/"]) {
    if (!npmignore.includes(expected)) {
      fail(`.npmignore is missing ${expected}`);
    }
  }
}

requirePackageVersions();
requireCliBuild();
requireBuildFolders();
requireInitAssets();

try {
  verifyMatrix(path.join(root, "security", "v0.5.0-remediation-matrix.json"), root);
} catch (error) {
  fail(`security remediation matrix: ${error instanceof Error ? error.message : String(error)}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("publish readiness ok");
