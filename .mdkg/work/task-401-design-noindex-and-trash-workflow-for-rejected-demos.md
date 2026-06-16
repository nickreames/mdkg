---
id: task-401
type: task
title: design noindex and trash workflow for rejected demos
status: todo
priority: 2
epic: epic-100
parent: goal-20
tags: [0.3.7, noindex, teardown]
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

Design safe teardown and noindex behavior for rejected demo sites.

# Acceptance Criteria

- Rejected previews can be trashed.
- Durable demo subdomains can be retired cleanly.
- SEO impact is contained.

# Files Affected

- .mdkg/work/**
- docs/**

# Implementation Notes

- Avoid deleting production assets without explicit request.

# Test Plan

- Teardown plan review.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
