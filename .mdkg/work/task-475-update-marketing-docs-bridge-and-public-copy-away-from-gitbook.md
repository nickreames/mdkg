---
id: task-475
type: task
title: update marketing docs bridge and public copy away from GitBook
status: done
priority: 1
epic: epic-139
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Update the marketing site `/docs` bridge so it points toward Starlight and `docs.mdkg.dev`, not GitBook.

# Acceptance Criteria

- `mdkg-dev/src/pages/docs.astro` describes `/docs` as a bridge and `docs.mdkg.dev` as the future canonical Starlight docs host.
- No GitBook renderer/sync target language remains in marketing copy.
- Sitemap and canonical URLs remain production-domain stable and do not include preview URLs.

# Files Affected

List files/directories expected to change.

- `mdkg-dev/src/pages/docs.astro`
- related marketing copy if needed

# Implementation Notes

- Keep marketing `/docs` as a landing page until DNS and docs domain are approved.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-seo`

# Links / Artifacts

- `dec-35`
- `edd-32`

# Completion Evidence

- Updated `mdkg-dev/src/pages/docs.astro` to describe `/docs` as a marketing bridge to Starlight and `docs.mdkg.dev`.
- Added visible links to `https://docs.mdkg.dev` and the repo docs source.
- Updated `scripts/smoke-mdkg-dev.js` to assert the rendered docs bridge includes Starlight copy, includes `docs.mdkg.dev`, and does not include `GitBook`.
- `npm --prefix mdkg-dev run build`: passed.
- `npm run smoke:mdkg-dev`: passed after the new bridge assertions.
- `npm run smoke:mdkg-dev-seo`: passed; sitemap and canonical metadata remain production-domain stable and do not include Vercel preview URLs.
