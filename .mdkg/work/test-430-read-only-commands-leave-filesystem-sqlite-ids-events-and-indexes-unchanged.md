---
id: test-430
type: test
title: Read-only commands leave filesystem SQLite IDs events and indexes unchanged
status: done
priority: 1
epic: epic-243
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: [task-770]
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove every declared-read-only route remains observational with missing, stale,
JSON, and SQLite cache configurations.

# Target / Scope

`task-770`; goal/work/receipt/validate plus loop/skill/manifest/index siblings.

# Preconditions / Environment

Fresh disposable graphs; state snapshots include path list, content hash, mtime,
events, IDs, SQLite rows, WAL/SHM, and selected-goal state.

# Test Cases

- Run each read command with cache absent, fresh, stale, malformed, and `--no-cache`.
- Compare before/after state byte-for-byte where deterministic.
- Assert no ID reservation, SQLite checkpoint, event append, index write, or file
  creation while returned data remains current.
- Descriptor write paths/effects match behavior and generated contracts.

# Results / Evidence

Pending. Attach machine-readable before/after state receipts.

# Notes / Follow-ups

- A correct but persisted cache rebuild fails this test.
