---
id: test-183
type: test
title: cross-subgraph blocker planning and graph refs contract
status: done
priority: 1
epic: epic-106
parent: goal-22
tags: [subgraph, blockers, graph-refs]
owners: []
links: []
artifacts: []
relates: [task-417]
blocked_by: [task-417]
blocks: []
refs: []
aliases: [graph-refs-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate cross-subgraph blocker explanations and the read-only graph reference summary command.

# Target / Scope

- Goal routing diagnostics.
- `mdkg graph refs <id-or-qid> --json`.
- Read-only subgraph qid behavior.

# Preconditions / Environment

- Parent repo with configured child graph bundle and local node blocked by a subgraph qid.

# Test Cases

- Goal routing explains read-only external blockers.
- `graph refs` reports inbound and outbound refs by lane.
- Mutation attempts against subgraph qids still fail closed.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Pair with `npm run smoke:subgraph`.
