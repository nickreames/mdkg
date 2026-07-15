---
id: test-441
type: test
title: Archive containment symlink and local workspace compatibility remain intact
status: done
priority: 0
epic: epic-249
tags: [archive, security, containment, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-778, task-781]
blocks: []
refs: [goal-70, task-778, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Guard the existing security and valid-local behavior while selection changes.

# Target / Scope

Existing archive containment/symlink suites and single/multi-local workspace
compression behavior.

# Preconditions / Environment

Run existing suites unchanged plus targeted disposable compatibility cases.

# Test Cases

- Escaping and symlinked inputs/destinations fail closed.
- Valid root-only and multi-local commands retain output and locking behavior.
- Final index/verify behavior remains compatible.

# Results / Evidence

Passed: the focused ownership fixture and full 641-test repository suite retain
existing containment, symlink, single-repository, multi-local-workspace,
subgraph, goal, and archive behavior.

# Notes / Follow-ups

- No ad hoc replacement for centralized path authority is accepted.
