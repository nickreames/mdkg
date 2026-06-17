---
id: epic-87
type: epic
title: graph hygiene and doctor strictness
status: todo
priority: 1
tags: [0.3.3, doctor, hygiene]
owners: []
links: []
artifacts: []
relates: [goal-16]
blocked_by: []
blocks: [task-377, test-159, test-161]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Clean stale blockers and strict doctor warnings that obscure the active release path.

# Scope

- Clean stale blockers and strict doctor warnings that obscure the active release path.

# Milestones

- task-377
- test-159
- test-161

# Acceptance Criteria

- Closed blocker noise is reduced without hiding live dependency issues.
- Strict doctor remains useful for release gates.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-16
