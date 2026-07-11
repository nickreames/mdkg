---
id: dec-79
type: dec
title: linked upgrades use explicit strict preflight with no Git side effects
status: accepted
tags: [upgrade, subgraph, multi-repo, safety]
owners: []
links: []
artifacts: []
relates: [goal-68]
refs: [edd-73, goal-60]
aliases: [linked-upgrade-safety-contract]
created: 2026-07-11
updated: 2026-07-11
---

# Context

`mdkg upgrade` currently applies one repository's managed scaffold. Registered
subgraphs are read-only planning projections, while their configured local
`source_path` repositories may still be explicit operator-selected upgrade
targets.

# Decision

Add an explicit `--linked` mode in a later goal. It selects the root plus
enabled registered subgraphs with contained local `source_path` values.
Repeatable `--include` adds contained unregistered mdkg repositories;
repeatable `--exclude` wins over linked discovery. `.gitmodules` never grants
write scope.

Apply performs all-target dry-run first and writes nothing unless every target
is safe and planned writes do not overlap dirty paths. Unrelated dirtiness is
preserved. Unexpected apply-time failure stops remaining targets and reports
partial completion; no cross-repository rollback occurs.

The command never installs mdkg, stages, commits, pushes, registers subgraphs,
refreshes bundles, or changes gitlinks.

# Alternatives considered

- Best-effort apply. Rejected because a routine scaffold upgrade should not
  silently produce an intentionally mixed target set.
- Discover every Git submodule. Rejected because Git linkage is not mdkg write
  authorization.

# Consequences

The existing single-repo command remains default. Root orchestrators retain
commit and subgraph-refresh ownership after linked upgrade receipts pass.

# Links / references

- `edd-73`
- `goal-68`
