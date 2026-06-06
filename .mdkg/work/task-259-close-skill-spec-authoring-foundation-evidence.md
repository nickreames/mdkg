---
id: task-259
type: task
title: close skill SPEC authoring foundation evidence
status: todo
priority: 1
epic: epic-45
parent: goal-6
tags: [closeout, evidence, validation]
owners: []
links: []
artifacts: []
relates: [goal-6, task-258, test-94]
blocked_by: [task-258, test-94]
blocks: []
refs: [edd-14]
aliases: [skill-spec-authoring-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Close `goal-6` after root follow-up sync planning and validation evidence are
recorded.

# Acceptance Criteria

- `mdkg validate` passes.
- `mdkg skill validate author-mdkg-skill --json` passes.
- Template coverage check passes.
- Root follow-up sync plan is recorded.

# Files Affected

- Child mdkg closeout evidence only.

# Implementation Notes

- Close only after `task-258` and `test-94` are complete.

# Test Plan

- `mdkg validate`
- `mdkg goal next goal-6 --json`

# Links / Artifacts

- `task-258`
- `test-94`
