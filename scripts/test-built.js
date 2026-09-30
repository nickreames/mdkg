#!/usr/bin/env node

const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { discoverTestContract } = require("./coverage-contract.js");
const { isolatedFixtureEnvironment } = require("./qualification-fixture.js");

function execute(root = path.resolve(__dirname, "..")) {
  if (process.env.NODE_TEST_CONTEXT !== undefined) {
    throw new Error("ordinary test runner must be launched outside a node:test worker; inherited worker context would skip test files");
  }
  // Share coverage's source/compiled parity check, not shell glob semantics.
  // This ordinary run neither measures coverage nor changes its policy.
  const tests = discoverTestContract(root);
  const result = spawnSync(process.execPath,
    ["--test", ...tests.compiled_typescript, ...tests.root_mjs],
    { cwd: root, env: isolatedFixtureEnvironment(process.env), stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

if (require.main === module) {
  try {
    process.exitCode = execute();
  } catch (error) {
    process.stderr.write(`test discovery/execution failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

module.exports = { execute };
