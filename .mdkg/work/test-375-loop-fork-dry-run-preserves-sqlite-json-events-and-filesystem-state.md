---
id: test-375
type: test
title: Loop fork dry run preserves SQLite JSON events and filesystem state
status: done
priority: 1
epic: epic-225
tags: [loop, dry-run, sqlite, json]
owners: []
links: []
artifacts: []
relates: [goal-61, task-702]
blocked_by: []
blocks: []
refs: [task-702]
context_refs: [goal-61, epic-225, edd-70, dec-67]
evidence_refs: [chk-409]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove loop fork dry-run is observational under SQLite and JSON and does not
consume the ID used by the next committed fork.

# Target / Scope

`task-702`; ID allocation, SQLite sequences/rows, JSON indexes, events, and
filesystem state.

# Preconditions / Environment

Fresh isolated workspaces with equivalent seeded loop templates in SQLite and
JSON modes; capture state before dry-run.

# Test Cases

- Compare DB rows/sequences, graph files, indexes, events, and IDs before/after.
- Run dry-run followed immediately by real fork and compare preview/committed ID.
- Repeat invalid-input dry-runs and verify no partial writes.

# Results / Evidence

PASS on 2026-07-10. The regression reproduced the pre-fix SQLite allocation
drift (`loop-2` after previewing `loop-1`). After the fix, JSON and SQLite both
preserved the complete `.mdkg` tree and the immediate committed fork reused the
previewed loop and child IDs.

# Notes / Follow-ups

- Any mutation is release-blocking.
