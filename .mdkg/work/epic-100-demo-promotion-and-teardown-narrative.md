---
id: epic-100
type: epic
title: demo promotion and teardown narrative
status: todo
priority: 2
tags: [0.3.7, demo, teardown]
owners: []
links: []
artifacts: []
relates: [goal-20]
blocked_by: []
blocks: [task-401, task-403, test-173]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Define how rejected demos are trashed and accepted demos are promoted without harming canonical mdkg.dev.

# Scope

- Define how rejected demos are trashed and accepted demos are promoted without harming canonical mdkg.dev.

# Milestones

- task-401
- task-403
- test-173

# Acceptance Criteria

- Rejected demos are noindexed and removable.
- Canonical site stays stable.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-20
