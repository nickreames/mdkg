---
id: chk-12
type: checkpoint
title: CLI dispatch parser coverage
status: backlog
priority: 3
tags: []
owners: []
links: []
artifacts: [tests/commands/cli_runtime.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-121, test-73, epic-13]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-121, test-73]
created: 2026-05-08
updated: 2026-05-08
---
# Summary

Added direct `runCli` regression coverage for CLI parser helper branches,
command dispatch success paths, and skill subcommand usage handling.

# Scope Covered

- `root:task-121`
- `root:test-73`

# Decisions Captured

- This remains a coverage-hardening slice only; CLI behavior and command
  routing semantics were not changed.

# Implementation Summary

- Extended the direct `runCli` test helper to capture command-module
  `console.log` and `console.error` output, closing subprocess-only coverage
  gaps for command success paths.
- Added runtime coverage for package-version empty fallback, inline empty value
  handling, valued boolean flags, CSV/tag-mode parsing, edge-list parsing, and
  `--toon` / `--md` structured output flags.
- Added direct CLI dispatch coverage for `skill new/list/show/search/validate/sync`.
- Added direct CLI dispatch coverage for `new`, `task start/update/done`, and
  `event enable/append`.
- Updated `COVERAGE_HARDENING_MATRIX.md` with the new coverage measurement and
  moved `src/cli.ts` out of the highest-value remaining gaps.

# Verification / Testing

- `npm test -- --test-name-pattern "runCli|cli"`: 236 tests passed.
- `npm run test:coverage`: 236 tests passed.
- `src/cli.ts` coverage improved to `99.17%` line / `92.43%` branch.

# Known Issues / Follow-ups

- `src/cli.ts` still has a few uncovered task/event usage guard lines, but the
  module now exceeds the line and branch targets.

# Links / Artifacts

- `tests/commands/cli_runtime.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`
