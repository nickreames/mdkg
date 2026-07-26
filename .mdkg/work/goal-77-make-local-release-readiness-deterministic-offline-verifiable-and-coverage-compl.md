---
id: goal-77
type: goal
title: Make local release readiness deterministic offline-verifiable and coverage-complete
status: todo
priority: 1
goal_state: paused
goal_condition: Goal 77 is achieved when goal next honors local blockers and configured chain-first routing, root docs and mdkg-dev dependency ownership is explicit, no smoke performs a hidden install, one post-bootstrap network-closed prepublish run maps all 47 aliases to 46 canonical executions, one immutable package tarball is reused, profile-aware build bounds and the 60-minute budget are met, publishable-runtime coverage executes the complete test contract and enforces evidence-backed non-regressing thresholds exactly once before publication, ci:release remains green, all eight scoped bug task and test nodes are done with checkpoint evidence, approved changes are committed locally on main, and no push tag publish deploy provider or selected-goal mutation occurs.
scope_refs: [bug-4, test-469, task-810, test-468, task-803, test-463, task-804, test-464]
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, focused goal-next blocker chain and CLI-MCP parity tests, explicit root docs and mdkg-dev dependency preflight, focused bootstrap and offline-boundary tests, focused smoke-manifest artifact-reuse and build-counter tests, one bounded offline npm run prepublishOnly, one npm run ci:release, complete scoped coverage with raw V8 manifest and concise JSON summary, mdkg skill validate --json, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, mdkg goal evaluate root:goal-77 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, prepublish, coverage, local-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [loop-7, task-802, test-462, chk-544, chk-545, chk-546, dec-6, dec-85, dec-86, dec-87, dec-88, bug-4, test-469]
context_refs: [loop-7, task-802, test-462, chk-544, chk-545, chk-546, dec-6, dec-85, dec-86, dec-87, dec-88, bug-4, test-469]
evidence_refs: [chk-545, chk-546]
aliases: [deterministic-local-release-readiness]
skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-25
updated: 2026-07-25
---
# Objective

Make the local publication-readiness ladder explicit, deterministic,
network-closed after bootstrap, bounded in repeated work, and protected by a
stable production coverage contract.

# End Condition

The frontmatter condition is satisfied with all eight scoped nodes done, current
Node 24 receipts, a final goal-closeout checkpoint, locally committed approved
paths on `main`, unchanged selected `root:goal-73`, and no remote or publication
action.

# Non-Goals

- No checked-in CI workflow, provider setting, branch-protection, or remote-run
  change.
- No skill, managed mirror, public seed, startup guidance, contributor
  guidance, canonical loop-template, website, or public-positioning change.
- No workspace migration or replacement of the three independent lockfiles.
- No package version, changelog, tag, registry publication, deployment, push,
  force update, or history rewrite.
- No refresh of tracked archive caches or subgraph bundles. The two existing
  stale-subgraph warnings are baseline context outside this goal.

# Recursive Algorithm

1. Use explicit `root:goal-77` commands and preserve selected achieved
   `root:goal-73`.
2. Assign one writer owner before claiming the next routed node.
3. Repair and prove goal-next blocker/chain routing before using the goal as the
   implementation router.
4. Complete dependency preflight and bootstrap proof next.
5. Complete smoke-manifest, reusable-artifact, and profile-build work.
6. Run the integrated network-closed prepublish proof and record its timing and
   counters.
7. Define the scoped coverage baseline, thresholds, evidence output, and
   exactly-once prepublish integration.
8. Continue another actionable lane when a non-global blocker occurs.
9. Record checkpoint evidence, validate the graph and Git boundary, evaluate
   the goal, and close only when the evidence supports the condition.

# Required Skills

- `select-work-and-ground-context`
- `pursue-mdkg-goal`
- `build-pack-and-execute-task`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- Dependency-tree preflight for root, docs, and mdkg-dev.
- Goal-next blocker/chain selection and CLI/MCP parity proof.
- Focused bootstrap, manifest, artifact-reuse, build-counter, coverage, and
  negative-fixture tests.
- One bounded post-bootstrap offline `npm run prepublishOnly`.
- One `npm run ci:release`.
- Raw V8 inventory, deterministic coverage summary, complete test-family
  discovery, and threshold-failure proof.
- Changed-only and bounded full mdkg validation plus `git diff --check`.
- Explicit-QID goal show, next, evaluate, and conditional done behavior.
- Selected-goal, staged-path, local-commit, no-push, and no-publication proof.

# Acceptance Criteria

- `root:bug-4` through `root:test-464` are done in the declared order.
- All 47 smoke aliases map to 46 canonical executions.
- One SHA-256-bound package artifact is reused across installed-package smokes.
- No verification-phase nested install or registry request occurs.
- Root builds are at most three; docs and marketing builds occur at most once
  per declared behavior profile.
- Scoped publishable-runtime thresholds are evidence-backed and cannot be
  silently lowered.
- Coverage runs exactly once in the local publication ladder.
- The complete ladder stays within 60 minutes on the accepted Node 24 runtime.
- No unauthorized tracked path changes.

# Definition Of Done

- Goal condition is achieved.
- Required checks have durable task, test, and checkpoint evidence.
- A final goal-closeout checkpoint is referenced by the goal.
- Exact staged paths are reviewed before each local commit.
- Nothing is pushed, tagged, published, deployed, or mutated through a
  provider.

# Stop Conditions

- Stop a lane when bootstrap would require unapproved network access.
- Stop coverage when the scoped baseline is below a provisional audit floor
  unless tests or a new accepted decision resolve it.
- Stop on selected-goal drift, unexpected tracked output, dependency-topology
  expansion, overlapping writer ownership, or an unapproved path.
- Keep the whole goal open while another authorized lane remains actionable.

# Current State

Paused and unselected. The separate P0 semantic publish-readiness repair is
complete in `root:task-802`, `root:test-462`, and `root:chk-545`. The first
routable node is `root:bug-4`, which records the live selector defect found
during this planning pass.

Changed-only validation was clean before planning. Bounded full validation had
zero errors and exactly two pre-existing stale-subgraph warnings for
`demo_agentic_coding` and `template_mdkg_dev`; those bundles are intentionally
outside scope.

# Iteration Log

- 2026-07-25: Planned as the first of two successor goals after confirming the
  Loop 7 audit and P0 repair were already completed and committed.
- 2026-07-25: Added a definition-blocking goal-next bug/test after live
  verification proved the selector ignores local blockers and the configured
  chain-first strategy.
- 2026-07-25: `root:chk-546` records the two-goal planning boundary, exact
  explicit scope, validation receipts, and local commit authority.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
