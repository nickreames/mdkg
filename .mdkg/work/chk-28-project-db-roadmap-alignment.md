---
id: chk-28
type: checkpoint
title: project db roadmap alignment
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-249]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-249]
created: 2026-06-04
updated: 2026-06-04
---
# Summary

Closed the mdkg-only project DB roadmap alignment task after the `0.1.9`
foundation release. The graph now has one active project DB umbrella goal
(`goal-5`), achieved foundation goals are retained as refs instead of active
traversal edges, and future work routes toward the queue-backed materializer
path.

# Scope Covered

- `goal-5`
- `epic-20`
- `epic-29`
- `epic-32`
- `epic-33`
- `epic-34`
- `task-191`
- `task-193`
- `task-232`
- `task-233`
- `task-234`
- `task-249`
- `task-250`
- `task-251`
- `test-85`
- `test-86`
- `test-87`

# Decisions Captured

- Keep `epic-32` done because event, receipt, reducer, lease, and CAS
  foundations shipped in `0.1.9`.
- Keep `epic-33` in progress because queue primitives are shipped but
  materializer integration remains pending.
- Keep `epic-34` todo because profile/export/privacy work remains deferred
  until materializer readiness exists.
- Keep achieved goals as `refs` on `goal-5` so the live route remains focused
  on actionable project DB work.

# Implementation Summary

Created `goal-5`, the alignment/control nodes, and future materializer/profile
test nodes. Updated existing project DB epics and tasks so the graph reflects
completed `0.1.9` foundation work while keeping the next functional path on
`task-191`.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js goal select goal-5 --json`
- `node dist/cli.js goal next goal-5 --json` returned `task-249` before closeout.
- `node dist/cli.js task done task-249 --checkpoint "project db roadmap alignment" --json`

# Known Issues / Follow-ups

- `test-85` must close only after final route verification confirms
  `goal-5.active_node` and `goal next goal-5` point at `task-191`.
- Functional materializer implementation remains deferred to `task-191` and
  follow-on tasks.

# Links / Artifacts

- `goal-5`
- `task-191`
- `task-249`
- `test-85`
