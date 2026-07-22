import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
