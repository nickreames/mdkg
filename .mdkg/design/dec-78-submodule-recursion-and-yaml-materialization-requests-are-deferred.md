---
id: dec-78
type: dec
title: submodule recursion and YAML materialization requests are deferred
status: accepted
tags: [git, submodule, yaml, deferral]
owners: []
links: []
artifacts: []
relates: [goal-66, task-752]
refs: [edd-73, dec-75]
aliases: [materialization-v1-deferrals]
created: 2026-07-11
updated: 2026-07-11
---

# Context

Recursive submodules expand authentication, revision, containment, and receipt
scope. YAML adds another parser and canonicalization surface. Neither is needed
to unblock the first generic consumer.

# Decision

V1 supports submodule policies `deny` and `ignore`. Deny rejects either
`.gitmodules` or gitlink entries. Ignore leaves gitlinks uninitialized and
reports bounded identity/count evidence. Recursive initialization is deferred.

V1 request input is JSON only. YAML support is recorded in `task-752` and does
not block implementation or publication.

# Alternatives considered

- Implement recursive submodules immediately. Rejected due to unnecessary
  security and auth expansion.
- Accept JSON and YAML together. Rejected to keep the first wire contract
  deterministic and package-light.

# Consequences

Help and validation must reject unsupported policy values and YAML input with
actionable bounded guidance.

# Links / references

- `edd-73`
- `goal-66`
- `task-752`
