---
id: task-212
type: task
title: add explicit goal claim set active behavior
status: done
priority: 1
epic: epic-37
prev: task-211
next: task-213
tags: [goal, cli, active-node, mutation]
owners: []
links: []
artifacts: [src/commands/goal.ts, tests/commands/goal.test.ts]
relates: [epic-37, task-211, task-214]
blocked_by: [task-211]
blocks: [task-214]
refs: [rule-3, rule-4]
aliases: [goal-claim]
skills: []
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Add explicit active-node mutation so the short `goal next` loop remains
read-only but agents can durably claim selected work.

# Acceptance Criteria

- `mdkg goal claim [goal-id-or-qid] <work-id-or-qid> [--json]` writes
  `active_node`.
- No-id `goal claim <work-id>` uses selected goal or unique active goal.
- Claim rejects work outside goal scope.
- Claim rejects imported/read-only qids.
- Claim updates `updated`, reindexes when configured, and emits an automatic
  event when events are enabled.

# Files Affected

- `src/commands/goal.ts`
- `src/cli.ts`
- `tests/commands/goal.test.ts`

# Implementation Notes

- `goal claim` is the only selected-goal command in this slice that mutates
  committed graph state; `goal next` remains read-only.

# Test Plan

- Unit/CLI tests for claim with explicit goal, selected goal, out-of-scope work,
  and imported/read-only diagnostics.
- Fresh temp smoke claims returned work before execution.

# Verification Evidence

- `mdkg goal claim` writes `active_node` explicitly while `mdkg goal next`
  remains read-only.
- Claim behavior was verified by unit tests and packed `smoke:goal`.

# Links / Artifacts

- `task-211`
- `task-213`
