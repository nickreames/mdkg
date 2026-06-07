---
id: epic-59
type: epic
title: capability discovery across SPEC WORK ORDER and RECEIPT
status: done
priority: 2
tags: [capability-index, spec, work, work-order, receipt, discovery]
owners: []
links: []
artifacts: [.mdkg/index/capabilities.json]
relates: [goal-9, epic-55, epic-56]
blocked_by: []
blocks: [task-295, test-115]
refs: [edd-15]
aliases: [spec-work-receipt-discovery, capability-chain-discovery]
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Make capability discovery show the relationship from reusable spec to work
contract, invocation, and receipt evidence.

# Acceptance Criteria

- Search and list outputs can expose SPEC and WORK metadata.
- Work orders and receipts link back to their contracts.
- Discovery remains read-only across subgraphs.

# Scope

Read-only capability indexing and discovery links.

# Milestones

- `task-295`
- `test-115`

# Out of Scope

- No imported subgraph mutation.

# Risks

- Too much receipt data in capability output could leak operational detail.

# Links / Artifacts

- `goal-9`
- `.mdkg/index/capabilities.json`

# Closeout

Completed by `task-295` and `test-115`.

- Capability discovery now exposes the dogfood SPEC, linked WORK contract,
  generated WORK_ORDER mirror, and verified RECEIPT mirror.
- The linkage chain remains read-only and suitable for local or subgraph
  planning context.
