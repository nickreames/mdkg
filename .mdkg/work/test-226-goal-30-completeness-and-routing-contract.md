---
id: test-226
type: test
title: goal-30 completeness and routing contract
status: done
priority: 1
tags: [mdkg-dev, goal-routing]
owners: []
links: []
artifacts: []
relates: [task-486]
blocked_by: [task-486]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Contract

`goal-30` is paused, routes to `task-489`, includes all scoped epics/tasks/tests, and has implementation, push, Vercel preview, and no-launch boundaries.

# Verification

- `node dist/cli.js goal show goal-30 --json`
- `node dist/cli.js goal next goal-30 --json`
- `node dist/cli.js pack goal-30 --pack-profile concise`
