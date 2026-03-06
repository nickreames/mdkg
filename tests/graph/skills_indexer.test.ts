import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { loadConfig } = require("../../core/config");
const { buildSkillsIndex } = require("../../graph/skills_indexer");
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

test("buildSkillsIndex parses skill metadata deterministically", () => {
  const root = makeTempDir("mdkg-skills-index-");
  writeConfig(root);
  writeDefaultTemplates(root);

  const skill = [
    "---",
    "name: deploy-service",
    "description: deploy service safely",
    "tags: [stage:execute, risk:high]",
    "version: 1.2.3",
    "authors: [team]",
    "links: [https://example.com/deploy]",
    "ochatr_policy: approval-required",
    "---",
    "",
    "# Steps",
    "",
    "1. Deploy",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "skills", "deploy-service", "SKILL.md"), skill);
  writeFile(path.join(root, ".mdkg", "skills", "deploy-service", "scripts", "run.sh"), "echo hi\n");
  writeFile(path.join(root, ".mdkg", "skills", "deploy-service", "references", "notes.md"), "notes\n");

  const config = loadConfig(root);
  const index = buildSkillsIndex(root, config);
  assert.equal(index.meta.skill_count, 1);
  const entry = index.skills["deploy-service"];
  assert.equal(entry.slug, "deploy-service");
  assert.equal(entry.name, "deploy-service");
  assert.equal(entry.description, "deploy service safely");
  assert.deepEqual(entry.tags, ["stage:execute", "risk:high"]);
  assert.equal(entry.version, "1.2.3");
  assert.equal(entry.has_scripts, true);
  assert.equal(entry.has_references, true);
  assert.equal(entry.ochatr.ochatr_policy, "approval-required");
});
