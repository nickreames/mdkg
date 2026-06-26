---
id: test-290
type: test
title: legacy SPEC.md compatibility and deprecation warning contract
status: done
priority: 1
epic: epic-195
parent: goal-37
tags: [manifest, spec, legacy, warning, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-574, task-576]
context_refs: []
evidence_refs: []
aliases: [legacy-spec-compatibility-warning, spec-md-deprecation-warning]
skills: []
cases: [spec-legacy-valid, spec-warning-text, spec-normalizes-to-manifest]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Prove legacy `SPEC.md` files remain valid during the one-compatibility-release
window and produce clear deprecation guidance toward `MANIFEST.md`.

# Target / Scope

- `task-574`
- `task-575`
- `task-576`

# Preconditions / Environment

Legacy SPEC fixtures exist and are intentionally retained.

# Test Cases

- Existing valid `SPEC.md` fixtures still validate.
- Validation emits a warning that identifies `SPEC.md` as legacy and recommends
  `MANIFEST.md`.
- Legacy records normalize to the manifest semantic kind internally while
  preserving the original source path.
- Search for `SPEC.md` and `legacy spec` remains useful.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- This test should be kept until the one-compatibility-release window is
  intentionally closed by a later goal.
