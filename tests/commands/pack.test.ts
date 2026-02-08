import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
const { runPackCommand } = require("../../commands/pack");

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
      default_depth: 1,
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

function writeTaskTemplateWithHeadings(root: string): void {
  const content = [
    "---",
    "id: {{id}}",
    "type: task",
    "title: {{title}}",
    "status: {{status}}",
    "priority: {{priority}}",
    "epic: {{epic}}",
    "parent: {{parent}}",
    "prev: {{prev}}",
    "next: {{next}}",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: {{created}}",
    "updated: {{updated}}",
    "---",
    "",
    "# Overview",
    "",
    "# Acceptance Criteria",
    "",
    "# Implementation Notes",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "templates", "default", "task.md"), content);
}

function writeTaskNode(root: string): void {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: pack profile fixture",
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
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    "",
    "# Overview",
    "Primary summary line.",
    "",
    "```ts",
    "const hidden = true;",
    "```",
    "",
    "# Implementation Notes",
    "Tail details should not be in concise summary.",
  ].join("\n");
  writeFile(path.join(root, ".mdkg", "work", "task-1.md"), content);
}

function setupPackFixture(root: string): void {
  writeConfig(root);
  writeDefaultTemplates(root);
  writeTaskTemplateWithHeadings(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\nrule-1\n");
  writeTaskNode(root);
}

test("runPackCommand concise profile shapes body and writes stats/report sidecars", () => {
  const root = makeTempDir("mdkg-pack-cmd-");
  setupPackFixture(root);

  const out = ".mdkg/pack/out.md";
  runPackCommand({
    root,
    id: "task-1",
    packProfile: "concise",
    maxTokens: 80,
    stats: true,
    truncationReport: ".mdkg/pack/out.truncation.json",
    out,
  });

  const outPath = path.join(root, out);
  const output = fs.readFileSync(outPath, "utf8");
  assert.ok(output.includes("# Overview"));
  assert.ok(output.includes("Primary summary line."));
  assert.ok(!output.includes("Tail details should not be in concise summary."));
  assert.ok(!output.includes("const hidden = true;"));

  const statsPath = `${outPath}.stats.json`;
  const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
  assert.ok(stats.totals.tokens_estimate <= 80);

  const reportPath = path.join(root, ".mdkg", "pack", "out.truncation.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  assert.equal(report.profile, "concise");
  assert.ok(report.after.tokens_estimate <= 80);
});

test("runPackCommand headers profile emits empty node bodies", () => {
  const root = makeTempDir("mdkg-pack-headers-");
  setupPackFixture(root);

  const out = ".mdkg/pack/out.json";
  runPackCommand({
    root,
    id: "task-1",
    packProfile: "headers",
    format: "json",
    out,
  });

  const payload = JSON.parse(fs.readFileSync(path.join(root, out), "utf8"));
  assert.equal(payload.meta.profile, "headers");
  assert.equal(payload.meta.body_mode, "none");
  assert.equal(payload.nodes[0].body, "");
});

test("runPackCommand rejects --verbose with non-standard profile", () => {
  const root = makeTempDir("mdkg-pack-verbose-profile-");
  setupPackFixture(root);
  assert.throws(
    () =>
      runPackCommand({
        root,
        id: "task-1",
        verbose: true,
        packProfile: "concise",
      }),
    /--verbose is only supported with --pack-profile standard/
  );
});

test("runPackCommand standard profile does not require unrelated templates", () => {
  const root = makeTempDir("mdkg-pack-standard-templates-");
  setupPackFixture(root);

  runPackCommand({
    root,
    id: "task-1",
    packProfile: "standard",
    out: ".mdkg/pack/first.md",
  });

  fs.unlinkSync(path.join(root, ".mdkg", "templates", "default", "prd.md"));

  runPackCommand({
    root,
    id: "task-1",
    packProfile: "standard",
    out: ".mdkg/pack/standard.md",
    noReindex: true,
  });

  assert.ok(fs.existsSync(path.join(root, ".mdkg", "pack", "standard.md")));
});

test("runPackCommand dry-run prints summary and does not write files", () => {
  const root = makeTempDir("mdkg-pack-dry-run-");
  setupPackFixture(root);

  const originalLog = console.log;
  const originalError = console.error;
  const logs: string[] = [];
  const errors: string[] = [];
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  };
  try {
    runPackCommand({
      root,
      id: "task-1",
      packProfile: "concise",
      dryRun: true,
      out: ".mdkg/pack/dry.md",
      statsOut: ".mdkg/pack/dry.stats.json",
      truncationReport: ".mdkg/pack/dry.trunc.json",
    });
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }

  assert.ok(errors.some((line) => line.includes("ignored with --dry-run")));
  assert.ok(logs.some((line) => line.includes("dry-run: no files written")));
  assert.ok(logs.some((line) => line.includes("included_nodes:")));
  assert.ok(logs.some((line) => line.includes("TOTAL")));

  assert.equal(fs.existsSync(path.join(root, ".mdkg", "pack", "dry.md")), false);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "pack", "dry.stats.json")), false);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "pack", "dry.trunc.json")), false);
});
