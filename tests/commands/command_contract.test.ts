import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { makeTempDir } from "../helpers/fs";

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const contractPath = path.join(repoRoot, "dist", "command-contract.json");

type CommandRecord = {
  key: string;
  path: string[];
  usage: string[];
  args: Array<{ name: string; required?: boolean; source?: string; description?: string }>;
  flags: Array<{ name: string; value?: string | null; required?: boolean; description?: string }>;
  output_formats: string[];
  json_schema_ref: string | null;
  side_effects: string[];
  read_paths: string[];
  write_paths: string[];
  dry_run: Record<string, unknown>;
  visibility: string;
  receipts: string[];
  lock_policy: string;
  atomic_write_policy: string;
  danger_level: string;
  descriptor_source?: string;
  handler?: string;
  help_notes?: string[];
};

function readContract(): { schema_version: number; tool: string; contract_hash: string; commands: CommandRecord[] } {
  return JSON.parse(fs.readFileSync(contractPath, "utf8"));
}

function commandByKey(contract: ReturnType<typeof readContract>, key: string): CommandRecord {
  const command = contract.commands.find((item) => item.key === key);
  assert.ok(command, `missing command contract record for ${key}`);
  return command;
}

test("generated command contract has required schema fields on every public help target", () => {
  const contract = readContract();
  const { HELP_TARGETS } = require(path.join(repoRoot, "scripts", "cli_help_targets.js")) as {
    HELP_TARGETS: string[][];
  };
  const expectedKeys = HELP_TARGETS.map((target) => target.join(" ")).sort();
  const actualKeys = contract.commands.map((command) => command.key).sort();

  assert.equal(contract.schema_version, 1);
  assert.equal(contract.tool, "mdkg");
  assert.match(contract.contract_hash, /^[a-f0-9]{64}$/);
  assert.deepEqual(actualKeys, expectedKeys);

  for (const command of contract.commands) {
    assert.equal(command.visibility, "public", command.key);
    assert.ok(Array.isArray(command.path), command.key);
    assert.ok(Array.isArray(command.usage), command.key);
    assert.ok(Array.isArray(command.args), command.key);
    assert.ok(Array.isArray(command.flags), command.key);
    assert.ok(command.output_formats.includes("text"), command.key);
    assert.ok("json_schema_ref" in command, command.key);
    assert.ok(Array.isArray(command.side_effects), command.key);
    assert.ok(Array.isArray(command.read_paths), command.key);
    assert.ok(Array.isArray(command.write_paths), command.key);
    assert.ok(command.dry_run && typeof command.dry_run === "object", command.key);
    assert.ok(Array.isArray(command.receipts), command.key);
    assert.ok(command.lock_policy.length > 0, command.key);
    assert.ok(command.atomic_write_policy.length > 0, command.key);
    assert.ok(command.danger_level.length > 0, command.key);
  }
});

test("generated command contract check mode detects no drift", () => {
  const result = spawnSync(process.execPath, ["scripts/generate-command-contract.js", "--check"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /command contract check: ok/);
});

test("mutating commands carry safety metadata and read-only commands stay read-only", () => {
  const contract = readContract();
  for (const key of ["new", "task start", "goal claim", "workspace", "format", "skill new", "db", "subgraph sync", "fix apply", "fix ids"]) {
    const command = commandByKey(contract, key);
    assert.notEqual(command.danger_level, "read-only", key);
    assert.notDeepEqual(command.side_effects, ["none"], key);
    assert.ok(command.write_paths.length > 0, key);
    assert.notEqual(command.lock_policy, "none-read-only", key);
    assert.notEqual(command.atomic_write_policy, "none-read-only", key);
  }

  const fixPlan = commandByKey(contract, "fix plan");
  assert.equal(fixPlan.danger_level, "read-only");
  assert.deepEqual(fixPlan.side_effects, ["none"]);
  assert.equal(fixPlan.write_paths.length, 0);
  assert.equal(fixPlan.dry_run.apply_supported, true);
  assert.equal(fixPlan.dry_run.apply_family, "ids");

  const fixApply = commandByKey(contract, "fix apply");
  assert.equal(fixApply.danger_level, "high");
  assert.equal(fixApply.dry_run.apply_family, "ids");
  assert.ok(fixApply.receipts.includes("fix-apply-receipt"));

  const status = commandByKey(contract, "status");
  assert.equal(status.danger_level, "read-only");
  assert.deepEqual(status.side_effects, ["none"]);
  assert.equal(status.json_schema_ref, "mdkg.status.v1");

  const handoff = commandByKey(contract, "handoff");
  assert.equal(handoff.json_schema_ref, "mdkg.handoff.v1");
  assert.ok(handoff.receipts.includes("handoff-receipt"));
  assert.ok(handoff.write_paths.includes(".mdkg/handoffs/**"));

  const dbQueue = commandByKey(contract, "db queue");
  assert.equal(dbQueue.json_schema_ref, "mdkg.project_db.queue.adapter.v1");
  assert.ok(dbQueue.receipts.includes("queue-adapter-contract-receipt"));
  assert.ok(dbQueue.side_effects.includes("emit-read-only-adapter-contract"));
});

test("safety classification is explicit and reflects conditional writes and configured destinations", () => {
  const { defaultSafety } = require(path.join(repoRoot, "scripts/generate-command-contract.js"));
  assert.throws(() => defaultSafety("new-unreviewed-command", ""), /explicit reviewed safety classification/);
  const contract = readContract();
  for (const key of ["pack", "validate", "doctor", "work order", "graph", "graph clone", "graph fork", "graph import-template", "fix"]) {
    const record = commandByKey(contract, key);
    assert.notEqual(record.danger_level, "read-only", key);
    assert.ok(record.write_paths.length, key);
  }
  for (const key of ["new", "task start", "event append", "loop fork"]) {
    assert.ok(commandByKey(contract, key).write_paths.includes(".mdkg/work/events/events.jsonl"), key);
  }
  assert.ok(commandByKey(contract, "goal").write_paths.includes(".mdkg/state/selected-goal.json"));
  assert.ok(commandByKey(contract, "db").write_paths.includes(".mdkg/config.json"));
  for (const key of ["index", "db index", "doctor", "handoff"]) {
    assert.ok(commandByKey(contract, key).write_paths.includes("<configured-index-cache-paths>"), key);
  }
  assert.equal(commandByKey(contract, "subgraph materialize").dry_run.supported, false);
  assert.equal(commandByKey(contract, "format").dry_run.requires, "--headings");
  assert.equal(commandByKey(contract, "bundle import").danger_level, "read-only");
  assert.deepEqual(commandByKey(contract, "pack").dry_run.write_paths, []);
});

test("real pack/report/cache effects and observational controls match command safety metadata", () => {
  const root = makeTempDir("mdkg-contract-effects-");
  const cli = path.join(repoRoot, "dist/cli.js");
  const run = (args: string[], allowed = [0]) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
    assert.ok(allowed.includes(result.status!), `${args.join(" ")}: ${result.stderr}\n${result.stdout}`);
    return result.stdout;
  };
  const inventory = () => {
    const files: Record<string, string> = {};
    const walk = (dir: string) => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file); else files[path.relative(root, file)] = fs.readFileSync(file).toString("base64");
    } };
    walk(root); return files;
  };
  run(["init", "--graph-only"]);
  run(["new", "task", "Effect fixture", "--json"]);
  const before = inventory();
  run(["pack", "task-1", "--dry-run", "--stats-out", "ignored.json"]);
  run(["validate", "--json"]);
  run(["show", "task-1", "--json"]);
  assert.deepEqual(inventory(), before);
  run(["pack", "task-1", "--out", "review/pack.md", "--stats-out", "review/stats.json"]);
  run(["validate", "--out", "review/validation.txt", "--json-out", "review/validation.json", "--json"]);
  for (const name of ["pack.md", "stats.json", "validation.txt", "validation.json"]) assert.ok(fs.existsSync(path.join(root, "review", name)));
  run(["pack", "task-1"]);
  assert.ok(fs.readdirSync(path.join(root, ".mdkg/pack")).length > 0);
  // Owned fixture only: a cold cache exposes doctor's default refresh effect.
  fs.rmSync(path.join(root, ".mdkg/index"), { recursive: true });
  const cold = inventory();
  run(["doctor", "--strict", "--json"], [2]);
  assert.deepEqual(inventory(), cold);
  run(["doctor", "--json"], [0, 2]);
  assert.ok(fs.existsSync(path.join(root, ".mdkg/index/global.json")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg/index/capabilities.json")));
});

test("loop command contract records are backed by typed descriptors", () => {
  const contract = readContract();
  const loopNext = commandByKey(contract, "loop next");
  assert.equal(loopNext.descriptor_source, "src/commands/loop_descriptors.ts");
  assert.equal(loopNext.handler, "runLoopNextCommand");
  assert.equal(loopNext.danger_level, "read-only");
  assert.deepEqual(loopNext.side_effects, ["none"]);
  assert.ok(loopNext.receipts.includes("loop-next-receipt"));
  assert.ok(loopNext.flags.some((flag) => flag.name === "--json" && flag.description?.includes("deterministic JSON")));
  assert.ok(loopNext.flags.some((flag) => flag.name === "--ws" && flag.value === "<alias>"));
  assert.ok(loopNext.args.some((arg) => arg.name === "loop" && arg.required === true));
  assert.ok(loopNext.help_notes?.some((note) => note.includes("Read-only routing")));

  const loopFork = commandByKey(contract, "loop fork");
  assert.equal(loopFork.descriptor_source, "src/commands/loop_descriptors.ts");
  assert.equal(loopFork.handler, "runLoopForkCommand");
  assert.equal(loopFork.danger_level, "moderate");
  assert.ok(loopFork.side_effects.includes("create-scoped-loop-and-optional-child-nodes"));
  assert.ok(loopFork.write_paths.includes(".mdkg/**/*.md"));
  assert.ok(loopFork.flags.some((flag) => flag.name === "--scope" && flag.required === true));
  assert.ok(loopFork.flags.some((flag) => flag.name === "--dry-run"));
  assert.ok(loopFork.flags.some((flag) => flag.name === "--run-id" && flag.value === "<id>"));
  assert.ok(loopFork.flags.some((flag) => flag.name === "--ws" && flag.value === "<alias>"));
  assert.ok(loopFork.flags.some((flag) => flag.name === "--no-cache"));
  assert.ok(loopFork.flags.some((flag) => flag.name === "--no-reindex"));
  assert.ok(loopFork.side_effects.includes("reserve-sqlite-node-ids-when-configured"));
  assert.ok(loopFork.side_effects.includes("append-loop-fork-event-when-event-logging-is-enabled"));
  assert.ok(loopFork.write_paths.includes(".mdkg/work/events/events.jsonl"));
  assert.deepEqual(loopFork.dry_run.side_effects, ["none"]);
  assert.deepEqual(loopFork.dry_run.write_paths, []);
  assert.equal(loopFork.dry_run.reserves_ids, false);
});

test("loop descriptor flags match parser branches and generated help", () => {
  const contract = readContract();
  const expectedFlags: Record<string, string[]> = {
    "loop": ["--root", "--ws", "--json", "--no-cache", "--no-reindex", "--run-id"],
    "loop list": ["--root", "--ws", "--json", "--no-cache", "--no-reindex"],
    "loop show": ["--meta", "--root", "--ws", "--json", "--no-cache", "--no-reindex"],
    "loop fork": [
      "--scope",
      "--title",
      "--materialization",
      "--planning-only",
      "--no-children",
      "--dry-run",
      "--run-id",
      "--root",
      "--ws",
      "--json",
      "--no-cache",
      "--no-reindex",
    ],
    "loop plan": ["--root", "--ws", "--json", "--no-cache", "--no-reindex"],
    "loop next": ["--root", "--ws", "--json", "--no-cache", "--no-reindex"],
    "loop runs": ["--root", "--ws", "--json", "--no-cache", "--no-reindex"],
  };

  // Family help is the union of its concrete leaves; each leaf also admits the
  // same global help/version controls used by both CLI entrypoints.
  expectedFlags.loop = [...new Set(Object.entries(expectedFlags).filter(([key]) => key !== "loop").flatMap(([, flags]) => flags))];

  for (const [key, flags] of Object.entries(expectedFlags)) {
    const command = commandByKey(contract, key);
    assert.deepEqual(command.flags.map((flag) => flag.name).sort(), [...flags, "--help", "--version"].sort(), key);
    const helpTarget = key.split(" ");
    const help = spawnSync(process.execPath, [path.join(repoRoot, "dist", "cli.js"), "help", ...helpTarget], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    assert.equal(help.status, 0, help.stderr || key);
    for (const flag of flags) {
      assert.match(help.stdout, new RegExp(flag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${key} ${flag}`);
    }
  }
});

test("machine option admission is complete and concrete rather than a help-family union", () => {
  const contract = readContract() as ReturnType<typeof readContract> & {
    option_admission: Array<{ command: string; flags: Array<{ name: string; kind: string }> }>;
  };
  const { COMMAND_OPTIONS, commandOptionKind } = require("../../commands/option_contract") as {
    COMMAND_OPTIONS: Record<string, string[]>;
    commandOptionKind: (command: string, flag: string) => string;
  };
  assert.deepEqual(contract.option_admission, Object.entries(COMMAND_OPTIONS).map(([command, flags]) => ({
    command, flags: flags.map(name => ({ name, kind: commandOptionKind(command, name) })),
  })));
  const ack = contract.option_admission.find(item => item.command === "db queue ack")!;
  assert.ok(ack.flags.some(flag => flag.name === "--lease-owner"));
  assert.ok(!ack.flags.some(flag => flag.name === "--paused" || flag.name === "--lease-ms"));
  const global = commandByKey(contract, "global");
  assert.deepEqual(global.flags.map(flag => flag.name), ["--help", "--root", "--version"]);
  const ids = commandByKey(contract, "fix ids");
  assert.ok(!ids.flags.some(flag => flag.name === "--family"));
  const create = commandByKey(contract, "new");
  for (const flag of ["--prev", "--relates", "--blocks", "--artifacts", "--aliases", "--cases"]) {
    assert.ok(create.flags.some(item => item.name === flag), flag);
  }
});

test("contract hash is stable over canonical command metadata", () => {
  const first = spawnSync(process.execPath, ["scripts/generate-command-contract.js"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const second = spawnSync(process.execPath, ["scripts/generate-command-contract.js"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  const firstContract = JSON.parse(first.stdout);
  const secondContract = JSON.parse(second.stdout);
  assert.equal(firstContract.contract_hash, secondContract.contract_hash);
  assert.deepEqual(firstContract.commands.map((command: CommandRecord) => command.key), secondContract.commands.map((command: CommandRecord) => command.key));
});
