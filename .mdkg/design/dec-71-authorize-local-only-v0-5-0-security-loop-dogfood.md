---
id: dec-71
type: dec
title: Authorize local-only v0.5.0 security loop dogfood
status: accepted
tags: [loop, dogfood, security, approval]
owners: []
links: []
artifacts: []
relates: [loop-5]
refs: [goal-61, task-688, goal-64]
aliases: []
created: 2026-07-10
updated: 2026-07-10
---
# Context

`loop-5` is the corrected security-loop dogfood run for `goal-61`. Its template
requires explicit answers before execution and separates low-risk local audit
work from registry advisory calls and Codex Security/provider workflows.

# Decision

Answer the `loop-5` pre-run identities as follows:

- `external_advisory_checks_approved`: no for this dogfood run. Current registry
  advisory calls remain approval-gated and are deferred to `task-688` / `goal-64`.
- `security_provider_workflow_approved`: no for this dogfood run. The formal
  provider-backed repository scan remains part of the final pre-publish gate.
- `local_cache_writes_approved`: yes. Local tests, builds, package inspection,
  and static checks may write caches or generated outputs.
- `audit_scope`: the mdkg root repository, package payload, public sites/docs,
  graph export surfaces, and current v0.5.0 loop changes, local-only.

Accept a typed waiver for the `dependency_advisories` evidence lane in
`loop-5`, because current external advisory data cannot be claimed without the
separate approval-gated call. This waiver is limited to the dogfood loop and
does not waive the final release requirement in `goal-64`.

# Alternatives considered

- Run external advisory and provider workflows now: rejected because the loop
  did not receive that explicit pre-run authorization.
- Leave the entire loop blocked on those calls: rejected because every local
  security lane remains authorized and useful.
- Complete local lanes and use a typed, release-bounded waiver: selected because
  it preserves truthful evidence and keeps the final gate intact.

# Consequences

- `loop-5` can exhaust local source, secret-exposure, public-exposure, package
  export, and finding-triage lanes.
- The external advisory lane must bind this decision plus explicit approval
  evidence by stable identity.
- `task-688` and `goal-64` remain mandatory before npm publication.

# Links / references

- `loop-5`
- `goal-61`
- `task-688`
- `goal-64`
