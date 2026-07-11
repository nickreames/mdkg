---
id: test-420
type: test
title: linked upgrade selection include exclude and compatibility contract
status: todo
priority: 1
parent: goal-68
tags: [goal-68, test, selection, compatibility]
owners: []
links: []
artifacts: []
relates: [task-758, task-761]
blocked_by: [task-761]
blocks: []
refs: [goal-68, dec-79]
context_refs: [goal-60]
evidence_refs: []
aliases: [linked-upgrade-selection-test]
skills: []
cases: [single-repo-regression, root-first, linked-alias-order, include, exclude, no-gitmodules]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove deterministic explicit selection and unchanged single-repo behavior.

# Target / Scope

- Upgrade CLI parser, selector, source-path config, help snapshots.

# Preconditions / Environment

- Temporary root with enabled/disabled/local/remote subgraph variants.

# Test Cases

- No flag remains one-root only.
- Linked ordering is root then aliases.
- Includes add contained unregistered mdkg roots; excludes win.
- Disabled, remote-only, missing source paths, and Git submodules are not
  silently selected.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- External includes remain out of v1.
