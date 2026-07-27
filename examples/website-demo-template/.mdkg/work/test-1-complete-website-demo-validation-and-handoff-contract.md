---
id: test-1
type: test
title: complete website demo validation and handoff contract
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, website, validation, browser, static, zero-javascript]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-1]
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [template validates from one goal id., generated site builds locally., required routes render with semantic html and css., built demo routes contain zero client javascript scripts or hydration metadata., browser checks pass when implementation reaches local preview., keyboard focus reduced motion and wcag aa checks pass., transfer and raster asset budgets pass., creative production input is retained only as a compact public-safe direction summary., no secrets raw prompts provider payloads remote runtime assets or unsupported mdkg claims are retained., integration commit push and deployment remain caller gated.]
created: 2026-06-29
updated: 2026-07-26
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
- Integration, commit, push, and deployment remain caller-gated.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Closeout must recommend discard, rework, or caller-owned integration.
