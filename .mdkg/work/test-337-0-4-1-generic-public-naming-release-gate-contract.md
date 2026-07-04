---
id: test-337
type: test
title: 0.4.1 generic public naming release gate contract
status: done
priority: 1
parent: goal-50
tags: [0.4.1, contract-profile, naming-audit, publish-readiness, consumer-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-649]
blocks: [task-645]
refs: [goal-50, task-649, task-645, task-647, task-648, test-336, task-636]
context_refs: [goal-51, task-650, test-338]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Validate that `mdkg@0.4.1` cannot move into final prepublish/publish readiness
until public release claims describe only generic mdkg capabilities.

# Target / Scope

- `goal-50`
- `task-649`
- `task-645`
- `task-647`
- `task-648`
- `test-336`

# Preconditions / Environment

- `task-649` has audited the active release/publish/readiness work nodes.
- `goal-49` implementation readiness remains historical input, not a public
  claim that product-specific runtime policy is mdkg behavior.

# Test Cases

- Active release/publish work nodes use generic names for mdkg public
  primitives: external/source descriptors, accepted revision evidence,
  validation/evidence policy refs, receipt/redaction metadata, and profile
  validation.
- Final prepublish gates include a naming audit before npm pack/publish
  dry-runs.
- Postpublish probes validate generic CLI/template/schema/validator behavior
  from the installed package.
- Consumer handoff language is generic or downstream-private and does not brand
  product-specific runtime policy as public mdkg behavior.
- Historical/internal downstream mentions remain allowed only when clearly
  prior context, private handoff context, or downstream-owned policy.
- Remote Git repositories, authenticated Git access refs, `.mdkg` graph
  discovery, accepted revisions, history/why/next-work queries, and agent
  working-loop primitives are allowed only as generic mdkg successor planning
  references, not as 0.4.1 publish-bound claims.

# Results / Evidence

Pending.

# Notes / Follow-ups

- This test is a graph/readiness gate. It does not authorize source/docs/package
  changes, real npm publish, tags, pushes, deploys, DNS, provider mutations, or
  downstream repo mutation.
- Successor planning for remote Git/project-memory primitives lives in
  `goal-51` / `task-650` / `test-338`.
