---
id: dec-67
type: dec
title: Make loop dry runs observational and readiness evidence identity scoped
status: accepted
tags: [loop, dry-run, readiness, decision]
owners: []
links: []
artifacts: []
relates: [goal-61, edd-70]
refs: [goal-61, edd-70, goal-58, goal-59, edd-66, edd-69]
aliases: [observational-loop-dry-run-and-identity-scoped-readiness]
created: 2026-07-10
updated: 2026-07-10
---
# Context

Dogfooding found that SQLite `loop fork --dry-run` reserved an ID and that the
readiness projection treated any decision, approval, run, output, evidence, or
waiver ref as satisfying every corresponding requirement. Descriptor-declared
read commands could also persist index state.

# Decision

Loop dry-run and descriptor-declared read operations are observational. They may
compute in memory but cannot reserve IDs or persist graph, DB, event, cache, or
filesystem state.

Readiness is identity-scoped. Each question, approval-gated action, evidence
lane, and waiver has a stable key and is satisfied only by an applicable typed
ref. Optional gated lanes cannot prevent other authorized work. `loop next`
returns blocked only after it has exhausted authorized child and recovery lanes.

Forks retain template identity and source hash. Template drift warns but never
rewrites the fork automatically. Loop remains one node type.

# Alternatives considered

- Declare hidden cache and ID writes as harmless dry-run side effects. Rejected
  because it violates operator expectations and descriptor truth.
- Keep aggregate readiness booleans and document their coarseness. Rejected
  because unrelated evidence can authorize or close the wrong lane.
- Automatically refresh stale forks. Rejected because it destroys scoped
  provenance and can change an approved process without review.

# Consequences

- SQLite allocation must support a non-reserving preview path.
- Loop read commands need a non-persisting index projection.
- Metadata validation and readiness output must preserve stable requirement
  identities and typed evidence mappings.
- Stale provenance becomes additive inspection output.
- New backend, packaged-consumer, routing, and regression tests are mandatory.

# Links / references

- `edd-70`
- `goal-61`
- `task-702` through `task-709`
