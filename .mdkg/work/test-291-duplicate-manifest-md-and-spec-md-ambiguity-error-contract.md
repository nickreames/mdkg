---
id: test-291
type: test
title: duplicate MANIFEST.md and SPEC.md ambiguity error contract
status: done
priority: 1
epic: epic-195
parent: goal-37
tags: [manifest, spec, duplicate, validation, error]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-576]
context_refs: []
evidence_refs: []
aliases: [manifest-spec-duplicate-error, manifest-ambiguity-contract]
skills: []
cases: [duplicate-same-directory, explicit-error-message, no-silent-precedence]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Prove mdkg fails closed when both canonical and legacy manifest files exist in
the same logical Omni unit.

# Target / Scope

- `task-576`

# Preconditions / Environment

Invalid duplicate fixture exists with sibling `MANIFEST.md` and `SPEC.md`.

# Test Cases

- Duplicate files in the same directory fail validation.
- The diagnostic says both paths are present and does not silently choose one.
- The error suggests removing or renaming the legacy `SPEC.md`.
- Index/search output is not trusted as successful for the invalid fixture.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Duplicate handling should be an error, not a warning.
