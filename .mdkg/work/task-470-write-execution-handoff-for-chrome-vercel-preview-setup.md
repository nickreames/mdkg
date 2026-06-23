---
id: task-470
type: task
title: write execution handoff for Chrome Vercel preview setup
status: done
priority: 1
epic: epic-136
parent: goal-27
tags: [mdkg-dev, handoff, vercel, chrome]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Produce a copy-ready handoff for the next agent to create Vercel preview projects through Chrome UI and validate them.

# Acceptance Criteria

- Handoff names both Vercel projects and roots.
- Handoff states preview-only stop condition.
- Handoff includes Browser/Chrome validation checklist.
- Handoff includes DNS/manual launch boundaries.
- Handoff forbids storing tokens, cookies, DNS credentials, or deployment bypass secrets in mdkg.

# Files Affected

- `.mdkg/work/task-470-*`
- Optional checkpoint/handoff artifact.

# Implementation Notes

- Prefer human-readable handoff plus mdkg refs over hidden chat context.
- Include Vercel plugin inspection steps after resources exist.

# Test Plan

Pack `goal-27` and verify the handoff is enough to execute without extra architecture decisions.

# Links / Artifacts

- `goal-27`
- `task-465`
- `task-466`
- `task-467`
- `task-468`
