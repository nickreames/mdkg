import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { runIndexCommand } = require("../../commands/index");
const { runListCommand } = require("../../commands/list");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
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
    "description: plan stage workflow",
    "tags: [stage:plan, risk:low]",
    "version: 1.0.0",
    "authors: [team]",
    "links: [https://example.com/plan]",
    "ochatr_policy: advisory",
    "---",
    "",
    "# Goal",
    "",
    "Plan work deterministically.",
  ].join("\n");
  const executeSkill = [
    "---",
    "name: deploy-service",
    "description: execute deploy workflow",
    "tags: [stage:execute, risk:high]",
    "---",
    "",
    "# Goal",
    "",
    "Deploy safely.",
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

test("skill list supports type=skill and tag mode filtering", () => {
  const root = makeTempDir("mdkg-skill-list-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  const planOnly = captureOutput(() =>
    runListCommand({
      root,
      type: "skill",
      tags: ["stage:plan"],
      tagsMode: "all",
    })
  ).stdout;
  assert.match(planOnly, /root:skill:plan-run \| skill \| -\/- \| plan-run/);
  assert.doesNotMatch(planOnly, /deploy-service/);

  const anyStage = captureOutput(() =>
    runListCommand({
      root,
      type: "skill",
      tags: ["stage:plan", "stage:execute"],
      tagsMode: "any",
    })
  ).stdout;
  assert.match(anyStage, /root:skill:plan-run/);
  assert.match(anyStage, /root:skill:deploy-service/);
});

test("skill search includes skills metadata", () => {
  const root = makeTempDir("mdkg-skill-search-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  const output = captureOutput(() =>
    runSearchCommand({
      root,
      query: "deploy workflow",
    })
  ).stdout;
  assert.match(output, /root:skill:deploy-service/);
});

test("show skill renders full body by default and meta when requested", () => {
  const root = makeTempDir("mdkg-skill-show-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });

  const full = captureOutput(() =>
    runShowCommand({
      root,
      id: "skill:plan-run",
    })
  ).stdout;
  assert.match(full, /name: plan-run/);
  assert.match(full, /# Goal/);

  const meta = captureOutput(() =>
    runShowCommand({
      root,
      id: "skill:plan-run",
      metaOnly: true,
    })
  ).stdout;
  assert.match(meta, /root:skill:plan-run \| skill \| -\/- \| plan-run/);
  assert.match(meta, /tags: stage:plan, risk:low/);
  assert.match(meta, /ochatr_policy: advisory/);
});
