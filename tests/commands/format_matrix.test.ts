import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runFormatCommand } = require("../../commands/format");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

function captureFormat(root: string): { errors: string[]; thrown: unknown } {
  const errors: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  };
  let thrown: unknown;
  try {
    runFormatCommand({ root, now: new Date(2026, 2, 6) });
  } catch (err) {
    thrown = err;
  } finally {
    console.error = originalError;
  }
  return { errors, thrown };
}

function addTaskBooleanTemplateKey(root: string): void {
  const templatePath = path.join(root, ".mdkg", "templates", "default", "task.md");
  const template = fs.readFileSync(templatePath, "utf8");
  writeFile(templatePath, template.replace(/\n---$/, "\npinned: true\n---"));
}

function addPropPolicyTemplateKeys(root: string): void {
  const templatePath = path.join(root, ".mdkg", "templates", "default", "prop.md");
  const template = fs.readFileSync(templatePath, "utf8");
  writeFile(
    templatePath,
    template.replace(/\n---$/, "\nstatus: todo\npriority: 1\nsupersedes: dec-1\n---")
  );
}

test("runFormatCommand reports scalar, list, and type-policy errors across node kinds", () => {
  const root = makeTempDir("mdkg-format-matrix-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  writeFile(
    path.join(root, ".mdkg", "core", "rule-1.md"),
    [
      "---",
      "id: rule-1",
      "type: rule",
      "title: Broken rule",
      "status: todo",
      "priority: 1",
      "tags: tag-a",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: bad-date",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: Broken task",
      "status: todo",
      "priority: 11",
      "epic: BAD REF",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [task-2]",
      "blocked_by: false",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  const { errors, thrown } = captureFormat(root);
  assert.ok(thrown instanceof Error);
  assert.ok(errors.some((line) => line.includes("unknown key: status")));
  assert.ok(errors.some((line) => line.includes("unknown key: priority")));
  assert.ok(errors.some((line) => line.includes("tags must be a list")));
  assert.ok(errors.some((line) => line.includes("created must be YYYY-MM-DD")));
  assert.ok(errors.some((line) => line.includes("epic must be a valid id reference")));
  assert.ok(errors.some((line) => line.includes("blocked_by must be a list")));
  assert.ok(errors.some((line) => line.includes("priority must be between 0 and 9")));
});

test("runFormatCommand reports boolean and scalar mismatch branches", () => {
  const root = makeTempDir("mdkg-format-boolean-matrix-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  addTaskBooleanTemplateKey(root);

  const taskPath = path.join(root, ".mdkg", "work", "task-1.md");
  const taskContent = [
    "---",
    "id: task-1",
    "type: task",
    "title: false",
    "status: false",
    "priority: false",
    "pinned: nope",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: [2026-03-05]",
    "updated: false",
    "---",
    "",
  ].join("\n");
  writeFile(taskPath, taskContent);

  writeFile(
    path.join(root, ".mdkg", "design", "dec-1.md"),
    [
      "---",
      "id: dec-1",
      "type: dec",
      "title: Decision",
      "status: false",
      "supersedes: [dec-0]",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  const { errors, thrown } = captureFormat(root);
  assert.ok(thrown instanceof Error);
  assert.ok(errors.some((line) => line.includes("title must be a string")));
  assert.ok(errors.some((line) => line.includes("status must be a string")));
  assert.ok(errors.some((line) => line.includes("priority must be a string")));
  assert.ok(errors.some((line) => line.includes("priority must be an integer")));
  assert.ok(errors.some((line) => line.includes("pinned must be a boolean")));
  assert.ok(errors.some((line) => line.includes("created must be a string")));
  assert.ok(errors.some((line) => line.includes("updated must be a string")));
  assert.ok(errors.some((line) => line.includes("status is required for work items")));
  assert.ok(errors.some((line) => line.includes("status is required for decision records")));
  assert.ok(errors.some((line) => line.includes("supersedes must be a string")));
  assert.equal(fs.readFileSync(taskPath, "utf8"), taskContent);
});

test("runFormatCommand normalizes no-body files with trailing newlines", () => {
  const root = makeTempDir("mdkg-format-no-body-matrix-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  const taskPath = path.join(root, ".mdkg", "work", "task-1.md");
  writeFile(
    taskPath,
    [
      "---",
      "id: Task-1",
      "type: Task",
      "title: Sort preserved case links",
      "status: TODO",
      "priority: 2",
      "tags: []",
      "owners: []",
      "links: [b, A, a, B, A]",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-01",
      "---",
      "",
    ].join("\n")
  );

  runFormatCommand({ root, now: new Date(2026, 2, 6) });
  const content = fs.readFileSync(taskPath, "utf8");
  assert.match(content, /id: task-1/);
  assert.match(content, /type: task/);
  assert.match(content, /status: todo/);
  assert.match(content, /links: \[A, A, a, B, b\]/);
  assert.match(content, /updated: 2026-03-06/);
  assert.ok(content.endsWith("\n"));
});

test("runFormatCommand reports id, date, and non-work policy branches", () => {
  const root = makeTempDir("mdkg-format-id-date-matrix-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  addPropPolicyTemplateKeys(root);

  const invalidTaskPath = path.join(root, ".mdkg", "work", "task-x.md");
  const invalidTaskContent = [
    "---",
    "id: task-x",
    "type: task",
    "title: Bad id and date",
    "status: waiting",
    "priority: 3",
    "epic: root:task-x",
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "skills: []",
    "created: 2026-3-05",
    "updated: 20260305",
    "---",
    "",
  ].join("\n");
  writeFile(invalidTaskPath, invalidTaskContent);

  writeFile(
    path.join(root, ".mdkg", "work", "task-2.md"),
    [
      "---",
      "id: false",
      "type: task",
      "title: Boolean id",
      "status: todo",
      "priority: 3",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  writeFile(
    path.join(root, ".mdkg", "work", "chk-1.md"),
    [
      "---",
      "id: chk-1",
      "type: checkpoint",
      "title: Bad scope",
      "status: todo",
      "priority: 3",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "scope: [task-x]",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  writeFile(
    path.join(root, ".mdkg", "design", "prop-1.md"),
    [
      "---",
      "id: prop-1",
      "type: prop",
      "title: Non-work policy",
      "status: todo",
      "priority: 1",
      "supersedes: dec-1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  const { errors, thrown } = captureFormat(root);
  assert.ok(thrown instanceof Error);
  assert.ok(errors.some((line) => line.includes("id must match <prefix>-<number> or reserved id")));
  assert.ok(errors.some((line) => line.includes("id must be a string")));
  assert.ok(errors.some((line) => line.includes("id is required")));
  assert.ok(errors.some((line) => line.includes("created must be YYYY-MM-DD")));
  assert.ok(errors.some((line) => line.includes("updated must be YYYY-MM-DD")));
  assert.ok(errors.some((line) => line.includes("status must be one of")));
  assert.ok(errors.some((line) => line.includes("epic must be a valid id reference")));
  assert.ok(errors.some((line) => line.includes("scope entries must match <prefix>-<number> or reserved id")));
  assert.ok(errors.some((line) => line.includes("priority is only allowed for work items")));
  assert.ok(errors.some((line) => line.includes("supersedes is only allowed for decision records")));
  assert.ok(errors.some((line) => line.includes("status is not allowed for this type")));
  assert.equal(fs.readFileSync(invalidTaskPath, "utf8"), invalidTaskContent);
});

test("runFormatCommand reports missing type and invalid type in repo files", () => {
  const root = makeTempDir("mdkg-format-type-errors-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  writeFile(
    path.join(root, ".mdkg", "work", "missing-type.md"),
    [
      "---",
      "id: task-1",
      "title: Missing type",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "design", "bad-type.md"),
    [
      "---",
      "id: edd-1",
      "type: nope",
      "title: Bad type",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  const { errors, thrown } = captureFormat(root);
  assert.ok(thrown instanceof Error);
  assert.ok(errors.some((line) => line.includes("type is required")));
  assert.ok(errors.some((line) => line.includes("type must be one of")));
});

test("runFormatCommand fails early when template schemas cannot be loaded", () => {
  const root = makeTempDir("mdkg-format-bad-template-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "templates", "default", "prop.md"), "");

  const { errors, thrown } = captureFormat(root);
  assert.ok(thrown instanceof Error);
  assert.equal(errors.length, 0);
  assert.match(String((thrown as Error).message), /frontmatter must start with ---|template missing type|template schema missing for type/);
});
