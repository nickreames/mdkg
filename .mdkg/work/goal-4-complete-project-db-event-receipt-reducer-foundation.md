---
id: goal-4
type: goal
title: Complete project DB event receipt reducer foundation
status: done
priority: 1
goal_state: achieved
goal_condition: Complete epic-32's local project DB event, receipt, reducer, and writer lease foundation with internal helpers, deterministic tests, packed db-events smoke coverage, docs, and non-publish prepublish readiness.
scope_refs: [epic-32]
last_active_node: task-187
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate, npm run smoke:db, npm run smoke:db-queue, npm run smoke:db-snapshot, npm run smoke:db-events, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [project-db, events, receipts, reducers, goal, pre-v1]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-31, epic-33, task-193, task-248]
blocked_by: []
blocks: [task-187, task-188, task-189, task-190, task-248]
refs: [edd-12, edd-13]
aliases: []
skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Objective

Implement the next mdkg project DB foundation layer after `0.1.8`: durable
local events, receipt rows plus reviewable artifacts, typed reducer write
policy, writer leases with snapshot-hash compare-and-swap, and packed E2E proof
up to dry-run prepublish checks.

# End Condition

`epic-32` has a tested internal event/receipt/reducer foundation with mdkg-owned
project DB migrations, internal helpers, deterministic unit coverage, packed
temp-repo `smoke:db-events` coverage, docs/release-gate updates, and non-publish
package dry-runs. Queue-backed materializer workers remain deferred until this
foundation is complete.

# Non-Goals

- Consumer repo upgrades.
- Public `mdkg db event`, `mdkg db reducer`, `mdkg db lease`, or
  `mdkg db queue` commands.
- Arbitrary agent SQL writes.
- Hosted event store or hosted queue dependencies.
- Worker/materializer implementation before event, receipt, reducer, and
  lease/CAS contracts are stable.
- Real npm publish, tag, or push.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

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
- `npm run smoke:db-queue`
- `npm run smoke:db-snapshot`
- `npm run smoke:db-events`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- Built-in project DB migrations are ordered, idempotent, and create event,
  receipt, and writer lease tables after the existing queue migration.
- Event helpers store durable local event envelopes with idempotency,
  deterministic payload hashes, duplicate handling, and conflict receipts.
- Receipt helpers store queryable SQLite rows and deterministic JSON artifacts
  under `.mdkg/db/receipts`.
- Typed reducer helpers apply short deterministic writes and produce receipts;
  arbitrary SQL is not exposed through public CLI.
- Writer lease helpers support project/branch leases, base snapshot hashes,
  snapshot-hash compare-and-swap commits, and conflict receipts.
- Packed smoke proves the installed package can exercise events, receipts,
  reducers, writer leases, snapshots, stats, index, validate, and ignore policy
  in a fresh temp repo.
- Prepublish gates include `smoke:db-events` and publish readiness assertions
  without a real publish.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

`mdkg@0.1.8` is published and globally installed. The local queue foundation is
complete under `goal-3`; queue rows are delivery state, not durable event
history. General work selection points at `task-187`. Source should move to
`0.1.9 - Unreleased` for this implementation goal. No consumer repo edits,
real npm publish, tag, or push are included.

# Iteration Log

- 2026-06-04: Created goal from the post-`0.1.8` project DB event/reducer plan;
  selected `task-187` as the active first node.
- 2026-06-04: Implemented the internal event, receipt, reducer, and writer
  lease/CAS foundation, added packed `smoke:db-events`, wired it into
  `prepublishOnly`, and completed dry-run package/publish proof without a real
  publish.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Source moved to `0.1.9` with the new internal helper module
  `src/core/project_db_events.ts`.
- Built-in project DB migrations now include
  `mdkg.project_db.events_receipts.v1` and
  `mdkg.project_db.writer_leases.v1` after the queue migration.
- Unit coverage proves event idempotency, conflicting idempotency receipts,
  rejected reducer events, deterministic reducer writes/replay, writer lease
  ownership validation, lease expiry, and snapshot-hash CAS conflict receipts.
- Packed E2E `scripts/smoke-db-events.js` installs the package into a temp
  prefix, initializes a fresh repo, exercises packaged internal event/receipt/
  reducer/lease helpers, runs DB verify/stats plus snapshot seal/verify/dump/
  diff, and validates index/ignore policy.
- Required checks passed:
  - `npm run build`
  - `npm run test` (407 passing)
  - `npm run cli:check`
  - `node dist/cli.js validate`
  - `npm run smoke:db`
  - `npm run smoke:db-queue`
  - `npm run smoke:db-events`
  - `npm run smoke:db-snapshot`
  - `node scripts/assert-publish-ready.js`
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
  - `git diff --check`
- `npm publish --dry-run` completed `prepublishOnly`, showed package
  `mdkg@0.1.9`, and ended with `+ mdkg@0.1.9` in dry-run mode only.
- No real `npm publish`, tag, push, or consumer repo mutation was performed.
