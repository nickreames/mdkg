import { test } from "node:test";
import assert from "node:assert/strict";
const { runNewCommand } = require("../../commands/new");
import { makeTempDir } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeRootConfig } from "../helpers/config";

test("runNewCommand rejects status on non-work non-decision types", () => {
  const root = makeTempDir("mdkg-new-error-status-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "prd",
        title: "Spec",
        status: "todo",
      }),
    /--status is only valid for work items and decisions/
  );
});

test("runNewCommand rejects invalid skill slugs", () => {
  const root = makeTempDir("mdkg-new-error-skills-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "Bad skills",
        status: "todo",
        skills: "not_valid",
      }),
    /--skills entries must be kebab-case/
  );
});

test("runNewCommand rejects cases on non-test nodes", () => {
  const root = makeTempDir("mdkg-new-error-cases-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "Wrong cases",
        status: "todo",
        cases: "tc-1",
      }),
    /--cases is only valid for test nodes/
  );
});

test("runNewCommand rejects work-only graph links on non-work types", () => {
  const root = makeTempDir("mdkg-new-error-links-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "rule",
        title: "Wrong epic",
        epic: "epic-1",
      }),
    /only valid for work items/
  );
});

test("runNewCommand rejects unknown workspaces", () => {
  const root = makeTempDir("mdkg-new-error-ws-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        ws: "missing",
        type: "task",
        title: "Wrong workspace",
        status: "todo",
      }),
    /workspace not found: missing/
  );
});

test("runNewCommand rejects empty title, invalid type, bad status, priority, and supersedes usage", () => {
  const root = makeTempDir("mdkg-new-error-matrix-");
  writeRootConfig(root);
  writeDefaultTemplates(root);

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "   ",
        status: "todo",
      }),
    /title cannot be empty/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "note",
        title: "Bad type",
      }),
    /type must be one of/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "Bad status",
        status: "later",
      }),
    /--status must be one of/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "Bad priority",
        status: "todo",
        priority: 99,
      }),
    /--priority must be between/
  );

  assert.throws(
    () =>
      runNewCommand({
        root,
        type: "task",
        title: "Bad supersedes",
        status: "todo",
        supersedes: "dec-1",
      }),
    /--supersedes is only valid for dec records/
  );
});
