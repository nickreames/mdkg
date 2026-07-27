---
id: edd-1
type: edd
title: Ocean Flow website demo design and creative production contract
tags: [demo, design, ocean-flow, creative-production, website]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1, prd-2, dec-1, dec-2]
aliases: []
created: 2026-06-29
updated: 2026-07-26
---
# Overview

This template should produce differentiated website candidates from one graph
while preserving a recognizable visual baseline and safe demo boundaries.

# Architecture

- `DESIGN.md` defines the Ocean Flow visual system.
- `prd-2` defines the reusable product requirements and authority boundary.
- `WEBSITE_DEMO_TEMPLATE_BRIEF.md` defines the operator-facing brief.
- `CREATIVE_PRODUCTION_INTAKE.md` defines the optional Creative Production
  ideation contract and retained summary shape.
- `goal-1` drives a complete local website run.
- `spike-1` chooses audience, offer, structure, and creative direction.
- `task-1` implements the site using static Astro and CSS.
- `test-1` validates build, routes, rendering, accessibility, claims, budgets,
  and the zero-client-JavaScript boundary.

# Data model

- Creative direction: audience, offer, page structure, visual metaphor,
  CSS-only motion, static proof concepts, asset needs, source-backed content
  facts, explicit non-goals, and validation risks.
- Website candidate: local source, screenshots, build result, and closeout
  recommendation.
- Closeout recommendation: discard, rework, or return the accepted candidate to
  the caller for a separate integration decision.

# APIs / interfaces

- `mdkg goal next goal-1 --json`
- `mdkg pack spike-1 --profile concise --dry-run --stats`
- Optional Creative Production exploration for visual direction.
- Browser checks when a local preview exists.
- Built-output scan for scripts, hydration metadata, remote runtime assets,
  route completeness, transfer budget, and raster asset budget.

# Failure modes

- Generic output: require a recorded creative direction before implementation.
- Unsupported claims: validate public copy against source-backed mdkg behavior.
- Secret leakage: keep raw prompts, credentials, tokens, provider payloads, and
  private context out of files and checkpoints.
- Runtime drift: fail when a demo route emits JavaScript, hydration metadata,
  unexpected scripts, remote fonts, or third-party runtime assets.
- Accidental side effects: integration and publication remain caller-gated.

# Observability

Record mdkg command receipts, build results, route and built-output scans,
screenshots, accessibility results, no-secret checks, asset budgets, and the
closeout recommendation.

# Security / privacy

No secrets, raw prompts, provider payloads, credentials, private repo data,
cookies, Vercel bypass data, DNS credentials, or analytics keys belong in this
template.

# Testing strategy

Validate graph startup, pack coverage, local build, static routes, semantic
rendering, keyboard accessibility, reduced-motion support, WCAG AA contrast,
zero client JavaScript, transfer and raster budgets, no-secret posture, and
public-claims safety.

# Rollout plan

Use locally first. Return an accepted candidate and compact evidence to the
caller only after validation; the caller owns every later integration and
publication decision.
