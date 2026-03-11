import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "node:child_process";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function runCli(args: string[], cwd?: string) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    cwd,
  });
}

test("cli help covers the remaining command help surfaces", () => {
  const cases: Array<[string, RegExp]> = [
    ["guide", /mdkg guide/],
    ["workspace", /mdkg workspace add <alias> <path>/],
    ["index", /mdkg index \[--tolerant\]/],
    ["show", /mdkg show <id-or-qid> \[--ws <alias>\] \[--meta\] \[--json\]/],
    ["list", /--tags-mode any\|all.*--json/s],
    ["search", /mdkg search "<query>"/],
    ["next", /mdkg next \[<id-or-qid>\]/],
    ["checkpoint", /mdkg checkpoint new <title>/],
    ["validate", /mdkg validate \[--out <path>\] \[--quiet\]/],
    ["format", /mdkg format/],
    ["doctor", /mdkg doctor \[--json\]/],
    ["skill", /mdkg skill list \[--tags <tag,tag,\.\.\.>\] \[--tags-mode any\|all\] \[--json\]/],
    ["task", /mdkg task start <id-or-qid>/],
    ["event", /mdkg event enable \[--ws <alias>\] \[--no-update-gitignore\]/],
  ];

  for (const [command, pattern] of cases) {
    const result = runCli(["help", command]);
    assert.equal(result.status, 0, command);
    assert.match(result.stdout, pattern, command);
  }
});

test("cli command --help routes to command-specific help", () => {
  const result = runCli(["workspace", "--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /mdkg workspace ls/);
  assert.match(result.stdout, /mdkg workspace rm <alias>/);
});

test("cli prints root guidance when config is required but missing", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-no-config-"));
  const result = runCli(["show", "task-1"], cwd);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /mdkg must be run from a repo root with \.mdkg\/config\.json/);
  assert.match(result.stderr, /hint: run from the repo root, pass --root <path>, or run `mdkg init`/);
});

test("cli help falls back to global usage for unknown help target", () => {
  const result = runCli(["help", "not-a-command"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Primary commands:/);
  assert.match(result.stdout, /Advanced \/ maintenance commands:/);
});

test("cli checkpoint and pack usage errors hit command-specific handlers", () => {
  const checkpoint = runCli(["checkpoint"], path.resolve(__dirname, "..", "..", ".."));
  assert.equal(checkpoint.status, 1);
  assert.match(checkpoint.stderr, /checkpoint requires a subcommand/);
  assert.match(checkpoint.stdout, /mdkg checkpoint new <title>/);

  const pack = runCli(["pack", "--list-profiles", "task-1"], path.resolve(__dirname, "..", "..", ".."));
  assert.equal(pack.status, 1);
  assert.match(pack.stderr, /pack --list-profiles does not accept positional arguments/);
  assert.match(pack.stdout, /Usage:\n  mdkg pack <id-or-qid> \[options\]/);
});
