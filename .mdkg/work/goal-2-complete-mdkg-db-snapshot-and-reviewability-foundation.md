---
id: goal-2
type: goal
title: Complete mdkg db snapshot and reviewability foundation
status: done
priority: 1
goal_state: achieved
goal_condition: Complete epic-31 so mdkg has validated, documented, prepublish-ready sealed snapshot, manifest, canonical dump, and snapshot diff foundations for project DB state.
scope_refs: [epic-31]
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate, npm run smoke:db, npm run smoke:db-snapshot, node scripts/assert-publish-ready.js, npm pack dry-run, npm publish dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [project-db, snapshot, goal, pre-v1]
owners: []
links: []
artifacts: []
relates: [epic-31, epic-30, epic-34]
blocked_by: []
blocks: []
refs: [edd-13, edd-12]
aliases: [db-snapshot-goal, project-db-snapshot-goal]
skills: [pursue-mdkg-goal]
created: 2026-06-03
updated: 2026-06-03
---

# Objective

Complete the project DB sealed snapshot and reviewability foundation as a
scoped mdkg goal. The work should move through granular `epic-31`
implementation tasks and preserve the boundary between active runtime state,
sealed checkpoint state, and review-only canonical dumps.

# End Condition

`epic-31` is complete with source, docs, tests, temp-repo proof, and prepublish
dry-run evidence for `mdkg db snapshot seal|verify|status|dump|diff`.

# Non-Goals

- No real npm publish.
- No project DB profile implementation.
- No event store, reducer, queue, worker lease, or Rust sidecar implementation.
- No arbitrary agent SQL command.
- No profile-level PII redaction beyond basic safety language.

# Recursive Algorithm

1. Run `mdkg goal current` and `mdkg goal next` to select one scoped task.
2. Pack the selected node and inspect its linked design/source context.
3. Implement only that task's scope.
4. Run relevant checks and record evidence on the task.
5. Evaluate this goal and repeat until the end condition is achieved.

# Required Skills

- `pursue-mdkg-goal`
- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:db`
- `npm run smoke:db-snapshot`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `mdkg db snapshot seal|verify|status|dump|diff` is implemented and
  documented.
- Sealed snapshots and manifests are deterministic enough for integrity
  verification and explicit review.
- Canonical dumps and diffs are stable review aids, not new truth.
- Active runtime DB/WAL files remain ignored and sealed snapshots remain opt-in.
- Existing `mdkg db init/migrate/verify/stats` and `mdkg db index ...` behavior
  remains unchanged.

# Definition Of Done

- `task-185`, `task-186`, and `task-192` are closed as decomposition work.
- `task-235` through `task-243` are complete.
- `epic-31` is closed with completion evidence.
- Required checks have pass/fail evidence.
- The package is prepublish-ready, but not published.

# Stop Conditions

- Required snapshot behavior would require profile-level redaction policy before
  implementation.
- Snapshot sealing would mutate child/subgraph repositories.
- Required permissions or Node `node:sqlite` support are missing.

# Current State

`goal-1`, `epic-30`, and `epic-31` are complete. The project DB foundation now
has sealed snapshot, manifest, canonical dump, and snapshot diff support.

# Iteration Log

- 2026-06-03: Created goal and decomposition plan for `epic-31`.
- 2026-06-03: Completed `task-235` through `task-243`, including source,
  docs, unit tests, packed temp-repo snapshot smoke, and dry-run publish gate.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- 2026-06-03: Implemented `mdkg db snapshot seal|verify|status|dump|diff`.
- 2026-06-03: `npm run test` passed with 405 tests.
- 2026-06-03: `npm run cli:check`, `node dist/cli.js validate`,
  `npm run smoke:db`, `npm run smoke:db-snapshot`,
  `node scripts/assert-publish-ready.js`, and `git diff --check` passed.
- 2026-06-03: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack
  --dry-run --json` passed and showed `mdkg-0.1.7.tgz`.
- 2026-06-03: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish
  --dry-run` passed with `+ mdkg@0.1.7`; no real publish occurred.
