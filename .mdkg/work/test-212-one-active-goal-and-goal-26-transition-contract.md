---
id: test-212
type: test
title: one active goal and goal-26 transition contract
status: done
priority: 1
epic: epic-136
parent: goal-27
tags: [mdkg-dev, goal-lifecycle]
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
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Verify the graph has exactly one active root goal after the hosting alignment transition.

# Target / Scope

- `goal-26`
- `goal-27`
- `task-463`

# Preconditions / Environment

- Run from the mdkg repo root after graph alignment nodes are created.

# Test Cases

- `node dist/cli.js goal current --json` returns `goal-27`.
- `node dist/cli.js goal next goal-27 --json` returns `spike-15`.
- `node dist/cli.js doctor --strict --json` has no selected-goal or multiple-active-goal error.
- `goal-26` is paused and not selected.

# Results / Evidence

Record command output summaries in `task-471` or the final alignment checkpoint.

# Notes / Follow-ups

- If this fails, do not proceed to preview hosting execution.
