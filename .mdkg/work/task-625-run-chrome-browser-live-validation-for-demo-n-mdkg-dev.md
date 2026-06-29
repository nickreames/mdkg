---
id: task-625
type: task
title: run Chrome Browser live validation for demo-N mdkg dev
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, chrome, browser, live-validation, hosting]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-624]
blocks: [task-626, test-326]
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate the durable demo host in Browser and Chrome after approved Vercel/DNS
work.

# Acceptance Criteria

- `https://demo-N.mdkg.dev/` loads the accepted demo.
- Browser and Chrome desktop/mobile checks pass.
- Console health, responsive rendering, SEO/noindex/canonical policy, and
  public-claims posture are recorded.
- Evidence ties live content to the accepted preview and deployment id.

# Files Affected

- mdkg evidence/checkpoint nodes
- local screenshots and receipts under `/private/tmp`

# Implementation Notes

- Do not use live validation to approve new content changes; it validates the
  already accepted demo.

# Test Plan

- Browser desktop/mobile live checks.
- Chrome desktop/mobile live checks.
- `test-326`

# Links / Artifacts

- `goal-46`
- `test-326`
