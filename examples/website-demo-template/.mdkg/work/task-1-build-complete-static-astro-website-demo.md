---
id: task-1
type: task
title: Build complete static Astro website demo
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, website, astro, static, zero-javascript, implementation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-1]
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-07-26
---
# Overview

Build the local website candidate selected by `spike-1` using static Astro,
semantic HTML, CSS, and the Ocean Flow design system.

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

# Files Affected

- Future implementation should add website source under the forked run path.
- This template itself records the contract and expected evidence only.

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

# Links / Artifacts

- `goal-1`
- `prd-2`
- `spike-1`
- `test-1`
