---
id: task-709
type: task
title: Repair loop evidence run corrected dogfood and close the release candidate
status: done
priority: 1
epic: epic-228
prev: task-708
tags: [loop, dogfood, evidence, release]
owners: []
links: []
artifacts: []
relates: [goal-61, test-382, goal-58, goal-59, loop-1, loop-3, loop-4, loop-5, loop-6, spike-30, spike-31, task-726, task-727]
blocked_by: []
blocks: []
refs: [test-382, goal-58, goal-59, loop-1, loop-3, loop-4, loop-5, loop-6, spike-30, spike-31, task-726, task-727]
context_refs: [goal-61, epic-228, edd-70, dec-67, task-688, task-689, dec-71, dec-72, chk-415]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Reconcile inaccurate completion records, preserve failed dogfood as historical
evidence, run fresh corrected read-only audit forks, and produce the durable
v0.5.0 loop release-candidate checkpoint.

# Acceptance Criteria

- Goal/test/checkpoint records distinguish proven evidence from pending claims.
- Failed `loop-1` and related superseded work remain discoverable and unchanged
  except for explicit supersession/cancellation metadata where appropriate.
- Fresh security and backend/API/CLI loops answer pre-run questions, exhaust
  authorized lanes, and meet their definitions of done or use typed waivers.
- Full regressions pass and Goal 1 records a release-candidate checkpoint.

# Files Affected

List files/directories expected to change.

- Prior loop goals/tests/checkpoints requiring evidence correction
- New corrected loop forks and generated mdkg work/evidence nodes
- Release-candidate verification receipts

# Implementation Notes

- Do not rewrite history to make failed dogfood look successful.
- Audit loops may create future mdkg work but do not make unrelated functional fixes.
- Do not bump versions or finalize the changelog.
- Treat `task-726` and `task-727` as audit-derived release hardening; keep
  `task-728` and `prop-5` as future `goal-60` planning rather than broadening
  this release into a CLI decomposition.

# Test Plan

Run `test-382`, full required checks, graph validation, goal evaluation, and pack
the completed release-candidate checkpoint for Goals 2 and 4.

# Links / Artifacts

- `goal-58`
- `goal-59`
- `loop-1`
- `loop-3`
- `loop-4`
- `loop-5`
- `loop-6`
- `spike-30`
- `spike-31`
