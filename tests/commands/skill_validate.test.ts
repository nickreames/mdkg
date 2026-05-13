import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runSkillValidateCommand } = require("../../commands/skill");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function captureOutput(fn: () => void): { stdout: string; stderr: string; error?: unknown } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  let error: unknown;
  console.log = ((...args: unknown[]) => stdout.push(args.map(String).join(" "))) as typeof console.log;
  console.error = ((...args: unknown[]) => stderr.push(args.map(String).join(" "))) as typeof console.error;
  try {
    fn();
  } catch (err) {
    error = err;
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), error };
}

test("skill validate supports all-skill and single-skill scope", () => {
  const root = makeTempDir("mdkg-skill-validate-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "skills", "plan-run", "SKILL.md"),
    [
      "---",
      'name: "plan run"',
      'description: "plan work when the plan stage is active"',
      "---",
      "",
      "# Goal",
    ].join("\n")
  );

  const allResult = captureOutput(() => runSkillValidateCommand({ root }));
  assert.equal(allResult.error, undefined);
  assert.match(allResult.stdout, /skill validation ok: 1 skill checked/);

  const singleResult = captureOutput(() => runSkillValidateCommand({ root, slug: "plan-run" }));
  assert.equal(singleResult.error, undefined);
  assert.match(singleResult.stdout, /skill validation ok: plan-run \(1 skill checked\)/);
});

test("skill validate supports all-skill and scoped json receipts", () => {
  const root = makeTempDir("mdkg-skill-validate-json-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "skills", "plan-run", "SKILL.md"),
    [
      "---",
      'name: "plan run"',
      'description: "plan work when the plan stage is active"',
      "---",
      "",
      "# Goal",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "skills", "legacy-plan", "SKILLS.md"),
    [
      "---",
      'name: "legacy plan"',
      'description: "plan work when a legacy compat file is present"',
      "---",
      "",
      "# Goal",
    ].join("\n")
  );

  const allResult = captureOutput(() => runSkillValidateCommand({ root, json: true }));
  const allReceipt = JSON.parse(allResult.stdout) as {
    action: string;
    ok: boolean;
    checked_count: number;
    warning_count: number;
    error_count: number;
    warnings: string[];
    errors: string[];
    target?: string;
  };

  assert.equal(allResult.error, undefined);
  assert.equal(allResult.stderr, "");
  assert.equal(allReceipt.action, "validated");
  assert.equal(allReceipt.ok, true);
  assert.equal(allReceipt.checked_count, 2);
  assert.equal(allReceipt.warning_count, 1);
  assert.equal(allReceipt.error_count, 0);
  assert.equal(allReceipt.errors.length, 0);
  assert.equal(allReceipt.target, undefined);
  assert.match(allReceipt.warnings[0] ?? "", /legacy-plan\/SKILLS\.md/);

  const singleResult = captureOutput(() =>
    runSkillValidateCommand({ root, slug: "legacy-plan", json: true })
  );
  const singleReceipt = JSON.parse(singleResult.stdout) as {
    ok: boolean;
    checked_count: number;
    warning_count: number;
    error_count: number;
    warnings: string[];
    target?: string;
  };

  assert.equal(singleResult.error, undefined);
  assert.equal(singleResult.stderr, "");
  assert.equal(singleReceipt.ok, true);
  assert.equal(singleReceipt.checked_count, 1);
  assert.equal(singleReceipt.warning_count, 1);
  assert.equal(singleReceipt.error_count, 0);
  assert.equal(singleReceipt.target, "legacy-plan");
  assert.match(singleReceipt.warnings[0] ?? "", /legacy-plan\/SKILLS\.md/);
});

test("skill validate emits a failing json receipt before throwing", () => {
  const root = makeTempDir("mdkg-skill-validate-json-fail-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "skills", "broken-run", "SKILL.md"),
    [
      "---",
      'name: "broken run"',
      "---",
      "",
      "# Goal",
    ].join("\n")
  );

  const result = captureOutput(() =>
    runSkillValidateCommand({ root, slug: "broken-run", json: true })
  );
  const receipt = JSON.parse(result.stdout) as {
    ok: boolean;
    checked_count: number;
    warning_count: number;
    error_count: number;
    errors: string[];
    target?: string;
  };

  assert.match(result.error instanceof Error ? result.error.message : "", /skill validation failed with 1 error/);
  assert.equal(result.stderr, "");
  assert.equal(receipt.ok, false);
  assert.equal(receipt.checked_count, 1);
  assert.equal(receipt.warning_count, 0);
  assert.equal(receipt.error_count, 1);
  assert.equal(receipt.target, "broken-run");
  assert.match(receipt.errors[0] ?? "", /description is required/);
});

test("skill validate warns for legacy compat files and fails deterministically on malformed skills", () => {
  const root = makeTempDir("mdkg-skill-validate-compat-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "skills", "legacy-plan", "SKILLS.md"),
    [
      "---",
      'name: "legacy plan"',
      'description: "plan work when a legacy compat file is present"',
      "---",
      "",
      "# Goal",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "skills", "broken-run", "SKILL.md"),
    [
      "---",
      'name: "broken run"',
      "---",
      "",
      "# Goal",
    ].join("\n")
  );

  const allResult = captureOutput(() => runSkillValidateCommand({ root }));
  assert.ok(allResult.error);
  assert.match(allResult.stderr, /legacy-plan\/SKILLS\.md: using legacy SKILLS\.md compatibility file/);
  assert.match(allResult.stderr, /description is required and must be a non-empty string/);

  const singleCompat = captureOutput(() => runSkillValidateCommand({ root, slug: "legacy-plan" }));
  assert.equal(singleCompat.error, undefined);
  assert.match(singleCompat.stderr, /legacy-plan\/SKILLS\.md: using legacy SKILLS\.md compatibility file/);

  const singleBroken = captureOutput(() => runSkillValidateCommand({ root, slug: "broken-run" }));
  assert.ok(singleBroken.error);
  assert.match(singleBroken.stderr, /description is required and must be a non-empty string/);
});
