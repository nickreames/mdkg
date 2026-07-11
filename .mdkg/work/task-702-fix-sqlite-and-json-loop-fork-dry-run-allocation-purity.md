---
id: task-702
type: task
title: Fix SQLite and JSON loop fork dry run allocation purity
status: done
priority: 1
epic: epic-225
next: task-703
tags: [loop, dry-run, sqlite, json]
owners: []
links: []
artifacts: []
relates: [goal-61, test-375]
blocked_by: []
blocks: [task-703]
refs: [test-375]
context_refs: [goal-61, epic-225, edd-70, dec-67]
evidence_refs: [chk-409]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Reproduce and fix `mdkg loop fork --dry-run` consuming a durable numeric ID in
SQLite. Apply the same observational contract to the JSON backend and any event
or filesystem planning path.

# Acceptance Criteria

- A dry-run can preview the next ID but does not reserve or advance it.
- SQLite rows/sequences, JSON indexes, events, IDs, and repository files are
  unchanged before versus after dry-run.
- An immediate real fork receives the same next ID absent a concurrent writer.

# Files Affected

List files/directories expected to change.

- `src/commands/loop.ts`
- ID allocation and persistence helpers used by loop fork
- `tests/commands/loop.test.ts` and packaged-backend fixtures

# Implementation Notes

- Keep preview IDs explicitly tentative under concurrency.
- Reservation belongs only to committed execution.

# Test Plan

Run `test-375` against SQLite and JSON, then exercise dry-run followed by real
fork from an isolated packaged workspace.

# Links / Artifacts

- `edd-70`
- `dec-67`
- Evidence: focused regression first failed under SQLite with `loop-2 !== loop-1`,
  then passed for JSON and SQLite after reservation moved to committed execution.
- Verification: `node --test dist/tests/commands/loop.test.js` passed 14/14 on
  2026-07-10.
