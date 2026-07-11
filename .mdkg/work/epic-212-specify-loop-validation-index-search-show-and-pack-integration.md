---
id: epic-212
type: epic
title: Specify loop validation index search show and pack integration
status: todo
priority: 1
tags: [loop, planning, validation, index, pack, search]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Goal

Specify how a future `loop` node participates in validation, indexing, search,
show/list output, pack traversal, graph references, generated docs, and smoke
tests without weakening existing node behavior.

# Scope

- Node parsing and validation requirements.
- Template/scaffold expectations.
- Index/search/show/list output expectations.
- Pack ordering and context safety.
- Graph references between loops and goals/tasks/tests/spikes/proposals.
- Generated command matrix and docs checks.
- Smoke and regression test requirements.

# Milestones

- Audit current surfaces.
- Write integration requirements into `edd-66`.
- Produce implementation-contract tests for discoverability and packability.

# Out of Scope

- Implementing parser/index/pack code in this pass.
- CocoIndex provider integration.
- Changing `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`,
  `DISPUTE.md`, or `PROPOSAL.md` semantics.

# Risks

- New node parsing could break existing graph validation.
- Pack traversal could over-include run history or bulky artifacts.
- Search could confuse loop templates with active scoped loops.

# Links / Artifacts

- `goal-57`
- `task-673`
- `test-345`
