---
id: test-194
type: test
title: strict doctor subgraph handoff remediation contract
status: done
priority: 1
epic: epic-115
parent: goal-23
tags: [doctor, subgraph, handoff, test]
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

Prove remediation text and handoff receipts are actionable in multi-repo orchestration workflows.

# Target / Scope

- doctor strict checks
- subgraph audit/sync/upgrade-plan receipts
- handoff create JSON receipts

# Preconditions / Environment

- Fixtures for selected achieved goal, local DB runtime state, archive storage hygiene, dirty child subgraph, and handoff scope warnings.

# Test Cases

- Strict doctor selected-achieved output names `mdkg goal clear --json`.
- DB runtime and archive storage warnings distinguish expected local state from source defects.
- Subgraph dirty/stale guidance recommends child commit before root sync and does not encourage unsafe dirty refresh.
- Handoff JSON includes pack/scope warnings as receipt fields.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If handoff warning fields are too broad, narrow them to pack/scope warnings only.
