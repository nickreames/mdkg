---
id: test-190
type: test
title: goal-23 routing and stale-release alignment contract
status: done
priority: 1
epic: epic-113
parent: goal-23
tags: [graph, alignment, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Prove the new 0.3.8 goal is coherent and stale release labels no longer point agents at a shipped 0.3.7 milestone.

# Target / Scope

- goal-23
- task-427
- task-428
- README.md
- CLI_COMMAND_MATRIX.md
- CHANGELOG.md
- goal-20

# Preconditions / Environment

- Run after graph alignment and metadata cleanup.
- No real publish, tag, push, or child-repo mutation.

# Test Cases

- `goal current --json` returns `goal-23`.
- `goal next goal-23 --json` routes to the expected active scoped node.
- Public docs source-version metadata is current.
- `goal-20` no longer describes `0.3.7` live-demo readiness.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If stale version labels remain, keep `task-428` open.
