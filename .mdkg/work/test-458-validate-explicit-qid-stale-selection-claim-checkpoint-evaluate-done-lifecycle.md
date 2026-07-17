---
id: test-458
type: test
title: Validate explicit QID stale selection claim checkpoint evaluate done lifecycle
status: done
priority: 1
epic: epic-254
tags: [lifecycle, deterministic, selected-goal]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: []
relates: [goal-74, task-798, task-799]
blocked_by: [task-798, task-799]
blocks: []
refs: [goal-74, task-798, task-799, edd-79, dec-85]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: []
cases: []
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Validate the lifecycle text and this execution's explicit-QID receipts against a
stale achieved selected goal without mutating selection.

# Target / Scope

- Canonical and public `pursue-mdkg-goal` bodies.
- Explicit `root:goal-74` show, next, claim, evaluate, and done receipts.
- Selected `root:goal-73` before/after state.

# Preconditions / Environment

Run from the repository root with selected achieved `root:goal-73` preserved and
all work commands supplied explicit QIDs.

# Test Cases

- Assert the skill says a supplied QID is authoritative and selected state is a
  hint that may be stale or achieved.
- Assert explicit show and next precede an owner-before-claim sequence.
- Assert checkpoint evidence precedes path-specific commit guidance.
- Assert evaluate precedes evidence-supported done.
- Assert a blocked lane permits other actionable scope to continue.
- Assert ordinary lifecycle excludes credential inspection, publish, push, tag,
  deploy, and provider mutation.
- Compare `mdkg goal current --json` before and after for exact selected QID and
  selection timestamp equality.

# Results / Evidence

- Passed deterministic text assertions for supplied-QID authority, stale or
  achieved selected-state handling, explicit show/next/claim commands,
  owner-before-claim, blocker continuation, and ordinary no-publish/no-push
  safety.
- Passed ordering assertion:
  owner before claim, checkpoint before evaluate, evaluate before conditional
  done, and done before local commit guidance.
- `mdkg skill validate pursue-mdkg-goal --json`: 1 checked, 0 warnings, 0
  errors.
- Live explicit `root:goal-74` show/next/claim receipts used owned
  `root:test-458` while `mdkg goal current --json` remained selected achieved
  `root:goal-73` at `2026-07-16T15:43:02.912Z`.
- Final explicit evaluate/done receipts are recorded at the goal closeout
  boundary after all scoped tests pass.

# Notes / Follow-ups

- None unless deterministic ordering or selected-state assertions fail.
