---
id: task-324
type: task
title: design operator status and doctor strict baseline
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [status, doctor, operator, 0-3-2]
owners: []
links: []
artifacts: []
relates: [edd-17]
blocked_by: [task-323]
blocks: [task-331, task-332, task-333, test-132, test-133, test-134]
refs: [edd-17]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Design the `0.3.2` operator-health slice so humans, agents, and CI can ask one
command for repo state and one strict doctor command for actionable check IDs.

# Acceptance Criteria

- `mdkg status --json` output is specified for release, git, graph, DB,
  selected-goal, and generated-state health.
- `mdkg doctor --strict --json` has typed check IDs, stable severity, and clear
  remediation hints.
- JSON stdout and human diagnostics/stderr behavior are defined.
- Temp-repo and dirty-repo test scenarios are listed before implementation.

# Files Affected

- Future CLI command and doctor implementation files.
- Future help snapshots and command matrix entries.

List files/directories expected to change.

- path 1
- path 2

# Implementation Notes

- Design captured in `edd-17`.
- `status` and `doctor --strict` are read-only operator health surfaces.
- Repair/apply behavior remains out of scope and belongs to `epic-70`.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Links / Artifacts

- `edd-17`
- `task-331`
- `task-332`
- `task-333`
- `test-132`
- `test-133`
- `test-134`
