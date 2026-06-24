---
id: task-566
type: task
title: update marketing docs route to redirect to docs.mdkg.dev
status: done
priority: 1
epic: epic-191
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-565]
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

Update the marketing `/docs` route so it redirects to the canonical docs host.

# Acceptance Criteria

- `https://mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Local and hosted marketing builds preserve the redirect behavior.
- Marketing nav, CTA, footer, and docs links treat `docs.mdkg.dev` as canonical.
- No old GitBook or preview-docs bridge copy remains on the public route.

# Files Affected

- `mdkg-dev/`
- smoke/docs checks if redirect assertions need coverage.

# Implementation Notes

- Prefer an explicit static-site-safe redirect implementation that works on Vercel.
- Keep preview docs URLs only where clearly labeled as preview fallback evidence, not public production CTAs.

# Test Plan

- Local build route check.
- Hosted route check after push/redeploy.
- `test-284`

# Links / Artifacts

- `https://docs.mdkg.dev/`
