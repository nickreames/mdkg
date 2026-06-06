---
id: task-278
type: task
title: define root and downstream SPEC sync after mdkg publication
status: todo
priority: 1
epic: epic-52
parent: goal-8
tags: [sync, release, downstream, adoption]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-52, test-105]
blocked_by: [task-276, task-277]
blocks: [task-279]
refs: [edd-14]
aliases: [downstream-spec-adoption]
skills: [verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how parent/root repos and downstream consumers adopt the completed SPEC
design foundation.

# Acceptance Criteria

- Local accepted SHA, package publish, and root subgraph refresh paths are
  separate.
- All-repo sync is a separate follow-up goal.
- Per-repo SPEC adoption happens after mdkg assets are accepted.

# Test Plan

- `mdkg capability search "downstream SPEC adoption" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Do not publish or sync downstream repos in this task.

# Links / Artifacts

- `goal-8`
- `epic-52`
