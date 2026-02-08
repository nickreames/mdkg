import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "node:child_process";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const packageJsonPath = path.resolve(__dirname, "..", "..", "..", "package.json");
const repoRoot = path.resolve(__dirname, "..", "..", "..");

test("cli --version prints package version", () => {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as { version: string };
  const result = spawnSync(process.execPath, [cliPath, "--version"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), pkg.version);
});

test("cli help pack includes profile and stats flags", () => {
  const result = spawnSync(process.execPath, [cliPath, "help", "pack"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /--pack-profile <name>/);
  assert.match(result.stdout, /--list-profiles/);
  assert.match(result.stdout, /--stats/);
  assert.match(result.stdout, /--dry-run/);
  assert.match(result.stdout, /--truncation-report <p>/);
});

test("cli pack --list-profiles works outside an initialized repo", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-list-profiles-"));
  const result = spawnSync(process.execPath, [cliPath, "pack", "--list-profiles"], {
    encoding: "utf8",
    cwd,
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Built-in pack profiles:/);
  assert.match(result.stdout, /standard/);
  assert.match(result.stdout, /concise/);
  assert.match(result.stdout, /headers/);
});

test("cli usage errors show command-specific help", () => {
  const result = spawnSync(process.execPath, [cliPath, "pack", "task-1", "--max-tokens", "abc"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--max-tokens must be an integer/);
  assert.match(result.stdout, /Usage:\n  mdkg pack <id-or-qid> \[options\]/);
});
