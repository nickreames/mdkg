---
id: chk-338
type: checkpoint
title: demo viewer lazy load isolation passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-329]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-329]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

The v1 demo viewer does not add a client-side JavaScript bundle to the homepage
or normal docs surfaces. The current `/demos`, `/demo/1`, and `/demo/1/output`
implementation is static Astro with generated CSS only.

# Scope Covered

- `test-329`
- `goal-44`
- `edd-61`

## Changed Surfaces

- mdkg test/checkpoint evidence
- `mdkg-dev/dist/_astro` build output inspection
- Browser and Chrome local validation artifacts

## Boundaries

- in scope: lazy-load/homepage isolation proof
- out of scope: embedded VS Code-style workspace viewer implementation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `edd-61`: heavy viewer code must be lazy-loaded and must not affect homepage
  or normal docs load time.

# Implementation Summary

No heavy viewer code was introduced in v1. Build output inspection showed only
CSS assets under `mdkg-dev/dist/_astro`, and Browser/Chrome validation reported
no console errors or horizontal overflow on the demo routes.

# Test Proof

- Test target: homepage/docs load isolation from demo viewer code.
- Fixtures or temp repos: local `mdkg-dev` preview at `127.0.0.1:4322`.
- Coverage gaps: live production validation remains outside this local goal.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
- result: passed; generated demo routes.
- command: `ls mdkg-dev/dist/_astro`
- result: CSS-only generated assets for the static demo pages.
- command: Browser and Chrome local route validation
- result: desktop and mobile screenshots captured under
  `/private/tmp/mdkg-goal44-demo-routes`; no console errors or horizontal
  overflow observed.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none for lazy-load isolation

# Known Issues / Follow-ups

- Advanced embedded workspace viewer work remains deferred to `goal-47`.

## Follow-up Refs

- `goal-47`
- `epic-207`
- `spike-24`

# Links / Artifacts

- `/private/tmp/mdkg-goal44-demo-routes/browser-desktop-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/browser-mobile-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-desktop-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-mobile-demo-1.png`
- `mdkg-dev/dist/_astro`

# Raw Content Safety

- Browser evidence is summarized and screenshot artifacts are local only.
