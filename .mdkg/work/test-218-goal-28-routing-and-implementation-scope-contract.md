---
id: test-218
type: test
title: goal-28 routing and implementation scope contract
status: todo
priority: 1
epic: epic-137
parent: goal-28
tags: []
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

Validate that `goal-28` is a paused implementation roadmap after creation and cannot be mistaken for completed preview hosting.

# Target / Scope

- `goal-28`
- `task-472`

# Preconditions / Environment

- `goal-27` is committed and achieved.
- `goal-28` has been created but not executed.

# Test Cases

- `node dist/cli.js goal show goal-28 --json` shows `goal_state: paused`, `status: todo`, and `active_node: task-472`.
- `node dist/cli.js goal next goal-28 --json` returns `task-472` without warnings.
- `git status --short --branch` shows no source/site/docs implementation changes from the creation-only pass.

# Results / Evidence

Pending future execution.

# Notes / Follow-ups

- This test should be closed during the goal-28 creation-only closeout, not during preview deployment.
