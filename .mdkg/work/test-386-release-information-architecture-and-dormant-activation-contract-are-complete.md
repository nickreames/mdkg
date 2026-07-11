---
id: test-386
type: test
title: Release information architecture and dormant activation contract are complete
status: done
priority: 1
epic: epic-231
tags: [release, information-architecture, activation]
owners: []
links: []
artifacts: []
relates: [goal-62, task-714]
blocked_by: [task-714]
blocks: []
refs: [task-714, dec-74, prop-8]
context_refs: [goal-62, epic-231, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Ensure the selected direction becomes a complete page/content/accessibility/SEO
contract with deterministic package-first activation.

# Target / Scope

`task-714`; post-quickstart announcement, top-level Loops docs, security example,
upgrade/release ownership, and shared release manifest.

# Preconditions / Environment

Accepted audit, concept decision, capability ledger, and value story.

# Test Cases

- Verify the homepage announcement placement, security CTA, overview link,
  `Pre-v1 public alpha` wording, and no-hero-redesign boundary are specified.
- Verify the top-level Loops group includes overview, templates/forks,
  readiness/routing/evidence/closeout, and security walkthrough pages.
- Verify purpose-built examples trace to source-backed CLI contracts and explain
  read-only source behavior versus allowed mdkg writes.
- Verify WCAG AA contrast, responsive, keyboard/focus, semantic, reduced-motion,
  overflow, SEO, link, and no-secret acceptance criteria.
- Prove the shared committed state is dormant and local preview can render active
  without changing it.
- Prove dormant production excludes release routes or route content, navigation,
  metadata, sitemap/LLM entries, indexing, and premature v0.5.0 version claims.
- Confirm activation is one deterministic Goal 4 state change.

# Results / Evidence

PASS on 2026-07-11.

- Accepted `dec-74` fixes the homepage placement, Process Rail hierarchy, exact
  copy, CTA/link destinations, runtime boundary, supported commands, and mobile
  behavior.
- `prop-8` fixes all four Loops routes, purpose-built security walkthrough,
  shared manifest schema, draft/published/preview projection, and direct-route,
  navigation, metadata, sitemap, Pagefind, LLM, robots, and version gates.
- Responsive, WCAG AA, keyboard/focus, semantic, reduced-motion, overflow,
  forced-colors, theme, SEO, link, and no-secret criteria are explicit.
- Goal 64 can activate the release through the single `draft` to `published`
  manifest state change only after package proof.
- Product Design audit B1-B5 are implementation blockers, R1-R6 are accepted
  guidance, and F1-F4 are explicitly deferred.
- No functional source or deployment work occurred.

# Notes / Follow-ups

- Reject unnecessary release-framework, dedicated marketing-page, and broad
  homepage-redesign scope.
