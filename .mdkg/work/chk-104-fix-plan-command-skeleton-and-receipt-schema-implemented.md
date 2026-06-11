---
id: chk-104
type: checkpoint
title: fix plan command skeleton and receipt schema implemented
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-335]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-335]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Implemented the first public `mdkg fix plan` command skeleton and receipt
schema for the `0.3.3` repair-planning lane.

# Scope Covered

- `task-335`
- `test-135`

# Decisions Captured

- `mdkg fix plan` is read-only.
- `--family index|refs|ids|all` defaults to `all`.
- `--target <id-or-qid>` is parsed and included in the receipt.
- The command reports dirty git state but does not fail because the worktree is
  dirty.
- `fix apply` is not exposed.

# Implementation Summary

- Added `src/commands/fix.ts` with stable JSON hashing, family parsing, git
  dirty-state summary, and receipt output.
- Wired `fix` into `src/cli.ts` help and dispatch.
- Added `--family` parsing in `src/util/argparse.ts`.
- Added `fix` and `fix plan` to `scripts/cli_help_snapshot.js`.
- Updated `CLI_COMMAND_MATRIX.md` and `assets/init/CLI_COMMAND_MATRIX.md`.
- Added `tests/commands/fix.test.ts`.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js dist/tests/commands/cli.test.js`
- `npm run cli:check`
- `npm run test` passed 438 tests.
- `node dist/cli.js validate --json` returned `ok: true`.
- `node dist/cli.js fix plan --json` returned a `fix.plan` receipt.
- `git diff --check`

# Known Issues / Follow-ups

- Family planners still return empty findings; implement them in `task-336`,
  `task-337`, and `task-338`.
- Temp-repo no-mutation smoke remains pending under `task-339` and `test-136`.

# Links / Artifacts

- `src/commands/fix.ts`
- `src/cli.ts`
- `src/util/argparse.ts`
- `tests/commands/fix.test.ts`
- `CLI_COMMAND_MATRIX.md`
