---
id: task-490
type: task
title: fix P0 product-site copy quickstart docs bridge CTAs alpha trust and llms
status: todo
priority: 1
tags: [mdkg-dev, product-site, p0, copy, first-run]
owners: []
links: []
artifacts: []
relates: [test-228]
blocked_by: [task-489]
blocks: [task-491]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Implement the P0 product-site fixes from `US-001` through `US-014`.

# Acceptance Criteria

- Quickstart commands render as separate, copyable lines and match README/docs/`llms.txt`.
- `llms.txt` uses durable placeholders like `WORK_ID`.
- Internal planning language and personal-origin emphasis are removed from first-pass public homepage copy.
- `scope_refs`, `context_refs`, and `evidence_refs` are explained without misleading “Evidence:” labels.
- Docs bridge clearly distinguishes preview docs from future `docs.mdkg.dev`.
- GitHub star/feedback CTAs are visible.
- Trust, alpha, claims, SEO, sitemap/robots, accessibility/performance, and design-system P0 expectations are represented or queued in following scoped tasks.

# Test Plan

- Product-site build.
- Browser inspection of homepage, quickstart, trust, alpha, docs bridge, and `llms.txt`.
- `test-228`.

# Files Affected

# Implementation Notes

# Links / Artifacts
