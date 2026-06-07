---
id: task-316
type: task
title: audit current subgraph command surface and downstream needs
status: todo
priority: 2
epic: epic-68
parent: goal-12
next: task-317
tags: [audit, subgraph, command-surface, downstream]
owners: []
links: []
artifacts: []
relates: [goal-12]
blocked_by: [goal-10]
blocks: [task-317, test-125]
refs: [edd-16, dec-29]
aliases: [audit-subgraph-command-surface]
skills: []
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Audit the current subgraph CLI surface and downstream orchestrator needs before
designing new commands.

# Acceptance Criteria

- Existing `mdkg subgraph` commands are inventoried.
- Known downstream audit fields are listed.
- Gaps are mapped to future command contracts.
- No implementation begins before command boundaries are clear.

# Files Affected

- Future design and CLI files; none in this paused planning task.

# Implementation Notes

Use downstream orchestration needs as input without adding downstream product
names to public command naming.

# Test Plan

- Inspect current CLI help.
- Inspect existing subgraph tests.
- Review downstream audit matrices.

# Links / Artifacts

- `goal-12`

# Completion Evidence

Pending.
