---
id: epic-89
type: epic
title: duplicate ID repair apply
status: todo
priority: 2
tags: [0.3.4, id-repair]
owners: []
links: []
artifacts: []
relates: [goal-17]
blocked_by: []
blocks: [spike-6, task-380, task-381, task-382, test-162]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Repair clean duplicate-ID graph trees with deterministic rewrite plans and apply receipts.

# Scope

- Repair clean duplicate-ID graph trees with deterministic rewrite plans and apply receipts.

# Milestones

- spike-6
- task-380
- task-381
- task-382
- test-162

# Acceptance Criteria

- Base/main IDs are preserved.
- Incoming IDs and references are rewritten deterministically.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-17
