---
id: epic-26
type: epic
title: mdkg work lifecycle namespace
status: backlog
priority: 3
tags: [future, cli, work, work-order, receipt, lifecycle]
owners: []
links: []
artifacts: []
relates: [epic-24, epic-25]
blocked_by: [epic-25]
blocks: []
refs: [rule-3, edd-3, edd-8]
aliases: [mdkg-work-namespace, work-lifecycle-helpers]
skills: []
created: 2026-05-17
updated: 2026-05-17
---

# Goal

Add future lifecycle helpers under `mdkg work ...` for reusable contracts,
orders, receipts, and artifact registration.

# Scope

This namespace should make the reusable workflow loop ergonomic while keeping
mdkg as semantic memory and discovery rather than the canonical execution
database.

Intended command family:
- work contract discovery and inspection
- work order semantic mirror creation and status updates
- receipt semantic mirror creation and verification updates
- artifact/source registration against receipts and work orders

# Milestones

- Design `mdkg work ...` around hardened `WORK.md`, `WORK_ORDER.md`, and
  `RECEIPT.md` schemas.
- Commands mutate semantic mirror files only.
- Receipts can register artifact refs and archive sidecar refs without implying
  ledger or payment mutation.
- Packs include linked contract, order, receipt, feedback, dispute, proposal,
  and target context when appropriate.

# Out of Scope

- No ledger, payment, inventory, or marketplace mutation.
- No direct runtime execution engine inside mdkg.
- No canonical replacement for Postgres-backed production state.

# Risks

- A broad command namespace can expand the primary CLI surface too quickly.
- Operators may mistake semantic mirror updates for canonical execution state
  unless receipts and docs make the boundary explicit.
- Lifecycle helpers should not make manual Markdown review impossible.

# Links / Artifacts

- `epic-25`
- `epic-24`
- Future implementation should add command matrix and fixture coverage.
