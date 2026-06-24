---
id: edd-41
type: edd
title: preview noindex llms metadata sitemap and external-link contract
tags: [mdkg-dev, seo, noindex, llms, metadata, pass-3]
owners: []
links: []
artifacts: []
relates: []
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
aliases: [preview-seo-contract]
created: 2026-06-24
updated: 2026-06-24
---
# Preview Policy

Vercel preview deployments must emit explicit noindex directives. Production deployments should use production canonical URLs and should not inherit preview noindex behavior.

# llms Contract

- `llms.txt` serves as `text/plain`.
- Headings, bullets, links, and line breaks are preserved in browser and curl output.
- Content explains mdkg in concise agent-readable language without hidden prompts or manipulative instructions.
- Preview URLs are not hardcoded into production `llms.txt`.

# SEO And Metadata Contract

- Production sitemap includes intended public pages and excludes internal/noindex pages.
- Production robots allows intended public pages.
- Preview noindex is not implemented only through robots blocking.
- Homepage, quickstart, trust, and alpha pages have title, description, canonical, Open Graph, and X/Twitter card metadata.
- OG image policy is explicit; if no final image exists, record follow-up rather than ship stale placeholder claims.

# Link Contract

- External GitHub, npm, docs, and cross-site links open in a new tab when appropriate.
- External target links include `rel="noopener noreferrer"`.
- Internal links remain same-tab unless explicitly documented.

# Overview

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
