---
id: test-285
type: test
title: production indexability robots sitemap canonical and metadata contract
status: done
priority: 1
epic: epic-191
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-568]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate production indexability and preview noindex behavior for marketing and docs.

# Target / Scope

- Production marketing/docs hosts.
- Preview `*.vercel.app` hosts.

# Preconditions / Environment

- Production env/index settings are deployed.

# Test Cases

- Production `mdkg.dev` pages emit indexable robots behavior.
- Production `docs.mdkg.dev` pages are indexable.
- Production robots and sitemap reference production domains.
- Canonical, Open Graph, and Twitter metadata use production URLs.
- Preview `*.vercel.app` URLs remain noindex.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Production indexability is intentional immediately after validation.
