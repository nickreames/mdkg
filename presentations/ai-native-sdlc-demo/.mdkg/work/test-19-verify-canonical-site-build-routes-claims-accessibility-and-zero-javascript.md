---
id: test-19
type: test
title: Verify canonical site build routes claims accessibility and zero JavaScript
status: done
priority: 1
epic: epic-7
parent: goal-7
prev: task-39
next: test-20
tags: [ai-native-sdlc, presentation-demo, phase-7, step-8]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-39]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-39]
evidence_refs: []
aliases: [phase-7-step-8]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [success_branch, fallback_branch, canonical_build, detail_route, output_route, claims, accessibility, noindex, zero_client_javascript, asset_budgets]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Audit the post-reveal canonical and public-safety receipts as step 8 of Goal 7.
Do not repeat the timed build or mutate production.

# Target / Scope

- goal-7
- epic-7
- task-39

# Preconditions / Environment

- Goal 7 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Read test-18's immutable selection through task-39; do not require
  re-execution.
- On Demo 3 success, validate the extended canonical and four-viewport receipt
  hashes and require canonical build, routes, claims, accessibility, privacy,
  noindex, zero-JavaScript, budgets, exact-SHA deployments, and live routes to
  pass.
- On Demo 2 fallback, require the blocker, deadline-compliant selection, last
  completed child node, truthful unachieved child state, and exact partial
  side-effect inventory. Audit every available receipt; mark absent
  success-only canonical/deployment/route checks `not_applicable`.
- Fix-forward attempts and elapsed time stay within bounds.
- Reveal selection and receipt state Demo 3 success or Demo 2 fallback
  truthfully. A failed child may still yield a complete rehearsal audit.
- This test specifically proves: Verify canonical site build routes claims accessibility and zero JavaScript.
- Any applicable skipped or unavailable check is a failure or explicit
  blocker. Explicitly non-applicable success-only checks on the fallback
  branch are acceptable and may never be called passes.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-20 until the required result is evidenced.
