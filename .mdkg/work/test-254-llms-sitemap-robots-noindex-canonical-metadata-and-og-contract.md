---
id: test-254
type: test
title: llms sitemap robots noindex canonical metadata and OG contract
status: backlog
priority: 1
epic: epic-169
parent: goal-33
tags: [seo, metadata, llms, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33, task-526]
blocked_by: [task-526]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [llms-text-format, preview-noindex, production-canonical, sitemap-robots, og-social-metadata]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify crawler, AI-reader, sharing, and external-link behavior.

# Test Cases

- `llms.txt` preserves line breaks in browser and curl.
- Preview deployments emit explicit noindex.
- Production canonicals and sitemap URLs use production domains when configured.
- Robots/sitemap policy does not expose internal/noindex routes.
- Metadata and OG behavior are validated or tracked with a follow-up.
