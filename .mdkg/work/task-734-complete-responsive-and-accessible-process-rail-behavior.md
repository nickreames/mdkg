---
id: task-734
type: task
title: Complete responsive and accessible Process Rail behavior
status: done
priority: 1
epic: epic-237
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-63/browser/marketing-process-rail-desktop.png, .mdkg/artifacts/goal-63/browser/marketing-process-rail-mobile-390x844.png, .mdkg/artifacts/goal-63/browser/marketing-process-rail-mobile-390x844-part2.png, .mdkg/artifacts/goal-63/browser/process-rail-reference-comparison.png, .mdkg/artifacts/goal-63/browser/process-rail-focused-comparison.png]
relates: [goal-63]
blocked_by: [task-733]
blocks: [task-740, test-403]
refs: [test-403, edd-71, dec-73, dec-74, prd-11, prop-7, prop-8]
context_refs: [goal-62, goal-63, epic-237, dec-74, prop-7, prop-8, task-712, task-733]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Finish the Process Rail across desktop, mobile, zoom, keyboard, and alternate
display modes so the release announcement adds clarity without breaking the
existing homepage.

# Acceptance Criteria

- Above 900px use the existing 1120px container and one two-column composition.
- At 900px and below, stack copy and actions before four compact proof rows.
- At 560px and below, use existing 12px gutters and 48px section padding; make
  the primary CTA full width and keep the secondary action a text link.
- Keep one command maximum per proof row and contain command scrolling without
  horizontal page overflow.
- Pass 320 CSS px reflow and 200% browser zoom; the section should add no more
  than approximately 1.5 390x844 viewports.
- Keep source order copy, primary CTA, secondary link, then proof on every
  breakpoint.
- Ensure keyboard reachability, visible focus, meaningful accessible names,
  44x44 intended targets, semantic list structure, and color-independent states.
- Meet WCAG AA contrast: 4.5:1 normal text/link, 3:1 large text/graphics, and
  3:1 focus against adjacent colors.
- Verify reduced motion and forced colors without introducing animation,
  focus traps, or custom roving tabindex.

# Files Affected

- Process Rail component styles/tests under `mdkg-dev/`
- Accessibility and responsive smoke fixtures

# Implementation Notes

- Static screenshots are supporting evidence, not accessibility proof.
- Preserve surrounding homepage spacing and avoid viewport-scaled font sizes.
- Product Design audit blockers B4-B5 are required release gates.

# Test Plan

Run `test-403`, automated accessibility checks, keyboard traversal, 320px and
390px browser checks, 200% zoom, reduced-motion, forced-colors, and overflow
assertions in draft and active-preview modes.

# Results / Evidence

- Active-preview desktop and 390x844 browser captures preserve the selected
  Process Rail hierarchy, exact copy/actions, quickstart boundary, and following
  section. Full-view and focused side-by-side reference comparisons are linked
  in `artifacts`.
- Corrected the long fork command from visually clipped scrolling to contained
  wrapping; all four commands remain complete and one-per-row.
- At 390px the section is 1.467 viewports high, the primary CTA is 366x47.6px,
  the secondary link is 44px high, source/visual order is correct, and page
  width remains 390px. At 320px page `scrollWidth` equals `clientWidth` and every
  command remains contained.
- Simulated 200% layout zoom at a 640x400 CSS viewport with DPR 2; page width
  remained bounded and all command surfaces fit.
- Both CTAs expose a solid 3px visible focus indicator. Browser emulation proved
  reduced-motion `scroll-behavior: auto`, forced-colors rendering, no overflow,
  and 44px intended targets. Marketing console reported no warnings/errors.
- `node scripts/smoke-mdkg-dev-a11y.js` passed the corresponding semantic,
  contrast, source-order, breakpoint, and release-gate assertions.

# Links / Artifacts

- `task-733`
- `test-403`
- `.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png`
