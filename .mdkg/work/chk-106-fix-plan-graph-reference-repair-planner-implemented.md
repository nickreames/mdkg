---
id: chk-106
type: checkpoint
title: fix plan graph reference repair planner implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-337]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-337]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the `refs` repair-family planner for `mdkg fix plan --json`.
Missing graph references are now reported as deterministic manual-review
findings without guessing replacement ids or mutating files.

# Scope Covered

- `task-337`
- Partial coverage for `test-137`

# Decisions Captured

- The refs planner uses tolerant graph loading so missing refs are inspectable.
- Missing graph refs are `medium` risk and `manual_review`, not automatic
  repair candidates.
- `--target` filters by id/qid when unambiguous and returns blocked receipt
  entries for missing or ambiguous targets.
- External configured subgraph workspace refs are skipped as valid external
  references.

# Implementation Summary

- Extended `src/commands/fix.ts` with a planner result model containing
  proposed and blocked changes.
- Added edge traversal over `epic`, `parent`, `prev`, `next`, `relates`,
  `blocked_by`, and `blocks`.
- Added stable `refs.###` findings with source path, source qid, target qid,
  field name, command hint, and `apply_supported: false`.
- Added tests for missing refs, target filtering, target-not-found blocked
  receipts, and no mutation.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js`
- `npm run cli:check`
- `node dist/cli.js fix plan --family refs --json`
- `npm run test` passed 442 tests.
- `node dist/cli.js index`
- `node dist/cli.js validate --json` returned `ok: true`.
- `git diff --check`

# Known Issues / Follow-ups

- Duplicate-id repair planning remains pending under `task-338`.
- `test-137` remains open until all repair-family fixtures are covered.

# Links / Artifacts

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
