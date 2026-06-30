---
id: task-622
type: task
title: record demo preview closeout and promotion recommendation
status: todo
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, preview, checkpoint, promotion, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-621]
blocks: [test-325, goal-46]
refs: [dec-57, edd-59]
context_refs: [dec-57, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Close the preview lane with a durable classification: accepted, rejected, or
needs-polish.

# Acceptance Criteria

- A checkpoint records the preview state and recommendation.
- Accepted previews can unblock `goal-46`; rejected and needs-polish previews
  do not.
- The checkpoint includes preview URL, deployment id, commit SHA, build/log
  summary, Browser/Chrome evidence, noindex status, no-secret result, and public
  claims result.
- The checkpoint explicitly states whether `demo-N.mdkg.dev` promotion should
  start.

# Files Affected

- mdkg checkpoint/evidence nodes
- local artifact receipts under `/private/tmp`

# Implementation Notes

- Do not mark `goal-44` achieved unless the preview classification and tests are
  complete.
- Do not start DNS or non-preview hosting inside this task.

# Test Plan

- `test-325`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal evaluate goal-44 --json`

# Links / Artifacts

- `goal-46`
- `test-325`
