---
id: epic-96
type: epic
title: workspace and subgraph selection for MCP
status: todo
priority: 2
tags: [0.3.6, workspace, subgraph]
owners: []
links: []
artifacts: []
relates: [goal-19]
blocked_by: []
blocks: [task-393, task-395, test-170]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Make root graph, workspace, and subgraph selection explicit for MCP clients.

# Scope

- Make root graph, workspace, and subgraph selection explicit for MCP clients.

# Milestones

- task-393
- task-395
- test-170

# Acceptance Criteria

- Selection is root-contained and auditable.
- Subgraph active goals are read-only from the root context.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-19
