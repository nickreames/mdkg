const goalPursuitRequirements = [
  {
    id: "explicit-goal-qid",
    matches: (content) =>
      content.includes("TARGET_GOAL_QID") &&
      content.includes('mdkg goal show "$TARGET_GOAL_QID" --json'),
  },
  {
    id: "goal-next-routing",
    matches: (content) =>
      content.includes('mdkg goal next "$TARGET_GOAL_QID" --json'),
  },
  {
    id: "explicit-ownership-before-claim",
    matches: (content) =>
      content.includes("OWNER") &&
      content.includes('mdkg goal claim "$TARGET_GOAL_QID" "$WORK_QID" --json'),
  },
  {
    id: "checkpoint-evidence-before-commit",
    matches: (content) =>
      /checkpoint evidence before commit/i.test(content),
  },
  {
    id: "goal-evaluation",
    matches: (content) =>
      content.includes('mdkg goal evaluate "$TARGET_GOAL_QID" --json'),
  },
  {
    id: "conditional-goal-done",
    matches: (content) =>
      content.includes('mdkg goal done "$TARGET_GOAL_QID" --json') &&
      /goal done only when[\s\S]{0,160}(?:evidence|evaluation)/i.test(content),
  },
];

function validateGoalPursuitContract(content) {
  const missing = goalPursuitRequirements
    .filter((requirement) => !requirement.matches(content))
    .map((requirement) => requirement.id);

  return {
    ok: missing.length === 0,
    missing,
  };
}

module.exports = {
  goalPursuitRequirements,
  validateGoalPursuitContract,
};
