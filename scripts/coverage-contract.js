#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createRunDirectory, prepareEmptyDirectory } = require("./qualification-output");
const { isolatedFixtureEnvironment } = require("./qualification-fixture");

const repoRoot = path.resolve(__dirname, "..");
const configPath = path.join(repoRoot, "scripts", "coverage-contract.json");
const reporterPath = path.join(repoRoot, "scripts", "coverage-reporter.js");
const metricFields = {
  lines: ["totalLineCount", "coveredLineCount", "coveredLinePercent"],
  branches: ["totalBranchCount", "coveredBranchCount", "coveredBranchPercent"],
  functions: ["totalFunctionCount", "coveredFunctionCount", "coveredFunctionPercent"],
};
const expectedMeasuredPaths = [
  ["cli", "dist/cli.js"],
  ["commands", "dist/commands/**/*.js"],
  ["core", "dist/core/**/*.js"],
  ["graph", "dist/graph/**/*.js"],
  ["pack", "dist/pack/**/*.js"],
  ["templates", "dist/templates/**/*.js"],
  ["util", "dist/util/**/*.js"],
];
const requiredExclusions = [
  "dist/tests/**",
  "dist/init/**",
  "scripts/**",
  "tests/**",
  "node_modules/**",
  "docs/**",
  "mdkg-dev/**",
];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function walkFiles(root, predicate) {
  if (!fs.existsSync(root)) {
    return [];
  }
  const output = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.isFile() && predicate(entryPath)) {
        output.push(toPosix(path.relative(root, entryPath)));
      }
    }
  }
  visit(root);
  return output.sort();
}

function discoverTestContract(root = repoRoot) {
  const testsRoot = path.join(root, "tests");
  const compiledRoot = path.join(root, "dist", "tests");
  const typescriptSources = walkFiles(testsRoot, (filePath) => filePath.endsWith(".test.ts"))
    .map((relativePath) => `tests/${relativePath}`);
  const rootMjs = walkFiles(testsRoot, (filePath) => filePath.endsWith(".test.mjs"))
    .map((relativePath) => `tests/${relativePath}`);
  const compiledExpected = typescriptSources.map((sourcePath) =>
    sourcePath.replace(/^tests\//, "dist/tests/").replace(/\.ts$/, ".js"),
  );
  const compiledActual = walkFiles(compiledRoot, (filePath) => filePath.endsWith(".test.js"))
    .map((relativePath) => `dist/tests/${relativePath}`);
  const expectedSet = new Set(compiledExpected);
  const actualSet = new Set(compiledActual);
  const missingCompiled = compiledExpected.filter((filePath) => !actualSet.has(filePath));
  const unexpectedCompiled = compiledActual.filter((filePath) => !expectedSet.has(filePath));
  if (typescriptSources.length === 0 || rootMjs.length === 0) {
    throw new Error("coverage contract requires both compiled TypeScript and root MJS test families");
  }
  if (missingCompiled.length > 0 || unexpectedCompiled.length > 0) {
    throw new Error(
      `compiled test discovery mismatch; missing=${missingCompiled.join(",") || "none"}; unexpected=${unexpectedCompiled.join(",") || "none"}`,
    );
  }
  const families = [...new Set(typescriptSources.map((filePath) => {
    const relativePath = filePath.slice("tests/".length);
    return relativePath.includes("/") ? relativePath.split("/")[0] : "root";
  }))].sort();
  return {
    typescript_sources: typescriptSources,
    compiled_typescript: compiledExpected,
    root_mjs: rootMjs,
    typescript_families: families,
    total_test_files: compiledExpected.length + rootMjs.length,
  };
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validateCoverageConfig(config, options = {}) {
  if (config.schema_version !== 1 || config.contract !== "publishable-runtime-v1") {
    throw new Error("unsupported coverage contract");
  }
  if (config.decision_ref !== "root:dec-88") {
    throw new Error("coverage contract must remain bound to root:dec-88");
  }
  const measured = (config.measured_paths || []).map((entry) => [entry.id, entry.include]);
  if (JSON.stringify(measured) !== JSON.stringify(expectedMeasuredPaths)) {
    throw new Error("coverage measured paths must exactly match the publishable runtime surface");
  }
  for (const exclusion of requiredExclusions) {
    if (!config.exclusions?.includes(exclusion)) {
      throw new Error(`coverage contract is missing exclusion ${exclusion}`);
    }
  }
  for (const metric of Object.keys(metricFields)) {
    const floor = config.provisional_audit_floors?.[metric];
    if (!Number.isInteger(floor) || floor < 0 || floor > 100) {
      throw new Error(`coverage provisional ${metric} floor must be a whole percentage`);
    }
  }
  if (options.requireThresholds) {
    if (!config.thresholds || typeof config.baseline_file !== "string") {
      throw new Error("coverage thresholds require a measured baseline");
    }
    for (const metric of Object.keys(metricFields)) {
      const threshold = config.thresholds[metric];
      if (!Number.isInteger(threshold) || threshold < 0 || threshold > 100) {
        throw new Error(`coverage ${metric} threshold must be a whole percentage`);
      }
      if (threshold < config.provisional_audit_floors[metric]) {
        throw new Error(`coverage ${metric} threshold cannot be below its provisional audit floor`);
      }
    }
  }
}

function validateBaseline(baseline, config) {
  if (
    baseline.schema_version !== 1 ||
    baseline.contract !== config.contract ||
    baseline.decision_ref !== config.decision_ref
  ) {
    throw new Error("coverage baseline identity does not match the coverage contract");
  }
  if (JSON.stringify(baseline.thresholds) !== JSON.stringify(config.thresholds)) {
    throw new Error("coverage baseline thresholds do not match the configured ratchet");
  }
  if (
    !Number.isInteger(baseline.measured_file_count) ||
    baseline.measured_file_count <= 0 ||
    !Number.isInteger(baseline.test_contract?.total_test_files) ||
    baseline.test_contract.total_test_files <= 0 ||
    !Number.isInteger(baseline.test_contract?.test_count) ||
    baseline.test_contract.test_count <= 0
  ) {
    throw new Error("coverage baseline is missing measured file or test counts");
  }
  for (const field of ["summary_sha256", "manifest_sha256", "structured_event_sha256"]) {
    if (!/^[a-f0-9]{64}$/.test(baseline.measurement_evidence?.[field] || "")) {
      throw new Error(`coverage baseline is missing ${field}`);
    }
  }
  if (!Number.isInteger(baseline.measurement_evidence?.raw_file_count) || baseline.measurement_evidence.raw_file_count <= 0) {
    throw new Error("coverage baseline is missing its raw V8 file count");
  }
}

function metricFromCounts(total, covered) {
  return total === 0 ? 100 : Number(((covered / total) * 100).toFixed(2));
}

function aggregateFiles(files) {
  const totals = {};
  for (const [metric, [totalField, coveredField]] of Object.entries(metricFields)) {
    const total = files.reduce((sum, file) => sum + file[totalField], 0);
    const covered = files.reduce((sum, file) => sum + file[coveredField], 0);
    totals[metric] = {
      total,
      covered,
      percent: metricFromCounts(total, covered),
    };
  }
  return totals;
}

function surfaceId(relativePath) {
  if (relativePath === "dist/cli.js") {
    return "cli";
  }
  const match = /^dist\/([^/]+)\//.exec(relativePath);
  return match ? match[1] : "unknown";
}

function summarizeCoverage(eventPayload, config, root = repoRoot) {
  const coverage = eventPayload?.coverage?.summary;
  if (!coverage || !Array.isArray(coverage.files)) {
    throw new Error("Node test reporter did not emit structured coverage");
  }
  const files = coverage.files.map((file) => ({
    ...file,
    relative_path: toPosix(path.relative(root, file.path)),
  })).sort((a, b) => a.relative_path.localeCompare(b.relative_path));
  const allowedIds = new Set(config.measured_paths.map((entry) => entry.id));
  const unexpected = files.filter((file) => !allowedIds.has(surfaceId(file.relative_path)));
  if (unexpected.length > 0) {
    throw new Error(`coverage report contains paths outside the measured surface: ${unexpected.map((file) => file.relative_path).join(", ")}`);
  }
  const observedIds = new Set(files.map((file) => surfaceId(file.relative_path)));
  const missingIds = [...allowedIds].filter((id) => !observedIds.has(id));
  if (missingIds.length > 0) {
    throw new Error(`coverage report is missing measured surfaces: ${missingIds.join(", ")}`);
  }
  const surfaces = Object.fromEntries([...allowedIds].map((id) => [
    id,
    {
      file_count: files.filter((file) => surfaceId(file.relative_path) === id).length,
      metrics: aggregateFiles(files.filter((file) => surfaceId(file.relative_path) === id)),
    },
  ]));
  return {
    file_count: files.length,
    metrics: aggregateFiles(files),
    surfaces,
  };
}

function validateThresholdRatchet(summary, config, baseline) {
  for (const metric of Object.keys(metricFields)) {
    const measured = summary.metrics[metric].percent;
    const provisional = config.provisional_audit_floors[metric];
    if (measured < provisional) {
      throw new Error(
        `scoped ${metric} coverage ${measured}% is below provisional audit floor ${provisional}%`,
      );
    }
    if (baseline) {
      const baselineMetric = baseline.metrics?.[metric];
      if (
        !baselineMetric ||
        baselineMetric.percent !== metricFromCounts(baselineMetric.total, baselineMetric.covered) ||
        baselineMetric.percent < provisional
      ) {
        throw new Error(`accepted ${metric} baseline is invalid or below its provisional floor`);
      }
      if (config.thresholds[metric] !== Math.floor(baselineMetric.percent)) {
        throw new Error(`coverage ${metric} threshold must equal the whole-number measured baseline floor`);
      }
      if (measured < config.thresholds[metric]) {
        throw new Error(`current ${metric} coverage ${measured}% is below threshold ${config.thresholds[metric]}%`);
      }
    }
  }
}

function buildNodeArgs(config, tests, mode) {
  const args = [
    "--test",
    "--experimental-test-coverage",
    `--test-reporter=${reporterPath}`,
  ];
  for (const entry of config.measured_paths) {
    args.push(`--test-coverage-include=${entry.include}`);
  }
  for (const exclusion of config.exclusions) {
    args.push(`--test-coverage-exclude=${exclusion}`);
  }
  if (mode === "run") {
    args.push(
      `--test-coverage-lines=${config.thresholds.lines}`,
      `--test-coverage-branches=${config.thresholds.branches}`,
      `--test-coverage-functions=${config.thresholds.functions}`,
    );
  }
  return [...args, ...tests.compiled_typescript, ...tests.root_mjs];
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
}

function prepareCoverageOutput(config, root = repoRoot, env = process.env) {
  if (Object.hasOwn(env, "MDKG_COVERAGE_DIR")) {
    if (!env.MDKG_COVERAGE_DIR?.trim()) throw new Error("MDKG_COVERAGE_DIR requires a fresh output directory");
    return prepareEmptyDirectory(path.resolve(root, env.MDKG_COVERAGE_DIR), { forbiddenRoots: [root] });
  }
  if (typeof config.output_dir !== "string" || !config.output_dir.trim()) {
    throw new Error("coverage contract requires an output directory");
  }
  // Standalone runs retain prior evidence instead of deleting it. The ladder
  // supplies an exact fresh directory, preserving its summary/manifest contract.
  return createRunDirectory(path.resolve(root, config.output_dir), { forbiddenRoots: [root] });
}

function execute(mode, root = repoRoot) {
  const config = loadJson(path.join(root, "scripts", "coverage-contract.json"));
  validateCoverageConfig(config, { requireThresholds: mode === "run" });
  const tests = discoverTestContract(root);
  const outputDir = prepareCoverageOutput(config, root);
  const rawDir = path.join(outputDir, "raw");
  const eventPath = path.join(outputDir, "coverage-event.json");
  fs.mkdirSync(rawDir, { mode: 0o700 });
  process.stderr.write(`coverage evidence directory: ${outputDir}\n`);
  const args = buildNodeArgs(config, tests, mode);
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    env: {
      ...isolatedFixtureEnvironment(process.env),
      NODE_V8_COVERAGE: rawDir,
      MDKG_COVERAGE_EVENT_PATH: eventPath,
    },
    stdio: "inherit",
  });
  const eventPayload = fs.existsSync(eventPath) ? loadJson(eventPath) : undefined;
  const coverage = summarizeCoverage(eventPayload, config, root);
  const baseline = mode === "run" ? loadJson(path.resolve(root, config.baseline_file)) : undefined;
  if (baseline) {
    validateBaseline(baseline, config);
  }
  validateThresholdRatchet(coverage, config, baseline);
  const testCounts = eventPayload?.test_summary?.counts;
  if (!eventPayload?.test_summary?.success || !testCounts || testCounts.failed !== 0 || testCounts.tests <= 0) {
    throw new Error("complete coverage test execution did not report a passing test summary");
  }
  const concise = {
    schema_version: 1,
    contract: config.contract,
    decision_ref: config.decision_ref,
    ok: result.status === 0,
    output_dir: outputDir,
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    test_contract: {
      typescript_source_count: tests.typescript_sources.length,
      compiled_typescript_count: tests.compiled_typescript.length,
      root_mjs_count: tests.root_mjs.length,
      total_test_files: tests.total_test_files,
      typescript_families: tests.typescript_families,
      test_count: testCounts.tests,
      passed: testCounts.passed,
      failed: testCounts.failed,
    },
    measured_surface: coverage,
    provisional_audit_floors: config.provisional_audit_floors,
    thresholds: mode === "run" ? config.thresholds : null,
  };
  writeJson(path.join(outputDir, "summary.json"), concise);
  const rawFiles = walkFiles(rawDir, (filePath) => filePath.endsWith(".json")).map((relativePath) => {
    const filePath = path.join(rawDir, relativePath);
    return {
      path: `raw/${relativePath}`,
      sha256: hashFile(filePath),
      bytes: fs.statSync(filePath).size,
    };
  });
  if (rawFiles.length === 0) {
    throw new Error("coverage contract did not retain raw V8 files");
  }
  writeJson(path.join(outputDir, "manifest.json"), {
    schema_version: 1,
    contract: config.contract,
    decision_ref: config.decision_ref,
    mode,
    command: [process.execPath, ...args],
    measured_paths: config.measured_paths,
    exclusions: config.exclusions,
    test_files: tests,
    evidence: {
      summary: "summary.json",
      structured_event: "coverage-event.json",
      raw_files: rawFiles,
    },
  });
  process.stdout.write(`${JSON.stringify(concise, null, 2)}\n`);
  return result.status === 0 ? 0 : 1;
}

function main() {
  const mode = process.argv[2] || "run";
  if (mode !== "measure" && mode !== "run") {
    process.stderr.write("Usage: node scripts/coverage-contract.js <measure|run>\n");
    return 2;
  }
  try {
    return execute(mode);
  } catch (error) {
    process.stderr.write(`coverage contract failed: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  aggregateFiles,
  buildNodeArgs,
  discoverTestContract,
  execute,
  prepareCoverageOutput,
  summarizeCoverage,
  validateBaseline,
  validateCoverageConfig,
  validateThresholdRatchet,
};
