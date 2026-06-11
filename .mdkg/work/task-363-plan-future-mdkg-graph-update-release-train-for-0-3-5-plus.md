---
id: task-363
type: task
title: plan future mdkg graph update release train for 0.3.5 plus
status: todo
priority: 3
epic: epic-83
tags: [future, graph-upgrade, compatibility, lower-priority]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Plan a lower-priority future mdkg graph update and compatibility train, likely
after the spike foundation and initial mdkg.dev readiness work. This keeps graph
format evolution visible without pulling it into the immediate spike release.

# Acceptance Criteria

- Inventory graph-format, migration, upgrade, and compatibility ideas deferred
  from the current hardening train.
- Define dry-run-first requirements for graph upgrades, generated cache updates,
  and downstream repo compatibility.
- Identify release milestone candidates such as `0.3.5+` without committing to
  a fixed version if scope shifts.
- Create follow-up epics/tasks/tests only when the compatibility slice is ready
  to activate.

# Files Affected

- future graph update roadmap nodes
- upgrade docs and smoke scripts when activated

# Implementation Notes

- Keep this lane separate from `goal-14` spike implementation.
- Do not mutate downstream repos from this task.
- Use dry-run receipts as the default design shape for future graph updates.

# Test Plan

- Run `mdkg upgrade --dry-run --json` in temp repos when the lane activates.
- Validate no-mutation guarantees with `test-151`.
- Run `node dist/cli.js validate --json`.

# Links / Artifacts

- Owned by `epic-83`.
