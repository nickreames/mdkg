---
id: task-820
type: task
title: Implement versioned graph identity and legacy migration planning
status: todo
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, implementation-unapproved]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-819]
blocks: []
refs: [edd-81, dec-93, test-151, goal-18]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Implement the versioned format and immutable identity foundation, including
explicit legacy migration preview/application in disposable fixtures. Unclaimed;
no migration of this checkout or any consuming graph is authorized.

# Acceptance Criteria

- Freeze and document format-manifest fields, stable selector syntax, identity
  encoding and compatibility matrix before wiring command consumers.
- Separate graph/node identity from aliases, package/config/cache versions.
- New independent nodes allocate offline-safe identities; aliases remain readable.
- Legacy migration uses accepted-ancestor maps; divergent new nodes cannot acquire
  one shared identity simply because their numeric alias matches.
- Preview is repeatable and observational; applied mapping is durable authored
  evidence and can be resumed/recovered within exact approved paths.
- Legacy v1 reads work. Unsupported future formats reject writes with diagnostics.
- Graph transport distinguishes same-project branches from independent project
  forks and template import; mounted subgraphs remain read-only.

# Files Affected

Future parser/types/schema, graph loading, migration helpers, transport contracts
and focused compatibility fixtures. Generated SQLite is never canonical identity.

# Implementation Notes

Follow edd-81 defaults. Stable migration namespace/origin evidence must be explicit
where a graph lacks identity. No hidden migration on new/index/read/pack/upgrade.
Mixed legacy/v2 state requires diagnostics and a supported transition boundary,
not silent conversion. Migration publication/adoption remains a separate gate.

# Test Plan

Accepted common ancestor and divergent legacy clones, duplicated aliases,
cross-linked additions, repeated preview/apply, interrupted recovery, unsupported
manifest, graph-ID mismatch, template import and frozen v1 fixtures. test-151 and
test-475 own verification; source algorithm completion does not migrate this repo.

# Links / Artifacts

- edd-81, goal-18, test-151, goal-82; proof pending.
