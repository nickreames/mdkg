---
id: task-13
type: task
title: Build PowerPoint source assets notes citations and final PPTX
status: backlog
priority: 1
epic: epic-3
parent: goal-3
prev: task-12
next: task-14
tags: [ai-native-sdlc, presentation-demo, phase-3, step-4]
owners: [program-orchestrator]
links: []
artifacts: [deck/source/ai-native-sdlc.mjs, deck/citations/claim-matrix.md, deck/speaker-notes.md, deck/assets/, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md, deck/ai-native-sdlc.pptx]
relates: []
blocked_by: []
blocks: []
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-12]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-12]
evidence_refs: []
aliases: [phase-3-step-4]
skills: [select-work-and-ground-context, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Build PowerPoint source assets notes citations and final PPTX. This is step 4 of 8 in Goal 3; it owns only the outcome named here and the authority granted by goal-3.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-3.
- Require the explicit user-accepted task-12 prototype review before writing the full deck.
- Build the complete custom Ocean Flow 16:9 deck from `deck/source/ai-native-sdlc.mjs` as a JavaScript ES module using `@oai/artifact-tool`; do not use `python-pptx`, Remotion, or a substituted deck library.
- Keep factual slide copy traceable to `deck/citations/claim-matrix.md`; never place an unsupported paraphrase into generated slides.
- Produce editable slide elements where practical, locally retained public-safe assets, slide-specific speaker notes with complete claim and asset `[Sources]` blocks, and the final PPTX.
- Add compact numbered source markers to claim-heavy slides and one final unspoken appendix sources slide; keep full URLs in the speaker notes and claim matrix.
- Generate local closing QR codes for the mdkg quickstart and `https://github.com/nickreames/mdkg/issues`, retain readable text URLs, and scan-test both destinations.
- Generate a rendered image for every slide, a contact sheet, and a QA report that records overflow, contrast, hierarchy, wrapping, minimum typography, citation, asset provenance, and individual full-size legibility review.
- Keep presentation generation deterministic and do not introduce a Remotion dependency.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-14 does not begin until this node is verified.

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

- Source generation produces the expected PPTX, notes, citations, assets, per-slide renders, contact sheet, and QA report.
- Every slide is visually inspected at presentation resolution; automated overflow checks supplement but do not replace review.
- Re-running from the accepted source produces the same slide count and equivalent layout/content.
- Every numbered marker maps to the appendix, speaker-note `[Sources]` block, and claim matrix; both QR codes scan to the displayed approved URLs.

# Links / Artifacts

- goal-3
- epic-3
- Evidence pending activation.
