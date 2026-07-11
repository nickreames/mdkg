---
id: test-390
type: test
title: Release commit is on origin with green CI before npm publish
status: todo
priority: 1
epic: epic-233
tags: [release, origin, ci, npm]
owners: []
links: []
artifacts: []
relates: [goal-64, task-719]
blocked_by: [task-719]
blocks: []
refs: [task-719]
context_refs: [goal-64, epic-233, edd-72, dec-69]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove source provenance and CI precede the irreversible npm publication while
the website announcement remains dormant.

# Target / Scope

First push, origin SHA, CI checks, dormant flag, npm publish receipt.

# Preconditions / Environment

Approved release commit and valid npm auth with target version absent.

# Test Cases

- Compare local/origin/publish candidate SHAs.
- Require green supported-Node CI before publish.
- Confirm dormant activation in pushed commit.
- Confirm one successful 0.5.0 publish and no Git tag.

# Results / Evidence

Pending `task-719`.

# Notes / Follow-ups

- Origin/registry drift blocks publication.
