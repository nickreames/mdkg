---
id: goal-5
type: goal
title: Complete project DB materializer and profile readiness roadmap
status: done
priority: 1
goal_state: achieved
goal_condition: Complete the project DB materializer readiness path by consolidating achieved 0.1.9 DB foundations, routing active work through the queue-backed materializer design, and leaving profile/export work clearly deferred behind explicit gates.
scope_refs: [epic-29, epic-33, epic-34]
last_active_node: task-193
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate, npm run smoke:db, npm run smoke:db-queue, npm run smoke:db-events, npm run smoke:db-snapshot, npm run smoke:db-materializer, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [project-db, materializer, profiles, goal, pre-v1]
owners: []
links: []
artifacts: []
relates: [epic-20, epic-30, epic-31, epic-32, epic-33, epic-34, task-191, task-193, task-232, task-233, task-234]
blocked_by: []
blocks: [task-249, test-85, task-191, task-250, task-251, test-86, task-193, task-232, task-233, task-234, test-87]
refs: [goal-1, goal-2, goal-3, goal-4]
aliases: []
skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Objective

Keep project DB work in one active mdkg goal after the 0.1.9 release. The goal
first aligns completed foundation nodes, then routes the next implementation
slice through the queue-backed materializer pattern and later profile/export
readiness gates.

# End Condition

The goal is achieved when materializer design, implementation, packed smoke
coverage, and profile deferral gates are complete through dry-run prepublish
checks, with no real publish, tag, or push unless separately requested.

# Non-Goals

- No source, script, package, docs, publish, tag, or push work during the initial
  alignment pass.
- No public queue, event, reducer, lease, or materializer CLI unless a later
  task explicitly scopes it.
- No profile implementation before profile contract and privacy/export gates are
  closed.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- pursue-mdkg-goal
- select-work-and-ground-context
- build-pack-and-execute-task
- verify-close-and-checkpoint

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- node dist/cli.js validate
- npm run smoke:db
- npm run smoke:db-queue
- npm run smoke:db-events
- npm run smoke:db-snapshot
- npm run smoke:db-materializer
- node scripts/assert-publish-ready.js
- npm pack --dry-run --json
- npm publish --dry-run
- git diff --check

# Acceptance Criteria

- Achieved project DB foundation goals and epics no longer appear as active work.
- `mdkg goal current` and `mdkg goal next goal-5` route to one concrete next
  node.
- `task-191` is the first functional node after alignment closeout.
- Materializer and profile/export follow-up tasks and tests are explicit and
  blocked in the intended order.

# Definition Of Done

- Alignment task and graph-selection test are closed with evidence.
- Materializer and profile readiness work items are either done or intentionally
  deferred behind live blockers.
- Required checks have evidence before goal closeout.
- Completion evidence is recorded in this goal.

# Stop Conditions

- A required project DB graph node cannot be reconciled without changing
  functional source.
- Required context or permissions are missing.
- A real npm publish, tag, or push would be required.
- Goal is blocked beyond the configured attempt limit.

# Current State

Alignment, materializer design, internal helper implementation, packed
materializer smoke/prepublish gate, profile contract, profile fixture design,
privacy/export gates, deferral test, and closeout proof are complete. The active
node is `task-193` for final closeout.

# Iteration Log

- 2026-06-04: Created after publishing `mdkg@0.1.9` so future project DB work
  has one active umbrella goal instead of multiple achieved foundation goals.
- Achieved foundation goals are retained as refs, not active traversal links,
  so `mdkg goal next goal-5` stays focused on actionable project DB work.
- Expanded `scope_refs` from only `epic-29` to `epic-29`, `epic-33`, and
  `epic-34` because goal validation requires the active materializer/profile
  nodes to be inside explicit goal scope.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `task-249` closed with checkpoint `chk-28`.
- `node dist/cli.js validate` passed after graph reindexing.
- `node dist/cli.js goal next goal-5 --json` routed to `task-191` before claim
  after achieved goals were moved from traversal `relates` to archival `refs`.
- `node dist/cli.js goal current --json` now shows selected `goal-5` with
  `active_node: task-191`.
- `node dist/cli.js goal next goal-5 --json` now returns `task-191` with no
  warnings.
- `node dist/cli.js goal claim goal-5 task-191 --json` succeeds after explicit
  project DB scope includes the materializer epic.
- `task-191`, `task-250`, `task-251`, and `test-86` completed the internal
  materializer foundation.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed
  through the full prepublish ladder including `smoke:db-materializer`; no real
  publish was performed.
- `task-232`, `task-233`, `task-234`, and `test-87` recorded the profile
  contract, future fixture/smoke shape, privacy/export gates, and deferral
  boundary without implementing profiles.
- `task-193` records the closeout proof and residual risks for future
  profile/materializer public CLI work.
