---
id: chk-100
type: checkpoint
title: doctor strict typed checks implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-332]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-332]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the `mdkg doctor --strict --json` typed health-check surface for
the 0.3.2 operator-health lane. Existing `mdkg doctor --json` remains
backward-compatible with `name`, `ok`, optional `level`, `detail`, and
`failure_count`, while each check now also carries stable typed fields for
automation.

# Scope Covered

- `task-332`
- `test-133`
- `edd-17`

# Decisions Captured

- `--strict` is opt-in and read-only.
- Successful checks continue to omit `level` unless a warning/failure level is
  meaningful, preserving older JSON consumers.
- Strict mode upgrades stale generated graph/capability cache state, stale or
  achieved selected-goal state, invalid graph state, and enabled project DB
  verification failures into failures.
- Runtime DB transient files and archive/bundle hygiene remain warnings unless
  their underlying checks fail.

# Implementation Summary

- Added stable check fields: `id`, `status`, `severity`, `message`,
  `remediation`, and optional `refs`.
- Added JSON envelope fields: `action: "doctor"`, `strict`, and `summary`.
- Added selected-goal checks for missing/malformed/achieved selected goal
  state.
- Added project DB verification summary when `db.enabled` is true.
- Added strict generated-cache behavior without removing non-strict rebuild
  compatibility.
- Updated `src/cli.ts`, `CLI_COMMAND_MATRIX.md`, help tests, and doctor tests.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/doctor.test.js dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/cli_error_matrix.test.js dist/tests/commands/cli_dispatch.test.js`
- `npm run cli:check`
- `npm run test` (434 passing)
- `node dist/cli.js doctor --strict --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-333` still needs packed/temp-repo operator-health smoke and docs gate.
- `doctor --strict` currently uses the existing CLI error handling path for
  failed health checks; changing exit-code taxonomy is deferred unless a later
  operator-status task explicitly scopes it.

# Links / Artifacts

- `src/commands/doctor.ts`
- `src/cli.ts`
- `CLI_COMMAND_MATRIX.md`
- `tests/commands/doctor.test.ts`
