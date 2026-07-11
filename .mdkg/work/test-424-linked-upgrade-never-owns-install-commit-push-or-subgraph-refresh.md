---
id: test-424
type: test
title: linked upgrade never owns install commit push or subgraph refresh
status: todo
priority: 1
parent: goal-68
tags: [goal-68, test, boundary, no-push]
owners: []
links: []
artifacts: []
relates: [task-760, task-761, task-762]
blocked_by: [task-761]
blocks: []
refs: [goal-68, dec-79]
context_refs: [goal-60]
evidence_refs: []
aliases: [linked-upgrade-no-git-side-effects-test]
skills: []
cases: [no-install, no-stage, no-commit, no-push, no-register, no-sync, no-gitlink]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove linked upgrade is managed-scaffold orchestration only.

# Target / Scope

- CLI subprocess audit, Git refs/index, root config/bundles/gitlinks.

# Preconditions / Environment

- Complete and blocked linked upgrade fixtures.

# Test Cases

- No npm/global installation command is invoked.
- Git index, commits, branches, remotes, and refs remain unchanged.
- Subgraph config, bundles, materialized trees, and parent gitlinks remain
  unchanged.
- Receipt recommends explicit downstream validation/commit/sync next steps.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Root orchestration remains the owner of commits and projection refresh.
