---
id: task-121
type: task
title: Harden CLI dispatch and parser coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, cli]
owners: []
links: []
artifacts: [tests/commands/cli_runtime.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused CLI runtime regression coverage for low-frequency `src/cli.ts`
helper parsing and subcommand dispatch branches identified by the residual
coverage matrix.

# Acceptance Criteria

- Cover inline empty value handling for required value flags.
- Cover string boolean handling for `--agent=true`, `--agent=false`, and
  invalid valued booleans.
- Cover successful CLI parsing for CSV tags, tag modes, edge lists, numeric
  flags, and less-used structured output flags.
- Cover the `skill` subcommand dispatch path through `runCli`.
- Keep the change test-only unless CLI behavior is demonstrably wrong.

# Files Affected

- `tests/commands/cli_runtime.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Prefer direct `runCli` tests so runtime logging can be captured without
  repeated subprocess setup.
- Reuse existing temporary repo helpers and skill scaffolding paths.
- Captured command-module `console.log` and `console.error` output inside the
  direct `runCli` helper so command success paths can be asserted without
  subprocess coverage gaps.
- Added direct runtime cases for package-version fallback, inline empty value
  handling, valued booleans, CSV/tag-mode parsing, edge-list parsing,
  structured output flags, skill dispatch, task/event mutation dispatch, and
  `new` dispatch.

# Test Plan

- `npm test -- --test-name-pattern "runCli|cli"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- `npm test -- --test-name-pattern "runCli|cli"`: 236 tests passed.
- `npm run test:coverage`: 236 tests passed.
- `src/cli.ts` coverage improved to `99.17%` line / `92.43%` branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
