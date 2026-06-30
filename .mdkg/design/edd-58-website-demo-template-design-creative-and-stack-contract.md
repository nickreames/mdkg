---
id: edd-58
type: edd
title: website demo template design creative and stack contract
tags: [demo, template, design, astro, react-islands, creative-production]
owners: []
links: []
artifacts: []
relates: []
refs: [edd-26, edd-45]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

The website demo template should let repeated agent runs generate differentiated
complete websites from one mdkg graph while preserving a recognizable mdkg demo
contract, public-safety boundaries, and deterministic validation.

# Architecture

- Canonical source path: `examples/website-demo-template/`.
- First forked run path: `examples/demo-runs/demo-001/`.
- Stack: Astro static site plus React Islands for interactive sections.
- Design baseline: `DESIGN.md` with Ocean Flow colors, CTA guidance, typography,
  spacing, and responsive constraints.
- Creative Production handoff: broad freedom over page structure, sections,
  animations, visuals, and interactions, bounded by Ocean Flow, source-backed
  claims, accessibility, no-secret rules, and build validation.

# Data model

- Template graph: reusable `.mdkg` graph with one umbrella goal and scoped
  task/test/design records.
- Demo run: branch-path fork of the template with run-specific source,
  generated site files, validation receipts, and preview state.
- Creative brief: operator intent plus design constraints passed to Creative
  Production and the coding agent.

# APIs / interfaces

- `mdkg graph fork examples/website-demo-template --target
  examples/demo-runs/demo-001 --start-goal goal-1 --json`
- `mdkg goal next goal-1 --json`
- `mdkg pack <first-node> --profile concise --dry-run --stats`
- Creative Production Explore/Mood/Offer paths as optional ideation inputs.
- Browser and Chrome local validation for generated pages.

# Failure modes

- Template depends on hidden context; mitigate with one-goal startup tests.
- Creative output overclaims mdkg or stores private context; mitigate with
  public-claims and no-secret tests.
- Demo run is not repeatable; mitigate with branch-path fork receipts.
- Design drifts away from Ocean Flow; mitigate with `DESIGN.md` acceptance and
  screenshot review.

# Observability

Record fork receipts, selected goal, pack stats, local build results, Browser
and Chrome screenshots, no-secret checks, and closeout recommendation.

# Security / privacy

Do not store secrets, raw prompts, provider payloads, tokens, private repo
payloads, cookies, Vercel bypass data, or DNS credentials in graph state.

# Testing strategy

Validate fresh fork startup, local site build, Browser/Chrome responsive
rendering, no console blockers, public claim safety, and no-secret posture.

# Rollout plan

Implement template locally first, then prove a branch-path run, then request
explicit approval before any Vercel preview project or deployment work.
