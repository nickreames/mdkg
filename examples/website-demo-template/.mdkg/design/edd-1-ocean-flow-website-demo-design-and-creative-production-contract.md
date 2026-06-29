---
id: edd-1
type: edd
title: Ocean Flow website demo design and creative production contract
tags: [demo, design, ocean-flow, creative-production, website]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1, dec-1, dec-2]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

This template should produce differentiated website candidates from one graph
while preserving a recognizable visual baseline and safe demo boundaries.

# Architecture

- `DESIGN.md` defines the Ocean Flow visual system.
- `WEBSITE_DEMO_TEMPLATE_BRIEF.md` defines the operator-facing brief.
- `CREATIVE_PRODUCTION_INTAKE.md` defines the optional Creative Production
  ideation contract and retained summary shape.
- `goal-1` drives a complete local website run.
- `spike-1` chooses audience, offer, structure, and creative direction.
- `task-1` implements the site using Astro plus React Islands.
- `test-1` validates build, rendering, claims, and safety.

# Data model

- Creative direction: audience, offer, page structure, motion/interaction
  concept, React Island candidates, asset needs, source-backed content facts,
  explicit non-goals, and validation risks.
- Website candidate: local source, screenshots, build result, and closeout
  recommendation.
- Closeout recommendation: discard, polish, or request parent Vercel preview
  approval.

# APIs / interfaces

- `mdkg goal next goal-1 --json`
- `mdkg pack spike-1 --profile concise --dry-run --stats`
- Optional Creative Production exploration for visual direction.
- Browser and Chrome checks when a local preview exists.

# Failure modes

- Generic output: require a recorded creative direction before implementation.
- Unsupported claims: validate public copy against source-backed mdkg behavior.
- Secret leakage: keep raw prompts, credentials, tokens, provider payloads, and
  private context out of files and checkpoints.
- Accidental deployment: preview remains approval-gated in the parent repo.

# Observability

Record mdkg command receipts, build results, screenshots, console health,
no-secret checks, and the closeout recommendation.

# Security / privacy

No secrets, raw prompts, provider payloads, credentials, private repo data,
cookies, Vercel bypass data, DNS credentials, or analytics keys belong in this
template.

# Testing strategy

Validate graph startup, pack coverage, local build, Browser/Chrome rendering,
no-secret posture, and public-claims safety.

# Rollout plan

Use locally first. Ask the parent repo for Vercel preview approval only after a
candidate passes validation and is recommended for preview.
