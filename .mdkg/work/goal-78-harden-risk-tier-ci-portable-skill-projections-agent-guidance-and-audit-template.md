---
id: goal-78
type: goal
title: Harden risk-tier CI portable skill projections agent guidance and audit templates
status: todo
priority: 1
goal_state: paused
goal_condition: Goal 78 is achieved after Goal 77 and its goal-next fix are complete, measured local release receipts are bound to an accepted risk-tier CI decision, a source-owned smoke topology drives a Node 24.15.0 and 24.x fast matrix plus a manual exact-SHA full release gate across all 46 canonical smoke identities, six portable public skills are exact while two repository-only skills remain behaviorally excluded, startup tracked-index and test-family guidance is semantically enforced, the canonical test CI skill audit template has six one-to-one evidence lanes with fork-readiness proof, all eleven scoped spike task and test nodes are done with checkpoint evidence, approved changes are committed locally on main, and no push tag publish deploy provider selected-goal or existing-consumer mutation occurs.
scope_refs: [spike-33, task-811, test-470, task-812, test-471, task-805, test-465, task-806, test-466, task-813, test-472]
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-check, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [git status --short --branch, accepted measured CI topology decision derived from root:prop-9, focused smoke-topology and structured workflow tests, focused portable-skill policy projection and fresh-init tests, mdkg skill list --json, mdkg skill validate --json, focused startup tracked-index and test-family semantic tests, canonical template fork plan next and concise-pack proof, one npm run ci:release, one optimized npm run prepublishOnly, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, mdkg goal next root:goal-78 --json after root:test-469 and root:test-464, mdkg goal evaluate root:goal-78 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [ci, skills, harness, templates, local-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-464]
blocks: []
refs: [goal-77, loop-7, prop-9, dec-19, dec-85, dec-89, chk-544, chk-545, chk-546, bug-4, test-469, test-464]
context_refs: [goal-77, loop-7, prop-9, dec-19, dec-85, dec-89, chk-544, chk-545, chk-546, bug-4, test-469, test-464]
evidence_refs: [chk-544, chk-545, chk-546]
aliases: [governed-ci-skill-harness-hardening]
skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-check, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-07-25
updated: 2026-07-25
---
# Objective

Turn Goal 1's measured local release foundation into governed CI topology,
portable and enforceable skill projections, trustworthy agent/contributor/test
guidance, and a reusable six-lane audit template.

# End Condition

The frontmatter condition is satisfied with an accepted measured CI decision,
all eleven scoped nodes done, one final goal-closeout checkpoint, approved
local commits on `main`, unchanged selected `root:goal-73`, and no external
publication or provider mutation.

# Non-Goals

- No CI-provider/API execution claim, branch-protection change, secret,
  credential, deployment, package publication, tag, push, force update, or
  history rewrite.
- No npm-workspace migration or dependency-topology redesign.
- No forced update of existing initialized consumer repositories.
- No website, homepage, launch narrative, product positioning, or unrelated
  docs release work.
- No reopening or mutation of completed `root:loop-7`.
- No archive compression, bundle refresh, or stale-subgraph remediation.

# Recursive Algorithm

1. Keep this goal paused until `root:goal-77` is achieved and
   `root:test-464` is done.
2. Confirm `root:bug-4`/`root:test-469` make explicit goal routing respect
   blockers and chain-first ordering before relying on `goal next`.
3. Bind Goal 1 timing, profile, artifact, and coverage receipts to
   `root:prop-9`; accept a durable CI-topology decision before workflow edits.
4. Implement and prove the source-owned fast/full CI topology locally without
   claiming remote execution.
5. Reconcile portable skill bodies, then implement exact/excluded policy and
   fresh-init enforcement.
6. Correct startup, tracked-index, and test-family guidance after the final
   skill projection semantics are stable.
7. Align the canonical audit template to six evidence lanes and prove
   disposable fork readiness.
8. Continue another independent lane when one lane is non-globally blocked.
9. Run the shared local integration ladder, checkpoint evidence, evaluate, and
   close only when the goal condition is supported.

# Required Skills

- `select-work-and-ground-context`
- `pursue-mdkg-goal`
- `build-pack-and-execute-task`
- `service-boundary-ownership-check`
- `author-mdkg-skill`
- `verify-close-and-checkpoint`

# Required Checks

- Accepted measured risk-tier topology decision and source-owned manifest
  parity.
- Structured workflow/runtime/shard/artifact/drift contract tests.
- Canonical, configured-mirror, public-source, built-seed, and fresh-init skill
  policy proof.
- Startup-order, Git index-tracking, and dynamic test-family semantic tests.
- Canonical template frontmatter/body identity, fork, loop plan, loop next, and
  concise-pack proof.
- One `npm run ci:release` and one optimized `npm run prepublishOnly`.
- Changed-only and bounded full mdkg validation plus `git diff --check`.
- Explicit-QID goal show, next, evaluate, and conditional done behavior.
- Selected-goal, staged-path, local-commit, no-push, no-provider, and
  no-publication proof.

# Acceptance Criteria

- `root:spike-33` closes with an accepted measured CI-topology decision.
- Fast CI covers Node `24.15.0` and `24.x`; the manual exact-SHA full tier uses
  the minimum supported runtime and all 46 canonical smoke identities.
- Local source tests validate CI semantics without claiming a provider run.
- The exact public catalog has six members; release and service-boundary skills
  are absent publicly and present in canonical configured mirrors.
- Public bodies contain no package-release authority or dangling
  repository-specific references.
- Existing customized consumer repositories remain unchanged.
- Guidance and template contracts have focused semantic regression tests.
- All three lanes have separate test-proof evidence and one shared goal
  closeout receipt.

# Definition Of Done

- Goal condition is achieved.
- Required checks have durable spike, decision, task, test, and checkpoint
  evidence.
- A final goal-closeout checkpoint is referenced from the goal.
- Every local commit has an exact staged-path review.
- Nothing is pushed, tagged, published, deployed, or mutated through a
  provider.

# Stop Conditions

- Do not activate this goal before Goal 1 is achieved.
- Stop CI implementation until the measured topology decision is accepted.
- Stop public projection if a body is not yet portable or the declared catalog
  cannot be proven exactly.
- Stop on provider calls, selected-goal drift, forced consumer overwrites,
  unrelated paths, overlapping writer ownership, or an unapproved authority
  expansion.
- Keep the whole goal open while another authorized lane remains actionable.

# Current State

Paused and unselected. Every lane head is blocked by `root:test-464`, the final
Goal 1 proof. The current Goal 1 `root:bug-4` records that `goal next` does not
yet honor blockers or configured chain-first routing, so current Goal 2
selection output is not a readiness receipt.

Changed-only validation was clean before planning. Bounded full validation had
zero errors and the two pre-existing stale-subgraph warnings intentionally
deferred outside both goals.

# Iteration Log

- 2026-07-25: Planned as the governed successor to `root:goal-77`, with CI,
  skill/harness, and template lanes separated by ownership and verification.
- 2026-07-25: `root:chk-546` records exact explicit scope, the Goal 1
  dependency, validation receipts, and the local-only handoff boundary.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
