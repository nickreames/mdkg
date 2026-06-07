---
id: dec-27
type: dec
title: work orders and receipts are semantic mirrors
status: accepted
tags: [work, work-order, receipt, semantic-mirror, boundary, security]
owners: []
links: []
artifacts: [.mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md]
relates: [goal-9, epic-56, epic-57, epic-58]
refs: [edd-15, epic-25, epic-26]
aliases: [work-order-receipt-semantic-mirror, receipt-boundary-policy, no-canonical-runtime-state-in-mdkg]
created: 2026-06-06
updated: 2026-06-06
---
# Context

mdkg already has semantic mirror commands for work contracts, orders, receipts,
and artifacts. The next release should make invocation ergonomic without
confusing committed mdkg files with production execution databases.

# Decision

`WORK_ORDER.md` and `RECEIPT.md` remain committed semantic mirrors. They do not
replace canonical runtime execution state, queue history, payment state, ledger
state, marketplace inventory, or production application databases.

`mdkg work trigger` may create a deterministic work order and optionally enqueue
a local project DB delivery message. It must not execute agents, LLMs, payments,
ledger writes, or production mutations.

# Consequences

- Receipts can verify linkage, outcome, proof refs, hashes, and redaction
  boundaries.
- Final receipts are durable closeout evidence, but not full operational logs.
- Queue integration is local delivery infrastructure and must stay optional.

# Alternatives considered

- Make mdkg the canonical execution database. Rejected because production
  systems and runtimes own execution state.
- Keep only manual order/receipt commands. Rejected because trigger ergonomics
  are needed for reusable capability invocation.

# Links / references

- `edd-15`
- `epic-25`
- `epic-26`
- `goal-9`
