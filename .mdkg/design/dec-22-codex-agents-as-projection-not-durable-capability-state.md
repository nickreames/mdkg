---
id: dec-22
type: dec
title: Codex agents as projection not durable capability state
status: accepted
tags: [codex, agents, projection, spec]
owners: []
links: []
artifacts: []
relates: [epic-42, epic-43, edd-14]
refs: [dec-21]
aliases: [codex-projection-only, codex-agent-projection-doctrine]
created: 2026-06-04
updated: 2026-06-04
---
# Context

Codex custom agents are useful for project-scoped spawned sessions, but they
are not the Omni source of truth.

# Decision

`.codex/agents` files are Codex-specific projections. They should be validated
against accepted Codex requirements, but durable role, capability, resource,
forbidden-action, and evidence contracts belong in `SPEC.md` and mdkg nodes.

# Alternatives considered

- Treat Codex TOML as durable source. Rejected because it is product-specific
  and may evolve independently of Omni capability semantics.

# Consequences

- Projection TOML must not silently become canonical capability state.
- Each Codex profile should link back to a SPEC source.
- Missing projection fields become repair tasks, not hidden runtime behavior.

# Links / references

- `dec-21`
- `edd-14`
