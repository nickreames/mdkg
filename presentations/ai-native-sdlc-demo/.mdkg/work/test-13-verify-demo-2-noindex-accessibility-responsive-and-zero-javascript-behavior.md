---
id: test-13
type: test
title: Verify Demo 2 noindex accessibility responsive and zero-JavaScript behavior
status: done
priority: 1
epic: epic-5
parent: goal-5
prev: test-12
next: test-14
tags: [ai-native-sdlc, presentation-demo, phase-5, step-11]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/live-route-receipt.json, artifacts/demo-002/screenshots/detail-desktop.png, artifacts/demo-002/screenshots/detail-mobile.png, artifacts/demo-002/screenshots/output-desktop.png, artifacts/demo-002/screenshots/output-mobile.png, artifacts/demo-002/production-reveal/source-vs-specialized-16x9.png]
relates: []
blocked_by: [test-12]
blocks: [test-14]
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-12]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-12]
evidence_refs: [task-23, task-24, test-12]
aliases: [phase-5-step-11]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
cases: [detail_desktop, detail_mobile, output_desktop, output_mobile, noindex, accessibility, zero_client_javascript]
created: 2026-07-26
updated: 2026-07-27
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

Passed on 2026-07-27 against the exact-SHA production deployment recorded by
test-12.

- `/demo/2/` and `/demo/2/output/` returned HTTP 200 at 1440x900 and 390x844.
  Both had zero horizontal overflow and retained the source-versus-specialized,
  Plan -> Work -> Evidence, and what/why/next story.
- Both routes are `noindex`; Demo 2 is unlisted and absent from the live demo
  index and sitemap.
- Exact-SHA static/privacy inspection found zero client directives, executable
  scripts, external JavaScript, transferred JavaScript bytes, remote fonts,
  third-party runtime assets, forms, trackers, analytics, raster assets,
  secret-pattern matches, or raw private prompt content.
- The combined detail surface transferred 18,348 compressed bytes against the
  512,000-byte limit. The corresponding exact-SHA HTML/CSS totals 74,739
  uncompressed bytes.
- The accessibility smoke covered 22 pages and passed. Manual checks passed for
  headings, landmarks, keyboard focus, visible focus, reduced motion, WCAG AA
  contrast, desktop/mobile layout, and console cleanliness.
- All four screenshot hashes and the production reveal hash resolve. Independent
  parsing rechecked every route, visibility, static/privacy, accessibility,
  screenshot, and smoke assertion; all cases passed.

# Notes / Follow-ups

- One initial parallel companion-smoke attempt raced on a shared `dist/` tree.
  The accessibility suite passed in that attempt; all three affected companion
  suites passed sequentially against unchanged HEAD. The receipt records this
  non-product warning.
