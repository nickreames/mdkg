---
id: test-329
type: test
title: read only demo viewer lazy load and homepage isolation contract
status: todo
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, viewer, performance, lazy-load, homepage]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-630]
blocks: [task-622, test-325]
refs: [edd-61, task-630]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that the first read-only demo viewer is local to accepted demo routes
and does not affect mdkg.dev homepage or normal docs-path loading.

# Target / Scope

- `task-630`
- mdkg-dev homepage
- `/demos`
- `/demo/1`
- `/demo/1/output`

# Preconditions / Environment

- Demo routes exist locally.
- mdkg-dev builds locally.
- Browser and Chrome are available for local route validation.

# Test Cases

- `npm --prefix mdkg-dev run build` passes.
- `/`, `/demos`, `/demo/1`, and `/demo/1/output` render without console errors.
- Homepage does not import or hydrate heavy demo viewer code.
- Demo detail route remains usable at desktop and mobile widths.
- Graph/file/output panes do not overlap, clip labels, or expose private paths.

# Results / Evidence

Pending.

# Notes / Follow-ups

- If the v1 viewer needs heavier code, defer that behavior to `goal-47` and keep
  this goal focused on lightweight read-only proof.
