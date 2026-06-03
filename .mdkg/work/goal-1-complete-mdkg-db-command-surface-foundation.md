---
id: goal-1
type: goal
title: Complete mdkg db command surface foundation
status: todo
priority: 1
goal_state: active
goal_condition: Complete epic-30 so mdkg has a validated, documented, prepublish-ready db command foundation that clearly separates rebuildable index caches from project application databases.
scope_refs: [epic-30]
active_node: task-227
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate, smoke tests for changed db behavior, node scripts/assert-publish-ready.js, npm pack dry-run, npm publish dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [project-db, goal, pre-v1]
owners: []
links: []
artifacts: []
relates: [epic-30]
blocked_by: []
blocks: []
refs: [edd-12]
aliases: [db-foundation-goal, mdkg-db-goal]
skills: [pursue-mdkg-goal]
created: 2026-06-02
updated: 2026-06-02
---
# Objective

Complete the mdkg DB command-surface foundation as a scoped, recursive goal.
The work should move one concrete node at a time through the granular
implementation tasks under `epic-30`, preserving the distinction between
`.mdkg/index` as a rebuildable graph cache and `.mdkg/db` as future project
application state.

# End Condition

`epic-30` is complete with source, docs, tests, temp-repo proof, and prepublish
dry-run evidence for the first `mdkg db ...` foundation slice. `mdkg index`
remains a compatibility shortcut, active runtime/WAL state is not committed by
default, and project DB semantics do not collide with existing SQLite index
cache behavior.

# Non-Goals

- No real npm publish.
- No arbitrary agent SQL write path.
- No hosted queue or external database requirement.
- No Rust sidecar implementation.
- No embeddings or vector database work.

# Recursive Algorithm

1. Run `mdkg goal current` and `mdkg goal next` to select exactly one scoped
   actionable node.
2. Pack the selected node with `mdkg pack <id> --profile concise --dry-run
   --stats`, then inspect any source/docs/tests it names.
3. Implement only the selected node's scope. If requirements are missing, create
   or update mdkg nodes with evidence before coding.
4. Run the selected node's checks plus the goal required checks that apply to
   the changed surface.
5. Record evidence on the active node, close it when complete, evaluate this
   goal, then repeat until the end condition is achieved or a stop condition is
   reached.

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
- relevant smoke tests for DB/index/cache behavior
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `mdkg db` taxonomy is implemented and documented without removing `mdkg index`.
- `.mdkg/db/{schema,runtime,state,receipts}` layout and ignore policy are
  implemented or explicitly scoped for the release slice.
- Project DB config, migration, verify, and stats behavior is implemented or
  represented by clear follow-up nodes when intentionally deferred.
- Fresh temp repos prove the DB foundation behavior and legacy index workflows
  still work.
- Changelog, README, command matrix, generated init docs, and help snapshots are
  aligned.

# Definition Of Done

- `task-181` through `task-184` are closed with evidence.
- `epic-30` is closed with a checkpoint or completion evidence.
- Required checks have pass/fail evidence.
- The package is prepublish-ready, but not published.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- The design would require changing the durable truth model without user
  approval.
- A release blocker is found that belongs outside `epic-30`.

# Current State

Subgraph orchestration and sync/materialization work is complete and committed.
`task-181` through `task-184` are broad decomposition tasks. The next
implementation pass should start with the first granular task under `epic-30`.

# Iteration Log

- 2026-06-02: Created the DB foundation goal after committing subgraph
  sync/materialization work.
- 2026-06-03: Added `edd-12` and split broad `epic-30` planning work into
  granular implementation tasks before source changes.

# Skill Improvement Candidates

- Consider adding DB-specific guidance to `pursue-mdkg-goal` only after the
  first DB implementation pass exposes repeatable workflow gaps.

# Completion Evidence

- Pending.
