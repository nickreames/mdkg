---
id: task-152
type: task
title: receipt status cli schema parity
status: done
priority: 1
epic: epic-25
tags: [receipt, cli, schema, parity, runtime-contract]
owners: []
links: []
artifacts: [npm run test, npm run cli:check, npm run smoke:archive-work, node dist/cli.js validate]
relates: [epic-25, epic-26, task-132, task-153, task-155]
blocked_by: []
blocks: [task-153, task-155, task-156]
refs: [edd-3, edd-8]
aliases: [receipt-status-parity, superseded-receipt-cli]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Bring `mdkg work receipt new|update` and docs into parity with graph validation
for `receipt_status: superseded`.

# Acceptance Criteria

- `mdkg work receipt new ... --receipt-status superseded` succeeds and writes a
  validation-clean `RECEIPT.md`.
- `mdkg work receipt update <id> --receipt-status superseded` succeeds and keeps
  existing artifacts, proof refs, attestation refs, and hashes intact.
- Invalid receipt statuses still fail through both graph validation and work
  command parsing.
- CLI help, `CLI_COMMAND_MATRIX.md`, README examples or notes, and smoke tests
  include `superseded` where receipt statuses are enumerated.
- The implementation remains generic and does not brand public docs as Omni.

# Files Affected

- `src/commands/work.ts`
- `src/cli.ts`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `tests/commands/archive_work.test.ts`
- `scripts/smoke-archive-work.js`

# Implementation Notes

The current graph validator accepts `superseded`, but the work command status
set and help surface still need parity. Start the next source implementation
pass here before broader lifecycle closeout.

# Results

- Added `superseded` to `mdkg work receipt new|update --receipt-status`.
- Updated CLI help, command matrix docs, seeded init command matrix, README
  guidance, core CLI rules, and changelog.
- Extended command coverage so receipt creation accepts `superseded`, receipt
  update can move to `superseded`, and invalid statuses still fail command
  parsing.
- Extended the packed archive/work smoke so a temp initialized repo installs the
  current package, creates a work contract/order/receipt chain, updates the
  receipt to `superseded`, and confirms the status through `show --json`.

# Test Plan

- Add command tests for receipt create/update with `superseded`.
- Add or update invalid-status command tests.
- Run `npm run test`.
- Run `npm run smoke:archive-work`.
- Run `npm run cli:check`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Verification

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:archive-work`

# Links / Artifacts

- `task-132`
- `task-153`
- `task-155`
- `epic-25`
- `epic-26`
