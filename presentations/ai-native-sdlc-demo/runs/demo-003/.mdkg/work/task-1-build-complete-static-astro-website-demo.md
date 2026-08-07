---
id: task-1
type: task
title: Build complete static Astro website demo
status: todo
priority: 1
epic: epic-1
parent: goal-1
prev: spike-1
next: test-1
tags: [demo, website, astro, static, zero-javascript, implementation]
owners: []
links: []
artifacts: [site/src/components/DemoOutput.astro, artifacts/implementation-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2, spike-1, chk-3]
evidence_refs: [spike-1]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-07-26
---
# Overview

Build the local website candidate selected by `spike-1` as one portable
`site/src/components/DemoOutput.astro` using static Astro, semantic HTML, CSS,
and Ocean Flow.

# Acceptance Criteria

- The generated site is a complete website candidate, not a placeholder page.
- It emits static HTML and CSS with zero client-side JavaScript.
- It contains no `client:*` directive, hydration metadata, inline or external
  runtime script, remote font, or third-party runtime asset.
- It follows `DESIGN.md` and the Ocean Flow palette.
- It supports keyboard navigation, visible focus, reduced motion, and WCAG AA
  contrast.
- It preserves source-backed mdkg claims and makes preview/promotion boundaries
  explicit.
- It stays within the run's transfer and raster asset budgets.
- It remains local-only until the caller grants separate integration authority.
- It uses warm existing dependencies in one attempt and installs no package
  during a timed run.
- Its component is self-contained enough for a thin caller adapter rather than
  a second hand-built composition.
- It records deterministic source/output hashes, attempts, bytes, and
  public-safety results in `artifacts/implementation-receipt.json`.

# Files Affected

- `site/src/components/DemoOutput.astro`
- a thin local preview page importing the portable component
- `artifacts/implementation-receipt.json`

# Implementation Notes

- Use the creative direction from `spike-1`.
- If Creative Production was used, rely on the compact direction summary rather
  than raw prompts or provider payloads.
- Favor rich, differentiated composition, static proof, and CSS-only motion
  while keeping the site inspectable and fast.
- Do not add secrets, provider payloads, raw prompt logs, analytics, or
  deployment config that requires credentials.

# Test Plan

- `test-1`
- local build command selected by the generated project
- Browser checks when the generated site is served locally
- built-output scan for scripts, hydration metadata, remote runtime assets,
  complete routes, and asset budgets
- portable-component import check

# Links / Artifacts

- `goal-1`
- `prd-2`
- `spike-1`
- `test-1`
