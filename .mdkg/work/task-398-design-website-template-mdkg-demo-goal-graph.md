---
id: task-398
type: task
title: design website-template-mdkg demo goal graph
status: todo
priority: 2
epic: epic-98
parent: goal-20
tags: [0.3.7, demo-graph]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-9]
blocks: [test-171, task-399, task-402]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Design the template `.mdkg` graph that a coding agent can start from during a live demo.

# Acceptance Criteria

- One umbrella website goal exists in the template design.
- It includes design, stack, epics, tasks, tests, checkpoints, and skill candidates.
- The agent can start from one goal id with minimal context.

# Files Affected

- .mdkg/work/**
- docs/**

# Implementation Notes

- This is planning; do not create or deploy the external repo here unless separately requested.

# Test Plan

- Review template plan.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
