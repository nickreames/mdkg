---
id: epic-226
type: epic
title: Correct loop readiness routing and blocker continuation semantics
status: todo
priority: 1
tags: [loop, readiness, routing, blockers]
owners: []
links: []
artifacts: []
relates: [goal-61]
blocked_by: []
blocks: []
refs: [task-704, task-705, test-377, test-378]
context_refs: [goal-61, edd-70, dec-67, edd-69, dec-66]
evidence_refs: []
aliases: [loop-readiness-and-continuation-hardening]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Make readiness and next-work routing precise enough for ambitious loops to keep
working authorized lanes instead of stopping at the first gated decision.

# Scope

- Stable identity matching for questions, approvals, evidence, and waivers.
- Typed-ref validation and item-level readiness receipts.
- Routing across child work and blocker-recovery spikes/proposals.
- Closeout only when required lanes are complete or explicitly waived.

# Milestones

- `task-704` / `test-377`: readiness identity and validation.
- `task-705` / `test-378`: continuation and blocked semantics.

# Out of Scope

New loop statuses or runtime execution policy.

# Risks

- Over-strict mapping can strand valid legacy loops.
- Over-broad fallback can recreate false readiness.

# Links / Artifacts

- `edd-70`
- `dec-67`
- external links
