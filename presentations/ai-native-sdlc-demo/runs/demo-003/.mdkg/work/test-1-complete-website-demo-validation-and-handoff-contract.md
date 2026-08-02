---
id: test-1
type: test
title: complete website demo validation and handoff contract
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: task-1
next: task-2
tags: [demo, website, validation, browser, static, zero-javascript]
owners: []
links: []
artifacts: [artifacts/local-validation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2, spike-1, task-1, chk-3]
evidence_refs: [spike-1, task-1]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [template validates from one goal id., generated site builds locally with warm dependencies in one attempt., portable demooutput component exists and is importable by a thin wrapper., required local routes render with semantic html and css., built demo routes contain zero client javascript scripts or hydration metadata., browser checks pass when implementation reaches local preview., keyboard focus reduced motion and wcag aa checks pass., transfer and raster asset budgets pass., creative production input is retained only as a compact public-safe direction summary., no secrets raw prompts provider payloads remote runtime assets or unsupported mdkg claims are retained., integration remains gated by a separate caller lease.]
created: 2026-06-29
updated: 2026-07-28
---
# Overview

Validate that the website demo run is ready for review and has a clear handoff
recommendation.

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
- Warm dependency resolution succeeds in one attempt without installation.
- `DemoOutput.astro` is portable and the local preview is a thin wrapper.
- Required detail and output routes render as static semantic HTML and CSS.
- Built demo routes contain no generated JavaScript, `<script>` tags, hydration
  metadata, client directives, remote fonts, or third-party runtime assets.
- Browser checks pass when implementation reaches local preview.
- Keyboard navigation, visible focus, reduced motion, and WCAG AA contrast pass.
- Initial page transfer is at most 500 KiB and no raster asset exceeds 250 KiB.
- No secrets, raw prompts, provider payloads, or unsupported mdkg claims are
  retained.
- Any Creative Production input is represented by a compact public-safe
  direction summary, not raw prompts or provider payloads.
- No shared-source integration occurs without a separate caller-owned lease.

# Results / Evidence

Write deterministic results to `artifacts/local-validation.json`, including
source/output hashes, build count, route inventory, public-safety scans,
accessibility/budget results, and the next QID.

# Notes / Follow-ups

- On pass, continue to `task-2`; this test grants no integration authority.
