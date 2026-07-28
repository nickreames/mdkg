---
id: task-55
type: task
title: Start the clock and dispatch the Demo 4 child goal
status: backlog
priority: 1
epic: epic-10
parent: goal-10
prev: task-59
next: task-56
tags: [ai-native-sdlc, presentation-demo, phase-10, step-1]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/dispatch-receipt.json, artifacts/demo-004/timing-ledger.json, artifacts/demo-004/blocker-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-10, epic-10, prd-1, edd-1, dec-4, dec-5, goal-9, test-27, task-59]
context_refs: [goal-10, epic-10, prd-1, edd-1, dec-4, dec-5, goal-9, test-27, task-59]
evidence_refs: [goal-9, test-27, task-59]
aliases: [phase-10-step-1]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

After task-59 has published the baseline, activated authority, and released
the root integration lease, start the immutable timed window, dispatch one
designated harness, and monitor the complete child through success or a
terminal timed blocker.

# Acceptance Criteria

- Verify task-59's publication and activation receipts, explicit
  root-integration lease release, `HEAD == origin/main`, empty index,
  zero-ahead/zero-behind state, and unchanged allowed local-evidence
  exceptions. Do not stage, commit, or push a preparation baseline here.
- Prove every dirty path at dispatch belongs to the exact preaccepted
  Goal 9/10 local-evidence-only inventory. Any Demo 4 child-run/canonical path
  dirty before its authorized child node is authority drift.
- Validate every authority/sendoff/allowlist/policy/lease/fallback hash and
  dispatch the exact Demo 4 `goal-1` pack without paraphrase.
- Treat `program-orchestrator` and `child-implementation-writer` as sequential
  logical roles of this same designated physical harness/lease. No separate
  umbrella writer mutates the checkout while the child role runs.
- Record presentation kickoff as `P0`; immediately before invoking the exact
  dispatch, record immutable `T0`. Require `T0 <= P0+00:45`, acknowledgement
  by T+00:45, positioning T+02, implementation T+13, local T+16, integration
  T+20, range/push T+22, production repair cutoff T+24, deployments T+26,
  routes/checkpoint T+28:30, reveal receipt T+29:15, verified selection
  T+29:30, and stop/fallback T+30.
- Allow at most two pre-publication repairs and one production repair.
- Record per-stage start/end/duration, attempts, retry class, external wait,
  interventions, blocker, and fallback.

# Files Affected

- Frozen Demo 4 allowlist, run evidence, accepted bounded commits, normal
  `origin/main` push, and program-local receipts.

# Implementation Notes

- The root integration owner has released the preparation lease. The child
  role later yields before the root integration owner executes and releases
  the child's publication node; the designated harness then resumes read-only
  verification and receipts. No overlapping writers.
- Any drift or forbidden action selects Demo 2; do not seek ad hoc expansion.

# Test Plan

Verify the timing ledger, child checkpoint or blocker, actual range-policy
proof, exact-SHA/live receipts, and unchanged forbidden surfaces.

# Links / Artifacts

- goal-9
- test-27
- dec-5
