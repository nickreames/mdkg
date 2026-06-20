---
id: task-418
type: task
title: add checkpoint kinds and closeout templates
status: done
priority: 1
epic: epic-107
parent: goal-22
tags: [checkpoint, templates, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-414]
blocks: [test-184, task-422, task-423]
refs: []
aliases: [checkpoint-kind-templates]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Improve checkpoint creation so closeout evidence is structured, reviewable, and safer by default.

# Acceptance Criteria

- `mdkg checkpoint new` supports explicit kinds: implementation, test-proof, goal-closeout, audit, and handoff.
- `mdkg task done --checkpoint` can select an appropriate checkpoint kind.
- Generated checkpoint bodies include command evidence, pass/fail status, known warnings, changed surfaces, follow-up refs, and boundaries.
- Raw-content marker detection emits warnings, not hard failures.

# Files Affected

- Checkpoint commands and templates.
- Validation warning plumbing.
- Init and upgrade assets.

# Implementation Notes

- Templates should improve durable evidence without encouraging raw log dumps.
- Raw-marker checks should warn and name the risky section or path.

# Test Plan

- Unit tests for each checkpoint kind.
- npm run smoke:checkpoint-templates
- test-184

# Links / Artifacts

- test-184
