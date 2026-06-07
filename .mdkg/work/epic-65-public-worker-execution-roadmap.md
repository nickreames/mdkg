---
id: epic-65
type: epic
title: public worker execution roadmap
status: todo
priority: 2
tags: [deferred, worker, execution, roadmap]
owners: []
links: []
artifacts: []
relates: [goal-11]
blocked_by: []
blocks: [task-310, task-311, test-122]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Design and eventually implement public worker execution after 0.3.0, with
explicit operator approval and no-secret runtime boundaries.

# Scope

- Design before implementation.
- Public CLI execution boundary.
- Secret/redaction policy and operator approval model.
- No-secret runtime validation.

# Milestones

- `task-310`
- `task-311`
- `test-122`

# Out of Scope

- No worker execution in 0.3.0.
- No implementation before design approval.

# Risks

- Worker execution can accidentally imply production authority.
- Runtime logs can accidentally capture secrets without strict boundaries.

# Links / Artifacts

- `goal-11`
