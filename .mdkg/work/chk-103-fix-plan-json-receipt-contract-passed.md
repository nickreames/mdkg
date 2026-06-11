---
id: chk-103
type: checkpoint
title: fix plan json receipt contract passed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-135]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-135]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Validated the first `mdkg fix plan --json` receipt contract. The command emits
parseable JSON, uses deterministic plan ids/hashes for stable inputs, rejects
invalid families, and keeps `fix apply` unavailable.

# Scope Covered

- `test-135`
- `task-335`

# Decisions Captured

- The JSON envelope is the first supported output contract for repair planning.
- `generated_at` is intentionally outside the plan hash so repeated runs can
  keep stable `plan_hash` and `plan_id` values.
- The skeleton reports empty family findings until `task-336` through
  `task-338` fill in concrete planners.

# Implementation Summary

- Added `tests/commands/fix.test.ts`.
- Covered default `all` family selection, explicit `refs` target selection,
  invalid family handling, help text, and no exposed apply subcommand.

# Verification / Testing

- `node --test dist/tests/commands/fix.test.js dist/tests/commands/cli.test.js`
  passed 19 tests.
- `npm run test` passed 438 tests.
- `node dist/cli.js fix plan --json` succeeded in the live repo and reported
  dirty state without mutation.

# Known Issues / Follow-ups

- Concrete index/cache, refs, and duplicate-id findings remain pending in
  `task-336` through `task-338`.

# Links / Artifacts

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
