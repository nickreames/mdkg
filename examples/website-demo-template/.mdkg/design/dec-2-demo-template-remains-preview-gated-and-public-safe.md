---
id: dec-2
type: dec
title: Demo template remains caller gated and public safe
status: accepted
tags: [demo, authority, boundary, no-secret]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1, prd-2]
aliases: []
created: 2026-06-29
updated: 2026-07-26
---
# Context

The template is designed to generate reviewable website candidates, but Git
integration, publication, and provider operations belong to the invoking
workflow.

# Decision

Keep the template local-first and public-safe by default. The template may hand
an accepted candidate back to its caller, but it must not integrate, commit,
deploy, change DNS, activate analytics, publish packages, push commits, or
promote durable hosting on its own.

# Alternatives considered

- Deploy directly from the template: rejected because it would blur authority and
  provider boundaries.
- Store deployment credentials in the template: rejected because mdkg evidence
  must not contain secrets.

# Consequences

- Generated candidates can be reviewed safely.
- The caller must grant a separate, explicit authority gate for integration,
  commit, push, deployment, and public verification.
- A fork remains portable because it does not name a parent goal, hosting
  provider, domain, or repository-specific publication workflow.

# Links / references

- `goal-1`
- `prd-2`
- `test-1`
