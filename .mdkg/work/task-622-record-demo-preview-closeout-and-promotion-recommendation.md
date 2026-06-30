---
id: task-622
type: task
title: record short path demo closeout and next-step recommendation
status: todo
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, mdkg-dev, checkpoint, promotion, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-630, test-324, test-329]
blocks: [test-325, goal-47]
refs: [dec-58, dec-59, edd-60, edd-61]
context_refs: [dec-58, dec-59, edd-60, edd-61]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Close the `/demos` and `/demo/1` local source-proof lane with a durable
classification: accepted for public-route integration, needs polish, or rejected
for now.

# Acceptance Criteria

- A checkpoint records the local route state and recommendation.
- The checkpoint includes `/demos`, `/demo/1`, and `/demo/1/output` build and
  Browser/Chrome evidence.
- The checkpoint includes sanitized snapshot evidence, no-secret result, public
  claims result, route console health, responsive screenshots, and homepage
  isolation proof.
- Accepted local proof can unblock `goal-47` advanced viewer research; rejected
  and needs-polish results keep `goal-47` blocked.
- The checkpoint explicitly states that no push, deploy, DNS, tag, npm publish,
  provider mutation, or production promotion occurred.

# Files Affected

- mdkg checkpoint/evidence nodes
- local Browser/Chrome and build artifact receipts under `/private/tmp` when
  execution collects them

# Implementation Notes

- Do not mark `goal-44` achieved unless route, snapshot, Browser/Chrome,
  no-secret, public-claims, and lazy-load isolation evidence exists.
- Do not start DNS, Vercel deploy, push, or non-preview hosting inside this
  task.

# Test Plan

- `test-324`
- `test-329`
- `test-325`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal evaluate goal-44 --json`

# Links / Artifacts

- `goal-47`
- `test-325`
