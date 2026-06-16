---
id: epic-91
type: epic
title: repair receipts and branch E2E
status: todo
priority: 2
tags: [0.3.4, receipts, branch-e2e]
owners: []
links: []
artifacts: []
relates: [goal-17]
blocked_by: []
blocks: [task-384, task-385, test-164]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Prove branch merge ID repair through temp-repo two-branch smokes.

# Scope

- Prove branch merge ID repair through temp-repo two-branch smokes.

# Milestones

- task-384
- task-385
- test-164

# Acceptance Criteria

- Links remain functional after rewrite.
- Closeout captures repair receipts and dry-run gates.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-17
