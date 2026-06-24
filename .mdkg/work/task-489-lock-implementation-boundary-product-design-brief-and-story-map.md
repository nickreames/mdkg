---
id: task-489
type: task
title: lock implementation boundary Product Design brief and story map
status: todo
priority: 1
tags: [mdkg-dev, implementation-boundary, product-design]
owners: []
links: []
artifacts: []
relates: [goal-30]
blocked_by: []
blocks: [task-490]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Start Goal 30 by re-grounding the feedback bundle, current preview state, Product Design brief, Browser scope, and launch-side-effect boundaries.

# Acceptance Criteria

- Current repo, selected-goal, and preview state are inspected.
- Product Design brief is played back and uses `mdkg-dev/DESIGN.md`, `edd-28`, `edd-29`, `edd-30`, and feedback evidence as source context.
- The implementation story map confirms P0 plus core P1 in scope and P2 deferred.
- DNS, production promotion, analytics activation, npm publish, git tag, and GitHub settings mutation are explicitly out of scope.

# Test Plan

- `node dist/cli.js goal show goal-30 --json`
- `node dist/cli.js pack task-489 --pack-profile concise`

# Files Affected

# Implementation Notes

# Links / Artifacts
