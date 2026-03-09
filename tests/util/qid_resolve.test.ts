import { test } from "node:test";
import assert from "node:assert/strict";
const { resolveQid, formatResolveError } = require("../../util/qid");

function makeIndex() {
  return {
    meta: { tool: "mdkg", schema_version: 1, generated_at: "", root: "", workspaces: ["root", "docs"] },
    workspaces: {},
    nodes: {
      "root:task-1": {
        id: "task-1",
        qid: "root:task-1",
        ws: "root",
      },
      "docs:task-1": {
        id: "task-1",
        qid: "docs:task-1",
        ws: "docs",
      },
      "root:task-2": {
        id: "task-2",
        qid: "root:task-2",
        ws: "root",
      },
    },
    reverse_edges: {},
  };
}

test("resolveQid resolves explicit qids", () => {
  const result = resolveQid(makeIndex(), "root:task-2");
  assert.deepEqual(result, { status: "ok", qid: "root:task-2" });
});

test("resolveQid resolves unqualified ids when unique", () => {
  const result = resolveQid(makeIndex(), "task-2");
  assert.deepEqual(result, { status: "ok", qid: "root:task-2" });
});

test("resolveQid returns ambiguous for duplicate ids without workspace hint", () => {
  const result = resolveQid(makeIndex(), "task-1");
  assert.equal(result.status, "ambiguous");
  assert.deepEqual(result.candidates, ["docs:task-1", "root:task-1"]);
});

test("resolveQid honors workspace hints and returns missing candidates", () => {
  const result = resolveQid(makeIndex(), "task-1", "qa");
  assert.deepEqual(result, {
    status: "missing",
    candidates: ["docs:task-1", "root:task-1"],
  });
});

test("formatResolveError formats resolved outputs too", () => {
  const message = formatResolveError("id", "task-2", { status: "ok", qid: "root:task-2" });
  assert.equal(message, "id resolved: root:task-2");
});
