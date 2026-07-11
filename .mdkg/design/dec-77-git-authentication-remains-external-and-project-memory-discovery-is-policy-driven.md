---
id: dec-77
type: dec
title: Git authentication remains external and project memory discovery is policy driven
status: accepted
tags: [git, authentication, project-memory, redaction]
owners: []
links: []
artifacts: []
relates: [goal-66]
refs: [edd-73, dec-64]
aliases: [materialization-auth-discovery-policy]
created: 2026-07-11
updated: 2026-07-11
---

# Context

Materialization must support authenticated Git without turning durable project
memory or receipts into a credential store. Not every Git source is required
to contain mdkg project memory.

# Decision

System Git remains the execution backend. Requests contain an opaque
`access_ref` plus a declared capability class. mdkg may report bounded
availability for unauthenticated, `gh`, SSH-agent, credential-helper, or
environment-mediated access, but it never stores or prints secret values,
helper output, or socket paths.

Project-memory discovery is `required`, `optional`, or `forbidden`, defaulting
to `optional`. Required demands `.mdkg/config.json` and passing non-mutating
validation. Optional accepts absence but rejects malformed discovered memory.
Forbidden rejects any `.mdkg` directory.

# Alternatives considered

- Resolve PATs or keys inside mdkg. Rejected because durable graph tooling is
  not a secret broker.
- Require `.mdkg` in every Git source. Rejected because generic materialization
  must also support ordinary source repositories.

# Consequences

Receipts use refs, booleans, hashes, and bounded reason codes only. Discovery
must not index, execute hooks, run repository scripts, or retain repository
content.

# Links / references

- `edd-73`
- `dec-64`
- `goal-66`
