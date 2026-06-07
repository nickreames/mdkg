---
id: task-318
type: task
title: design subgraph upgrade-plan all json command
status: todo
priority: 2
epic: epic-68
parent: goal-12
prev: task-317
next: task-319
tags: [design, subgraph, upgrade-plan, json]
owners: []
links: []
artifacts: []
relates: [goal-12]
blocked_by: [task-317]
blocks: [task-319, test-126]
refs: []
aliases: [subgraph-upgrade-plan-all-json]
skills: []
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Design `mdkg subgraph upgrade-plan --all --json` as a planning command that
does not apply child repo changes.

# Acceptance Criteria

- Output includes target mdkg version, dry-run requirement, scaffold status,
  DB migration requirement, skill sync requirement, and validation gates.
- Command never runs `upgrade --apply`.
- Repo-owned boundaries and manual approval points are explicit.
- Plan output can be converted into mdkg work nodes or work orders later.

# Files Affected

- Future CLI design and tests; none in this paused planning task.

# Implementation Notes

The command should help root orchestrators plan work without owning child
commits.

# Test Plan

- Fixture with mixed ready/deferred/blocked repos.
- Fixture proving no mutation on command execution.
- JSON snapshot contract.

# Links / Artifacts

- `test-126`

# Completion Evidence

Pending.
