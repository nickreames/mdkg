---
id: task-714
type: task
title: Define release information architecture copy accessibility SEO and activation contract
status: done
priority: 1
epic: epic-231
prev: task-713
next: task-715
tags: [release, content, accessibility, seo, activation]
owners: []
links: []
artifacts: []
relates: [goal-62, test-386]
blocked_by: [task-713]
blocks: [task-715]
refs: [test-386, prop-7, prop-8, dec-74]
context_refs: [goal-62, epic-231, edd-71, dec-68, dec-73, dec-74, prd-11, task-710, task-711, task-712, task-713, prop-7, prop-8]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Turn the selected direction and verified narrative into a decision-complete
content, route, responsive, accessibility, SEO, and release-activation contract.

# Acceptance Criteria

- IA specifies the post-quickstart announcement and top-level Loops pages for
  overview, templates/forks, readiness/routing/evidence/closeout, and the
  purpose-built security audit walkthrough.
- The announcement uses `Run a security audit loop` plus a secondary overview
  link, and preserves `Pre-v1 public alpha`.
- Existing install/upgrade surfaces own upgrade guidance, changelog/release notes
  own version facts, and generated CLI reference owns exact syntax.
- Exact copy claims trace to the capability ledger.
- Responsive behavior and WCAG AA contrast, keyboard/focus, semantic, metadata,
  link, reduced-motion, overflow, and no-secret criteria are explicit.
- One shared source-controlled draft/published release manifest defaults dormant
  across both Astro sites and supports local active preview without changing the
  committed state.
- Dormant production makes release routes unavailable or non-indexable and
  excludes release navigation, metadata, sitemap/LLM entries, and premature
  v0.5.0 version claims.

# Files Affected

List files/directories expected to change.

- `edd-71`, `dec-68`, and `prd-11`
- Planning proposals/decisions and implementation handoff data

# Implementation Notes

- Keep activation minimal; do not invent a general release framework.
- Generated CLI reference remains authoritative for exact syntax.
- Do not add a dedicated marketing release page or redesign the homepage hero.
- Define read-only audit precisely: no functional source edits, with durable
  mdkg findings and follow-up evidence allowed.

# Pre-Resolved Contract

`prop-8` records the source-grounded portions shared by all three visual
directions: exact routes, shared manifest schema, dormant/published/preview
projection, direct-route behavior, sitemap/Pagefind/LLM/metadata gates,
security-walkthrough command sequence, responsive breakpoints, WCAG criteria,
SEO/no-secret checks, and Goal 63 build evidence.

The operator selected Process Rail with the Readiness Ledger runtime-boundary
refinement. Accepted `dec-74` now incorporates `prop-8` and reconciles the exact
headline, body, proof composition, supported commands, and mobile behavior.

# Final Contract

- Homepage: preserve the hero and generic quickstart, then render the accepted
  Process Rail announcement only when release visibility allows it.
- Journey: announcement -> purpose-built security walkthrough -> Loops overview
  and lifecycle reference.
- Documentation: add the four exact `/loops/` routes in `prop-8`, grouped after
  Concepts and before Guides.
- Activation: both Astro sites consume `release/public-release.json`; Goal 63
  commits `draft`, local preview uses `PUBLIC_MDKG_RELEASE_PREVIEW=1`, production
  fails closed on an override, and Goal 64 alone changes `state` to `published`.
- Public truth: generated CLI reference owns syntax, purpose-built examples use
  placeholders, read-only forbids functional source edits but permits mdkg
  evidence/work writes, and mdkg does not execute agents or tools.
- Release blockers: Product Design audit B1 through B5.
- Accepted implementation guidance: audit R1 through R6.
- Deferred follow-up: audit F1 through F4; no navigation, sidebar, hero, or
  customer-metrics redesign is added to v0.5.0.
- Verification: four build modes, manifest immutability, dormant leak scans,
  version parity, desktop/mobile browser evidence, keyboard/focus, 320px reflow,
  200% zoom, forced colors, reduced motion, Starlight themes, links, metadata,
  Pagefind, sitemap, LLM output, and no-secret checks.

# Test Plan

Run `test-386` and review every unresolved copy/design question with the operator.

# Results / Evidence

- PASS: `dec-74` accepts Process Rail, exact copy, proof labels, supported
  commands, mobile hierarchy, rejected alternatives, and the complete `prop-8`
  contract.
- PASS: `edd-71`, `dec-68`, `dec-73`, and `prd-11` now consume the same accepted
  selection and runtime boundary.
- PASS: information architecture, activation, responsive, accessibility, SEO,
  no-secret, route, search, and browser criteria are decision-complete.
- PASS: audit blockers/recommendations/follow-ups are classified without
  widening the release.
- No website, docs, package, generated, deployment, or public-release file was
  changed by this planning task.

# Links / Artifacts

- `edd-71`
- `dec-73`
- `prd-11`
- `prop-7`
- `prop-8`
- `dec-74`
