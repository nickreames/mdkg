import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const contract = require(path.join(repoRoot, "scripts", "coverage-contract.js")) as {
  discoverTestContract(root: string): {
    typescript_sources: string[];
    compiled_typescript: string[];
    root_mjs: string[];
    total_test_files: number;
  };
  validateCoverageConfig(config: unknown, options?: { requireThresholds?: boolean }): void;
  validateBaseline(baseline: unknown, config: unknown): void;
  summarizeCoverage(payload: unknown, config: unknown, root: string): {
    file_count: number;
    metrics: Record<string, { total: number; covered: number; percent: number }>;
  };
  validateThresholdRatchet(
    summary: { metrics: Record<string, { total: number; covered: number; percent: number }> },
    config: {
      provisional_audit_floors: Record<string, number>;
      thresholds: Record<string, number>;
    },
    baseline?: { metrics: Record<string, { total: number; covered: number; percent: number }> },
  ): void;
  buildNodeArgs(
    config: {
      measured_paths: Array<{ id: string; include: string }>;
      exclusions: string[];
      thresholds: Record<string, number>;
    },
    tests: { compiled_typescript: string[]; root_mjs: string[] },
    mode: "measure" | "run",
  ): string[];
};
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, "scripts", "coverage-contract.json"), "utf8"));

function write(filePath: string, content = "fixture\n") {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

test("coverage test discovery includes every compiled TypeScript test and root MJS test", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-coverage-discovery-"));
  write(path.join(root, "tests", "commands", "one.test.ts"));
  write(path.join(root, "tests", "graph", "two.test.ts"));
  write(path.join(root, "tests", "release.test.mjs"));
  write(path.join(root, "tests", "security.test.mjs"));
  write(path.join(root, "dist", "tests", "commands", "one.test.js"));
  write(path.join(root, "dist", "tests", "graph", "two.test.js"));

  const discovered = contract.discoverTestContract(root);
  assert.deepEqual(discovered.typescript_sources, [
    "tests/commands/one.test.ts",
    "tests/graph/two.test.ts",
  ]);
  assert.deepEqual(discovered.root_mjs, [
    "tests/release.test.mjs",
    "tests/security.test.mjs",
  ]);
  assert.equal(discovered.total_test_files, 4);

  fs.rmSync(path.join(root, "dist", "tests", "graph", "two.test.js"));
  assert.throws(() => contract.discoverTestContract(root), /compiled test discovery mismatch/);
});

test("coverage config fixes the Decision 88 denominator and rejects lowered floors", () => {
  const configured = structuredClone(config);
  configured.thresholds = { lines: 89, branches: 77, functions: 96 };
  assert.doesNotThrow(() => contract.validateCoverageConfig(configured, { requireThresholds: true }));

  configured.measured_paths.pop();
  assert.throws(
    () => contract.validateCoverageConfig(configured, { requireThresholds: true }),
    /publishable runtime surface/,
  );

  const lowered = structuredClone(config);
  lowered.thresholds = { lines: 88, branches: 77, functions: 96 };
  assert.throws(
    () => contract.validateCoverageConfig(lowered, { requireThresholds: true }),
    /cannot be below its provisional audit floor/,
  );
});

test("coverage baseline binds source-owned counts, thresholds, and evidence hashes", () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(repoRoot, "scripts", "coverage-baseline.json"), "utf8"));
  assert.doesNotThrow(() => contract.validateBaseline(baseline, config));

  const lowered = structuredClone(baseline);
  lowered.thresholds.lines -= 1;
  assert.throws(() => contract.validateBaseline(lowered, config), /thresholds do not match/);

  const missingEvidence = structuredClone(baseline);
  missingEvidence.measurement_evidence.summary_sha256 = "";
  assert.throws(() => contract.validateBaseline(missingEvidence, config), /missing summary_sha256/);
});

test("coverage summary rejects paths outside the measured surface and aggregates counts", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-coverage-summary-"));
  const file = (relativePath: string, counts: number[]) => ({
    path: path.join(root, relativePath),
    totalLineCount: counts[0],
    coveredLineCount: counts[1],
    coveredLinePercent: 0,
    totalBranchCount: counts[2],
    coveredBranchCount: counts[3],
    coveredBranchPercent: 0,
    totalFunctionCount: counts[4],
    coveredFunctionCount: counts[5],
    coveredFunctionPercent: 0,
    functions: [],
    branches: [],
    lines: [],
  });
  const files = [
    file("dist/cli.js", [10, 9, 10, 8, 10, 10]),
    file("dist/commands/a.js", [10, 9, 10, 8, 10, 10]),
    file("dist/core/a.js", [10, 9, 10, 8, 10, 10]),
    file("dist/graph/a.js", [10, 9, 10, 8, 10, 10]),
    file("dist/pack/a.js", [10, 9, 10, 8, 10, 10]),
    file("dist/templates/a.js", [10, 9, 10, 8, 10, 10]),
    file("dist/util/a.js", [10, 9, 10, 8, 10, 10]),
  ];
  const summary = contract.summarizeCoverage({ coverage: { summary: { files } } }, config, root);
  assert.equal(summary.file_count, 7);
  assert.deepEqual(summary.metrics.lines, { total: 70, covered: 63, percent: 90 });
  assert.deepEqual(summary.metrics.branches, { total: 70, covered: 56, percent: 80 });
  assert.deepEqual(summary.metrics.functions, { total: 70, covered: 70, percent: 100 });

  files.push(file("scripts/outside.js", [1, 1, 1, 1, 1, 1]));
  assert.throws(
    () => contract.summarizeCoverage({ coverage: { summary: { files } } }, config, root),
    /outside the measured surface/,
  );
});

test("coverage threshold ratchet fails each below-floor metric and binds measured counts", () => {
  const configured = structuredClone(config);
  configured.thresholds = { lines: 90, branches: 80, functions: 100 };
  const metrics = {
    lines: { total: 100, covered: 90, percent: 90 },
    branches: { total: 100, covered: 80, percent: 80 },
    functions: { total: 100, covered: 100, percent: 100 },
  };
  assert.doesNotThrow(() => contract.validateThresholdRatchet({ metrics }, configured, { metrics }));

  for (const [metric, percent] of [["lines", 88], ["branches", 76], ["functions", 95]] as const) {
    const failing = structuredClone(metrics);
    failing[metric] = { total: 100, covered: percent, percent };
    assert.throws(
      () => contract.validateThresholdRatchet({ metrics: failing }, configured),
      new RegExp(`scoped ${metric} coverage`),
    );
  }

  const drifted = structuredClone(metrics);
  drifted.lines.covered = 91;
  drifted.lines.percent = 91;
  assert.doesNotThrow(() => contract.validateThresholdRatchet({ metrics: drifted }, configured, { metrics }));

  const loweredThreshold = structuredClone(configured);
  loweredThreshold.thresholds.lines = 89;
  assert.throws(
    () => contract.validateThresholdRatchet({ metrics }, loweredThreshold, { metrics }),
    /must equal the whole-number measured baseline floor/,
  );
});

test("coverage command uses one structured run with thresholds and all discovered tests", () => {
  const configured = structuredClone(config);
  configured.thresholds = { lines: 90, branches: 80, functions: 100 };
  const args = contract.buildNodeArgs(
    configured,
    {
      compiled_typescript: ["dist/tests/a.test.js"],
      root_mjs: ["tests/b.test.mjs"],
    },
    "run",
  );
  assert.equal(args.filter((arg) => arg === "dist/tests/a.test.js").length, 1);
  assert.equal(args.filter((arg) => arg === "tests/b.test.mjs").length, 1);
  assert.equal(args.filter((arg) => arg.startsWith("--test-coverage-lines=")).length, 1);
  assert.equal(args.filter((arg) => arg.startsWith("--test-coverage-branches=")).length, 1);
  assert.equal(args.filter((arg) => arg.startsWith("--test-coverage-functions=")).length, 1);
  assert.match(fs.readFileSync(path.join(repoRoot, "scripts", "coverage-contract.js"), "utf8"), /summary\.json/);
  assert.match(fs.readFileSync(path.join(repoRoot, "scripts", "coverage-contract.js"), "utf8"), /manifest\.json/);
  assert.match(fs.readFileSync(path.join(repoRoot, "scripts", "coverage-contract.js"), "utf8"), /NODE_V8_COVERAGE/);
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  const releaseLadder = fs.readFileSync(path.join(repoRoot, "scripts", "release-ladder.js"), "utf8");
  assert.equal(
    packageJson.scripts["test:coverage"],
    "npm run build && npm run build:test && npm run test:coverage:built",
  );
  assert.equal(packageJson.scripts["test:coverage:built"], "node scripts/coverage-contract.js run");
  assert.equal((releaseLadder.match(/run\("coverage"/g) || []).length, 1);
  assert.match(releaseLadder, /coverage gate did not produce its concise summary/);
  assert.match(fs.readFileSync(path.join(repoRoot, ".gitignore"), "utf8"), /^\.coverage\/$/m);
});
