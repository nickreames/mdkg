---
id: test-328
type: test
title: embedded workspace viewer lazy load performance contract
status: blocked
priority: 3
epic: epic-207
parent: goal-47
tags: [demo, viewer, performance, bundle, homepage]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-627]
blocks: []
refs: [edd-61, task-627]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that the advanced embedded workspace viewer is isolated to demo detail
routes and does not degrade normal mdkg.dev or docs user journeys.

# Target / Scope

- `task-627`
- `goal-47`
- mdkg-dev homepage, docs-adjacent routes, and demo detail routes

# Preconditions / Environment

- `goal-44` read-only demo route proof is complete.
- mdkg-dev builds locally.
- The embedded viewer implementation exists behind a demo detail route.

# Test Cases

- `npm --prefix mdkg-dev run build` passes.
- Browser and Chrome render the demo detail viewer at desktop and mobile sizes.
- Homepage and non-demo routes do not load heavy workspace/editor chunks in the
  build output or runtime observations available during validation.
- Console has no route-specific errors after opening the workspace viewer.
- Snapshot data remains sanitized and read-only.

# Results / Evidence

Pending.

# Notes / Follow-ups

- If bundle impact is unacceptable, defer the embedded workspace and keep the v1
  read-only explorer.
