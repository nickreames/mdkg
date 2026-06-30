---
id: task-621
type: task
title: create approval gated Vercel preview project and deploy proof
status: todo
priority: 2
epic: epic-205
parent: goal-44
tags: [demo, vercel, preview, approval, deploy]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-620]
blocks: [task-622, test-324]
refs: [dec-57, edd-59]
context_refs: [dec-57, edd-59]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

After explicit approval, create or verify the dedicated Vercel preview project
and deploy the first demo preview from this repo.

# Acceptance Criteria

- The intended project name is `mdkg-demo-previews`.
- The deployment source is this repo and the branch-path demo run.
- Vercel project id, deployment id, preview URL, commit SHA, build logs,
  screenshots, and noindex state are recorded.
- The task does not create DNS records, aliases, custom domains, durable
  `demo-N` hosting, git tags, npm publishes, or analytics activation.
- If approval or Vercel access is missing, the task records a blocker instead
  of improvising.

# Files Affected

- mdkg evidence/checkpoint nodes
- local artifact receipts under `/private/tmp` when Browser/Chrome/Vercel proof
  is collected

# Implementation Notes

- Real Vercel mutation must be separately approved at execution time.
- Treat preview URLs as public unless protected by Vercel access.

# Test Plan

- Vercel project/deployment inspection
- Browser/Chrome preview validation
- `test-324`

# Links / Artifacts

- `dec-57`
- `edd-59`
