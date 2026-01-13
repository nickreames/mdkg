import { test } from "node:test";
import assert from "node:assert/strict";
const { parseFrontmatter } = require("../../graph/frontmatter");

test("parseFrontmatter parses lists and body", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "tags: [a, b]",
    "active: true",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    "",
    "Body line",
  ].join("\n");

  const result = parseFrontmatter(content, "fixture.md");
  assert.equal(result.frontmatter.id, "task-1");
  assert.deepEqual(result.frontmatter.tags, ["a", "b"]);
  assert.equal(result.frontmatter.active, true);
  assert.ok(result.body.includes("Body line"));
});

test("parseFrontmatter rejects missing closing fence", () => {
  const content = ["---", "id: task-1"].join("\n");
  assert.throws(() => parseFrontmatter(content, "missing.md"), /closing --- not found/);
});

test("parseFrontmatter rejects duplicate keys", () => {
  const content = ["---", "id: task-1", "id: task-2", "---"].join("\n");
  assert.throws(() => parseFrontmatter(content, "dup.md"), /duplicate key/);
});

test("parseFrontmatter rejects invalid list", () => {
  const content = ["---", "tags: [a, , b]", "---"].join("\n");
  assert.throws(() => parseFrontmatter(content, "badlist.md"), /list items must be non-empty/);
});
