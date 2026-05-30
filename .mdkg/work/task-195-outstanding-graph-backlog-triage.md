---
id: task-195
type: task
title: outstanding graph backlog triage
status: done
priority: 1
epic: epic-35
tags: [roadmap, graph, backlog, triage]
owners: []
links: []
artifacts: [node dist/cli.js list --type epic --json, node dist/cli.js list --type task --status todo --json, node dist/cli.js list --type task --status progress --json]
relates: [epic-35, epic-13, epic-17, epic-18, epic-20, epic-21, epic-29, epic-30, epic-31, epic-32, epic-33, epic-34]
blocked_by: []
blocks: [task-200, task-201]
refs: []
aliases: [backlog-triage]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Classify outstanding mdkg work so release planning is based on the actual graph
rather than recent chat context alone.

# Acceptance Criteria

- Classify open epics/tasks as active, stale, duplicate, blocked, maintenance,
  or future.
- Explicitly inspect `epic-13`, `epic-17`, `epic-18`, `epic-20`, `epic-21`,
  and `epic-29` through `epic-34`.
- Recommend close, downgrade, defer, or implement-next action for each open
  roadmap item.
- Confirm no obsolete blocker edges prevent `epic-21` implementation planning.

# Files Affected

- `.mdkg/work/task-195-outstanding-graph-backlog-triage.md`
- Existing mdkg epic/task nodes if triage evidence requires status updates.

# Implementation Notes

Older residual epics should not automatically block the current roadmap. They
should either close with evidence, remain low-priority maintenance, or link to a
specific future release task.

# Test Plan

- `node dist/cli.js list --type epic --json`
- `node dist/cli.js list --type task --json`
- `node dist/cli.js show epic-13 --json`
- `node dist/cli.js show epic-17 --json`
- `node dist/cli.js show epic-18 --json`
- `node dist/cli.js show epic-21 --json`

# Audit Evidence

- `node dist/cli.js list --type task --status progress --json` returned zero
  tasks.
- Outstanding `todo` tasks after this audit are expected to be consumer
  handoff, `epic-21` implementation, and future project DB roadmap tasks.
- `epic-13`: stale low-priority residual coverage hardening; does not block the
  current release line.
- `epic-17`: old review-state release/config cleanup; treat as historical
  maintenance unless a specific regression reopens it.
- `epic-18`: low-priority upgrade workflow enhancement bucket; current
  upgrade smoke passes and it does not block `epic-21`.
- `epic-20`: implementation work for SQLite/parallel hardening is effectively
  complete; remaining open child is post-publish handoff `task-171`.
- `epic-21`: active next implementation epic; tasks `172` through `180` define
  the subgraph orchestration release.
- `epic-29` through `epic-34`: future project application DB roadmap after
  `epic-21`.

# Decision

No older residual epic blocks the next implementation pass. `epic-21` remains
the highest-priority active roadmap item after committing the audit/release
state.

# Links / Artifacts

- `epic-35`
- `task-200`
- `task-201`
