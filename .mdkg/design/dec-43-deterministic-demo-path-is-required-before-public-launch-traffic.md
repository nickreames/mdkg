---
id: dec-43
type: dec
title: deterministic demo path is required before public launch traffic
status: accepted
tags: [mdkg-dev, demo, launch-boundary]
owners: []
links: []
artifacts: []
relates: [goal-34, task-539]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

The audit identifies completeness and developer trust as blocked by examples that require users to invent graph state or interpret placeholder IDs.

# Decision

Before mdkg.dev is treated as ready for cold public traffic, it must include a deterministic demo or first-success path with expected outputs and passing validation.

# Alternatives considered

- Keep conceptual demo docs only.
- Provide a tiny known demo graph/fixture plus expected outputs.

# Consequences

- New users can prove mdkg works without already understanding the model.
- Docs examples can be validated against the demo fixture.
- Demo promotion and demo subdomains remain noindex/deferred until explicitly launched.

# Links / references

- `goal-34`
- `task-539`
- `task-532`
- `task-533`
