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

test("runFormatCommand skips core.md list file", () => {
  const root = makeTempDir("mdkg-format-skip-core-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "not-frontmatter\n");
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: ok",
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
      "skills: []",
      "created: 2026-03-05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );

  runFormatCommand({ root, now: new Date(2026, 2, 6) });
  assert.equal(fs.readFileSync(path.join(root, ".mdkg", "core", "core.md"), "utf8"), "not-frontmatter\n");
});

test("runFormatCommand formats decision status and supersedes fields", () => {
  const root = makeTempDir("mdkg-format-dec-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  const filePath = path.join(root, ".mdkg", "design", "dec-1.md");
  writeFile(
    filePath,
    [
      "---",
      "id: DEC-1",
      "type: DEC",
      "title: simplify commands",
      "status: ACCEPTED",
      "supersedes: DEC-0",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-03-05",
      "updated: 2026-03-01",
      "---",
      "",
      "# Decision",
      "",
      "Accepted.",
    ].join("\n")
  );

  runFormatCommand({ root, now: new Date(2026, 2, 6) });
  const content = fs.readFileSync(filePath, "utf8");
  assert.match(content, /id: dec-1/);
  assert.match(content, /type: dec/);
  assert.match(content, /status: accepted/);
  assert.match(content, /supersedes: dec-0/);
  assert.match(content, /updated: 2026-03-06/);
});

test("runFormatCommand reports schema and parsing errors deterministically", () => {
  const root = makeTempDir("mdkg-format-errors-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      "id: task-1",
      "type: task",
      "title: bad task",
      "status: todo",
      "priority: nope",
      "unknown_key: value",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [BAD REF]",
      "blocked_by: []",
      "blocks: []",
      "refs: [BAD-ID]",
      "aliases: []",
      "skills: []",
      "created: 2026/03/05",
      "updated: 2026-03-05",
      "---",
      "",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "design", "broken.md"),
    [
      "---",
      "id: edd-1",
      "type: edd",
      "title: broken",
    ].join("\n")
  );

  const { errors, thrown } = captureFormat(root);
  assert.ok(thrown instanceof Error);
  assert.match(String((thrown as Error).message), /format failed with/);
  assert.ok(errors.some((line) => line.includes("unknown key: unknown_key")));
  assert.ok(errors.some((line) => line.includes("priority must be an integer")));
  assert.ok(errors.some((line) => line.includes("relates entries must be valid id references")));
  assert.ok(errors.some((line) => line.includes("refs entries must match <prefix>-<number> or reserved id")));
  assert.ok(errors.some((line) => line.includes("created must be YYYY-MM-DD")));
  assert.ok(errors.some((line) => line.includes("frontmatter closing --- not found")));
});
