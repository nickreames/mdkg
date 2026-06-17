---
id: epic-94
type: epic
title: subgraph source safety and demo-template bootstrap
status: todo
priority: 2
tags: [0.3.5, subgraph, demo-template]
owners: []
links: []
artifacts: []
relates: [goal-18]
blocked_by: []
blocks: [task-389, task-390, task-391, test-167]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Tie clone/import workflows back to existing subgraph safety and demo bootstrap planning.

# Scope

- Tie clone/import workflows back to existing subgraph safety and demo bootstrap planning.

# Milestones

- task-389
- task-390
- task-391
- test-167

# Acceptance Criteria

- Existing subgraph sync/materialize behavior is audited.
- website-template-mdkg planning can start from a selected goal only.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-18
