---
id: task-568
type: task
title: validate apex www redirect docs domain robots sitemap canonical metadata and noindex removal
status: todo
priority: 1
epic: epic-191
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-567]
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

Validate the production-domain route, redirect, robots, sitemap, canonical, metadata, and noindex behavior after deployment.

# Acceptance Criteria

- Apex serves the marketing app over valid HTTPS.
- `www` redirects to apex over valid HTTPS.
- Docs serves the Starlight app over valid HTTPS.
- `mdkg.dev/docs` redirects to docs.
- Production robots/sitemap/canonical/social metadata are correct.
- Preview noindex behavior remains intact.

# Files Affected

- mdkg checkpoints/evidence.
- Tests/smokes if coverage is added during implementation.

# Implementation Notes

- Validate both headers and visible page content.
- Use production domains, not only Vercel preview domains.

# Test Plan

- `curl -I` and content probes.
- Browser/Chrome route checks.
- `test-283`, `test-284`, and `test-285`

# Links / Artifacts

- `https://mdkg.dev/`
- `https://www.mdkg.dev/`
- `https://docs.mdkg.dev/`
