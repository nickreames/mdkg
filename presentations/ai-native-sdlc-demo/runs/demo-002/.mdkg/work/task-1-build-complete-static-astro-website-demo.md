---
id: task-1
type: task
title: Build the local Demo 2 durable-continuity Astro site
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: spike-1
next: test-1
tags: [demo, demo-002, website, astro, static, zero-javascript, implementation]
owners: [demo-002-agent]
links: []
artifacts: [site/, artifacts/implementation-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, spike-1, prd-2, edd-1, dec-1, dec-2]
context_refs: [goal-1, spike-1, prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-07-27
---
# Overview

Build the complete run-local implementation under `site/` from the accepted
durable-continuity direction.

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
- It includes the hero promise, problem framing, Plan -> Work -> Evidence,
  reusable-versus-specialized proof, what/why/next, quickstart, and feedback
  CTA.
- It identifies mdkg as public alpha and pre-v1.
- It stays within the run's transfer and raster asset budgets.
- It includes an implementation receipt with changed paths, build command,
  output inventory, and hashes.

# Files Affected

- `site/**`
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
- local Astro build
- responsive local HTTP checks
- built-output scan for scripts, hydration metadata, remote runtime assets,
  complete routes, and asset budgets

# Links / Artifacts

- `goal-1`
- `prd-2`
- `spike-1`
- `test-1`
