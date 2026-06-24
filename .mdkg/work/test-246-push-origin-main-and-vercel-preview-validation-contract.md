---
id: test-246
type: test
title: push origin main and Vercel preview validation contract
status: backlog
priority: 1
tags: [mdkg-dev, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: []
blocked_by: [task-517]
blocks: [task-518]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [push-main, vercel-ready, hosted-browser-checks]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Validate that pushed changes redeploy on Vercel previews.

# Test Cases

- `main` is pushed to `origin/main` without force.
- Vercel projects `mdkg-dev` and `mdkg-docs` deploy the pushed commit.
- Hosted preview routes pass Browser/Chrome checks.

# Results / Evidence

- Pending.
