---
id: task-437
type: task
title: align ingestion scope clean selected-goal state and activate goal-24
status: done
priority: 1
epic: epic-118
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-21
---
# Overview

Ground the ingestion pass, clear stale selection, and make goal-24 the single active local root goal for graph-only work.

# Acceptance Criteria

- Selected-goal state is intentionally moved from paused goal-23 to active goal-24.
- Expected IDs are grounded and no forbidden files are touched.
- Goal 24 route starts with this alignment task.

# Files Affected

- .mdkg/work/goal-24-*.md
- selected-goal state via mdkg CLI

# Implementation Notes

- Use CLI lifecycle commands for selected-goal state.
- Leave paused goal-23 unchanged.

# Test Plan

- node dist/cli.js goal current --json shows goal-24 during the pass.
- node dist/cli.js validate --summary --json --limit 20 is clean.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-118
- context: goal-23
