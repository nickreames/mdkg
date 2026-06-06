---
id: task-267
type: task
title: define required and optional SPEC sections
status: todo
priority: 1
epic: epic-46
parent: goal-8
tags: [spec, sections, contract]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-46, test-99]
blocked_by: [task-266]
blocks: [task-268, task-269]
refs: [edd-14]
aliases: [spec-section-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define the semantics for required and optional SPEC sections.

# Acceptance Criteria

- Required sections cover identity, purpose, authority boundary, resource
  boundary, capabilities, validation, evidence, security/privacy, versioning,
  and change policy.
- Conditional sections cover queue/event semantics, single-writer policy,
  projection targets, API shape, runtime image, model, tool, and integration
  details.
- Missing required sections have a future diagnostic policy.

# Test Plan

- `mdkg capability search "SPEC section contract" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Define semantics before changing templates or validators.

# Links / Artifacts

- `goal-8`
- `epic-46`
