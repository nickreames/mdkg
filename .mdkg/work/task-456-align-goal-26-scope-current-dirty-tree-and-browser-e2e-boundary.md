---
id: task-456
type: task
title: align goal-26 scope current dirty tree and Browser E2E boundary
status: done
priority: 1
epic: epic-127
parent: goal-26
tags: [mdkg-dev, browser-e2e, alignment]
owners: []
links: []
artifacts: []
relates: [goal-26]
blocked_by: []
blocks: []
refs: []
context_refs: [chk-194]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Align the goal-26 verification boundary before starting the audit and Browser E2E. This task confirms the dirty tree is expected goal-25/mdkg-dev work, no selected goal is active before goal-26 activation, and the no-public-side-effect boundary is explicit.

# Acceptance Criteria

- Current git status is recorded.
- goal-26 exists, is active, and routes to this task before closeout.
- The scope is audit plus fix for local mdkg-dev defects only.
- No publish, deploy, DNS, Vercel production promotion, GitBook production sync, tag, push, global install, or external child-repo mutation is in scope.
- `test-207` through `test-211` exist and are scoped to goal-26.

# Files Affected

- `.mdkg/work/goal-26-*`
- `.mdkg/work/epic-127-*` through `.mdkg/work/epic-130-*`
- `.mdkg/work/task-456-*` through `.mdkg/work/task-462-*`
- `.mdkg/work/test-207-*` through `.mdkg/work/test-211-*`

# Implementation Notes

- Use this task for graph alignment only; functional fixes belong to `task-460`.
- Goal-23 remains paused/blocked and is not resumed.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal next goal-26 --json`
- `git diff --check`

# Links / Artifacts

- goal-26
- goal-25
