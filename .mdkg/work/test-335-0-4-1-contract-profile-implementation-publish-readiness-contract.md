---
id: test-335
type: test
title: 0.4.1 contract-profile implementation publish-readiness contract
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, publish-readiness, release]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-643, task-644, test-333, test-334]
blocks: [goal-50]
refs: [task-636, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Validate that implementation is ready to hand to the separate approval-gated
`mdkg@0.4.1` publish goal.

# Target / Scope

- `goal-49`
- implementation source, tests, docs, generated references, default/init
  assets, package metadata, changelog, and release notes
- blocker for `goal-50`

# Preconditions / Environment

- `task-644` has recorded final implementation evidence.
- `test-333` and `test-334` pass or list exact blockers.

# Test Cases

- Build, tests, CLI checks, command contract, docs checks,
  assert-publish-ready, mdkg validation, and selected smoke gates pass.
- `package.json`, lockfile, generated docs, public docs, and changelog align on
  `0.4.1`.
- Npm pack dry-run either passes or the exact remaining gap is recorded.
- No real npm publish, tag, push, deploy, DNS, provider mutation, or downstream
  repo mutation occurs in `goal-49`.
- `goal-50` remains blocked until this test is done.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None yet.
