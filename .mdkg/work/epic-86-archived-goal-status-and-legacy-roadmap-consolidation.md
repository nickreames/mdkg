---
id: epic-86
type: epic
title: archived goal status and legacy roadmap consolidation
status: todo
priority: 1
tags: [0.3.3, archived-goals]
owners: []
links: []
artifacts: []
relates: [goal-16]
blocked_by: []
blocks: [task-375, task-376, test-161]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Introduce archived goals as historical non-actionable roadmap context.

# Scope

- Introduce archived goals as historical non-actionable roadmap context.

# Milestones

- task-375
- task-376
- test-161

# Acceptance Criteria

- Archived goals are valid refs, excluded from default routing, and visible with explicit filters.
- Legacy goals are archived only after CLI/schema support exists.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-16
