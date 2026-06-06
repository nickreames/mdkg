---
id: task-250
type: task
title: implement internal project db materializer helper
status: done
priority: 1
epic: epic-33
parent: goal-5
tags: [project-db, materializer, queue, events, implementation]
owners: []
links: []
artifacts: []
relates: [goal-5, epic-33, task-191, task-190]
blocked_by: []
blocks: [task-251, test-86]
refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Implement the internal project DB materializer helper after `task-191` defines
the worker pattern.

# Acceptance Criteria

- Helper consumes queue messages that reference project, branch, and event ids.
- Helper loads durable events, applies typed reducers, writes receipts, verifies
  state, seals snapshots, and uses writer lease/CAS semantics.
- Queue rows remain delivery state and are never treated as canonical history.
- Work is internal-only unless a later task explicitly scopes public CLI.

# Files Affected

- Future materializer helper source, docs, and tests.

# Implementation Notes

- Build on the shipped queue, event, receipt, reducer, writer lease, and
  snapshot helpers from `0.1.9`.
- Keep SQLite transactions short and avoid long-running worker work inside a
  transaction.
- Follow the `task-191` message contract:
  `kind: project-db.materialize`, `schema_version: 1`, `project_id`,
  `branch_id`, `event_id`, `reducer_name`, and `reducer_version`.
- Expose internal helpers only:
  `enqueueProjectDbMaterialization`, `runNextProjectDbMaterializer`, and
  `readProjectDbMaterializerStats`.
- Acknowledge the queue only after reducer application, snapshot seal, and
  writer lease commit all succeed.
- Use queue retry/dead-letter behavior for missing events and CAS conflicts;
  dead-letter invalid payloads immediately after writing a rejected receipt.

# Test Plan

- Unit coverage for queue claim, event load, reducer apply, receipt write,
  snapshot seal, CAS success, CAS conflict, retry, and dead-letter paths.
- Packed smoke coverage is added by `task-251`.

# Evidence

- `node dist/cli.js pack task-250` wrote
  `.mdkg/pack/pack_standard_task-250_20260604-204711549.md`.
- Added internal helper module `src/core/project_db_materializer.ts`.
- Added unit coverage to `tests/commands/db_index.test.ts` for materializer
  success, duplicate delivery, invalid payload dead-letter, missing-event
  dead-letter, stale-base CAS conflict, stats, and sealed snapshot verification.
- `npm run build` passed.
- `npm run build:test` passed.
- `node --test dist/tests/commands/db_index.test.js` passed.

# Links / Artifacts

- `goal-5`
- `task-191`
- `task-251`
- `test-86`
