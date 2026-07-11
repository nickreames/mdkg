---
id: test-391
type: test
title: Published registry tarball fresh install and v0.4.2 upgrade pass
status: todo
priority: 1
epic: epic-234
tags: [release, registry, tarball, upgrade]
owners: []
links: []
artifacts: []
relates: [goal-64, task-720]
blocked_by: [task-720]
blocks: []
refs: [task-720]
context_refs: [goal-64, epic-234, edd-72, dec-69]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Use registry-fetched bytes to prove package integrity, clean install behavior,
and compatibility upgrading from the current 0.4.2 release.

# Target / Scope

Registry/latest/integrity, tarball payload, init/validate, upgrade, loop payload.

# Preconditions / Environment

Clean temporary global prefix/workspace and preserved 0.4.2 fixture.

# Test Cases

- Verify registry version, dist-tag, integrity, and expected files.
- Fresh install init/validate/list/fork/plan/next/pack.
- Upgrade dry-run/apply/idempotence preserving legacy and loop data.
- Execute installed absolute path, not checkout binary.

# Results / Evidence

Pending published `mdkg@0.5.0`.

# Notes / Follow-ups

- Consumer failure triggers fix-forward, not unpublish.
