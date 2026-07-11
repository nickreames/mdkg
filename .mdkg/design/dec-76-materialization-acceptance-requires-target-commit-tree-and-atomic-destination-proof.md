---
id: dec-76
type: dec
title: materialization acceptance requires target commit tree and atomic destination proof
status: accepted
tags: [git, accepted-revision, atomicity, containment]
owners: []
links: []
artifacts: []
relates: [goal-66]
refs: [edd-73, dec-61]
aliases: [accepted-materialization-proof]
created: 2026-07-11
updated: 2026-07-11
---

# Context

An observed post-clone HEAD is insufficient when an agent or orchestrator must
prove it consumed an explicitly accepted source revision.

# Decision

Every v1 request supplies a full target ref and expected commit. Expected tree
is optional generically and mandatory only when a consumer profile requires
it. mdkg resolves the target, verifies commit equality, verifies tree equality
when supplied, records Git object format, and accepts the destination only by
renaming a fully verified sibling temporary tree.

Existing destinations are never overwritten or repaired. Failure or
cancellation leaves no accepted destination and removes bounded temporary
state.

# Alternatives considered

- Trust target branch names. Rejected because refs can move.
- Clone directly into the destination and report mismatch later. Rejected
  because partial state can be mistaken for accepted state.

# Consequences

Tests must cover moved/missing refs, commit/tree mismatch, SHA-1 and SHA-256
object formats, existing targets, symlink ancestry, cancellation, and atomic
publication.

# Links / references

- `edd-73`
- `goal-66`
