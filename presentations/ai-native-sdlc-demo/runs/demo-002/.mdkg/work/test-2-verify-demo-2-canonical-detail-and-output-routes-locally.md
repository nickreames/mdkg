---
id: test-2
type: test
title: Verify Demo 2 canonical detail and output routes locally
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: task-2
next: task-3
tags: [demo, demo-002, test, canonical-routes, public-safety]
owners: [demo-002-agent]
links: []
artifacts: [artifacts/canonical-route-validation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, task-2, prd-2, edd-1, dec-1, dec-2]
context_refs: [goal-1, task-2, prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [canonical_build, detail_route, output_route, listed_false, noindex_true, sitemap_exclusion, zero_client_javascript, responsive_rendering, accessibility, public_safety, asset_budget, publication_next]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Prove the accepted local candidate works through the canonical static adapter
without publication.

# Target / Scope

- `task-2`
- `mdkg-dev` generic demo record and output registry
- `/demo/2/`
- `/demo/2/output/`

# Preconditions / Environment

- `test-1` is done.
- The Demo 2 record and component are integrated locally.
- No publication authority exists.

# Test Cases

- Canonical Astro build passes.
- Detail and output routes return complete semantic HTML at desktop and mobile
  viewports.
- Demo 2 is absent from gallery navigation and sitemap output.
- Detail and output routes carry noindex.
- Route output contains zero client JavaScript, hydration, remote fonts, forms,
  trackers, or third-party runtime assets.
- Palette contrast, visible focus, keyboard order, and reduced-motion behavior
  meet the contract.
- Transfer and raster budgets pass.
- Child `goal next goal-1` selects untouched `task-3`.

# Results / Evidence

Passed canonical local verification on 2026-07-27.

- `npm --prefix mdkg-dev run build` generated `/demo/2/` and
  `/demo/2/output/` through the generic record and output-component registries.
- Both routes have exactly one `h1`, semantic landmarks, noindex metadata, zero
  client scripts, zero Astro islands, and no remote font, form, tracker,
  third-party runtime, or raster asset.
- The routes passed browser inspection at 1280 x 720 and 390 x 844 with no
  horizontal overflow. The output preserves visible focus, natural link order,
  reduced-motion behavior, and the measured 4.66:1 minimum text contrast.
- Demo 2 is absent from the gallery and sitemap; an unknown Demo 999 route is
  not generated.
- Initial local transfer is 38,690 bytes for detail and 36,049 bytes for
  output, both far below 500 KiB.
- SEO, accessibility, and performance regressions passed. The older base smoke
  still contains a pre-Demo-2 sentinel that forbids every reserved Demo 2 route;
  it fails at that exact stale assertion. Goal 4 intentionally creates Demo 2
  and its frozen source allowlist excludes scripts and fixtures, so this is
  retained as explicit test drift rather than bypassed.
- Exact route hashes, browser metrics, regression classification, and authority
  boundaries are recorded in `artifacts/canonical-route-validation.json`.

# Notes / Follow-ups

- On pass, Goal 4 must pause the child before `task-3`.
- Updating the stale base-smoke reservation belongs to a separately authorized
  test-maintenance change; the current route-specific verification is complete.
