---
id: task-56
type: task
title: Consolidate and verify Demo 4 reveal-gate evidence
status: backlog
priority: 1
epic: epic-10
parent: goal-10
prev: task-55
next: test-28
tags: [ai-native-sdlc, presentation-demo, phase-10, step-2]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/reveal-gate-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-10, epic-10, prd-1, edd-1, dec-5, task-55]
context_refs: [goal-10, epic-10, prd-1, edd-1, dec-5, task-55]
evidence_refs: [task-55]
aliases: [phase-10-step-2]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Run the prepared read-only verifier over the final Demo 4 child and timing
receipts and create the single audience-facing reveal decision.

# Acceptance Criteria

- Read the final child/timing state first. On success, bind source/specialized
  hashes, child checkpoint, authority/sendoff/allowlist/policy/lease,
  base/actual range/final SHA, normal push, both exact-SHA deployments, both
  routes, noindex, zero JS, essential safety/transfer assertions, and
  timing/retry/intervention state. On fallback, bind the blocker, last
  completed child node, partial-side-effect inventory, timing, and every
  success receipt that exists; mark absent success-only fields
  `not_applicable` rather than inventing them.
- Include Plan, Work, Evidence, what completed, why, what comes next, and the
  exact Demo 4 or Demo 2 selection.
- Complete by T+29:15, reserving fifteen seconds for test-28 to verify and
  persist the selection by T+29:30. Do not rebuild, run full screenshot QA,
  refresh the bundle, or mutate. Missing success evidence selects Demo 2.

# Files Affected

- `artifacts/demo-004/reveal-gate-receipt.json` only.

# Implementation Notes

- Do not repair from this verifier.

# Test Plan

Validate every referenced hash and deadline with no heavy command.

# Links / Artifacts

- task-55
- dec-5
