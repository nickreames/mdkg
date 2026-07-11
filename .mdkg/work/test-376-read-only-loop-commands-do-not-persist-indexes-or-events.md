---
id: test-376
type: test
title: Read only loop commands do not persist indexes or events
status: done
priority: 1
epic: epic-225
tags: [loop, read-only, index, events]
owners: []
links: []
artifacts: []
relates: [goal-61, task-703]
blocked_by: []
blocks: []
refs: [task-703]
context_refs: [goal-61, epic-225, edd-70, dec-67]
evidence_refs: [chk-409]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove every descriptor-declared loop read command works from a missing or stale
index without persisting cache, SQLite, event, or graph changes.

# Target / Scope

`task-703`; loop list/show/plan/runs/next and reusable index projection.

# Preconditions / Environment

Clean JSON and SQLite fixtures with fresh, stale, and absent indexes.

# Test Cases

- Snapshot state around each read command in every index condition.
- Compare command output with a persisted-index baseline.
- Confirm descriptors continue declaring no side effects.

# Results / Evidence

PASS on 2026-07-10. Loop list/show/plan/next/runs rebuilt missing and stale JSON
and SQLite indexes in memory while complete `.mdkg` snapshots remained equal.
Outputs remained usable and the complete loop suite passed 14/14.

# Notes / Follow-ups

- Generic command adoption remains `goal-60` follow-up.
