---
id: epic-48
type: epic
title: SPEC validation diagnostics and capability index requirements
status: todo
priority: 1
tags: [spec, validation, diagnostics, capability-index]
owners: []
links: []
artifacts: []
relates: [goal-8, task-271, task-272, test-101, test-102]
blocked_by: [epic-46, epic-47]
blocks: [task-271, task-272, test-101, test-102]
refs: [edd-14, dec-21]
aliases: [spec-validation-diagnostics, spec-capability-index]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Specify the future validation and discovery behavior for SPEC files without
implementing the command surface in this planning lane.

# Goal

Define how SPEC validation and capability discovery should behave before source
implementation begins.

# Scope

- Validation diagnostics.
- Future command-surface options.
- Capability index and search behavior.

# Milestones

- Complete `task-271`, `task-272`, `test-101`, and `test-102`.

# Acceptance Criteria

- Diagnostics distinguish errors, warnings, and repair suggestions.
- Capability search/index behavior for SPECs is explicit.
- Future CLI options are proposed but not implemented.

# Out of Scope

- CLI implementation.
- Parser implementation.

# Risks

- Diagnostics become too vague to guide repair work.

# Links / Artifacts

- `goal-8`
- `edd-14`
