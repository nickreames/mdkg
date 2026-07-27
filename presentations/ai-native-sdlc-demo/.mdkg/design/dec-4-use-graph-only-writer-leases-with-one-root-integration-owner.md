---
id: dec-4
type: dec
title: Use graph-only writer leases with one root integration owner
status: accepted
tags: [ownership, writers, git, integration]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/writer-lease]
relates: []
refs: [prd-1, edd-1]
aliases: [graph-only-writer-lease]
created: 2026-07-26
updated: 2026-07-26
---

# Context

The nested graph reduces planning conflict but shares a Git checkout and index with parallel mdkg work. Graph separation is not filesystem, staging, or history isolation.

# Decision

The program writer owns presentations/ai-native-sdlc-demo/ and uses nested mdkg commands. One root integration owner exclusively performs root mdkg commands, bundle refresh, staging, commits, and pushes.

An executable child goal may own the publication node in its work topology, but only the root integration owner may claim and execute that node's Git mutation. The child implementation writer yields after accepted local/canonical validation; the integration owner then stages and pushes the child-approved allowlist, after which read-only verification resumes. These roles never hold overlapping write leases.

Shared-source phases require a frozen path allowlist, accepted base SHA, explicit quiet window, and no overlapping root writer. Root registration and root Remotion nodes occur only during a serialized root integration window.

# Alternatives Considered

- Dedicated worktree: safer but not selected.
- Uncoordinated path-only writes: rejected because root indexes and Git remain shared.
- One writer for all phases: rejected because isolated nested planning can proceed safely.

# Consequences

Nested authoring can continue alongside unrelated root work. Root mutation, source integration, and publication wait for the integration owner.

# Links / references

- prd-1
- edd-1
