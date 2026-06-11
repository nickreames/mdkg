---
id: test-155
type: test
title: malformed spike validation and repair guidance contract
status: todo
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, validation, fix-plan, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-367]
blocks: []
refs: []
aliases: []
skills: []
cases: [malformed spike fails validate clearly, fix plan reports actionable guidance, json diagnostics remain parseable]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate malformed spike diagnostics and non-mutating repair guidance.

# Target / Scope

- `task-367`
- graph validation
- fix-plan output
- JSON stdout/stderr discipline

# Preconditions / Environment

- Temp repo fixtures with malformed spike frontmatter, invalid ids/statuses, and
  broken refs.

# Test Cases

- `mdkg validate --json` rejects malformed spikes with actionable error text.
- `mdkg fix plan --json` remains non-mutating and reports applicable repair
  hints for missing caches, duplicate ids, and broken refs involving spikes.
- JSON output remains parseable and diagnostics do not contaminate JSON stdout.
- No automatic repair apply behavior is introduced for spike bodies.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Keep this focused on diagnostics and planning, not repair mutation.
