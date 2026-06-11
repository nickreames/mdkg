---
id: epic-66
type: epic
title: public DB event reducer lease materializer CLI roadmap
status: todo
priority: 2
tags: [deferred, db, event, reducer, lease, materializer, roadmap]
owners: []
links: []
artifacts: []
relates: [goal-11]
blocked_by: []
blocks: [task-312, task-313, test-123]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Design and eventually implement selected public DB event, reducer, lease, and
materializer CLI surfaces after 0.3.0.

# Scope

- Public CLI taxonomy design.
- Compatibility with existing internal helpers.
- Validation proving internal/local boundaries remain explicit.

# Milestones

- `task-312`
- `task-313`
- `test-123`

# Out of Scope

- No public DB event/reducer/lease/materializer CLI in 0.3.0.
- No arbitrary SQL exposure.

# Risks

- Public command naming can prematurely freeze internal helper semantics.
- Materializer behavior can be confused with hosted worker execution.

# Links / Artifacts

- `goal-11`

# Roadmap Alignment

This deferred public DB CLI epic is consolidated under the `goal-13` hardening
umbrella by narrative roadmap alignment only. It is intentionally not related
to `goal-13` in frontmatter so active hardening goal routing does not select
paused `goal-11` implementation work.
