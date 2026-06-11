import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const contractPath = path.join(repoRoot, "dist", "command-contract.json");

type CommandRecord = {
  key: string;
  path: string[];
  usage: string[];
  args: unknown[];
  flags: unknown[];
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
  for (const key of ["new", "task start", "goal claim", "workspace", "format", "skill new", "db", "subgraph sync"]) {
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
  assert.equal(fixPlan.dry_run.apply_supported, false);

  const status = commandByKey(contract, "status");
  assert.equal(status.danger_level, "read-only");
  assert.deepEqual(status.side_effects, ["none"]);
  assert.equal(status.json_schema_ref, "mdkg.status.v1");
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
