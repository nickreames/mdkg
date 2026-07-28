---
id: test-26
type: test
title: Verify the final deck and Demo 4 source contract
status: backlog
priority: 1
epic: epic-9
parent: goal-9
prev: task-51
next: task-52
tags: [ai-native-sdlc, presentation-demo, phase-9, step-3]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/final-polish-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-9, epic-9, prd-1, edd-1, dec-2, dec-3, dec-5, task-51]
context_refs: [goal-9, epic-9, prd-1, edd-1, dec-2, dec-3, dec-5, task-51]
evidence_refs: [task-51]
aliases: [phase-9-step-3]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [deck_determinism, slide_rendering, citations, qr_codes, timing, source_bootstrap, sendoff, single_harness_deadline]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Verify the final approved deck and the exact source/sendoff identity that will
seed fresh Demo 4.

# Target / Scope

- task-51
- deck artifacts
- accepted source/operator/sendoff contract

# Preconditions / Environment

The task-51 acceptance receipt and human deck approval resolve.

# Test Cases

- Require deterministic deck rebuild, full slide QA, sources, QR scans, and
  content stop by minute 35.
- Run an absent-target source bootstrap twice; require identical inventory,
  complete skills/design pack, warm dependencies, one authoritative sendoff,
  no untracked packs, and no retained target.
- Require the single-harness 30-minute timing and prospective authority
  contracts without multi-harness/endurance claims.

# Results / Evidence

Write `final-polish-verification.json` with exact commands, hashes, visual
review, timing, bootstrap inventory, and pass/blocker state.

# Notes / Follow-ups

- Do not fork Demo 4 until this test passes.
