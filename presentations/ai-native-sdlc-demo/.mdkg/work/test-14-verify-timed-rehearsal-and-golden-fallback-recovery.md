---
id: test-14
type: test
title: Verify timed rehearsal and golden fallback recovery
status: done
priority: 1
epic: epic-5
parent: goal-5
prev: test-13
tags: [ai-native-sdlc, presentation-demo, phase-5, step-12]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/rehearsal-receipt.json, artifacts/demo-002/golden-fallback.json, artifacts/demo-002/golden-fallback.sha256, artifacts/demo-002/golden-fallback-recovery.md, artifacts/demo-002/fallback/manifest.sha256]
relates: []
blocked_by: [test-13]
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-13]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-13]
evidence_refs: [task-25, task-26, test-13]
aliases: [phase-5-step-12]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
cases: [total_duration, kickoff, reveal, fallback, recovery, immutable_receipt]
created: 2026-07-26
updated: 2026-07-27
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

Passed on 2026-07-27.

- The cold operational rehearsal measured a 31:05 narrated deck, 2:50 reveal
  plus CTA, and 33:55 total content. The 35:00 hard stop retains 1:05 of
  margin, with audience Q&A explicitly afterward. Live kickoff occurs at 0:15.
- Normal reveal, delayed Demo 3, hard-blocker, and offline branches passed.
  Every fallback switch is bounded to 30 seconds or less and has truthful
  speaker wording that does not claim an incomplete Demo 3 succeeded.
- The golden fallback binds the exact Git SHA, two READY deployment IDs, both
  production routes, frozen deck/source/notes/cues, four production
  screenshots, the 16:9 reveal, child production checkpoint, and candidate
  and publication receipts.
- The outer manifest has 30 unique byte-sorted paths and verifies completely.
  The nested offline manifest has 17 entries and verifies completely.
- Recovery instructions support a live reveal, sealed production captures, or
  the local static site. They prohibit Git and provider mutation and require a
  newly versioned fallback if any sealed artifact changes.
- Independent parsing rechecked timing, all four branches, production identity,
  deterministic manifest order and count, read-only policy, and recovery
  wording. All cases passed.

# Notes / Follow-ups

- Goal 6 should apply the three recorded rehearsal findings: frame the static
  comparison as the governed pre-publication handoff before showing its
  publication receipt, lead the reveal with the retained 16:9 image, and
  update event notes so Demo 2 is no longer described as future evidence.
