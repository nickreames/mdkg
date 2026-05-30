---
id: task-190
type: task
title: define writer leases cas snapshot commits and conflict receipts
status: todo
priority: 1
epic: epic-29
tags: [project-db, leases, snapshot, conflict]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-32, epic-33, task-185, task-187, task-188, task-189]
blocked_by: [task-185, task-187, task-188, task-189]
blocks: [task-191, task-193]
refs: []
aliases: [project-writer-leases]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define project-level writer leases and compare-and-swap snapshot commits for
parallel sandboxes that hydrate from the same base snapshot.

# Acceptance Criteria

- Project branch has at most one active writer lease.
- Lease records base snapshot hash.
- Result commits only if current snapshot hash still matches the base hash.
- Conflict outcomes discard or retry from latest snapshot and emit conflict
  receipts.
- Queue redelivery cannot corrupt state.

# Explicit Exclusions

- SQLite WAL local writer serialization is not treated as sufficient for
  independent sandbox snapshots.
- No commit without receipt.

# Files Affected

- Future lease store, snapshot pointer logic, receipt handling, and tests.

# Implementation Notes

Use project/branch-level compare-and-swap around snapshot hashes to coordinate
independent sandboxes.

# Test Plan

- Future tests simulate two sandboxes from the same base snapshot and prove one
  compare-and-swap commit wins while the other receives a conflict receipt.

# Links / Artifacts

- `epic-32`
- `epic-33`
- `task-185`
