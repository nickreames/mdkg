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

Keep the template local-first and public-safe by default. Author the complete
integration-to-production topology so a caller does not rewrite the child
graph, but treat every shared-source, Git, and provider step as inert until a
separate matching external authority receipt is present.

The semantic source release and run binding never grant authority. A child may
consume only hash-addressed caller receipts and must fail closed on missing,
expired, or drifted identity. Force push, history rewrite, DNS, provider
configuration, manual redeploy, analytics, package publication, credentials,
and unrelated integration remain forbidden.

# Alternatives considered

- Deploy directly from the template: rejected because it would blur authority and
  provider boundaries.
- Store deployment credentials in the template: rejected because mdkg evidence
  must not contain secrets.

# Consequences

- Generated candidates can be reviewed safely.
- The caller must grant separate explicit leases/authority for integration,
  commit, normal non-force push, and provider visibility.
- A fork remains portable because it does not name a parent goal, hosting
  provider, domain, or repository-specific publication workflow.
- The run binding records bounded identity and routes but contains no approval,
  origin state, lease, credentials, or provider payload.

# Links / references

- `goal-1`
- `prd-2`
- `test-1`
