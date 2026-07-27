---
id: test-14
type: test
title: Verify timed rehearsal and golden fallback recovery
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: test-13
tags: [ai-native-sdlc, presentation-demo, phase-5, step-12]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: [test-13]
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-13]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-13]
evidence_refs: []
aliases: [phase-5-step-12]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
cases: [total_duration, kickoff, reveal, fallback, recovery, immutable_receipt]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Independently verify the timed production rehearsal and immutable recovery path
as step 12 of Goal 5.

# Target / Scope

- goal-5
- epic-5
- test-13

# Preconditions / Environment

- Goal 5 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Narrated deck targets 30–32 minutes and kickoff, reveal, and CTA complete by
  the 35-minute hard stop; audience Q&A follows.
- Normal reveal, delayed Demo 3, hard-blocker fallback, and offline fallback
  branches have measured recovery times and speaker-visible cues.
- Fallback hashes, exact routes, deployment IDs, deck/notes/cue versions, and
  recovery instructions reproduce without Git or provider mutation.
- A fresh operator can disclose Demo 3 failure truthfully and reveal Demo 2
  from live or sealed local evidence.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to goal closeout until the required result is evidenced.
