---
id: epic-95
type: epic
title: read-only MCP server
status: todo
priority: 2
tags: [0.3.6, mcp, read-only]
owners: []
links: []
artifacts: []
relates: [goal-19]
blocked_by: []
blocks: [spike-8, task-392, task-394, test-168, test-169]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Expose a local MCP server for read-only mdkg inspection.

# Scope

- Expose a local MCP server for read-only mdkg inspection.

# Milestones

- spike-8
- task-392
- task-394
- test-168
- test-169

# Acceptance Criteria

- MCP can report status, search, show, and pack.
- No mutation tools are enabled by default.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-19
