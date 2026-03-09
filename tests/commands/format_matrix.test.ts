import { test } from "node:test";
import assert from "node:assert/strict";
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
