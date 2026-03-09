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

test("cli help pack centers the simplified profile and stats flags", () => {
  const result = spawnSync(process.execPath, [cliPath, "help", "pack"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /--profile <name>/);
  assert.match(result.stdout, /--list-profiles/);
  assert.match(result.stdout, /--stats/);
  assert.match(result.stdout, /--dry-run/);
  assert.match(result.stdout, /--skills <mode>/);
  assert.match(result.stdout, /--skills-depth <mode>/);
  assert.match(result.stdout, /Advanced shaping \/ debug flags:/);
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

test("cli help list/search/show include skills and tag filters", () => {
  const listHelp = spawnSync(process.execPath, [cliPath, "help", "list"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(listHelp.status, 0);
  assert.match(listHelp.stdout, /--tags <tag,tag,\.\.\.>/);
  assert.match(listHelp.stdout, /--tags-mode any\|all/);

  const searchHelp = spawnSync(process.execPath, [cliPath, "help", "search"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(searchHelp.status, 0);
  assert.match(searchHelp.stdout, /--tags <tag,tag,\.\.\.>/);
  assert.match(searchHelp.stdout, /--tags-mode any\|all/);

  const showHelp = spawnSync(process.execPath, [cliPath, "help", "show"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(showHelp.status, 0);
  assert.match(showHelp.stdout, /show skill:<slug>/);
  assert.match(showHelp.stdout, /--meta/);
  assert.doesNotMatch(showHelp.stdout, /--body/);
  assert.match(showHelp.stdout, /Shows full body content/);

  const newHelp = spawnSync(process.execPath, [cliPath, "help", "new"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(newHelp.status, 0);
  assert.match(newHelp.stdout, /--skills <slug,slug,\.\.\.>/);
});

test("cli help init includes omni and ignore-default controls", () => {
  const initHelp = spawnSync(process.execPath, [cliPath, "help", "init"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(initHelp.status, 0);
  assert.match(initHelp.stdout, /--omni/);
  assert.match(initHelp.stdout, /--no-update-ignores/);
  assert.doesNotMatch(initHelp.stdout, /--agents/);
  assert.doesNotMatch(initHelp.stdout, /--claude/);
});
