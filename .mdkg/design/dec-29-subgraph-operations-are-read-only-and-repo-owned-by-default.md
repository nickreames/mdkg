---
id: dec-29
type: dec
title: subgraph operations are read-only and repo-owned by default
status: accepted
tags: [subgraph, audit, upgrade-plan, repo-owned, no-cross-repo-mutation]
owners: []
links: []
artifacts: []
relates: [edd-16, goal-12]
refs: [edd-16]
aliases: [repo-owned-subgraph-operations, no-cross-repo-subgraph-mutation, read-only-subgraph-audit]
created: 2026-06-07
updated: 2026-06-07
---
# Context

Downstream orchestrator repos need better subgraph audit and upgrade planning
commands, but mdkg must not encourage root workspaces to silently mutate child
repositories.

# Decision

Native subgraph operations start read-only. Audit and upgrade-plan commands may
produce deterministic JSON, work recommendations, and refresh prerequisites, but
they do not apply child graph/source changes, commit child repos, push child
branches, or refresh root bundles without explicit accepted evidence.

# Alternatives considered

- Combine audit, upgrade, and refresh into one command. Rejected because it
  would collapse important ownership and approval boundaries.
- Make root workspaces responsible for child upgrades. Rejected because child
  repositories own their graph/source history.

# Consequences

- Downstream orchestration remains safer and more explicit.
- More evidence is required before a refresh.
- Future automation can still be built on top of deterministic audit and plan
  output.

# Links / references

- `edd-16`
- `goal-12`
