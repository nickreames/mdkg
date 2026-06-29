---
id: test-1
type: test
title: complete website demo validation and handoff contract
status: done
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, website, validation, browser, chrome]
owners: []
links: []
artifacts: [package.json, package-lock.json, src/pages/index.astro, src/components/GoalRunConsole.tsx, src/styles/global.css, dist/index.html, /private/tmp/mdkg-demo-001-validation/browser-desktop-top.png, /private/tmp/mdkg-demo-001-validation/browser-desktop-console-verify.png, /private/tmp/mdkg-demo-001-validation/browser-mobile-top.png, /private/tmp/mdkg-demo-001-validation/chrome-desktop-top.png, /private/tmp/mdkg-demo-001-validation/chrome-desktop-console-build.png, /private/tmp/mdkg-demo-001-validation/chrome-mobile-top.png]
relates: []
blocked_by: [task-1]
blocks: []
refs: [goal-1]
context_refs: [edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [template validates from one goal id., generated site builds locally., browser and chrome checks pass when implementation reaches local preview., creative production input is retained only as a compact public-safe direction summary., no secrets raw prompts provider payloads or unsupported mdkg claims are retained., preview deployment remains approval gated.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that the website demo run is ready for review and has a clear handoff
recommendation.

# Target / Scope

- `goal-1`
- `task-1`
- generated local website candidate

# Preconditions / Environment

- `spike-1` has selected a creative direction.
- `task-1` has produced local site source or a documented blocker.

# Test Cases

- Template validates from one goal id.
- Generated site builds locally.
- Browser and Chrome checks pass when implementation reaches local preview.
- No secrets, raw prompts, provider payloads, or unsupported mdkg claims are
  retained.
- Any Creative Production input is represented by a compact public-safe
  direction summary, not raw prompts or provider payloads.
- Preview deployment remains approval-gated.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Closeout must recommend discard, polish, or parent Vercel preview approval.
