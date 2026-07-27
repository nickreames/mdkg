---
id: task-12
type: task
title: Produce three representative visual prototypes
status: backlog
priority: 1
epic: epic-3
parent: goal-3
prev: task-11
next: task-13
tags: [ai-native-sdlc, presentation-demo, phase-3, step-3]
owners: [program-orchestrator]
links: []
artifacts: [deck/assets/prototypes/, deck/rendered/prototypes/contact-sheet.png, deck/rendered/prototypes/review-receipt.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-11]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-11]
evidence_refs: []
aliases: [phase-3-step-3]
skills: [select-work-and-ground-context, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Produce three representative visual prototypes. This is step 3 of 8 in Goal 3; it owns only the outcome named here and the authority granted by goal-3.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-3.
- Prototype one six-era capability-timeline slide, one spec-driven Plan -> Work -> Evidence slide, and one source `goal-1` versus specialized `goal-1` reveal slide.
- Express one coherent custom Ocean Flow 16:9 system across all three prototypes rather than three disconnected visual directions.
- Explore composition, hierarchy, typography, diagram language, numbered evidence-footnote treatment, and Ocean Flow color use while keeping the final deck editable.
- Evaluate the three prototypes with the same mixed engineer/management audience, projection-distance, WCAG contrast, and 16:9 constraints.
- Render every prototype, create a contact sheet, and record the selected elements and rejected alternatives in `deck/rendered/prototypes/review-receipt.md`.
- Move this node to review and keep it open until the user explicitly accepts the visual direction.
- Do not start task-13 or construct the full deck before that acceptance is recorded.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-13 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-3 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- All three prototypes render at presentation resolution with no overlap, clipping, or unreadable evidence.
- The accepted direction supports dense technical proof without resembling a CLI tutorial or enterprise-only governance deck.
- The prototype contact sheet supports deck-level comparison, while each prototype is also inspected individually at full size.
- A user-accepted review receipt identifies the chosen elements and how they generalize across the remaining slides.

# Links / Artifacts

- goal-3
- epic-3
- Evidence pending activation.
