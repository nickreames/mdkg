---
id: test-282
type: test
title: Vercel domain attachment and DNS propagation contract
status: todo
priority: 1
epic: epic-190
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
cases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate Vercel custom-domain attachment and DNS propagation evidence.

# Target / Scope

- Vercel project `mdkg-dev`
- Vercel project `mdkg-docs`
- Production domains `mdkg.dev`, `www.mdkg.dev`, and `docs.mdkg.dev`

# Preconditions / Environment

- Vercel access is available through Chrome and Vercel tools.
- DNS has been delegated to Vercel nameservers or blockers are recorded.

# Test Cases

- `mdkg-dev` lists `mdkg.dev` and `www.mdkg.dev`.
- `mdkg-docs` lists `docs.mdkg.dev`.
- Vercel domain pages show no invalid-configuration blockers.
- Recursive and authoritative DNS records agree or remaining propagation variance is documented with TTLs.
- DNSSEC/DS state does not block Vercel-managed DNS.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Pause goal-36 if domain attachment or DNS cannot be made healthy.
