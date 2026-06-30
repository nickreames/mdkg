---
id: chk-340
type: checkpoint
title: short path demo proof accepted
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-622]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-622]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

The local short-path Demo 1 proof is accepted. `mdkg-dev` now has a public demo
index, an accepted Demo 1 detail route, and a noindex output preview route backed
by sanitized snapshot data and local Browser/Chrome evidence.

# Scope Covered

- `task-622`
- `goal-44`
- `test-324`
- `test-329`

## Changed Surfaces

- mdkg closeout evidence for `task-622`
- source route artifacts:
  - `mdkg-dev/src/pages/demos.astro`
  - `mdkg-dev/src/pages/demo/[id].astro`
  - `mdkg-dev/src/pages/demo/[id]/output.astro`
- local Browser/Chrome screenshots under `/private/tmp/mdkg-goal44-demo-routes`

## Boundaries

- in scope: local source implementation, local build/smoke, Browser/Chrome proof,
  no-secret/public-claims audit, acceptance recommendation
- out of scope: push, deploy, DNS, tag, npm publish, analytics activation,
  provider mutation, production promotion
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `dec-58`: public accepted demos use `/demo/1`, `/demo/2`, and `/demos`.
- `dec-59`: v1 uses existing `mdkg-dev` Astro routes.
- `edd-60`: demo pages expose sanitized graph, filesystem, and output surfaces.
- `edd-61`: heavy viewer work remains deferred and lazy-loaded.

# Implementation Summary

Demo 1 is accepted for local short-path source integration. The public pages
show the mdkg graph, selected read-only filesystem, final output preview, and
safety boundaries without a separate Vercel project or DNS model.

# Goal Closeout

- Goal condition result: accepted local proof for Demo 1 short-path routes.
- Scoped nodes closed: `task-628`, `task-629`, `task-630`, `test-324`,
  `test-329`, `task-622`.
- Remaining deferred work: `test-325` must record that this accepted checkpoint
  gates `goal-47`; live push/deploy/DNS remains outside this goal.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
- result: passed.
- command: `npm run smoke:mdkg-dev`
- result: passed.
- command: `npm run smoke:mdkg-dev-seo`
- result: passed.
- command: `npm run smoke:demo-graph`
- result: passed when rerun sequentially after an initial parallel build race.
- command: Browser and Chrome desktop/mobile validation
- result: passed for `/demos`, `/demo/1`, and `/demo/1/output`.
- command: no-secret/public-claims scan over `mdkg-dev/src` and
  `mdkg-dev/public/demo-001`
- result: no credentials or tokens; only benign safety wording matched.

## Pass / Fail Status

- status: pass; accepted for local short-path source proof

## Known Warnings

- warning: a first `smoke:demo-graph` run raced another concurrent root build and
  failed with a transient `dist/init` filesystem conflict; the same smoke passed
  when rerun sequentially.
- warning: Demo 1 output is intentionally `noindex,nofollow`.

# Known Issues / Follow-ups

- Advanced embedded workspace viewer remains `goal-47`.
- Production push/deploy/live validation remains approval-gated and is not part
  of this local closeout.

## Follow-up Refs

- `test-325`
- `goal-47`
- `epic-207`
- `spike-24`

# Links / Artifacts

- `/private/tmp/mdkg-goal44-demo-routes`
- `mdkg-dev/src/data/demoSnapshots.ts`
- `mdkg-dev/public/demo-001/ocean-flow-map.svg`
- `mdkg-dev/src/pages/demos.astro`
- `mdkg-dev/src/pages/demo/[id].astro`
- `mdkg-dev/src/pages/demo/[id]/output.astro`

# Raw Content Safety

- Evidence is summarized and bounded to local screenshots, source refs, and mdkg
  node/checkpoint refs.
