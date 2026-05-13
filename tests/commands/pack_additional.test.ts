import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runPackCommand } = require("../../commands/pack");
const { runIndexCommand } = require("../../commands/index");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function writeTask(root: string, id = "task-1", skills: string[] = []): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}.md`),
    [
      "---",
      `id: ${id}`,
      "type: task",
      "title: Pack target",
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
      "",
      "Pack body",
      "",
      "# Notes",
      "",
      "Additional details to truncate.",
    ].join("\n")
  );
}

function writeSkill(root: string, slug: string): void {
  writeFile(
    path.join(root, ".mdkg", "skills", slug, "SKILL.md"),
    [
      "---",
      `name: ${slug}`,
      "description: skill description",
      "tags: [stage:execute, risk:high]",
      "version: 1.0.0",
      "authors: [mdkg]",
      "links: [https://example.com/skill]",
      "ochatr_approval: required",
      "ochatr_parallel: false",
      "---",
      "",
      "# Procedure",
      "",
      "1. Do the thing.",
    ].join("\n")
  );
}

function setup(root: string, skills: string[] = []): void {
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1", skills);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
}

function setPackMaxNodes(root: string, maxNodes: number): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
    pack: { limits: { max_nodes: number } };
  };
  config.pack.limits.max_nodes = maxNodes;
  writeFile(configPath, JSON.stringify(config, null, 2));
}

function writeCheckpoint(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "chk-1.md"),
    [
      "---",
      "id: chk-1",
      "type: checkpoint",
      "title: Latest checkpoint",
      "status: done",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [task-1]",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "scope: [task-1]",
      "created: 2026-03-06",
      "updated: 2026-03-06",
      "---",
      "",
      "# Summary",
      "",
      "Checkpoint body",
    ].join("\n")
  );
}

function capture(fn: () => void): { stdout: string; stderr: string } {
  const logs: string[] = [];
  const errors: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => logs.push(args.map(String).join(" "));
  console.error = (...args: unknown[]) => errors.push(args.map(String).join(" "));
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: logs.join("\n"), stderr: errors.join("\n") };
}

test("runPackCommand auto-includes skills with meta and full depth", () => {
  const root = makeTempDir("mdkg-pack-auto-skills-");
  setup(root, ["build-pack-and-execute-task", "build-pack-and-execute-task"]);
  writeSkill(root, "build-pack-and-execute-task");

  runPackCommand({
    root,
    id: "task-1",
    format: "json",
    out: ".mdkg/pack/meta.json",
  });
  const metaPayload = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "pack", "meta.json"), "utf8"));
  const metaSkill = metaPayload.nodes.find((node: { type: string }) => node.type === "skill");
  assert.ok(metaSkill);
  assert.match(metaSkill.body, /description: skill description/);
  assert.match(metaSkill.body, /authors: mdkg/);
  assert.match(metaSkill.body, /extensions\.ochatr\.approval: required/);
  assert.match(metaSkill.body, /ochatr_approval: required/);

  runPackCommand({
    root,
    id: "task-1",
    format: "json",
    skillsDepth: "full",
    out: ".mdkg/pack/full.json",
  });
  const fullPayload = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "pack", "full.json"), "utf8"));
  const fullSkills = fullPayload.nodes.filter((node: { type: string }) => node.type === "skill");
  assert.equal(fullSkills.length, 1);
  assert.match(fullSkills[0].body, /# Procedure/);
});

test("runPackCommand handles empty skills policy and missing full skill body fallback", () => {
  const root = makeTempDir("mdkg-pack-skill-policy-");
  setup(root, ["deploy-service"]);
  writeSkill(root, "deploy-service");

  runPackCommand({
    root,
    id: "task-1",
    format: "json",
    skills: " , ",
    out: ".mdkg/pack/no-explicit-skills.json",
  });
  const noSkillsPayload = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "pack", "no-explicit-skills.json"), "utf8")
  );
  assert.equal(noSkillsPayload.nodes.some((node: { type: string }) => node.type === "skill"), false);

  runIndexCommand({ root, tolerant: false });
  fs.unlinkSync(path.join(root, ".mdkg", "skills", "deploy-service", "SKILL.md"));

  const captured = capture(() =>
    runPackCommand({
      root,
      id: "task-1",
      format: "json",
      skills: "deploy-service",
      skillsDepth: "full",
      out: ".mdkg/pack/missing-full-skill.json",
      noReindex: true,
    })
  );
  assert.match(captured.stderr, /warning: skills index is stale; run mdkg index to refresh/);

  const fallbackPayload = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "pack", "missing-full-skill.json"), "utf8")
  );
  const fallbackSkill = fallbackPayload.nodes.find((node: { type: string }) => node.type === "skill");
  assert.ok(fallbackSkill);
  assert.match(fallbackSkill.body, /description: skill description/);
  assert.doesNotMatch(fallbackSkill.body, /# Procedure/);
});

test("runPackCommand dry-run warns for ignored output flags and auto-writes truncation report", () => {
  const root = makeTempDir("mdkg-pack-dryrun-warn-");
  setup(root, ["build-pack-and-execute-task"]);
  writeSkill(root, "build-pack-and-execute-task");

  const dryRun = capture(() =>
    runPackCommand({
      root,
      id: "task-1",
      dryRun: true,
      stats: true,
      out: ".mdkg/pack/ignored.md",
      statsOut: ".mdkg/pack/ignored.stats.json",
      truncationReport: ".mdkg/pack/ignored.truncation.json",
    })
  );
  assert.match(dryRun.stderr, /ignored with --dry-run/);
  assert.match(dryRun.stdout, /dry-run: no files written/);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "pack", "ignored.md")), false);

  runPackCommand({
    root,
    id: "task-1",
    format: "json",
    maxChars: 10,
    out: ".mdkg/pack/truncated.json",
  });
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "pack", "truncated.json.truncation.json")));
});

test("runPackCommand dry-run reports checkpoint and truncation details", () => {
  const root = makeTempDir("mdkg-pack-dryrun-detail-");
  setup(root, ["deploy-service"]);
  writeSkill(root, "deploy-service");
  writeCheckpoint(root);
  setPackMaxNodes(root, 1);

  const dryRun = capture(() =>
    runPackCommand({
      root,
      id: "task-1",
      dryRun: true,
      maxChars: 10,
    })
  );

  assert.match(dryRun.stdout, /latest_checkpoint_qid: root:chk-1/);
  assert.match(dryRun.stdout, /latest_checkpoint_qid_hint: root:chk-1/);
  assert.match(dryRun.stdout, /dropped: .*root:chk-1/);
  assert.match(dryRun.stdout, /body_truncated: root:task-1/);
  assert.match(dryRun.stdout, /included_nodes:\n- root:task-1/);
});

test("runPackCommand warns when cached indexes are stale and reindex is disabled", () => {
  const root = makeTempDir("mdkg-pack-stale-index-");
  setup(root, ["build-pack-and-execute-task"]);
  writeSkill(root, "build-pack-and-execute-task");

  runIndexCommand({ root, tolerant: false });
  runPackCommand({ root, id: "task-1", format: "json", out: ".mdkg/pack/initial.json" });

  const taskPath = path.join(root, ".mdkg", "work", "task-1.md");
  const skillPath = path.join(root, ".mdkg", "skills", "build-pack-and-execute-task", "SKILL.md");
  const future = new Date(Date.now() + 5000);
  fs.utimesSync(taskPath, future, future);
  fs.utimesSync(skillPath, future, future);

  const captured = capture(() =>
    runPackCommand({
      root,
      id: "task-1",
      format: "json",
      out: ".mdkg/pack/stale.json",
      noReindex: true,
    })
  );
  assert.match(captured.stderr, /warning: index is stale; run mdkg index to refresh/);
  assert.match(captured.stderr, /warning: skills index is stale; run mdkg index to refresh/);
});
