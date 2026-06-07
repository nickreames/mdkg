---
id: task-293
type: task
title: implement mdkg work receipt verify JSON command
status: done
priority: 1
epic: epic-57
parent: goal-9
prev: task-292
next: task-294
tags: [receipt, verify, cli, json]
owners: []
links: []
artifacts: [src/commands/work.ts, src/cli.ts]
relates: [goal-9, epic-57, test-113]
blocked_by: [task-292]
blocks: [task-294]
refs: [dec-27]
aliases: [work-receipt-verify-command]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add receipt verification for final evidence closeout.

# Acceptance Criteria

- `mdkg work receipt verify <receipt-id> --json` validates receipt to work-order linkage and reports verification state.
- Verification checks proof refs, artifact refs, hashes, outcome, and redaction-safe fields.
- Verification does not mutate runtime or production state.

# Files Affected

- `src/commands/work.ts`
- `src/cli.ts`
- `tests`

# Implementation Notes

- Verification reports evidence quality; it does not execute remediation.

# Test Plan

- CLI tests for valid and invalid receipts.
- `node dist/cli.js work receipt verify <created-receipt> --json`

# Links / Artifacts

- `test-113`
