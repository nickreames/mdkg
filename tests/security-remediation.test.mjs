import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { verifyMatrix } = require("../scripts/verify-security-remediation.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalPath = path.join(root, "security", "v0.5.0-remediation-matrix.json");

function loadMatrix() {
  return JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
}

function withMutation(mutate, assertion) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-security-matrix-"));
  try {
    const matrix = loadMatrix();
    mutate(matrix);
    const candidate = path.join(directory, "matrix.json");
    fs.writeFileSync(candidate, JSON.stringify(matrix, null, 2) + "\n");
    assertion(() => verifyMatrix(candidate, root));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("canonical security remediation matrix closes the exact 51-finding set", () => {
  const receipt = verifyMatrix(canonicalPath, root);
  assert.deepEqual(receipt.counts, { total: 51, high: 5, medium: 28, low: 18 });
  assert.deepEqual(receipt.owners, [
    "task-764", "task-765", "task-766", "task-767", "task-768",
    "task-769", "task-770", "task-771", "task-772", "task-773",
  ]);
});

test("security remediation verifier rejects missing and duplicate candidates", () => {
  withMutation((matrix) => matrix.findings.pop(), (verify) => {
    assert.throws(verify, /expected 51 findings/);
  });
  withMutation((matrix) => {
    matrix.findings[50] = { ...matrix.findings[0] };
  }, (verify) => {
    assert.throws(verify, /duplicate finding id/);
  });
});

test("security remediation verifier rejects unresolved closure and severity drift", () => {
  withMutation((matrix) => {
    matrix.findings[0].closure = "open";
  }, (verify) => {
    assert.throws(verify, /is unresolved/);
  });
  withMutation((matrix) => {
    matrix.findings[0].severity = "high";
  }, (verify) => {
    assert.throws(verify, /severity drift/);
  });
});

test("security remediation verifier rejects absent direct regression evidence", () => {
  withMutation((matrix) => {
    matrix.findings[0].regression_refs = ["tests/commands/does-not-exist.test.ts#specific missing regression"];
  }, (verify) => {
    assert.throws(verify, /does not exist/);
  });
  withMutation((matrix) => {
    matrix.findings[0].regression_refs = ["tests/commands/read_only_observational.test.ts#needle that is intentionally absent"];
  }, (verify) => {
    assert.throws(verify, /test needle is absent/);
  });
});
