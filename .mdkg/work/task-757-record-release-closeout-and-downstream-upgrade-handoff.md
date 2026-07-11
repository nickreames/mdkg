---
id: task-757
type: task
title: record release closeout and downstream upgrade handoff
status: todo
priority: 1
parent: goal-67
prev: task-756
tags: [goal-67, closeout, downstream-handoff]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [task-756]
blocks: []
refs: [goal-67]
context_refs: [goal-66, edd-73]
evidence_refs: []
aliases: [materialize-release-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Close the release with exact immutable evidence and a product-neutral handoff
for repositories that need to upgrade and consume materialization.

# Acceptance Criteria

- Checkpoint records version, commits, registry integrity, installs, validation,
  dirty state, approved side effects, no-tag status, and residual risks.
- Handoff names the command/schema/receipt capability and compatibility floor
  without downstream product policy.
- Goal evaluation returns achieved with no remaining scoped work.

# Files Affected

- Release checkpoint and downstream handoff nodes.

# Implementation Notes

Downstream upgrades and runtime execution are separate repository-owned goals.

# Test Plan

- `test-419`
- Goal show/next/evaluate and final validation.

# Links / Artifacts

- Published package receipt
