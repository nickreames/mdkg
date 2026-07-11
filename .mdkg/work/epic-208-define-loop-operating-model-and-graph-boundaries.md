---
id: epic-208
type: epic
title: Define loop operating model and graph boundaries
status: todo
priority: 1
tags: [loop, planning, operating-model, boundaries]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, edd-66, dec-65, edd-10, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Goal

Define what a first-class mdkg loop is, how it differs from goals, skills,
runtime jobs, and ordinary work nodes, and which service owns each part of the
operating model.

# Scope

- Loop purpose, scope, lineage, definition of done, constraints, linked
  subnodes, evidence, outputs, approvals, and evaluations.
- Boundary with `goal`: goal remains outcome-oriented; loop becomes
  process-oriented and reusable.
- Boundary with skills: skills remain procedural instructions; loops become
  graph-native process state with identity and lineage.
- Boundary with omni-room-runtime: runtime executes agents/tools/sandboxes;
  mdkg stores process state and graph semantics.
- Boundary with work mirrors and receipts: loops may link to them but do not
  change their semantics.

# Milestones

- Audit current goal and node-type architecture.
- Draft loop operating-model sections in `edd-66`.
- Record service-boundary assumptions and open questions.

# Out of Scope

- Source implementation.
- CLI command implementation.
- CocoIndex or semantic-search provider planning.
- Runtime execution design beyond ownership boundaries.

# Risks

- Loop scope could become too broad and swallow existing node types.
- Runtime execution details could leak into mdkg public primitives.
- The implementation goal could become executable before design acceptance.

# Links / Artifacts

- `goal-57`
- `edd-66`
- `dec-65`
- `task-667`
- `task-668`
