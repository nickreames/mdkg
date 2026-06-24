---
id: task-494
type: task
title: implement SEO social metadata sitemap robots noindex and link checks
status: todo
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

# Implementation Notes

# Links / Artifacts
