---
id: task-51
type: task
title: Apply accepted final deck source and sendoff polish
status: backlog
priority: 1
epic: epic-9
parent: goal-9
prev: spike-7
next: test-26
tags: [ai-native-sdlc, presentation-demo, phase-9, step-2]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/final-polish-receipt.json, deck/ai-native-sdlc.pptx, deck/rendered/contact-sheet.png, deck/rendered/qa-report.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-9, epic-9, prd-1, edd-1, dec-2, dec-3, dec-5, spike-7, goal-3, chk-12, goal-7]
context_refs: [goal-9, epic-9, prd-1, edd-1, dec-2, dec-3, dec-5, spike-7, goal-3, chk-12, goal-7]
evidence_refs: [spike-7, chk-12, goal-7]
aliases: [phase-9-step-2]
skills: [select-work-and-ground-context, build-pack-and-execute-task, produce-powerpoint-with-artifact-tool, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Apply only the exact deck, source-template, and sendoff improvements explicitly
accepted from the measured Demo 3 evaluation.

# Acceptance Criteria

- Require explicit user acceptance of exact paths, findings, and intended
  changes before mutation.
- Regenerate the deck deterministically with Artifact Tool; rerun all slide
  renders, overflow detection, full-size visual inspection, citations, QR
  scans, and timed cues; obtain final human approval.
- Apply source/sendoff changes only when accepted; preserve static Astro,
  zero-JS, public safety, stable IDs, single-harness timing, prospective
  authority, and fallback honesty.
- Write `final-polish-receipt.json` with evidence inputs, acceptance, changed
  paths, before/after hashes, validation, timing impact, and warnings.

# Files Affected

- Accepted rows under `deck/**`, source template/sendoff surfaces, and
  `artifacts/demo-004/**`.
- No Demo 4 run graph yet, dependencies, unrelated site/docs/source, Git
  history, or provider mutation.

# Implementation Notes

- Use separate writer leases for deck and shared-source surfaces.
- A no-change receipt is valid and preferred over cosmetic churn.

# Test Plan

Run the Goal 3 deck contract and accepted source/sendoff regressions before
test-26.

# Links / Artifacts

- spike-7
- chk-12
- artifacts/demo-004/final-polish-receipt.json
