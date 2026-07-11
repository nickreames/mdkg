---
id: task-754
type: task
title: run prepublish security public naming and registry dry run gates
status: todo
priority: 1
parent: goal-67
prev: task-753
next: task-755
tags: [goal-67, prepublish, security, naming]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [task-753]
blocks: [task-755]
refs: [goal-67]
context_refs: [goal-66, edd-73]
evidence_refs: []
aliases: [materialize-release-gates]
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Run all local package, graph, docs, generated-contract, security, credential,
public naming, tarball, and registry dry-run gates before requesting approval.

# Acceptance Criteria

- Full prepublish and source validation ladders pass.
- Security review and credential/public naming scans pass.
- Registry confirms the selected version is absent.
- Tarball contents and integrity are recorded from dry-run/pack evidence.
- No push, publish, global replacement, or external deployment occurs.

# Files Affected

- Evidence/checkpoint updates only after release metadata is finalized.

# Implementation Notes

Stop instead of waiving any failed gate.

# Test Plan

- `test-416`
- `test-417`

# Links / Artifacts

- Prepublish and security receipts
