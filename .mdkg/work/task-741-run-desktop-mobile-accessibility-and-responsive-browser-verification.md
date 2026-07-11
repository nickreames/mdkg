---
id: task-741
type: task
title: Run desktop mobile accessibility and responsive browser verification
status: done
priority: 1
epic: epic-240
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: [design-qa.md, .mdkg/artifacts/goal-63/browser/marketing-process-rail-desktop.png, .mdkg/artifacts/goal-63/browser/marketing-process-rail-mobile-390x844.png, .mdkg/artifacts/goal-63/browser/docs-security-desktop-1440x900.png, .mdkg/artifacts/goal-63/browser/docs-security-content-mobile-390x844.png, .mdkg/artifacts/goal-63/browser/process-rail-reference-comparison.png, .mdkg/artifacts/goal-63/browser/process-rail-focused-comparison.png]
relates: [goal-63]
blocked_by: [task-740]
blocks: [task-742, test-407]
refs: [test-403, test-404, test-405, test-407, edd-71, dec-73, dec-74, prd-11, prop-7, prop-8]
context_refs: [goal-62, goal-63, epic-240, dec-74, prop-7, prop-8, task-712, task-713, task-740]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Inspect the locally built active-preview experience in a real browser and prove
that the selected direction, docs journey, and accessibility contract work at
the viewports and interaction modes users will encounter.

# Acceptance Criteria

- Capture and inspect active-preview mdkg.dev at desktop and 390x844, including
  quickstart insertion boundary and complete Process Rail section.
- Compare hierarchy, copy, actions, spacing, and proof composition to the
  selected `01-process-rail.png` artifact and accepted responsive contract.
- Capture and inspect docs desktop/mobile navigation plus all four loop routes,
  the security walkthrough, code blocks, and CTA round trip.
- Verify keyboard traversal, visible focus, skip link, headings, landmarks,
  accessible names, current-page state, and mobile-menu semantics.
- Verify 320px reflow, 200% zoom, no horizontal page overflow, contained command
  scrolling, 44px intended targets, reduced motion, and forced colors.
- Verify mdkg.dev contrast and Starlight light/dark/auto rendering.
- Run automated accessibility checks and treat screenshots as supporting, not
  conformance, evidence.
- Confirm draft mode remains visually and directly unavailable after preview
  verification.

# Files Affected

- `.mdkg/artifacts/goal-63/` browser screenshots and reports
- Source fixes required to satisfy accepted Goal 63 scope

# Implementation Notes

- Use Product Design Image-to-Code/design QA guidance against the selected
  artifact and Browser for local verification.
- Do not widen into audit follow-ups F1-F4 unless they directly break the new
  release surfaces.
- Do not deploy or inspect production in Goal 63.

# Test Plan

Record browser URLs, viewport sizes, screenshots, accessibility output, keyboard
results, contrast evidence, theme coverage, and any corrected regressions in
`test-407` and a checkpoint.

# Results / Evidence

- Captured the active-preview homepage at 1488x1058 and 390x844, the docs
  security walkthrough at desktop/mobile, and both full-view and focused
  side-by-side comparisons against the accepted Process Rail direction.
- Verified the homepage at 320px, 390x844, desktop, and simulated 200% layout
  zoom with no horizontal page overflow. All four command rows remain contained;
  the mobile CTA is 366x47.6 CSS pixels and the secondary action has a 44px
  interaction area.
- Exercised the security CTA round trip, docs mobile menu, current-page state,
  keyboard focus, skip/navigation landmarks, reduced motion, forced colors,
  and Starlight light/dark rendering. Browser console warnings/errors were empty.
- Found and fixed one P2 command-clipping issue, then recaptured and recombined
  the implementation with the source. The final report at `design-qa.md` records
  `final result: passed` with no remaining P0/P1/P2 finding.
- Raised Starlight mobile search/menu controls to the intended 44x44 CSS-pixel
  target and reverified them in-browser. Automated accessibility smoke also
  passed across 10 pages.
- Draft release content remains unavailable from canonical builds; all browser
  inspection used explicit local preview state and made no production request.

# Links / Artifacts

- `.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png`
- `test-407`
- `prop-8`
