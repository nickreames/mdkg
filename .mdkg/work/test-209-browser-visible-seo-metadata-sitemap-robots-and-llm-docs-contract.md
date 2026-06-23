---
id: test-209
type: test
title: Browser-visible SEO metadata sitemap robots and LLM docs contract
status: done
priority: 1
epic: epic-128
parent: goal-26
tags: [mdkg-dev, seo, llm-docs]
owners: []
links: []
artifacts: []
relates: [goal-26, task-459]
blocked_by: [task-458]
blocks: []
refs: []
context_refs: [edd-29]
evidence_refs: [chk-197]
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate Browser-visible SEO metadata, sitemap/robots, and LLM docs surfaces for mdkg.dev local preview.

# Target / Scope

- canonical metadata
- Open Graph/Twitter metadata
- JSON-LD
- sitemap and robots
- `llms.txt` and `llms-full.txt`

# Preconditions / Environment

- Local mdkg-dev preview is running.
- Do not use external crawlers or hosted validation services.

# Test Cases

- Required pages expose expected canonical metadata.
- Open Graph and Twitter metadata exist where expected.
- JSON-LD parses as JSON on public-alpha pages where provided.
- `/robots.txt` and `/sitemap.xml` are reachable.
- Sitemap does not include preview-only URLs.
- `/llms.txt` and `/llms-full.txt` are reachable and align with alpha boundaries.

# Results / Evidence

- Passed. See chk-197 and `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`. HTML routes expose expected h1/title/canonical/social metadata, homepage JSON-LD parses, and text/XML assets return 200 with non-empty content and no preview sitemap URLs.

# Notes / Follow-ups

- Full external SEO audit remains deferred until public hosting exists.
