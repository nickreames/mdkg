---
id: edd-35
type: edd
title: mdkg.dev feedback validation Browser Product Design and preview proof architecture
tags: [mdkg-dev, browser, product-design, vercel, validation]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_dev_feedback]
relates: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
aliases: [mdkg-dev-feedback-validation-architecture]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Goal 30 needs stronger proof than local builds. It must combine deterministic smokes, Browser route validation, Product Design review, logical commits, push to `origin/main`, and Vercel preview verification.

# Local Validation

- Build `mdkg-dev/` and `docs/`.
- Run mdkg root checks and launch smokes.
- Verify no raw secrets, prompts, tokens, provider payloads, local absolute paths, or private graph dumps appear in public output.
- Verify preview noindex policy and production-domain copy boundaries.

# Browser Validation

Use Browser on local and hosted routes at desktop `1440x900` and mobile `390x844`.

Required coverage:

- product homepage
- quickstart
- trust
- docs bridge
- docs homepage
- install docs
- quickstart docs
- claims matrix
- roadmap
- one mobile path through navigation and CTAs

Record console errors, broken navigation, visible overflow, code-block readability, focus states, metadata presence, and raw-marker scan results.

# Product Design Validation

Use this brief:

> mdkg.dev is a restrained OSS developer-tool site using white/zinc surfaces, blue/sky/teal accents, clear CLI/product proof, and no generic AI hype.

Saved Product Design context is currently missing, so the source of truth is `mdkg-dev/DESIGN.md`, `edd-28`, `edd-29`, `edd-30`, the feedback bundle, and current previews. Product Design review should focus on visual hierarchy, first-screen clarity, mobile layout, product proof visuals, CTA clarity, and accessibility basics.

# Push And Vercel Proof

- Commit logically before push.
- Push only `main` to `origin/main`, without force.
- Verify existing Vercel projects `mdkg-dev` and `mdkg-docs` redeploy from `nickreames/mdkg`.
- Record deployment IDs, build status, preview URLs, route checks, and no-launch boundaries.

# Stop Conditions

Stop if the work would require DNS, production promotion, analytics activation, npm publish, git tag, custom-domain binding, or GitHub settings mutation.

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
