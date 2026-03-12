import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runSkillNewCommand, runSkillSyncCommand } = require("../../commands/skill");
const { runValidateCommand } = require("../../commands/validate");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function seedAgentBootstrap(root: string): void {
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "core", "SOUL.md"),
    [
      "---",
      "id: rule-soul",
      "type: rule",
      "title: soul",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-10",
      "updated: 2026-03-10",
      "---",
      "",
      "# Purpose",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "core", "HUMAN.md"),
    [
      "---",
      "id: rule-human",
      "type: rule",
      "title: human",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-10",
      "updated: 2026-03-10",
      "---",
      "",
      "# Purpose",
    ].join("\n")
  );
}

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const logLines: string[] = [];
  const errLines: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = ((...args: unknown[]) => {
    logLines.push(args.map((value) => String(value)).join(" "));
  }) as typeof console.log;
  console.error = ((...args: unknown[]) => {
    errLines.push(args.map((value) => String(value)).join(" "));
  }) as typeof console.error;
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: logLines.join("\n"), stderr: errLines.join("\n") };
}

test("skill new auto-syncs mirrors when agent bootstrap is enabled", () => {
  const root = makeTempDir("mdkg-skill-mirror-new-");
  seedAgentBootstrap(root);

  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  for (const relPath of [
    ".agents/skills/release-readiness/SKILL.md",
    ".claude/skills/release-readiness/SKILL.md",
  ]) {
    assert.ok(fs.existsSync(path.join(root, relPath)), `${relPath} should exist`);
  }
});

test("skill sync fails on unmanaged same-slug collisions unless forced", () => {
  const root = makeTempDir("mdkg-skill-mirror-conflict-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  fs.rmSync(path.join(root, ".agents", "skills", ".mdkg-managed.json"), { force: true });
  writeFile(path.join(root, ".agents", "skills", "release-readiness", "SKILL.md"), "# unmanaged\n");

  assert.throws(
    () => runSkillSyncCommand({ root }),
    /already exists and is not mdkg-managed/
  );

  assert.doesNotThrow(() => runSkillSyncCommand({ root, force: true }));
  const mirrored = fs.readFileSync(
    path.join(root, ".agents", "skills", "release-readiness", "SKILL.md"),
    "utf8"
  );
  assert.match(mirrored, /audit release readiness/);
});

test("validate warns when mirrored skills drift from canonical content", () => {
  const root = makeTempDir("mdkg-skill-mirror-drift-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  writeFile(
    path.join(root, ".mdkg", "skills", "release-readiness", "SKILL.md"),
    [
      "---",
      "name: release-readiness",
      "description: audit release readiness when preparing a release",
      "---",
      "",
      "# Goal",
      "",
      "Changed canonical body.",
    ].join("\n")
  );

  const output = captureOutput(() => runValidateCommand({ root }));
  assert.match(output.stderr, /warning: \.agents\/skills\/release-readiness: mirrored skill drift detected/);
  assert.match(output.stderr, /warning: \.claude\/skills\/release-readiness: mirrored skill drift detected/);
  assert.match(output.stdout, /validation ok/);
});

test("skill sync refreshes managed mirrors in place after canonical edits", () => {
  const root = makeTempDir("mdkg-skill-mirror-refresh-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  writeFile(
    path.join(root, ".mdkg", "skills", "release-readiness", "SKILL.md"),
    [
      "---",
      "name: release-readiness",
      "description: audit release readiness when preparing a release",
      "---",
      "",
      "# Goal",
      "",
      "Updated canonical body.",
    ].join("\n")
  );

  assert.doesNotThrow(() => runSkillSyncCommand({ root }));

  const mirrored = fs.readFileSync(
    path.join(root, ".agents", "skills", "release-readiness", "SKILL.md"),
    "utf8"
  );
  assert.match(mirrored, /Updated canonical body/);
});
