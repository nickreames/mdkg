---
id: test-325
type: test
title: accepted preview checkpoint gates demo N promotion contract
status: todo
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, preview, promotion, checkpoint, dns]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-622, test-324]
blocks: [goal-46, epic-206, spike-23]
refs: [dec-57, edd-59]
context_refs: [dec-57, edd-59]
evidence_refs: []
aliases: []
skills: []
cases: [a checkpoint explicitly classifies the preview as accepted rejected or needs-polish., only an accepted preview can unblock demo-n hosting follow-up work., follow-up dns and non-preview hosting remain paused without accepted evidence.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that durable demo hosting cannot start until a preview has an explicit
accepted checkpoint.

# Target / Scope

- `task-622`
- `goal-46`

# Preconditions / Environment

- Preview evidence exists if Vercel preview deployment was approved.
- Closeout checkpoint has been drafted or created.

# Test Cases

- A checkpoint explicitly classifies the preview as accepted, rejected, or
  needs-polish.
- Only an accepted preview can unblock `demo-N` hosting follow-up work.
- Follow-up DNS and non-preview hosting remain paused without accepted evidence.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Passing this test is the explicit bridge from `goal-44` to `goal-46`.
