---
id: test-189
type: test
title: packed temp-repo integration UX E2E and prepublish dry-run contract
status: done
priority: 1
epic: epic-112
parent: goal-22
tags: [e2e, prepublish]
owners: []
links: []
artifacts: []
relates: [task-424]
blocked_by: [task-424]
blocks: []
refs: []
aliases: [integration-ux-e2e-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate the complete integration UX surface from an installed package in a fresh temp repo.

# Target / Scope

- Packed install.
- Semantic refs.
- Checkpoint templates.
- Workflow validation.
- Queue adapter contract.
- Handoff creation.
- Prepublish dry-run readiness.

# Preconditions / Environment

- Fresh temp repo under `/private/tmp`.
- Installed mdkg tarball, not direct source imports.

# Test Cases

- Initialize repo and create an implementation goal.
- Add context and evidence refs.
- Create checkpoints by kind.
- Validate generic workflow fixtures.
- Exercise queue contract docs/JSON.
- Generate sanitized handoff.
- Run index, search, show, pack, validate, prepublish dry-run gates.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- This is the final goal-22 E2E contract before closeout.
