---
id: test-126
type: test
title: subgraph audit and upgrade-plan command contract validation
status: todo
priority: 2
epic: epic-68
tags: [test, subgraph, audit, upgrade-plan, json]
owners: []
links: []
artifacts: []
relates: [goal-12, task-317, task-318]
blocked_by: [task-317, task-318]
blocks: [task-321]
refs: []
aliases: [subgraph-audit-upgrade-plan-contract]
skills: []
cases: [read-only, json-schema, no-apply]
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Validate the planned audit and upgrade-plan command contracts.

# Target / Scope

- `mdkg subgraph audit --all --json`
- `mdkg subgraph upgrade-plan --all --json`

# Preconditions / Environment

- Command designs are complete.

# Test Cases

- Audit is read-only.
- Upgrade-plan does not apply upgrades.
- JSON output contains enough fields for downstream readiness classification.
- Dirty, stale, and source-drift fixtures produce actionable diagnostics.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None.
