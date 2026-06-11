---
id: test-130
type: test
title: 0.3.x hardening release train contract
status: done
priority: 1
epic: epic-69
parent: goal-13
tags: [hardening, release-train, roadmap, test]
owners: []
links: []
artifacts: []
relates: [epic-69, epic-74, epic-70, epic-75, epic-71, epic-73, epic-72]
blocked_by: [test-129]
blocks: []
refs: [epic-68]
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate that the post-0.3.0 roadmap is capability-epic based and uses flexible
version milestones through `0.4.0`.

# Target / Scope

- Release hygiene and roadmap control.
- Operator status and doctor strictness.
- Fix planning and repair receipts.
- Subgraph safety and downstream upgrade planning.
- Branch conflict and multi-writer safety.
- Generated command contract and docs gate.
- mdkg.dev readiness and launch.
- Deferred execution and public DB CLI enhancements.

# Preconditions / Environment

- `goal-13` exists and validates.

# Checks

- `node dist/cli.js show goal-13 --json`
- `node dist/cli.js validate --json`

Document environment, data, and setup requirements.

# Test Cases

- case 1
- case 2

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

# Notes / Follow-ups

- follow-up 1
- follow-up 2
