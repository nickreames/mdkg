---
id: task-27
type: task
title: Apply rehearsal findings and freeze the approved deck
status: todo
priority: 1
epic: epic-6
parent: goal-6
next: spike-6
tags: [ai-native-sdlc, presentation-demo, phase-6, step-1]
owners: [program-orchestrator]
links: []
artifacts: [deck/source/ai-native-sdlc.mjs, deck/ai-native-sdlc.pptx, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md, deck/rendered/rehearsal-receipt.md, artifacts/demo-003/deck-freeze.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-3, chk-12, goal-5]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-3, chk-12, goal-5]
evidence_refs: [chk-12]
aliases: [phase-6-step-1]
skills: [select-work-and-ground-context, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Apply Demo 2 production/rehearsal findings and freeze the explicitly approved
event deck. This is step 1 of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Start from Goal 3 `chk-12`; consume Goal 5's exact-SHA screenshots,
  production 16:9 comparison, child receipts, timing receipt, cue findings, and
  golden fallback.
- Replace fixture/meta commentary only where accepted evidence now supports a
  clearer audience-facing result. Preserve the capability narrative,
  context-engineering conclusion, reveal truthfulness, CTA, claims, citations,
  and 35-minute boundary.
- Use both the raw production screenshots and the composed 16:9
  source-versus-specialized proof where they materially improve the reveal.
- Regenerate deterministically with Artifact Tool, rerun per-slide rendering,
  overflow and full-size visual QA, source/citation mapping, QR checks, and the
  timed cue rehearsal.
- Obtain explicit human approval of the final polish before writing
  `artifacts/demo-003/deck-freeze.json` with source/PPTX/notes/citation/render
  hashes and rehearsal timing.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor spike-6 does not begin until this node is verified.

# Files Affected

- Existing `deck/**` artifacts and `artifacts/demo-003/deck-freeze.json`.
- Nested Goal 6 evidence required to close this node.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Final deck renders without overflow, retains source/citation integrity, and
  passes the same deterministic and visual checks as Goal 3.
- The narrated deck plus reveal/CTA still stops by 35 minutes.
- The freeze receipt resolves exact Goal 5 evidence and explicit human
  approval; no Demo 3 run or source mutation occurs.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
