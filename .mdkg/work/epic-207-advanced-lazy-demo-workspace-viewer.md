---
id: epic-207
type: epic
title: advanced lazy demo workspace viewer
status: todo
priority: 3
tags: [demo, viewer, workspace, lazy-load, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-325, test-329]
blocks: [spike-24, task-627, test-328]
refs: [goal-47, edd-61]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-29
updated: 2026-06-29
---
# Goal

Deliver the optional advanced workspace viewer for accepted demo detail pages
after the lightweight read-only explorer is proven.

# Scope

- Research embedded workspace/editor options and bundle tradeoffs.
- Implement a lazy-loaded viewer only if the research shows value beyond the
  v1 graph/file/output explorer.
- Validate that homepage, docs, and non-demo mdkg.dev routes are unaffected.
- Record Browser/Chrome screenshots, console health, and bundle evidence.

# Milestones

- `spike-24`: choose the viewer approach and limits.
- `task-627`: implement the lazy embedded workspace viewer.
- `test-328`: prove lazy-load performance and route isolation.

# Out of Scope

- Public deployment, DNS, tags, npm publish, and provider mutation.
- Arbitrary live filesystem access from public routes.
- Editing the v1 `/demo/1` source proof before it is accepted.

# Risks

- Heavy editor/runtime code harms homepage performance.
- Public snapshots accidentally expose private context.
- The workspace UI distracts from the simpler graph-to-output story.

# Links / Artifacts

- `goal-47`
- `goal-44`
- `edd-61`
