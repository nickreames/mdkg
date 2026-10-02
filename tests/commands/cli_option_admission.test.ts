import { test } from "node:test";
import assert from "node:assert/strict";
const { runCli, runCliAsync } = require("../../cli");
const { parseArgs } = require("../../util/argparse");
const { COMMAND_OPTIONS, commandOptionError, commandOptionKind } = require("../../commands/option_contract") as {
  COMMAND_OPTIONS: Record<string, string[]>;
  commandOptionError: (parsed: any) => string | undefined;
  commandOptionKind: (command: string, flag: string) => "value" | "boolean" | "integer" | undefined;
};

const rejected: string[][] = [
  ["index", "--verify", "--json"],
  ["index", "--json"],
  ["new", "task", "Option refusal", "--dry-run"],
  ["task", "done", "task-1", "--dry-run"],
  ["goal", "done", "goal-1", "--dry-run"],
  ["work", "order", "new", "Order", "--bogus"],
  ["upgrade", "--aply"],
  ["graph", "import-template", "fixture", "--bogus"],
  ["db", "queue", "ack", "queue", "message", "--paused"],
  ["db", "queue", "create", "queue", "--lease-ms", "100"],
  ["goal", "clear", "--ws", "child"],
  ["fix", "ids", "--family", "refs"],
  ["graph", "refs", "task-1", "--target", "elsewhere"],
  ["graph", "migrate", "--xml"],
  ["graph", "migrate", "--confirm-quiescent"],
  ["graph", "recover", "sha256:fixture", "--confirm-quiescent=maybe"],
  ["mcp", "serve", "--stdio", "--bogus"],
  ["--bogus", "new", "task", "Title"],
  ["new", "task", "Title", "--note", "--not-an-output-path"],
  ["new", "task", "Title", "--priority", "1garbage"],
  ["search", "query", "--limit", "1.5"],
  ["upgrade", "--apply=maybe"],
  ["init", "--agent=maybe"],
  ["init", "--force", "unexpected"],
  ["index", "--tolerant=maybe"],
  ["--root", "--mistyped"],
  ["show", "task-1", "-x"],
  ["new", "task", "Title", "-typo"],
  ["new", "task", "Title", "--priority"],
  ["new", "task", "Title", "--priority="],
  ["--help", "--bogus"],
  ["--version", "--bogus"],
  ["pack", "--list-profiles", "--out", "unused.md"],
  ["search", "query", "--limit=bad", "--limit=2"],
  ["upgrade", "--apply=bad", "--apply=false"],
  ["--help=bad", "--help"],
  ["--version=bad", "--version"],
  ["new", "task", "Title", "--receipt-kind=summary"],
  ["new", "task", "Title", "--cases=case-1"],
  ["new", "task", "Title", "--id=semantic"],
  ["new", "rule", "Title", "--priority=1"],
  ["new", "rule", "Title", "--status=todo"],
  ["new", "rule", "Title", "--parent=task-1"],
  ["new", "rule", "Title", "--skills=example"],
  ["new", "task", "Title", "--supersedes=dec-1"],
  ["new", "work", "Title", "--validation-policy-ref=policy://example"],
];

for (const [entrypoint, invoke] of [["sync", runCli], ["async", runCliAsync]] as const) {
  test(`${entrypoint} rejects unsupported and malformed options before root discovery`, async () => {
    for (const argv of [...rejected, ...Object.keys(COMMAND_OPTIONS).map(key => [...key.split(" "), "--not-supported"])]) {
      let cwdCalls = 0;
      const errors: string[] = [];
      let thrown: unknown;
      let code: number | undefined;
      try {
        code = await invoke(argv, {
          cwd: () => { cwdCalls++; throw new Error("configuration boundary was reached"); },
          log: () => {}, error: (...args: unknown[]) => errors.push(args.map(String).join(" ")),
        });
      } catch (error) { thrown = error; }
      assert.equal(cwdCalls, 0, argv.join(" "));
      assert.equal(thrown, undefined, argv.join(" "));
      assert.equal(code, 1, argv.join(" "));
      assert.ok(errors.length, argv.join(" "));
    }
  });
}

test("every concrete command option has a lexical type and admits its supported value form", () => {
  for (const [command, flags] of Object.entries(COMMAND_OPTIONS)) {
    assert.equal(new Set(flags).size, flags.length, command);
    for (const flag of flags) {
      const kind = commandOptionKind(command, flag);
      assert.ok(kind, `${command} ${flag}`);
      const value = kind === "boolean" ? "false" : kind === "integer" ? "2" : "sample";
      for (const argv of [
        [...command.split(" "), `${flag}=${value}`],
        [`${flag}=${value}`, ...command.split(" ")],
        ...(kind === "boolean" ? [] : [[...command.split(" "), flag, value], [flag, value, ...command.split(" ")]]),
      ]) {
        const parsed = parseArgs(argv);
        assert.equal(parsed.error, undefined, argv.join(" "));
        assert.equal(commandOptionError(parsed), undefined, argv.join(" "));
      }
    }
  }
});

test("aliases, overloads, negative numbers and explicit option-looking literals preserve their meanings", () => {
  const cases: Array<[string[], string, string | boolean]> = [
    [["-o=result.md", "pack", "task-1"], "--out", "result.md"],
    [["pack", "task-1", "--output", "result.md"], "--out", "result.md"],
    [["pack", "task-1", "--profile", "concise"], "--pack-profile", "concise"],
    [["bundle", "create", "--profile", "private"], "--pack-profile", "private"],
    [["subgraph", "add", "child", "bundle.zip", "--profile=private"], "--pack-profile", "private"],
    [["list", "-w", "ROOT"], "--ws", "root"],
    [["--agent", "init"], "--agent", true],
    [["help", "init", "--agent"], "--agent", true],
    [["init", "--agent", "true"], "--agent", "true"],
    [["init", "--agent", "false"], "--agent", "false"],
    [["--agent", "init", "event", "append"], "--agent", "init"],
    [["event", "append", "--agent", "worker"], "--agent", "worker"],
    [["search", "value", "--limit", "-1"], "--limit", "-1"],
    [["task", "update", "task-1", "--note=--json"], "--note", "--json"],
  ];
  for (const [argv, flag, value] of cases) {
    const parsed = parseArgs(argv);
    assert.equal(parsed.error, undefined, argv.join(" "));
    assert.equal(parsed.flags[flag], value, argv.join(" "));
    assert.equal(commandOptionError(parsed), undefined, argv.join(" "));
  }
  const literal = parseArgs(["new", "task", "--", "--pricing-model", "-literal", "false"]);
  assert.deepEqual(literal.positionals, ["new", "task", "--pricing-model", "-literal", "false"]);
  assert.equal(commandOptionError(literal), undefined);
  // A bare Boolean option must not swallow an ordinary query named false.
  assert.deepEqual(parseArgs(["search", "--json", "false"]).positionals, ["search", "false"]);
});

test("explicit init help preserves the agent overload in both entrypoints", async () => {
  for (const invoke of [runCli, runCliAsync]) {
    for (const argv of [["help", "init", "--agent"], ["init", "--agent", "--help"], ["--agent", "help", "init"]]) {
      const lines: string[] = [];
      const code = await invoke(argv, { cwd: () => { throw new Error("help must not discover a graph"); },
        log: (line: string) => lines.push(line), error: () => {} });
      assert.equal(code, 0, argv.join(" "));
      assert.match(lines.join("\n"), /mdkg init/);
    }
  }
});
