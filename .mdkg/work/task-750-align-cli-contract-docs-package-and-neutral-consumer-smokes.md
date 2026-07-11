---
id: task-750
type: task
title: align CLI contract docs package and neutral consumer smokes
status: todo
priority: 1
parent: goal-66
prev: task-749
next: task-751
tags: [goal-66, docs, package, contract, smoke]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-749]
blocks: [task-751]
refs: [goal-66, dec-75]
context_refs: [edd-73, goal-52]
evidence_refs: []
aliases: [materialize-cli-package-parity]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Make help, generated command contract, command matrix, docs, package payload,
publish readiness, and neutral installed-consumer behavior agree.

# Acceptance Criteria

- Help shows JSON request-only materialization and exact policy enums.
- Generated contract names write paths, locks, atomicity, dry-run behavior,
  receipts, and danger level truthfully.
- Existing clone snapshots remain compatible.
- Public source, docs, schemas, tests, and package contain no downstream
  product names or fixtures.
- Packed temp consumer proves success and closed negative cases.

# Files Affected

- Public CLI/docs/generated/package/smoke surfaces selected by implementation.

# Implementation Notes

Use neutral fixture names such as `acme` or `example`; downstream conformance
remains outside mdkg package gates.

# Test Plan

- `test-411` through `test-415`

# Links / Artifacts

- `goal-67`
