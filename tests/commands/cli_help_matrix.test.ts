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
    ["new", /Agent workflow file types:\n  spec work work_order receipt feedback dispute proposal/],
    ["workspace", /mdkg workspace ls \[--json\]/],
    ["index", /mdkg index \[--tolerant\]/],
    ["show", /mdkg show <id-or-qid> \[--ws <alias>\] \[--meta\] \[--json\|--xml\|--toon\|--md\]/],
    ["list", /--json\|--xml\|--toon\|--md/],
    ["search", /mdkg search "<query>"/],
    ["next", /mdkg next \[<id-or-qid>\]/],
    ["checkpoint", /mdkg checkpoint new <title> \[--ws <alias>\] \[--json\]/],
    ["validate", /mdkg validate \[--out <path>\] \[--quiet\] \[--json\]/],
    ["format", /mdkg format/],
    ["doctor", /mdkg doctor \[--json\]/],
    ["capability", /mdkg capability resolve \[query\] \[--requires <capability>\] \[--fresh-only\] \[--json\]/],
    ["archive", /mdkg archive compress <id-or-archive-uri\|--all> \[--json\]/],
    ["bundle", /mdkg bundle create \[--profile private\|public\] \[--ws <alias\|all>\] \[--output <path>\] \[--json\]/],
    ["subgraph", /mdkg subgraph verify \[alias\|--all\] \[--json\]/],
    ["work", /mdkg work artifact add/],
    ["skill", /mdkg skill validate \[<slug>\] \[--json\]/],
    ["task", /mdkg task start <id-or-qid> \[--ws <alias>\] \[--run-id <id>\] \[--note "<text>"\] \[--json\]/],
    ["event", /mdkg event enable \[--ws <alias>\] \[--json\]/],
  ];

  for (const [command, pattern] of cases) {
    const result = runCli(["help", command]);
    assert.equal(result.status, 0, command);
    assert.match(result.stdout, pattern, command);
  }

  const bundleImport = runCli(["help", "bundle", "import"]);
  assert.equal(bundleImport.status, 0);
  assert.match(bundleImport.stdout, /mdkg subgraph add\/list\/show\/rm\/enable\/disable\/verify\/refresh/);
});

test("cli command --help routes to command-specific help", () => {
  const result = runCli(["workspace", "--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /mdkg workspace ls \[--json\]/);
  assert.match(result.stdout, /mdkg workspace add <alias> <path> \[--mdkg-dir <dir>\] \[--visibility <level>\] \[--json\]/);
  assert.match(result.stdout, /mdkg workspace rm <alias> \[--json\]/);
  assert.match(result.stdout, /mdkg workspace enable <alias> \[--json\]/);
  assert.match(result.stdout, /mdkg workspace disable <alias> \[--json\]/);
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
