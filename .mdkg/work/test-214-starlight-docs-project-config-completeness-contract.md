---
id: test-214
type: test
title: Starlight docs project config completeness contract
status: done
priority: 1
epic: epic-133
parent: goal-27
tags: [mdkg-dev, starlight, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Verify the Starlight docs project plan is decision-complete.

# Target / Scope

- `task-466`
- `edd-32`
- `dec-35`

# Preconditions / Environment

- Graph-only inspection after Starlight replaces the earlier GitBook assumption.

# Test Cases

- Project name `mdkg-docs` is stated.
- Root `docs/` is stated.
- Astro/Starlight framework is stated.
- Build `npm run build` and output `dist` are stated.
- `docs.mdkg.dev` is future canonical docs.
- `mdkg.dev/docs` is a bridge or landing page.

# Results / Evidence

Record pass/fail in `task-471` or closeout checkpoint.

# Notes / Follow-ups

- A future implementation goal must migrate `docs/` to Starlight before docs preview deployment.
