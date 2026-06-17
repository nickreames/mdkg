---
id: task-376
type: task
title: archive superseded legacy roadmap goals
status: todo
priority: 1
epic: epic-86
parent: goal-16
tags: [0.3.3, archived, legacy]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-375]
blocks: [test-161, task-377]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Archive `goal-11`, `goal-12`, and `goal-15` after the new archived state is supported.

# Acceptance Criteria

- `goal-11` links to `goal-19` and relevant `goal-21` work.
- `goal-12` links to `goal-18`.
- `goal-15` links to `goal-21`.
- Archived goals retain historical notes and remain auditable.

# Files Affected

- .mdkg/work/goal-11*.md
- .mdkg/work/goal-12*.md
- .mdkg/work/goal-15*.md

# Implementation Notes

- This task is intentionally blocked until archived is valid.
- Do not delete legacy files.

# Test Plan

- Validate archived goals.
- Show/search explicit archived filters.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
