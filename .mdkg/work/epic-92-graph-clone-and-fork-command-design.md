---
id: epic-92
type: epic
title: graph clone and fork command design
status: todo
priority: 2
tags: [0.3.5, clone, fork]
owners: []
links: []
artifacts: []
relates: [goal-18]
blocked_by: []
blocks: [spike-7, task-386, task-387, test-165]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Support separate-repo graph clone/fork workflows that preserve IDs.

# Scope

- Support separate-repo graph clone/fork workflows that preserve IDs.

# Milestones

- spike-7
- task-386
- task-387
- test-165

# Acceptance Criteria

- Cloned graphs remain valid in separate repos.
- Clone/fork UX is explicit about source and destination boundaries.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-18
