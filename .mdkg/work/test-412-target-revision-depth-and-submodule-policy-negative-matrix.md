---
id: test-412
type: test
title: target revision depth and submodule policy negative matrix
status: done
priority: 1
parent: goal-66
tags: [goal-66, test, revision, submodule]
owners: []
links: []
artifacts: []
relates: [task-748]
blocked_by: [task-748]
blocks: []
refs: [goal-66, dec-76, dec-78]
context_refs: [edd-73]
evidence_refs: []
aliases: [materialize-revision-policy-test]
skills: []
cases: [exact-commit, exact-tree, moved-ref, missing-ref, mismatch, shallow, submodule-deny, submodule-ignore]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Prove exact accepted revision enforcement and closed clone-depth/submodule
behavior against neutral local bare fixtures.

# Target / Scope

- Materialization engine and Git fixture matrix.

# Preconditions / Environment

- Local SHA-1 fixtures; SHA-256 fixture when system Git supports it.

# Test Cases

- Exact target/commit/tree success and every mismatch.
- Missing, moved, ambiguous, tag, and detached ref behavior.
- Full and positive shallow depth; expected object unavailable at depth.
- `.gitmodules` and gitlink detection for deny/ignore with no recursion.

# Results / Evidence

- Focused compiled tests pass exact commit/tree acceptance, missing and moved
  full refs, commit/tree mismatch, annotated tag peeling, partial-ref rejection,
  SHA-1 and supported SHA-256 repositories, full/positive depth, and proof that
  depth mode never fetches an expected object id directly.
- Submodule fixtures prove `deny` closes with bounded gitlink evidence and
  `ignore` accepts with the same count/hash while never initializing or
  recursively fetching the child repository.

# Notes / Follow-ups

- Recursive submodules remain out of scope.
