---
id: task-512
type: task
title: implement SEO metadata noindex sitemap robots and external link polish
status: backlog
priority: 1
tags: [mdkg-dev, seo]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: [task-511]
blocks: [task-513, test-243]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Implement preview-safe metadata and link behavior.

# Acceptance Criteria

- Preview URLs are noindexed.
- Future production is not accidentally noindexed.
- Titles, descriptions, canonical, OG/Twitter metadata, sitemap, robots, footer links, and external link semantics are checked.
- Lightweight Vercel analytics/CTA tracking is planned but not activated.

# Files Affected

- `mdkg-dev/`
- `docs/`

# Test Plan

- `npm run smoke:mdkg-dev-seo`
- metadata/link smoke.

# Implementation Notes

# Links / Artifacts
