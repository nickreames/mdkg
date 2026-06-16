---
id: task-399
type: task
title: design Vercel preview deploy workflow
status: todo
priority: 2
epic: epic-99
parent: goal-20
tags: [0.3.7, vercel, preview]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-9, task-398]
blocks: [test-172, task-400, task-401, task-402]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design preview deployment handoff for website demos.

# Acceptance Criteria

- Preview deploy can run during a live presentation.
- The preview URL can be shared without promoting to canonical mdkg.dev.
- Provider secrets are not stored in mdkg.

# Files Affected

- .mdkg/work/**
- docs/**

# Implementation Notes

- Prefer Vercel preview flow; no deployment without explicit request.

# Test Plan

- Handoff review.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
