---
id: task-310
type: task
title: design public worker execution boundary secrets policy and operator approvals
status: todo
priority: 2
epic: epic-65
parent: goal-11
tags: [design, worker, security, approvals]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-311, test-122]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Design the public worker execution boundary for a post-0.3.0 release.

# Acceptance Criteria

- Define what public worker execution may execute and what remains outside mdkg.
- Define operator approvals, secret handling, logs, artifacts, and redaction.
- Define CLI taxonomy and failure modes before implementation.
- Explicitly preserve the 0.3.0 boundary: trigger creates mirrors only.

# Files Affected

- Design docs and mdkg graph only.

# Implementation Notes

- This is deferred design work; do not implement worker execution here.

# Test Plan

- Design review and `node dist/cli.js validate --json`.

# Links / Artifacts

- `goal-11`
- `epic-65`
