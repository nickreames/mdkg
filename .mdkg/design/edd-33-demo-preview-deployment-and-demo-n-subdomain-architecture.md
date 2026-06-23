---
id: edd-33
type: edd
title: demo preview deployment and demo N subdomain architecture
tags: [mdkg-dev, demo, subdomain]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Demo deployments should let mdkg.dev show agentic coding workflows without risking canonical site SEO or production trust.

# Architecture

- Throwaway demos use Vercel preview URLs.
- Curated demos may later be promoted to durable `demo-N.mdkg.dev` subdomains.
- Demo source starts from `examples/demo-agentic-coding` or `examples/template-mdkg-dev`.
- Canonical mdkg.dev links to only accepted demos.

# Data model

- Demo candidate: source graph, preview URL, validation receipt, accepted/rejected/promotion state.
- Durable demo: subdomain, canonical/noindex policy, teardown notes, evidence refs.

# APIs / interfaces

- Vercel preview deployments for live critique.
- Manual domain/subdomain promotion after evidence review.
- mdkg subgraphs provide demo planning context.

# Failure modes

- Demo content makes claims not true of mdkg; require claims review before promotion.
- Demo remains live unintentionally; require teardown/promotion status.
- Demo competes with canonical SEO; use noindex/canonical policy unless accepted.

# Observability

- Preview validation receipt.
- Browser screenshots.
- Link and metadata checks.
- Accepted/rejected promotion checkpoint.

# Security / privacy

- Demo graphs must not include secrets, raw prompts, tokens, or private repo payloads.
- Preview URLs should be treated as public unless protected by Vercel access.

# Testing strategy

- Validate demo graph import/pack/goal-next behavior before deployment.
- Validate preview routes and no-secret posture before sharing.

# Rollout plan

1. Use previews for live demos.
2. Decide whether to discard or promote.
3. Only accepted demos receive durable subdomains.
4. Keep canonical mdkg.dev stable during demo iteration.
