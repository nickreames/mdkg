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
