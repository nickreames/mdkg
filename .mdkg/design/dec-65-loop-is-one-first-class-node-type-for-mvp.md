---
id: dec-65
type: dec
title: Loop is one first-class node type for MVP
status: accepted
tags: [loop, node-type, mvp, decision, agent-harness]
owners: []
links: []
artifacts: []
relates: [goal-57, goal-58]
refs: [edd-66, edd-10, edd-63, goal-53, goal-57, goal-58]
aliases: [one-loop-node-type, loop-node-mvp]
created: 2026-07-05
updated: 2026-07-05
---
# Context

mdkg already has durable goals for outcome-oriented recursive work. The proposed
`loop` node serves a different purpose: reusable, inspectable agentic process
state that can coordinate multiple goals, contain linked subnodes, preserve
lineage, and continue making useful progress when one branch is blocked.

The first implementation needs a clean MVP boundary. Splitting the model into
`loop_template`, `loop_run`, and related node types too early would make the CLI,
validation, pack ordering, and migration story harder before real usage proves
the necessary low-level fields.

# Decision

For MVP, `loop` is one first-class mdkg node type.

A loop may act as:

- a reusable template;
- a scoped fork derived from a template;
- a run-bearing loop with linked evidence, attempts, checkpoints, receipts,
  events, and outputs.

Those modes should be expressed through metadata and links, not separate node
types in the first implementation. The implementation may still use existing
node types such as task, test, spike, checkpoint, receipt, proposal, decision,
and goal as linked subnodes.

Accepted for the mdkg-only planning lane on 2026-07-05 after source-surface
audit confirmed that a single new node type plus metadata/links is the least
risky MVP boundary for parser, template, validation, pack, and CLI work.

# Alternatives Considered

- Add separate `loop_template` and `loop_run` node types immediately. Rejected
  for MVP because it would lock the schema before planning and dogfooding
  clarify the minimum fields.
- Treat loops as goals with stronger skill instructions. Rejected because loops
  need reusable process identity, template lineage, fork behavior, recursive
  linked work, and blocker-continuation semantics that exceed goal's
  outcome-oriented role.
- Treat loops as runtime jobs only. Rejected because mdkg should preserve why a
  loop exists, what it learned, and how it relates to durable project graph
  state.

# Consequences

- `goal` remains outcome-oriented.
- `loop` becomes process-oriented and graph-native.
- Seeded reusable loops can ship as mdkg-owned templates without becoming
  executable runtime jobs.
- `mdkg loop fork` should default to child-node materialization while preserving
  template lineage.
- Future implementation must be careful to avoid weakening existing validation,
  search, pack, and goal semantics.

# Links / References

- `goal-57`
- `goal-58`
- `edd-66`
- `edd-10`
- `edd-63`
- `goal-53`
