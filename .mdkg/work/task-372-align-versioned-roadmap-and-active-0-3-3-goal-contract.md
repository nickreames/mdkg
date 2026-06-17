---
id: task-372
type: task
title: align versioned roadmap and active 0.3.3 goal contract
status: done
priority: 1
epic: epic-85
parent: goal-16
tags: [0.3.3, alignment, roadmap]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-158]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Close this graph-only alignment pass and prove `goal-16` routes to the right first implementation task.

# Acceptance Criteria

- Versioned release goals exist and are scoped by capability.
- Only `goal-16` is active.
- Later release goals are paused.
- Legacy goals are related to replacements but not manually archived yet.

# Files Affected

- new versioned roadmap goal files for 0.3.3 through 0.4.0
- new release epic files
- new release task and test files
- new release research spike files
- legacy paused goal files that receive supersession notes

# Implementation Notes

- This is graph-only alignment.
- Use existing CLI validation and routing receipts as evidence.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-16 --json` returns `task-372` before closeout.

# Checkpoint Requirement

Close with a checkpoint describing versioned roadmap alignment.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
