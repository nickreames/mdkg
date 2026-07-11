---
id: test-417
type: test
title: security public naming and credential safety release contract
status: todo
priority: 1
parent: goal-67
tags: [goal-67, test, security, naming, credentials]
owners: []
links: []
artifacts: []
relates: [task-754, task-755]
blocked_by: [task-754]
blocks: []
refs: [goal-67, dec-77]
context_refs: [goal-66, edd-73]
evidence_refs: []
aliases: [materialize-release-safety-test]
skills: []
cases: [security-scan, naming-scan, credential-scan, tarball-audit, no-push-regression]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Validate that public release surfaces remain generic and secret-free and that
materialization cannot push or execute repository-controlled behavior.

# Target / Scope

- Source, docs, schemas, tests, generated files, tarball, security report.

# Preconditions / Environment

- Final release candidate prepared locally.

# Test Cases

- Security scan and auth/credential redaction matrix pass.
- Public naming scan contains no downstream identifiers.
- Tarball exposes no secret, local path, or product fixture.
- Git invocation audit proves no implicit push/hooks/scripts/recursion.

# Results / Evidence

- Pending release execution.

# Notes / Follow-ups

- Any finding blocks approval.
