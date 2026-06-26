---
id: test-289
type: test
title: canonical MANIFEST.md recognition and validation contract
status: todo
priority: 1
epic: epic-195
parent: goal-37
tags: [manifest, validation, file-kind]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-575, task-576]
context_refs: []
evidence_refs: []
aliases: [manifest-recognition-validation-contract]
skills: []
cases: [manifest-basename, type-manifest, manifest-required-fields]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Prove `MANIFEST.md` is recognized as the canonical semantic file and validates
against the existing reusable capability/runtime contract.

# Target / Scope

- `task-575`
- `task-576`

# Preconditions / Environment

Build artifacts are current and canonical manifest fixtures exist.

# Test Cases

- A valid `MANIFEST.md` with `type: manifest` indexes as a manifest/capability
  record.
- Required role/runtime/capability/work-contract/update-policy fields retain
  the same substantive validation as prior valid `SPEC.md`.
- Error messages use `MANIFEST.md` as the primary canonical name.
- Search for `MANIFEST.md` returns canonical fixture records.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Keep legacy `SPEC.md` fixture coverage in `test-290`.
