---
id: task-132
type: task
title: compare work order receipt templates against runtime fixtures
status: todo
priority: 1
epic: epic-25
tags: [templates, work-order, receipt, runtime-contract, audit]
owners: []
links: []
artifacts: [.mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md]
relates: [epic-25, epic-26]
blocked_by: []
blocks: []
refs: [edd-3, edd-8]
aliases: [runtime-template-comparison]
skills: []
created: 2026-05-17
updated: 2026-05-17
---

# Overview

Audit mdkg's generic `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md` templates
against the current `omni-room-runtime` fixture contracts before schema
hardening.

# Acceptance Criteria

- Current mdkg templates are compared against real runtime fixture fields.
- The audit distinguishes generic mdkg schema needs from consumer-specific
  runtime overlay needs.
- Gaps are captured for input refs, output descriptors, artifact refs, cost
  refs, proof or attestation refs, and verification status.
- The resulting recommendation keeps official npm package language generic and
  unbranded.

# Files Affected

- `.mdkg/templates/default/work.md`
- `.mdkg/templates/default/work_order.md`
- `.mdkg/templates/default/receipt.md`
- `src/graph/agent_file_types.ts`
- `tests/commands/agent_file_types.test.ts`

# Implementation Notes

- Use `/Users/nick/git/omni-room-runtime` as consumer evidence, not as public
  naming for mdkg.
- Preserve Postgres as canonical for production orders, receipts, disputes,
  ledger, payment, and marketplace state.
- Keep mdkg mirrors focused on committed semantic records, demos, fixtures,
  proposals, and reviewable evidence.

# Test Plan

- This audit task should produce a schema proposal and fixture comparison.
- Later implementation should add validation fixtures before command helpers.

# Links / Artifacts

- `epic-25`
- `/Users/nick/git/omni-room-runtime`
