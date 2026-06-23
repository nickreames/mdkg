---
id: test-215
type: test
title: DNS cutover safety contract
status: done
priority: 1
epic: epic-132
parent: goal-27
tags: [mdkg-dev, dns]
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

Verify DNS cutover remains blocked until preview validation is accepted.

# Target / Scope

- `task-468`
- `dec-33`
- `dec-34`

# Preconditions / Environment

- Graph-only inspection; no DNS provider mutation is allowed.

# Test Cases

- Apex, `www`, and `docs` domains are named.
- DNS target values are not guessed and must come from Vercel UI during execution.
- Manual DNS changes require explicit approval.
- Rollback and propagation checks are included.
- Registrar credentials or DNS tokens are forbidden in mdkg.

# Results / Evidence

Record pass/fail in `task-471` or closeout checkpoint.

# Notes / Follow-ups

- DNS implementation remains a later explicit launch/cutover action.
