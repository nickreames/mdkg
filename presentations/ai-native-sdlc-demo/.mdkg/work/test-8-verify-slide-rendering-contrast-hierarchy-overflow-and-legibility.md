---
id: test-8
type: test
title: Verify slide rendering contrast hierarchy overflow and legibility
status: backlog
priority: 1
epic: epic-3
parent: goal-3
prev: test-7
next: test-9
tags: [ai-native-sdlc, presentation-demo, phase-3, step-7]
owners: [program-orchestrator]
links: []
artifacts: [deck/source/ai-native-sdlc.mjs, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md, deck/ai-native-sdlc.pptx]
relates: []
blocked_by: []
blocks: []
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-7]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-7]
evidence_refs: []
aliases: [phase-3-step-7]
skills: [select-work-and-ground-context, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
cases: [artifact_tool_generation, deterministic_regeneration, render_every_slide, individual_full_size_review, overflow, wrapping, minimum_typography, contrast, hierarchy, connector_integrity, citation_legibility, asset_provenance, speaker_note_alignment, qr_scan]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify slide rendering contrast hierarchy overflow and legibility as step 7 of Goal 3. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-3
- epic-3
- test-7

# Preconditions / Environment

- Goal 3 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- The accepted source runs as a JavaScript ES module with `@oai/artifact-tool` and produces the expected editable PPTX without `python-pptx`, Remotion, or a substituted deck library.
- Regeneration preserves slide count and equivalent content/layout.
- Every slide has a render and is inspected individually at full size; the contact sheet is used only for deck-level sequence and consistency.
- No slide has unintended overlap, clipping, unexpected wrapping, broken connectors, sub-minimum typography, weak contrast, unreadable citations, asset-provenance gaps, or speaker-note drift.
- Both locally generated QR codes scan to the same approved HTTPS destinations printed on the closing slide.
- This test specifically proves: Verify slide rendering contrast hierarchy overflow and legibility.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-9 until the required result is evidenced.
