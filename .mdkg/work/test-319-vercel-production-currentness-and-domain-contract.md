---
id: test-319
type: test
title: Vercel production currentness and domain contract
status: done
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, vercel, production, domains, currentness, test]
owners: []
links: []
artifacts: [https://mdkg.dev/, https://www.mdkg.dev/, https://docs.mdkg.dev/project/changelog/, https://vercel.com/nicholas-reames-projects/mdkg-dev/2FeaoHwN9daYMreGoD97oufN7i7d, https://vercel.com/nicholas-reames-projects/mdkg-docs/HoDTghjzwAkK66QLjGKjAkLEracQ]
relates: []
blocked_by: [task-616]
blocks: [task-617, task-605, task-606, test-312]
refs: [task-616, task-605, task-606, test-312]
context_refs: []
evidence_refs: [chk-319]
aliases: []
skills: []
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate that Vercel production deployments and custom domains are current
before live Chrome launch proof can close.

# Target / Scope

`task-616`, Vercel projects, production deployments, custom domains, build logs,
and deployed commit/source currentness.

# Preconditions / Environment

`task-616` has run after npm postpublish validation and any required push/deploy
approval.

# Test Cases

- `mdkg-dev` and `mdkg-docs` project inspection returns the expected project and
  team IDs or records an explicit project-drift blocker.
- Production deployments are `READY`, target `production`, and match the
  approved source commit.
- `mdkg.dev`, `www.mdkg.dev`, and `docs.mdkg.dev` serve current production
  HTML with expected version/release markers.
- Vercel build logs do not contain release-blocking errors.
- Any `live: false` or domain/currentness ambiguity is resolved or recorded as
  a blocker before Chrome live validation.

# Results / Evidence

Passed. See `chk-319`.

# Notes / Follow-ups

- Passing this test enables `task-617`; it is not a substitute for browser
  validation.
