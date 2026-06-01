---
id: task-210
type: task
title: add selected goal local state and goal select current clear
status: done
priority: 1
epic: epic-37
prev: task-209
next: task-211
tags: [goal, cli, local-state, ux]
owners: []
links: []
artifacts: [src/commands/goal.ts, src/cli.ts, .gitignore]
relates: [epic-37, task-211, task-214]
blocked_by: [task-209]
blocks: [task-211, task-214]
refs: [rule-3, rule-4]
aliases: [selected-goal]
skills: []
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Add ignored local selected-goal state so agents can run `mdkg goal next`
without repeating the goal id every iteration.

# Acceptance Criteria

- `mdkg goal select <goal-id-or-qid> [--json]` writes
  `.mdkg/state/selected-goal.json`.
- `mdkg goal current [--json]` reports the selected goal, stale selection
  diagnostics, or unique active goal fallback.
- `mdkg goal clear [--json]` removes selected-goal state if present.
- `.mdkg/state/` is ignored by init and upgrade guidance.
- Repo validation does not depend on selected-goal state.

# Files Affected

- `src/commands/goal.ts`
- `src/cli.ts`
- `.gitignore`
- `src/commands/init.ts`
- `src/commands/upgrade.ts`

# Implementation Notes

- Selected-goal state is local ignored convenience state only; stale or absent
  selection never fails repo validation.

# Test Plan

- Unit/CLI tests for select/current/clear and stale selection.
- Fresh temp smoke with selected goal.

# Verification Evidence

- `mdkg goal select/current/clear` was implemented with ignored local state at
  `.mdkg/state/selected-goal.json`.
- `npm run test` and `npm run smoke:goal` passed.

# Links / Artifacts

- `task-209`
- `task-211`
