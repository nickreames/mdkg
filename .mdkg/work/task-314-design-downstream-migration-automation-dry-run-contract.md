---
id: task-314
type: task
title: design downstream migration automation dry-run contract
status: todo
priority: 2
epic: epic-67
parent: goal-11
tags: [design, downstream, migration, dry-run]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-315, test-124]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Design downstream migration automation as dry-run-first post-publish work.

# Acceptance Criteria

- Define repo discovery, dry-run receipts, planned file changes, and operator
  approval boundaries.
- Define no-cross-repo-mutation defaults.
- Define package-version verification before downstream automation runs.
- Keep downstream automation out of 0.3.0 polish.

# Files Affected

- Design docs and mdkg graph only.

# Implementation Notes

- No downstream repo mutation in this task.

# Test Plan

- Design review and `node dist/cli.js validate --json`.

# Links / Artifacts

- `goal-11`
- `epic-67`
