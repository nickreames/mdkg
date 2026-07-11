---
id: test-416
type: test
title: release version package and registry preflight contract
status: todo
priority: 1
parent: goal-67
tags: [goal-67, test, version, registry]
owners: []
links: []
artifacts: []
relates: [task-753, task-754, task-755]
blocked_by: [task-754]
blocks: []
refs: [goal-67]
context_refs: [goal-66]
evidence_refs: []
aliases: [materialize-release-preflight-test]
skills: []
cases: [version-classification, registry-absence, package-lock, changelog, approval]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Validate version classification, release metadata, registry absence, auth, and
approval before any external mutation.

# Target / Scope

- Package/lockfile/changelog, registry, auth, approval receipt.

# Preconditions / Environment

- `goal-66` achieved.

# Test Cases

- Version is execution-time selected and absent from npm.
- Metadata and lockfile agree; claims are source-backed.
- Approval is fresh, explicit, and excludes tags by default.

# Results / Evidence

- Pending release execution.

# Notes / Follow-ups

- Failure blocks publication.
