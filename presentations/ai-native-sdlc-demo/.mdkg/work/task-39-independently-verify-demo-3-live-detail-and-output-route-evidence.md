---
id: task-39
type: task
title: Independently verify Demo 3 live detail and output route evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-38
next: test-18
tags: [ai-native-sdlc, presentation-demo, phase-7, step-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/live-route-receipt.json, artifacts/demo-003/screenshots/detail-desktop.png, artifacts/demo-003/screenshots/detail-mobile.png, artifacts/demo-003/screenshots/output-desktop.png, artifacts/demo-003/screenshots/output-mobile.png]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-38]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-38]
evidence_refs: []
aliases: [phase-7-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Independently inspect `/demo/3/` and `/demo/3/output/` after exact-SHA deployment proof. This umbrella node is read-only. This is step 6 of 11 in Goal 7.

# Acceptance Criteria

- Require exactly `https://mdkg.dev/demo/3/` and `https://mdkg.dev/demo/3/output/` to resolve from task-38's exact-SHA READY deployment.
- Verify each URL at 1440x900 and 390x844 with HTTP 200, source-versus-specialized evidence, Plan -> Work -> Evidence and what/why/next content, noindex, navigation/sitemap exclusion, semantic keyboard/focus behavior, reduced motion, WCAG AA automated plus manual structure checks, responsive layout, claims, secrets, and asset budgets.
- Require no third-party runtime scripts/fonts/forms/trackers, no client directives, no external JavaScript request, zero transferred JavaScript bytes, no more than 500 KiB initial transfer, and no raster asset over 250 KiB.
- Record the four named screenshots and write `artifacts/demo-003/umbrella/live-route-receipt.json` with URL, deployment ID/SHA, viewport, status, headers/robots, DOM assertions, JS bytes, transfer/raster measurements, accessibility results, screenshot hashes, observation time, and tool versions.
- Do not edit or redeploy from this node; route failure returns to the child attempt budget or becomes a hard blocker.
- The successor task-40 does not begin until this node is verified.

# Files Affected

- Program evidence under this nested graph plus read-only public URL checks.
- No source, Git, deployment, DNS, analytics, or provider mutation.

# Implementation Notes

- Re-read the exact-SHA deployment receipt immediately before route inspection.
- Prefer response, DOM, accessibility, and asset receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Both live routes and all four viewport cases pass every frozen check against the exact-SHA deployment.
- Public-safe route evidence matches the child receipt and contains no secrets.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
