---
id: chk-108
type: checkpoint
title: fix plan duplicate id repair planner implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-338]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-338]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the `ids` repair-family planner for duplicate local ids. Duplicate
groups now produce deterministic high-risk manual-review findings with candidate
ids and reference-bearing paths, without editing graph files.

# Scope Covered

- `task-338`
- Partial coverage for `test-137`

# Decisions Captured

- Duplicate-id planning parses workspace docs directly because the normal index
  rejects duplicate ids by design.
- The first sorted path in a duplicate group is treated as canonical for
  planning only.
- Candidate ids use `<id>-dup-<n>` and avoid ids already present in the
  workspace.
- Reference paths are a conservative review list of workspace files containing
  the duplicate id string; apply remains deferred.

# Implementation Summary

- Extended `src/commands/fix.ts` with duplicate-id scanning over registered
  workspace document files.
- Added `ids.###` planned changes with `risk: high`, `status: manual_review`,
  `reason: duplicate_id`, source paths, canonical/duplicate refs, candidate id,
  and reference paths.
- Added target filtering and blocked target receipts for `--family ids`.
- Added duplicate-id tests in `tests/commands/fix.test.ts`.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js`
- `npm run cli:check`
- `node dist/cli.js fix plan --family ids --json`
- `npm run test` passed 444 tests.
- `node dist/cli.js index`
- `node dist/cli.js validate --json` returned `ok: true`.
- `git diff --check`

# Known Issues / Follow-ups

- `fix apply` remains intentionally deferred.
- Temp-repo no-mutation smoke remains pending under `task-339` and `test-136`.

# Links / Artifacts

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
