---
id: edd-1
type: edd
title: Demo 2 durable-continuity architecture and evidence contract
tags: [demo, demo-002, design, ocean-flow, static-astro, evidence]
owners: [demo-002-agent]
links: []
artifacts: []
relates: []
refs: [goal-1, prd-2, dec-1, dec-2]
aliases: []
created: 2026-06-29
updated: 2026-07-26
---
# Overview

Demo 2 specializes the reusable graph into a local Astro candidate and adapts
the accepted public-safe evidence into mdkg.dev through Goal 2's generic
per-demo record and compile-time output-component registry.

# Architecture

- `site/` is the run-owned local static Astro implementation.
- `artifacts/creative-direction.md` retains the public-safe creative decision.
- `task-1` and `test-1` build and validate the run-local candidate.
- `task-2` maps accepted evidence into
  `mdkg-dev/src/data/demos/demo-2.ts` and a distinct
  `mdkg-dev/src/components/demos/Demo2Output.astro`.
- The generic detail and output routes enumerate the Demo 2 record; no
  Demo 2-only route is introduced.
- `test-2` validates the canonical build and leaves `task-3` next.
- Goal 5 owns later publication and exact-SHA/live evidence.

# Data model

- Source and specialized goal snapshots retain local ID `goal-1` and separate
  SHA-256 values.
- `DemoSnapshot` carries source goal, executed goal, work, evidence, safety,
  validation, and the `demo-2` output component key.
- Receipts contain compact public-safe hashes, paths, commands, results, and
  authority state.

# APIs / interfaces

- Child mdkg `goal next`, `pack`, `claim`, `task`, `evaluate`, and `pause`.
- Goal 2's `DemoSnapshot`, `demoSnapshots`, `demoRouteInventory`, and static
  output-component registry.
- Local Astro build and HTTP route checks.
- Built-output scans for scripts, hydration, remote assets, route completeness,
  transfer budget, and raster budget.

# Failure modes

- Generic output: require the retained durable-continuity direction.
- Unsupported claims: validate public copy against current mdkg source.
- Secret leakage: exclude prompts, credentials, tokens, cookies, provider
  payloads, and private context.
- Runtime drift: fail on scripts, hydration, remote fonts, forms, trackers, or
  third-party runtime assets.
- Accidental publication: pause before `task-3` unless Goal 5's separate human
  approval exists.

# Observability

Record graph receipts, source and specialized hashes, build results, route
scans, screenshots, accessibility evidence, no-secret checks, budgets, child
state, and the exact next node.

# Security / privacy

No secrets, raw prompts, provider payloads, credentials, private repo data,
cookies, bypass data, DNS credentials, or analytics keys belong in the graph,
site, records, or receipts.

# Testing strategy

Validate graph startup and packs; the run-local and canonical static builds;
semantic rendering; keyboard and focus behavior; reduced motion; WCAG AA
palette contrast; zero client JavaScript; noindex/unlisted behavior; budgets;
no-secret posture; public claims; and the publication-gate pause.

# Rollout plan

Execute the local and canonical segment in Goal 4, seal a reproducible fallback,
and pause. Goal 5 may resume from `task-3` only after a distinct approval.
