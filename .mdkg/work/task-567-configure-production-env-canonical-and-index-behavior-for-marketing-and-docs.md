---
id: task-567
type: task
title: configure production env canonical and index behavior for marketing and docs
status: done
priority: 1
epic: epic-191
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-566]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Configure production canonical and indexability behavior for both marketing and docs while keeping preview hosts noindex.

# Acceptance Criteria

- Production `mdkg.dev` and `docs.mdkg.dev` are indexable.
- Preview `*.vercel.app` deployments remain noindex.
- Marketing canonicals use `https://mdkg.dev`.
- Docs canonicals use `https://docs.mdkg.dev`.
- Vercel environment variables or code paths are documented in evidence.

# Files Affected

- `mdkg-dev/`
- `docs/`
- Vercel project environment settings if needed.

# Implementation Notes

- Current code uses `PUBLIC_MDKG_PRODUCTION_INDEX` and Vercel env detection; verify production settings explicitly.
- Do not make preview deployments indexable.

# Test Plan

- Production robots/canonical/sitemap checks.
- Preview robots/noindex checks.
- `test-285`

# Links / Artifacts

- `mdkg-dev/src/layouts/BaseLayout.astro`
- `docs/astro.config.mjs`
