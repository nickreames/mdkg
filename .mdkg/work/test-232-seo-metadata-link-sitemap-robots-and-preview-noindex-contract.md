---
id: test-232
type: test
title: SEO metadata link sitemap robots and preview noindex contract
status: done
priority: 1
tags: [mdkg-dev, seo, links, preview]
owners: []
links: []
artifacts: []
relates: [task-494]
blocked_by: [task-494]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Contract

SEO metadata, internal/external links, sitemap, robots, canonical policy, and preview noindex behavior are validated without claiming custom domains are live.

# Verification

- `npm run smoke:mdkg-dev-seo`
- Browser route metadata checks.

# Evidence

- Covered by `task-494`, `chk-210`, and `scripts/smoke-mdkg-dev-seo.js`.
- `npm run smoke:mdkg-dev-seo` passed.
- Browser and hosted checks validated canonical URLs, route metadata, sitemap/robots behavior, expected public links, and preview-noindex source policy without claiming custom domains are live.
