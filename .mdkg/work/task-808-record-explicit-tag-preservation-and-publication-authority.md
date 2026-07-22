---
id: task-808
type: task
title: Record explicit tag preservation and publication authority
status: todo
priority: 1
parent: goal-76
tags: [decision, tag, authority]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-807]
blocks: [test-467]
refs: [goal-76, task-807]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-21
updated: 2026-07-21
---
# Overview

Record a current human decision selecting a no-override future scope and
separately stating any tag mutation/publication authority. Planning authority
alone cannot move or recreate a published tag.

# Acceptance Criteria

- The decision chooses an exact range or an explicit preservation procedure.
- Branch rewrite, force-push, tag mutation, tag push, release repair, and npm
  publication are each separate authority booleans.
- Absent any required authority, leave Goal 76 paused rather than infer it.

# Files Affected

List files/directories expected to change.

- `.mdkg/design/dec-*-*`
- `.mdkg/work/task-808-*`

# Implementation Notes

- This task records authority; it performs no Git or provider mutation.

# Test Plan

Validate the decision graph and ensure the approved range/procedure is precise
enough for test 467 to audit without an override.

# Links / Artifacts

- `goal-76`
- `task-807`
