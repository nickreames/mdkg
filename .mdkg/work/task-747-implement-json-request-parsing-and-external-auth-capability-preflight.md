---
id: task-747
type: task
title: implement JSON request parsing and external auth capability preflight
status: todo
priority: 1
parent: goal-66
prev: task-746
next: task-748
tags: [goal-66, json, auth, redaction]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-746]
blocks: [task-748]
refs: [goal-66, dec-75, dec-77]
context_refs: [edd-73, dec-64]
evidence_refs: []
aliases: [materialize-json-auth]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Implement `--request <file|->` JSON loading, schema validation, source/ref
normalization, and secret-free declared auth capability checks.

# Acceptance Criteria

- File and stdin inputs produce identical canonical request hashes.
- Auth classes cover unauthenticated, `gh`, SSH-agent, credential-helper, and
  environment-mediated access through availability evidence only.
- Raw values, helper output, environment values, and socket paths never enter
  receipts or errors.
- Embedded URL credentials and credential-shaped refs fail before Git runs.

# Files Affected

- Git command/schema/parser and focused tests.

# Implementation Notes

System Git remains the only transport executor. `access_ref` is correlation
evidence, not a resolver.

# Test Plan

- `test-411`
- `test-414`

# Links / Artifacts

- `dec-77`
