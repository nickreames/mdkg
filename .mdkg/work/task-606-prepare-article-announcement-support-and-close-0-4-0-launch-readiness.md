---
id: task-606
type: task
title: prepare article announcement support and close 0.4.0 launch readiness
status: todo
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, article, announcement, closeout, launch]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-601, task-602, task-603, task-604, task-605, test-307, test-308, test-309, test-310, test-311]
blocks: []
refs: [task-601, task-602, task-603, task-604, task-605]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Prepare the final article announcement support package and close the `0.4.0`
launch-readiness lane with evidence.

# Acceptance Criteria

- Article support references launch pages, release notes, and source-backed
  product claims.
- A closeout checkpoint records public launch readiness, known boundaries, and
  any required follow-ups.
- No publish, tag, push, deploy, DNS, or analytics mutation happens unless
  explicitly approved in that execution pass.

# Files Affected

- mdkg checkpoint/goal closeout evidence
- handoff copy or article-support artifact if requested

# Implementation Notes

- Use June 28, 2026 as the article target date.
- Keep article claims aligned with `CHANGELOG.md` and validated public pages.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-42 --json`
- `git diff --check`
- `test-311`

# Links / Artifacts

- `goal-42`
