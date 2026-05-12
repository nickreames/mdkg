import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runSkillNewCommand, runSkillSyncCommand } = require("../../commands/skill");
const { scaffoldMirrorRoots, shouldMaintainSkillMirrors, syncSkillMirrors } = require("../../commands/skill_mirror");
const { runValidateCommand } = require("../../commands/validate");
const { loadConfig } = require("../../core/config");
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

test("skill sync can print deterministic json receipt", () => {
  const root = makeTempDir("mdkg-skill-mirror-json-");
  seedAgentBootstrap(root);
  captureOutput(() =>
    runSkillNewCommand({
      root,
      slug: "release-readiness",
      name: "release-readiness",
      description: "audit release readiness when preparing a release",
    })
  );

  const output = captureOutput(() => runSkillSyncCommand({ root, json: true }));

  assert.equal(output.stderr, "");
  assert.doesNotMatch(output.stdout, /skill mirror sync ok:/);
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "synced",
    sync: {
      synced: 2,
      pruned: 0,
      targets: 2,
    },
  });
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

test("validate warns when agent bootstrap mirror roots are missing", () => {
  const root = makeTempDir("mdkg-skill-mirror-roots-missing-");
  seedAgentBootstrap(root);

  const output = captureOutput(() => runValidateCommand({ root }));
  assert.match(output.stderr, /warning: \.agents\/skills: mirror root missing; run `mdkg skill sync`/);
  assert.match(output.stderr, /warning: \.claude\/skills: mirror root missing; run `mdkg skill sync`/);
  assert.match(output.stdout, /validation ok/);
});

test("validate reports manifest and managed mirror topology warnings", () => {
  const root = makeTempDir("mdkg-skill-mirror-audit-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  fs.rmSync(path.join(root, ".agents", "skills", ".mdkg-managed.json"), { force: true });
  fs.rmSync(path.join(root, ".claude", "skills", "release-readiness"), { recursive: true, force: true });
  writeFile(
    path.join(root, ".claude", "skills", ".mdkg-managed.json"),
    `${JSON.stringify({ managed_slugs: ["release-readiness", "stale-skill"] }, null, 2)}\n`
  );

  const output = captureOutput(() => runValidateCommand({ root }));
  assert.match(output.stderr, /warning: \.agents\/skills\/\.mdkg-managed\.json: mirror manifest missing/);
  assert.match(output.stderr, /warning: \.agents\/skills\/release-readiness: conflicting unmanaged mirror/);
  assert.match(output.stderr, /warning: \.claude\/skills\/release-readiness: missing mirrored skill/);
  assert.match(output.stderr, /warning: \.claude\/skills\/stale-skill: stale mirrored skill/);
  assert.match(output.stdout, /validation ok/);
});

test("validate treats malformed mirror manifests as unmanaged mirrors", () => {
  const root = makeTempDir("mdkg-skill-mirror-bad-manifest-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  writeFile(path.join(root, ".agents", "skills", ".mdkg-managed.json"), "{\n");
  writeFile(
    path.join(root, ".claude", "skills", ".mdkg-managed.json"),
    `${JSON.stringify({ managed_slugs: "release-readiness" }, null, 2)}\n`
  );

  const output = captureOutput(() => runValidateCommand({ root }));
  assert.match(output.stderr, /warning: \.agents\/skills\/release-readiness: conflicting unmanaged mirror/);
  assert.match(output.stderr, /warning: \.claude\/skills\/release-readiness: conflicting unmanaged mirror/);
  assert.match(output.stdout, /validation ok/);
});

test("skill mirror helpers skip unmanaged repos and scaffold mirror manifests", () => {
  const root = makeTempDir("mdkg-skill-mirror-helpers-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  const config = loadConfig(root);

  assert.equal(shouldMaintainSkillMirrors(root), false);
  assert.deepEqual(syncSkillMirrors({ root, config }), { synced: 0, pruned: 0, targets: 0 });

  fs.mkdirSync(path.join(root, ".agents"), { recursive: true });
  assert.equal(shouldMaintainSkillMirrors(root), true);

  scaffoldMirrorRoots(root);
  for (const product of ["agents", "claude"]) {
    const manifestPath = path.join(root, `.${product}`, "skills", ".mdkg-managed.json");
    assert.deepEqual(JSON.parse(fs.readFileSync(manifestPath, "utf8")).managed_slugs, []);
  }
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

test("skill sync mirrors support directories and audits nested drift", () => {
  const root = makeTempDir("mdkg-skill-mirror-support-dirs-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  const canonicalRoot = path.join(root, ".mdkg", "skills", "release-readiness");
  writeFile(path.join(canonicalRoot, "references", "guide.md"), "guide v1\n");
  writeFile(path.join(canonicalRoot, "references", "nested", "deep.md"), "deep reference\n");
  writeFile(path.join(canonicalRoot, "assets", "prompt.txt"), "asset prompt\n");
  writeFile(path.join(canonicalRoot, "scripts", "check.sh"), "echo check\n");

  captureOutput(() => runSkillSyncCommand({ root }));
  for (const product of ["agents", "claude"]) {
    const mirrorRoot = path.join(root, `.${product}`, "skills", "release-readiness");
    assert.equal(fs.readFileSync(path.join(mirrorRoot, "references", "guide.md"), "utf8"), "guide v1\n");
    assert.equal(fs.readFileSync(path.join(mirrorRoot, "references", "nested", "deep.md"), "utf8"), "deep reference\n");
    assert.equal(fs.readFileSync(path.join(mirrorRoot, "assets", "prompt.txt"), "utf8"), "asset prompt\n");
    assert.equal(fs.readFileSync(path.join(mirrorRoot, "scripts", "check.sh"), "utf8"), "echo check\n");
  }

  writeFile(path.join(root, ".agents", "skills", "release-readiness", "references", "guide.md"), "drift\n");
  const drift = captureOutput(() => runValidateCommand({ root }));
  assert.match(drift.stderr, /warning: \.agents\/skills\/release-readiness: mirrored skill drift detected/);

  writeFile(path.join(root, ".agents", "skills", "release-readiness", "references", "old.md"), "stale\n");
  fs.rmSync(path.join(canonicalRoot, "assets"), { recursive: true, force: true });
  captureOutput(() => runSkillSyncCommand({ root }));
  const agentMirrorRoot = path.join(root, ".agents", "skills", "release-readiness");
  assert.equal(fs.existsSync(path.join(agentMirrorRoot, "references", "old.md")), false);
  assert.equal(fs.existsSync(path.join(agentMirrorRoot, "assets")), false);
  assert.equal(fs.readFileSync(path.join(agentMirrorRoot, "references", "guide.md"), "utf8"), "guide v1\n");
});

test("skill sync prunes stale managed mirrors and cleans unexpected root entries", () => {
  const root = makeTempDir("mdkg-skill-mirror-prune-");
  seedAgentBootstrap(root);
  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release-readiness",
    description: "audit release readiness when preparing a release",
  });

  for (const product of ["agents", "claude"]) {
    const skillsRoot = path.join(root, `.${product}`, "skills");
    writeFile(path.join(skillsRoot, "stale-skill", "SKILL.md"), "# stale\n");
    writeFile(path.join(skillsRoot, "release-readiness", "UNEXPECTED.md"), "remove me\n");
    writeFile(
      path.join(skillsRoot, ".mdkg-managed.json"),
      `${JSON.stringify({ managed_slugs: ["release-readiness", "stale-skill"] }, null, 2)}\n`
    );
  }

  const output = captureOutput(() => runSkillSyncCommand({ root }));
  assert.match(output.stdout, /skill mirror sync ok: 2 synced, 2 pruned across 2 targets/);

  for (const product of ["agents", "claude"]) {
    const skillsRoot = path.join(root, `.${product}`, "skills");
    assert.equal(fs.existsSync(path.join(skillsRoot, "stale-skill")), false);
    assert.equal(fs.existsSync(path.join(skillsRoot, "release-readiness", "UNEXPECTED.md")), false);
    const manifest = JSON.parse(fs.readFileSync(path.join(skillsRoot, ".mdkg-managed.json"), "utf8"));
    assert.deepEqual(manifest.managed_slugs, ["release-readiness"]);
  }
});
