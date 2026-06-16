---
id: epic-97
type: epic
title: MCP security and future mutation boundary
status: todo
priority: 2
tags: [0.3.6, mcp, security]
owners: []
links: []
artifacts: []
relates: [goal-19]
blocked_by: []
blocks: [spike-8, task-396, task-397, test-169]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Document and test the path from read-only MCP toward future explicit mutation allowlists.

# Scope

- Document and test the path from read-only MCP toward future explicit mutation allowlists.

# Milestones

- spike-8
- task-396
- task-397
- test-169

# Acceptance Criteria

- Secrets are not exposed.
- Future mutation parity is designed but not broadly enabled.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-19
