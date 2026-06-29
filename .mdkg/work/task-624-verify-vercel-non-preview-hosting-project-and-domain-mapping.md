---
id: task-624
type: task
title: verify Vercel non-preview hosting project and domain mapping
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, vercel, hosting, domain, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-623]
blocks: [task-625, test-326]
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

After explicit approval, verify the Vercel project, deployment, and domain
mapping needed for durable demo hosting.

# Acceptance Criteria

- Vercel project id, deployment id, domain config, and build logs are recorded.
- Domain mapping is verified for the selected `demo-N.mdkg.dev` host.
- DNS changes are linked to explicit approval evidence.
- No unrelated Vercel project, DNS record, or canonical mdkg.dev route is
  mutated.

# Files Affected

- mdkg evidence/checkpoint nodes
- local receipts under `/private/tmp`

# Implementation Notes

- Refresh Vercel state before claiming currentness.
- Treat provider credentials and bypass tokens as secrets.

# Test Plan

- Vercel project/deployment/domain inspection.
- DNS resolution checks.
- `test-326`

# Links / Artifacts

- `goal-46`
- `test-326`
