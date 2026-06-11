---
id: test-138
type: test
title: branch duplicate id detection and rewrite plan contract
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [branches, ids, fix, 0-3-6]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-341]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate duplicate-id detection and deterministic repair planning for branch
merge conflict states.

# Target / Scope

- `task-341`
- `edd-21`

# Preconditions / Environment

- Fresh temp Git repo.
- Two branches that independently create the same numeric id.

# Test Cases

- `validate --json` reports duplicate id diagnostics with stable paths.
- `fix plan --family ids --json` returns the same plan hash on repeated runs.
- Candidate ids do not collide with existing ids.
- File hashes are unchanged before/after planning.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- This contract gates any future repair apply design.
