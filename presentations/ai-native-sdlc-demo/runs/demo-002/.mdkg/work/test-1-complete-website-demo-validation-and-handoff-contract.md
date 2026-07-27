---
id: test-1
type: test
title: Verify the local Demo 2 candidate and public-safety contract
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: task-1
next: task-2
tags: [demo, demo-002, website, validation, static, zero-javascript]
owners: [demo-002-agent]
links: []
artifacts: [artifacts/local-validation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, task-1, prd-2, edd-1, dec-1, dec-2]
context_refs: [goal-1, task-1, prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [child_graph_validates, local_astro_build, semantic_html, zero_client_javascript, responsive_rendering, keyboard_focus, reduced_motion, wcag_aa_palette, transfer_budget, raster_budget, no_secrets, supported_claims, no_publication]
created: 2026-06-29
updated: 2026-07-27
---
# Overview

Validate the run-local Demo 2 candidate before canonical adapter integration.

# Target / Scope

- `goal-1`
- `prd-2`
- `task-1`
- generated local website candidate

# Preconditions / Environment

- `spike-1` has selected a creative direction.
- `task-1` has produced local site source or a documented blocker.

# Test Cases

- Template validates from one goal id.
- Generated site builds locally.
- The local page renders as static semantic HTML and CSS.
- Built output contains no generated JavaScript, `<script>` tags, hydration
  metadata, client directives, remote fonts, or third-party runtime assets.
- Browser checks pass when implementation reaches local preview.
- Keyboard navigation, visible focus, reduced motion, and WCAG AA contrast pass.
- Initial page transfer is at most 500 KiB and no raster asset exceeds 250 KiB.
- No secrets, raw prompts, provider payloads, or unsupported mdkg claims are
  retained.
- Any Creative Production input is represented by a compact public-safe
  direction summary, not raw prompts or provider payloads.
- The copy includes the required story and only source-supported mdkg claims.
- Canonical integration remains next; commit, push, provider inspection, and
  deployment remain forbidden.

# Results / Evidence

Passed local execution on 2026-07-27.

- `npm --prefix presentations/ai-native-sdlc-demo/runs/demo-002/site run build`
  built one static page successfully.
- The complete output is 30,205 bytes, below the 500 KiB initial-transfer
  budget.
- Built-output inspection found zero JavaScript files, `<script>` tags,
  `client:*` directives, Astro islands, remote fonts, forms, trackers,
  secret assignments, or raster assets.
- Browser inspection at 1440 x 1000 and 390 x 844 found no horizontal overflow,
  one `h1`, semantic landmarks, `noindex,nofollow`, visible-focus CSS, a skip
  link, and reduced-motion handling.
- Measured small-text color pairs meet WCAG 2.x AA after the muted and coral
  label colors were tightened; the minimum recorded ratio is 4.66:1.
- The candidate contains the required hero, problem framing, Plan -> Work ->
  Evidence, reusable-versus-specialized proof, what/why/next handoff,
  quickstart, feedback CTA, public-alpha/pre-v1 statement, and local-only
  publication boundary.
- Exact structured evidence is retained in
  `artifacts/local-validation.json`; implementation hashes and build inventory
  are retained in `artifacts/implementation-receipt.json`.

# Notes / Follow-ups

- Passing this node routes to `task-2`; it does not authorize publication.
- The browser connector's full-page stitching repeated fixed-position capture
  segments, so acceptance used viewport inspection plus DOM dimensions and
  semantic metrics. Canonical route captures are produced separately by Goal 4.
