import { test } from "node:test";
import assert from "node:assert/strict";
const { parseFrontmatter, frontmatterSourceBounds } = require("../../graph/frontmatter");

test("frontmatter source spans share parser grammar without normalizing body bytes", () => {
  for (const eol of ["\n", "\r\n"]) {
    const prefix = [" ---\t", "title: a---b", " \t--- ", ""].join(eol);
    const body = `first${eol}---${eol}last${eol}`;
    const content = prefix + body;
    const bounds = frontmatterSourceBounds(content, "spans.md");
    assert.equal(content.slice(0, bounds.bodyStart), prefix);
    assert.equal(content.slice(bounds.bodyStart), body);
    assert.equal(bounds.eol, eol);
    assert.equal(content.slice(bounds.headerEnd, bounds.bodyStart), eol);
    assert.deepEqual(parseFrontmatter(content, "spans.md"), { frontmatter: { title: "a---b" }, body: body.replace(/\r\n/g, "\n") });
    const empty = frontmatterSourceBounds(["---", "id: task-1", "---"].join(eol), "empty.md");
    assert.equal(empty.bodyStart, empty.headerEnd);
  }
  assert.throws(() => frontmatterSourceBounds("---\nid: task-1\n", "missing.md"), /closing/);
});

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

test("parseFrontmatter rejects over-budget lines and lists", () => {
  assert.throws(
    () => parseFrontmatter(`---\ntitle: ${"a".repeat(64 * 1024)}\n---\n`, "large-line.md"),
    /frontmatter line exceeds/
  );
  const items = Array.from({ length: 10_001 }, () => "a").join(",");
  assert.throws(
    () => parseFrontmatter(`---\nrefs: [${items}]\n---\n`, "large-list.md"),
    /list exceeds 10000 items/
  );
});
