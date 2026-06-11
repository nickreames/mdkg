---
id: task-336
type: task
title: implement index and generated cache repair planning
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, index, cache, repair, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-335]
blocks: [task-339, test-137]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Add the `index` repair-family planner for generated index/cache health.

# Acceptance Criteria

- Missing generated index/cache artifacts produce low-risk planned changes.
- Stale or unreadable generated caches produce reviewable findings without
  crashing the whole plan.
- Planned changes include affected generated paths and non-mutating
  `command_hint` values such as `mdkg index`.
- The planner never runs `mdkg index` and never writes generated files.

# Files Affected

- `src/commands/fix.ts`
- `tests/commands/fix.test.ts`
- Future fixture directories for generated-cache states.

# Implementation Notes

- Treat generated files as repairable by command hint, not direct edits.
- Keep cache-corruption handling isolated from graph parsing when possible.

# Test Plan

- Fixture test with missing generated index files.
- Fixture test with stale cache metadata.
- Assert no files change during `fix plan`.

# Links / Artifacts

- `edd-19`
- `test-137`
- `chk-105`
