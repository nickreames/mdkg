---
id: task-701
type: task
title: Run loop UX descriptor pilot regression gates and close goal
status: done
priority: 1
epic: epic-224
parent: goal-59
tags: [loop, ux, regression, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-693, task-694, task-695, task-696, task-697, task-698, task-699, task-700, test-366, test-373, test-374, goal-60]
context_refs: []
evidence_refs: [chk-408]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Run the full focused verification ladder, record evidence, and close `goal-59`
only after the loop UX descriptor pilot is complete.

# Acceptance Criteria

- `task-693` through `task-700` are done with evidence.
- `test-367` through `test-374` are done with evidence.
- Required checks in `goal-59` pass.
- `goal-60` remains queued as `todo` / `goal_state: paused`.
- Completion evidence summarizes implemented UX, compatibility behavior, and
  remaining generic CLI planning work.

# Files Affected

- mdkg work nodes for closeout evidence
- any source/docs/test files changed by prior scoped tasks

# Implementation Notes

- Do not close this goal while generated docs, command contract, or validation
  drift remains.
- Treat residual generic CLI ideas as `goal-60` inputs, not blockers.

# Test Plan

- `git status --short --branch`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run docs:check`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal next goal-59 --json`
- `git diff --check`

# Links / Artifacts

- `goal-59`
- `goal-60`
