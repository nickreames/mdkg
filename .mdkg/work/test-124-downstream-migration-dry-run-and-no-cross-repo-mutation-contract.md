---
id: test-124
type: test
title: downstream migration dry-run and no-cross-repo-mutation contract
status: todo
priority: 2
epic: epic-67
parent: goal-11
tags: [downstream, migration, dry-run, test, deferred]
owners: []
links: []
artifacts: []
relates: [task-314, task-315]
blocked_by: [task-314]
blocks: []
refs: []
aliases: []
skills: []
cases: [dry-run-first, no-cross-repo-mutation, post-publish-version-check]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate future downstream migration automation is dry-run-first and does not
mutate other repositories without explicit approval.

# Target / Scope

- `task-314`
- `task-315`

# Preconditions / Environment

- Deferred until 0.3.0 is published and downstream migration design is approved.

# Test Cases

- Dry-run reports planned changes without writing.
- Real mutation requires explicit repo target and approval.
- Automation verifies the published mdkg version before applying migrations.

# Results / Evidence

- Deferred.

# Notes / Follow-ups

- Not part of 0.3.0.
