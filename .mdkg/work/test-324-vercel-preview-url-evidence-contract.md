---
id: test-324
type: test
title: Vercel preview URL evidence contract
status: todo
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, vercel, preview, evidence]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-621]
blocks: [task-622, test-325]
refs: [dec-57, edd-59]
context_refs: [dec-57, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [preview deploy runs only after explicit approval., evidence records vercel project and deployment ids., evidence records preview url commit sha build logs screenshots and noindex state., preview is not promoted to demo-n hosting in this goal.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that any Vercel preview deployment has enough evidence for review
without becoming durable hosting.

# Target / Scope

- `task-621`
- Vercel preview deployment evidence

# Preconditions / Environment

- Explicit approval for Vercel preview project/deploy work exists.
- Local demo run gates have passed.

# Test Cases

- Preview deploy runs only after explicit approval.
- Evidence records Vercel project and deployment ids.
- Evidence records preview URL, commit SHA, build logs, screenshots, and noindex
  state.
- Preview is not promoted to `demo-N` hosting in this goal.

# Results / Evidence

Pending.

# Notes / Follow-ups

- If approval is missing, record a blocker rather than running Vercel mutation.
