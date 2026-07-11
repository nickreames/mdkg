---
id: epic-216
type: epic
title: Loop discovery indexing search show list and pack integration
status: todo
priority: 1
tags: [loop, index, search, pack]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Make loops discoverable and packable as first-class graph nodes while keeping
context selection deterministic and bounded.

# Scope

- Index, search, show, and list support for `type: loop`.
- Pack ordering and traversal for loop roots plus linked goals, tasks, tests,
  spikes, proposals, checkpoints, receipts, evidence, and decisions.
- Capability/discovery integration only where it follows existing mdkg patterns.

# Milestones

- `task-680` covers discovery/index surfaces.
- `task-681` covers pack ordering and context boundaries.
- `test-356` and `test-357` prove discovery and pack behavior.

# Out of Scope

- No vector/semantic retrieval.
- No CocoIndex provider integration.

# Risks

- Pack traversal could become too broad if loop child refs are unbounded.
- Discovery may work generically but miss loop-specific UX expectations.

# Links / Artifacts

- `goal-58`
- `task-673`
- `test-345`
