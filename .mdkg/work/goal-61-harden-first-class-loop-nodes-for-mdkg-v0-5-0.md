---
id: goal-61
type: goal
title: Harden first-class loop nodes for mdkg v0.5.0
status: done
priority: 1
goal_state: achieved
goal_condition: First-class loop behavior is release-candidate ready for mdkg v0.5.0 only after dry-run and read paths are observational, readiness evidence is identity-scoped, loop routing exhausts authorized work before blocking, stale forks and descriptors are truthful, packaged SQLite smoke and CI gates pass, historical evidence is repaired, and corrected security and backend audit dogfood loops meet their definitions of done.
scope_refs: [epic-225, epic-226, epic-227, epic-228, task-702, task-703, task-704, task-705, task-706, task-707, task-708, task-709, task-726, task-727, test-375, test-376, test-377, test-378, test-379, test-380, test-381, test-382, test-397, test-398]
last_active_node: task-709
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, pursue-mdkg-loop, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, npm run smoke:loop, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, node dist/cli.js goal show goal-61 --json, node dist/cli.js goal next goal-61 --json, node dist/cli.js pack task-702 --pack-profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [loop, hardening, release, 0.5.0]
owners: []
links: []
artifacts: [chk-426, npm run ci:release passed on Node 24.16.0 and Node 26.0.0]
relates: [goal-58, goal-59]
blocked_by: []
blocks: []
refs: [goal-58, goal-59, loop-1, loop-3, loop-4, loop-5, loop-6, prop-4, spike-30, spike-31]
context_refs: [goal-57, goal-58, goal-59, goal-60, edd-66, edd-69, dec-65, dec-66, loop-1, loop-3, loop-4, loop-5, loop-6, prop-4, prop-5, spike-30, spike-31, task-688, task-689, edd-70, dec-67]
evidence_refs: [chk-409, chk-410, chk-411, chk-412, chk-413, chk-414, chk-417, chk-419, chk-420, chk-421, chk-422, chk-423, chk-424, chk-425, chk-426]
aliases: [v0-5-0-loop-hardening]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, pursue-mdkg-loop, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-10
---
# Objective

Eliminate the correctness and release-readiness gaps exposed by first-class loop
implementation and dogfooding so the loop surface can ship as the central
capability of mdkg `v0.5.0`.

# End Condition

This goal is achieved only when:

- dry-run and read-only loop commands leave SQLite, JSON indexes, events, ID
  reservations, and repository files unchanged;
- readiness questions, approvals, evidence lanes, and waivers are satisfied
  only by matching typed evidence;
- `loop next` continues authorized child or blocker-recovery work and reports
  the loop blocked only when no useful authorized path remains;
- fork lineage detects stale templates without silently rewriting forks;
- descriptors, help, generated contracts, and actual side effects agree;
- installed-tarball SQLite smoke, all seven seeds, CI, and regression gates pass;
- corrected security and backend/API/CLI audit loops are executed to their high
  definitions of done; and
- a checkpoint records release-candidate evidence for Goal 2 and Goal 4.

# Non-Goals

- Do not bump `package.json` or `package-lock.json` to `0.5.0`.
- Do not finalize the `0.5.0` changelog or publish, push, tag, deploy, or replace
  the global installation.
- Do not redesign generic CLI families tracked by `goal-60`.
- Do not add CocoIndex, semantic search, runtime execution, model routing, or
  separate `loop_template` and `loop_run` node types.

# Recursive Algorithm

1. Start with `task-702` and prove the SQLite/JSON dry-run failure before fixing
   allocation or persistence behavior.
2. Complete read-path purity, readiness identity, continuation, provenance, and
   descriptor work in dependency order.
3. Add installed-package smoke and CI before relying on source-checkout tests.
4. Repair inaccurate historical completion evidence without deleting failed
   dogfood records.
5. Fork and pursue corrected read-only security and backend/API/CLI audit loops
   with `pursue-mdkg-loop` until required lanes are complete or explicitly
   waived through typed decisions and approvals.
6. Run all required checks, checkpoint the release-candidate evidence, and
   evaluate the goal.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `build-pack-and-execute-task`
- `pursue-mdkg-loop`
- `verify-close-and-checkpoint`

# Required Checks

- Full package, CLI contract, docs, graph, loop smoke, installed-tarball, and CI
  gates listed in frontmatter.
- State snapshots proving dry-run and read-only commands are non-mutating.
- Completed corrected dogfood loop evidence.

# Acceptance Criteria

- `task-702` through `task-709`, `task-726`, `task-727`, `test-375` through
  `test-382`, `test-397`, and `test-398` close with concrete evidence.
- Public loop JSON changes are additive or explicitly compatibility-tested.
- Existing goals and Omni semantic files retain their behavior.
- `goal-60` and `goal-53` remain separate and inactive.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Work starts changing generic CLI behavior beyond what loop correctness needs.
- A proposed fix would make dry-run reserve durable IDs or hide stale lineage.
- Publishing, pushing, deployment, version bumps, or public-site copy changes
  are attempted from this goal.

# Current State

Active at `task-726`. Core loop hardening and installed-package release gates
are passing. Fresh dogfood validated a graph-target symlink escape and unbounded
ZIP inflation that must be fixed before the release candidate can close; the
backend modularity recommendation is preserved separately for `goal-60`.

# Iteration Log

- 2026-07-10: Created from the post-`goal-59` read-only release audit and made
  the first active lane in the v0.5.0 release program.
- 2026-07-10: Fresh `loop-5` and `loop-6` dogfood completed local audit lanes.
  Added the validated graph-target and ZIP hardening work to release scope while
  keeping loop-module decomposition as future `goal-60` planning.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Authoritative release-candidate receipt: `chk-426`.
- Both Node 24.16.0 and Node 26.0.0 passed `npm run ci:release` with 577/577
  tests, CLI parity, command-contract and docs checks, installed seven-template
  SQLite loop smoke, and publish readiness.
- Full, changed-only, and summary graph validation passed with 0 warnings and 0
  errors; `git diff --check` passed.
- `loop-5` and `loop-6` are done with current provenance, no invalid
  bindings, and machine-readable closeout readiness.
- `chk-417` and `chk-419` prove the two audit-derived security fixes.
- The package remains `0.4.2`; version/changelog mutation, external scanning,
  publish, push, deploy, and global replacement remain owned by `goal-64`.
