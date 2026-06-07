---
id: task-312
type: task
title: design public event reducer lease materializer CLI taxonomy
status: todo
priority: 2
epic: epic-66
parent: goal-11
tags: [design, db, event, reducer, lease, materializer]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-313, test-123]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Design public CLI taxonomy for event, reducer, lease, and materializer surfaces
without exposing arbitrary SQL or prematurely freezing internals.

# Acceptance Criteria

- Define which internal helper capabilities become public CLI, if any.
- Preserve internal/local boundaries for reducer, lease, and materializer state.
- Define command names, JSON receipts, docs, and migration compatibility.
- Explicitly keep 0.3.0 public surface unchanged.

# Files Affected

- Design docs and mdkg graph only.

# Implementation Notes

- Not part of 0.3.0 polish.

# Test Plan

- Design review and `node dist/cli.js validate --json`.

# Links / Artifacts

- `goal-11`
- `epic-66`
