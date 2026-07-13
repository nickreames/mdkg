---
id: test-390
type: test
title: Release commit is on origin with green CI before npm publish
status: done
priority: 1
epic: epic-233
tags: [release, origin, ci, npm]
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0, artifact://github-actions/run/29254216004]
relates: [goal-64, task-719]
blocked_by: [task-719]
blocks: []
refs: [task-719, chk-513]
context_refs: [goal-64, epic-233, edd-72, dec-69]
evidence_refs: [chk-513]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-13
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

Passed. Local `HEAD`, `origin/main`, both GitHub Actions package gates, and the
publish candidate all used
`7afbf6d8df58279f70c6257b65437791fec59e63`. The shared release manifest was
still `draft` during the first push and publication. Npm owner/auth, target
absence, and advisories were rechecked immediately before the successful
single publication. Npm `latest` now resolves to `0.5.0`; registry SHA-1 and
integrity are recorded in `chk-513`. No Git tag exists.

# Notes / Follow-ups

- Origin/registry drift blocks publication.
