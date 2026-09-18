import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(process.cwd());
const { portableSkillBodyDiagnostics } = require("../core/public_skill_projection") as {
  portableSkillBodyDiagnostics(source: string): string[];
};
const exactPublic = [
  "author-mdkg-skill",
  "build-pack-and-execute-task",
  "pursue-mdkg-goal",
  "pursue-mdkg-loop",
  "select-work-and-ground-context",
  "verify-close-and-checkpoint",
] as const;
const repositoryOnly = [
  "release-mdkg-package",
  "service-boundary-ownership-check",
] as const;
const portableBehavior: Record<(typeof exactPublic)[number], string[]> = {
  "author-mdkg-skill": [
    "mdkg skill sync --json",
    "customization.skill_mirrors.targets",
    "MANIFEST.md",
  ],
  "build-pack-and-execute-task": [
    "mdkg pack",
    "Keep this stage patch-only",
    "separately authorized archive/bundle refresh",
    "do not infer that authority from the patch-only stage",
  ],
  "pursue-mdkg-goal": [
    "explicit goal QID",
    "mdkg goal next",
    "mdkg goal evaluate",
  ],
  "pursue-mdkg-loop": [
    "mdkg loop plan",
    "mdkg loop next",
    "whole_loop_blocked",
  ],
  "select-work-and-ground-context": [
    "mdkg goal current",
    "mdkg goal next",
    "Treat this stage as read-only",
  ],
  "verify-close-and-checkpoint": [
    "mdkg validate",
    "mdkg task done",
    "Bundle-Aware Commit Gate",
    "Multi-Repo Closeout Gate",
    "Authority-Separated Release Handoff",
  ],
};

function skillPath(root: string, slug: string): string {
  return path.join(repoRoot, root, slug, "SKILL.md");
}

function readSkill(root: string, slug: string): string {
  return fs.readFileSync(skillPath(root, slug), "utf8");
}

function assertPatchOnlyAuthority(source: string): void {
  const body = source.replace(/\s+/g, " ");
  assert.match(body, /Keep this stage patch-only/);
  assert.match(body, /hand that to the orchestrator stage for separately authorized archive\/bundle refresh/);
  assert.match(body, /do not infer that authority from the patch-only stage/);
  assert.doesNotMatch(body, /mdkg archive compress --all|mdkg bundle create/);
}

test("all configured skill mirrors exactly match the eight canonical bodies", () => {
  for (const slug of [...exactPublic, ...repositoryOnly]) {
    const canonical = readSkill(".mdkg/skills", slug);
    assert.equal(readSkill(".agents/skills", slug), canonical, `.agents drift: ${slug}`);
    assert.equal(readSkill(".claude/skills", slug), canonical, `.claude drift: ${slug}`);
  }
});

test("six public candidates are exact portable bodies and two repository skills remain absent", () => {
  for (const slug of exactPublic) {
    const canonical = readSkill(".mdkg/skills", slug);
    assert.equal(readSkill("assets/init/skills/default", slug), canonical, `public drift: ${slug}`);
    assert.deepEqual(portableSkillBodyDiagnostics(canonical), [], `non-portable public body: ${slug}`);
    if (slug === "build-pack-and-execute-task") assertPatchOnlyAuthority(canonical);
    for (const behavior of portableBehavior[slug]) {
      assert.match(canonical, new RegExp(behavior.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
  for (const slug of repositoryOnly) {
    assert.equal(fs.existsSync(path.join(repoRoot, "assets", "init", "skills", "default", slug)), false);
  }
});

test("patch-only authority gate rejects missing delegation boundaries and direct mutation commands", () => {
  const source = readSkill(".mdkg/skills", "build-pack-and-execute-task");
  assertPatchOnlyAuthority(source);
  for (const required of ["Keep this stage patch-only", "separately authorized archive/bundle refresh", "do not infer that authority from the patch-only stage"]) {
    assert.throws(() => assertPatchOnlyAuthority(source.replace(required, "")));
  }
  for (const forbidden of ["mdkg archive compress --all", "mdkg bundle create --profile private"]) {
    assert.throws(() => assertPatchOnlyAuthority(source + "\n" + forbidden));
  }
});

test("portability scan rejects procedures and local references but permits authority boundaries", () => {
  const safe = [
    "Publication, push, tag, deployment, provider mutation, registry access,",
    "and credential handling require separate authority.",
    "Do not perform package release operations from this skill.",
  ].join("\n");
  assert.deepEqual(portableSkillBodyDiagnostics(safe), []);

  const fixtures: Array<[string, string]> = [
    ["npm publish --registry=https://registry.npmjs.org/", "package publication command"],
    ["npm whoami", "registry inspection or authentication command"],
    ["printf '_authToken=${NPM_TOKEN}'", "registry credential procedure"],
    ["git push origin main", "push or tag command"],
    ["vercel deploy --prod", "deployment command"],
    ["gh release create v1.0.0", "provider release command"],
    ["Use root:goal-999 as evidence.", "root-qualified internal QID"],
    ["Read .mdkg/design/dec-999-private.md.", "repository-local design or work link"],
    ["Update mdkg.dev through Vercel.", "named internal product or provider"],
  ];
  for (const [fixture, identity] of fixtures) {
    assert.ok(
      portableSkillBodyDiagnostics(`---\nname: fixture\n---\n${fixture}\n`).includes(identity),
      `${identity}: ${fixture}`,
    );
  }
});
