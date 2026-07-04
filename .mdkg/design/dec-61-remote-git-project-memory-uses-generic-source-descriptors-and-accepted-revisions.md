---
id: dec-61
type: dec
title: remote Git project memory uses generic source descriptors and accepted revisions
status: accepted
tags: [remote-git, project-memory, generic-capability]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-51, task-650, test-338]
aliases: []
created: 2026-07-03
updated: 2026-07-03
---
# Context

`goal-51` separates remote Git/project-memory primitives from the
`mdkg@0.4.1` contract-profile publish lane. The primitive names must be generic
enough for any mdkg consumer, while still giving future implementation work a
concrete data model.

# Decision

Remote Git project memory uses generic source descriptors plus accepted
revision evidence.

A source descriptor identifies where a graph-capable repository or bundle can
be inspected without storing credential material. It may include provider kind,
remote URL or repository id, default branch, optional path filters, visibility
classification, access-ref id, and freshness policy.

An accepted revision is separate evidence that a specific source state was
reviewed or adopted. It may include branch name, commit SHA, tag, tree or bundle
hash, acceptance actor/ref, validation receipt ref, accepted-at timestamp, and
optional successor/rollback refs.

Neither surface is a deployment, runtime, sandbox, queue, room, or product
handoff policy. Those remain downstream consumer-owned.

# Alternatives considered

- Treat remote repositories as product-runtime objects. Rejected because it
  would leak one downstream operating model into mdkg public primitives.
- Store only raw Git URLs and infer all state live. Rejected because mdkg needs
  durable accepted revision evidence and reproducible graph context.
- Put the feature directly into the 0.4.1 release lane. Rejected because 0.4.1
  did not implement or publish these primitives.

# Consequences

- Future mdkg implementation should use neutral names such as source
  descriptor, remote source ref, graph source, accepted revision, revision
  evidence, and validation receipt.
- Public docs and CLI help must avoid product-branded remote-memory primitive
  names.
- Release gates must verify accepted revision evidence without requiring a live
  downstream runtime.

# Links / references

- `goal-51`
- `task-650`
- `test-338`
