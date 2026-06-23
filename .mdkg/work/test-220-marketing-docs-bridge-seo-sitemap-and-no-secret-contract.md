---
id: test-220
type: test
title: marketing docs bridge SEO sitemap and no-secret contract
status: todo
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
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that the marketing docs bridge points to Starlight/docs.mdkg.dev and keeps SEO/no-secret posture intact.

# Target / Scope

- `task-475`
- `mdkg-dev/src/pages/docs.astro`

# Preconditions / Environment

- Marketing bridge copy has been updated.
- Marketing site has been rebuilt.

# Test Cases

- `/docs` marketing page describes Starlight / `docs.mdkg.dev`, not GitBook.
- `npm --prefix mdkg-dev run build` passes.
- `npm run smoke:mdkg-dev` passes.
- `npm run smoke:mdkg-dev-seo` passes.
- Sitemap and canonical metadata do not include Vercel preview URLs.
- No high-risk raw secret markers are present.

# Results / Evidence

Pending future implementation.

# Notes / Follow-ups

- `/docs` remains a bridge until DNS and production docs hosting are separately approved.
