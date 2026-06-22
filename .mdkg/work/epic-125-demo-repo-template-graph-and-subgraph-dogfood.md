---
tags: [mdkg-dev, demo, examples, subgraph]
owners: []
links: []
artifacts: []
relates: [goal-25, edd-26, dec-30]
blocked_by: [task-449]
blocks: [task-450, task-451, test-203, test-204]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [edd-25, edd-26, edd-27, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: epic-125
type: epic
title: demo repo template graph and subgraph dogfood
status: todo
priority: 1
---
# Goal

Create demo/template graphs that showcase goal-only agent starts while preserving canonical mdkg.dev SEO and graph boundaries.

# Scope

- `/examples/demo-agentic-coding`
- `/examples/template-mdkg-dev`
- Demo deployment policy.
- Read-only subgraph registration after nested graphs validate.

# Milestones

- `task-450`: examples and demo policy.
- `task-451`: subgraph registration and root-qualified qid proof.
- `test-203`: demo/template goal-only agent-start contract.
- `test-204`: subgraph registration contract.

# Out of Scope

- No production deploy.
- No Vercel preview unless separately requested.
- No durable demo subdomain promotion.

# Risks

- Demo graphs can become stale without smoke coverage.
- Demo URLs can compete with canonical SEO if not noindexed before promotion.
- Root graph could accidentally treat child graph nodes as mutable local work.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
