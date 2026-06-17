---
id: epic-85
type: epic
title: goal lifecycle semantics
status: todo
priority: 1
tags: [0.3.3, goal-lifecycle]
owners: []
links: []
artifacts: []
relates: [goal-16]
blocked_by: []
blocks: [task-373, task-374, test-159, test-160]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Define the public goal activation model and single-active-root invariant.

# Scope

- Define the public goal activation model and single-active-root invariant.

# Milestones

- task-373
- task-374
- test-159
- test-160

# Acceptance Criteria

- `goal activate` semantics are clear and compatible with existing goal select/claim/current flows.
- Root graph has at most one active goal; subgraphs validate independently.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-16
