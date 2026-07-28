---
id: task-25
type: task
title: Rehearse the complete presentation against production Demo 2
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: task-24
next: task-26
tags: [ai-native-sdlc, presentation-demo, phase-5, step-8]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/rehearsal-receipt.json]
relates: []
blocked_by: [task-24]
blocks: [task-26]
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-24]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-24]
evidence_refs: []
aliases: [phase-5-step-8]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Rehearse the complete presentation against production Demo 2. This is step 8
of 12 in Goal 5.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-5.
- Rehearse against the frozen deck source/PPTX and task-24 production URLs using the speaker notes and cue sheet versions recorded in Goal 3.
- Treat Goal 3 as the accepted baseline rather than the final event deck.
  Record evidence-backed slide/cue changes for Goal 6 task-27; do not edit the
  deck in this node.
- Time kickoff, history/timeline, context-engineering and AI-native SDLC framing, mdkg story, source-versus-specialized reveal, Plan -> Work -> Evidence walkthrough, what/why/next, CTA, questions buffer, and recovery branches separately.
- Target 30–32 minutes and fail above the 35-minute hard stop; reserve explicit time for the live kickoff, result reveal, and Demo 2 fallback switch.
- Exercise normal reveal, delayed Demo 3, hard-blocker fallback, offline fallback, and recovery wording without mutating source, Git, deployments, or providers.
- Write `artifacts/demo-002/rehearsal-receipt.json` with deck/notes/cue hashes, URL/deployment hashes, segment timings, total time, cue outcomes, fallback recovery time, observed issues, pass threshold, and rehearsal timestamp.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-26 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-5 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- The complete presentation rehearses in 30–32 minutes or, with documented variance, no more than 35 minutes.
- Every live cue and each recovery branch has an observed outcome and speaker-visible prompt.
- The same frozen deck and exact-SHA Demo 2 receipts used in rehearsal are inputs to task-26.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
