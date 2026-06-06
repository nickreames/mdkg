---
id: task-190
type: task
title: implement writer leases cas snapshot commits and conflict receipts
status: done
priority: 1
epic: epic-32
parent: goal-4
tags: [project-db, leases, snapshot, conflict]
owners: []
links: []
artifacts: [src/core/project_db_events.ts]
relates: [epic-29, epic-32, epic-33, task-185, task-187, task-188, task-189, goal-4]
blocked_by: []
blocks: [task-191, task-193, task-248]
refs: [goal-4]
aliases: [project-writer-leases]
skills: []
created: 2026-05-27
updated: 2026-06-04
---

# Overview

Implement project-level writer leases and compare-and-swap snapshot commits for
parallel sandboxes that hydrate from the same base snapshot.

# Acceptance Criteria

- Project branch has at most one active writer lease.
- Lease records base snapshot hash.
- Result commits only if current snapshot hash still matches the base hash.
- Conflict outcomes discard or retry from latest snapshot and emit conflict
  receipts.
- Queue redelivery cannot corrupt state.
- Lease acquisition, commit, release, expiry, and conflict paths are
  deterministic in tests.

# Explicit Exclusions

- SQLite WAL local writer serialization is not treated as sufficient for
  independent sandbox snapshots.
- No commit without receipt.

# Files Affected

- `src/core/project_db_events.ts`
- Lease/CAS unit tests.

# Implementation Notes

Use project/branch-level compare-and-swap around snapshot hashes to coordinate
independent sandboxes. This does not implement the future queue-backed worker
runtime.

# Test Plan

- Unit tests simulate two sandboxes from the same base snapshot and prove one
  compare-and-swap commit wins while the other receives a conflict receipt.

# Links / Artifacts

- `epic-32`
- `epic-33`
- `epic-29`
- `task-185`
- `goal-4`

# Completion Evidence

- Implemented `project_branch_state` and `project_writer_lease` migration
  support plus helper APIs for acquire, commit, release, expiry, and stats.
- CAS commits validate lease ownership and base snapshot hash before updating
  branch state; stale writers receive deterministic conflict receipts.
- Unit and packed smoke tests simulate competing writers and lease expiry.
