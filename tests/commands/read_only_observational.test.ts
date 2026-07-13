import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): string {
  const result = spawnSync(process.execPath, [cliPath, ...args], { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return result.stdout.trim();
}

function snapshotTree(root: string, relativePaths: string[]): Record<string, string> {
  const snapshot: Record<string, string> = {};
  const visit = (relativePath: string): void => {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) {
      return;
    }
    const stat = fs.lstatSync(absolutePath);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(absolutePath).sort()) {
        visit(path.join(relativePath, entry));
      }
      return;
    }
    snapshot[relativePath.split(path.sep).join("/")] = crypto
      .createHash("sha256")
      .update(fs.readFileSync(absolutePath))
      .digest("hex");
  };
  for (const relativePath of relativePaths) {
    visit(relativePath);
  }
  return snapshot;
}

test("read-only command families leave SQLite, IDs, events, and missing caches unchanged", () => {
  const root = makeTempDir("mdkg-read-only-observational-");
  run(["init", "--agent"], root);
  run(["new", "goal", "Observed goal", "--json"], root);
  run(["new", "loop", "Observed loop", "--json"], root);
  run(["new", "manifest", "Observed manifest", "--id", "agent.observed", "--json"], root);
  run([
    "skill", "new", "observed-skill", "Observed Skill",
    "--description", "use when verifying observational reads",
    "--json",
  ], root);
  run(["index"], root);

  for (const name of ["global.json", "skills.json", "capabilities.json", "subgraphs.json"]) {
    fs.rmSync(path.join(root, ".mdkg", "index", name), { force: true });
  }
  const observedPaths = [".mdkg/index", ".mdkg/work/events/events.jsonl"];
  const before = snapshotTree(root, observedPaths);

  const commands = [
    ["goal", "show", "goal-1", "--json"],
    ["goal", "next", "goal-1", "--json"],
    ["goal", "evaluate", "goal-1", "--json"],
    ["work", "validate", "--json"],
    ["loop", "list", "--json"],
    ["loop", "show", "loop-1", "--json"],
    ["loop", "plan", "loop-1", "--json"],
    ["loop", "next", "loop-1", "--json"],
    ["skill", "list", "--json"],
    ["skill", "show", "observed-skill", "--meta-only", "--json"],
    ["manifest", "list", "--json"],
    ["manifest", "show", "agent.observed", "--json"],
    ["capability", "list", "--json"],
    ["status", "--json"],
    ["validate", "--json"],
  ];
  for (const command of commands) {
    assert.notEqual(run(command, root), "", command.join(" "));
  }

  assert.deepEqual(snapshotTree(root, observedPaths), before);
});
