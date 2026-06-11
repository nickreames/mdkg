---
id: chk-99
type: checkpoint
title: mdkg status json operator summary implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-331]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-331]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the first 0.3.2 operator-health surface: `mdkg status [--json]`.
The command is read-only and reports release/package, git, graph, selected-goal,
project DB, and generated-cache health without rebuilding indexes or mutating
repo state.

# Scope Covered

- `task-331`
- `test-132`
- `edd-17`

# Decisions Captured

- `status` is a top-level operator command, while detailed typed strict checks
  remain deferred to `doctor --strict` under `task-332`.
- Dirty Git state is a warning, not a hard failure.
- The command uses cached graph/index state only and does not repair or rebuild.
- Disabled project DB state is represented as `db.enabled: false` with
  `db.ok: null` rather than an error.

# Implementation Summary

- Added `src/commands/status.ts` with `collectStatus()` and
  `runStatusCommand()`.
- Wired `mdkg status [--json]` into `src/cli.ts` dispatch and help.
- Updated `CLI_COMMAND_MATRIX.md` and `assets/init/CLI_COMMAND_MATRIX.md`.
- Added status command coverage in `tests/commands/status.test.ts`,
  `tests/commands/cli_dispatch.test.ts`, and
  `tests/commands/cli_help_matrix.test.ts`.
- Added `status` to the CLI help snapshot target list.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/status.test.js dist/tests/commands/cli_dispatch.test.js dist/tests/commands/cli_help_matrix.test.js`
- `npm run cli:check`
- `node dist/cli.js validate --json`
- `node dist/cli.js status --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-332` still needs `mdkg doctor --strict --json` typed checks.
- `task-333` still needs the operator-health temp-repo smoke and docs gate.
- Existing goal-next routing does not fully respect blockers; `goal-13` was
  explicitly claimed to `task-331` for this slice.

# Links / Artifacts

- `src/commands/status.ts`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `tests/commands/status.test.ts`
