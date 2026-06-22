---
tags: [mdkg-dev, claims, seo, metadata, measurement]
owners: []
links: [https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data, https://vercel.com/docs/analytics]
artifacts: [mdkg_planning_docs.zip]
relates: [prd-4, prd-5, edd-27]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: [mdkg-dev-claims-seo-contract]
created: 2026-06-22
updated: 2026-06-22
id: edd-29
type: edd
title: mdkg.dev public claims SEO metadata and launch measurement contract
---
# Overview

Public mdkg.dev copy must be source-backed, SEO-aware, and honest about alpha boundaries. The site should make mdkg understandable and discoverable without overstating shipped behavior.

# Architecture

- Public pages own human-facing copy and metadata.
- The claims evidence matrix maps claims to local source evidence and caveats.
- SEO and measurement plans are launch-readiness artifacts, not proof that indexing or analytics are live.

# Data model

- Claim rows include page, claim, evidence source, shipped status, and caveat or safe wording.
- Metadata records include title, description, canonical URL, social metadata, noindex policy, and structured-data status.
- Measurement records include intended event names and whether tracking is implemented or only planned.

# APIs / interfaces

- `mdkg-dev/CLAIMS.md` or `docs/claims-evidence-matrix.md` is the claims interface.
- Site route metadata is the SEO interface.
- Vercel Analytics, if later enabled, is the measurement interface.

# Claims Matrix Contract

Create `mdkg-dev/CLAIMS.md` or `docs/claims-evidence-matrix.md` before final homepage copy is accepted.

Minimum columns:

| Page | Claim | Evidence source | Shipped? | Caveat / Safe wording |
|---|---|---|---|---|

Required claim families:

- Git-native project memory.
- Markdown is source of truth.
- No daemon, hosted index, vector database requirement, or hidden cloud state.
- Deterministic context packs.
- Sanitized handoff prompts with raw-marker warnings.
- Skill source and mirror behavior.
- Read-only MCP.
- Local SQLite index/project DB and optional queue boundaries.
- Pre-v1 public alpha contract.

# SEO Contract

- Public pages must define title, description, canonical URL, Open Graph title, Open Graph description, Open Graph image, and X/Twitter card metadata.
- Use structured data only for visible page content.
- Use sitemap and robots outputs for public indexable routes.
- Noindex internal design pages, rough claims pages, preview deployments, debug artifacts, and unpromoted demo surfaces.

# Measurement Contract

- Vercel Web Analytics is acceptable if configured explicitly and documented as privacy-oriented analytics.
- Track public launch outcomes: homepage views, docs clicks, GitHub clicks, npm clicks, quickstart CTA clicks, and copied install command events if implemented.
- Do not add invasive analytics or third-party trackers that conflict with local-first trust posture.

# Failure Modes

- SEO copy implies hosted memory, autonomous execution, or comprehensive secret scanning.
- Claims are copied from roadmap nodes instead of shipped behavior.
- Metadata or structured data diverges from visible page content.
- Preview/demo URLs compete with canonical mdkg.dev pages.

# Observability

- SEO smoke should report route metadata coverage, sitemap entries, robots policy, and noindex coverage.
- Claims smoke should report claim counts, unsupported claims, and softened claims.

# Security / privacy

- Public pages must not expose raw secrets, raw prompts, provider payloads, private graph dumps, or local absolute paths.
- Analytics planning must preserve the local-first trust posture and avoid invasive tracking.

# Testing Strategy

- `smoke:mdkg-dev-seo` verifies required metadata, sitemap, robots, canonical/noindex policy, and selected structured data.
- Claims smoke verifies every homepage claim maps to the evidence matrix.
- Link smoke verifies GitHub, npm, docs, and internal routes.

# Rollout plan

- Seed claims matrix before final copy.
- Add metadata and sitemap after required routes exist.
- Keep analytics activation as a later explicit launch action.

# Links / references

- goal-25
- task-449
- task-452
- test-202
- test-205
- archive://archive.mdkg-dev-planning-docs-2026-06-22
