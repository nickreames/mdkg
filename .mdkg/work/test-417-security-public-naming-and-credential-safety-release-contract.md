---
id: test-417
type: test
title: v0.5.2 security public naming credential and tarball release contract
status: todo
priority: 1
parent: goal-67
tags: [goal-67, test, security, naming, credentials, tarball, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-754, task-755]
blocked_by: [task-754]
blocks: [task-755]
refs: [goal-67, goal-66, dec-77]
context_refs: [goal-66, edd-73]
evidence_refs: []
aliases: [materialize-release-safety-test]
skills: []
cases: [security-receipt, release-delta-review, naming-scan, credential-scan, tarball-audit, no-push-regression]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Validate that the exact `0.5.2` release candidate preserves Goal-66 security
proof, remains generic and secret-free, and cannot push or execute repository-
controlled behavior.

# Test Cases

- Goal-66 Codex Security and `security:verify` receipts have zero unresolved
  findings and remain applicable to the candidate.
- Focused release-metadata delta review finds no new secret, credential,
  absolute local path, provider payload, or downstream product identifier.
- Published source, docs, schemas, generated files, tests, and tarball use only
  generic mdkg terminology.
- Tarball exposes no secret, local state, ignored cache, raw scan output, or
  product-specific fixture.
- Git invocation tests still prove no implicit push, hooks, shell, repository
  scripts, skills, or recursive submodules.

# Results / Evidence

- Pending release execution. Any finding blocks `task-755`.
