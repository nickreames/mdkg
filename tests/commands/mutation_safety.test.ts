import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

const repoRoot = path.resolve(__dirname, "..", "..", "..");

function source(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const MUTATING_COMMAND_AUDIT = [
  {
    command: "mdkg new",
    file: "src/commands/new.ts",
    mutation_kind: "graph-node-create",
    lock_required: true,
    atomic_write: "exclusive-create",
    notes: "Uses withMutationLock and writeFileExclusive through createNodeFile.",
  },
  {
    command: "mdkg checkpoint new",
    file: "src/commands/checkpoint.ts",
    mutation_kind: "graph-node-create",
    lock_required: true,
    atomic_write: "exclusive-create",
    notes: "Checkpoint creation is lock-wrapped and delegates node creation.",
  },
  {
    command: "mdkg task start/update/done",
    file: "src/commands/task.ts",
    mutation_kind: "graph-node-update",
    lock_required: true,
    atomic_write: "atomicWriteFile",
    notes: "Task lifecycle writes Markdown through atomicWriteFile under lock.",
  },
  {
    command: "mdkg goal select/clear/claim/state",
    file: "src/commands/goal.ts",
    mutation_kind: "goal-state-and-graph-update",
    lock_required: true,
    atomic_write: "atomicWriteFile",
    notes: "Goal state and active-node updates are lock-wrapped.",
  },
  {
    command: "mdkg workspace add/remove/enable/disable",
    file: "src/commands/workspace.ts",
    mutation_kind: "config-and-workspace-dirs",
    lock_required: true,
    atomic_write: "atomicWriteFile",
    notes: "Config writes are atomic and command entry points are lock-wrapped.",
  },
  {
    command: "mdkg format",
    file: "src/commands/format.ts",
    mutation_kind: "graph-markdown-normalization",
    lock_required: true,
    atomic_write: "atomicWriteFile",
    notes: "Formatting is lock-wrapped and changed files are written atomically.",
  },
  {
    command: "mdkg skill new/sync",
    file: "src/commands/skill.ts",
    mutation_kind: "skill-and-mirror-update",
    lock_required: true,
    atomic_write: "atomicWriteFile",
    notes: "Skill creation and mirror sync are command-level lock-wrapped.",
  },
  {
    command: "mdkg archive add/compress",
    file: "src/commands/archive.ts",
    mutation_kind: "archive-sidecar-and-zip-update",
    lock_required: true,
    atomic_write: "atomicWriteFile",
    notes: "Archive mutations are lock-wrapped and sidecar/zip writes are atomic.",
  },
  {
    command: "mdkg db init/migrate/snapshot/queue",
    file: "src/commands/db.ts",
    mutation_kind: "project-db-and-schema-state",
    lock_required: true,
    atomic_write: "atomicWriteFile-or-sqlite-transaction",
    notes: "Project DB command families are lock-wrapped around filesystem/SQLite mutation.",
  },
  {
    command: "mdkg subgraph add/sync/materialize",
    file: "src/commands/subgraph.ts",
    mutation_kind: "subgraph-config-bundle-materialization",
    lock_required: true,
    atomic_write: "atomicWriteFile-or-temp-rename",
    notes: "Subgraph mutations use command locks; materialization writes a temp tree before rename.",
  },
] as const;

test("mutating command audit records lock and atomic-write expectations", () => {
  assert.equal(MUTATING_COMMAND_AUDIT.length, 10);
  for (const item of MUTATING_COMMAND_AUDIT) {
    assert.equal(item.lock_required, true, `${item.command} must be categorized for locking`);
    assert.ok(item.atomic_write.length > 0, `${item.command} must document write strategy`);
    assert.ok(item.notes.length > 0, `${item.command} must include audit notes`);
  }
});

test("high-risk graph config and skill mutation paths are lock-wrapped and atomic", () => {
  const workspace = source("src/commands/workspace.ts");
  assert.match(workspace, /withMutationLock/);
  assert.match(workspace, /atomicWriteFile\(configPath/);
  assert.doesNotMatch(workspace, /fs\.writeFileSync\(configPath/);

  const format = source("src/commands/format.ts");
  assert.match(format, /withMutationLock/);
  assert.match(format, /atomicWriteFile\(update\.filePath/);
  assert.doesNotMatch(format, /fs\.writeFileSync\(update\.filePath/);

  const skill = source("src/commands/skill.ts");
  assert.match(skill, /withMutationLock/);
  assert.match(skill, /atomicWriteFile\(canonicalPath/);

  const skillSupport = source("src/commands/skill_support.ts");
  assert.match(skillSupport, /atomicWriteFile\(registryPath/);
  assert.doesNotMatch(skillSupport, /fs\.writeFileSync\(registryPath/);
});
