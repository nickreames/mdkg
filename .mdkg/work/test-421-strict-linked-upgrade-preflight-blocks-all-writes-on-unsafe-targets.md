---
id: test-421
type: test
title: strict linked upgrade preflight blocks all writes on unsafe targets
status: todo
priority: 1
parent: goal-68
tags: [goal-68, test, preflight, no-mutation]
owners: []
links: []
artifacts: []
relates: [task-759]
blocked_by: [task-759]
blocks: []
refs: [goal-68, dec-79]
context_refs: [edd-73]
evidence_refs: []
aliases: [linked-upgrade-strict-preflight-test]
skills: []
cases: [safe-all, conflict, overlapping-dirty, unrelated-dirty, dry-run-purity]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove aggregate planning is observational and any unsafe selected target blocks
the complete apply before writes begin.

# Target / Scope

- Per-repo upgrade plans, Git dirty/path-overlap analysis, aggregate receipt.

# Preconditions / Environment

- Temporary repos with clean, customized, conflicting, and dirty variants.

# Test Cases

- All-safe plan is applyable.
- One conflict or overlapping dirty path makes aggregate unsafe.
- Unrelated dirtiness is allowed, preserved, and reported.
- Hashes prove dry-run changes no selected files, Git state, indexes, or bundles.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Best-effort apply is intentionally unsupported.
