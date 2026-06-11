---
id: chk-107
type: checkpoint
title: repair family fixture contract passed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-137]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-137]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Validated deterministic fixture coverage for all three initial `mdkg fix plan`
repair families: `index`, `refs`, and `ids`.

# Scope Covered

- `test-137`
- `task-336`
- `task-337`
- `task-338`

# Decisions Captured

- All family findings remain review-only with `apply_supported: false`.
- Index/cache findings are low-risk command-hint repairs.
- Missing refs are medium-risk manual-review findings.
- Duplicate ids are high-risk manual-review findings with deterministic
  candidate ids.

# Implementation Summary

- `tests/commands/fix.test.ts` now covers:
  - missing generated cache planning
  - stale generated cache planning
  - missing graph reference planning
  - refs target filtering and blocked target receipts
  - duplicate-id planning and deterministic candidate ids
  - ids target filtering and blocked target receipts
  - no-mutation assertions for planning flows

# Verification / Testing

- `node --test dist/tests/commands/fix.test.js` passed 10 tests.
- `npm run cli:check` passed.
- `npm run test` passed 444 tests.
- `node dist/cli.js index`
- `node dist/cli.js validate --json` returned `ok: true`.
- `git diff --check`

# Known Issues / Follow-ups

- Temp-repo smoke and publish gate remain pending under `task-339` and
  `test-136`.

# Links / Artifacts

- `tests/commands/fix.test.ts`
- `src/commands/fix.ts`
