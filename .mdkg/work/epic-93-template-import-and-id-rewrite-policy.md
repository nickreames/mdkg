---
id: epic-93
type: epic
title: template import and ID rewrite policy
status: todo
priority: 2
tags: [0.3.5, template-import, id-policy]
owners: []
links: []
artifacts: []
relates: [goal-18]
blocked_by: []
blocks: [task-388, test-166]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Support same-repo template imports with safe ID and link rewriting.

# Scope

- Support same-repo template imports with safe ID and link rewriting.

# Milestones

- task-388
- test-166

# Acceptance Criteria

- Same-repo imports never collide with existing IDs.
- All references are rewritten according to the import map.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-18
