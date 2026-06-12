---
id: test-146
type: test
title: fresh init index guidance temp repo contract
status: done
priority: 1
epic: epic-74
tags: [init, index, doctor, temp-repo]
owners: []
links: []
artifacts: []
relates: [goal-14]
blocked_by: [task-353]
blocks: []
refs: []
aliases: []
skills: []
cases: [fresh init docs mention mdkg index, fix plan reports missing indexes before index, doctor strict passes after index]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that fresh-init guidance matches actual strict doctor behavior around
generated caches.

# Target / Scope

- `task-353`
- README/init docs and command matrix guidance

# Preconditions / Environment

- Fresh temp repo initialized with the current CLI.

# Test Cases

- `mdkg init --agent` creates source assets but not generated caches.
- `mdkg fix plan --json` before indexing reports missing generated cache repair
  hints.
- Docs instruct users to run `mdkg index` after init.
- `mdkg index` creates generated caches.
- `mdkg doctor --strict --json` passes after indexing.

# Results / Evidence

- Passed. Seeded docs contain `mdkg index` and strict doctor guidance.
- Fresh temp repo fix plan reported four generated cache repair hints before
  indexing.
- `mdkg index` created generated caches.
- `mdkg doctor --strict --json` passed after indexing.

# Notes / Follow-ups

- Optional auto-index or `mdkg init --index` can be considered later; it is not
  part of this task.
