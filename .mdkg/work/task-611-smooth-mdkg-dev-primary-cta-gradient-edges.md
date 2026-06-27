---
id: task-611
type: task
title: smooth mdkg.dev primary CTA gradient edges
status: done
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, mdkg-dev, visual-polish, cta, gradient, browser, chrome]
owners: []
links: []
artifacts: [/private/tmp/mdkg-task611-cta-gradient-20260627/browser-cta-gradient-receipt.json, /private/tmp/mdkg-task611-cta-gradient-20260627/browser-desktop-1280x900.png, /private/tmp/mdkg-task611-cta-gradient-20260627/browser-mobile-390x844.png, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-cta-gradient-receipt.json, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-desktop-default.png, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-mobile-390x844.png]
relates: []
blocked_by: []
blocks: [test-308, test-310, task-606]
refs: [task-605]
context_refs: []
evidence_refs: [chk-309]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Smooth the rounded-edge rendering of mdkg.dev primary CTA gradients by moving
the gradient paint from the anchor surface onto an overscanned pseudo-element.

The task is intentionally narrow: it only changes primary CTA button rendering
and local evidence for the `0.4.0` public launch lane.

# Acceptance Criteria

- Primary `ButtonLink` CTAs no longer paint a gradient directly on the rounded
  anchor surface.
- Primary CTAs use a clipped overscanned pseudo-element gradient matching the
  proven Ocean Flow pattern from `nicholas-reames-com`.
- Secondary and ghost buttons remain visually and structurally unchanged.
- Existing button dimensions, wrapping, focus behavior, hover transform, and
  mobile full-width CTA behavior remain unchanged.
- Local Browser and Chrome validation cover the homepage primary `Get started`
  CTA and lower-page primary CTA at desktop and mobile sizes.
- No publish, push, deploy, tag, DNS, analytics, or npm release side effect
  occurs in this task.

# Files Affected

- `mdkg-dev/src/styles/global.css`
- `mdkg-dev/src/components/ButtonLink.astro`
- mdkg task/checkpoint evidence for `goal-42`

# Implementation Notes

- Add a shared CTA gradient token instead of duplicating the gradient in the
  component.
- Keep the primary button's border box stable by retaining the existing border
  and making the direct background transparent.
- Use `position: relative`, `isolation: isolate`, `overflow: hidden`, and a
  `::before` pseudo-element with `inset: -1px`, inherited radius, and
  `pointer-events: none`.
- Do not refactor unrelated gradients, diagrams, cards, or docs styling.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --json`
- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-seo`
- Browser local desktop/mobile CTA validation
- Chrome local desktop/mobile CTA validation
- `git diff --check`

# Links / Artifacts

- `goal-42`
- `task-605`
