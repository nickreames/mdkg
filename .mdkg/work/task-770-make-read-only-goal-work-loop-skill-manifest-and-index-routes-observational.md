---
id: task-770
type: task
title: Make read-only goal work loop skill manifest and index routes observational
status: done
priority: 1
epic: epic-243
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Ensure commands advertised as read-only use non-persisting projections and leave
filesystem, SQLite IDs/WAL state, events, and derived indexes unchanged.

# Acceptance Criteria

- Close exactly `cand-review-001-004` and `cand-review-011-005`.
- Inventory descriptor-backed goal/work/status/receipt/validation routes plus
  loop/skill/manifest/index siblings and reconcile declared side effects.
- Missing or stale caches rebuild in memory for observational commands.
- Read-only SQLite opens do not reserve IDs, checkpoint WAL, or persist an index.
- JSON/MD/XML/TOON envelopes and deterministic results remain compatible.

# Files Affected

List files/directories expected to change.

- Goal, work, task, loop, skill, manifest/spec, validate, and index loaders
- Command descriptors and generated contracts
- JSON/SQLite cache projection helpers and purity tests

# Implementation Notes

- Do not solve purity by returning stale data.
- Centralize persistence choice below command wrappers so descriptors and behavior
  cannot drift independently.
- Coordinate forged-cache handling with `task-767`.

# Test Plan

Snapshot path lists, mtimes/hashes, SQLite IDs/WAL/SHM, and event/index state before
and after each command with missing and stale caches. Require byte-identical state,
then run CLI/SQLite/parallel/loop/skill smokes and `test-430`.

# Links / Artifacts

- `epic-243`, `task-767`, `test-430`
