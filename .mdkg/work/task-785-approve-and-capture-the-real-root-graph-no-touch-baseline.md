---
id: task-785
type: task
title: Approve and capture the real root graph no-touch baseline
status: done
priority: 0
epic: epic-252
tags: [release, approval, root-graph, baseline]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-784, test-445]
blocks: [task-786]
refs: [goal-71, edd-77, dec-83]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-15
---
# Overview

Reinspect the real root graph immediately before its approved consumer proof and
capture enough evidence to distinguish intended local archive outputs from every
read-only or unrelated path.

# Acceptance Criteria

- Confirm the earlier release approval covers global replacement and root command
  execution; otherwise stop for a new approval.
- Classify unrelated tracked/untracked state without moving, deleting, staging,
  or editing it.
- Record local raw/ZIP/sidecar hashes, imported bundle hashes, child repo
  HEAD/tree/status, gitlinks, materializations, and current mdkg validation.
- Stale subgraph warnings are recorded separately from mutation evidence.

# Files Affected

List files/directories expected to change.

- `/Users/nick/omni-chat-rooms` read-only baseline evidence.
- Goal 71 checkpoint/evidence nodes.

# Implementation Notes

- Untracked directories may remain only with explicit operator acknowledgment.
- Do not run archive compression in this task.

# Test Plan

Close `test-446` only when the baseline is complete and repeatable.

# Links / Artifacts

- `test-446`
