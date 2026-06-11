---
id: chk-105
type: checkpoint
title: fix plan index cache repair planner implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-336]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-336]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the `index` repair-family planner for `mdkg fix plan --json`.
Generated cache issues now appear as low-risk planned repairs with affected
paths and `mdkg index` command hints, without rebuilding or writing files.

# Scope Covered

- `task-336`
- Partial coverage for `test-137`

# Decisions Captured

- Generated caches are treated as rebuildable by operator command, not direct
  edit targets.
- Missing, stale, unreadable, and staleness-unknown cache states are planned as
  reviewable findings.
- The index family can run independently with `--family index`.

# Implementation Summary

- Extended `src/commands/fix.ts` to load mdkg config and inspect generated
  index, skills, capabilities, subgraph, and SQLite cache paths.
- Added deterministic `index.###` planned-change ids.
- Added stable sorting and risk-count aggregation.
- Extended `tests/commands/fix.test.ts` with missing-cache, stale-cache, and
  no-mutation assertions.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js`
- `npm run cli:check`
- `npm run test` passed 440 tests.
- `node dist/cli.js fix plan --family index --json` succeeded in the live repo.
- `node dist/cli.js index`
- `node dist/cli.js validate --json` returned `ok: true`.
- `git diff --check`

# Known Issues / Follow-ups

- `refs` and `ids` repair families remain pending under `task-337` and
  `task-338`.
- `test-137` should remain open until all three family planners have fixtures.

# Links / Artifacts

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
