---
id: task-260
type: task
title: graph release scope alignment
status: done
priority: 1
epic: epic-33
parent: goal-7
tags: [project-db, queue, release, graph]
owners: []
links: []
artifacts: []
relates: [goal-7, goal-3, goal-5, goal-6, epic-29, epic-31, epic-33]
blocked_by: []
blocks: [task-261, task-262, task-263, task-264, task-265, test-95, test-96, test-97]
refs: []
aliases: []
skills: [pursue-mdkg-goal, select-work-and-ground-context]
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Align mdkg graph state around the public queue CLI release and make `goal-7`
the active release lane for `0.2.0`.

# Acceptance Criteria

- `goal-6` is paused while public queue release work takes priority.
- `goal-7` owns the queue CLI release tasks, tests, and required checks.
- Existing internal queue foundation nodes remain accurate historical context.
- `mdkg goal next goal-7` routes to the first unfinished queue release node.

# Files Affected

- `.mdkg/work/goal-7-publish-public-project-db-queue-command-surface-for-0-2-0.md`
- `.mdkg/work/task-260-*.md`
- `.mdkg/work/task-261-*.md` through `.mdkg/work/task-265-*.md`
- `.mdkg/work/test-95-*.md` through `.mdkg/work/test-97-*.md`

# Implementation Notes

- Keep this task scoped to graph release alignment.
- Do not tag, push, or publish from this task.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js goal select goal-7 --json`
- `node dist/cli.js goal next goal-7 --json`

# Links / Artifacts

- `goal-7`
