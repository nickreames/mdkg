import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
const { runSkillListCommand, runSkillSearchCommand, runSkillShowCommand } = require("../../commands/skill");
const { runListCommand } = require("../../commands/list");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
const { runCli } = require("../../cli");
import { writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function setupRepo(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-skill-namespace-"));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "skills", "plan-run", "SKILL.md"),
    [
      "---",
      'name: "plan run"',
      'description: "plan the work when a plan-stage skill is needed"',
      "tags: [stage:plan, writer:read-only]",
      "---",
      "",
      "# Goal",
      "",
      "Plan work.",
      "",
      "## When To Use",
      "",
      "- During planning.",
      "",
      "## Inputs",
      "",
      "- Task",
      "",
      "## Steps",
      "",
      "1. Plan.",
      "",
      "## Outputs",
      "",
      "- Plan.",
      "",
      "## Safety",
      "",
      "- Safe.",
      "",
      "## Failure Handling",
      "",
      "- Stop.",
    ].join("\n")
  );
  return root;
}

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = ((...args: unknown[]) => stdout.push(args.map(String).join(" "))) as typeof console.log;
  console.error = ((...args: unknown[]) => stderr.push(args.map(String).join(" "))) as typeof console.error;
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

test("skill aliases match generic list show and search behavior", () => {
  const root = setupRepo();

  const skillList = captureOutput(() =>
    runSkillListCommand({ root, tags: ["stage:plan"], tagsMode: "all" })
  ).stdout;
  const genericList = captureOutput(() =>
    runListCommand({ root, type: "skill", tags: ["stage:plan"], tagsMode: "all" })
  ).stdout;
  assert.equal(skillList, genericList);

  const skillShow = captureOutput(() => runSkillShowCommand({ root, slug: "plan-run" })).stdout;
  const genericShow = captureOutput(() => runShowCommand({ root, id: "skill:plan-run" })).stdout;
  assert.equal(skillShow, genericShow);

  const skillSearch = captureOutput(() =>
    runSkillSearchCommand({ root, query: "plan-stage", tags: ["stage:plan"], tagsMode: "all" })
  ).stdout;
  const genericSearch = captureOutput(() =>
    runSearchCommand({ root, query: "plan-stage", type: "skill", tags: ["stage:plan"], tagsMode: "all" })
  ).stdout;
  assert.equal(skillSearch, genericSearch);
});

test("cli help teaches the skill namespace", () => {
  const root = setupRepo();
  const stdout: string[] = [];
  const stderr: string[] = [];
  const code = runCli(["help", "skill", "new"], {
    cwd: () => root,
    log: (...args: unknown[]) => stdout.push(args.map(String).join(" ")),
    error: (...args: unknown[]) => stderr.push(args.map(String).join(" ")),
  });
  assert.equal(code, 0);
  assert.match(stdout.join("\n"), /mdkg skill new <slug> "<name>" --description "<description>"/);
  assert.equal(stderr.join("\n"), "");
});
