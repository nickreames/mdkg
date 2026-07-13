---
id: task-771
type: task
title: Repair workflow event import identity and changed-only validation completeness
status: done
priority: 1
epic: epic-243
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Preserve full workflow identity and warning coverage across imported work triggers,
event history, and changed-only validation.

# Acceptance Criteria

- Close exactly `cand-review-011-004` and `cand-review-011-006`.
- Imported triggers retain subgraph-qualified identity through order creation and
  event logging; no orphan order can be created without a durable event.
- Mutation and event append either commit together or fail with recoverable state.
- Changed-only validation includes file-level warnings for newly created workflow
  directories without widening to unrelated repository noise.
- Existing work contract/order/receipt semantics remain unchanged.

# Files Affected

List files/directories expected to change.

- Work invocation/import/order and event commands
- Event log and workflow identity helpers
- Changed-only validation path discovery and warning aggregation

# Implementation Notes

- Use qualified identities as structured data, not string truncation.
- Validate the final mutated graph before claiming an event/receipt.
- Keep semantic mirrors separate from runtime marketplace state.

# Test Plan

Exercise local and subgraph-qualified triggers, append failures, retries, and newly
created workflow directories. Assert no orphan state and complete changed-only
warnings, then run work/event/validation smokes plus `test-431`.

# Links / Artifacts

- `epic-243`, `test-431`
