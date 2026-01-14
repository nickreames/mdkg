import { test } from "node:test";
import assert from "node:assert/strict";
const { PACK_WARN_BYTES, shouldWarnLargeOutput, formatLargeOutputWarning } = require("../../util/output");

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
