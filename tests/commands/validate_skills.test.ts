import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { runValidateCommand } = require("../../commands/validate");
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

function writeTask(root: string, skills: string[]): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: skill ref task",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    `skills: [${skills.join(", ")}]`,
    "created: 2026-03-05",
    "updated: 2026-03-05",
    "---",
    "",
    "# Overview",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
}

test("validate passes when node skill references exist", () => {
  const root = makeTempDir("mdkg-validate-skills-ok-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, ["deploy-service"]);
  writeFile(
    path.join(root, ".mdkg", "skills", "deploy-service", "SKILL.md"),
    ["---", "name: deploy-service", "description: deploy", "---", "", "# Goal"].join("\n")
  );
  assert.doesNotThrow(() => runValidateCommand({ root, quiet: true }));
});

test("validate fails when node skill reference is missing", () => {
  const root = makeTempDir("mdkg-validate-skills-missing-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, ["missing-skill"]);

  assert.throws(
    () => runValidateCommand({ root, quiet: true }),
    /validation failed with 1 error/
  );
});

test("validate fails when skills directory misses SKILL.md", () => {
  const root = makeTempDir("mdkg-validate-skill-dir-missing-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, []);
  writeFile(path.join(root, ".mdkg", "skills", "no-skill-file", "README.md"), "placeholder");

  assert.throws(
    () => runValidateCommand({ root, quiet: true }),
    /validation failed with 1 error/
  );
});

test("validate accepts SKILLS.md compatibility file", () => {
  const root = makeTempDir("mdkg-validate-skills-compat-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, ["review-loop"]);
  writeFile(
    path.join(root, ".mdkg", "skills", "review-loop", "SKILLS.md"),
    ["---", "name: review-loop", "description: review", "---", "", "# Goal"].join("\n")
  );
  assert.doesNotThrow(() => runValidateCommand({ root, quiet: true }));
});

test("validate fails when SKILL.md and SKILLS.md both exist", () => {
  const root = makeTempDir("mdkg-validate-skills-conflict-");
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, ["review-loop"]);
  const content = ["---", "name: review-loop", "description: review", "---", "", "# Goal"].join("\n");
  writeFile(path.join(root, ".mdkg", "skills", "review-loop", "SKILL.md"), content);
  writeFile(path.join(root, ".mdkg", "skills", "review-loop", "SKILLS.md"), content);

  assert.throws(
    () => runValidateCommand({ root, quiet: true }),
    /validation failed with 1 error/
  );
});
