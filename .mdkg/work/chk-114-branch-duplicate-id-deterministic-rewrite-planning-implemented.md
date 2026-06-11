---
id: chk-114
type: checkpoint
title: Branch duplicate id deterministic rewrite planning implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-341]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-341]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-341` implemented branch-conflict-aware duplicate local id planning for
the dry-run `mdkg fix plan` surface.

# Scope Covered

- `task-341`
- Duplicate-id validation diagnostics.
- `mdkg fix plan --family ids --json` duplicate grouping metadata.
- Collision-free deterministic candidate id planning.

# Decisions Captured

- Preserve the existing read-only/manual-review repair boundary.
- Do not introduce `fix apply`.
- Preserve portable semantic ids by proposing suffix ids such as
  `task-2-dup-2` instead of replacing the entire id with an opaque value.

# Implementation Summary

- Added `evidence` to fix-plan changes for duplicate-id branch conflict review.
- Added canonical duplicate group metadata under `before.duplicate_group`.
- Added candidate qid, collision-free marker, deterministic rule, and command
  hint to the duplicate-id plan output.
- Changed duplicate-id validation diagnostics to stable repo-relative paths.
- Added a Git-backed unit test that initializes a temp repo, creates two
  branches, merges duplicate local ids, then verifies validation and fix-plan
  output.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js dist/tests/commands/validate.test.js`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Known Issues / Follow-ups

- Reference rewrite receipts and stale selected-goal repair planning remain in
  `task-342`.
- Writer lock and atomic write audit work remains in `task-343`.
- Full two-branch smoke/prepublish gate remains in `task-344`.

# Links / Artifacts

- `.mdkg/pack/pack_standard_task-341_20260609-212312136.md`
- `src/commands/fix.ts`
- `src/commands/validate.ts`
- `tests/commands/fix.test.ts`
