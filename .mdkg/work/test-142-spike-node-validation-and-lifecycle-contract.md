---
id: test-142
type: test
title: spike node validation and lifecycle contract
status: todo
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, validation, lifecycle]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: []
refs: []
aliases: []
skills: []
cases: [new spike validates, task lifecycle accepts spike, invalid spike frontmatter fails]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that `spike` is a legal mdkg work-node type and can move through the
same lifecycle as existing task-like work items.

# Target / Scope

- `task-348`
- Parser/type policy
- `mdkg new spike`
- `mdkg task start/update/done`

# Preconditions / Environment

- Fresh temp repo initialized with `mdkg init --agent`.
- Built or packed mdkg CLI that includes spike support.

# Test Cases

- `mdkg new spike "research mdkg.dev docs" --json` returns `spike-1` and writes
  under `.mdkg/work/`.
- `mdkg validate --json` accepts the new spike.
- `mdkg task start spike-1 --json`, `mdkg task update spike-1 ... --json`, and
  `mdkg task done spike-1 --json` work and preserve valid graph state.
- Malformed spike frontmatter fails validation with actionable diagnostics.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Keep lifecycle coverage aligned with task-like work nodes.
