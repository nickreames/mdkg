---
id: task-47
type: task
title: Apply accepted source-template and live-sendoff refinements
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: spike-6
next: test-25
tags: [ai-native-sdlc, presentation-demo, phase-6, step-3, source-prompt-refinement]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-003/source-prompt-enhancement-receipt.json, artifacts/demo-003/live-sendoff-v2.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, spike-6, task-10]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, spike-6, task-10]
evidence_refs: []
aliases: [phase-6-source-prompt-refinement]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Apply only the source-template, operator-context, specialization, or live
sendoff refinements explicitly accepted from spike-6 before Demo 3 is forked.

# Acceptance Criteria

- Require an accepted spike-6 recommendation naming exact paths, operations,
  base hashes, owner, reason, expected result, and tests. No user acceptance
  means no mutation.
- Acquire a bounded shared-source lease. Permitted future surfaces are only
  accepted rows under `examples/website-demo-template/**`,
  `scripts/bootstrap-website-demo-run.js`,
  `scripts/smoke-demo-graph.js`, and versioned program-local
  demo-platform/sendoff contract artifacts. Any additional path requires a new
  decision.
- Preserve static Astro, zero client JavaScript, Ocean Flow, public safety,
  accessibility, budgets, mdkg product/CTA identity, stable local IDs, and the
  complete local-to-production child chain.
- Preserve the normative continue-until behavior and make the separate
  pre-authorized live authority explicit. Do not weaken hard blockers,
  attempt/time bounds, exact-SHA proof, or fallback honesty.
- If the accepted recommendation is no change, write a no-change receipt with
  verified current hashes; do not create cosmetic churn.
- Write `source-prompt-enhancement-receipt.json` with evidence inputs,
  acceptance, exact changed paths, before/after hashes, updated source and
  manifest identity, sendoff bytes/hash, validation, warnings, and handoff to
  test-25.

# Files Affected

- Only exact rows accepted after spike-6 from the bounded surfaces above.
- Program-local receipt and versioned sendoff artifact.
- No `mdkg-dev/**`, `src/**`, `tests/**`, `docs/**`, packages, lockfiles,
  deployment configuration, run graph, Git history, or provider surface.

# Implementation Notes

- Use the shared-source writer only after the program writer yields.
- Do not fork Demo 3 or retain a temporary verification run in this node.

# Test Plan

- Run syntax and targeted graph/bootstrap checks appropriate to changed rows.
- Require nested source validation and manifest/source hash consistency.
- Defer the clean absent-target and pack proof to test-25.

# Links / Artifacts

- spike-6
- task-10
- artifacts/demo-003/source-prompt-enhancement-receipt.json
