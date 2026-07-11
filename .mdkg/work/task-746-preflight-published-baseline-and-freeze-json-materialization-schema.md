---
id: task-746
type: task
title: preflight published baseline and freeze JSON materialization schema
status: todo
priority: 1
parent: goal-66
next: task-747
tags: [goal-66, preflight, schema, json]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: []
blocks: [task-747]
refs: [goal-66, edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-52, goal-64, edd-73]
evidence_refs: []
aliases: [materialize-schema-preflight]
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Confirm the current publication program is achieved, re-audit the installed
and source Git command contract, and freeze the strict v1 JSON request/receipt
schemas before source implementation.

# Acceptance Criteria

- `goal-64` is achieved and npm/source/package baselines are recorded.
- Every field and enum in `edd-73` has one strict schema representation.
- Unknown fields, YAML, embedded credentials, absolute destinations, and
  unsupported policies fail with bounded reason codes.
- Receipt version, success/failure shape, exit behavior, and redaction rules
  are frozen without product-specific identifiers.

# Files Affected

- Generic schema, Git command, tests, docs, and generated-contract surfaces
  selected after source re-audit.

# Implementation Notes

Do not hardcode a release version. Detect Git object format through system Git.

# Test Plan

- `test-411`
- `test-415`

# Links / Artifacts

- `edd-73`
