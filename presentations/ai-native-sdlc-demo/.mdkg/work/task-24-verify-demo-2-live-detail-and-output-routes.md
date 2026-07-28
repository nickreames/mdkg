---
id: task-24
type: task
title: Verify Demo 2 live detail and output routes
status: done
priority: 1
epic: epic-5
parent: goal-5
prev: task-23
next: task-25
tags: [ai-native-sdlc, presentation-demo, phase-5, step-7]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/live-route-receipt.json, artifacts/demo-002/production-reveal/source-vs-specialized-16x9.png, artifacts/demo-002/screenshots/detail-desktop.png, artifacts/demo-002/screenshots/detail-mobile.png, artifacts/demo-002/screenshots/output-desktop.png, artifacts/demo-002/screenshots/output-mobile.png]
relates: []
blocked_by: [task-23]
blocks: [task-25]
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-23, chk-14]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-23]
evidence_refs: []
aliases: [phase-5-step-7]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Verify Demo 2 live detail and output routes. This is step 7 of 12 in Goal 5.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-5.
- After task-23, verify exactly `https://mdkg.dev/demo/2/` and `https://mdkg.dev/demo/2/output/` at 1440x900 and 390x844 viewports.
- Require HTTP 200, canonical content from the exact-SHA deployment, `noindex` metadata, exclusion from public navigation and sitemap, source-versus-specialized proof, and the required Plan -> Work -> Evidence plus what/why/next story.
- Require semantic keyboard navigation, visible focus, reduced-motion behavior, WCAG AA automated checks plus manual heading/landmark review, no leaked secrets/private prompts, no third-party scripts/fonts/forms/trackers, no client directives, no external JavaScript request, and zero transferred JavaScript bytes.
- Record total initial transfer no greater than 500 KiB and every raster asset no greater than 250 KiB; capture the four named screenshots and a response/DOM/asset/accessibility receipt.
- Write `artifacts/demo-002/live-route-receipt.json` with exact URL, deployment ID/SHA, viewport, status, headers/robots, DOM assertions, JS bytes, transfer/raster measurements, accessibility results, screenshot hashes, observation time, and tool versions.
- Produce a production-backed 16:9 source-versus-specialized reveal image
  using the exact-SHA route evidence. Keep the four raw production screenshots
  separately hash-addressable.
- Mirror the deployment and live-route receipts into the child run, complete
  its exact-SHA/live-URL test, create its accepted checkpoint, run child
  validation/evaluation, and mark child `goal-1` achieved only when the
  complete local-to-production condition passes.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-25 does not begin until this node is verified.

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

- Both routes pass content, source-versus-specialized, noindex, zero-JavaScript, accessibility, responsive, claim, secret, and budget checks.
- All four screenshot hashes resolve, and both desktop/mobile receipts bind task-23's deployment ID and pushed SHA.
- The child accepted checkpoint resolves the publish, deployment, route, and
  safety receipts and `goal evaluate goal-1` reports achieved.
- Route or safety failure is recorded without editing source or redeploying from this node.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
