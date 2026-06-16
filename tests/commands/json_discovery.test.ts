import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { runIndexCommand } = require("../../commands/index");
const { runListCommand } = require("../../commands/list");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
const { runSkillListCommand, runSkillSearchCommand, runSkillShowCommand } = require("../../commands/skill");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function writeTask(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Json fixture",
      "status: todo",
      "priority: 1",
      "tags: [cli, stage:plan]",
      "owners: [team]",
      "links: [https://example.com/task]",
      "artifacts: [artifact://task-1]",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: [ref-1]",
      "aliases: [fixture-task]",
      "skills: [plan-run]",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Overview",
      "",
      "JSON body",
    ].join("\n")
  );
}

function writeSpike(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "spike-1.md"),
    [
      "---",
      "id: spike-1",
      "type: spike",
      "title: Spike export fixture",
      "status: todo",
      "priority: 1",
      "tags: [research, docs]",
      "owners: [team]",
      "links: [https://example.com/spike]",
      "artifacts: [artifact://spike-1]",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: [ref-spike]",
      "aliases: [fixture-spike]",
      "skills: [plan-run]",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Research Question",
      "",
      "How should spike records appear in structured exports?",
      "",
      "# Findings",
      "",
      "Spike records must behave like actionable work nodes.",
    ].join("\n")
  );
}

function writeArchivedGoal(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Archived roadmap fixture",
      "status: archived",
      "priority: 1",
      "goal_state: archived",
      "goal_condition: superseded by a versioned goal",
      "scope_refs: []",
      "required_skills: []",
      "required_checks: []",
      "max_iterations: 25",
      "blocked_after_attempts: 3",
      "tags: [roadmap]",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: [archived-fixture]",
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
      "# Supersession",
      "",
      "This goal is historical context only.",
    ].join("\n")
  );
}

function writeSkills(root: string): void {
  writeFile(
    path.join(root, ".mdkg", "skills", "plan-run", "SKILL.md"),
    [
      "---",
      'name: "plan-run"',
      'description: "plan the work when a plan-stage skill is needed"',
      "tags: [stage:plan, writer:read-only]",
      "authors: [team]",
      "links: [https://example.com/skill]",
      "ochatr_policy: advisory",
      "---",
      "",
      "# Goal",
      "",
      "Plan the work.",
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
    ].join("\n")
  );
}

function setupRepo(): string {
  const root = makeTempDir("mdkg-json-discovery-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeTask(root);
  writeSkills(root);
  runIndexCommand({ root });
  return root;
}

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = ((...args: unknown[]) => stdout.push(args.map(String).join(" "))) as typeof console.log;
  console.error = ((...args: unknown[]) => stderr.push(args.map(String).join(" "))) as typeof console.error;
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

test("node list search and show support json envelopes", () => {
  const root = setupRepo();

  const list = captureOutput(() => runListCommand({ root, json: true }));
  assert.equal(list.stderr, "");
  const listPayload = JSON.parse(list.stdout);
  assert.equal(listPayload.command, "list");
  assert.equal(listPayload.kind, "node");
  assert.equal(listPayload.count, 1);
  assert.equal(listPayload.items[0].qid, "root:task-1");
  assert.equal(listPayload.items[0].title, "Json fixture");
  assert.equal(listPayload.items[0].body, undefined);

  const search = captureOutput(() => runSearchCommand({ root, query: "Json fixture", json: true }));
  assert.equal(search.stderr, "");
  const searchPayload = JSON.parse(search.stdout);
  assert.equal(searchPayload.command, "search");
  assert.equal(searchPayload.kind, "node");
  assert.equal(searchPayload.count, 1);
  assert.equal(searchPayload.items[0].qid, "root:task-1");

  const show = captureOutput(() => runShowCommand({ root, id: "task-1", json: true }));
  assert.equal(show.stderr, "");
  const showPayload = JSON.parse(show.stdout);
  assert.equal(showPayload.command, "show");
  assert.equal(showPayload.kind, "node");
  assert.equal(showPayload.item.qid, "root:task-1");
  assert.match(showPayload.item.body, /JSON body/);

  const showMeta = captureOutput(() => runShowCommand({ root, id: "task-1", metaOnly: true, json: true }));
  const showMetaPayload = JSON.parse(showMeta.stdout);
  assert.equal(showMetaPayload.item.body, undefined);
});

test("skill list search and show support json envelopes", () => {
  const root = setupRepo();

  const list = captureOutput(() => runSkillListCommand({ root, tags: ["stage:plan"], tagsMode: "all", json: true }));
  assert.equal(list.stderr, "");
  const listPayload = JSON.parse(list.stdout);
  assert.equal(listPayload.command, "list");
  assert.equal(listPayload.kind, "skill");
  assert.equal(listPayload.count, 1);
  assert.equal(listPayload.items[0].qid, "root:skill:plan-run");
  assert.equal(listPayload.items[0].has_scripts, false);
  assert.deepEqual(listPayload.items[0].extensions.ochatr, { policy: "advisory" });
  assert.deepEqual(listPayload.items[0].ochatr, { ochatr_policy: "advisory" });

  const search = captureOutput(() => runSkillSearchCommand({ root, query: "plan-stage", tags: ["stage:plan"], tagsMode: "all", json: true }));
  assert.equal(search.stderr, "");
  const searchPayload = JSON.parse(search.stdout);
  assert.equal(searchPayload.command, "search");
  assert.equal(searchPayload.kind, "skill");
  assert.equal(searchPayload.count, 1);
  assert.equal(searchPayload.items[0].qid, "root:skill:plan-run");

  const show = captureOutput(() => runSkillShowCommand({ root, slug: "plan-run", json: true }));
  assert.equal(show.stderr, "");
  const showPayload = JSON.parse(show.stdout);
  assert.equal(showPayload.command, "show");
  assert.equal(showPayload.kind, "skill");
  assert.equal(showPayload.item.qid, "root:skill:plan-run");
  assert.match(showPayload.item.body, /# Goal/);

  const showMeta = captureOutput(() => runSkillShowCommand({ root, slug: "plan-run", metaOnly: true, json: true }));
  const showMetaPayload = JSON.parse(showMeta.stdout);
  assert.equal(showMetaPayload.item.body, undefined);
});

test("json discovery returns zero counts and text discovery prints explicit counts", () => {
  const root = setupRepo();

  const nodeSearch = captureOutput(() => runSearchCommand({ root, query: "missing", json: true }));
  const nodeSearchPayload = JSON.parse(nodeSearch.stdout);
  assert.equal(nodeSearchPayload.count, 0);
  assert.deepEqual(nodeSearchPayload.items, []);
  assert.equal(nodeSearch.stderr, "");

  const skillSearch = captureOutput(() => runSkillSearchCommand({ root, query: "missing", json: true }));
  const skillSearchPayload = JSON.parse(skillSearch.stdout);
  assert.equal(skillSearchPayload.count, 0);
  assert.deepEqual(skillSearchPayload.items, []);
  assert.equal(skillSearch.stderr, "");

  const textNodeSearch = captureOutput(() => runSearchCommand({ root, query: "missing" }));
  assert.equal(textNodeSearch.stdout, "");
  assert.match(textNodeSearch.stderr, /count: 0/);
  assert.match(textNodeSearch.stderr, /note: no nodes matched query "missing"/);

  const textSkillSearch = captureOutput(() => runSkillSearchCommand({ root, query: "missing" }));
  assert.equal(textSkillSearch.stdout, "");
  assert.match(textSkillSearch.stderr, /count: 0/);
  assert.match(textSkillSearch.stderr, /note: no skills matched query "missing"/);
});

test("node discovery and show support xml, toon, and markdown envelopes", () => {
  const root = setupRepo();

  const listXml = captureOutput(() => runListCommand({ root, format: "xml" }));
  assert.equal(listXml.stderr, "");
  assert.match(listXml.stdout, /<response>/);
  assert.match(listXml.stdout, /<command>list<\/command>/);
  assert.match(listXml.stdout, /<kind>node<\/kind>/);
  assert.match(listXml.stdout, /<count>1<\/count>/);

  const searchToon = captureOutput(() =>
    runSearchCommand({ root, query: "Json fixture", format: "toon" })
  );
  const searchToonPayload = JSON.parse(searchToon.stdout);
  assert.equal(searchToonPayload.command, "search");
  assert.equal(searchToonPayload.kind, "node");
  assert.equal(searchToonPayload.items[0].qid, "root:task-1");

  const showMd = captureOutput(() => runShowCommand({ root, id: "task-1", format: "md" }));
  assert.equal(showMd.stderr, "");
  assert.match(showMd.stdout, /# mdkg response/);
  assert.match(showMd.stdout, /- command: show/);
  assert.match(showMd.stdout, /- kind: node/);
  assert.match(showMd.stdout, /- body:/);
  assert.match(showMd.stdout, /JSON body/);
});

test("spike discovery and show support typed structured envelopes", () => {
  const root = setupRepo();
  writeSpike(root);
  runIndexCommand({ root });

  const listXml = captureOutput(() => runListCommand({ root, type: "spike", format: "xml" }));
  assert.equal(listXml.stderr, "");
  assert.match(listXml.stdout, /<command>list<\/command>/);
  assert.match(listXml.stdout, /<count>1<\/count>/);
  assert.match(listXml.stdout, /<id>spike-1<\/id>/);
  assert.match(listXml.stdout, /<type>spike<\/type>/);

  const searchToon = captureOutput(() =>
    runSearchCommand({ root, query: "Spike export fixture", type: "spike", format: "toon" })
  );
  assert.equal(searchToon.stderr, "");
  const searchToonPayload = JSON.parse(searchToon.stdout);
  assert.equal(searchToonPayload.command, "search");
  assert.equal(searchToonPayload.kind, "node");
  assert.equal(searchToonPayload.count, 1);
  assert.equal(searchToonPayload.items[0].qid, "root:spike-1");
  assert.equal(searchToonPayload.items[0].type, "spike");

  const showMd = captureOutput(() => runShowCommand({ root, id: "spike-1", format: "md" }));
  assert.equal(showMd.stderr, "");
  assert.match(showMd.stdout, /# mdkg response/);
  assert.match(showMd.stdout, /- command: show/);
  assert.match(showMd.stdout, /- kind: node/);
  assert.match(showMd.stdout, /- type: spike/);
  assert.match(showMd.stdout, /# Research Question/);

  const showJson = captureOutput(() => runShowCommand({ root, id: "spike-1", json: true }));
  assert.equal(showJson.stderr, "");
  const showJsonPayload = JSON.parse(showJson.stdout);
  assert.equal(showJsonPayload.item.qid, "root:spike-1");
  assert.equal(showJsonPayload.item.type, "spike");
  assert.match(showJsonPayload.item.body, /Spike records must behave like actionable work nodes/);
});

test("archived goals remain discoverable with explicit status filters", () => {
  const root = setupRepo();
  writeArchivedGoal(root);
  runIndexCommand({ root });

  const list = captureOutput(() => runListCommand({ root, type: "goal", status: "archived", json: true }));
  assert.equal(list.stderr, "");
  const listPayload = JSON.parse(list.stdout);
  assert.equal(listPayload.command, "list");
  assert.equal(listPayload.count, 1);
  assert.equal(listPayload.items[0].qid, "root:goal-1");
  assert.equal(listPayload.items[0].status, "archived");

  const search = captureOutput(() =>
    runSearchCommand({ root, query: "Archived roadmap", type: "goal", status: "archived", json: true })
  );
  assert.equal(search.stderr, "");
  const searchPayload = JSON.parse(search.stdout);
  assert.equal(searchPayload.command, "search");
  assert.equal(searchPayload.count, 1);
  assert.equal(searchPayload.items[0].qid, "root:goal-1");
  assert.equal(searchPayload.items[0].status, "archived");

  const show = captureOutput(() => runShowCommand({ root, id: "goal-1", json: true }));
  assert.equal(show.stderr, "");
  const showPayload = JSON.parse(show.stdout);
  assert.equal(showPayload.item.qid, "root:goal-1");
  assert.equal(showPayload.item.status, "archived");
  assert.match(showPayload.item.body, /historical context only/);
});

test("skill discovery and show support xml, toon, and markdown envelopes", () => {
  const root = setupRepo();

  const listXml = captureOutput(() =>
    runSkillListCommand({ root, tags: ["stage:plan"], tagsMode: "all", format: "xml" })
  );
  assert.equal(listXml.stderr, "");
  assert.match(listXml.stdout, /<response>/);
  assert.match(listXml.stdout, /<kind>skill<\/kind>/);
  assert.match(listXml.stdout, /<count>1<\/count>/);

  const searchToon = captureOutput(() =>
    runSkillSearchCommand({ root, query: "plan-stage", tags: ["stage:plan"], tagsMode: "all", format: "toon" })
  );
  const searchToonPayload = JSON.parse(searchToon.stdout);
  assert.equal(searchToonPayload.command, "search");
  assert.equal(searchToonPayload.kind, "skill");
  assert.equal(searchToonPayload.items[0].qid, "root:skill:plan-run");

  const showMd = captureOutput(() =>
    runSkillShowCommand({ root, slug: "plan-run", metaOnly: true, format: "md" })
  );
  assert.equal(showMd.stderr, "");
  assert.match(showMd.stdout, /# mdkg response/);
  assert.match(showMd.stdout, /- command: show/);
  assert.match(showMd.stdout, /- kind: skill/);
  assert.doesNotMatch(showMd.stdout, /- body:/);
});
