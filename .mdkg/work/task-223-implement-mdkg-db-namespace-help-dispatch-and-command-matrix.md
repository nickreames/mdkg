---
id: task-223
type: task
title: implement mdkg db namespace help dispatch and command matrix parity
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, db-cli, cli, docs]
owners: []
links: []
artifacts: [src/cli.ts, CLI_COMMAND_MATRIX.md, scripts/cli_help_snapshot.js, tests/commands/cli.test.ts, tests/commands/cli_dispatch.test.ts, tests/commands/cli_help_matrix.test.ts]
relates: [goal-1, epic-30, edd-12, task-181]
blocked_by: []
blocks: [task-224, task-225, task-226, task-230, task-231]
refs: [edd-12, rule-3]
aliases: [db-namespace, mdkg-db-cli-dispatch]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Add the public `mdkg db ...` namespace and route it through help, dispatch,
usage errors, and command matrix parity without changing existing `mdkg index`
behavior.

# Acceptance Criteria

- `mdkg db --help` and `mdkg help db` describe the DB command family.
- Dispatch recognizes `mdkg db index`, `mdkg db init`, `mdkg db migrate`,
  `mdkg db verify`, and `mdkg db stats`.
- Unknown and malformed `mdkg db ...` invocations return command-specific usage
  guidance.
- `CLI_COMMAND_MATRIX.md` and help snapshots include the namespace.
- `mdkg index` remains visible and unchanged as a compatibility shortcut.

# Explicit Exclusions

- No real npm publish.
- No raw SQL command.
- No project DB profiles.

# Files Affected

- CLI dispatch and help.
- Command matrix and help snapshot script.
- DB command implementation entrypoint.

# Implementation Notes

Add only namespace routing and usage scaffolding here. Deeper command behavior
belongs to the downstream tasks.

# Test Plan

- Unit/CLI tests cover db help, dispatch, malformed usage, and matrix parity.
- `npm run cli:check` passes.
- `node dist/cli.js validate` passes.

# Closeout Evidence

- Implemented `mdkg db` namespace help and dispatch scaffolding in
  `src/cli.ts`.
- Updated `CLI_COMMAND_MATRIX.md` and help snapshot generation targets for
  `mdkg db` and `mdkg db index`.
- Added CLI tests for help output, help matrix parity, malformed dispatch, and
  planned subcommand errors.
- Verification passed: `npm run build`, `npm run build:test`, `npm run test`
  with 388 passing tests, `npm run cli:check`, `node dist/cli.js validate`,
  and `git diff --check`.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
