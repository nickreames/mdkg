---
id: task-486
type: task
title: create paused goal-30 with epics tasks and tests
status: done
priority: 1
tags: [mdkg-dev, goal, implementation-roadmap]
owners: []
links: []
artifacts: []
relates: [test-226]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create paused Goal 30 as the future implementation run for mdkg.dev public-alpha polish.

# Acceptance Criteria

- `goal-30` is `todo` and `goal_state: paused`.
- `goal-30` routes to `task-489`.
- Goal 30 includes epics `epic-147` through `epic-152`, tasks `task-489` through `task-498`, and tests `test-228` through `test-234`.
- Goal 30 explicitly allows implementation, logical commits, push, and Vercel preview validation when later activated.

# Files Affected

- `.mdkg/work/goal-30-*.md`
- `.mdkg/work/epic-147-*.md` through `.mdkg/work/epic-152-*.md`
- `.mdkg/work/task-489-*.md` through `.mdkg/work/task-498-*.md`
- `.mdkg/work/test-228-*.md` through `.mdkg/work/test-234-*.md`

# Test Plan

- `node dist/cli.js goal show goal-30 --json`
- `node dist/cli.js goal next goal-30 --json`

# Implementation Notes

# Links / Artifacts
