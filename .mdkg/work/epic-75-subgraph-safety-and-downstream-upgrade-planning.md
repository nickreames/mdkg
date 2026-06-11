---
id: epic-75
type: epic
title: subgraph safety and downstream upgrade planning
status: done
priority: 1
tags: [subgraph, audit, upgrade-plan, 0-3-4, 0-3-5]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-329]
refs: [epic-68]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Bridge the existing paused `goal-12`/`epic-68` subgraph roadmap into the
`goal-13` hardening train without making the old goal itself an actionable
scope node.

# Scope

- Audit and harden existing `subgraph sync` and `subgraph materialize`.
- Design native `subgraph audit` and `subgraph upgrade-plan` JSON contracts.
- Prove no-cross-repo-mutation safety and downstream upgrade planning receipts.

# Milestones

- `0.3.4`: subgraph sync/materialize hardening.
- `0.3.5`: subgraph audit, upgrade-plan, and downstream planning contracts.

# Out of Scope

- Mutating child repos.
- Reintroducing sync/materialize as brand-new surfaces.

# Risks

- Accidentally treating materialized child graph files as source graph state.

# Links / Artifacts

- `task-329`
- `chk-111`
- `epic-68`

# Closeout Evidence

- `mdkg subgraph audit` and `mdkg subgraph upgrade-plan` are implemented as
  read-only operator surfaces.
- Existing `subgraph sync` and `subgraph materialize` remain the only
  mutation-capable subgraph refresh/inspection-tree boundaries.
- Temp-repo unit tests and packed `smoke:subgraph` cover audit, upgrade-plan,
  dirty child repo blocking, stale bundle planning, materialize marker safety,
  no child mutation, and read-only subgraph qid behavior.
