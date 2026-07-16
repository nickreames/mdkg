---
id: goal-74
type: goal
title: Separate portable mdkg workflows from package publication
status: done
priority: 1
goal_state: achieved
goal_condition: Goal 74 is achieved when pursue-mdkg-goal honors a supplied explicit goal QID without changing stale selected-goal state, explicit ownership precedes claim, checkpoint evidence precedes a path-specific local commit, evaluate precedes evidence-supported done, blocked lanes do not prevent other actionable work, canonical and public seed copies are equal and product-neutral, mdkg init --agent discovers the lifecycle skill, package release authority is isolated in a repository-local skill absent from public defaults, protected paths and existing semantic nodes remain unchanged, one approved local commit exists, and nothing is pushed or published.
scope_refs: [task-798, task-799, task-800, test-458, test-459, test-460]
last_active_node: test-460
required_skills: [service-boundary-ownership-check, author-mdkg-skill, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [mdkg skill validate pursue-mdkg-goal --json, mdkg skill validate release-mdkg-package --json, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, mdkg goal show root:goal-74 --json, mdkg goal next root:goal-74 --json, mdkg goal evaluate root:goal-74 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [lifecycle, skills, public-seed, local-only]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: []
relates: [epic-254]
blocked_by: []
blocks: []
refs: [edd-79, dec-85, epic-254]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: [portable-goal-lifecycle-policy]
skills: [pursue-mdkg-goal, author-mdkg-skill, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Objective

Separate portable goal pursuit from package publication while preserving exact
public seed behavior, deterministic ownership and evidence gates, and local-only
closeout.

# End Condition

The frontmatter condition is satisfied with completed scoped work, passing
deterministic validation, one final checkpoint, one path-specific local commit,
unchanged selected `root:goal-73`, and no remote or package mutation.

# Non-Goals

- No TypeScript, functional source, scripts, tests, package or lock metadata,
  dependencies, generated contracts, fixtures, or non-skill templates.
- No change to `select-work-and-ground-context` or
  `verify-close-and-checkpoint`.
- No modification of existing release goals or pre-existing semantic nodes.
- No npm registry authentication check, package publication, push, tag, deploy,
  provider mutation, history rewrite, bundle, archive, subgraph, or gitlink
  action.

# Recursive Algorithm

1. Preserve the existing selected goal and use explicit `root:goal-74` commands.
2. Record an explicit owner before claiming one scoped node at a time.
3. Author the canonical lifecycle and local release authority, then synchronize
   only configured mirrors and the approved public lifecycle seed.
4. Continue through remaining actionable nodes if one test lane is blocked.
5. Run every deterministic check and record durable checkpoint evidence before
   staging or commit.
6. Evaluate `root:goal-74`; run goal done only when the evaluation and evidence
   support closure.

# Required Skills

- `service-boundary-ownership-check`
- `author-mdkg-skill`
- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

- Internal/public lifecycle equality and configured mirror equality.
- Skill, index, changed-only, and bounded full graph validation.
- Temporary initialized fixture discovery and cleanup.
- Explicit-QID, stale-selection, ownership, checkpoint, evaluation, done,
  blocker-continuation, path-specific commit, and no-push assertions.
- Public forbidden-name scan and release-skill absence proof.
- Baseline diff protection for functional and pre-existing semantic paths.

# Acceptance Criteria

- All six scoped task/test nodes are done with evidence.
- Canonical and public seed lifecycle bodies are byte-identical.
- `release-mdkg-package` exists only in canonical and configured local mirrors.
- `root:goal-75` is paused and contains no current publication approval.
- Selected-goal state before and after is exactly `root:goal-73`.

# Definition Of Done

- Goal condition is achieved and required checks have evidence.
- A final goal-closeout checkpoint is referenced from this goal.
- A staged-path review proves every committed path is approved.
- One local commit exists and no push or publish occurred.

# Stop Conditions

- Stop on baseline drift, overlapping ownership, selected-goal mutation, or an
  unapproved path.
- Keep the goal open if validation or evidence is incomplete.
- Record a lane blocker and continue other actionable scope before declaring
  the whole goal blocked.

# Current State

All six scoped nodes are done. `chk-540` records passing validation and was
created before the final path-specific local commit. Selected achieved
`root:goal-73` remains intentionally unchanged. Final explicit evaluation and
conditional done are the remaining local goal transitions.

# Iteration Log

- 2026-07-16: Created from an explicit bounded child-writer dispatch after
  confirming clean Git state, no active local work node, and sole ownership of
  the lifecycle/public-seed paths.
- 2026-07-16: Completed canonical/public lifecycle equality, local release
  isolation, disposable init discovery, deterministic trigger tests, protected
  path proof, and final pre-commit checkpoint `chk-540`.

# Skill Improvement Candidates

- Validate whether future CLI support should make owner assignment part of
  `goal claim`; current execution records owner metadata before claim through an
  authorized graph edit.

# Completion Evidence

- Tasks `798..800` and tests `458..460` are done.
- `chk-540` records skill hashes, init fixture discovery and cleanup,
  release-skill public absence, graph validation, protected paths, selected
  state, and no-push/no-publish boundaries before commit.
- Final explicit `goal evaluate` and conditional `goal done` follow this durable
  evidence. The resulting path-specific local commit fulfills the last
  post-checkpoint condition without a second graph-only commit.
