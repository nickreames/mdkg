---
id: task-211
type: task
title: add recursive goal next scope traversal and optional id resolution
status: done
priority: 1
epic: epic-37
prev: task-210
next: task-212
tags: [goal, cli, traversal, next]
owners: []
links: []
artifacts: [src/commands/goal.ts, tests/commands/goal.test.ts]
relates: [epic-37, task-209, task-210, task-212]
blocked_by: [task-209, task-210]
blocks: [task-212, task-213, task-214]
refs: [rule-3]
aliases: [recursive-goal-next]
skills: []
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Make `mdkg goal next` resolve the active goal when no id is supplied and select
one actionable scoped item at a time.

# Acceptance Criteria

- Explicit `mdkg goal next <goal-id>` still works.
- No-id `goal next` uses selected goal first.
- If no selected goal exists, no-id `goal next` uses exactly one active progress
  goal.
- Multiple active goals without selection fail with select guidance.
- Scope traversal starts from `scope_refs`, includes direct compatibility refs,
  expands descendants through `epic` and `parent`, and does not transitively
  traverse arbitrary `relates`.
- Candidate return types are `feat`, `task`, `bug`, and `test`.
- Done, imported, read-only, and non-actionable nodes are excluded.

# Files Affected

- `src/commands/goal.ts`
- `src/graph/goal_scope.ts`
- `tests/commands/goal.test.ts`

# Implementation Notes

- No-id resolution order is explicit id, selected local goal, then exactly one
  active progress goal. Multiple candidates require explicit selection.

# Test Plan

- Unit/CLI tests for no-id resolution, recursive scope, unrelated priority
  isolation, completed item skipping, and feature candidates.
- Fresh temp smoke for two epics and multiple actionable items.

# Verification Evidence

- Recursive goal scope traversal was implemented through explicit `scope_refs`,
  `epic`, and `parent` edges.
- Optional-id `mdkg goal next` resolution was verified by unit tests and
  `npm run smoke:goal`.

# Links / Artifacts

- `task-210`
- `task-212`
