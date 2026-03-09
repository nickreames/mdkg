import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runPackCommand } = require("../../commands/pack");
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
      "tags: [stage:execute]",
      "---",
      "",
      "# Procedure",
      "",
      "Do the thing.",
    ].join("\n")
  );
}

function setup(root: string, skills: string[] = []): void {
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeTask(root, "task-1", skills);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
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

test("runPackCommand rejects invalid workspace, depth, edges, format, and skills flags", () => {
  const root = makeTempDir("mdkg-pack-errors-");
  setup(root);

  assert.throws(
    () => runPackCommand({ root, id: "task-1", ws: "docs" }),
    /workspace not found: docs/
  );
  assert.throws(
    () => runPackCommand({ root, id: "task-1", depth: -1 }),
    /--depth must be a non-negative integer/
  );
  assert.throws(
    () => runPackCommand({ root, id: "task-1", edges: ["bad-edge"] }),
    /invalid edge name\(s\): bad_edge/
  );
  assert.throws(
    () => runPackCommand({ root, id: "task-1", format: "yaml" }),
    /invalid format: yaml/
  );
  assert.throws(
    () => runPackCommand({ root, id: "task-1", skillsDepth: "body" }),
    /--skills-depth must be meta or full/
  );
  assert.throws(
    () => runPackCommand({ root, id: "task-1", skills: "bad skill" }),
    /invalid skill slug: bad skill/
  );
});

test("runPackCommand supports skills none, warning on missing skill, and custom stats path", () => {
  const root = makeTempDir("mdkg-pack-skill-warn-");
  setup(root, ["deploy-service"]);
  writeSkill(root, "deploy-service");

  const outNone = ".mdkg/pack/no-skills.json";
  runPackCommand({
    root,
    id: "task-1",
    format: "json",
    skills: "none",
    out: outNone,
  });
  const noSkillsPayload = JSON.parse(fs.readFileSync(path.join(root, outNone), "utf8"));
  assert.equal(noSkillsPayload.nodes.some((node: { type: string }) => node.type === "skill"), false);

  const captured = capture(() =>
    runPackCommand({
      root,
      id: "task-1",
      format: "json",
      skills: "deploy-service,missing-skill",
      out: ".mdkg/pack/mixed-skills.json",
      statsOut: ".mdkg/pack/custom-stats.json",
      stats: true,
    })
  );
  assert.match(captured.stderr, /warning: requested skill missing: missing-skill/);
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "pack", "custom-stats.json")));
});

test("runPackCommand writes xml and toon outputs through the command surface", () => {
  const root = makeTempDir("mdkg-pack-export-formats-");
  setup(root);

  const xmlOut = ".mdkg/pack/out.xml";
  runPackCommand({ root, id: "task-1", format: "xml", out: xmlOut });
  assert.match(fs.readFileSync(path.join(root, xmlOut), "utf8"), /<pack>/);

  const toonOut = ".mdkg/pack/out.toon";
  runPackCommand({ root, id: "task-1", format: "toon", out: toonOut });
  assert.match(fs.readFileSync(path.join(root, toonOut), "utf8"), /"meta"/);
});
