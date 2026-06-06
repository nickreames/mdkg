---
id: task-263
type: task
title: snapshot queue policy gate
status: done
priority: 1
epic: epic-31
parent: goal-7
tags: [project-db, queue, snapshot, policy]
owners: []
links: []
artifacts: []
relates: [goal-7, epic-31, epic-33, task-261, test-96]
blocked_by: [task-261]
blocks: [task-264, test-96]
refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Make project DB snapshot sealing queue-aware so repos can commit sealed state
only after draining delivery work or explicitly pausing queues.

# Acceptance Criteria

- `mdkg db snapshot seal --queue-policy drain` is the default.
- Drain policy fails when any queue has ready or leased messages.
- `--queue-policy paused` allows ready messages only when their queues are
  paused and fails on leased messages.
- Seal receipts and manifests include queue policy and queue status summaries.
- Snapshot status/verify remains backward-compatible for existing manifests.

# Files Affected

- `src/core/project_db_snapshot.ts`
- `src/commands/db.ts`
- `src/cli.ts`

# Implementation Notes

- Keep snapshot verify non-mutating.
- Do not require terminal acked/dead_letter rows to be deleted before sealing.

# Test Plan

- Tests cover active-ready default failure, paused policy success, leased failure,
  and drained default success.

# Links / Artifacts

- related docs
- related issues
- references
