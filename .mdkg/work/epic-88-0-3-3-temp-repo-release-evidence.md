---
id: epic-88
type: epic
title: 0.3.3 temp-repo release evidence
status: todo
priority: 1
tags: [0.3.3, smoke, release]
owners: []
links: []
artifacts: []
relates: [goal-16]
blocked_by: []
blocks: [task-378, task-379, test-158, test-160]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Prove the lifecycle and archive behavior in a fresh temp repo and close release evidence.

# Scope

- Prove the lifecycle and archive behavior in a fresh temp repo and close release evidence.

# Milestones

- task-378
- task-379
- test-158
- test-160

# Acceptance Criteria

- Temp smoke covers active goal, archived goal, subgraph validation, and strict doctor behavior.
- 0.3.3 closes with dry-run publish evidence only.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-16
