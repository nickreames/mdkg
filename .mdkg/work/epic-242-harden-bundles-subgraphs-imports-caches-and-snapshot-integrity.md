---
id: epic-242
type: epic
title: Harden bundles subgraphs imports caches and snapshot integrity
status: todo
priority: 1
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Goal

Make transported and derived graph state prove its schema, identity, integrity,
visibility, and canonical-source relationship before it can influence trusted
filesystem, pack, snapshot, or materializer operations.

# Scope

- Bundle manifest/profile runtime schemas and expected-profile enforcement.
- Import ID validation and subgraph required-index binding.
- Cache body-path and public visibility revalidation.
- Snapshot queue/runtime-hash checks and project/branch writer boundaries.

# Milestones

- `task-766`: manifests, profiles, indexes, and import identities.
- `task-767`: cache/body visibility and projection authority.
- `task-768`: project DB, snapshot, and materializer invariants.
- `test-427` and `test-428`: fail-closed and confidentiality proof.

# Out of Scope

- Cryptographic publisher identity or remote artifact signing infrastructure.
- Making JSON or SQLite derived indexes canonical source of truth.

# Risks

- Self-consistent untrusted manifests can pass hash checks without proving policy.
- Rebuilding stale state during read-only operations can reintroduce mutation.
- Integrity checks must preserve deterministic package and fixture behavior.

# Links / Artifacts

- `goal-69`, `edd-75`, `dec-80`
- `task-766` through `task-768`
- `test-427`, `test-428`
