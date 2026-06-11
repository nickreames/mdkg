---
id: test-140
type: test
title: two branch merge conflict smoke contract
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [branches, merge, smoke, 0-3-7]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-344]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate the public, packed CLI behavior for a two-branch duplicate-id conflict.

# Target / Scope

- `task-344`
- `edd-21`

# Preconditions / Environment

- Packed mdkg install into a temp prefix.
- Fresh temp Git repo with two local branches.

# Test Cases

- Create one task on branch A and one task with the same numeric id on branch B.
- Merge into a duplicate-id state without relying on network remotes.
- Run `validate --json` and confirm duplicate diagnostics.
- Run `fix plan --family ids --json` and confirm stable read-only plan output.
- Assert no repo file hash changes during planning.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- This smoke becomes the `0.3.7` prepublish gate.
