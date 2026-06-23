---
id: task-459
type: task
title: validate Browser visible routes metadata LLM docs no-secret posture and demo graph discoverability
status: done
priority: 1
epic: epic-128
parent: goal-26
tags: [mdkg-dev, browser-e2e, seo, no-secret]
owners: []
links: []
artifacts: []
relates: [goal-26, test-209, test-210]
blocked_by: [task-458]
blocks: []
refs: []
context_refs: [edd-29, edd-30]
evidence_refs: [chk-197]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate Browser-visible routes, SEO/metadata surfaces, LLM docs, no-secret posture, and demo graph discoverability after the visual E2E run.

# Acceptance Criteria

- Required routes render visible headings and page-specific content.
- Canonical, Open Graph, Twitter, and JSON-LD metadata are present where expected.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` are reachable and content-appropriate.
- Sitemap contains no preview-only URLs.
- No raw secret, prompt, token, credential, or payload marker appears in Browser-visible pages or captured evidence.
- Demo graph discoverability is proven through local docs/site/examples and mdkg graph commands.
- A route/metadata/no-secret checkpoint is created.

# Files Affected

- `.mdkg/work/chk-*`
- Temporary Browser E2E receipt files under `/private/tmp`

# Implementation Notes

- Treat external hrefs as inert references; inspect but do not click.
- Keep checks local and deterministic.

# Test Plan

- Browser route assertions
- Metadata extraction from rendered pages
- Raw-marker scan over Browser-visible artifacts and selected screenshots
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`

# Links / Artifacts

- test-209
- test-210
- chk-197
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`

# Closeout Evidence

- Browser/local-HTTP receipt: `ok: true`, failure_count 0.
- `npm run smoke:mdkg-dev-seo`: pass.
- `npm run smoke:demo-graph`: pass.
- Raw-marker scan over public site/docs surfaces: no matches.
- Checkpoint: chk-197.
