---
id: task-204
type: task
title: implement goal cli report only and next selection
status: done
priority: 1
epic: epic-36
prev: task-203
next: task-205
tags: [goal, cli, next, evaluation]
owners: []
links: []
artifacts: []
relates: [epic-36, prd-3, edd-10, task-203]
blocked_by: []
blocks: [task-205, task-206]
refs: [rule-3]
aliases: [goal-cli]
skills: []
created: 2026-05-31
updated: 2026-05-31
---

# Overview

Add the initial `mdkg goal ...` command surface for report-only inspection,
state management, evaluation, and goal-scoped next selection.

# Acceptance Criteria

- `mdkg goal show <goal-id> --json` reports the goal condition, goal state,
  active node, required skills, required checks, and source path.
- `mdkg goal next <goal-id>` selects concrete work related to the goal and does
  not return the goal node itself.
- `mdkg goal evaluate <goal-id>` is report-only: it summarizes required checks
  and evidence fields but does not run scripts.
- `mdkg goal pause|resume|done <goal-id>` updates goal state consistently.
- Unknown, ambiguous, or imported read-only goal qids fail with existing
  resolver/read-only guidance.
- Normal `mdkg next` remains unchanged for existing concrete work workflows.

# Files Affected

- `src/commands/goal.ts`
- `src/cli.ts`
- CLI help snapshot and command matrix tests

# Implementation Notes

- Keep command receipts deterministic for JSON output.
- Prefer existing qid resolution, mutation lock, atomic write, and task command
  patterns.
- Do not execute shell commands from `required_checks`.

# Test Plan

- CLI tests for `show`, `next`, `evaluate`, `pause`, `resume`, and `done`.
- Regression test proving `mdkg next` does not select goals.
- Imported qid mutation guard test if imported goal nodes are visible through
  subgraphs.

# Verification Evidence

- Added `src/commands/goal.ts` and CLI dispatch/help for
  `mdkg goal show/next/evaluate/pause/resume/done`.
- `tests/commands/goal.test.ts` covers deterministic `show`, report-only
  `evaluate`, goal-scoped `next`, and pause/resume/done state updates.
- `tests/commands/next.test.ts` proves normal `mdkg next` excludes `goal`
  nodes.
- `npm run cli:check` passed with goal help and command matrix entries.

# Links / Artifacts

- `task-203`
- `task-205`
- `task-206`
