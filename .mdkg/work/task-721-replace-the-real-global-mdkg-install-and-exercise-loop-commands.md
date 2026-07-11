---
id: task-721
type: task
title: Replace the real global mdkg install and exercise loop commands
status: todo
priority: 1
epic: epic-234
prev: task-720
next: task-722
tags: [release, global-install, loop, verification]
owners: []
links: []
artifacts: []
relates: [goal-64, test-392]
blocked_by: [task-720]
blocks: [task-722]
refs: [test-392]
context_refs: [goal-64, epic-234, edd-72, dec-69, task-720]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Replace the actual `/opt/homebrew` global mdkg package with registry `0.5.0` and
prove the user's normal command path exercises the released artifact.

# Acceptance Criteria

- Capture old version/path, install 0.5.0 under `/opt/homebrew`, and prove the
  resolved binary and package realpath are global registry bytes.
- Run version, init, validate, new loop, list, fork dry-run, real fork, plan,
  next, and pack in a clean workspace.
- The real fork uses the ID previewed by dry-run when no concurrent writer exists.
- Local rollback to 0.4.2 is documented if global replacement fails.

# Files Affected

List files/directories expected to change.

- `/opt/homebrew` global npm prefix
- Clean temporary command-probe workspace and evidence receipts

# Implementation Notes

- This environment mutation is covered by the single approval in `task-718`.
- Do not use a local link or source checkout binary.

# Test Plan

Run `test-392` with absolute-path and `command -v` receipts plus before/after
graph/ID evidence.

# Links / Artifacts

- `dec-69`
- `task-702`
