---
id: task-258
type: task
title: define root follow-up sync after mdkg publication
status: todo
priority: 1
epic: epic-45
parent: goal-6
tags: [sync, root, publication, templates]
owners: []
links: []
artifacts: []
relates: [goal-6, epic-45, test-94]
blocked_by: [task-257]
blocks: [task-259]
refs: [edd-14]
aliases: [root-follow-up-sync-after-mdkg-publication]
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Define the root follow-up sync plan after mdkg publishes or locally accepts the
hardened seeded skills/templates.

# Acceptance Criteria

- mdkg repo changes are committed locally before root subgraph refresh.
- Root consumes mdkg assets after publish or accepted local SHA.
- Downstream all-repo upgrade/sync is a separate goal.
- Per-child SPEC adoption is staged after the root sync.

# Files Affected

- Child mdkg planning nodes only.

# Implementation Notes

- Do not push or publish from this planning task.

# Test Plan

- `mdkg goal next goal-6 --json`
- Root follow-up plan exists in root `goal-16`.

# Links / Artifacts

- `goal-6`
- `goal-16`
