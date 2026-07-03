---
id: task-644
type: task
title: close 0.4.1 contract-profile implementation readiness proof
status: todo
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, readiness, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-643]
blocks: [test-335, goal-50]
refs: [task-636, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Close the implementation lane with release-readiness evidence, a local commit,
and no real publish/push/tag side effects.

# Acceptance Criteria

- Exact changed files and generated files are recorded.
- Command receipts include pass/fail status for implementation gates.
- Package version source, changelog coverage, docs/generated-reference status,
  and remaining dirty state are recorded.
- `test-333`, `test-334`, and `test-335` have enough evidence to close or list
  exact gaps.
- A local implementation commit is created.
- `goal-50` remains blocked until `test-335` proves readiness.

# Files Affected

- mdkg checkpoint/evidence nodes.
- Git commit containing implementation changes.

# Implementation Notes

- This task recommends publish readiness or names exact gaps; it does not run
  real npm publish.
- If readiness fails, keep `goal-50` blocked and create or update a follow-up
  blocker node.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- `git diff --check`
- `git diff --cached --check`

# Links / Artifacts

- `task-636`
- `test-332`
