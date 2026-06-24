---
id: task-494
type: task
title: implement SEO social metadata sitemap robots noindex and link checks
status: done
priority: 1
tags: [mdkg-dev, seo, metadata, links]
owners: []
links: []
artifacts: []
relates: [test-232]
blocked_by: [task-493]
blocks: [task-495]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Implement launch-safe metadata and link validation for product and docs previews.

# Acceptance Criteria

- Public pages have page-specific title, description, canonical policy, Open Graph metadata, X card metadata, and a default social card.
- Product and docs sitemap/robots behavior is verified.
- Preview deployments are noindex unless intentionally promoted later.
- Future custom domains are described as future hosts until DNS exists.
- Link checks cover GitHub, npm, docs, quickstart, trust, alpha, `llms.txt`, and internal routes.

# Test Plan

- `npm run smoke:mdkg-dev-seo`
- Browser metadata/route checks.
- `test-232`

# Files Affected

- `mdkg-dev/src/layouts/BaseLayout.astro`
- `mdkg-dev/src/pages/robots.txt.ts`
- `scripts/smoke-mdkg-dev-seo.js`

# Implementation Notes

- Added preview noindex support driven by `VERCEL_ENV=preview` or `PUBLIC_MDKG_PREVIEW_NOINDEX=true`.
- Added `theme-color`, `og:site_name`, `og:image:alt`, and `twitter:image:alt` metadata to the shared site layout.
- Updated `robots.txt` generation so normal builds allow crawling and preview/noindex builds disallow crawling.
- Hardened `smoke:mdkg-dev-seo` with route-level canonical/social metadata checks, expected internal/external link coverage, preview noindex source checks, and normal robots assertions.

# Links / Artifacts

- `npm run smoke:mdkg-dev-seo` passed.
- `npm run smoke:mdkg-dev` passed after rerunning sequentially.
- Browser metadata check passed for `/`, `/quickstart/`, `/trust/`, `/alpha/`, and `/docs/`: canonical URLs point at `https://mdkg.dev`, robots is `index, follow`, social image metadata is present, and no console errors were observed.
- `PUBLIC_MDKG_PREVIEW_NOINDEX=true npm --prefix mdkg-dev run build` produced `noindex, nofollow` in `index.html` and `Disallow: /` in `robots.txt`.
- Normal `npm run smoke:mdkg-dev-seo` was rerun afterward to restore and verify normal public-build output.
- `git diff --check` passed.
