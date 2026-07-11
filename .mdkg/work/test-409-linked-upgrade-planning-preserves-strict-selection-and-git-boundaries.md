---
id: test-409
type: test
title: linked upgrade planning preserves strict selection and Git boundaries
status: done
priority: 1
parent: goal-65
tags: [goal-65, test, upgrade, multi-repo]
owners: []
links: []
artifacts: []
relates: [task-744, task-745, goal-68]
blocked_by: []
blocks: []
refs: [goal-65, goal-68, dec-79]
context_refs: [goal-60, edd-73]
evidence_refs: [chk-480]
aliases: [linked-upgrade-planning-boundary-test]
skills: []
cases: [selection, include-exclude, strict-preflight, dirty-overlap, partial-receipt, no-git-side-effects]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Validates that linked upgrade remains explicit, strict, and separate from Git
and subgraph projection mutations.

# Target / Scope

- `dec-79`
- `goal-68`

# Preconditions / Environment

Current single-repo upgrade and read-only subgraph upgrade-plan behavior were
audited.

# Test Cases

- Root-first linked selection uses enabled contained `source_path` entries.
- Includes are explicit; excludes win; `.gitmodules` grants no scope.
- Unsafe overlap blocks all writes; unrelated dirtiness is preserved.
- No install, stage, commit, push, registration, sync, or gitlink behavior.

# Results / Evidence

PASS. The future goal and decision encode the complete strict contract.

# Notes / Follow-ups

- `goal-68` is intentionally non-blocking.
