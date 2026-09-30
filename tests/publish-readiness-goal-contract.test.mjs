import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import goalContract from "../scripts/goal-pursuit-contract.js";

const { goalPursuitRequirements, validateGoalPursuitContract } = goalContract;

const completeFixture = `
# Arbitrary heading
Set TARGET_GOAL_QID from the supplied explicit goal QID.
Run mdkg goal show "$TARGET_GOAL_QID" --json.
Run mdkg goal next "$TARGET_GOAL_QID" --json.
Record OWNER and reject ambiguous ownership.
Run mdkg goal claim "$TARGET_GOAL_QID" "$WORK_QID" --json.
Create durable checkpoint evidence before commit.
Run mdkg goal evaluate "$TARGET_GOAL_QID" --json.
Run goal done only when evaluation and evidence support closure:
mdkg goal done "$TARGET_GOAL_QID" --json.
`;

const missingMarkers = {
  "explicit-goal-qid": 'mdkg goal show "$TARGET_GOAL_QID" --json',
  "goal-next-routing": 'mdkg goal next "$TARGET_GOAL_QID" --json',
  "explicit-ownership-before-claim": 'mdkg goal claim "$TARGET_GOAL_QID" "$WORK_QID" --json',
  "checkpoint-evidence-before-commit": "checkpoint evidence before commit",
  "goal-evaluation": 'mdkg goal evaluate "$TARGET_GOAL_QID" --json',
  "conditional-goal-done": 'mdkg goal done "$TARGET_GOAL_QID" --json',
};

test("goal pursuit contract ignores heading names and placement", () => {
  const reorganized = completeFixture
    .replace("# Arbitrary heading", "## Renamed presentation section")
    .replace("Create durable checkpoint", "### Evidence\nCreate durable checkpoint");

  assert.deepEqual(validateGoalPursuitContract(reorganized), { ok: true, missing: [] });
});

for (const requirement of goalPursuitRequirements) {
  test(`goal pursuit contract reports missing ${requirement.id} behavior`, () => {
    const incomplete = completeFixture.replace(missingMarkers[requirement.id], "");
    const result = validateGoalPursuitContract(incomplete);

    assert.equal(result.ok, false);
    assert(result.missing.includes(requirement.id), `missing diagnostic for ${requirement.id}`);
  });
}

test("canonical goal skill satisfies the behavior contract", () => {
  const canonical = readFileSync(
    new URL("../.mdkg/skills/pursue-mdkg-goal/SKILL.md", import.meta.url),
    "utf8",
  );

  assert.deepEqual(validateGoalPursuitContract(canonical), { ok: true, missing: [] });
});

test("publish readiness accepts actual loop event paths and refuses omitted declarations", () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const script = fileURLToPath(new URL("../scripts/assert-publish-ready.js", import.meta.url));
  const env = { ...process.env, MDKG_RELEASE_SCOPE: "package" };
  const valid = spawnSync(process.execPath, [script], { cwd: root, env, encoding: "utf8" });
  assert.equal(valid.status, 0, valid.stderr);
  for (const omitted of [".mdkg/work/events/events.jsonl", "<workspace-mdkg>/work/events/events.jsonl"]) {
    // Inject a read-only malformed contract; never edit the real build output.
    const source = `const fs=require('node:fs'),path=require('node:path');
      const read=fs.readFileSync;
      fs.readFileSync=function(file,...args){
        const bytes=read.call(this,file,...args);
        if(path.resolve(String(file))===path.resolve('dist/command-contract.json')){
          const contract=JSON.parse(bytes.toString());
          contract.commands.find(c=>c.key==='loop fork').write_paths=
            contract.commands.find(c=>c.key==='loop fork').write_paths.filter(p=>p!==${JSON.stringify(omitted)});
          return JSON.stringify(contract);
        }
        return bytes;
      };
      require(${JSON.stringify(script)});`;
    const invalid = spawnSync(process.execPath, ["-e", source], { cwd: root, env, encoding: "utf8" });
    assert.equal(invalid.status, 1, invalid.stderr);
    assert.match(invalid.stderr, /missing truthful loop fork and dry-run safety metadata/);
  }
});
