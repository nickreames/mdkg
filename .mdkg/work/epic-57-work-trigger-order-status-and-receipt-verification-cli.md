---
id: epic-57
type: epic
title: work trigger order status and receipt verification CLI
status: done
priority: 1
tags: [cli, work, trigger, receipt, status]
owners: []
links: []
artifacts: [src/commands/work.ts, CLI_COMMAND_MATRIX.md]
relates: [goal-9, epic-26]
blocked_by: []
blocks: [task-291, task-292, task-293, test-112, test-113]
refs: [dec-27]
aliases: [work-trigger-cli, receipt-verify-cli]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Add the operator-friendly CLI loop that creates work orders, inspects order
status, and verifies receipt linkage.

# Acceptance Criteria

- `mdkg work trigger` creates deterministic `WORK_ORDER.md` mirrors.
- `mdkg work order status` reports deterministic JSON status.
- `mdkg work receipt verify` checks linkage and final evidence without
  executing work.

# Scope

CLI helpers for semantic invocation and receipt verification.

# Milestones

- `task-291`
- `task-292`
- `task-293`
- `test-112`
- `test-113`

# Out of Scope

- No worker runtime or LLM execution.

# Risks

- Users may mistake trigger for execution unless help text is explicit.

# Links / Artifacts

- `goal-9`
- `epic-26`

# Closeout

Completed by `task-291`, `task-292`, `task-293`, `test-112`, and `test-113`.

- `mdkg work trigger` creates deterministic work order mirrors without
  executing work.
- `mdkg work order status` reports deterministic order state.
- `mdkg work receipt verify` checks linkage, evidence, payload hash, proof refs,
  and redaction fields as a read-only verification surface.
