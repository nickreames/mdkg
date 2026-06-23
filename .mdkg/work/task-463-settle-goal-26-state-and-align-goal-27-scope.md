---
id: task-463
type: task
title: settle goal-26 state and align goal-27 scope
status: done
priority: 1
epic: epic-136
parent: goal-27
tags: [mdkg-dev, alignment, goal-lifecycle]
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
updated: 2026-06-22
---
# Overview

Confirm `goal-26` is paused, explain why, and make `goal-27` the single active hosting-planning lane.

# Acceptance Criteria

- `goal-26` has `goal_state: paused` and records that local Browser E2E completed.
- `goal-27` is active and selected.
- `mdkg goal current --json` returns `goal-27`.
- `mdkg goal next goal-27 --json` routes to `spike-15`.

# Files Affected

- `.mdkg/work/goal-26-*`
- `.mdkg/work/goal-27-*`

# Implementation Notes

- This is graph-only lifecycle alignment.
- Do not close `goal-26` as achieved unless a later release-specific dry-run blocker is explicitly resolved or accepted.

# Test Plan

Run `node dist/cli.js goal current --json`, `node dist/cli.js goal next goal-27 --json`, `node dist/cli.js validate --summary --json --limit 20`, and `node dist/cli.js doctor --strict --json`.

# Links / Artifacts

- `goal-26`
- `goal-27`
- `test-212`
