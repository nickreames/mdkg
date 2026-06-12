---
id: task-369
type: task
title: close goal-14 evidence and handoff mdkg.dev dogfood
status: todo
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, closeout, mdkg-dev, handoff]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-351, task-368, test-156]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Close `goal-14` only after spike implementation, hardening, dogfood, and
`0.3.2` dry-run release-candidate evidence are complete. The closeout should
handoff mdkg.dev dogfood findings into paused `goal-15`.

# Acceptance Criteria

- `goal-14` completion evidence summarizes implementation, docs, hardening,
  smoke, dogfood, and dry-run release readiness.
- `goal next goal-14 --json` returns no actionable node, or only blocked/deferred
  nodes with explicit explanation.
- Paused `goal-15` has enough spike-backed evidence to resume at `task-354`.
- No real npm publish, git tag, push, or global install occurs.

# Files Affected

- `.mdkg/work/goal-14-*`
- `.mdkg/work/goal-15-*`
- completion checkpoint nodes

# Implementation Notes

- Create a checkpoint for the final goal closeout.
- Keep mdkg.dev implementation deferred; this is evidence and handoff only.
- Explicitly state remaining deferred work from `goal-11` and `goal-15`.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-14 --json`
- `node dist/cli.js goal evaluate goal-14 --json`
- `git diff --check`

# Links / Artifacts

- `goal-14`
- `goal-15`
- `task-351`
- `task-368`
