---
id: task-335
type: task
title: implement fix plan command skeleton and receipt schema
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, repair, receipts, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-327]
blocks: [task-336, task-337, task-338, test-135]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Implement the first public `mdkg fix plan --json` skeleton and the shared
receipt schema used by all repair-family planners.

# Acceptance Criteria

- `mdkg fix --help` and `mdkg fix plan --help` are present.
- `mdkg fix plan --json` writes one parseable receipt-shaped JSON object to
  stdout.
- The receipt includes `action`, `schema_version`, `plan_id`, `plan_hash`,
  selected `families`, `risk_counts`, `proposed_changes`, `blocked_changes`,
  and `summary`.
- `--family index|refs|ids|all` is accepted, with `all` as the default.
- `--target <id-or-qid>` is parsed but may return a structured unsupported or
  no-op plan until family planners consume it.
- No files are written by the skeleton.
- There is no `fix apply` command in this slice.

# Files Affected

- `src/commands/fix.ts`
- `src/cli.ts`
- `tests/commands/fix.test.ts`
- `src/util/argparse.ts`
- `scripts/cli_help_snapshot.js`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/CLI_COMMAND_MATRIX.md`

# Implementation Notes

- Keep stdout JSON-only for `--json`; diagnostics belong on stderr.
- Sort arrays by family, path, id, then reason code.
- Use canonical JSON hashing for `plan_hash`.
- Include `dirty` git state when available, but do not fail planning because the
  worktree is dirty.

# Test Plan

- Unit tests for argument parsing, help text, and JSON envelope shape.
- `node dist/cli.js fix plan --json` in a clean temp repo.
- `node dist/cli.js validate --json`.

# Links / Artifacts

- `edd-19`
- `test-135`
- `chk-104`
