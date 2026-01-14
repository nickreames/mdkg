import { test } from "node:test";
import assert from "node:assert/strict";
const {
  PACK_WARN_BYTES,
  shouldWarnLargeOutput,
  formatLargeOutputWarning,
  buildDefaultPackPath,
  formatTimestampForFilename,
  sanitizeFilename,
} = require("../../util/output");

test("shouldWarnLargeOutput respects TTY and threshold", () => {
  assert.equal(shouldWarnLargeOutput(PACK_WARN_BYTES - 1, true), false);
  assert.equal(shouldWarnLargeOutput(PACK_WARN_BYTES, true), true);
  assert.equal(shouldWarnLargeOutput(PACK_WARN_BYTES + 1, false), false);
});

test("formatLargeOutputWarning mentions --out", () => {
  const message = formatLargeOutputWarning(123456);
  assert.ok(message.includes("--out"));
  assert.ok(message.includes("123456"));
});

test("formatTimestampForFilename includes milliseconds", () => {
  const date = new Date(Date.UTC(2026, 0, 13, 12, 34, 56, 789));
  assert.equal(formatTimestampForFilename(date, true), "20260113-123456789");
});

test("buildDefaultPackPath includes kind, id, and format", () => {
  const date = new Date(Date.UTC(2026, 0, 13, 12, 34, 56, 7));
  const path = buildDefaultPackPath("/repo/root", "task-1", "md", true, date);
  assert.ok(path.includes("/.mdkg/pack/pack_verbose_task-1_"));
  assert.ok(path.endsWith(".md"));
});

test("sanitizeFilename replaces unsafe characters", () => {
  assert.equal(sanitizeFilename("task/1"), "task-1");
});
