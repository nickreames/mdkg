import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runIndexCommand } = require("../../commands/index");
const { runSkillListCommand, runSkillSearchCommand, runSkillShowCommand } = require("../../commands/skill");
const { parseFrontmatter } = require("../../graph/frontmatter");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

function writeConfig(root: string): void {
  const config = {
    schema_version: 1,
    tool: "mdkg",
    root_required: true,
    index: {
      auto_reindex: true,
      tolerant: false,
      global_index_path: ".mdkg/index/global.json",
    },
    pack: {
      default_depth: 2,
      default_edges: ["parent", "epic", "relates"],
      verbose_core_list_path: ".mdkg/core/core.md",
      limits: { max_nodes: 25, max_bytes: 2000000 },
    },
    templates: {
      root_path: ".mdkg/templates",
      default_set: "default",
      workspace_overrides_enabled: false,
    },
    work: {
      status_enum: ["backlog", "blocked", "todo", "progress", "review", "done"],
      priority_min: 0,
      priority_max: 9,
      next: {
        strategy: "chain_then_priority",
        status_preference: ["progress", "todo", "review", "blocked", "backlog"],
      },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeTask(root: string): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: Seed task",
    "status: todo",
    "priority: 1",
    "tags: [stage:plan]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
    "# Overview",
    "",
    "Seed",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
}

function writeSkills(root: string): void {
  const planSkill = [
    "---",
    "name: plan-run",
    "description: plan stage workflow when a plan-stage skill is needed",
    "tags: [stage:plan, writer:read-only, risk:low]",
    "version: 1.0.0",
    "authors: [team]",
    "links: [https://example.com/plan]",
    "ochatr_policy: advisory",
    "---",
    "",
    "# Goal",
    "",
    "Plan work deterministically.",
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
  ].join("\n");
  const executeSkill = [
    "---",
    "name: deploy-service",
    "description: execute deploy workflow when a service is ready to ship",
    "tags: [stage:execute, writer:patch-only, risk:high]",
    "---",
    "",
    "# Goal",
    "",
    "Deploy safely.",
    "",
    "## When To Use",
    "",
    "- During execution.",
    "",
    "## Inputs",
    "",
    "- Task",
    "",
    "## Steps",
    "",
    "1. Deploy.",
    "",
    "## Outputs",
    "",
    "- Deploy result.",
    "",
    "## Safety",
    "",
    "- Safe.",
    "",
    "## Failure Handling",
    "",
    "- Stop.",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "skills", "plan-run", "SKILL.md"), planSkill);
  writeFile(path.join(root, ".mdkg", "skills", "deploy-service", "SKILL.md"), executeSkill);
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
  return {
    stdout: logLines.join("\n"),
    stderr: errLines.join("\n"),
  };
}

test("skill list supports tag filtering and count output", () => {
  const root = makeTempDir("mdkg-skill-list-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  const planOnly = captureOutput(() =>
    runSkillListCommand({
      root,
      tags: ["stage:plan"],
      tagsMode: "all",
    })
  );
  assert.match(planOnly.stdout, /root:skill:plan-run \| skill \| -\/- \| plan-run/);
  assert.doesNotMatch(planOnly.stdout, /deploy-service/);
  assert.match(planOnly.stderr, /count: 1/);

  const anyStage = captureOutput(() =>
    runSkillListCommand({
      root,
      tags: ["stage:plan", "stage:execute"],
      tagsMode: "any",
    })
  );
  assert.match(anyStage.stdout, /root:skill:plan-run/);
  assert.match(anyStage.stdout, /root:skill:deploy-service/);
  assert.match(anyStage.stderr, /count: 2/);
});

test("skill list prints empty-state note", () => {
  const root = makeTempDir("mdkg-skill-list-empty-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);

  const empty = captureOutput(() =>
    runSkillListCommand({
      root,
    })
  );
  assert.equal(empty.stdout, "");
  assert.match(empty.stderr, /count: 0/);
  assert.match(empty.stderr, /note: no skills matched current filters/);
});

test("skill search includes skills metadata and tag filtering", () => {
  const root = makeTempDir("mdkg-skill-search-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  const output = captureOutput(() =>
    runSkillSearchCommand({
      root,
      query: "deploy workflow",
      tags: ["stage:execute"],
      tagsMode: "all",
    })
  );
  assert.match(output.stdout, /root:skill:deploy-service/);
  assert.match(output.stderr, /count: 1/);
});

test("skill search enforces query", () => {
  const root = makeTempDir("mdkg-skill-search-rules-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  assert.throws(
    () =>
      runSkillSearchCommand({
        root,
        query: "   ",
      }),
    /search query cannot be empty/
  );
});

test("skill show renders full body by default and meta when requested", () => {
  const root = makeTempDir("mdkg-skill-show-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  const full = captureOutput(() =>
    runSkillShowCommand({
      root,
      slug: "plan-run",
    })
  ).stdout;
  assert.match(full, /name: plan-run/);
  assert.match(full, /# Goal/);

  const meta = captureOutput(() =>
    runSkillShowCommand({
      root,
      slug: "plan-run",
      metaOnly: true,
    })
  ).stdout;
  assert.match(meta, /root:skill:plan-run \| skill \| -\/- \| plan-run/);
  assert.match(meta, /tags: stage:plan, writer:read-only, risk:low/);
  assert.match(meta, /ochatr_policy: advisory/);
});

test("internal dogfood skills comply with the locked Anthropic best-practice snapshot", () => {
  const realRoot = path.resolve(__dirname, "..", "..", "..");
  const requiredSkills = [
    {
      slug: "author-mdkg-skill",
      writerTag: "writer:orchestrator",
      bodyChecks: [/mdkg skill new/i, /update it instead of creating a near-duplicate/i],
    },
    {
      slug: "select-work-and-ground-context",
      writerTag: "writer:read-only",
      bodyChecks: [/read-only/i, /do not mutate mdkg state/i],
    },
    {
      slug: "build-pack-and-execute-task",
      writerTag: "writer:patch-only",
      bodyChecks: [/patch-only/i, /pack <id>/i, /do not mutate task status/i],
    },
    {
      slug: "verify-close-and-checkpoint",
      writerTag: "writer:orchestrator",
      bodyChecks: [/single-writer/i, /durable mdkg writes/i, /never commit on every tool call/i],
    },
  ];

  for (const skill of requiredSkills) {
    const slug = skill.slug;
    const skillPath = path.join(realRoot, ".mdkg", "skills", slug, "SKILL.md");
    assert.ok(fs.existsSync(skillPath), skillPath);
    assert.equal(fs.existsSync(path.join(realRoot, ".mdkg", "skills", slug, "SKILLS.md")), false);

    const content = fs.readFileSync(skillPath, "utf8");
    const lineCount = content.split("\n").length;
    const parsed = parseFrontmatter(content, skillPath);

    assert.equal(parsed.frontmatter.name, slug);
    assert.match(String(parsed.frontmatter.name), /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(typeof parsed.frontmatter.description, "string");
    assert.ok(String(parsed.frontmatter.description).trim().length > 0);
    assert.match(String(parsed.frontmatter.description), /\bwhen\b/i);
    assert.ok(lineCount < 500, `${slug} exceeds Anthropic guidance size budget`);

    const tags = Array.isArray(parsed.frontmatter.tags) ? parsed.frontmatter.tags.map(String) : [];
    const stageTags = tags.filter((tag: string) => tag.startsWith("stage:"));
    const writerTags = tags.filter((tag: string) => tag.startsWith("writer:"));
    assert.equal(stageTags.length, 1, `${slug} must carry exactly one stage tag`);
    assert.equal(writerTags.length, 1, `${slug} must carry exactly one writer tag`);
    assert.equal(writerTags[0], skill.writerTag);

    const body = parsed.body;
    assert.match(body, /^# Goal/m);
    assert.match(body, /^## When To Use/m);
    assert.match(body, /^## Inputs/m);
    assert.match(body, /^## Steps/m);
    assert.match(body, /^## Outputs/m);
    assert.match(body, /^## Safety/m);
    assert.match(body, /^## Failure Handling/m);
    assert.match(body, /mdkg indexes and discovers skills, but does not execute skill scripts/i);

    for (const pattern of skill.bodyChecks) {
      assert.match(body, pattern);
    }
  }
});

test("built-in skill template and registry stay aligned with dogfood skills", () => {
  const realRoot = path.resolve(__dirname, "..", "..", "..");
  const templatePath = path.join(realRoot, "assets", "skills", "SKILL.md.example");
  assert.ok(fs.existsSync(templatePath), templatePath);
  const template = fs.readFileSync(templatePath, "utf8");
  assert.match(template, /^# Goal/m);
  assert.match(template, /^## When To Use/m);
  assert.match(template, /^## Inputs/m);
  assert.match(template, /^## Steps/m);
  assert.match(template, /^## Outputs/m);
  assert.match(template, /^## Safety/m);
  assert.match(template, /^## Failure Handling/m);
  assert.doesNotMatch(template, /^## Preconditions/m);
  assert.doesNotMatch(template, /^## Examples/m);
  assert.doesNotMatch(template, /^## References/m);

  const registryPath = path.join(realRoot, ".mdkg", "skills", "registry.md");
  const registry = fs.readFileSync(registryPath, "utf8");
  assert.match(registry, /mdkg skill new <slug> "<name>" --description "\.\.\."/);
  assert.match(registry, /CLI_COMMAND_MATRIX\.md/);
  assert.match(registry, /<!-- mdkg:skill-registry:start -->/);
  assert.match(registry, /<!-- mdkg:skill-registry:end -->/);
  assert.match(registry, /`author-mdkg-skill`/);
  assert.match(registry, /`select-work-and-ground-context`/);
  assert.match(registry, /`build-pack-and-execute-task`/);
  assert.match(registry, /`verify-close-and-checkpoint`/);
});
