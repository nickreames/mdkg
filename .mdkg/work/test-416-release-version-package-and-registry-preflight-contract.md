---
id: test-416
type: test
title: v0.5.2 package registry origin and approval preflight contract
status: todo
priority: 1
parent: goal-67
tags: [goal-67, test, version, registry, origin, approval, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-753, task-754, task-755]
blocked_by: [task-754]
blocks: [task-755]
refs: [goal-67, goal-66]
context_refs: [goal-66, goal-71]
evidence_refs: []
aliases: [materialize-release-preflight-test]
skills: []
cases: [fixed-version, registry-absence, package-lock, changelog, generated-docs, origin-freshness, recorded-approval]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Prove fixed `0.5.2` metadata, release documentation, registry absence, direct
main freshness, and the bounded pre-approval before any external mutation.

# Test Cases

- Goal-66 is achieved with an affirmative readiness checkpoint.
- Package, lockfile, README, command matrix, generated contracts/release notes,
  changelog, docs changelog, and shared release manifest all agree on `0.5.2`.
- Npm latest is exactly `0.5.1` and `mdkg@0.5.2` is absent.
- Local release commit/tree and `origin/main` freshness are recorded; no remote-
  only commit exists.
- Approval covers npm publish, temp/global install, safe real-root apply,
  non-force post-publish main pushes, and resulting deployment verification.
- Tags, force push, PRs, Browser/Chrome, unpublish, and rollback remain excluded.

# Results / Evidence

- Pending release execution. Any failure blocks `task-755`.
