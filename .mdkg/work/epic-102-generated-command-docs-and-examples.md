---
id: epic-102
type: epic
title: generated command docs and examples
status: todo
priority: 2
tags: [0.4.0, docs, command-contract]
owners: []
links: []
artifacts: []
relates: [goal-21]
blocked_by: []
blocks: [task-406, test-174, test-175]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Goal

Use generated command metadata and smoke-tested examples as the public docs foundation.

# Scope

- Use generated command metadata and smoke-tested examples as the public docs foundation.

# Milestones

- task-406
- test-174
- test-175

# Acceptance Criteria

- Command docs drift is prevented.
- Examples run in temp repos or identify evidence.

# Out of Scope

- No real npm publish, git tag, git push, website deploy, or child-repo mutation is included in this epic unless separately requested.
- Work outside the owning release goal stays deferred.

# Risks

- Scope creep across release goals would make the versioned roadmap ambiguous.
- Missing temp-repo evidence would weaken release confidence.

# Links / Artifacts

- goal-21
