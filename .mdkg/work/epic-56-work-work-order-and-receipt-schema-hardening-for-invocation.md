---
id: epic-56
type: epic
title: WORK WORK_ORDER and RECEIPT schema hardening for invocation
status: done
priority: 1
tags: [work, work-order, receipt, schema, invocation]
owners: []
links: []
artifacts: [.mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md]
relates: [goal-9, epic-25, epic-26]
blocked_by: []
blocks: [task-288, task-289, task-290, test-111]
refs: [dec-27]
aliases: [invocation-schema-hardening, work-receipt-schema-hardening]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Harden work contract, order, and receipt semantics so the new trigger loop can
produce deterministic, reviewable mirrors.

# Acceptance Criteria

- Work orders carry stable trigger refs, payload hashes, statuses, and optional
  queue refs.
- Receipts carry final evidence, verification status, hashes, proof refs, and
  redaction boundaries.
- Existing semantic-mirror boundaries remain explicit.

# Scope

Schema, templates, fixtures, and validation for work invocation mirrors.

# Milestones

- `task-288`
- `task-289`
- `task-290`
- `test-111`

# Out of Scope

- No production execution or canonical state storage.

# Risks

- Schema complexity could make manual mirror files hard to review.

# Links / Artifacts

- `goal-9`
- `dec-27`

# Closeout

Completed by `task-288`, `task-289`, `task-290`, and `test-111`.

- WORK, WORK_ORDER, and RECEIPT templates now capture deterministic trigger
  refs, payload hashes, status fields, queue refs, final evidence, verification
  hashes, proof refs, and redaction boundaries.
- The semantic mirror contract remains explicit: mirrors are reviewable records,
  not production execution or canonical marketplace state.
