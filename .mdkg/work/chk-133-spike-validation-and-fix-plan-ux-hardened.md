---
id: chk-133
type: checkpoint
title: spike validation and fix-plan UX hardened
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-367]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-367]
created: 2026-06-15
updated: 2026-06-15
---
# Summary

`task-367` hardened malformed-spike diagnostics and read-only fix-plan guidance.
Spike validation now warns on missing research/planning body sections, fix-plan
reference checks include standard node `links`, `artifacts`, and `refs`, and the
packed spike smoke proves malformed spike UX through an installed tarball.

# Scope Covered

- `task-367`
- `test-155`
- `src/commands/validate.ts`
- `src/commands/fix.ts`
- `src/cli.ts`
- `tests/commands/validate.test.ts`
- `tests/commands/fix.test.ts`
- `tests/commands/cli_help_matrix.test.ts`
- `scripts/smoke-spike.js`

# Decisions Captured

- Keep spike repair in dry-run planning only; no `fix apply` or automatic spike
  body repair was introduced.
- Keep evidence as Markdown body sections for now, with validation warnings for
  missing recommended spike sections rather than hard body-schema errors.
- Keep spikes on existing work-node and task lifecycle commands.

# Implementation Summary

- Added spike recommended headings to `runValidateCommand`.
- Added malformed spike validation tests for invalid ids, statuses, priorities,
  missing graph refs, missing spike headings, and JSON stdout/stderr discipline.
- Extended fix planning to inspect indexed `links`, `artifacts`, and `refs`
  fields in addition to custom attributes, so spike artifact archive refs appear
  in read-only repair receipts.
- Added fix-plan tests for missing spike graph refs, missing spike archive refs,
  duplicate spike IDs, deterministic candidate IDs, and no mutation.
- Extended packed spike smoke with a malformed temp repo that verifies
  `validate --json`, `fix plan --family refs`, and `fix plan --family ids`
  using only the installed tarball CLI.
- Updated `mdkg help new` to direct users to record spike research evidence by
  editing Markdown body sections.

# Verification / Testing

- Passed `npm run build`.
- Passed `npm run build:test`.
- Passed focused suites:
  `node --test dist/tests/commands/validate.test.js
  dist/tests/commands/fix.test.js
  dist/tests/commands/cli_help_matrix.test.js
  dist/tests/graph/node.test.js`.
- Passed `npm run cli:check`.
- Passed full `npm run test` with 467 tests.
- Passed `npm run smoke:fix-plan`.
- Passed `npm run smoke:spike`; malformed temp repo:
  `/private/tmp/mdkg-spike.WRqi2V/malformed-repo`.
- Passed `npm run cli:contract`.
- Passed `node dist/cli.js index`.
- Passed `node dist/cli.js validate --json`.
- Passed `git diff --check`.

# Known Issues / Follow-ups

- `task-368` remains next for 0.3.2 spike prepublish release-candidate checks.
- No real npm publish, tag, or push happened in this phase.

# Links / Artifacts

- `task-367`
- `test-155`
