---
id: test-18
type: test
title: Verify the Demo 3 child goal is achieved with complete evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-39
next: test-19
tags: [ai-native-sdlc, presentation-demo, phase-7, step-7]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-39]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-39]
evidence_refs: []
aliases: [phase-7-step-7]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [child_achieved, positioning, implementation, local_test, integration, canonical_test, publish, exact_sha_live_urls, accepted_checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate that the Demo 3 child goal is achieved with complete
local-to-production evidence as step 7 of Goal 7.

# Target / Scope

- goal-7
- epic-7
- task-39

# Preconditions / Environment

- Goal 7 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- The child goal is achieved only after positioning, implementation, local
  test, integration, canonical-site test, publish, exact-SHA/live-URL test, and
  its accepted checkpoint all resolve.
- Canonical build, routes, claims, accessibility, privacy, noindex, zero-JavaScript, and budgets pass.
- Both production projects are READY for the exact final SHA and both live routes pass.
- Fix-forward attempts and elapsed time stay within bounds.
- Reveal selection and receipt state Demo 3 success or Demo 2 fallback truthfully; fallback never marks Goal 7 achieved.
- This test specifically proves: Verify the Demo 3 child goal is achieved with
  complete local-to-production evidence.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-19 until the required result is evidenced.
