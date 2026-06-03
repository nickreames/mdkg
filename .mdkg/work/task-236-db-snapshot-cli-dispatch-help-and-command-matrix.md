---
id: task-236
type: task
title: db snapshot cli dispatch help and command matrix
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, cli, docs]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-235]
blocked_by: [task-235]
blocks: [task-238, task-239, task-240, task-241, task-242, task-243]
refs: [edd-13, rule-3]
aliases: [db-snapshot-cli]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Expose the `mdkg db snapshot ...` command family without changing existing
`mdkg db verify`, `mdkg db stats`, or `mdkg db index ...` behavior.

# Acceptance Criteria

- CLI dispatch recognizes `snapshot seal`, `snapshot verify`, `snapshot status`,
  `snapshot dump`, and `snapshot diff`.
- Help output documents the snapshot command family and boundaries.
- `CLI_COMMAND_MATRIX.md` and seeded command matrix are aligned.
- Unknown or malformed snapshot commands fail with clear usage guidance.

# Explicit Exclusions

- No snapshot implementation beyond dispatch stubs until downstream tasks.
- No direct `mdkg db seal` alias.

# Files Affected

- `src/cli.ts`
- `src/commands/db.ts`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- CLI tests and help snapshot checks.

# Implementation Notes

Keep `mdkg db snapshot ...` as a subnamespace to avoid overloading runtime
health checks.

# Test Plan

- CLI help tests for `mdkg help db` and `mdkg help db snapshot`.
- Dispatch tests for missing/unknown snapshot actions and valid JSON receipts.

# Closeout Evidence

- 2026-06-03: Implemented `mdkg db snapshot seal|verify|status|dump|diff`
  dispatch and command help.
- 2026-06-03: Updated `CLI_COMMAND_MATRIX.md` and seeded command matrix for
  snapshot usage and boundaries.
- 2026-06-03: Focused CLI/help tests passed with
  `npm run build && npm run build:test && node --test
  dist/tests/commands/db_index.test.js dist/tests/commands/cli.test.js
  dist/tests/commands/cli_help_matrix.test.js
  dist/tests/commands/cli_dispatch.test.js`.
- 2026-06-03: `npm run cli:check` passed.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
