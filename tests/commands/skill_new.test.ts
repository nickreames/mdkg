import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runSkillNewCommand } = require("../../commands/skill");
const { parseFrontmatter } = require("../../graph/frontmatter");
import { makeTempDir } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

test("skill new creates scaffold, registry entry, and no scripts by default", () => {
  const root = makeTempDir("mdkg-skill-new-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  runSkillNewCommand({
    root,
    slug: "release-readiness",
    name: "release readiness audit",
    description: "create a release-readiness checklist when preparing a release",
    tags: "stage:review,release",
    authors: "mdkg,qa",
    links: "README.md,PACK_EXAMPLES.md",
  });

  const skillPath = path.join(root, ".mdkg", "skills", "release-readiness", "SKILL.md");
  assert.ok(fs.existsSync(skillPath));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "skills", "release-readiness", "references")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "skills", "release-readiness", "assets")));
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "skills", "release-readiness", "scripts")), false);

  const parsed = parseFrontmatter(fs.readFileSync(skillPath, "utf8"), skillPath);
  assert.equal(parsed.frontmatter.name, "release readiness audit");
  assert.equal(
    parsed.frontmatter.description,
    "create a release-readiness checklist when preparing a release"
  );
  assert.deepEqual(parsed.frontmatter.tags, ["stage:review", "release"]);
  assert.match(parsed.body, /^# Goal/m);
  assert.match(parsed.body, /^## When To Use/m);
  assert.match(parsed.body, /^## Failure Handling/m);

  const registry = fs.readFileSync(path.join(root, ".mdkg", "skills", "registry.md"), "utf8");
  assert.match(registry, /`release-readiness`/);
  assert.match(registry, /release readiness audit/);
});

test("skill new creates scripts only when requested and requires force for overwrite", () => {
  const root = makeTempDir("mdkg-skill-new-force-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  runSkillNewCommand({
    root,
    slug: "deploy-check",
    name: "deploy check",
    description: "validate deploy readiness when preparing a deployment",
    withScripts: true,
  });
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "skills", "deploy-check", "scripts")));

  assert.throws(
    () =>
      runSkillNewCommand({
        root,
        slug: "deploy-check",
        name: "deploy check",
        description: "validate deploy readiness when preparing a deployment",
      }),
    /use --force to overwrite/
  );

  runSkillNewCommand({
    root,
    slug: "deploy-check",
    name: "deploy check updated",
    description: "validate deploy readiness when the release gate is active",
    force: true,
  });

  const skillPath = path.join(root, ".mdkg", "skills", "deploy-check", "SKILL.md");
  const parsed = parseFrontmatter(fs.readFileSync(skillPath, "utf8"), skillPath);
  assert.equal(parsed.frontmatter.name, "deploy check updated");
});
