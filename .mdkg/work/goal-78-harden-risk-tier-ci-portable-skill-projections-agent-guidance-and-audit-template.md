---
id: goal-78
type: goal
title: Harden risk-tier CI portable skill projections agent guidance and audit templates
status: todo
priority: 1
goal_state: paused
goal_condition: Goal 78 is achieved after Goal 77 and its goal-next fix are complete, measured local release receipts are bound to an accepted risk-tier CI decision, a source-owned smoke topology drives a Node 24.15.0 and 24.x fast matrix plus a manual exact-SHA full release gate across all 46 canonical smoke identities, six portable public skills are exact while two repository-only skills remain behaviorally excluded, startup tracked-index and test-family guidance is semantically enforced, the canonical test CI skill audit template has six one-to-one evidence lanes with fork-readiness proof, all eleven scoped spike task and test nodes are done with checkpoint evidence, approved changes are committed locally on main, and no push tag publish deploy provider selected-goal or existing-consumer mutation occurs.
scope_refs: [spike-33, task-811, test-470, task-812, test-471, task-805, test-465, task-806, test-466, task-813, test-472]
active_node: task-806
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-check, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [git status --short --branch, accepted measured CI topology decision derived from root:prop-9, focused smoke-topology and structured workflow tests, focused portable-skill policy projection and fresh-init tests, mdkg skill list --json, mdkg skill validate --json, focused startup tracked-index and test-family semantic tests, canonical template fork plan next and concise-pack proof, exactly one shared npm run ci:release at goal closeout, exactly one shared optimized npm run prepublishOnly at goal closeout, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, mdkg goal next root:goal-78 --json, mdkg goal evaluate root:goal-78 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [ci, skills, harness, templates, local-only]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-78/ci-topology-measurements.json, .mdkg/artifacts/goal-78/ci-topology-plan.json, .mdkg/artifacts/goal-78/ci-topology-verification.json, .mdkg/artifacts/goal-78/portable-skill-body-verification.json, .mdkg/artifacts/goal-78/public-skill-projection-verification.json]
relates: []
blocked_by: [test-464]
blocks: []
refs: [goal-77, loop-7, prop-9, dec-19, dec-85, dec-89, dec-91, chk-544, chk-545, chk-546, chk-549, chk-550, chk-551, chk-552, chk-553, chk-554, chk-555, chk-556, bug-4, test-469, test-464]
context_refs: [goal-77, loop-7, prop-9, dec-19, dec-85, dec-89, dec-91, chk-544, chk-545, chk-546, chk-549, chk-550, chk-551, chk-552, chk-553, chk-554, chk-555, chk-556, bug-4, test-469, test-464]
evidence_refs: [chk-544, chk-545, chk-546, chk-549, chk-550, chk-551, chk-552, chk-553, chk-554, chk-555, chk-556]
aliases: [governed-ci-skill-harness-hardening]
skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-check, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-07-25
updated: 2026-07-26
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
3. Use
   `.mdkg/artifacts/goal-78/ci-topology-measurements.json` to bind Goal 1
   timing, profile, artifact, and coverage receipts to `root:prop-9`; accept a
   durable CI-topology decision before workflow edits.
4. Implement and prove the source-owned fast/full CI topology locally without
   claiming remote execution.
5. Reconcile portable skill bodies, then implement exact/excluded policy and
   fresh-init enforcement.
6. Correct startup, tracked-index, and test-family guidance after the final
   skill projection semantics are stable.
7. Align the canonical audit template to six evidence lanes and prove
   disposable fork readiness.
8. Continue another independent lane when one lane is non-globally blocked.
9. After the five lane-specific tests are done, run exactly one shared
   `ci:release` and one shared optimized `prepublishOnly`; do not retry either
   automatically. Bind their receipts to the final goal-closeout checkpoint,
   evaluate, and close only when the goal condition is supported.

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
- Exactly one shared `npm run ci:release` and one shared optimized
  `npm run prepublishOnly`, both owned by final goal closeout rather than any
  lane-specific test.
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
- The four implementation lanes—CI topology, portable skill projection,
  guidance, and canonical template—are complete.
- The five scoped test nodes have separate focused test-proof evidence, and
  the goal has one shared integration closeout receipt.

# Definition Of Done

- Goal condition is achieved.
- Required checks have durable spike, decision, task, test, and checkpoint
  evidence.
- A final goal-closeout checkpoint is referenced from the goal.
- Every local commit has an exact staged-path review.
- Nothing is pushed, tagged, published, deployed, or mutated through a
  provider.

# Stop Conditions

- Do not activate this goal until this planning contract is validation-clean
  and its readiness checkpoint is linked.
- Stop CI implementation until the measured topology decision is accepted.
- Stop public projection if a body is not yet portable or the declared catalog
  cannot be proven exactly.
- Stop on provider calls, selected-goal drift, forced consumer overwrites,
  unrelated paths, overlapping writer ownership, or an unapproved authority
  expansion.
- Keep the whole goal open while another authorized lane remains actionable.

# Current State

Paused and unselected. Goal 77 is achieved; `root:bug-4`, `root:test-469`, and
`root:test-464` are done. Explicit `mdkg goal next root:goal-78 --json` now
selects the grounding `root:spike-33` without routing warnings.

The durable measurement artifact summarizes Goal 77's Node 24 release,
coverage, package, build-amplification, and 47-alias/46-canonical-smoke
receipts. `root:spike-33` converted them into accepted `root:dec-91` and the
machine-readable five-shard topology plan. `root:task-811` and `root:test-470`
implemented and locally verified the manifest-owned workflow projection,
exact-SHA gate, and hash-bound full-run context. Provider execution and exact
Node `24.15.0` execution remain explicitly unclaimed.

Lane priorities deliberately preserve chain-first execution: priority 1 CI,
priority 2 portable skills/projection, priority 3 guidance, and priority 4
canonical template. If the active lane becomes locally blocked, the next
independent authorized lane remains available.

Changed-only validation is clean. Bounded full validation has zero errors and
only the two pre-existing stale-subgraph warnings intentionally deferred
outside this goal.

# Iteration Log

- 2026-07-25: Planned as the governed successor to `root:goal-77`, with CI,
  skill/harness, and template lanes separated by ownership and verification.
- 2026-07-25: `root:chk-546` records exact explicit scope, the Goal 1
  dependency, validation receipts, and the local-only handoff boundary.
- 2026-07-26: Refreshed the successor contract after Goal 77 closeout, made
  four-lane sequencing explicit, preserved compact measurement inputs, and
  assigned the expensive integration ladder exactly once at goal closeout.
- 2026-07-26: `root:chk-552` records the validation-clean mdkg-only readiness
  handoff. The goal remains paused and unselected pending explicit activation.
- 2026-07-26: Claimed `root:spike-33` without changing selected-goal state and
  accepted measured topology Decision 91 for 13 fast smokes and five full
  exact-SHA shards.
- 2026-07-26: Completed `root:task-811` and `root:test-470`; `root:chk-554`
  binds the local source, negative-fixture, immutable-context, and Git-boundary
  proof. Advanced the explicit cursor to portable-skill reconciliation without
  mutating selected-goal state or running the shared final ladders.
- 2026-07-26: Completed portable-body reconciliation and verification in
  `root:task-812`/`root:test-471`. `root:chk-555` binds exact canonical,
  configured-mirror, and six-member public-source hashes plus behavioral
  release isolation; built/fresh-init enforcement is next in `root:task-805`.
- 2026-07-26: Completed `root:task-805`/`root:test-465`. `root:chk-556`
  records exact six-surface hashes, two behavioral exclusions, reusable
  build/init/validation/readiness enforcement, negative fixtures, and
  customized-consumer preservation. Advanced to guidance hardening.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
