import { test } from "node:test";
import assert from "node:assert/strict";
const { parseNode } = require("../../graph/node");

function makeSchema(type: string, keys: string[], listKeys: string[]): any {
  const keyKinds: Record<string, string> = {};
  const listSet = new Set(listKeys);
  for (const key of keys) {
    keyKinds[key] = listSet.has(key) ? "list" : "scalar";
  }
  return {
    type,
    allowedKeys: new Set(keys),
    keyKinds,
    listKeys: listSet,
  };
}

const TEMPLATE_SCHEMAS = {
  task: makeSchema(
    "task",
    [
      "id",
      "type",
      "title",
      "status",
      "priority",
      "epic",
      "parent",
      "prev",
      "next",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "blocked_by",
      "blocks",
      "refs",
      "aliases",
      "created",
      "updated",
    ],
    ["tags", "owners", "links", "artifacts", "relates", "blocked_by", "blocks", "refs", "aliases"]
  ),
  dec: makeSchema(
    "dec",
    [
      "id",
      "type",
      "title",
      "status",
      "supersedes",
      "tags",
      "owners",
      "links",
      "artifacts",
      "relates",
      "refs",
      "aliases",
      "created",
      "updated",
    ],
    ["tags", "owners", "links", "artifacts", "relates", "refs", "aliases"]
  ),
};

const PARSE_OPTIONS = {
  workStatusEnum: ["backlog", "blocked", "todo", "progress", "review", "done"],
  priorityMin: 0,
  priorityMax: 9,
  templateSchemas: TEMPLATE_SCHEMAS,
};

function taskFrontmatterWithPriority(priorityLine: string): string {
  const frontmatter = [
    "---",
    "id: task-1",
    "type: task",
    "title: do the thing",
    "status: todo",
    priorityLine,
    "tags: [a]",
    "links: []",
    "artifacts: []",
    "relates: [task-2]",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
  ];
  return frontmatter.concat(["---", "", "Body"]).join("\n");
}

test("parseNode parses a valid task", () => {
  const node = parseNode(taskFrontmatterWithPriority("priority: 2"), "task.md", PARSE_OPTIONS);
  assert.equal(node.id, "task-1");
  assert.equal(node.status, "todo");
  assert.equal(node.priority, 2);
  assert.deepEqual(node.edges.relates, ["task-2"]);
});

test("parseNode requires status for work items", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: missing status",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  assert.throws(() => parseNode(content, "missing-status.md", PARSE_OPTIONS), /status is required/);
});

test("parseNode enforces priority bounds", () => {
  const content = taskFrontmatterWithPriority("priority: 12");
  assert.throws(
    () => parseNode(content, "priority.md", PARSE_OPTIONS),
    /priority must be between 0 and 9/
  );
});

test("parseNode accepts decision status enum", () => {
  const content = [
    "---",
    "id: dec-1",
    "type: dec",
    "title: decide",
    "status: accepted",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "dec.md", PARSE_OPTIONS);
  assert.equal(node.status, "accepted");
});

test("parseNode rejects unknown keys", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: has unknown key",
    "status: todo",
    "priority: 1",
    "mystery: value",
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
  ].join("\n");
  assert.throws(() => parseNode(content, "unknown.md", PARSE_OPTIONS), /unknown key/);
});

test("parseNode enforces lowercase list entries", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: uppercase tag",
    "status: todo",
    "priority: 1",
    "tags: [Upper]",
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
  ].join("\n");
  assert.throws(() => parseNode(content, "uppercase.md", PARSE_OPTIONS), /must be lowercase/);
});

test("parseNode preserves link and artifact casing", () => {
  const content = [
    "---",
    "id: task-1",
    "type: task",
    "title: preserve case",
    "status: todo",
    "priority: 1",
    "tags: []",
    "owners: []",
    "links: [HTTP://EXAMPLE.COM]",
    "artifacts: [Build-1]",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
  ].join("\n");
  const node = parseNode(content, "links.md", PARSE_OPTIONS);
  assert.deepEqual(node.links, ["HTTP://EXAMPLE.COM"]);
  assert.deepEqual(node.artifacts, ["Build-1"]);
});

test("parseNode uses config status enum", () => {
  const content = taskFrontmatterWithPriority("priority: 2");
  const options = {
    ...PARSE_OPTIONS,
    workStatusEnum: ["backlog"],
  };
  assert.throws(() => parseNode(content, "status.md", options), /status must be one of/);
});
