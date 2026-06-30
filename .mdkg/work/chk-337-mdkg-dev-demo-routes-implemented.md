---
id: chk-337
type: checkpoint
title: mdkg dev demo routes implemented
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-630]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-630]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

The `mdkg-dev` app now has local source routes for the accepted Demo 1
short-path model: `/demos`, `/demo/1`, and `/demo/1/output`.

# Scope Covered

- `task-630`
- `goal-44`

## Changed Surfaces

- `mdkg-dev/src/pages/demos.astro`
- `mdkg-dev/src/pages/demo/[id].astro`
- `mdkg-dev/src/pages/demo/[id]/output.astro`
- `mdkg-dev/src/components/NavBar.astro`
- `mdkg-dev/src/components/Footer.astro`
- `mdkg-dev/src/pages/sitemap.xml.ts`

## Boundaries

- in scope: local static route implementation and navigation discovery
- out of scope: push, deploy, DNS, tag, npm publish, provider mutation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `dec-58` short path URLs are reflected in source routes.
- `dec-59` existing `mdkg-dev` Astro routing is used instead of a separate
  Vercel project.
- `edd-60` surfaces appear on the detail page.
- `edd-61` is satisfied by static Astro pages and no demo viewer JS bundle.

# Implementation Summary

Added a demo gallery, a static demo detail route, and a noindex output route.
Navigation and sitemap entries expose `/demos` and `/demo/1`; the output preview
is intentionally omitted from the sitemap.

# Implementation Details

- Code or graph surfaces changed: Astro routes, shared nav/footer links, sitemap
  entries.
- Architecture or data-shape notes: demo detail renders read-only graph,
  filesystem excerpts, output preview, and safety boundary sections from the
  sanitized snapshot.
- Compatibility notes: future demos can be added by extending the snapshot data.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
- result: passed and emitted `/demos/index.html`, `/demo/1/index.html`, and
  `/demo/1/output/index.html`.
- command: `node dist/cli.js task done task-630 --checkpoint ... --json`
- result: checkpoint `chk-337` created.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none specific to this route implementation

# Known Issues / Follow-ups

- Local Browser/Chrome route evidence remained required in `test-324`.
- Lazy-load/homepage isolation proof remained required in `test-329`.

## Follow-up Refs

- `test-324`
- `test-329`
- `test-325`

# Links / Artifacts

- `mdkg-dev/src/pages/demos.astro`
- `mdkg-dev/src/pages/demo/[id].astro`
- `mdkg-dev/src/pages/demo/[id]/output.astro`

# Raw Content Safety

- Route evidence is summarized; raw browser traces and screenshots are kept under
  `/private/tmp/mdkg-goal44-demo-routes`.
