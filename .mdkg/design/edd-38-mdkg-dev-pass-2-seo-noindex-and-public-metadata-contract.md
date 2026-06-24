---
id: edd-38
type: edd
title: mdkg.dev pass 2 SEO noindex and public metadata contract
tags: [mdkg-dev, seo, metadata, noindex]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_preview_polish_pass2]
relates: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
aliases: [mdkg-dev-pass-2-seo-contract]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Pass 2 separates preview validation from public launch. Preview deployments should be reviewable and noindexed; future production should be indexable after explicit DNS/launch approval.

# Architecture

- Preview URLs: noindex.
- Future production domains: indexable after launch approval.
- Sitemap and robots must not leak preview-only URLs as canonical production destinations.
- Page metadata should match the public framing and avoid implementation/scaffold labels.

# Data Model

Metadata should consistently use:

- Product name: `mdkg`.
- Primary framing: "Git-native project memory for AI coding agents."
- Operating model: "Plan -> Work -> Evidence."
- Conservative alpha caveats where relevant.

# APIs / Interfaces

- Marketing and docs builds must expose route-specific titles/descriptions.
- `llms.txt` and `llms-full.txt` are manually rewritten once in Goal 32.
- README and npm/package metadata copy must align with public site/docs language, without requiring npm publish.

# Failure Modes

- Preview routes get indexed before launch.
- Production metadata remains noindexed after DNS cutover in a future goal.
- Public claims imply hosted services or broader maturity than mdkg currently provides.

# Testing Strategy

- Metadata smoke.
- Sitemap/robots checks.
- Link and canonical checks.
- No-secret/raw-marker scan over built public output.

# Links / References

- `goal-32`
- `task-512`
- `test-243`
- `prd-7`

# Observability

# Security / privacy

# Rollout plan
