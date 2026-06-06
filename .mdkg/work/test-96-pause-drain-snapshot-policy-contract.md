---
id: test-96
type: test
title: pause drain snapshot policy contract
status: done
priority: 1
epic: epic-31
parent: goal-7
tags: [project-db, queue, snapshot, test]
owners: []
links: []
artifacts: []
relates: [goal-7, task-263, task-261]
blocked_by: [task-263]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Validate queue-aware snapshot sealing rules.

# Target / Scope

`mdkg db snapshot seal` queue policy behavior and manifest/receipt summaries.

# Preconditions / Environment

Project DB with queue control migration applied.

# Test Cases

- Default drain policy fails with ready messages.
- Paused policy succeeds with ready messages only when the queue is paused.
- Any leased message blocks both drain and paused policies.
- Terminal acked/dead_letter messages do not block drain policy.
- Seal receipts and manifests include queue policy and queue status counts.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Snapshot verify remains backward compatible with older manifests.
