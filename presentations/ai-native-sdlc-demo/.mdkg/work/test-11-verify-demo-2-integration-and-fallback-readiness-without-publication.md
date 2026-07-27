---
id: test-11
type: test
title: Verify Demo 2 integration and fallback readiness without publication
status: backlog
priority: 1
epic: epic-4
parent: goal-4
prev: test-10
tags: [ai-native-sdlc, presentation-demo, phase-4, step-9]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-10]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-10]
evidence_refs: []
aliases: [phase-4-step-9]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [adapter_routes, source_specialized_contrast, fallback_hash, offline_capture, no_publication]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify demo 2 integration and fallback readiness without publication as step 9 of Goal 4. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-4
- epic-4
- test-10

# Preconditions / Environment

- Goal 4 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Fork receipt preserves IDs and binds the exact source hash.
- The specialized graph validates, routes correctly, and differs visibly from the source.
- The local output is static, zero-JavaScript, accessible, noindex/unlisted, public-safe, responsive, and within budgets.
- Adapter routes work locally and candidate/fallback hashes and receipts verify.
- No Git or provider side effect occurred.
- This test specifically proves: Verify Demo 2 integration and fallback readiness without publication.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to goal closeout until the required result is evidenced.
