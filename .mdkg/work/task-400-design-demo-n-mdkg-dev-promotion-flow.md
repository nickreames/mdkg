---
id: task-400
type: task
title: design demo n mdkg dev promotion flow
status: todo
priority: 2
epic: epic-99
parent: goal-20
tags: [0.3.7, demo-subdomain]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-399]
blocks: [test-173, task-402]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design how a good preview can become a durable `demo-N.mdkg.dev` subdomain.

# Acceptance Criteria

- Promotion is explicit.
- Canonical mdkg.dev remains stable.
- Demo versions can be cataloged or retired.

# Files Affected

- .mdkg/work/**
- docs/**

# Implementation Notes

- No DNS mutation in this planning task.

# Test Plan

- Promotion plan review.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
