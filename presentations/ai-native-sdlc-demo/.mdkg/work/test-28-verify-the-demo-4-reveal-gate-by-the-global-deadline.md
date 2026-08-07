---
id: test-28
type: test
title: Verify the Demo 4 reveal gate by the global deadline
status: backlog
priority: 1
epic: epic-10
parent: goal-10
prev: task-56
next: task-57
tags: [ai-native-sdlc, presentation-demo, phase-10, step-3]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/reveal-gate-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-10, epic-10, prd-1, edd-1, dec-5, task-56]
context_refs: [goal-10, epic-10, prd-1, edd-1, dec-5, task-56]
evidence_refs: [task-56]
aliases: [phase-10-step-3, demo-4-live-reveal-gate]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [receipt_schema, child_result, actual_range, exact_sha_deployments, live_routes, deadline, fallback]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Validate the stage-facing Demo 4/Demo 2 selection without any new heavy or
mutating command.

# Target / Scope

- task-56 and its consolidated receipt

# Preconditions / Environment

The frozen global deadline and current timing ledger resolve.

# Test Cases

- Demo 4 selection requires an achieved child checkpoint, policy-compliant
  actual range, normal push, both exact-SHA READY deployments, both routes,
  child checkpoint by T+28:30, task-56 receipt by T+29:15, and this selection
  by T+29:30.
- Otherwise select Demo 2 and stop all live actions by T+30. A late Demo 4
  result cannot be retroactively called a live success.
- This test, not task-56 alone, must finish and persist the selection by
  T+29:30.

# Results / Evidence

Write `reveal-gate-verification.json` with selection, deadline comparison,
hash/schema results, and blocker.

# Notes / Follow-ups

- Post-reveal task-57 cannot change this result.
