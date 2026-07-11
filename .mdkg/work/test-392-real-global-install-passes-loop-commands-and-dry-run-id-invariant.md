---
id: test-392
type: test
title: Real global install passes loop commands and dry run ID invariant
status: todo
priority: 1
epic: epic-234
tags: [release, global-install, loop, dry-run]
owners: []
links: []
artifacts: []
relates: [goal-64, task-721]
blocked_by: [task-721]
blocks: []
refs: [task-721]
context_refs: [goal-64, epic-234, edd-72, dec-69, task-702]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove the user's normal `/opt/homebrew` global mdkg install is v0.5.0 and no
longer reproduces the SQLite dry-run ID bug.

# Target / Scope

Global path/version, init/validate/new/list/fork/plan/next/pack, SQLite IDs.

# Preconditions / Environment

Approved environment mutation, registry-proven package, clean temporary workspace.

# Test Cases

- Capture before/after global version, command path, and realpath.
- Exercise all required loop commands through the global binary.
- Verify dry-run preview and immediate real-fork ID match.
- Record rollback behavior if installation fails.

# Results / Evidence

Pending `task-721`.

# Notes / Follow-ups

- Website activation waits for this test.
