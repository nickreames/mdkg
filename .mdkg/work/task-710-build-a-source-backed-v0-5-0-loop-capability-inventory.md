---
id: task-710
type: task
title: Build a source backed v0.5.0 loop capability inventory
status: todo
priority: 1
epic: epic-229
prev: test-400
next: task-711
tags: [release, capabilities, evidence, planning]
owners: []
links: []
artifacts: []
relates: [goal-62, test-383]
blocked_by: [test-400]
blocks: [task-711]
refs: [test-383]
context_refs: [goal-61, goal-62, epic-229, edd-70, edd-71, dec-67, dec-68, dec-73, test-400]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Build the release truth packet from completed source, tests, CLI output, package
contents, and corrected loop dogfood before any public narrative is drafted.

# Acceptance Criteria

- Inventory every user-visible loop command, metadata concept, seed, compatibility
  promise, limitation, and runtime boundary shipping in v0.5.0.
- Cover all seven seeded templates, readiness questions and approvals,
  provenance/stale-fork behavior, continuation routing, evidence and closeout,
  and observational dry-run/read guarantees.
- Each fact cites source/test/CLI/package/dogfood evidence.
- Unproven behavior is labeled Missing and excluded from release claims.

# Files Affected

List files/directories expected to change.

- mdkg graph planning/evidence nodes only
- No public source files in this planning task

# Implementation Notes

- Separate package/runtime truth, docs/reference truth, and positioning.
- Include residual public-alpha limitations.
- State explicitly that mdkg preserves loop state while an external coding-agent
  harness executes agents and tools.
- Treat dogfood as evidence for the claim ledger, not copyable public output.

# Test Plan

Run `test-383`, compare the inventory to the Goal 1 checkpoint, and pack it for
the Sales and Product Design tasks.

# Links / Artifacts

- `goal-61`
- `edd-71`
- `dec-73`
- `test-400`
