---
id: test-73
type: test
title: Cover CLI skill dispatch and flag parser branches
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, cli, test]
owners: []
links: []
artifacts: [tests/commands/cli_runtime.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-121]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Validate CLI runtime parser and skill-dispatch branches so command wiring stays
covered by direct runtime tests instead of only command-module unit tests.

# Target / Scope

`src/cli.ts` helper parsing and `skill` subcommand dispatch coverage.

# Preconditions / Environment

Use temporary mdkg roots created by existing CLI runtime test helpers.

# Test Cases

- inline empty values on required value flags produce command-specific usage
  errors
- `--agent=true`, `--agent=false`, and invalid valued booleans exercise string
  boolean parsing
- CLI list/search/show/pack commands exercise CSV, tag-mode, edge-list,
  numeric, `--toon`, and `--md` parser branches
- CLI skill new/list/show/search/validate/sync dispatch succeeds through
  `runCli`
- CLI task/event mutation and `new` dispatch succeeds through `runCli`

# Results / Evidence

- `npm test -- --test-name-pattern "runCli|cli"`: 236 tests passed.
- `npm run test:coverage`: 236 tests passed.
- `src/cli.ts` coverage improved to `99.17%` line / `92.43%` branch.

# Notes / Follow-ups

- This is a CLI coverage-hardening slice, not a behavior redesign.
