---
id: test-325
type: test
title: accepted short path demo checkpoint gates advanced viewer contract
status: todo
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, checkpoint, viewer, mdkg-dev, lazy-load]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-622, test-324, test-329]
blocks: [goal-47, epic-207, spike-24]
refs: [dec-58, dec-59, edd-60, edd-61]
context_refs: [dec-58, dec-59, edd-60, edd-61]
evidence_refs: []
aliases: []
skills: []
cases: [a checkpoint explicitly classifies the preview as accepted rejected or needs-polish., only an accepted preview can unblock demo-n hosting follow-up work., follow-up dns and non-preview hosting remain paused without accepted evidence.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that the advanced embedded workspace viewer cannot start until the
short-path read-only demo proof has an explicit accepted checkpoint.

# Target / Scope

- `task-622`
- `goal-47`

# Preconditions / Environment

- Local `/demos`, `/demo/1`, and `/demo/1/output` route evidence exists.
- Closeout checkpoint has been drafted or created.

# Test Cases

- A checkpoint explicitly classifies the short-path demo proof as accepted,
  rejected, or needs-polish.
- Only an accepted local proof can unblock `goal-47` embedded workspace viewer
  research.
- Optional external hosting and DNS work remain archived/paused unless the
  operator separately revives it.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Passing this test is the explicit bridge from `goal-44` to `goal-47`.
