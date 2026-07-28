---
id: test-9
type: test
title: Verify timed rehearsal live cues and 35 minute hard stop
status: done
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
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-8, chk-10]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-8]
evidence_refs: [chk-10]
aliases: [phase-3-step-8]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [opening_minute_kickoff, narrative_30_32_minutes, simulated_success_reveal, simulated_still_running_reveal, simulated_hard_blocker_reveal, reveal_cta_three_minute_cap, recovery_cues, thirty_five_minute_hard_stop, q_and_a_after_hard_stop, no_production_claim]
created: 2026-07-26
updated: 2026-07-27
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

PASS on 2026-07-27.

- Parsed final embedded timings for slides 1–17: 1,865 seconds, or 31:05.
- Rehearsed the fixture-backed kickoff at 00:15 with return to slide 1 by 00:45.
- Rehearsed success, still-running, and hard-blocker cue tables; every branch reaches the CTA at 33:10 and finishes at 33:55.
- Reveal target is 2:05 and CTA is 0:45, totaling 2:50 against the three-minute cap.
- Total content is 2,035 seconds against the 2,100-second hard stop, leaving a 65-second margin before audience Q&A.
- Verified bounded recovery cues for unavailable provider visibility, origin drift, failed URLs, missing exact-SHA proof, display failure, narrative overrun, and a late reveal.
- Verified supporting examples on slides 6 and 9 are the first cuts; the context-engineering conclusion, reveal, and CTA remain protected.
- Verified the still-running and hard-blocker branches do not call a fallback “sealed Demo 2” unless future Goal 5 production evidence exists.
- Verified no cue claims Demo 2, Demo 3, an exact SHA, a deployment, Vercel readiness, live-route readiness, commit, push, or production rehearsal was proved.
- Full public-safe receipt: `deck/rendered/rehearsal-receipt.md`.

# Notes / Follow-ups

- Do not advance to goal closeout until the required result is evidenced.
