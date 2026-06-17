---
id: task-377
type: task
title: clear stale blockers and closed-epic hygiene warnings
status: todo
priority: 1
epic: epic-87
parent: goal-16
tags: [0.3.3, hygiene, doctor]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-374, task-375]
blocks: [task-378]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Clean stale graph blockers and doctor strictness issues that obscure active release sequencing.

# Acceptance Criteria

- Done blockers are removed or annotated where they obscure live order.
- Closed epic warnings are resolved or intentionally documented.
- Strict doctor output separates failures from historical archived state.

# Files Affected

- .mdkg/work/**
- src/**
- tests/**

# Implementation Notes

- Prefer minimal graph edits.
- Do not rewrite unrelated roadmap content.

# Test Plan

- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js validate --json`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
