---
id: task-406
type: task
title: implement generated docs launch gate
status: todo
priority: 2
epic: epic-102
parent: goal-21
tags: [0.4.0, generated-docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-405]
blocks: [test-174, test-175, task-408]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Implement the launch gate that proves generated command docs and examples do not drift.

# Acceptance Criteria

- Generated docs come from command contract metadata.
- Examples are smoke-tested or explicitly evidence-linked.
- Drift fails the gate.

# Files Affected

- src/**
- scripts/**
- docs/**
- package.json

# Implementation Notes

- Do not document hidden/internal surfaces as public.

# Test Plan

- Command docs smoke.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
