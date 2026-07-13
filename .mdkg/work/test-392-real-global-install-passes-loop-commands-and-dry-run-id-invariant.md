---
id: test-392
type: test
title: Real global install passes loop commands and dry run ID invariant
status: done
priority: 1
epic: epic-234
tags: [release, global-install, loop, dry-run]
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0]
relates: [goal-64, task-721]
blocked_by: [task-721]
blocks: []
refs: [task-721, chk-515]
context_refs: [goal-64, epic-234, edd-72, dec-69, task-702]
evidence_refs: [chk-515]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-13
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

Passed. The real command path remained `/opt/homebrew/bin/mdkg` while the
resolved package changed from `0.4.2` to registry `0.5.0`. A clean workspace
passed init, SQLite index, pre-node validation, raw loop creation, seven-template
listing, security fork dry-run/real, plan, next, and pack through the absolute
global binary. Dry-run previewed `loop-2`; the real fork immediately created
`loop-2` and the same child IDs. See `chk-515`.

# Notes / Follow-ups

- Website activation waits for this test.
- Post-fork generated-child heading advisories are recorded as non-blocking in
  `chk-515`; validation returned zero errors.
