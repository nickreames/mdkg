---
id: task-296
type: task
title: add unit and fixture coverage for SPEC validation indexing and misuse diagnostics
status: done
priority: 1
epic: epic-55
parent: goal-9
prev: task-295
next: task-297
tags: [test, spec, diagnostics, fixtures]
owners: []
links: []
artifacts: [tests]
relates: [goal-9, test-107, test-108, test-109, test-110]
blocked_by: [task-295]
blocks: [task-297]
refs: [dec-26]
aliases: [spec-validation-fixture-coverage]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add focused tests for the SPEC implementation pieces before broader smoke work.

# Acceptance Criteria

- Valid and invalid fixtures cover no-SPEC repos, all allowed `spec_kind` values, legacy compatibility, and misuse diagnostics.
- Capability indexing tests cover dogfood SPEC metadata.
- Error messages are actionable.

# Files Affected

- `tests`

# Implementation Notes

- Prefer focused fixtures over broad fixture rewrites.

# Test Plan

- `npm run test`
- `node dist/cli.js validate`

# Links / Artifacts

- `test-107`
- `test-108`
- `test-109`
- `test-110`
