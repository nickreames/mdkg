---
id: task-315
type: task
title: implement downstream migration automation after 0.3.0 publish
status: todo
priority: 2
epic: epic-67
parent: goal-11
tags: [implementation, downstream, migration, automation, deferred]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-314]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Implement downstream migration automation only after 0.3.0 is actually
published and `task-314` approves the dry-run contract.

# Acceptance Criteria

- Public package version is verified before mutation.
- `task-314` is done with design approval.
- Automation defaults to dry-run and passes `test-124`.

# Files Affected

- Deferred; to be defined by approved design.

# Implementation Notes

- Not part of 0.3.0.

# Test Plan

- To be defined by `task-314`.

# Links / Artifacts

- `task-314`
- `test-124`
