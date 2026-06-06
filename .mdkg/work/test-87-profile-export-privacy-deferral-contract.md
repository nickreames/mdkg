---
id: test-87
type: test
title: profile export privacy deferral contract
status: done
priority: 1
epic: epic-34
parent: goal-5
tags: [project-db, profiles, privacy, export]
owners: []
links: []
artifacts: []
relates: [goal-5, epic-34, task-232, task-233, task-234]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Validate that profile/export/privacy work remains intentionally deferred behind
the profile contract and privacy gate tasks instead of blocking materializer
readiness.

# Target / Scope

- `epic-34`
- `task-232`
- `task-233`
- `task-234`

# Preconditions / Environment

- `task-232` and `task-234` have defined profile contract and privacy/export
  gates.

# Test Cases

- Profile implementation cannot start until profile contract and privacy/export
  gates are done.
- Public exports are generated and sanitized rather than exposing full SQLite
  databases directly.
- Active runtime DB, WAL, SHM, journal, lock, and temp files remain excluded
  from public profile export proof.

# Results / Evidence

- `task-232` defines the future project DB profile contract, migration
  composition rules, config shape, reducer/receipt boundary, and open risks
  without implementing profiles.
- `task-233` selects the generic future `project-kv.v1` profile fixture and
  defines the packed smoke flow without adding profile commands.
- `task-234` defines privacy classes, export boundary, structured redaction
  rules, Git/artifact policy, and future test expectations.
- Profile implementation remains intentionally deferred; future public exports
  must be generated/sanitized artifacts, not full active SQLite database copies.
- Active runtime DB, WAL, SHM, journal, lock, and temp files remain excluded
  from public profile export proof by policy.

# Notes / Follow-ups

- This test documents and closes the deferral boundary; it does not implement
  profiles.
