---
id: task-246
type: task
title: add queue unit tests and packed smoke
status: done
priority: 1
epic: epic-33
parent: goal-3
tags: [project-db, queue, tests, smoke]
owners: []
links: []
artifacts: [tests/commands/db_index.test.ts, scripts/smoke-db-queue.js, package.json]
relates: [goal-3, epic-33, task-244]
blocked_by: [task-244]
blocks: [task-245]
refs: [rule-6]
aliases: [db-queue-smoke]
skills: [build-pack-and-execute-task]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Add deterministic unit coverage and packed temp-repo smoke coverage for the
internal node:sqlite queue foundation.

# Acceptance Criteria

- Tests prove migration idempotency, dedupe, deterministic claim ordering,
  wrong-worker ack/fail rejection, expired lease reclaim, retry delay, max
  attempt dead-letter, and queue table visibility in `db stats`.
- `scripts/smoke-db-queue.js` packs and installs mdkg into a temp prefix and
  exercises the packaged queue helper from a fresh temp repo.

# Files Affected

List files/directories expected to change.

- `tests/commands/db_index.test.ts`
- `scripts/smoke-db-queue.js`
- `package.json`

# Implementation Notes

- Smoke should require the packaged compiled helper, not local TypeScript.
- Smoke should run `db verify`, `db stats`, `index`, and `validate`.

# Test Plan

- `npm run test`
- `npm run smoke:db-queue`

# Links / Artifacts

- `goal-3`
- `task-244`
- `task-245`
