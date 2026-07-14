---
id: test-425
type: test
title: Symlink-safe path capability rejects linked ancestors at every sink
status: done
priority: 0
epic: epic-241
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove the shared safe-path capability and every migrated sink reject repository-
controlled link/traversal state before reading, writing, replacing, or deleting
outside the declared root.

# Target / Scope

`task-763` through `task-765`; all 26 containment finding IDs.

# Preconditions / Environment

Fresh temporary repositories with adjacent sentinel trees; supported link creation
on the current platform; no real repository mutation.

# Test Cases

- Absolute, POSIX/Windows parent traversal, NUL, empty, and mixed separators.
- Linked root, intermediate ancestor, final component, source, and destination.
- Existing and missing targets for read, exclusive create, atomic replace, and
  recursive delete.
- Planning/apply state changes and rename/delete race windows.
- Valid contained paths and explicit external-output capability remain functional.

# Results / Evidence

- Passed `tests/core/filesystem_authority.test.ts`, including traversal, linked
  root/ancestor/final target, nested-tree link, replace race, delete race, and
  explicit external-output cases.
- Passed the command-level containment fixtures in workspace, mirror, SQLite,
  project DB, snapshot, and `tests/commands/security_containment.test.ts`.
- Every one of the 26 task-763 through task-765 finding IDs has a direct
  command/API assertion; external sentinels remained unchanged.
- Full verification passed: 613 package tests, 8 public-release tests, command
  parity, and all affected smoke surfaces. See `chk-498`, `chk-499`, and
  `chk-500`.

# Notes / Follow-ups

- Closed. No migrated finding is represented only by helper-unit coverage.
