---
id: test-9
type: test
title: Verify timed rehearsal live cues and 35 minute hard stop
status: backlog
priority: 1
epic: epic-3
parent: goal-3
prev: test-8
tags: [ai-native-sdlc, presentation-demo, phase-3, step-8]
owners: [program-orchestrator]
links: []
artifacts: [deck/speaker-notes.md, deck/rendered/rehearsal-receipt.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-8]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-8]
evidence_refs: []
aliases: [phase-3-step-8]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [opening_minute_kickoff, narrative_30_32_minutes, simulated_success_reveal, simulated_still_running_reveal, simulated_hard_blocker_reveal, reveal_cta_three_minute_cap, recovery_cues, thirty_five_minute_hard_stop, q_and_a_after_hard_stop, no_production_claim]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify timed rehearsal live cues and 35 minute hard stop as step 8 of Goal 3. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-3
- epic-3
- test-8

# Preconditions / Environment

- Goal 3 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- The live kickoff occurs within the opening minute.
- The narrated deck finishes between 30 and 32 minutes.
- Simulated success, still-running, and hard-blocker reveal branches each preserve honest status wording and recovery cues.
- The fixture-backed reveal plus CTA uses no more than the remaining time before minute 35; audience Q&A starts afterward.
- Explicit cuts remove supporting examples before the context-engineering conclusion, reveal, or CTA.
- The rehearsal receipt states that Goal 3 did not prove Demo 2, Demo 3, exact-SHA, deployment, or live-route readiness.
- This test specifically proves: Verify timed rehearsal live cues and 35 minute hard stop.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to goal closeout until the required result is evidenced.
