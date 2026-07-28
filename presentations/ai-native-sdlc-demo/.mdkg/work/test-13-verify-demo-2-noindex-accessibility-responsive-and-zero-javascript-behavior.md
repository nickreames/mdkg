---
id: test-13
type: test
title: Verify Demo 2 noindex accessibility responsive and zero-JavaScript behavior
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: test-12
next: test-14
tags: [ai-native-sdlc, presentation-demo, phase-5, step-11]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-12]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-12]
evidence_refs: []
aliases: [phase-5-step-11]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
cases: [detail_desktop, detail_mobile, output_desktop, output_mobile, noindex, accessibility, zero_client_javascript]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Independently verify Demo 2 production route behavior as step 11 of Goal 5.

# Target / Scope

- goal-5
- epic-5
- test-12

# Preconditions / Environment

- Goal 5 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Both routes bind to test-12's exact-SHA production deployments.
- Detail and output pass at 1440x900 and 390x844 with HTTP 200, correct
  canonical content, source-versus-specialized proof, and Plan -> Work ->
  Evidence plus what/why/next.
- `noindex` and unlisted/gallery/sitemap exclusions pass.
- Keyboard, focus, headings, landmarks, reduced motion, contrast, responsive
  layout, privacy, claims, transfer budget, raster budget, and zero transferred
  JavaScript pass.
- Screenshot, response, DOM, asset, and accessibility hashes resolve.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-14 until the required result is evidenced.
