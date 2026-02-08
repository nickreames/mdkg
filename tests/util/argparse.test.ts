import { test } from "node:test";
import assert from "node:assert/strict";
const { parseArgs } = require("../../util/argparse");

test("parseArgs supports short flags for pack", () => {
  const parsed = parseArgs(["pack", "task-1", "-v", "-f", "md", "-o", "/tmp/x.md", "-d", "2", "-e", "parent"]);
  assert.equal(parsed.positionals[0], "pack");
  assert.equal(parsed.positionals[1], "task-1");
  assert.equal(parsed.flags["--verbose"], true);
  assert.equal(parsed.flags["--format"], "md");
  assert.equal(parsed.flags["--out"], "/tmp/x.md");
  assert.equal(parsed.flags["--depth"], "2");
  assert.equal(parsed.flags["--edges"], "parent");
});

test("parseArgs supports short workspace and root flags", () => {
  const parsed = parseArgs(["list", "-w", "ROOT", "-r", "/repo/root"]);
  assert.equal(parsed.flags["--ws"], "root");
  assert.equal(parsed.root, "/repo/root");
});

test("parseArgs handles --version", () => {
  const parsed = parseArgs(["--version"]);
  assert.equal(parsed.version, true);
});

test("parseArgs accepts dry-run, json, and list-profiles booleans", () => {
  const parsed = parseArgs([
    "pack",
    "task-1",
    "--dry-run",
    "--list-profiles",
    "doctor",
    "--json",
  ]);
  assert.equal(parsed.flags["--dry-run"], true);
  assert.equal(parsed.flags["--list-profiles"], true);
  assert.equal(parsed.flags["--json"], true);
});
