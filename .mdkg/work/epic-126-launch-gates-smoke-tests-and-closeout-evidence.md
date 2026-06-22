---
tags: [mdkg-dev, launch-gates, smokes, closeout]
owners: []
links: []
artifacts: []
relates: [goal-25, task-455, test-206]
blocked_by: []
blocks: [task-452, task-453, task-454, test-205]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-5]
evidence_refs: [chk-185]
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: epic-126
type: epic
title: launch gates smoke tests and closeout evidence
status: todo
priority: 1
---
# Goal

Prove mdkg.dev pre-release readiness with deterministic checks, evidence checkpoints, and a final no-launch closeout.

# Scope

- Graph-only hardening control nodes.
- Static site, docs, SEO, metadata, no-secret, link, accessibility, demo graph, subgraph, and publish-readiness smokes.
- README/site/docs parity.
- Final handoff and goal closeout.

# Milestones

- `task-455` and `test-206`: graph-only implementation contract hardening.
- `task-452`: launch-smoke automation.
- `task-453`: docs/readiness parity.
- `task-454`: closeout evidence and handoff.
- `test-205`: full pre-release readiness contract.

# Out of Scope

- No real public launch, DNS, deployment promotion, publish, tag, or push.
- No weakening of npm package release gates.

# Risks

- Site launch checks could become expensive or flaky if they depend on live network.
- Public docs could drift from README or command contract.
- Closeout could imply deployment even when only readiness was proven.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
