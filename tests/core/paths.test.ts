import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { configPath, resolveRoot } = require("../../core/paths");

test("path helper resolves explicit and current roots", () => {
  assert.equal(resolveRoot("relative-root"), path.resolve("relative-root"));
  assert.equal(resolveRoot(), process.cwd());
});

test("path helper builds config path", () => {
  const root = path.resolve("repo-root");
  assert.equal(configPath(root), path.join(root, ".mdkg", "config.json"));
});
