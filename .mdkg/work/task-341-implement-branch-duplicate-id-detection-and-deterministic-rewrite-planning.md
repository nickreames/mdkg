---
id: task-341
type: task
title: implement branch duplicate id detection and deterministic rewrite planning
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [branches, ids, fix, 0-3-6]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-138]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Extend duplicate-id handling from generic local `fix plan --family ids` support
to branch-conflict-aware detection and deterministic rewrite planning.

# Acceptance Criteria

- `mdkg validate --json` reports duplicate local ids with stable workspace and
  file-path diagnostics after a two-branch merge.
- `mdkg fix plan --family ids --json` groups duplicate ids deterministically.
- Candidate replacement ids are stable, collision-free, and preserve portable
  semantic ids where possible.
- Plans remain read-only and keep `apply_supported: false`.
- Plan hashes are stable across repeated runs on the same conflicted tree.

# Files Affected

- `src/commands/fix.ts`
- `src/commands/validate.ts`
- duplicate-id tests and fixtures

# Implementation Notes

- Reuse tolerant graph parsing so duplicate-id states can be planned even when
  normal indexing rejects them.
- Preserve the existing lower-risk duplicate-id planner for simple local
  duplicates; add branch-conflict-specific evidence fields instead of replacing
  it.

# Test Plan

- `node --test dist/tests/commands/fix.test.js`
- `node --test dist/tests/commands/validate.test.js`
- `test-138`

# Links / Artifacts

- `edd-21`
- `test-138`
