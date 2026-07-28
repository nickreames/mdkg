---
id: task-27
type: task
title: Freeze the pre-Demo-3 deck baseline and post-test polish handoff
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: test-25
next: task-28
tags: [ai-native-sdlc, presentation-demo, phase-6, step-4]
owners: [program-orchestrator]
links: []
artifacts: [deck/source/ai-native-sdlc.mjs, deck/ai-native-sdlc.pptx, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md, deck/rendered/rehearsal-receipt.md, artifacts/demo-003/pre-test-deck-baseline.json, artifacts/demo-003/post-test-presentation-handoff.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-3, chk-12, goal-5, chk-17, test-14, spike-6, test-25]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-3, chk-12, goal-5, chk-17, test-14, spike-6, test-25]
evidence_refs: [chk-12, chk-17, test-14, spike-6, test-25]
aliases: [phase-6-step-4]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Hash-freeze the current presentation as the Demo 3 pre-test baseline and
reserve an explicit post-test polish handoff. This is step 4 of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Start from Goal 3 `chk-12`; consume Goal 5's exact-SHA screenshots,
  production 16:9 comparison, child receipts, timing receipt, cue findings, and
  golden fallback.
- Do not modify or regenerate the deck, notes, citations, PPTX, renders, or
  assets in Goal 6. If review finds a material factual defect that makes the
  rehearsal unsafe, record the exact blocker and request an explicit scope
  exception; do not silently treat it as an essential correction.
- Record the three accepted Demo 2 cue findings and reserve explicit slots for
  Demo 3 timing, exact-SHA, route, source-versus-specialized, and reveal-gate
  evidence.
- Write `pre-test-deck-baseline.json` with exact source/PPTX/notes/citation/
  render/rehearsal hashes and `post-test-presentation-handoff.md` with the
  evidence Goal 9 must review.
- State that Goal 9 owns final enhancement, regeneration, QA, and explicit
  human approval after Demo 3.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-28 does not begin until this node is verified.

# Files Affected

- The two named program-local baseline/handoff artifacts only.
- Existing deck artifacts are read-only inputs whose hashes are recorded.
- Nested Goal 6 evidence required to close this node.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- The current accepted deck artifacts retain exact source/citation/render/PPTX
  hashes; any change fails this node and routes to an explicit scope decision.
- The post-test handoff preserves the 35-minute boundary and names the exact
  Goal 9 evidence/approval gate.
- The baseline receipt resolves Goal 3/Goal 5 evidence without claiming final
  post-Demo-3 approval; no Demo 3 run or source mutation occurs.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
