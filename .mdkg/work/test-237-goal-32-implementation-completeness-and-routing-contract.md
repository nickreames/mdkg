---
id: test-237
type: test
title: goal-32 implementation completeness and routing contract
status: done
priority: 1
tags: [mdkg-dev, goal-routing]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-503]
blocks: [task-505]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [goal-paused, next-routes-task-507, all-implementation-nodes-scoped]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Validate that Goal 32 is ready but not started.

# Target / Scope

- Goal 32 state, route, scope refs, context refs, checks, and stop conditions.

# Test Cases

- `node dist/cli.js goal show goal-32 --json` shows paused implementation goal.
- `node dist/cli.js goal next goal-32 --json` returns `task-507`.
- Goal 32 covers P0/P1/P2/P3, Browser/Chrome/Product Design QA, push, Vercel previews, and no-launch boundaries.

# Results / Evidence

- Pending.
