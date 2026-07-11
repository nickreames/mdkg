---
id: task-679
type: task
title: implement loop blocker continuation graph guidance
status: done
priority: 1
epic: epic-215
parent: goal-58
tags: [loop, blockers, spike, proposal]
owners: []
links: []
artifacts: [src/commands/loop.ts, tests/commands/loop.test.ts]
relates: []
blocked_by: [task-677]
blocks: []
refs: [goal-58, edd-66, dec-65, task-670, test-359, test-347]
context_refs: []
evidence_refs: [chk-385]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Implement the loop-specific blocker-continuation contract so loops do not stop
at the first blocked branch when other useful scoped work remains.

# Acceptance Criteria

- Loop guidance routes material blockers to a spike when source/web grounding is
  needed.
- Non-trivial blockers route to a proposal with at least three viable options
  and one recommended path.
- Affected goals/work items receive blocker evidence while the loop continues
  other useful scoped work when possible.

# Files Affected

- loop validation/core helpers
- CLI receipts or planning output
- blocker-continuation tests

# Implementation Notes

- This is graph guidance, not runtime execution.
- Whole-loop blocked state should be reserved for repeated/global blockers that
  prevent meaningful progress across the remaining definition of done.

# Test Plan

- Contract tests for spike/proposal/recommendation routing.
- Regression checks that ordinary task blockers still behave as before.

# Links / Artifacts

- `task-670`
- `test-359`
