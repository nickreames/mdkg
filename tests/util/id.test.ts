import { test } from "node:test";
import assert from "node:assert/strict";
const {
  isCanonicalId,
  isPortableId,
  isCanonicalIdRef,
  isPortableIdRef,
} = require("../../util/id");

test("id helper validates canonical and portable ids", () => {
  assert.equal(isCanonicalId("task-1"), true);
  assert.equal(isCanonicalId("rule-guide"), true);
  assert.equal(isCanonicalId("Task-1"), false);
  assert.equal(isCanonicalId("note.alpha"), false);

  assert.equal(isPortableId("task-1"), true);
  assert.equal(isPortableId("note.alpha"), true);
  assert.equal(isPortableId("agent_room.v1"), true);
  assert.equal(isPortableId("Bad"), false);
});

test("id helper validates canonical and portable refs", () => {
  assert.equal(isCanonicalIdRef("TASK-1"), true);
  assert.equal(isCanonicalIdRef("docs:TASK-1"), true);
  assert.equal(isCanonicalIdRef("bad-ws:task-1"), false);
  assert.equal(isCanonicalIdRef("root:note.alpha"), false);
  assert.equal(isCanonicalIdRef("root:task-1:extra"), false);

  assert.equal(isPortableIdRef("note.alpha"), true);
  assert.equal(isPortableIdRef("docs:note.alpha"), true);
  assert.equal(isPortableIdRef("bad-ws:note.alpha"), false);
  assert.equal(isPortableIdRef("root:Bad"), true);
  assert.equal(isPortableIdRef("root:note.alpha:extra"), false);
});
