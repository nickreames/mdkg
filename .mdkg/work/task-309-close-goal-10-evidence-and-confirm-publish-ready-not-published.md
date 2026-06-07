---
id: task-309
type: task
title: close goal-10 evidence and confirm publish-ready not published
status: done
priority: 1
epic: epic-64
parent: goal-10
tags: [closeout, release, evidence]
owners: []
links: []
artifacts: [mdkg://goal-10, mdkg://epic-64, tests://goal-next, evidence://publish-ready-not-published]
relates: []
blocked_by: [task-308]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Close `goal-10` only after every scoped task/test/epic is done and the goal has
publish-ready, not-published evidence.

# Acceptance Criteria

- Scoped tasks, tests, and `epic-64` are done.
- Required checks and dry-run logs are recorded.
- `node dist/cli.js goal next goal-10 --json` returns no actionable node.
- `node dist/cli.js goal evaluate goal-10 --json` reports completion evidence.
- Goal says publish-ready, not published.

# Files Affected

- `goal-10`
- `epic-64`

# Implementation Notes

- Parent epic closeout remains a manual markdown status/evidence edit.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-10 --json`
- `node dist/cli.js goal evaluate goal-10 --json`
- `git diff --check`

# Links / Artifacts

- `task-308`
- `test-121`
