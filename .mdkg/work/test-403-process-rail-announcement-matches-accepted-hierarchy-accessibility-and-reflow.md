---
id: test-403
type: test
title: Process Rail announcement matches accepted hierarchy accessibility and reflow
status: done
priority: 1
epic: epic-237
tags: [release, test, goal-63]
owners: []
links: []
artifacts: [design-qa.md, .mdkg/artifacts/goal-63/browser/marketing-process-rail-desktop.png, .mdkg/artifacts/goal-63/browser/marketing-process-rail-mobile-390x844.png, .mdkg/artifacts/goal-63/browser/process-rail-reference-comparison.png, .mdkg/artifacts/goal-63/browser/process-rail-focused-comparison.png]
relates: [goal-63]
blocked_by: [task-734]
blocks: [test-407]
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, epic-237, dec-74, prop-7, prop-8, task-733, task-734]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prove the active-preview homepage implements the accepted Process Rail faithfully
without weakening the current quickstart or accessibility baseline.

# Target / Scope

`task-733` and `task-734`; copy, hierarchy, state gate, links, semantics,
responsive behavior, keyboard, contrast, zoom, overflow, and alternate modes.

# Preconditions / Environment

Marketing active-preview build, selected Process Rail artifact, desktop plus
390x844/320px browser viewports, zoom, forced-colors, and reduced-motion modes.

# Test Cases

- Exact eyebrow, headline, body, CTA, link, stage labels, supported command
  anchors, and runtime boundary match `dec-74`.
- Announcement follows quickstart and preserves hero/navigation/following section.
- Primary CTA and secondary link resolve to accepted loop routes.
- Semantic section, `h2`, ordered list, accessible names, source order, keyboard
  order, and visible focus pass.
- Desktop uses the existing container; <=900px stacks; <=560px uses accepted
  gutters/padding and full-width CTA.
- 390px view remains concise; 320px and 200% zoom have no page overflow; command
  overflow remains contained.
- Contrast, intended target size, reduced motion, and forced colors pass.
- Unsupported `mdkg note add` and all invented commands are absent.
- Draft mode contains no announcement output.

# Results / Evidence

- Exact accepted qualifier, headline, body, four stages, supported commands,
  security CTA, and loop-overview link render immediately after quickstart.
- Browser verification passed at 1488x1058, 390x844, 320px, and simulated 200%
  layout zoom with no horizontal page overflow. The mobile CTA is 366x47.6 CSS
  pixels and the secondary action retains a 44px interaction area.
- Keyboard focus, accessible naming, ordered source structure, contrast smoke,
  reduced motion, and forced colors passed. The CTA completed the round trip to
  the local security walkthrough.
- One initial P2 command-clipping issue was fixed and recaptured. Side-by-side
  full and focused comparisons now have no remaining P0/P1/P2 finding;
  `design-qa.md` records `final result: passed`.
- Unsupported commands remain absent and canonical draft output contains no
  announcement markup.

# Notes / Follow-ups

- Compare layout intent, not bitmap pixel identity.
- Audit F1-F4 remain out of this release unless they break the new section.
