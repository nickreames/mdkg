---
id: test-4
type: test
title: Verify static build routes accessibility and asset budgets
status: done
priority: 1
epic: epic-2
parent: goal-2
prev: task-10
next: test-5
tags: [ai-native-sdlc, presentation-demo, phase-2, step-8]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/static-build-route-a11y-budget-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-5, task-6, task-7, task-8, task-9, task-10]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-5, task-6, task-7, task-8, task-9, task-10]
evidence_refs: []
aliases: [phase-2-step-8]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
cases: [astro_static_build, detail_and_output_route_inventory, desktop_and_mobile_layout, keyboard_and_semantic_accessibility, reduced_motion, wcag_aa_contrast, initial_transfer_budget, raster_asset_budget]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify static build routes accessibility and asset budgets as step 8 of Goal 2. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- Static Astro build and configured detail/output route inventory.
- Desktop/mobile layout, semantic HTML, keyboard operation, reduced motion, and WCAG AA contrast.
- Maximum 500 KiB initial transfer and 250 KiB per raster asset.
- Zero-JavaScript and public-safety assertions are owned by test-5, not duplicated here.

# Preconditions / Environment

- Goal 2 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- `npm --prefix mdkg-dev run build` emits every configured `/demo/N/` and `/demo/N/output/` pair and no unexpected demo route.
- `npm run smoke:mdkg-dev`, `npm run smoke:mdkg-dev-a11y`, and `npm run smoke:mdkg-dev-perf` pass with demo-specific assertions.
- Desktop and mobile layouts preserve readable hierarchy without horizontal overflow.
- Semantic landmarks, headings, links, focus order, keyboard operation, accessible names, reduced-motion behavior, and WCAG AA contrast pass.
- Initial page transfer is at most 500 KiB for each required route and no raster asset exceeds 250 KiB.
- `static-build-route-a11y-budget-receipt.json` records base/final source SHA, exact commands and exit codes, route inventory, viewport observations, accessibility assertions, byte measurements, warnings, and pass/blocker result.
- Any skipped, unavailable, or unmeasured case is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Populate `artifacts/demo-platform/static-build-route-a11y-budget-receipt.json` with pass/fail evidence for every declared case.

# Notes / Follow-ups

- Do not advance to test-5 until the required result is evidenced.
