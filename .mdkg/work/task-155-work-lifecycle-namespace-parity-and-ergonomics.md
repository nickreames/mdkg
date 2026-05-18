---
id: task-155
type: task
title: work lifecycle namespace parity and ergonomics
status: todo
priority: 1
epic: epic-26
tags: [work, lifecycle, cli, ergonomics, parity]
owners: []
links: []
artifacts: []
relates: [epic-26, epic-25, epic-24, task-152, task-153, task-156]
blocked_by: [task-152, task-153]
blocks: [task-156]
refs: [edd-3, edd-8, rule-3]
aliases: [work-lifecycle-parity]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Reconcile the current `mdkg work ...` command implementation with the epic-26
lifecycle namespace requirements and close ergonomic parity gaps.

# Acceptance Criteria

- Work lifecycle command parsing, help text, command matrix, and JSON receipts
  match the schema behavior from `epic-25`.
- Receipt status parity includes `superseded` for both create and update.
- Work order and receipt updates preserve existing semantic mirror metadata
  while appending new refs without duplicates.
- Mutating commands continue to reject imported read-only qids with explicit
  source-import guidance.
- Work artifact registration keeps archive sidecars separate from external
  `artifact://...` identities and never implies runtime execution, ledger,
  marketplace, payment, or Postgres mutation.

# Files Affected

- `src/commands/work.ts`
- `src/cli.ts`
- `tests/commands/archive_work.test.ts`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `scripts/smoke-archive-work.js`

# Implementation Notes

This is the lifecycle namespace closeout bridge after `epic-25` schema parity.
Do not add a runtime execution engine or database integration.

# Test Plan

- Add CLI tests for create/update parity and imported-node mutation errors.
- Run `npm run test`.
- Run `npm run cli:check`.
- Run `npm run smoke:archive-work`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Links / Artifacts

- `epic-26`
- `task-152`
- `task-153`
- `task-156`
