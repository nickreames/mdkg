---
id: task-290
type: task
title: harden RECEIPT final evidence verification hashes and redaction rules
status: done
priority: 1
epic: epic-56
parent: goal-9
prev: task-289
next: task-291
tags: [receipt, evidence, hash, redaction]
owners: []
links: []
artifacts: [.mdkg/templates/default/receipt.md, src/graph/agent_file_types.ts]
relates: [goal-9, epic-56, test-111, test-117]
blocked_by: [task-289]
blocks: [task-291, task-293]
refs: [dec-27]
aliases: [receipt-final-evidence-schema]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Ensure receipts can serve as final closeout evidence without leaking sensitive
or canonical runtime state.

# Acceptance Criteria

- Receipts validate work-order linkage, status, outcome, proof refs, artifact refs, input/output hashes, and redaction boundaries.
- Final evidence is enough for verification without storing raw secrets.
- Existing receipt statuses remain compatible.

# Files Affected

- `.mdkg/templates/default/receipt.md`
- `src/graph/agent_file_types.ts`
- `tests`

# Implementation Notes

- Receipts should store refs and hashes, not raw operational state.

# Test Plan

- Receipt fixture tests.
- No-secret grep over generated fixtures.
- `npm run test`

# Links / Artifacts

- `test-111`
- `test-117`
