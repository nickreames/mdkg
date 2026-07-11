---
id: test-414
type: test
title: auth discovery redaction no push and public naming contract
status: todo
priority: 1
parent: goal-66
tags: [goal-66, test, auth, discovery, redaction, naming]
owners: []
links: []
artifacts: []
relates: [task-747, task-749, task-750]
blocked_by: [task-750]
blocks: []
refs: [goal-66, dec-77]
context_refs: [edd-73, dec-64]
evidence_refs: []
aliases: [materialize-auth-discovery-safety-test]
skills: []
cases: [auth-capabilities, credential-rejection, discovery-required, discovery-optional, discovery-forbidden, no-push, naming]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove secret-free auth evidence, all project-memory modes, bounded receipts,
absence of push, and product-neutral public surfaces.

# Target / Scope

- Auth preflight, discovery, receipt sanitizer, docs/package naming.

# Preconditions / Environment

- Controlled capability-present/absent fixtures and valid/invalid mdkg repos.

# Test Cases

- Each auth class reports only boolean/status/reason evidence.
- Credential-bearing URLs, refs, output, and environment values are rejected or
  redacted.
- Required/optional/forbidden discovery behavior is exact and non-mutating.
- Git invocation audit proves no push, hooks, scripts, skills, or recursion.
- Public naming scan rejects downstream product identifiers.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Downstream profile tests remain outside the package.
