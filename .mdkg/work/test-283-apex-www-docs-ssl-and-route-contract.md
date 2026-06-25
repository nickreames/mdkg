---
id: test-283
type: test
title: apex www docs SSL and route contract
status: done
priority: 1
epic: epic-190
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

Validate HTTPS, SSL, redirect, and route behavior for all production custom domains.

# Target / Scope

- `https://mdkg.dev/`
- `https://www.mdkg.dev/`
- `https://docs.mdkg.dev/`

# Preconditions / Environment

- Vercel domains are attached.
- DNS propagation is sufficient for route checks.

# Test Cases

- `https://mdkg.dev/` returns the marketing app with valid SSL.
- `https://www.mdkg.dev/` redirects to `https://mdkg.dev/` with valid SSL.
- `https://docs.mdkg.dev/` returns the Starlight docs app with valid SSL.
- No route requires `curl -k` or browser certificate bypass.
- Route bodies contain expected mdkg marketing/docs content, not placeholders.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Current planning evidence saw apex placeholder and www certificate mismatch; both must be resolved before this test passes.
