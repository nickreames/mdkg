---
id: task-571
type: task
title: create production launch checklist with announcement deferred
status: done
priority: 1
epic: epic-193
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-570]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Create the production launch checklist after custom-domain proof is complete, while keeping public announcement separate.

# Acceptance Criteria

- Checklist covers DNS, SSL, robots, sitemap, canonical, metadata, screenshots, Vercel deployments, no-secret posture, and rollback notes.
- Checklist states production domains are live and indexable if validation passed.
- Checklist explicitly defers public announcement and any analytics activation.
- Any remaining polish follow-ups are linked as future mdkg nodes, not hidden in prose.

# Files Affected

- `.mdkg/work/**`

# Implementation Notes

- This is not a marketing announcement.
- If production cutover is blocked, produce a blocked checklist with exact blockers instead.

# Test Plan

- Launch checklist checkpoint exists and references validation evidence.
- `test-288`

# Links / Artifacts

- Future launch checklist checkpoint.
