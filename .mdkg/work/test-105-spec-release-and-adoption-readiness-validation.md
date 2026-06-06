---
id: test-105
type: test
title: SPEC release and adoption readiness validation
status: done
priority: 1
epic: epic-52
parent: goal-8
tags: [release, adoption, sync, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-277, task-278, task-279]
blocked_by: [task-277, task-278]
blocks: [task-279]
refs: []
aliases: [spec-release-adoption-validation]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate the release, root sync, and downstream adoption handoff.

# Test Cases

- Local SHA, package publish, and subgraph refresh paths are separate.
- All-repo sync is a follow-up goal.
- Downstream SPEC adoption remains outside this mdkg planning pass.
- `goal-8` closeout evidence exists before marking achieved.

# Validation Evidence

- `task-277` is done and defines migration/backcompat policy, upgrade dry-run
  expectations, downstream extension preservation, and release note boundaries.
- `task-278` is done and defines separate local accepted SHA, package publish,
  and root subgraph refresh paths plus per-repo downstream adoption policy.
- `chk-55` and `chk-56` record backcompat and adoption handoff closeout
  evidence.
- `node dist/cli.js capability search "spec backcompat plan" --json` resolves
  `edd-14`.
- `node dist/cli.js capability search "downstream SPEC adoption" --json`
  resolves `edd-14`.
- `task-278` explicitly defers publish, root sync, downstream sync, and
  all-repo sync from this mdkg-only planning pass.
