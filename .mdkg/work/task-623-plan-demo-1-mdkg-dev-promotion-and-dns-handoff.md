---
id: task-623
type: task
title: plan demo-1 mdkg dev promotion and DNS handoff
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, dns, vercel, promotion, handoff]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-23]
blocks: [task-624]
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Plan the first durable demo promotion from an accepted preview to
`demo-1.mdkg.dev` or the next available `demo-N` hostname.

# Acceptance Criteria

- Accepted preview evidence from `test-325` is linked.
- The selected `demo-N.mdkg.dev` hostname is justified.
- DNS and Vercel steps are written as an explicit handoff.
- Approval boundaries for custom domains, aliases, DNS, deploys, and production
  promotion are restated.

# Files Affected

- mdkg graph/evidence nodes only unless a later execution explicitly approves
  hosting source changes

# Implementation Notes

- Start with `demo-1.mdkg.dev` unless it is unavailable or already assigned.
- Do not perform DNS or Vercel mutation while writing the handoff.

# Test Plan

- Handoff review.
- `node dist/cli.js validate --json`

# Links / Artifacts

- `goal-46`
- `spike-23`
