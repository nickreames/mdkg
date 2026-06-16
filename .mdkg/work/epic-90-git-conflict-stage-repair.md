---
id: epic-90
type: epic
title: Git conflict-stage repair
status: todo
priority: 2
tags: [0.3.4, git-conflicts]
owners: []
links: []
artifacts: []
relates: [goal-17]
blocked_by: []
blocks: [spike-6, task-383, test-163]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Handle unresolved Git index conflict stages in the same repair command surface.

# Scope

- Handle unresolved Git index conflict stages in the same repair command surface.

# Milestones

- spike-6
- task-383
- test-163

# Acceptance Criteria

- Conflict-stage files can be inspected before apply.
- Repair output remains receipt-shaped and auditable.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-17
