---
id: task-155
type: task
title: work lifecycle namespace parity and ergonomics
status: done
priority: 1
epic: epic-26
tags: [work, lifecycle, cli, ergonomics, parity]
owners: []
links: []
artifacts: [src/commands/work.ts, src/cli.ts, tests/commands/archive_work.test.ts, tests/commands/bundle_import.test.ts, CLI_COMMAND_MATRIX.md, README.md, scripts/smoke-archive-work.js]
relates: [epic-26, epic-25, epic-24, task-152, task-153, task-156]
blocked_by: []
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

Implemented shared id-or-qid resolution for mutating work lifecycle commands.
`mdkg work order update`, `mdkg work receipt update`, and
`mdkg work artifact add` now accept local ids or local qids. Imported bundle
qids fail with explicit read-only guidance:
`cannot mutate read-only imported node <qid>; update the source workspace for
bundle import <alias>`.

Create commands remain id-only and continue to require portable local ids.
JSON receipts remain deterministic: `{ action, node }` for contract, order, and
receipt mutations, and `{ action, target, archive }` for artifact registration.

Update behavior preserves existing metadata and append-dedupes new input,
artifact, proof, and attestation refs. `artifact://...` remains external runtime
identity, while `archive://...` remains committed mdkg sidecar identity.

# Test Plan

- Focused test passed: `node --test dist/tests/commands/archive_work.test.js dist/tests/commands/bundle_import.test.js`.
- Full release gate evidence is recorded in `epic-26` closeout.

# Links / Artifacts

- `epic-26`
- `task-152`
- `task-153`
- `task-156`
