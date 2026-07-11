---
id: task-714
type: task
title: Define release information architecture copy accessibility SEO and activation contract
status: todo
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
refs: [test-386]
context_refs: [goal-62, epic-231, edd-71, dec-68, dec-73, prd-11, task-710, task-711, task-712, task-713]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
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

# Test Plan

Run `test-386` and review every unresolved copy/design question with the operator.

# Links / Artifacts

- `edd-71`
- `dec-73`
- `prd-11`
