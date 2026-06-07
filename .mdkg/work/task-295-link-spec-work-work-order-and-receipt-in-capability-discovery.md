---
id: task-295
type: task
title: link SPEC WORK WORK_ORDER and RECEIPT in capability discovery
status: done
priority: 2
epic: epic-59
parent: goal-9
prev: task-294
next: task-296
tags: [capability-index, spec, work, receipt]
owners: []
links: []
artifacts: [src/graph/capabilities_indexer.ts]
relates: [goal-9, epic-59, test-115]
blocked_by: [task-294]
blocks: [task-296, test-115]
refs: [edd-15]
aliases: [spec-work-receipt-capability-chain]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Make capability discovery useful for orchestrators by connecting reusable
capability surfaces to contracts, invocations, and final evidence.

# Acceptance Criteria

- SPEC records can show related work contracts.
- Work records can show order/receipt refs when indexed.
- Capability search can find the dogfood chain.

# Files Affected

- `src/graph/capabilities_indexer.ts`
- `tests`

# Implementation Notes

- Discovery must remain read-only and visibility-aware.

# Test Plan

- Capability index tests.
- `node dist/cli.js capability search "SPEC WORK_ORDER RECEIPT" --json`
- `npm run smoke:capabilities`

# Links / Artifacts

- `test-115`
