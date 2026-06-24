---
id: test-287
type: test
title: Vercel deployment log verification contract
status: todo
priority: 1
epic: epic-192
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-570]
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

Validate Vercel deployment, domain, and log evidence after production-domain changes.

# Target / Scope

- `mdkg-dev`
- `mdkg-docs`

# Preconditions / Environment

- Any implementation commits have been pushed to `origin/main`.
- Vercel has completed production deployments.

# Test Cases

- Latest production deployment for `mdkg-dev` is `READY`.
- Latest production deployment for `mdkg-docs` is `READY`.
- Build logs show no unresolved build or routing errors.
- Vercel domain status is healthy for all production custom domains.
- Deployment IDs and URLs are recorded in mdkg evidence.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Do not close if Vercel is still building or domain status is invalid.
